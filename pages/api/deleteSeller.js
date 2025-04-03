import clientPromise from "../../lib/mongodb";

export default async function handler(request, response) {
  if (request.method === 'DELETE') {
    try {
      const { email } = request.body;

      if (!email) {
        return response.status(400).json({ success: false, message: 'Email es requerido' });
      }

      const client = await clientPromise;
      const db = client.db('users');
      const collection = db.collection('sellers');

      const result = await collection.deleteOne({ email });

      if (result.deletedCount === 1) {
        response.status(200).json({ success: true, message: 'Vendedor eliminado exitosamente' });
      } else {
        response.status(404).json({ success: false, message: 'Vendedor no encontrado' });
      }
    } catch (error) {
      console.error('Error eliminando vendedor:', error);
      response.status(500).json({ success: false, message: 'Error al eliminar el vendedor' });
    }
  } else {
    response.status(405).json({ success: false, message: 'Método no permitido' });
  }
}
