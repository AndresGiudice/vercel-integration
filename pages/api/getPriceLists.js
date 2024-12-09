import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const directoryPath = path.resolve('./pages/listas');
      if (!fs.existsSync(directoryPath)) {
        throw new Error(`Directory not found: ${directoryPath}`);
      }

      const files = fs.readdirSync(directoryPath);
      if (files.length === 0) {
        throw new Error('No price list files found');
      }

      const priceLists = files.map(file => path.basename(file, path.extname(file)));
      res.status(200).json({ success: true, priceLists });
    } catch (error) {
      console.error('Error reading price lists:', error.message);
      res.status(500).json({ success: false, message: `Error al obtener las listas de precios: ${error.message}` });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}