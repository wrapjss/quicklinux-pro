<script>
localStorage["__jwt_auth"] = undefined;
document.location = "/app/auth/login";
</script>
<div class="w-full h-[calc(100vh-64px)] flex flex-1  flex-col justify-center align-middle items-center">
    <h2 class="text-2xl font-bold text-primary">Goodbye!</h2>
    <br>
    <span class="loading loading-spinner loading-lg"></span>
</div>