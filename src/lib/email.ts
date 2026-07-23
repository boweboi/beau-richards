import { Resend } from "resend";

// Server-only Resend client. RESEND_API_KEY is not prefixed with
// NEXT_PUBLIC_ so Next.js won't bundle it into client code, but importing
// this file from a "use client" component would still be a mistake to
// avoid — never do that.
const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_FROM = "TradieMatch <noreply@tradiematch.co.nz>";
const EMAIL_REPLY_TO = "support@tradiematch.co.nz";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const { data, error } = await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    html,
    replyTo: EMAIL_REPLY_TO,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
