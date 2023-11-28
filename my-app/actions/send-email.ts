

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { EmailTemplate } from '../components/email/notify-admin';
import { NextApiRequest, NextApiResponse } from 'next';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    // const requestBody = await req.json();  
    console.log('res',res)
    
    // console.log('requestBody', requestBody)
    const {data, error} = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['yuliia.shmidt@gmail.com'],
      subject: 'Hello world',
      react: EmailTemplate({ firstName: 'John' }) as React.ReactElement,
    });
    console.log('data', data)

    return NextResponse.json({data});
  } catch (error) {
    return NextResponse.json({ error });
  }
}