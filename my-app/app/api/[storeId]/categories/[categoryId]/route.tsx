import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function GET (
    req: Request,
    {params} : {params: { categoryId: string}}
){
    try {
       
        if(!params.categoryId){
            return new NextResponse("Category ID is required", {status: 400})
        }
        

        const category = await prismadb.category.findUnique({
            where: {
                id: params.categoryId
            }, 
            include:{
                billboard: true,
            }
        })
        console.log(category)
        return NextResponse.json(category)
    } catch (error) {
        console.log('[category GET error: ', error)
        return new NextResponse("Internal error", {status: 500})
    }
}

export async function PATCH (
    req: Request,
    {params} : {params: {storeId: string, categoryId: string}}
){
    try {
        const {userId} = auth();
        const body = await req.json();
        const {name, billboardId, discount, sale} = body;
        console.log(body)
        if (!userId){
            return new NextResponse("Unauthorized", {status: 401})
        }
        if(!name){
            return new NextResponse("name is required", {status: 400})
        }
        if(!billboardId){
            return new NextResponse("billboard id is required", {status: 400})
        }
        if(!params.categoryId){
            return new NextResponse("category ID is required", {status: 400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("Unauthorized", { status: 403})
        }


        await prismadb.category.update({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                billboardId,
                sale,
                discount
            }
        });

        if (discount) {  // Only update product discount if it's present in the request body
            await prismadb.product.updateMany({
                where: {
                    categoryId:params.categoryId,
                },
                data: {
                    discount
                }
            });
        }

        return NextResponse.json({ message: "Category updated successfully!" });



    } catch (error) {
        console.log('[category PATCH error: ', error)
        return new NextResponse("Internal error", {status: 500})
    }
}

export async function DELETE (
    req: Request,
    {params} : {params: {storeId: string,  categoryId: string}}
){
    try {
        const {userId} = auth();
        if (!userId){
            return new NextResponse("Unauthorized", {status: 401})
        }
        if(!params.categoryId){
            return new NextResponse("category ID is required", {status: 400})
        }
        
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("Unauthorized", { status: 403})
        }


        const category = await prismadb.category.deleteMany({
            where: {
                id: params.categoryId
            }, 
        })
        return NextResponse.json(category)
    } catch (error) {
        console.log('[category DELETE error: ', error)
        return new NextResponse("Internal error", {status: 500})
    }
}