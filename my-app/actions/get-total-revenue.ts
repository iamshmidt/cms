import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

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
    const totalRevenue = paidOrders.reduce((total, order) => {
        const orderTotal = order.orderItems.reduce((orderSum, item) => {
            console.log(item);
          return orderSum + item.product.price.toNumber();
        }, 0);
        return total + orderTotal;
      }, 0);

      const formattedOrder1s = paidOrders.map((item, index) => {
        const totalPriceForOrder = item.orderItems.reduce((total, orderItem) => {
            const priceToUse = orderItem.product.priceAfterDiscount.toNumber() > 0
                ? orderItem.product.priceAfterDiscount.toNumber()
                : orderItem.product.price.toNumber();

            const itemPrice = orderItem.amount * priceToUse;
            return total + itemPrice;
        }, 0);


        return  totalPriceForOrder ;
    });
console.log(formattedOrder1s)

const calculateTotalRevenue = formattedOrder1s.reduce((total, order) => {
    return total + order;
});
    
      return calculateTotalRevenue;

}