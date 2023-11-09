import prismadb from "@/lib/prismadb";
import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import { format } from 'date-fns';
import { formatter } from "@/lib/utils";

const OrdersPage = async ({
    params,
}: { params: { storeId: string } }) => {
    const orders = await prismadb.order.findMany({
        where: {
            storeId: params.storeId,
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
    const productIds = orders.map(order => order.id);

    const products = await prismadb.product.findMany({
        where: {
            id: {
                in: productIds
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    interface OrderItem {
        formattedTotalPrice: string;
    }

    const formattedOrder1s: OrderItem[] = orders.map((item, index) => {
        const totalPriceForOrder = item.orderItems.reduce((total, orderItem) => {
            const itemPrice = orderItem.amount * Number(orderItem.product.price);
            return total + itemPrice;
        }, 0);
    
        const formattedTotalPrice = formatter.format(totalPriceForOrder); // Assuming formatter is a defined formatter object
    // console.log('formattedTotalPrice', formattedTotalPrice)
        return { formattedTotalPrice };
    });
    

    const formattedOrders: OrderColumn[] = orders.map((item, index) => ({
        id: item.id,
        phone: item.phone,
        address: item.address,
        amount: item.orderItems.length,
        orderId: item.id,
        productId: item.orderItems.map((item:any) => item.product.id).join(', '),
        products: item.orderItems.map((item:any) => item.product.name).join(', '),
        isPaid: item.isPaid,
        totalPrice: formattedOrder1s[index].formattedTotalPrice,
        createdAt: format(item.createdAt, 'MMMM dd, yyyy')
    }));

    const paidOrders = formattedOrders.filter(order => order.isPaid);
    console.log('paidOrders', paidOrders)

    return (

        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">

                <OrderClient data={paidOrders}></OrderClient>
            </div>
        </div>
    );
}

export default OrdersPage;