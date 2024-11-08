import clientPromise from "../../lib/mongodb";
import bcrypt from 'bcryptjs';

export default async function handler(request, response) {
  if (request.method === 'POST') {
    const { adminEmail, adminPassword } = request.body;

    try {
      const client = await clientPromise;
      const db = client.db('users');
      const collection = db.collection('admin-data');

      // Buscar el administrador en la base de datos
      const admin = await collection.findOne({ email: adminEmail });

      if (admin && await bcrypt.compare(adminPassword, admin.password)) {
        response.status(200).json({ success: true, message: 'Login successful' });
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