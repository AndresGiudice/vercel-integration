import clientPromise from "../../lib/mongodb";
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export default async function handler(request, response) {
  if (request.method === 'POST') {
    const { email } = request.body;

    try {
      const client = await clientPromise;
      const db = client.db('users');
      const collection = db.collection('sellers');

      const seller = await collection.findOne({ email });

      if (!seller) {
        return response.status(404).json({ success: false, message: 'Vendedor no encontrado' });
      }

      const token = crypto.randomBytes(20).toString('hex');
      const resetPasswordUrl = `https://evacor-ecommerce.vercel.app/resetPassword?token=${token}`;

      await collection.updateOne(
        { email },
        { $set: { resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000 } }
      );

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'andres.evacor@gmail.com',
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        to: email,
        from: 'andres.evacor@gmail.com',
        subject: 'Restablecimiento de contraseña',
        text: `Has recibido este correo porque tú (u otra persona) ha solicitado el restablecimiento de la contraseña de tu cuenta.\n\n
        Por favor haz clic en el siguiente enlace, o pégalo en tu navegador para completar el proceso:\n\n
        ${resetPasswordUrl}\n\n
        Si no solicitaste esto, por favor ignora este correo y tu contraseña permanecerá sin cambios.\n`,
      };

      await transporter.sendMail(mailOptions);

      response.status(200).json({ success: true, message: 'Correo electrónico de restablecimiento de contraseña enviado' });
    } catch (error) {
      response.status(500).json({ success: false, message: 'Error during password reset' });
    }
  } else {
    response.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
