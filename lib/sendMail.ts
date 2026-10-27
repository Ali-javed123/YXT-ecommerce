// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.NODEMAILER_EMAIL,
//     pass: process.env.NODEMAILER_PASSWORD,
//   },
// });

// export const sendMail = async (
//   receiver: string,
//   subject: string,
//   html: string
// ) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"Developer Ali Javed" <${process.env.NODEMAILER_EMAIL}>`,
//       to: receiver,
//       subject,
//       html,
//     });

//     console.log("EMAIL SENT:", receiver);

//     return {
//       success: true,
//       messageId: info.messageId,
//     };
//   } catch (error: any) {
//     console.error("EMAIL SENDING ERROR:", error);

//     return {
//       success: false,
//       error: error?.message || error,
//     };
//   }
// };

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: Number(process.env.NODEMAILER_PORT),
  secure: false,

  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },

  pool: true,
  maxConnections: 3,
  maxMessages: 100,
});

export const sendMail = async (
  receiver: string,
  subject: string,
  html: string
) => {
  try {
    console.time("sendMail");

    const info = await transporter.sendMail({
      from: `"Developer Ali Javed" <${process.env.NODEMAILER_EMAIL}>`,
      to: receiver,
      subject,
      html,
    });

    console.timeEnd("sendMail");

    console.log("EMAIL SENT:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.timeEnd("sendMail");

    console.error("EMAIL SENDING ERROR:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};