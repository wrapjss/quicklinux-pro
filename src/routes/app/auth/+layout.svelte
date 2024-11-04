<script lang="ts">
import { onMount } from "svelte";
onMount(async()=>{
    if (!localStorage["__jwt_auth"]) {
        return false;
    } else {
            let valid = await (await fetch("/api/auth/check",{method:"POST",body:localStorage["__jwt_auth"]})).text();
            if (valid == "true") {
            document.location = "/app/dash"
            return true;
            } else {
                return false;
            }
    }
});
</script>

<slot />