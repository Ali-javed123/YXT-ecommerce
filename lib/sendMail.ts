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
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export const sendMail = async (
  receiver: string,
  subject: string,
  html: string
) => {
  try {
    console.log("FROM:", process.env.NODEMAILER_EMAIL);
    console.log("TO:", receiver);

    const info = await transporter.sendMail({
      from: `"Developer Ali Javed" <${process.env.NODEMAILER_EMAIL}>`,
      to: receiver,
      subject,
      html,
    });

    console.log("EMAIL SENT:", info.messageId);
    console.log("EMAIL WAS SENT TO:", receiver);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("EMAIL SENDING ERROR:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};