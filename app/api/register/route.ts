import client from '@/app/libs/prismadb';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try{
        const {email, name, password} = await req.json()
    
        if(!email || !name || !password){
            return new NextResponse('Missing info',{ status: 400} )
        }
    
        const hashPassword = await bcrypt.hash(password, 12)
    
        const user = await client.user.create({
            data:{
                email,
                name,
                hashPassword
            }
        });
    
        return NextResponse.json(user)
    } catch(error : any){
        console.log(error.message)
        return new NextResponse(`${error.message}`,{ status: 500} )
    }

}