import clientPromise from "../../lib/mongodb";

export default async function handler(request, response) {
  if (request.method === 'GET') {
    const { seller } = request.query;
    if (!seller) {
      return response.status(400).json({ success: false, message: 'Seller is required' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('users');
      const collection = db.collection('users-data');

      const users = await collection.find({ seller }).toArray();

      response.status(200).json({ success: true, users });
    } catch (error) {
      console.error('Error fetching assigned users:', error);
      response.status(500).json({ success: false, message: 'Error al obtener los usuarios asignados' });
    }
  } else {
    response.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
