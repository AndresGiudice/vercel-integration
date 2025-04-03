import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(request, response) {
  if (request.method === 'PUT') {
    try {
      const client = await clientPromise;
      const db = client.db('users');
      const collection = db.collection('sellers');

      const { _id, name, email } = request.body; // Recibimos _id como identificador único

      const result = await collection.updateOne(
        { _id: new ObjectId(_id) }, // Usamos _id para encontrar el vendedor
        { $set: { name, email } }
      );

      if (result.modifiedCount === 1) {
        response.status(200).json({ success: true });
      } else {
        response.status(404).json({ success: false, message: 'Seller not found' });
      }
    } catch (error) {
      console.error('Error updating seller:', error);
      response.status(500).json({ success: false, message: 'Error updating seller' });
    }
  } else {
    response.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
