
export async function sha256hash(s: string) {
    const textAsBuffer = new TextEncoder().encode(s);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", textAsBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray
      .map((item) => item.toString(16).padStart(2, "0"))
      .join("");
    return hash;
}

export async function sha512hash(s: string) {
    const textAsBuffer = new TextEncoder().encode(s);
    const hashBuffer = await window.crypto.subtle.digest("SHA-512", textAsBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray
      .map((item) => item.toString(16).padStart(2, "0"))
      .join("");
    return hash;
}
