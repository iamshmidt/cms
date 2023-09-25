
"use client"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
import { Trash } from "lucide-react";
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/alert-modal";

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(4).regex(/^#/, {
        message: 'String must be a valid hex code'
    }),
});


type ColorFormValues = z.infer<typeof formSchema>;

interface ColorFormProps {
    initialData: Color | null;
}

export const ColorForm: React.FC<ColorFormProps> = ({
    initialData,
}) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit color" : "New color";
    const description = initialData ? "Edit color" : "Add a new color";
    const toastMessage = initialData ? "color updated" : "color created";
    const action = initialData ? "Save changes" : "Create";

    const params = useParams();
    const router = useRouter();
    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        },
    });

    const onSubmit = async (data: ColorFormValues) => {
        try {
            setLoading(true)
            if(initialData){
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/colors`, data)
            }
            router.refresh();
            router.push(`/${params.storeId}/colors`)
            toast.success(toastMessage)
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }
    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
            router.refresh();
            router.push(`/${params.storeId}/colors}`)
            toast.success("color deleted")
        } catch (error) {
            toast.error("Make sure you removed all products using this color first.")
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            <AlertModal loading={loading} isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete}></AlertModal>
            <div className="flex items-center justify-between">
                <Heading title={title} description={description}></Heading>
                {initialData && (
                    <Button disabled={loading} variant="destructive" color="icon" size="icon" onClick={() => setOpen(true)}>
                        <Trash className="h-4 w-4"></Trash>
                    </Button>
                )}
            </div>
            <Separator></Separator>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full pt-4 pb-4">
                 
                    <div className="grid grid-cols-3 gap-8">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Color name" {...field}></Input>
                                </FormControl>
                            </FormItem>
                        )}></FormField>
                              <FormField control={form.control} name="value" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-x-4">
                                    <Input disabled={loading} placeholder="Color value" {...field}></Input>
                                    <div className="border p-4 rounded-full" style={{backgroundColor: field.value}}></div>
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}></FormField>
                    </div>
                    <Button disabled={loading} type="submit">{action}</Button>
                </form>
            </Form>
        </>
    )
}