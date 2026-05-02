import axios from "axios";

export const sendCampNotificationMail = async ({
  to,
  campName,
  date,
  time,
  location,
  description,
}) => {
  try {
    console.log("📩 Sending camp notification via Brevo API...");

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
          },
        ],

        subject: `📢 New Health Camp: ${campName}`,

        htmlContent: `
          <h2>📢 New Health Camp Scheduled</h2>

          <p>Hello,</p>

          <p>A new health camp has been scheduled. Please find the details below:</p>

          <hr/>

          <p><b>Camp Name:</b> ${campName}</p>
          <p><b>Date:</b> ${date}</p>
          <p><b>Time:</b> ${time}</p>
          <p><b>Location:</b> ${location}</p>

          <p><b>Description:</b></p>
          <p>${description}</p>

          <hr/>

          <p>Please make sure to be available.</p>

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

    console.log("✅ NOTIFICATION EMAIL SENT:", response.data);
    return response.data;

  } catch (error) {
    console.error(
      "❌ NOTIFICATION EMAIL ERROR:",
      error.response?.data || error.message
    );
    throw error;
  }
};