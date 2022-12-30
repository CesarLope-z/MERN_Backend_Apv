import nodemailer from 'nodemailer'

const emailOlvidePassword = async (datos) => {

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = datos;
    // enviando el email

    const infor = await transporter.sendMail({
        from: "APV - Administrador de Pacientes de Veterinaria",
        to: email,
        subject: "Reestablece tu Password",
        text: 'Reestablece tu Password',
        html: `
            <p> Bienvenido ${ nombre }, Has solicitado reestablecer tu password, 
            sigue el siguiente enlace para generar uno nuevo, 
            <a href="${process.env.FRONTEND_URL}/olvide/${token}"> Comprobar mi cuenta </a>
            </p>

            <p> Si tu no accediste o creaste esta cuenta, ignora el mensaje </p>
            `,
    })

}

export default emailOlvidePassword