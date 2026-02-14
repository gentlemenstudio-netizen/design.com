import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        // 1. Add user to Resend Audience (Newsletter List)
        // Note: You must create an "Audience" in the Resend Dashboard first
        await resend.contacts.create({
            email: email,
            unsubscribed: false,
            audienceId: 'your-audience-id-here',
        });

        // 2. Send immediate confirmation/welcome email
        await resend.emails.send({
            from: 'Logomust.com <contact@logomust.com>',
            to: email,
            subject: '🎨 You’re on the list!',
            html: `
        <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 20px;">
          <h1 style="color: #9B1B1B;">Logomust Insider</h1>
          <p>Thanks for joining. We'll send you new logo templates and branding tips once a week.</p>
          <a href="https://logomust.com" style="background: #9B1B1B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Browse New Templates</a>
        </div>
      `
        });

        // 3. Optionally, you can also notify the admin about the new subscriber
        await resend.emails.send({
            from: 'Logomust.com <contact@logomust.com>',
            to: process.env.ADMIN_EMAIL || 'contact@logomust.com',
            subject: 'New Newsletter Subscriber',
            html: `
        <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 20px;">
          <h1 style="color: #9B1B1B;">New Subscriber</h1>
          <p>A new user has subscribed to the newsletter:</p>
          <p><strong>Email:</strong> ${email}</p>
        </div>
      `
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
    }
}