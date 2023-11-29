import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { products } = await req.json();
console.log('POSTTT')
  console.log( products, 'products')

  interface Product {
    id: string;
    amount: number;
    quantity: number;
  }
  
  const productsIds: string[] = products.map((product: Product) => product.id);


  const productDetails: Product[] = products.map((product: Product) => ({
    id: product.id,
    amount: product.amount,
    quantity: product.quantity,
  }));


  if (!productsIds || productsIds.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  const orderItemsToCreate = productDetails.map((productDetail:any) => ({
    product: {
      connect: { id: productDetail.id },
    },
    amount: productDetail.amount,
  }));


// Calculate the total order amount by summing the amounts of order items
const totalOrderAmount = orderItemsToCreate.reduce((total:any, item:any) => total + item.amount, 0);


  const products_ = await prismadb.product.findMany({
    where: {
      id: {
        in: productsIds
      }
    },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
 
  products_.forEach((product) => {
    const matchingProductDetails = productDetails.find((item) => product.id === item.id);

    line_items.push({
      quantity: matchingProductDetails ? matchingProductDetails.amount : 1,
      price_data: {
        currency: 'USD',
        product_data: {
          name: product.name,
        },
        unit_amount: product.price.toNumber() * 100
      }
    });
  });
  

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: orderItemsToCreate,
      },
      amount: totalOrderAmount,  // Update the order amount
    },
  });

  // const calculation = await stripe.tax.calculations.create({
  //   currency: 'usd',
  //   line_items: [
  //     {
  //       amount: 1000,
  //       reference: 'L1',
  //     },
  //   ],
  //   customer_details: {
  //     address: {
  //       line1: '920 5th Ave',
  //       city: 'Seattle',
  //       state: 'WA',
  //       postal_code: '98104',
  //       country: 'US',
  //     },
  //     address_source: 'shipping',
  //   },
  
  // })

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    billing_address_collection: 'required',
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id
    },
    
    automatic_tax: {
      enabled: true,
    },
  });

  return NextResponse.json({ url: session.url}, {
    headers: corsHeaders
  });
};