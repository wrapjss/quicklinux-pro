import { db } from "./db.ts"
export const pswRegex = "^(?=.*[A-Z])(?=.*\\d).{10,}$"
export const usrRegex = "^[a-zA-Z0-9_]{1,16}$"
export async function userExists(email: string | undefined = undefined, username: string | undefined = undefined): Promise<boolean> {
    // Assuming hashed correctly
    const u = await db.user.findFirst({
        where: {
            OR: [
                { email: email },
                { username: username }
            ]
        }
    });
    return u !== null;
}

export async function createUser(email: string, username: string, password: string) {
    try {
      let l = await db.user.count()
        // Assuming hashed correctly
        const user = await db.user.create({
            data: {
                email: email,
                username: username,
                password: password,
                settings: {create: {
                    hasAdmin: l == 0,
                    displayName: username,
                }}
            },
            
        });

        return user;
    } catch (error:any) {
        throw new Error(`Failed to create user: ${error.message}`);
    }
}

/*
// @ts-expect-error
import mac from "node-macaddress";
let secretKey = btoa(mac.one());


export async function signup(email: string, username: string, password: string) {
    if (!new RegExp(usrRegex).test(username)) { return "\x01" }
    if (!new RegExp(pswRegex).test(username)) { return "\x02" }
    if (await userExists(sha256hash(email), username)) {
      return "\x00"
    } else {
      await createUser(email, username, password)
      const token = jwt.sign({ username, email }, secretKey, { expiresIn: '6h' });
      return token;
    }
  }
  
  export async function login(email: string, username: string, password: string) {
    if (!new RegExp(usrRegex).test(username)) { return "\x01" }
    if (!new RegExp(pswRegex).test(username)) { return "\x02" }
    if (await userExists(sha256hash(email), username)) {
      const token = jwt.sign({ username, email }, secretKey, { expiresIn: '6h' });
      return token;
    } else {
      return "\x00"
    }
  }
    */