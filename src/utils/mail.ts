import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import env from "../config/env.config";
/**
 * Interface for the standardized email body content.
 * This ensures all email generation functions produce a consistent data structure.
 */
interface EmailBodyContent {
  body: {
    name: string;
    intro: string | string[];
    dictionary?: {};
    action?: {
      instructions: string;
      button: {
        color: string;
        text: string;
        link: string;
      };
    };
    outro?: string | string[];
    signature?: string;
  };
}

const sendMail = async (email: string, subject: string, emailContent: any) => {
  const transporter = nodemailer.createTransport({
    host: env.MAILTRAP_SMTP_HOST,
    port: Number(env.MAILTRAP_SMTP_PORT),
    secure: Number(env.MAILTRAP_SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: env.MAILTRAP_SMTP_USERNAME,
      pass: env.MAILTRAP_SMTP_PASSWORD,
    },
  });

  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Inkwell",
      link: "https://Inkwell.js/",
      // Optional product logo
    },
  });
  var emailBody = mailGenerator.generate(emailContent);

  var emailText = mailGenerator.generatePlaintext(emailContent);
  try {
    const info = await transporter.sendMail({
      from: '"Soumya Adhya" <soumya@inkwell.com>',
      to: email,
      subject: subject,
      text: emailText, // plain‑text body
      html: emailBody, // HTML body
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error(`Error while sending email:${error}`);
  }
};

/**
 * Generates the content for a verification email.
 * @param username The name of the user.
 * @param verificationLink The unique link for account verification.
 * @returns The structured email body content.
 */
const generateVerificationEmail = (
  username: string,
  verificationLink: string
): EmailBodyContent => {
  return {
    body: {
      name: username,
      intro:
        "Welcome to our platform! We're very excited to have you on board.",
      action: {
        instructions:
          "To get started, please click the button below to confirm your account:",
        button: {
          color: "#22BC66",
          text: "Confirm your account",
          link: verificationLink,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

/**
 * Generates the content for a forgot password email.
 * @param username The name of the user.
 * @param resetLink The unique link to reset the password.
 * @returns The structured email body content.
 */
const generateForgotPasswordEmail = (
  username: string,
  resetLink: string
): EmailBodyContent => {
  return {
    body: {
      name: username,
      intro:
        "We received a request to reset your password. If you didn't make this request, you can ignore this email.",
      action: {
        instructions: "To reset your password, click the button below:",
        button: {
          color: "#FF5733",
          text: "Reset Password",
          link: resetLink,
        },
      },
      outro:
        "If you did not request a password reset, no further action is required.",
    },
  };
};

/**
 * Generates the content for a 'Blog Created' email.
 * @param username The name of the user.
 * @param blogTitle The title of the new blog post.
 * @param viewLink The link to view the blog post in a draft or preview state.
 * @returns The structured email body content.
 */
const generatePostCreatedEmail = (
  username: string,
  blogTitle: string,
  viewLink: string
): EmailBodyContent => {
  return {
    body: {
      name: username,
      intro: `Great news! Your blog post, "${blogTitle}", has been successfully created and is now awaiting review.`,
      action: {
        instructions: "You can view your post by clicking the button below:",
        button: {
          color: "#4a90e2",
          text: "View Your Post",
          link: viewLink,
        },
      },
      outro:
        "We will notify you as soon as your blog is reviewed and published!",
    },
  };
};

/**
 * Generates the content for a 'Blog Accepted for Publish' email.
 * @param username The name of the user.
 * @param blogTitle The title of the published blog post.
 * @param publishLink The link to the live, published blog post.
 * @returns The structured email body content.
 */
const generatePostAcceptedEmail = (
  username: string,
  blogTitle: string,
  publishLink: string
): EmailBodyContent => {
  return {
    body: {
      name: username,
      intro: `Congratulations, ${username}! Your blog post, "${blogTitle}", has been accepted and is now live on the site.`,
      action: {
        instructions: "Check out your published post here:",
        button: {
          color: "#1a73e8",
          text: "View Published Post",
          link: publishLink,
        },
      },
      outro: "Thanks for sharing your awesome content with us!",
    },
  };
};

const generatePostRejectedEmail = (
  username: string,
  blogTitle: string,
  reason: string
): EmailBodyContent => {
  return {
    body: {
      name: username,
      intro: `Hello ${username}, unfortunately, your blog post "${blogTitle}" has been rejected by our review team.`,
      dictionary: {
        reason: `Reason for rejection: ${reason}`,
      },
      outro:
        "You can update your blog to address the above issue(s) and resubmit it for review. We appreciate your contribution and look forward to your updated post!",
    },
  };
};

export {
  sendMail,
  generateVerificationEmail,
  generateForgotPasswordEmail,
  generatePostCreatedEmail,
  generatePostAcceptedEmail,
  generatePostRejectedEmail,
};
