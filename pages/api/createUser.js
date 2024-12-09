import clientPromise from "../../lib/mongodb";
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

export default async function handler(request, response) {
  if (request.method === 'POST') {
    const { name, email, password, priceList } = request.body;

    try {
      const client = await clientPromise;
      const db = client.db('users');
      const collection = db.collection('users-data');

      // Verificar si el correo electrónico ya existe
      const existingUser = await collection.findOne({ email });
      if (existingUser) {
        return response.status(400).json({ success: false, message: 'Ya existe un usuario con ese mail' });
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
  } else if (request.method === 'GET') {
    try {
      const directoryPath = path.join(process.cwd(), 'pages', 'listas');
      console.log(`Checking directory: ${directoryPath}`);
      if (!fs.existsSync(directoryPath)) {
        throw new Error(`Directory not found: ${directoryPath}`);
      }
      const folders = fs.readdirSync(directoryPath).filter(file => fs.statSync(path.join(directoryPath, file)).isDirectory());
      console.log(`Folders found: ${folders}`);

      // Log the structure of the directory
      const files = fs.readdirSync(directoryPath);
      files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          console.log(`Directory: ${filePath}`);
        } else {
          console.log(`File: ${filePath}`);
        }
      });

      const requiredFolders = ['lista4', 'lista4-final'];
      const foundFolders = requiredFolders.filter(folder => folders.includes(folder));

      if (foundFolders.length !== requiredFolders.length) {
        throw new Error('Required folders not found');
      }

      response.status(200).json({ success: true, folders: foundFolders });
    } catch (error) {
      console.error('Error fetching folders:', error);
      response.status(500).json({ success: false, message: `Error al obtener las carpetas: ${error.message}` });
    }
  } else {
    response.status(405).json({ success: false, message: 'Method not allowed' });
  }
}