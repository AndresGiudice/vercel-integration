import clientPromise from "../../lib/mongodb";

export default async function handler(request, response) {
  if (request.method === 'GET') {
    const { email, name, password } = request.query;

    if (!email || !name || !password) {
      return response.status(400).json({ error: 'Faltan parámetros en la solicitud' });
    }

    try {
      // Conectar a la base de datos
      const client = await clientPromise;
      const db = client.db('users');
      const collection = db.collection('admin-data');

      // Insertar el nuevo administrador en la base de datos
      await collection.insertOne({ email, name, password, approved: true });

      response.status(200).json({ message: 'Administrador aprobado y registrado en la base de datos' });
    } catch (error) {
      response.status(500).json({ error: 'Error al registrar el administrador en la base de datos' });
    }
  } else {
    response.status(405).json({ error: 'Método no permitido' });
  }
}