"use client"

import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { FaRegCheckSquare } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation"
import { OrderColumn, columns } from "./columns"
import { CustomerInfo, customerColumn } from "./columns-customer"
import { Form, FormControl, FormField, FormItem, FormLabel, } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { useState } from "react";
import { DataTable } from "@/components/ui/data-table"
import ApiList from "@/components/ui/api-list"
import { z } from "zod";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import AlertModal from "@/components/modals/alert-modal";
import { sendEmail } from "@/hooks/use-email"
import { ProductEmail, SendEmailInterface } from "@/types"

const frontend_url = process.env.FRONTEND_STORE_URL;
interface ProductClientProps {
    data: OrderColumn[]
}

interface CustomerInfoProps {
    data: CustomerInfo[]
 }

 const formSchema = z.object({
    value: z.string()
        .min(10, { message: "Tracking number must be at least 10 characters long" }) // Assuming a minimum length of 10
        .regex(/^[A-Z0-9]{10,}$/, { // Assuming the tracking number is alphanumeric and at least 10 characters
            message: 'Tracking number must be alphanumeric and at least 10 characters long'
        }),
});

type trackingValues = z.infer<typeof formSchema>;


export const ProductClient: React.FC<ProductClientProps> = ({
    data
}) => {
const trackingNumbers = data?.map(orderColumn => orderColumn.trackingNumber) || '';
const statusOrder = data?.map(orderColumn => orderColumn.status) || '';
console.log(data[0].orderNumber)
const form = useForm<trackingValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        value: trackingNumbers[0] || ''
    },
});
const params = useParams();
const router = useRouter();
const [open, setOpen] = useState(false)
const [loading, setLoading] = useState(false)
const toastMessage = trackingNumbers[0] !== '' ? "Tracking added" : "Tracking updated";

const productEmailDetails:ProductEmail[] = data?.map((orderItem) => {
    const imageUrl = orderItem.images?.[0] || '';

    const productUrl = frontend_url + '/product/' + (orderItem.id || '');


    return {
      name: orderItem.name || '',
      price: orderItem.price,
      url: productUrl,
      image: imageUrl,
      product_url: productUrl,
      amount: orderItem.quantity || 1,
        
    };
});
console.log(productEmailDetails);



const emailDetails: SendEmailInterface = {
    // order_id: params.orderId.toString(),
    // amount: totalPrice(),
    orderNumber: data[0]?.orderNumber || 0,
    address: data[0]?.customer?.address || '',
    date_: data[0]?.createdAt || '',
    from: data[0]?.customer?.email || '',
    cust_name: data[0]?.customer?.name || '',
    cust_lname: data[0]?.customer?.name || '',
    to: data[0]?.customer?.email || '',
    subject: 'Your order is shipped!',
    text: `tracking number: ${trackingNumbers[0]}`,
    product: productEmailDetails,
    tracking: trackingNumbers[0],
    // total: totalPrice(),
  };


const onSubmit = async (data: trackingValues) => {

    try {
        setLoading(true)
            await axios.patch(`/api/${params.storeId}/orders/${params.orderId}`,  { trackingNumber: data.value, status: 'shipped' })
        
        router.refresh();
        toast.success(toastMessage)
    } catch (error) {
        toast.error("Something went wrong")
    } finally {
        setLoading(false)
    }
}

const notifyCustomer = async () => {
    try {
        // setLoading(true)
        if(data){
            // await sendEmail(emailDetails);
        }
        const datss = await sendEmail(emailDetails);
        console.log(datss)
        // await axios.post(`/api/${params.storeId}/orders/${params.orderId}/notify`)
        toast.success("Customer notified")
    } catch (error) {
        toast.error("Something went wrong")
    } finally {
        setLoading(false)
    }

}
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Items (${data.length})`} description=""></Heading>
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full pt-4 pb-4">
                 
                    <div className="grid grid-cols-3 gap-8">
                              <FormField control={form.control} name="value" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tracking Number</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-x-4">
                                    <Input disabled={loading} placeholder="Add tracking number" {...field}></Input>
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}></FormField>
                          <FormItem>
                                <FormLabel>Order Status</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-x-4">
                                        {statusOrder[0]} 

                                    </div>
                                </FormControl>
                            </FormItem>
                    </div>
                    <Button disabled={loading} type="submit">Submit</Button>
                    <Button disabled={loading} onClick={notifyCustomer} type="button"  className="ml-3">Notify Customer</Button>
                </form>
            </Form>
            <DataTable searchKey="name" columns={columns} data={data}></DataTable>
        </>
    )
}



export const Customer: React.FC<CustomerInfoProps> = ({
    data
}) => {

    return (
        <>
            <div className="flex items-center justify-between">
                {/* <Heading title={`Items (${data.length})`} description=""></Heading> */}
            </div>
            <Separator />
            <DataTable searchKey="name" columns={customerColumn} data={data}></DataTable>
        </>
    )
}