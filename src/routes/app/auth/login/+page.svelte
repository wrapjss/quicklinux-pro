<script lang="js">
  // @ts-nocheck
	import { onMount } from "svelte";
  import { pswRegex, usrRegex} from "$lib/auth.ts";
  import { sha256hash,sha512hash } from "$lib/crypto";
    onMount(()=>{
        setInterval(()=>{
        // @ts-expect-error
        authModal.showModal();
        },100)
        document.querySelector(".btn-primary").addEventListener("click",()=>{login()})
    });
    async function login() {
let psw = document.querySelector(".password").value
let usr = document.querySelector(".username").value
if (!psw || !usr) {return}
      if (!RegExp(pswRegex).test(psw) || !RegExp(usrRegex).test(usr)) {
        alert("Username or password do not meet requirements");return;
      }
      let res = await fetch("/api/auth/login",{"method":"POST","body":JSON.stringify({
        // @ts-expect-error
        "username":usr,
        // @ts-expect-error
        "password":await sha512hash(psw),
      })})
      if (!res.ok) {alert(await res.text())} else {
        localStorage["__jwt_auth"] = await res.text();
        localStorage["__jwt_user"] = usr;
        document.location = "/app"
      } 
    }
</script>
<dialog id="authModal" class="modal backdrop-blur modal-bottom md:modal-middle">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Welcome back!</h3>
    <p class="py-4">
        <label for="username">Username:</label>
        <input name="username" pattern={usrRegex} required type="username" placeholder="johndoe123" class="mb-2 v input bg-base-300 input-bordered !border-none w-full max-w-xs username" />
        <br>

        <label for="password">Password:</label>
        <input name="password" pattern={pswRegex} required type="password" placeholder="Shh! It's a secret!" class="v input bg-base-300 input-bordered !border-none w-full max-w-xs password" />
     
    </p>
    <div class="modal-action">
      <!-- <form method="dialog">-->
        <button class="btn btn-primary !px-6">Login</button>
        <a href="/app/auth/signup" class="btn !px-6">Signup</a>
      <!-- </form>-->
    </div>
  </div>
</dialog>