import clientPromise from "../../lib/mongodb";
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb'; // Import ObjectId

export default async function handler(request, response) {
  if (request.method === 'POST') {
    const { name, email, password, priceList, seller } = request.body;

    try {
      const client = await clientPromise;
      const db = client.db('users');
      const collection = db.collection('users-data');
      const sellersCollection = db.collection('sellers'); // Assuming sellers are stored in 'sellers'

      // Obtener el nombre del vendedor
      const sellerData = await sellersCollection.findOne({ _id: new ObjectId(seller) }); // Convert seller to ObjectId
      const sellerName = sellerData ? sellerData.name : null;

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear el nuevo usuario
      const newUser = {
        name,
        email,
        password: hashedPassword,
        priceList,
        seller: sellerName, // Store seller's name
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