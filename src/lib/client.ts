export async function validateAuth() {
    if (!localStorage["__jwt_auth"]) {
        document.location = "/app/auth/login"
        return false;
    } else {
            let valid = await (await fetch("/api/auth/check",{method:"POST",body:localStorage["__jwt_auth"]})).text();
            if (valid == "true") {
            return true;
            } else {
                document.location = "/app/auth/login"
                return false;
            }
    }
}