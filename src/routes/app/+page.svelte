<script lang="ts">
import { validateAuth } from "$lib/client";
(async()=>{
let v = await validateAuth()
console.log(v)
if (v == true) {
    document.location = "/app/dash/"
}})();
</script>

<div class="w-full h-[calc(100vh-64px)] flex flex-1  flex-col justify-center align-middle items-center">
    <h2 class="text-2xl font-bold text-primary">Authenticating...</h2>
    <br>
    <span class="loading loading-spinner loading-lg"></span>
</div>