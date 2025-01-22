import clientPromise from "../../lib/mongodb";
import bcrypt from 'bcryptjs';

export default async function handler(request, response) {
  if (request.method === 'POST') {
    const { name, password } = request.body;
    try {
      const client = await clientPromise;
      const db = client.db('users');
      const collection = db.collection('sellers');

      const seller = await collection.findOne({ name });

      if (seller && await bcrypt.compare(password, seller.password)) {
        response.status(200).json({ success: true });
      } else {
        response.status(404).json({ success: false, message: 'Nombre o contraseña incorrectos' });
      }
    } catch (error) {
      console.error('Error logging in seller:', error);
      response.status(500).json({ success: false, message: 'Error al iniciar sesión' });
    }
  } else {
    response.status(405).json({ success: false, message: 'Method not allowed' });
  }
}