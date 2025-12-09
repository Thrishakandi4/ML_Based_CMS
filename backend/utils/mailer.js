import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // You can change to your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendDepartmentCredentials = async (to, email, password) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Your Department Account Credentials",
    text: `Welcome to the CMS!\n\nYour login credentials:\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after first login.`
  };
  await transporter.sendMail(mailOptions);
};
