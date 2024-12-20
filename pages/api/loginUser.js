import clientPromise from "../../lib/mongodb";
import bcrypt from 'bcryptjs';

export default async function handler(request, response) {
  if (request.method === 'POST') {
    const { email, password } = request.body;

    try {
      const client = await clientPromise;
      const db = client.db('users');
      const collection = db.collection('users-data'); // Change collection to 'users-data'

      // Buscar el usuario en la base de datos
      const user = await collection.findOne({ email });

      if (user && await bcrypt.compare(password, user.password)) {
        response.status(200).json({ 
          success: true, 
          message: 'Login successful', 
          priceList: user.priceList, 
          user: { name: user.name, email: user.email, priceList: user.priceList } // Include priceList
        });
      } else {
        response.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error) {
      response.status(500).json({ success: false, message: 'Error during login' });
    }
  } else {
    response.status(405).json({ success: false, message: 'Method not allowed' });
  }
}