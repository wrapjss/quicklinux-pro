import { text,json } from '@sveltejs/kit';
import * as sessions from '$lib/sessions';
// @ts-expect-error
import mac from "node-macaddress";
let secretKey = btoa(mac.one());
import { db } from '$lib/db';
import jwt, { type JwtPayload } from "jsonwebtoken";
export async function POST({ request, cookies }) {
    let { token,containerProps,seedOnly = false } = await request.json();
    if (token && jwt.decode(token)) {
        let d: string | JwtPayload = jwt.verify(token,secretKey,undefined)
        if (!d || typeof d == "string" ) {return json({"error":"Invalid JWT token"},{"status":400})}
        if (!d.exp || Date.now() > d.exp * 1000) {return json({"error":"Invalid JWT token"},{"status":400})}
        let jwtAdmin = (await db.settings.findFirst({where: {user: {username: d.username }}}))?.hasAdmin
        if (!jwtAdmin) {
            return json({"error":"You do not have permission to do this."},{"status":403})
        }
        if (!containerProps || typeof containerProps != "object" || !sessions.isContainerProps(containerProps)) {
            return json({"error":"Invalid container properties"},{"status":400})
        }
        await sessions.seedContainer(containerProps,seedOnly)
        return json({},{"status":200})
    }else {
        return json({"error":"No JWT token provided or it is invalid"},{"status":400})
    }
    
}