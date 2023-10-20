
"use client"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Billboard } from "@prisma/client";
import { Trash } from "lucide-react";
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/alert-modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1),
    sale: z.boolean().optional(),
    discount: z.coerce.number().optional(),
});


type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
    initialData: Category | null;
    billboards: Billboard[];
    sale?: boolean;
    discount?: number;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
    initialData,
    billboards,
    sale,
    discount
}) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit category" : "New category";
    const description = initialData ? "Edit Category" : "Add a new category";
    const toastMessage = initialData ? "Category updated" : "Category created";
    const action = initialData ? "Save changes" : "Create";

    const discountArr = [10, 15, 20, 25, 30, 40, 50]

    const params = useParams();
    const router = useRouter();
    // const form = useForm<CategoryFormValues>({
    //     resolver: zodResolver(formSchema),
    //     defaultValues: initialData || {
    //         name: '',
    //         billboardId: '',
    //         sale: false,
    //         discount: '10',
    //     },
    // });
    const defaultValues = initialData ? {
        name: initialData.name,
        billboardId: initialData.billboardId,
        sale: initialData.sale,
        discount: initialData.discount ?? 0,
    } : {
        name: '',
        billboardId: '',
        sale: false,
        discount: 0,
    }
    

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues
      });

 
     
    

    console.log('initial value', initialData)

    const onSubmit = async (data: CategoryFormValues) => {
        const postData = { ...data };
        console.log('post data', postData)

        if (postData.sale === true && !postData.discount) {
            postData.discount = 10;  
        } 
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, postData);
            } else {
                await axios.post(`/api/${params.storeId}/categories`, postData);
            }
            router.refresh();
            router.push(`/${params.storeId}/categories`);
            toast.success(toastMessage);
        } catch (error) {
            console.error("Error submitting data:", error);  // Log the error for debugging
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }
    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            router.refresh();
            router.push(`/${params.storeId}/categories}`)
            toast.success("Category deleted")
        } catch (error) {
            toast.error("Make sureyou removed all products using this category.")
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
                    <Button disabled={loading} variant="destructive" size="icon" onClick={() => setOpen(true)}>
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
                                    <Input disabled={loading} placeholder="Category name" {...field}></Input>
                                </FormControl>
                            </FormItem>
                        )}></FormField>
                        <FormField control={form.control} name="billboardId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Billboard</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder="Select a billboard"></SelectValue>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {billboards.map((billboard) => (
                                            <SelectItem key={billboard.id} value={billboard.id}>
                                                {billboard.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}></FormField>

                        <FormField control={form.control} name="sale" render={({ field: checkboxField }) => (
                            
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                
                                <FormControl>
                                    <Checkbox
                                        checked={checkboxField.value}
                                        onCheckedChange={checkboxField.onChange}
                                    />
                                </FormControl>
                                <FormDescription>Apply discount for every product in this category </FormDescription>

                                {checkboxField.value && (
                                    <FormField control={form.control} name="discount" render={({ field: selectField }) => (
                                        <FormItem>
                                            <FormLabel>Sale</FormLabel>
                                            <Select
                                                disabled={loading}
                                                onValueChange={selectField.onChange}
                                                value={selectField.value?.toString()}
                                                defaultValue={selectField.value?.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue defaultValue={selectField.value} placeholder="Select a discount"  ></SelectValue>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {discountArr.map((discount) => (
                                                        <SelectItem key={discount} value={discount.toString()}>
                                                            {discount}%
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )} />
                                )}
                            </FormItem>
                        )} />



                    </div>
                    <Button disabled={loading} type="submit">{action}</Button>
                </form>
            </Form>
        </>
    )
}