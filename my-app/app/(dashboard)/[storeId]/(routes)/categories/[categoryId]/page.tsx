import prismadb from "@/lib/prismadb";
import { CategoryForm } from "./components/category-form";

const CategoryPage = async ({
    params
}: { params: { categoryId: string, storeId:string } }) => {
    const category = await prismadb.category.findUnique({
        where: {
            id: params.categoryId
        }
    })

    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId
        }
    })
    return (
        <div className="flex-col px-4">
            <div className="flex-1 space-y-4 p-8 pt-6"></div>
            <CategoryForm billboards={billboards} initialData={category}></CategoryForm>
        </div>
    );
}

export default CategoryPage;