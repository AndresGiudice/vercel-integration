import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { seller } = req.query;

    try {
      const client = await clientPromise;
      const db = client.db('users');
      const collection = db.collection('users-data');

      const users = await collection.find({ seller }).toArray();

      res.status(200).json({ success: true, users });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching assigned users' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}