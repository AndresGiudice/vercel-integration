import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const directoryPath = path.join(process.cwd(), './pages/listas');
      const files = fs.readdirSync(directoryPath);
      const priceLists = files.map(file => path.basename(file, path.extname(file)));
      res.status(200).json({ success: true, priceLists });
    } catch (error) {
      console.error('Error reading price lists:', error);
      res.status(500).json({ success: false, message: 'Error al obtener las listas de precios' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}