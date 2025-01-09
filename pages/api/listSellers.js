import clientPromise from "../../lib/mongodb";

export default async function handler(request, response) {
  if (request.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('users');
      const collection = db.collection('sellers');

      const sellers = await collection.find({}).toArray();

      response.status(200).json({ success: true, sellers });
    } catch (error) {
      console.error('Error fetching sellers:', error);
      response.status(500).json({ success: false, message: 'Error al obtener los vendedores' });
    }
  } else {
    response.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
