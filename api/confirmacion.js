import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const data = Buffer.concat(chunks).toString();
  const params = new URLSearchParams(data);

  const nombre = params.get('nombre');
  const asistencia = params.get('asistencia');
  const intolerancias = params.get('intolerancias');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: 'pmoleromarin@gmail.com',
    to: 'pmoleromarin@gmail.com',
    subject: `🎉 Confirmación de ${nombre}`,
    text: `Nombre: ${nombre}\nAsistencia: ${asistencia}\nIntolerancias/Alergias: ${intolerancias || 'Ninguna'}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error al enviar el correo' });
  }
}
