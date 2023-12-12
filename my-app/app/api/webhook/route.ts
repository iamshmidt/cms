
import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { stripe } from "@/lib/stripe"
import prismadb from "@/lib/prismadb"
import { sendEmail } from "@/hooks/use-email"
import { SendEmailInterface } from "@/types";
import { ProductEmail } from "@/types"
import { format } from "date-fns";
import { formatter } from "@/lib/utils"

export async function POST(req: Request) {
  console.log('req', req)
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.log('error', error)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;
  console.log("session?.customer_details", session)

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country
  ];

  let productsEmailDetails: ProductEmail[] = [];


  const addressString = addressComponents.filter((c) => c !== null).join(', ');
  console.log('event', event)
  if (event.type === "checkout.session.completed") {
    const order = await prismadb.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session?.customer_details?.phone || '',
        email: session?.customer_details?.email || '',
        firstName: session?.customer_details?.name || '',
        lastName: session?.customer_details?.name || '',
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });


    console.log('order.orderItems', order.orderItems)
    const productIds = order.orderItems.map((orderItem) => orderItem.productId);
    const amountProducts = order.orderItems.map((orderItem) => orderItem.amount);
    const products = order.orderItems.map((orderItem) => orderItem.amount);
    interface Product {
      id: string;
      amount: number;
      price: number;
    }







    let total: number = 0; // Default price
    let imageDetails = new Map();
    for (const item of productIds) {
      const product = await prismadb.product.findUnique({
        where: { id: item },
        include: { images: true, category: true, size: true, color: true }
      });
      const imageUrl = product?.images[0]?.url || '';

      imageDetails.set(item, imageUrl); // Map the product ID to its image URL
    }
    const productEmailDetails: ProductEmail[] = order.orderItems.map((orderItem) => {
      // Find the image URL for this product
      const imageUrl = imageDetails.get(orderItem.productId) || '';
      const price = orderItem.product.priceAfterDiscount.toNumber() > 0 ? orderItem.product.priceAfterDiscount.toNumber() : orderItem.product.price.toNumber();
      total += price * orderItem.amount;
      return {
        name: orderItem.product.name || '',
        price: formatter.format(price),
        url: process.env.FRONTEND_STORE_URL + '/product/' + orderItem.product.id || '',
        image: imageUrl, // Use the correct image URL
        product_url: process.env.FRONTEND_STORE_URL + '/product/' + orderItem.product.id || '',
        amount: orderItem.amount || 1,
      };
    });

    const adminEmail = process.env.ADMIN_EMAIL || 'yuliia.shmidt@gmail.com';

    const emailDetails: SendEmailInterface = {
      orderNumber: order.orderNumber,
      amount: order.amount,
      address: order.address,
      date_: format(order.createdAt, 'MMMM do, yyyy'),
      from: order.email,
      cust_name: order.firstName,
      cust_lname: order.lastName,
      to: adminEmail,
      subject: 'Your order is complete!',
      text: `We've got your order! We'll drop you another email when your order ships.`,
      product: productEmailDetails,
      total: total,
    };

    if (emailDetails.to) {
      console.log('Sending email...', emailDetails)
      try {
        await sendEmail(emailDetails);
        console.log('Email sent successfully');
      } catch (error) {
        console.error('Failed to send email', error);
      }
    }


    // Update product quantities based on the amountProducts array
    await Promise.all(productIds.map(async (productId, index) => {
      await prismadb.product.update({
        where: {
          id: productId,
        },
        data: {
          isArchived: false,
          quantity: {
            decrement: amountProducts[index],  // Decrement by the corresponding amount
          }
        }
      });
    }));
  }

  return new NextResponse(null, { status: 200 });
};