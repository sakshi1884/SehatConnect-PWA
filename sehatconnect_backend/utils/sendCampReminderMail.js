import axios from "axios";

export const sendCampReminderMail = async ({
  to,
  fullName,
  campName,
  daysLeft,
  date,
  time,
  location,
}) => {
  try {
    console.log("📩 Sending camp reminder via Brevo API...");

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "SehatConnect",
          email: "sehatconnect438@gmail.com",
        },
        to: [
          {
            email: to,
            name: fullName,
          },
        ],
        subject: `⏰ Reminder: ${campName} in ${daysLeft} day(s)`,

        htmlContent: `
          <h2>⏰ Health Camp Reminder</h2>

          <p>Hello <b>${fullName}</b>,</p>

          <p>This is a reminder that your health camp is coming up soon.</p>

          <hr/>

          <p><b>Camp Name:</b> ${campName}</p>
          <p><b>Days Left:</b> ${daysLeft}</p>
          <p><b>Date:</b> ${date}</p>
          <p><b>Time:</b> ${time}</p>
          <p><b>Location:</b> ${location}</p>

          <hr/>

          <p>Please make sure to attend on time.</p>

          <br/>
          <p>Regards,<br/><b>SehatConnect Team</b></p>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ REMINDER EMAIL SENT:", response.data);
    return response.data;

  } catch (error) {
    console.error(
      "❌ REMINDER EMAIL ERROR:",
      error.response?.data || error.message
    );
    throw error;
  }
};