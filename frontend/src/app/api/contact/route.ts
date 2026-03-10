import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createContactSchema } from '@/lib/validations';
import nodemailer from 'nodemailer';

async function sendContactEmail(data: { name: string; email: string; subject: string; message: string }) {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const contactEmail = process.env.CONTACT_EMAIL || user;

  await transporter.sendMail({
    from: `"Portfolio Contact" <${user}>`,
    to: contactEmail,
    replyTo: data.email,
    subject: `[Portfolio] ${data.subject}`,
    text: `New contact form submission:\n\nName: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\n\nMessage:\n${data.message}`,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createContactSchema.safeParse(body);

    if (!parsed.success) {
      const details = parsed.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Validation failed', details: { errors: details } } },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        subject: subject || 'Contact Form Submission',
        message,
      },
    });

    sendContactEmail({
      name,
      email,
      subject: subject || 'Contact Form Submission',
      message,
    }).catch((error) => {
      console.error('Failed to send contact email:', error);
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully! I will get back to you soon.',
        data: { id: contact.id, createdAt: contact.createdAt },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to submit contact form' } },
      { status: 500 }
    );
  }
}
