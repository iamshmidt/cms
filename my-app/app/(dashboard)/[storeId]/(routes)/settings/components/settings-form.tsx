
"use client"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel,  } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import { Trash } from "lucide-react";
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
    initialData: Store;
}

const formSchema = z.object({
    name: z.string().min(1),
  });

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({
    initialData,
}) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();
    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const onSubmit = async(data: SettingsFormValues) => {
        try {
            setLoading(true)
            await axios.patch(`/api/stores/${params.storeId}`, data)
            router.refresh();
            toast.success("Store updated")
        } catch (error) {
            toast.error("Something went wrong")
        } finally{
            setLoading(false)
        }
    }
    const onDelete = async() => {
        try {
            setLoading(true)
            await axios.delete(`/api/stores/${params.storeId}`)
            router.refresh();
            router.push("/")
            toast.success("Store deleted")
        } catch (error) {
            toast.error("Make sureyou removed all products and categories first.")
        } finally{
            setLoading(false)
        }
    }
    return(
        <>
        <AlertModal loading={loading} isOpen={open} onClose={()=>setOpen(false)} onConfirm={onDelete}></AlertModal>
        <div className="flex items-center justify-between">
            <Heading title="Settings" description="Manage store preferences"></Heading>
            <Button disabled={loading} variant="destructive" size="icon" onClick={()=>setOpen(true)}>
                <Trash className="h-4 w-4"></Trash>
            </Button>
        </div>
        <Separator></Separator>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <div className="grid grid-cols-3 gap-8">
                    <FormField control={form.control} name="name" render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Store name" {...field}></Input>
                                </FormControl>
                        </FormItem>
                    )}></FormField>
                </div>
                <Button disabled={loading} type="submit">Save changes</Button>
            </form>
        </Form>
        <Separator></Separator>
        <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant="public"></ApiAlert>
        </>
    )
}