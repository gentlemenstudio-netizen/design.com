import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = "https://logomust.com";

// 1. Welcome Email to User
export const sendWelcomeEmail = async (email: string, name: string) => {
    await resend.emails.send({
        from: 'Logomust <welcome@logomust.com>',
        to: email,
        subject: 'Welcome to the future of branding!',
        html: `<h1>Welcome ${name}!</h1><p>Start creating your logo at ${domain}</p>`
    });
};

// 2. Notification to Admin (New Registration)
export const sendAdminNotification = async (userName: string, userEmail: string) => {
    await resend.emails.send({
        from: 'System <system@logomust.com>',
        to: 'admin@logomust.com',
        subject: '🚀 New User Registered',
        html: `<p>New user joined: <b>${userName}</b> (${userEmail})</p>`
    });
};

// 3. Newsletter / Marketing
export const sendNewsletter = async (emails: string[], subject: string, content: string) => {
    await resend.emails.send({
        from: 'Niranjan from Logomust <news@logomust.com>',
        to: emails,
        subject: subject,
        html: content
    });
};