import clientPromise from "../../lib/mongodb";

export default async function handler(request, response) {
  try {
    const client = await clientPromise;
    const db = client.db('list');
    const collection = db.collection('AllPrices');

    const results = await collection.find({
      Agru1: "BO",
      Agru2: "EVA",
      Agru3: "KR"
    }).project({
      systemCode: 1,
      description: 1,
      list4: 1
    }).toArray();

    response.status(200).json(results);
  } catch (e) {
    console.error(e);
    response.status(500).json(e);
  }
}