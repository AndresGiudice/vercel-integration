import { connectToDatabase } from "../../lib/connectToDatabase";

export default async function handler(request, response) {
  try {
    const { mongoClient } = await connectToDatabase();
    const db = mongoClient.db("list");
    const allPricesCollection = db.collection("AllPrices");
    const KPBagHandlesList4Final = await allPricesCollection.find({
      Agru1: "BO",
      Agru2: "EVA",
      Agru3: "KR"
    }).project({
      systemCode: 1,
      description: 1,
      list4: 1
    }).toArray();

    response.status(200).json({ 
        KPBagHandlesList4Final: KPBagHandlesList4Final
    });

  } catch (e) {
    console.error(e);
    response.status(500).json(e);
  }
}