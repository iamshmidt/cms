import prismadb from "@/lib/prismadb";
import { OrdersClient } from "./components/client";
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
                    product: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedOrders: OrderColumn[] = orders.map((item) => ({
        id: item.id,
        phone: item.phone,
        address: item.address,
        products: item.orderItems.map((item) => item.product.name).join(', '),
        isPaid: item.isPaid,
        totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
            return total + Number(item.product.price)
        }, 0)),
        createdAt: format(item.createdAt, 'MMMM dd, yyyy')
    }));
    return (

        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">

                <OrdersClient data={formattedOrders}></OrdersClient>
            </div>
        </div>
    );
}

export default OrdersPage;