import clientPromise from "../../lib/mongodb";
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;

    try {
      const client = await clientPromise;
      const db = client.db('users');
      const collection = db.collection('users-data');

      const user = await collection.findOne({ _id: new ObjectId(id) });

      if (user) {
        res.status(200).json({ success: true, user });
      } else {
        res.status(404).json({ success: false, message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching user' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}