import nodemailer from 'nodemailer'

const emailRegistro =async (datos) => {

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
        subject: "Comprueba tu cuenta en APV",
        text: 'Comprueba tu cuenta en APV',
        html: `
            <p> Bienvenido ${ nombre }, creaste una cuenta en APV, 
            para finalizar tu proceso, comprueba que eres tu en el siguiente enlace:
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}"> Comprobar mi cuenta </a>
            </p>

            <p> Si tu no accediste o creaste esta cuenta, ignora el mensaje </p>
            `,
    })
}

export default emailRegistro