
import prismadb from "@/lib/prismadb";
import { ProductClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import {CustomerInfo} from "./components/columns-customer";
import {Customer} from "./components/client";
import {format} from 'date-fns';
import { formatter } from "@/lib/utils";

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
    console.log('orders', order.map(item => item.status));


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

    const formattedProduct: OrderColumn[] = products.map((item, index) => ({
        id: item.id,
        name: item.name,
        quantity: orders[index].amount,
        price: formatter.format(item.price.toNumber()),
        category: item.category.name,
        size: item.size.name,
        color: item.color.value,
        createdAt: format(item.createdAt, 'MMMM do, yyyy'),
        total: formatter.format(
            (item.priceAfterDiscount.toNumber() > 0 
              ? item.priceAfterDiscount.toNumber() 
              : item.price.toNumber()) * orders[index].amount
          ),
        status: statusOrder,
        trackingNumber: trackingNumber_[index] ?? '',
      }));

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
