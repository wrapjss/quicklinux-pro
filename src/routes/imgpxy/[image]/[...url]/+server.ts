/*
import * as auth from "$lib/auth.ts";
// @ts-expect-error shut up
import mac from "node-macaddress";
let secretKey = btoa(mac.one());
import jwt from "jsonwebtoken";
import { error } from '@sveltejs/kit';
import { db } from '$lib/db';
*/
import Jimp from "jimp";
import { text } from '@sveltejs/kit';
function imgParamsToObj(params:string) {
const obj: { [key: string]: string } = {};
params.split(';').forEach(param => {
    const [key, value] = param.split('=');
    obj[key] = value;
});
return obj;
}
export async function GET({ request,params }) {
    console.log(params)
    const response = await fetch(decodeURIComponent(params.url));
    if (!response.ok) {
        return text("Non-ok status code.",{"status":500})
    }
    let imgParams: { [key: string]: string }  = {}
    if (params.image != "unchanged") {
        imgParams = imgParamsToObj(params.image);
    }
    if (params.image == "unchanged") {
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
} else {
    const response = await fetch(decodeURIComponent(params.url), {
        method:"HEAD"
    });
    if (!response.ok) {
        return text("Non-ok status code.",{"status":500})
    }
    const contentType = response.headers.get('Content-Type');
    if (!contentType || ![
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/x-ms-bmp',
        'image/tiff'
    ].includes(contentType)) {
        if (imgParams.iKnow != "whatImDoing") {
        return text("Not an image, recieved "+contentType,{"status":400})
        }
    }
    const image = await Jimp.read(decodeURIComponent(params.url));
    if (imgParams.crop && imgParams.resize) {
        return text("Crop & resize are incompatible",{"status":400})
    }
    if (imgParams.crop) {
        const p = imgParams.crop.split(',');
        if (p.length == 4) {
            image.crop(parseInt(p[0]), parseInt(p[1]), parseInt(p[2]), parseInt(p[3]));
        } else if (p.length == 2){
            
            let s = [parseInt(p[0]), parseInt(p[1])]
            if (image.bitmap.width < s[0] || image.bitmap.height < s[1]) {
                image.resize(s[0], s[1],Jimp.RESIZE_BEZIER);
            }
            else {
            const centerX = image.bitmap.width / 2;
            const centerY = image.bitmap.height / 2;
            image.crop(centerX - s[0] / 2, centerY - s[1] / 2, s[0], s[1]);
            }
        }
        
    }
    if (imgParams.resize) {
        const p = imgParams.resize.split(',');
        if (p.length != 1 && p.length != 2) {
                return text("Invalid resize parameters.",{"status":400})
        }
        if (p.length == 1) {
            if (p[0] == "auto") {
                return text("Invalid resize parameters.",{"status":400})
            }
            image.scale(parseInt(p[0]));
        } else {
        if (p[0] == "auto") {
                const height = parseInt(p[1]);
                image.resize(Jimp.AUTO, height,Jimp.RESIZE_BEZIER);
        } else if (p[1] == "auto") {
                const width = parseInt(p[0]);
                image.resize(width, Jimp.AUTO,Jimp.RESIZE_BEZIER);
        } else {
            image.resize(parseInt(p[0]), parseInt(p[1]),Jimp.RESIZE_BEZIER);
        }
    }
    }
    if (imgParams.q) {
        image.quality(parseInt(imgParams.q));
    }
    if (imgParams.convert) {
        if (!["jpg","png","bmp","tiff","gif"].includes(imgParams.convert)) {
            return text("Invalid conversion type.",{"status":400})
        }
        let mime = "";
        switch (imgParams.convert) {
            case "jpg":
                mime = Jimp.MIME_JPEG;
                break;
            case "png":
                mime = Jimp.MIME_PNG;
                break;
            case "bmp":
                mime = Jimp.MIME_X_MS_BMP;
                break;
            case "tiff":
                mime = Jimp.MIME_TIFF;
                break;
            case "gif":
                mime = Jimp.MIME_GIF;
                break;
            case "dont" || "dontconvert" || "original" || "unchanged":
                mime = contentType || "";
                break;
    }
    return new Response(await image.getBufferAsync(mime), {
        headers: {
            'Content-Type': mime,
            'Cache-Control': 'public, max-age=172800' // 48 hours in seconds
        }
    });
}
}
}
