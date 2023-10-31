import getCurrentUser from "@/app/actions/getCurrentUser"
import client from "@/app/libs/prismadb"
import { NextResponse } from "next/server"

export async function POST(req:Request) {
    try{
        const currentUser = await getCurrentUser()
        const body = await req.json()
        const { name, image} = body

        if(!currentUser?.id){
            return new NextResponse("Unauthorized",{status:401})
        }

        const updateUser = await client.user.update({
            where:{
                id:currentUser.id
            },
            data:{
                image:image,
                name:name
            }
        })

        return NextResponse.json(updateUser)
    }catch(error : any){
        console.log(error, 'Error_settings')
        return new NextResponse("Internal Error",{ status : 500 })
    }
}