
import prismadb from "@/lib/prismadb";
import { ProductClient } from "./components/client";
import { CustomerInfoEmail, OrderColumn } from "./components/columns";
import {CustomerInfo} from "./components/columns-customer";
import {Customer} from "./components/client";
import {format} from 'date-fns';
import { formatter } from "@/lib/utils";
import { ProductEmail } from "@/types";

const ProductsPage = async ({
    params,
}: { params: { orderId:string, storeId: string } }) => {

    const orders = await prismadb.orderItem.findMany({
        where: {
            orderId: params.orderId,
        },
        include: {
            product:true,
        },
    })



    const order = await prismadb.order.findMany({
        where: {
            id: params.orderId,
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    console.log('orders', order);

    // const productEmailDetails: ProductEmail[] = order.orderItems.map((orderItem) => {
    //     // Find the image URL for this product
    //     const imageUrl = imageDetails.get(orderItem.productId) || '';
    //     const price = orderItem.product.priceAfterDiscount.toNumber() > 0 ? orderItem.product.priceAfterDiscount.toNumber() : orderItem.product.price.toNumber();
    //     total += price * orderItem.amount;
    //     return {
    //       name: orderItem.product.name || '',
    //       price: orderItem.product.priceAfterDiscount.toNumber() > 0 ? orderItem.product.priceAfterDiscount.toNumber() : orderItem.product.price.toNumber(),
    //       url: process.env.FRONTEND_STORE_URL + '/product/' + orderItem.product.id || '',
    //       image: imageUrl, // Use the correct image URL
    //       product_url: process.env.FRONTEND_STORE_URL + '/product/' + orderItem.product.id || '',
    //       amount: orderItem.amount || 1,
  
    //     };
    //   });
    const productIds = orders.map(order => order.productId);

    const products = await prismadb.product.findMany({
        where: {
            id: {
                in: productIds
              }
        },
        include: {
            category:true,
            size:true,
            color:true,
            images: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

        const calculateCostPerItem = (quantity: number, price: number) => {
        return quantity * price;
      };
    
      const totalPrice = () => {
        let totalCost = 0;
        products.forEach(item => {
          totalCost += calculateCostPerItem(item.amount, Number(item.price));
        });
        return totalCost; 
      }

    //   order.map(item => item.status)
    const statusOrder = order.map(item => item.status);
    const trackingNumber_ = order.map(item => item.trackingNumber);

    const customer_info:CustomerInfoEmail[]= order.map((item, index) => ({
        name: item.firstName,
        email: item.email,
        phone: item.phone,
        address: item.address,
    }))

    const formattedProduct = products.map((item, index) => {
        // Assuming 'orders' array corresponds to 'products' array by index
        const orderItem = orders[index];
    
        // Calculate price
        const price = item.priceAfterDiscount.toNumber() > 0 ? item.priceAfterDiscount.toNumber() : item.price.toNumber();
    
        return {
            id: item.id,
            name: item.name,
            quantity: orderItem.amount, // Assuming 'amount' exists on orderItem
            price: formatter.format(price),
            category: item.category.name,
            images: item.images.map(image => image.url),
            size: item.size.name,
            color: item.color.value,
            createdAt: format(item.createdAt, 'MMMM do, yyyy'),
            total: formatter.format(price * orderItem.amount),
            status: statusOrder.toString(),
            trackingNumber: trackingNumber_[index] ?? '',
            customer: customer_info[index],
        };
    });
    

      console.log('products',products)
    

      const totalOfTotals = formattedProduct.reduce((total, product) => {
        return total + parseFloat(product.total.replace(/[^0-9.-]+/g, ''));
      }, 0);
      

    const formattedClient: CustomerInfo[] = order.map((item, index) => ({
        phone: item.phone,
        address: item.address,
        email: item.email,
        name: item.firstName,
        lastName: item.lastName,
        totalPrice: formatter.format(totalOfTotals),
      }));


    return (

        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">

                <ProductClient data={formattedProduct}></ProductClient>
                <Customer data={formattedClient}></Customer>
            </div>
        </div>
    );
}
export default ProductsPage;
