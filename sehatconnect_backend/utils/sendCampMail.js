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

export const sendCampNotificationMail = async ({
  to,
  campName,
  date,
  time,
  location,
  description,
}) => {
  const mailOptions = {
    from: `"SehatConnect"<sehatconnect18@gmail.com>`, 
    to,
    subject: `📢 New Health Camp: ${campName}`,
    html: `
      <h2>📢 New Health Camp Scheduled</h2>
      <p>Hello,</p>

      <p>A new health camp has been scheduled.</p>

      <p><b>Camp Name:</b> ${campName}</p>
      <p><b>Date:</b> ${date}</p>
      <p><b>Time:</b> ${time}</p>
      <p><b>Location:</b> ${location}</p>

      <p><b>Description:</b></p>
      <p>${description}</p>

      <br/>
      <p>Please make sure to be available.</p>

      <p>Regards,<br/>SehatConnect Team</p>
    `,
  };

  return await transporter.sendMail(mailOptions);
};