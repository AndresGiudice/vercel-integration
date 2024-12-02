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
        $addFields: {
          systemCode: "$_id"
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

    const resultsFb3x100 = await collection.aggregate([
      {
        $match: {
          $or: [
            { description: "Bolsa Fast Food FB3 Pleno x 100 u." },
            { systemCode: { $in: ["BFM301", "BFB301"] } }
          ],
          additionalDescription: { $nin: ["Lila Pastel", "Amarillo Pastel"] }
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

    const resultsFantFb3x100 = await collection.aggregate([
      {
        $match: {
          $or: [
            { description: "Bolsa Fast Food FB3 Fantasía x 100 u." }
          ],
          additionalDescription: { $nin: ["Candy", "Carreras", "Cuadrados Negros", "Deportes", "Emoji", "Unicornio"] }
        }
      },
      {
        $addFields: {
          list4: { $multiply: ["$list4", 0.6] }
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

    const resultsFb3x10 = await collection.aggregate([
      {
        $match: {
          $or: [
            { description: "BOLSA FAST FOOD FB3 PLENO X 10 U." },
            { systemCode: { $in: ["BFM3P10", "BFB3P10"] } }
          ],
          additionalDescription: { $nin: ["Lila Pastel", "Amarillo Pastel"] }
        }
      },
      {
        $addFields: {
          list4: { $multiply: ["$list4", 10] }
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

    const resultsFm = await collection.aggregate([
      {
        $match: {
          $or: [
            { systemCode: { $in: ["BFM501", "BFM901", "BFM101"] } }
          ]
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

    const resultsBaKr = await collection.aggregate([
      {
        $match: {
          $or: [
            { systemCode: { $in: ["BAK2", "BAK3", "BAK4", "BAK4A", "BAK5", "BAK6", "BAK6L", "BAK7" ] } }

          ]
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

    const resultsBaSu = await collection.aggregate([
      {
        $match: {
          $or: [
            { systemCode: { $in: ["BAS3", "BAS4", "BAS4A", "BAS5", "BAS6", "BAS6L", "BAS7" ] } }
          ]
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



    // Log systemCode for each result
    resultsKraft.forEach(item => console.log(item.systemCode));
    resultsBlancas.forEach(item => console.log(item.systemCode));
    resultsPA.forEach(item => console.log(item.systemCode));
    resultsFb3x100.forEach(item => console.log(item.systemCode));
    resultsFantFb3x100.forEach(item => console.log(item.systemCode));
    resultsFb3x10.forEach(item => console.log(item.systemCode));
    resultsFm.forEach(item => console.log(item.systemCode));
    resultsBaKr.forEach(item => console.log(item.systemCode));
    resultsBaSu.forEach(item => console.log(item.systemCode));

    response.status(200).json({ kraft: resultsKraft, blancas: resultsBlancas, pa: resultsPA, fb3x100: resultsFb3x100, fantFb3x100: resultsFantFb3x100, fb3x10: resultsFb3x10, fm : resultsFm, baKr : resultsBaKr, baSu : resultsBaSu});
  } catch (e) {
    console.error(e);
    response.status(500).json(e);
  }
}