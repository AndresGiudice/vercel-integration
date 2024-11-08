import clientPromise from "../../lib/mongodb";
import bcrypt from 'bcryptjs';

export default async function handler(request, response) {
  if (request.method === 'POST') {
    const { token, newPassword } = request.body;

    try {
      const client = await clientPromise;
      const db = client.db('users');
      const collection = db.collection('admin-data');

      // Buscar el administrador en la base de datos usando el token
      const admin = await collection.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

      if (!admin) {
        return response.status(400).json({ success: false, message: 'Token inválido o expirado' });
      }

      // Encriptar la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Actualizar la contraseña en la base de datos
      await collection.updateOne(
        { resetPasswordToken: token },
        { $set: { password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null } }
      );

      response.status(200).json({ success: true, message: 'Contraseña modificada exitosamente' });
    } catch (error) {
      console.error('Error during password reset:', error);
      response.status(500).json({ success: false, message: 'Error en el proceso de modificación de contraseña' });
    }
  } else {
    response.status(405).json({ success: false, message: 'Method not allowed' });
  }
}