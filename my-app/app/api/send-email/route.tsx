
import React from "react";
import {EmailTemplate}  from '@/components/email/notify-admin';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const adminEmail = process.env.ADMIN_EMAIL || 'yuliia.shmidt@gmail.com';
export async function POST(
  req: Request,
    { params }: { params: { storeId: string }}
) {
  try {
    const requestBody = await req.json();
    console.log('requestBody', requestBody)
    const { data, error } = await resend.emails.send({
        from: 'OxxyKnits <onboarding@resend.dev>',
        // to: ['yuliia.shmidt@gmail.com'],
        to: [adminEmail, requestBody.from || 'yuliia.shmidt@gmail.com'],
        subject: requestBody?.subject,
        react: EmailTemplate({  orderNumber: requestBody.orderNumber,
          amount: requestBody?.amount,
          address: requestBody?.address,
          date_: requestBody?.date,
          from: requestBody?.from,
          cust_name: requestBody?.cust_name,
          cust_lname: requestBody?.cust_lname,
          to: requestBody?.to,
          subject: requestBody?.subject,
          text: requestBody?.text,
          product: requestBody?.product,
          total: requestBody?.total,
          tracking: requestBody?.tracking,
        }) as React.ReactElement,
    });

    console.log('data', data)
    if (error) {
      return NextResponse.json({ error });
    }
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error });
  }
}