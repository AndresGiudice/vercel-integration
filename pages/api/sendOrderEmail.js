const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');

async function sendOrderEmail(cart, totalAmount) {
  // Crear un libro de Excel
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Pedido');

  // Agregar encabezados
  worksheet.columns = [
    { header: 'Código', key: 'systemCode', width: 10 },
    { header: 'Producto', key: 'code', width: 30 },
    { header: 'Descripción', key: 'description', width: 30 },
    { header: 'Cantidad', key: 'quantity', width: 10 },
    { header: 'Precio Unitario', key: 'price', width: 15 },
    { header: 'Total', key: 'total', width: 15 },
  ];

  // Agregar filas
  Object.entries(cart).forEach(([product, item]) => {
    console.log(`Item: ${JSON.stringify(item)}`); // Agrega este log para depurar
    const { systemCode, code, description, quantity, price } = item;
    console.log(`systemCode: ${systemCode}, product: ${product}, code: ${code}`); // Agrega este log para depurar
    worksheet.addRow({
      systemCode,
      code,
      product,
      description,
      quantity,
      price,
      total: price * quantity,
    });
  });

  // Agregar fila de total
  worksheet.addRow({});
  worksheet.addRow({ product: 'Total', total: totalAmount });

  // Generar el archivo Excel
  const buffer = await workbook.xlsx.writeBuffer();

  // Configurar el transporte de nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'andres.evacor@gmail.com',
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Configurar el correo electrónico
  const mailOptions = {
    from: 'andres.evacor@gmail.com',
    to: 'andresgiudice94@gmail.com',
    subject: 'Detalle del Pedido',
    text: 'Adjunto encontrarás el detalle de tu pedido.',
    attachments: [
      {
        filename: 'pedido.xlsx',
        content: buffer,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    ],
  };

  // Enviar el correo electrónico
  await transporter.sendMail(mailOptions);
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { cart, totalAmount } = req.body;
    try {
      await sendOrderEmail(cart, totalAmount);
      res.status(200).json({ message: 'Correo enviado con éxito' });
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      res.status(500).json({ message: 'Error al enviar el correo' });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}