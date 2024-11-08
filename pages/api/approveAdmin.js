import clientPromise from "../../lib/mongodb";

export default async function handler(request, response) {
  if (request.method === 'GET') {
    const { email, password } = request.query;

    try {
      const client = await clientPromise;
      const db = client.db('users');
      const collection = db.collection('admin-data');

      // Insertar el nuevo administrador en la base de datos
      await collection.insertOne({ email, password, approved: true });

      response.status(200).json({ message: 'Administrador aprobado' });
    } catch (error) {
      response.status(500).json({ error: 'Error al aprobar el administrador' });
    }
  } else {
    response.status(405).json({ error: 'Método no permitido' });
  }
}