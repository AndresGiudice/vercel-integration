import clientPromise from "../../lib/mongodb";
import bcrypt from 'bcryptjs';

export default async function handler(request, response) {
  if (request.method === 'POST') {
    const { name, email, password, priceList } = request.body;

    try {
      const client = await clientPromise;
      const db = client.db('users');
      const collection = db.collection('users-data');

      if (email) {
        // Verificar si el correo electrónico ya existe
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
          return response.status(400).json({ success: false, message: 'Ya existe un usuario con ese mail' });
        }
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear el nuevo usuario
      const newUser = {
        name,
        email,
        password: hashedPassword,
        priceList,
        createdAt: new Date(),
      };

      // Insertar el nuevo usuario en la base de datos
      await collection.insertOne(newUser);

      response.status(201).json({ success: true, message: 'Usuario creado exitosamente' });
    } catch (error) {
      console.error('Error creating user:', error);
      response.status(500).json({ success: false, message: 'Error al crear el usuario' });
    }
  } else {
    response.status(405).json({ success: false, message: 'Method not allowed' });
  }
}