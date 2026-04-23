import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, 
  auth: {
    user: "a84e50001@smtp-brevo.com",
    pass: process.env.SMTP_PASS, 
  },
});

export const sendCredentialsMail = async ({
  to,
  fullName,
  role,
  email,
  password,
}) => {
  const mailOptions = {
    from: `"SehatConnect"<sehatconnect18@gmail.com>`,
    to,
    subject: `Welcome to SehatConnect - ${role} Account`,
    html: `
      <h2>Welcome to SehatConnect</h2>
      <p>Hello <b>${fullName}</b>,</p>
      <p>Your <b>${role}</b> account has been created successfully.</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Password:</b> ${password}</p>
      <p>Please login and change your password after first login.</p>
    `,
  };

  return await transporter.sendMail(mailOptions);
};