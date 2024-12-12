import clientPromise from "../../lib/mongodb";
import bcrypt from 'bcryptjs';

export default async function handler(request, response) {
  if (request.method === 'DELETE') {
    const { email } = request.body;

    try {
      const client = await clientPromise;
      const db = client.db('users');
      const collection = db.collection('users-data');

      // Eliminar el usuario de la base de datos
      await collection.deleteOne({ email });

      response.status(200).json({ success: true, message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      console.error('Error deleting user:', error);
      response.status(500).json({ success: false, message: 'Error al eliminar el usuario' });
    }
  } else if (request.method === 'POST') {
    const { name, email, priceList } = request.body;

    try {
      const client = await clientPromise;
      const db = client.db('users');
      const collection = db.collection('users-data');

      // Actualizar el usuario en la base de datos
      await collection.updateOne(
        { email },
        { $set: { name, priceList, updatedAt: new Date() } }
      );

      response.status(200).json({ success: true, message: 'Usuario actualizado exitosamente' });
    } catch (error) {
      console.error('Error updating user:', error);
      response.status(500).json({ success: false, message: 'Error al actualizar el usuario' });
    }
  } else {
    response.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

