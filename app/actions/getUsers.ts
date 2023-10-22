import client from "../libs/prismadb"
import getSession from "./getSession"

const getUsers = async () =>{
    try{

        const session = await getSession()
        
        if(!session?.user?.email){
            return []
        }

        const users = await client.user.findMany({
            orderBy:{
                createdAt: 'desc',
            },
            where:{
                NOT: {
                    email: session.user.email
                }
            }
        }) 

        return users
    }catch(error){
        return []
    }
}


export default getUsers