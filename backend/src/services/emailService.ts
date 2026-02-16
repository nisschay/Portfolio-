/**
 * Email Service
 * Handles sending emails via Nodemailer
 */

import nodemailer from 'nodemailer';

// Create transporter with environment configuration
const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn('Email configuration incomplete. Emails will not be sent.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
};

interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Send contact form notification email
 */
export async function sendContactEmail(data: ContactEmailData): Promise<void> {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('Email transporter not configured. Skipping email.');
    return;
  }

  const contactEmail = process.env.CONTACT_EMAIL || process.env.SMTP_USER;

  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
    to: contactEmail,
    replyTo: data.email,
    subject: `[Portfolio] ${data.subject}`,
    text: `
New contact form submission:

Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}

---
Sent from portfolio contact form
    `.trim(),
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f9f7f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <tr>
              <td style="padding: 40px; border-bottom: 1px solid #e8e6e3;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 500; color: #1a1916;">
                  New Contact Submission
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px;">
                <table cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding-bottom: 20px;">
                      <p style="margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #7a7774;">Name</p>
                      <p style="margin: 0; font-size: 16px; color: #1a1916;">${data.name}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 20px;">
                      <p style="margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #7a7774;">Email</p>
                      <p style="margin: 0; font-size: 16px; color: #1a1916;">
                        <a href="mailto:${data.email}" style="color: #c4956a; text-decoration: none;">${data.email}</a>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 20px;">
                      <p style="margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #7a7774;">Subject</p>
                      <p style="margin: 0; font-size: 16px; color: #1a1916;">${data.subject}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style="margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #7a7774;">Message</p>
                      <div style="margin: 0; padding: 20px; font-size: 16px; line-height: 1.6; color: #4a4845; background-color: #f9f7f4; border-radius: 4px;">
                        ${data.message.replace(/\n/g, '<br>')}
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 40px; background-color: #f9f7f4; border-top: 1px solid #e8e6e3;">
                <p style="margin: 0; font-size: 12px; color: #7a7774; text-align: center;">
                  This email was sent from your portfolio contact form
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `.trim(),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Contact email sent:', info.messageId);
  } catch (error) {
    console.error('Failed to send contact email:', error);
    throw error;
  }
}

/**
 * Send a test email to verify configuration
 */
export async function sendTestEmail(to: string): Promise<boolean> {
  const transporter = createTransporter();
  
  if (!transporter) {
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"Portfolio" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Test Email - Portfolio',
      text: 'This is a test email from your portfolio application.',
    });
    return true;
  } catch (error) {
    console.error('Test email failed:', error);
    return false;
  }
}
