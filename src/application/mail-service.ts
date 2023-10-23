import nodemailer from 'nodemailer'
import {SETTINGS} from '../shared/configs'

export const mailService = {
  async sendConfimationEmail(email: string, confirmationCode: string): Promise<boolean> {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SETTINGS.EMAIL_USER,
        pass: SETTINGS.EMAIL_PASS,
      },
    })

    try {
      await transport.sendMail({
        from: `"It-kamasutra 👻" <${SETTINGS.EMAIL_USER}>`,
        to: email,
        subject: 'Hello ✔',
        text: 'Hello world?',
        html: `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
        </p>`,
      })
    } catch (error) {
      console.log(error)
      return false
    }

    return true
  },
}
