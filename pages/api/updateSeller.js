import clientPromise from "../../lib/mongodb";

export default async function handler(request, response) {
  if (request.method === 'PUT') {
    try {
      const client = await clientPromise;
      const db = client.db('users');
      const collection = db.collection('sellers');

      const { email, name } = request.body;

      const result = await collection.updateOne(
        { email },
        { $set: { name } }
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
