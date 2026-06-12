import nodemailer from 'nodemailer';

const EMAIL_CONFIGURED = !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASSWORD || '',
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  if (!EMAIL_CONFIGURED) {
    console.log('[Email] Not configured — skipping email to', to, '| Subject:', subject);
    return { messageId: 'skipped' };
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@serverhub.com',
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
}
