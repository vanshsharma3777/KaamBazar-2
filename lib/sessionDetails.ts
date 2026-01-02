import { auth } from "../lib/auth";

export async function sessionDeatils(){
    const session = await auth()
    return session
}