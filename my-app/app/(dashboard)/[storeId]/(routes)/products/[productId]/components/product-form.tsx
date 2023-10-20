
"use client"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product, Image, Category, Color, Size } from "@prisma/client";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  quantity: z.coerce.number().min(0).max(5),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  discount: z.coerce.number().min(0).max(100).optional(),
  priceAfterDiscount: z.coerce.number().min(0).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
  initialData: Product & {
    images: Image[]
  } | null;
  categories: Category[];
  colors: Color[];
  sizes: Size[];
  price: number;
  discount: number | null;
};


export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  colors,
  sizes,
  price,
  discount
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newPrice, setNewPrice] = useState(0);

  const title = initialData ? "Edit product" : "New product";
  const description = initialData ? "Edit product" : "Add a new product";
  const toastMessage = initialData ? "Product updated" : "Product created";
  const action = initialData ? "Save changes" : "Create";

  const params = useParams();
  const router = useRouter();



  const defaultValues = initialData ? {
    ...initialData,
    price: parseFloat(String(initialData?.price)),
    priceAfterDiscount: parseFloat(String(initialData?.priceAfterDiscount)),
    discount: parseFloat(String(initialData?.discount)),
  } : {
    name: '',
    images: [],
    price: 0,
    quantity: 0,
    categoryId: '',
    colorId: '',
    sizeId: '',
    isFeatured: false,
    isArchived: false,
    discount: 0,
    priceAfterDiscount: 0,
  }

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const { register, getValues, setValue, setError } = form;

  const changePrice = () => {
    const singleValue = form.getValues("price");
    const discountValue = form.getValues("discount");
    const priceAfterDiscount = form.getValues("priceAfterDiscount");
    if (discountValue !== null) {
      getDiscount()
    } else {
      setValue('priceAfterDiscount', singleValue);
    }
  }


  const getDiscount = () => {
    const discountValue = getValues("discount")
    const priceValue = getValues("price")
    if (discountValue !== undefined) {
      const discountedPrice = priceValue - (priceValue * discountValue / 100)
      if (discountedPrice < 0) {
        setError("priceAfterDiscount", {
          type: "manual",
          message: "Discounted price can't be negative."
        });
      } else {
        const formattedDiscountedPrice = parseFloat(discountedPrice.toFixed(2));
        setValue('priceAfterDiscount', formattedDiscountedPrice);
      }
    }
  }
  // check if selected catagory has discount 
  const checkCatDiscount = () => {
    const selectedCat = getValues("categoryId")
    const selectedCatDiscount = categories.find((cat) => cat.id === selectedCat)?.discount
    if (selectedCatDiscount !== undefined && selectedCatDiscount !== null && selectedCatDiscount !== 0) {
      toast.success(`This category has ${selectedCatDiscount}% discount on all products.`)
      setValue('discount', selectedCatDiscount);
    }
  }

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/products`, data)
      }
      router.refresh();
      router.push(`/${params.storeId}/products`)
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
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
      router.refresh();
      router.push(`/${params.storeId}/products}`)
      toast.success("Product deleted")
    } catch (error) {
      toast.error("Make sureyou removed all categories using this product.")
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <AlertModal loading={loading}  isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete}></AlertModal>
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
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) => field.onChange([...field.value, { url }])}
                    onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="9.99"
                      {...field}
                      {...register("price")}
                      onChange={(e) => {
                        field.onChange(e); // Ensure react-hook-form's onChange is called
                        changePrice(); // Then, your custom handler
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="0"
                      {...field}
                      {...register("discount")}
                      onChange={(e) => {
                        const parsedValue = parseFloat(e.target.value);
                        field.onChange(parsedValue);
                        getDiscount();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priceAfterDiscount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price After Discount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="0"
                      {...field}
                      {...register("priceAfterDiscount")}
                      // onChange={(e) => {
                      //   const parsedValue = parseFloat(e.target.value);
                      //   field.onChange(parsedValue);
                      // }}
                      // value={newPrice}
                      readOnly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select disabled={loading} onValueChange={(e) => { field.onChange(e); checkCatDiscount() }} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>{size.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>{color.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Featured
                    </FormLabel>
                    <FormDescription>
                      This product will appear on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Archived
                    </FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} type="submit">{action}</Button>
        </form>
      </Form>
    </>
  )
}