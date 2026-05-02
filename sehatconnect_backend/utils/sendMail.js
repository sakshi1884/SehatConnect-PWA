import axios from "axios";

export const sendCredentialsMail = async ({
  to,
  fullName,
  role,
  email,
  password,
}) => {
  try {
    console.log("📩 Sending email via Brevo API...");

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
        subject: `Welcome to SehatConnect - ${role} Account`,
        htmlContent: `
          <h2>Welcome to SehatConnect</h2>
          <p>Hello <b>${fullName}</b>,</p>
          <p>Your <b>${role}</b> account has been created successfully.</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Password:</b> ${password}</p>
          <p>Please log in and change your password immediately for security reasons.</p>
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

    console.log("✅ EMAIL SENT:", response.data);
    return response.data;

  } catch (error) {
    console.log("❌ EMAIL API ERROR:", error.response?.data || error.message);
    throw error;
  }
};