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
  console.log('products: ', products)

  const productsIds = products.map((product: any) => product.id);
  console.log('productsIds: ', productsIds)

  const productDetails = products.map((product: any) => ({
    productId: product.id,
    amount: product.amount,
    quantity: product.quantity,
  }));

  console.log('productDetails: ', productDetails)

  if (!productsIds || productsIds.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  const orderItemsToCreate = productDetails.map((productDetail:any) => ({
    product: {
      connect: { id: productDetail.productId },
    },
    amount: productDetail.amount,
  }));

// Calculate the total order quantity by summing the quantities of order items
const totalOrderQuantity = orderItemsToCreate.reduce((total:any, item:any) => total + item.quantity, 0);

// Calculate the total order amount by summing the amounts of order items
const totalOrderAmount = orderItemsToCreate.reduce((total:any, item:any) => total + item.amount, 0);


  const products_ = await prismadb.product.findMany({
    where: {
      id: {
        in: productsIds
      }
    }
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];


  products_.forEach((product) => {
    line_items.push({
      quantity:product.amount,//change this later
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

  console.log(order)

  
  // const order = await prismadb.order.create({
  //   data: {
  //     storeId: params.storeId,
  //     isPaid: false,
  //     orderItems: {
  //       create: orderItemsToCreate,
  //     },
  //     amount: totalOrderQuantity,  // Update the order amount to be the total quantity
  //   },
  // });


// Iterate through each order and display details


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
  });

  return NextResponse.json({ url: session.url }, {
    headers: corsHeaders
  });
};