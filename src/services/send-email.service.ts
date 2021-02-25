import  nodemailer, { Transporter } from 'nodemailer'
import handlebars from 'handlebars';
import fs from 'fs'

class SendEmailService {

  private client?: Transporter;

  constructor() {
    nodemailer.createTestAccount().then(account => {

      // Create a SMTP transporter object
      let transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass
        }
      });

      this.client = transporter;

    }).catch(err => {
      console.error('Failed to create a testing account. ' + err.message);
      return process.exit(1);
    })
  }


  execute(to: string, subject: string, variables: object, path: string) {

    const templateFileContent = fs.readFileSync(path).toString('utf8');

    // Compilar o template e parsear as variáveis que estamos recebendo lá no template
    const mailTemplateParse = handlebars.compile(templateFileContent);
    const html = mailTemplateParse(variables)

    const message = {
      from: 'NPS <noreply@nps.com.br>',
      to,
      subject,
      html
    };

    this.client?.sendMail(message, (err, info) => {
      if (err) {
        console.log('Error occurred. ' + err.message);
        return process.exit(1);
      }

      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    })
  }

}


export default new SendEmailService();
