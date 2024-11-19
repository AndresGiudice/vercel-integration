import clientPromise from "../../lib/mongodb";

export default async function handler(request, response) {
  try {
    const client = await clientPromise;
    const db = client.db('list');
    const collection = db.collection('AllPrices');

    const orderKraft = ["B00K0", "BG0K0", "B1AK0", "BG1K0", "BG1KG", "BG2K0", "BG3K0", "BG4K0", "BG5K0", "BG7K0", "BBK00", "BBCK0", "BDBK0", "B8AK0", "BG8K0", "BG9K0", "B10K0", "B11K0"];
    const orderBlancas = ["B00B0", "BG0B0", "B1AB0", "BG1B0", "BG1BG", "BG2B0", "BG3B0", "BG4B0", "BG5B0", "BG7B0", "BBB00", "BG8B0", "B11B0"];

    const resultsKraft = await collection.aggregate([
      {
        $match: {
          Agru1: "BO",
          Agru2: "EVA",
          Agru3: "KR",
          systemCode: { $in: orderKraft }
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
          orderIndex: { $indexOfArray: [orderKraft, "$_id"] }
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

    const resultsBlancas = await collection.aggregate([
      {
        $match: {
          Agru1: "BO",
          Agru2: "EVA",
          Agru3: "BL",
          systemCode: { $in: orderBlancas }
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
          orderIndex: { $indexOfArray: [orderBlancas, "$_id"] }
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

    response.status(200).json({ kraft: resultsKraft, blancas: resultsBlancas });
  } catch (e) {
    console.error(e);
    response.status(500).json(e);
  }
}