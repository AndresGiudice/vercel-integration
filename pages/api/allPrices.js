import clientPromise from "../../lib/mongodb";

export default async function handler(request, response) {
  try {
    const client = await clientPromise;
    const db = client.db('list');
    const collection = db.collection('AllPrices');

    const order = ["B00K0", "BG0K0", "B1AK0", "BG1K0", "BG1KG", "BG2K0", "BG3K0", "BG4K0", "BG5K0", "BG7K0", "BBK00", "BBCK0", "BDBK0", "B8AK0", "BG8K0", "BG9K0", "B10K0", "B11K0"];

    const results = await collection.aggregate([
      {
        $match: {
          Agru1: "BO",
          Agru2: "EVA",
          Agru3: "KR",
          systemCode: { $in: order }
        }
      },
      {
        $group: {
          _id: "$systemCode",
          description: { $first: "$description" },
          list4: { $first: "$list4" }
        }
      },
      {
        $addFields: {
          systemCode: "$_id",
          orderIndex: { $indexOfArray: [order, "$_id"] }
        }
      },
      {
        $sort: { orderIndex: 1 }
      },
      {
        $project: {
          _id: 0,
          systemCode: 1,
          description: 1,
          list4: 1
        }
      }
    ]).toArray();

    response.status(200).json(results);
  } catch (e) {
    console.error(e);
    response.status(500).json(e);
  }
}