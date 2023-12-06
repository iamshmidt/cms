import prismadb from "@/lib/prismadb";

export const getTotalRevenue=async(storeId:string)=>{
    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true,
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    });

   

    const totalRevenue = paidOrders.reduce((total, order)=>{
        const orderTotal = order.orderItems.reduce((orderSum:number, item:any)=>{
            const priceToUse = item.product.priceAfterDiscount.toNumber() > 0 ? item.product.priceAfterDiscount.toNumber() : item.product.price.toNumber();
            return orderSum + priceToUse;
        }, 0)
        return total + orderTotal;
    },0)

    return totalRevenue;
}