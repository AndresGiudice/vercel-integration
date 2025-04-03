import clientPromise from "../../lib/mongodb";
import bcrypt from 'bcryptjs';

export default async function handler(request, response) {
  if (request.method === 'POST') {
    const { name, email, password, priceList } = request.body;

    try {
      const client = await clientPromise;
      const db = client.db('users');
      const collection = db.collection('sellers');

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear el nuevo vendedor
      const newSeller = {
        name,
        email,
        password: hashedPassword,
        priceList,
        createdAt: new Date(),
      };

      // Insertar el nuevo vendedor en la base de datos
      await collection.insertOne(newSeller);

      response.status(201).json({ success: true, message: 'Vendedor creado exitosamente' });
    } catch (error) {
      console.error('Error creating seller:', error);
      response.status(500).json({ success: false, message: 'Error al crear el vendedor' });
    }
  } else {
    response.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
