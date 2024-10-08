import { connectToDatabase } from "../../lib/connectToDatabase";

export default async function handler(request, response) {
    try{
        const {mongoClient} = await connectToDatabase();
        const db = mongoClient.db('sample_mflix');
        const collection = db.collection('movies');    
        const results = await collection
        .find({})
        .project({
           title:1,
           _id: 0
        })
        .limit(8)
        .toArray();
        response.status(200).json(results);
    }catch(e){
        console.error(e);
        response.status(500).json(e);
    }
}