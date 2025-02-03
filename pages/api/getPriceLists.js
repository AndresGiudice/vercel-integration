import clientPromise from "../../lib/mongodb";

export default async function handler(request, response) {
  if (request.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('users');
      const collection = db.collection('price-lists');

      const priceLists = await collection.find({}).toArray();

      response.status(200).json({ success: true, priceLists });
    } catch (error) {
      console.error('Error fetching price lists:', error);
      response.status(500).json({ success: false, message: 'Error fetching price lists' });
    }
  } else {
    response.status(405).json({ success: false, message: 'Method not allowed' });
  }
}