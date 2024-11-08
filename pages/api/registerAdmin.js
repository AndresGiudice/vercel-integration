import clientPromise from "../../lib/mongodb";
import nodemailer from 'nodemailer';

export default async function handler(request, response) {
  if (request.method === 'POST') {
    const { email, name, password } = request.body;

    // Configurar Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'andres.evacor@gmail.com',
        pass: process.env.EMAIL_PASSWORD,
      }
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const mailOptions = {
      from: 'andres.evacor@gmail.com',
      to: 'andres.evacor@gmail.com',
      subject: 'Aprobación de nuevo administrador',
      text: `Aprobar nuevo administrador: ${name} (${email}). Haz clic en el siguiente enlace para aprobar: ${baseUrl}/api/approveAdmin?email=${email}&password=${password}`
    };

    try {
      // Enviar correo electrónico
      await transporter.sendMail(mailOptions);

      response.status(200).json({ message: 'Correo de aprobación enviado' });
    } catch (error) {
      response.status(500).json({ error: 'Error al enviar el correo' });
    }
  } else {
    response.status(405).json({ error: 'Método no permitido' });
  }
}