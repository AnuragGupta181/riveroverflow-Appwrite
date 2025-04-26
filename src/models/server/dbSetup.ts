import {db} from "../name";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./question.collection";
import { databases } from "./config";

export default async function getOrCreatedDB(){
    try{
        await databases.get(db)
        console.log("Database connection")
    } catch(error){
        try {
            await databases.create(db,db)
            console.log("Database created")

            await Promise.all([
                createQuestionCollection(),
                createAnswerCollection(),
                createCommentCollection(),
                createVoteCollection(),
            ])
            console.log("Collection created")
            console.log("Database connected")
        } catch (error) {
            console.log ("Eror creating databases or collection")
        }
    }
    return databases
}