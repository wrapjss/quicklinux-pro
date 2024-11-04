import { text } from '@sveltejs/kit';
// @ts-expect-error
import mac from "node-macaddress";
let secretKey = btoa(mac.one());
import jwt, { type JwtPayload } from "jsonwebtoken";
export async function POST({ request, cookies }) {

    const token = await request.text(); // Get the JWT token from the request body
  
    if (!token) {
      return text('false');
    }
  
    try {
        if (token && jwt.decode(token)) {
          let gd: undefined | JwtPayload = undefined;
          jwt.verify(token,secretKey,undefined,(err,d)=>{
if (err || typeof d == "string" || !d) {console.log("Invalid token!");throw new Error();}
gd = d
          })
if (!gd) {return text("false")}
// @ts-expect-error
const expiry = gd.exp;        
if (!expiry) {return text("false")}
console.log(expiry * 1000,Date.now())
return text(String(Date.now() < expiry * 1000));
          }
          return text(String(false));
    } catch (error) {
      return text('false');
    }
    return text('true');
  }