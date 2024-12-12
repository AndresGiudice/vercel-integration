import clientPromise from "../../lib/mongodb";

export default async function handler(request, response) {
  if (request.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('users');
      const collection = db.collection('users-data');

      const users = await collection.find({}).toArray();
      const priceList = users.map(user => user.priceList); // Obtener priceList de los usuarios

      response.status(200).json({ success: true, users, priceList });
    } catch (error) {
      console.error('Error fetching users:', error);
      response.status(500).json({ success: false, message: 'Error al obtener los usuarios' });
    }
  } else {
    response.status(405).json({ success: false, message: 'Method not allowed' });
  }
}