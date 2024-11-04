import { json,text } from '@sveltejs/kit';
import * as auth from "$lib/auth.ts";
// @ts-expect-error shut up
import mac from "node-macaddress";
let secretKey = btoa(mac.one());
import jwt from "jsonwebtoken";
import { error } from '@sveltejs/kit';
import { db } from '$lib/db';

export async function POST({ request, cookies }) {
    const { username,password } = await request.json();
    if ((password.length != 128 || !/^[0-9a-f]+$/.test(password))) {
        return text("ERR: Invalid hash",{status:400})
    }
    if (!await auth.userExists(undefined,username)) {
        return text("ERR: User does not exist",{status:400})
    }
    
    let user = await db.user.findFirst({
        where: {
            OR: [
                { username: username }
            ]
        }
    });
    if (!user) {
        return text("ERR: User does not exist",{status:400})
    }
    if (user.password != password) {return text("ERR: Password is incorrect",{status:400})}

    const token = jwt.sign({ username,password,"MAGIC":Date.now() }, secretKey, { expiresIn: '6h' });
    return text(token);
}
