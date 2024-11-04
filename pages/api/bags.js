import { connectToDatabase } from "../../lib/connectToDatabase";

export default async function handler(request, response) {
  try {
    const { mongoClient } = await connectToDatabase();
    const db = mongoClient.db("list4");   
    const kpBagHandlesCollection = db.collection("KPBagHandles");
    const wpBagHandlesCollection = db.collection("WPBagHandles");
    const cpBagHandlesCollection = db.collection("CPBagHandles");
    const kpBagHandles = await kpBagHandlesCollection.find({}).toArray();
    const wpBagHandles = await wpBagHandlesCollection.find({}).toArray();
    const cpBagHandles = await cpBagHandlesCollection.find({}).toArray();

    response.status(200).json({ 
      kpBagHandles: kpBagHandles, 
      wpBagHandles: wpBagHandles,
      cpBagHandles: cpBagHandles,
    });

  } catch (e) {
    console.error(e);
    response.status(500).json(e);
  }
}