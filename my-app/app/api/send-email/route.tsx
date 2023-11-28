

import { EmailTemplate } from '@/components/email/notify-admin';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  req: Request 
) {
  try {
    const requestBody = await req.json();
    console.log('requestBody', requestBody)
    const data = await resend.emails.send({
        from: 'OxxyKnits <onboarding@resend.dev>',
        to: ['yuliia.shmidt@gmail.com'],
        subject: 'Hello world',
        react: EmailTemplate({requestBody}) as React.ReactElement,
    });
console.log('data,', data)
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}