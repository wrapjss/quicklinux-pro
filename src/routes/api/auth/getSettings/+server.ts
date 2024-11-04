import { text,json } from '@sveltejs/kit';
import * as auth from "$lib/auth.ts";
import { db } from '$lib/db';
// @ts-expect-error
import mac from "node-macaddress";
let secretKey = btoa(mac.one());
import jwt, { type JwtPayload } from "jsonwebtoken";
export async function POST({ request, cookies }) {
    const { username,token } = await request.json(); 
    if (!await auth.userExists(undefined,username)) {
      return text("false")
  }
  
  let user = await db.user.findFirst({
      where: {
          OR: [
              { username: username }
          ]
      }
  });
  if (!user) {
    return json({"error":"This user does not exist"},{"status":400})
  }
  const settings = await db.settings.findFirst({
    where: {
      user: {
        id: user.id
      }
    }
  });
  
  if (token && jwt.decode(token)) {
    let d: string | JwtPayload = jwt.verify(token,secretKey,undefined)
    if (!d || typeof d == "string" ) {return json({"error":"Invalid JWT token"},{"status":400})}
    if (!d.exp || Date.now() > d.exp * 1000) {return json({"error":"Invalid JWT token"},{"status":400})}
    let jwtAdmin = (await db.settings.findFirst({where: {user: {username: d.username }}}))?.hasAdmin
    if (d.username != username && !jwtAdmin) {
      return json({"error":"You do not have permissions to view this user's settings."},{"status":403})
    }
  } else {
    return json({"error":"Invalid JWT token"},{"status":400})
  }
  return json(settings) 
}