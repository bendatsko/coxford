import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend('re_XEjrBafm_FYKHbsUuSV1ocNWArF3SWL2H');

export async function POST(req: Request) {
  try {
    console.log('Feedback endpoint called');
    const { feedback } = await req.json();
    
    if (!feedback) {
      console.log('No feedback provided');
      return NextResponse.json(
        { error: 'Feedback is required' },
        { status: 400 }
      );
    }

    console.log('Attempting to send email with feedback:', feedback);
    const result = await resend.emails.send({
      from: 'Coxford Website <info@coxford.net>',
      to: ['bdatsko@umich.edu'],
      subject: 'New Coxford Website Feedback',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Feedback Received</h2>
          <p style="white-space: pre-wrap; margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px;">${feedback}</p>
          <p style="color: #666; font-size: 12px;">Sent from Coxford Website</p>
        </div>
      `,
    });
    console.log('Email send result:', result);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send feedback:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to send feedback' },
      { status: 500 }
    );
  }
} 