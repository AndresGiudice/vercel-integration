const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');

function calculateDiscountedPrice(code, totalQuantity, price, priceList) {
  if (priceList === 'lista4') {
    price = price / 1.105;
  }
  if (priceList === 'lista4-10') {
    price = (price * 0.9) / 1.105;
  }
  if (priceList === 'lista4-10-5') {
    price = (price * 0.9 * 0.95) / 1.105;
  }
  if (priceList === 'lista4-10-final') {
    price = (price * 0.9);
  }
  if (code === 'Fb3' && totalQuantity >= 100) {
    return price * 0.9;
  }
  return price;
}

async function sendOrderEmail(cart, totalAmount, user) { // Add user parameter
  // Calcular la cantidad total de productos con el código "Fb3"
  const totalQuantityFb3 = Object.values(cart).reduce((acc, item) => {
    return item.code === 'Fb3' ? acc + item.quantity : acc;
  }, 0);

  // Crear un libro de Excel
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Pedido');

  // Agregar encabezados
  worksheet.columns = [
    { header: 'Código', key: 'code', width: 30 },
    { header: 'Descripción', key: 'description', width: 30 },
    { header: 'Cantidad', key: 'quantity', width: 10 },
    { header: 'Precio Unitario', key: 'price', width: 15 },
    { header: 'Total', key: 'total', width: 15 },
  ];

  // Agregar filas
  Object.entries(cart).forEach(([product, item]) => {
    const { code, description, quantity, price } = item;
    const discountedPrice = calculateDiscountedPrice(code, totalQuantityFb3, price, user.priceList);
    worksheet.addRow({
      code,
      description,
      quantity,
      price: discountedPrice,
      total: discountedPrice * quantity,
    });
  });

  // Agregar fila de total
  worksheet.addRow({});
  worksheet.addRow({ description: 'Total', total: totalAmount });

  // Agregar datos del usuario si están disponibles
  if (user) {
    worksheet.addRow({});
    worksheet.addRow({ code: `Usuario: ${user.name}` });
    worksheet.addRow({ code: `Email: ${user.email}` });
    worksheet.addRow({ code: `Precio: ${user.priceList}` });
  }

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
    const { cart, totalAmount, user } = req.body; // Add user to request body
    try {
      await sendOrderEmail(cart, totalAmount, user); // Pass user to sendOrderEmail
      res.status(200).json({ message: 'Correo enviado con éxito' });
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      res.status(500).json({ message: 'Error al enviar el correo' });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}