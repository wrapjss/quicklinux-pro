import { text,json } from '@sveltejs/kit';
// @ts-expect-error
import mac from "node-macaddress";
let secretKey = btoa(mac.one());
import { db } from '$lib/db';
import jwt, { type JwtPayload } from "jsonwebtoken";
export async function POST({ request, cookies }) {
    let { token } = await request.json();
    if (token && jwt.decode(token)) {
        let d: string | JwtPayload = jwt.verify(token,secretKey,undefined)
        if (!d || typeof d == "string" ) {return json({"error":"Invalid JWT token"},{"status":400})}
        if (!d.exp || Date.now() > d.exp * 1000) {return json({"error":"Invalid JWT token"},{"status":400})}
        let jwtAdmin = (await db.settings.findFirst({where: {user: {username: d.username }}}))?.hasAdmin
        if (!jwtAdmin) {
            return json({"error":"You do not have permission to do this."},{"status":403})
        }
    } else {
        return json({"error":"No JWT token provided or it is invalid"},{"status":400})
    }
    const users = Object(await db.user.findMany())
    const userSettings = Object(await db.settings.findMany())
    const sessions = await db.session.findMany();
    for (let i = 0; i < users.length; i++) {
        users[i].password = undefined;
        users[i].settings = userSettings[i];
        users[i].sessions = sessions.filter(session => session.userId === users[i].id);
    }
    return json(users)
}
