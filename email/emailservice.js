import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

export const sendOtpMail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: `"SANJAY KUMAR" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Reset Your Password",
      html: `<p>Your OTP for password reset is <b>${otp}</b>.</p><p>It expires in 5 minutes.</p>`,
    });
  } catch (error) {
    console.error("Error sending OTP mail:", error);
    throw error;
  }
};

export const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"SANJAY KUMAR" <${process.env.EMAIL_USER}>`,
      to:to,
      subject,
      text,
      html,
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export async function sendRegistrationEmail(userEmail, name) {
  const subject = 'Welcome to Job-Portal';
  const text = `Hello ${name},\n\nThank you for registering at Job-Portal`;
  const html = `<p>Hello ${name},</p><p>Thanks for registering at Job-Portal</p>`;

  await sendEmail(userEmail, subject, text, html);
} 
