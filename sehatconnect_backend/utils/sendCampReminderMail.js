import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "a9e4eb001@smtp-brevo.com",
    pass: process.env.SMTP_PASS,
  },
});

export const sendCampReminderMail = async ({
  to,
  fullName,
  campName,
  daysLeft,
  date,
  time,
  location,
}) => {
  const mailOptions = {
    from: `"SehatConnect"<sehatconnect438@gmail.com>`,
    to,
    subject: `⏰ Reminder: ${campName} in ${daysLeft} day(s)`,
    html: `
      <h2>⏰ Health Camp Reminder</h2>
      <p>Hello <b>${fullName}</b>,</p>

      <p>This is a reminder that the health camp is scheduled soon.</p>

      <p><b>Camp:</b> ${campName}</p>
      <p><b>In:</b> ${daysLeft} day(s)</p>
      <p><b>Date:</b> ${date}</p>
      <p><b>Time:</b> ${time}</p>
      <p><b>Location:</b> ${location}</p>

      <br/>
      <p>Please ensure your availability.</p>

      <p>Regards,<br/>SehatConnect Team</p>
    `,
  };

  return await transporter.sendMail(mailOptions);
};