import clientPromise from "../../lib/mongodb";

export default async function handler(request, response) {
  try {
    const client = await clientPromise;
    const db = client.db('list');
    const collection = db.collection('AllPrices');

    const orderKraft = ["B00K0", "BG0K0", "B1AK0", "BG1K0", "BG1KG", "BG2K0", "BG3K0", "BG4K0", "BG5K0", "BG7K0", "BBK00", "BBCK0", "BDBK0", "B8AK0", "BG8K0", "BG9K0", "B10K0", "B11K0"];
    const orderBlancas = ["B00B0", "BG0B0", "B1AB0", "BG1B0", "BG1BG", "BG2B0", "BG3B0", "BG4B0", "BG5B0", "BG7B0", "BBB00", "BG8B0", "B11B0"];
    const orderPA = ["BG1P001", "BG1P002", "BG1P003", "BG1P004", "BG1P00S", "BG3P001", "BG3P002", "BG3P003", "BG3P004", "BG3P00S", "BG5P001", "BG5P002", "BG5P003", "BG5P004", "BG5P00S"];

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
          additionalDescription: { $first: "$additionalDescription" },
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
          additionalDescription: 1,
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
          additionalDescription: { $first: "$additionalDescription" },
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
          additionalDescription: 1,
          list4: 1
        }
      }
    ]).toArray();

    const resultsPA = await collection.aggregate([
      {
        $match: {
          Agru1: "BO",
          Agru2: "EVA",
          Agru3: "PA",
          systemCode: { $in: orderPA }
        }
      },
      {
        $group: {
          _id: "$systemCode",
          description: { $first: "$description" },
          additionalDescription: { $first: "$additionalDescription" },
          list4: { $first: "$list4" }
        }
      },
      {
        $project: {
          _id: 0,
          systemCode: 1,
          description: 1,
          additionalDescription: 1,
          list4: 1
        }
      }
    ]).toArray();

    response.status(200).json({ kraft: resultsKraft, blancas: resultsBlancas, pa: resultsPA });
  } catch (e) {
    console.error(e);
    response.status(500).json(e);
  }
}