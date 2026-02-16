/**
 * Contact Routes
 * Public API endpoint for contact form submissions
 */

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { validateBody, createContactSchema } from '../middleware/validation.js';
import { sendContactEmail } from '../services/emailService.js';

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /api/contact
 * Submit contact form
 */
router.post('/', validateBody(createContactSchema), async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    // Save to database
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        subject: subject || 'Contact Form Submission',
        message,
      },
    });

    // Send email notification (async, don't wait)
    sendContactEmail({
      name,
      email,
      subject: subject || 'Contact Form Submission',
      message,
    }).catch((error) => {
      console.error('Failed to send contact email:', error);
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! I will get back to you soon.',
      data: {
        id: contact.id,
        createdAt: contact.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
