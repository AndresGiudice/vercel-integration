import clientPromise from "../../lib/mongodb";

export default async function handler(request, response) {
  try {
    const client = await clientPromise;
    const db = client.db('list4');
    const collection = db.collection('KPBagHandles');

    const order = [
      "00", "0", "1A", "G1", "G1L", "G2", "G3", "G4", "G5", "G7", "B", "BC", "DB", "8A", "8", "9", "10", "11"
    ];

    const results = await collection.aggregate([
      {
        $addFields: {
          orderIndex: {
            $indexOfArray: [order, "$code"]
          }
        }
      },
      {
        $sort: { orderIndex: 1 }
      },
      {
        $project: {
          code: 1,
          price: 1,
          width: 1,
          height: 1,
          depth: 1,
          description: 1,
        }
      }
    ]).toArray();

    response.status(200).json(results);
  } catch (e) {
    console.error(e);
    response.status(500).json(e);
  }
}