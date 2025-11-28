import nodemailer from "nodemailer";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // App password
  },
});

// Twilio setup
const twilioClient = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send absentee alert to parent via Email + SMS
 * @param {string} parentEmail - Parent's email address
 * @param {string} parentPhone - Parent's phone number with country code (+91 for India)
 * @param {string} studentName - Name of the absent student
 * @param {string} date - Date of absence
 */
export const sendAbsenteeAlert = async (
  parentEmail,
  parentPhone,
  studentName,
  date
) => {
  try {
    // Email alert
    await transporter.sendMail({
      from: `"Mentor System" <${process.env.EMAIL_USER}>`,
      to: parentEmail,
      subject: "Absence Notification",
      text: `Dear Parent, your child ${studentName} was marked absent on ${date}. Please contact the mentor for details.`,
    });

    console.log(`📧 Email sent to ${parentEmail}`);

    // SMS alert
    await twilioClient.messages.create({
      body: `Dear Parent, your child ${studentName} was absent on ${date}.`,
      from: process.env.TWILIO_PHONE,
      to: parentPhone,
    });

    console.log(`📱 SMS sent to ${parentPhone}`);
  } catch (error) {
    console.error("❌ Error sending absentee alert:", error);
  }
};



