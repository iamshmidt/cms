
import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { stripe } from "@/lib/stripe"
import prismadb from "@/lib/prismadb"
import { sendEmail } from "@/hooks/use-email"
import { SendEmailInterface } from "@/types";
import { ProductEmail } from "@/types"
import { format } from "date-fns";

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

  let productsEmailDetails: ProductEmail[] = [];


  const addressString = addressComponents.filter((c) => c !== null).join(', ');
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

    console.log('order', order)


    const productIds = order.orderItems.map((orderItem) => orderItem.productId);
    const amountProducts = order.orderItems.map((orderItem) => orderItem.amount);


    let imageUrls: string[] = [];
    let prices: number[] = [];
    let price = 0; // Default price
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
        }
      });
      console.log('product', product)
      const imageUrl = product?.images[0]?.url || '';

      imageUrls.push(imageUrl);
      console.log('image', imageUrls)
      //   export interface ProductEmail {
      //     id: string;
      //     name: string;
      //     price: number;
      //     url: string;
      //     image: string;
      //     product_url: string;
      // }
      if (product) {
        // product is not null, safe to access its properties
        price = product.priceAfterDiscount && product.priceAfterDiscount.toNumber() > 0
          ? product.priceAfterDiscount.toNumber()
          : product.price.toNumber();
        prices.push(price)
      }

      const productEmailDetails: ProductEmail = {
        name: product?.name || '',
        price: price,
        url: process.env.FRONTEND_STORE_URL + '/product/' + product?.id || '',
        image: product?.images[0]?.url || '',
        product_url: process.env.FRONTEND_STORE_URL + '/product/' + product?.id || '',
      }

      productsEmailDetails.push(productEmailDetails);
      console.log('productsEmailDetails', productsEmailDetails) 
      // Check if product and its necessary fields are available
      if (product && product.price && product.discount) {
        if (product.discount > 0) {
          prices.push(product.priceAfterDiscount.toNumber())
        } else {
          prices.push(product.price.toNumber())
        }

      }



      let totalPrice = 0;
      for (const item of prices) {
        totalPrice += item;
      }

      // send email to admin
    

    }
    const total = productsEmailDetails.reduce((total, item) => total + item.price, 0);
    console.log('total', total)

    const adminEmail = process.env.ADMIN_EMAIL || 'yuliia.shmidt@gmail.com';

    const emailDetails: SendEmailInterface = {
      order_id: order.id,
      amount: order.amount,
      address: order.address,
      date_: format(order.createdAt, 'MMMM do, yyyy'),
      from: order.email,
      cust_name: order.firstName,
      cust_lname: order.lastName,
      to: adminEmail,
      subject: 'Your order is complete!',
      text: `Thank you for your order. Your order is now complete and will be shipped to you shortly.`,
      product:  productsEmailDetails,
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