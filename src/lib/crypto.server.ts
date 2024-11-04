import crypto from 'crypto';
export function sha256hash(s: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(s);
    return hash.digest('hex');
}

export function sha512hash(s: string): string {
    
    const hash = crypto.createHash('sha512');
    hash.update(s);
    return hash.digest('hex');
}