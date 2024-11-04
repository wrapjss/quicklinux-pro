/*
import * as auth from "$lib/auth.ts";
// @ts-expect-error shut up
import mac from "node-macaddress";
let secretKey = btoa(mac.one());
import jwt from "jsonwebtoken";
import { error } from '@sveltejs/kit';
import { db } from '$lib/db';
*/
import { text } from '@sveltejs/kit';
export async function GET({ request,params }) {
    console.log(params)
    const response = await fetch(decodeURIComponent(params.url));
    if (!response.ok) {
        return text("Non-ok status code.",{"status":500})
    }
    const contentType = response.headers.get('Content-Type');
    if (!contentType || ![
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp',
        'image/gif',
        'image/x-icon',
        'image/x-ms-bmp',
        'image/tiff'
    ].includes(contentType)) {
        return text("Not an image, recieved "+contentType,{"status":400})
    }
    return new Response(response.body, {
        headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=172800' // 48 hours in seconds
        }
    });
}
