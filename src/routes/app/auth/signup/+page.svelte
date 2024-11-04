<script lang="js">
  // @ts-nocheck
	import { afterUpdate, onMount } from "svelte";
  import { pswRegex, usrRegex } from "$lib/auth.ts"
  import { sha256hash,sha512hash } from "$lib/crypto";
onMount(()=>{
    setInterval(()=>{
      // @ts-expect-error
      authModal.showModal();
    }, 100)
    document.querySelector(".btn-primary").addEventListener("click",()=>{signup()})
})
async function signup() {
let psw = document.querySelector(".password").value
let usr = document.querySelector(".username").value
if (!psw || !usr) {return}
      if (!RegExp(pswRegex).test(psw) || !RegExp(usrRegex).test(usr)) {
        alert("Username or password do not meet requirements");return;
      }
      let res = await fetch("/api/auth/signup",{"method":"POST","body":JSON.stringify({
        // @ts-expect-error
        "email":await sha256hash(document.querySelector(".email").value),
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
<button class="btn" onclick="authModal.showModal();">Show Login Modal</button>
<dialog id="authModal" class="modal backdrop-blur modal-bottom md:modal-middle">
  
  <div class="modal-box">
    <h3 class="text-lg font-bold">Hello!</h3>
    
        <label for="email">Email:</label>
        <input name="email" type="email" required placeholder="wedontsendyouspam@rare1k.dev" class="mb-2 input v bg-base-300 eml input-bordered !border-none w-full max-w-xs email" />
        <br> 
        <label for="username">Username:</label>
        <div class="tooltip" data-tip="Must be 2-16 characters, be alphanumeric. Underscores are allowed.">
        <input name="username" type="username" required pattern={usrRegex} placeholder="johndoe123" class="mb-2 input v usr bg-base-300 input-bordered !border-none w-full max-w-xs username" />
        </div>
        <br>
        <label for="password">Password:</label>
        <div class="tooltip" data-tip="Must be atleast 10 characters, and have atleast one uppercase letter and atleast one number">
        <input name="password" required pattern={pswRegex} type="password" placeholder="Shh! It's a secret!" class="v psw input bg-base-300  input-bordered !border-none w-full max-w-xs password" />
        </div>
  
    <div class="modal-action">
      <!-- <form method="dialog">-->
        <button class="btn btn-primary !px-6">Signup</button>
        <a href="/app/auth/login" class="btn !px-6">Login</a>
      <!-- </form>-->
    </div>
  </div>
</dialog>