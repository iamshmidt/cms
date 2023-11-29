
import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { stripe } from "@/lib/stripe"
import prismadb from "@/lib/prismadb"
import {  sendEmail } from "@/hooks/use-email"
import { SendEmailInterface} from "@/types";

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

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(', ');
console.log('addressString', addressString)
  if (event.type === "checkout.session.completed") {
    console.log('SUcccc')
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

    console.log('order', order)
  
    // Grouping the orders by month and summing the revenue
// Loop through each product and get the first image
order.orderItems.forEach(item => {
console.log('item', item.productId)
});
    
    //   if (!params.productId) {
  //     return new NextResponse("Product ID is required", { status: 400 })
  // }

  // for (const item of order.orderItems) {
  //   try {
  //     const product = await prismadb.product.findUnique({
  //       where: {
  //           id: item.productId
  //       },
  //       include: {
  //           images: true,
  //           category: true,
  //           size: true,
  //           color: true,
  //       }});


    const productIds = order.orderItems.map((orderItem) => orderItem.productId);
    const amountProducts = order.orderItems.map((orderItem) => orderItem.amount);
    let imageUrls: string[] = [];
for (const item of productIds) {
  console.log('item', item)
  //get images from prismadb
  const product = await prismadb.product.findUnique({
    where: {
        id: item
    },
    include: {
        images: true,
        category: true,
        size: true,
        color: true,
    }});
    console.log('product', product)
 
    const imageUrl = product?.images[0]?.url || '';
    imageUrls.push(imageUrl);
    console.log('image', imageUrls)
        // send email to admin
        const adminEmail = process.env.ADMIN_EMAIL || 'yuliia.shmidt@gmail.com';
        console.log('adminEmail', adminEmail)
         // Prepare the email details
         const emailDetails: SendEmailInterface = {
          order_id: order.id,
          amount: order.amount,
          address: order.address,
          date_:order.createdAt,
          from:order.email,
          cust_name: order.firstName,
          cust_lname: order.lastName,
          to: adminEmail,
          images: imageUrls,
          subject: 'Your order is complete!',
          text: `Thank you for your order. Your order is now complete and will be shipped to you shortly.`
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
    // const productDetail = {
    //   id: product?.id,
    //   name: product?.name,
    //   price: product?.price,
    //   description: product?.description,
    //   image,
    //   category: product?.category?.name,
    //   size: product?.size?.name,
    //   color: product?.color?.name,
    //   amount: order.amount,
    // };
    // console.log('productDetail', productDetail)
    // const productDetails = [productDetail];
    // console.log('productDetails', productDetails)
    // // Prepare the email details
    // const emailDetails: SendEmailInterface = {
    //   order_id: order.id,
    //   amount: order.amount,
    //   address: order.address,
    //   date_:order.createdAt,
    //   from:order.email,
    //   cust_name: order.firstName,
    //   cust_lname: order.lastName,
    //   to: order.email,
    //   subject: 'Your order is complete!',
    //   text: `Thank you for your order. Your order is now complete and will be shipped to you shortly.`,
    //   productDetails
    // };
    // console.log('emailDetails', emailDetails)
    // if (emailDetails.to) {
    //   console.log('Sending email...', emailDetails)
    //   try {
    //     await sendEmail(emailDetails);
    //     console.log('Email sent successfully');
    //   } catch (error) {
    //     console.error('Failed to send email', error);
    //   }
    // }
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