import clientPromise from "../../lib/mongodb";
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { sellerName, userId } = req.body;

    try {
      const client = await clientPromise;
      const db = client.db('users');
      const usersCollection = db.collection('users-data');
      const sellersCollection = db.collection('sellers');

      // Validate seller
      const seller = await sellersCollection.findOne({ name: sellerName });
      if (!seller) {
        return res.status(401).json({ success: false, message: 'Invalid seller' });
      }

      // Fetch assigned user
      const user = await usersCollection.findOne({ _id: new ObjectId(userId), seller: sellerName });
      if (user) {
        res.status(200).json({ success: true, user });
      } else {
        res.status(404).json({ success: false, message: 'User not found or not assigned to this seller' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error during login as user' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
