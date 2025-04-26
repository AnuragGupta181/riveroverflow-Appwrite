import { IndexType, Permission } from "node-appwrite";
import { db, questionCollection } from "../name";
import { databases } from "./config";

export default async function createQuestionCollection() {
    // Create the collection
    await databases.createCollection(db, questionCollection, questionCollection, [
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ]);
    console.log("Question collection created");

    // Create attributes
    await Promise.all([
        databases.createStringAttribute(db, questionCollection, "title", 5000, true),
        databases.createStringAttribute(db, questionCollection, "content", 5000, true),
        databases.createStringAttribute(db, questionCollection, "authorId", 50, true),
        databases.createStringAttribute(db, questionCollection, "tags", 50, true, undefined, true),
        databases.createStringAttribute(db, questionCollection, "attachmentId", 50, false),
    ]);
    console.log("Question attributes created");

    // Wait for attributes to become available
    let attributesReady = false;
    while (!attributesReady) {
        const collection = await databases.getCollection(db, questionCollection);
        const attributes = collection.attributes;

        attributesReady = 
            !!attributes?.find(attr => attr.key === "title" && attr.status === "available") &&
            !!attributes?.find(attr => attr.key === "content" && attr.status === "available") &&
            !!attributes?.find(attr => attr.key === "authorId" && attr.status === "available") &&
            !!attributes?.find(attr => attr.key === "tags" && attr.status === "available") &&
            !!attributes?.find(attr => attr.key === "attachmentId" && attr.status === "available");

        if (!attributesReady) {
            console.log("Waiting for attributes to be available...");
            await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 second
        }
    }
    console.log("All attributes are now available!");

    // Create indexes
    await Promise.all([
        databases.createIndex(db, questionCollection, "title", IndexType.Fulltext, ["title"], ['asc']),
        databases.createIndex(db, questionCollection, "content", IndexType.Fulltext, ["content"], ['asc']),
    ]);
    console.log("Question indexes created");
}
