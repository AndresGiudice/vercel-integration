import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import { setCookie } from 'cookies-next';

export default async function handler(request, response) {
  if (request.method === 'GET') {
    const { userId } = request.query;
    if (!userId) {
      return response.status(400).json({ success: false, message: 'User ID is required' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('users');
      const collection = db.collection('users-data');

      const user = await collection.findOne({ _id: new ObjectId(userId) });

      if (!user) {
        return response.status(404).json({ success: false, message: 'User not found' });
      }

      // Set a session or token for the user
      setCookie('user', JSON.stringify(user), { req: request, res: response });

      response.status(200).json({ success: true, message: `Logged in as ${user.name}` });
    } catch (error) {
      console.error('Error logging in as user:', error);
      response.status(500).json({ success: false, message: 'Error al iniciar sesión como usuario' });
    }
  } else {
    response.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
