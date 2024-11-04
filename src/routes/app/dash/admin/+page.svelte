
<script lang="ts">
  import { UserX,Crown,Gem,UserCog,Trash2 } from "lucide-svelte";
  import { validateAuth } from "$lib/client";
  import { onMount } from "svelte";
  import * as runner from "$lib/runners.client"
  onMount(async () => {
    await validateAuth();
    let r = await fetch("/api/auth/getSettings", {
      method: "POST",
      body: JSON.stringify({
        token: localStorage["__jwt_auth"],
        username: localStorage["__jwt_user"],
      }),
    });
    let rj = await r.json();
    if (!rj.hasAdmin) {
      document.location = "/app";
    }
    await listRunners();
  });
  async function listRunners() {
    let res = await fetch("/api/admin/runner/list", {
      method: "POST",
      body: JSON.stringify({
        token: localStorage["__jwt_auth"],
      }),
    });
    if (!res.ok) {
        // @ts-expect-error
        document.querySelector(".runnersList").innerText = `Error: ${res.status} ${res.statusText}`;
    } else {
    let r = await res.text();
    if (r) {
    // @ts-expect-error
    document.querySelector(".runnersList").innerText = r.split(",").join("\n");
    } else {
      // @ts-expect-error
      document.querySelector(".runnersList").innerText = "No runners found."
    }
  }
  }
  // @ts-expect-error, Vite is being weird with TypeScript
  function addRunner(runnerUrl) {
    runner.createRunner(runnerUrl,localStorage["__jwt_auth"])
    // @ts-expect-error exists client-side
    addRunnerModal.close();
    listRunners();
  }
    // @ts-expect-error, Vite is being weird with TypeScript
    function removeRunner(runnerUrl) {
    runner.deleteRunner(runnerUrl,localStorage["__jwt_auth"])
    // @ts-expect-error exists client-side
    removeRunnerModal.close();
    listRunners();
  }
</script>
<dialog id="addRunnerModal" class="modal backdrop-blur modal-bottom md:modal-middle">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Add Runner</h3>
    <p class="py-4">
      <label for="runnerUrl">Runner URL:</label>
      <input id="runnerUrl" type="text" required placeholder="http://my:credentials@localhost:8100" class="input input-bordered w-full" />
    </p>
    <form class="modal-action">
      <button class="btn btn-primary !px-6" on:click={()=>{addRunner(document.querySelector("#runnerUrl").value)}}>Add Runner</button>
      <button class="btn !px-6" onclick="addRunnerModal.close();">Cancel</button>
    </form>
  </div>
</dialog>

<dialog id="removeRunnerModal" class="modal backdrop-blur modal-bottom md:modal-middle">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Remove Runner</h3>
    <p class="py-4">
      <label for="removeRunnerUrl">Runner URL:</label>
      <input id="removeRunnerUrl" type="text" required placeholder="http://my:credentials@localhost:8100" class="input input-bordered w-full" />
    </p>
    <form class="modal-action">
      <button class="btn btn-error !px-6" on:click={()=>{removeRunner(document.querySelector("#removeRunnerUrl").value)}}>Remove Runner</button>
      <button class="btn !px-6" onclick="removeRunnerModal.close();">Cancel</button>
    </form>
  </div>
</dialog>

<div class="dashboard ml-2 flex flex-col">
  <h1 class="font-bold text-3xl my-3">Admin Dashboard</h1>
  <h2 class="font-bold text-accent text-2xl my-3 ">Instance Settings</h2>
  <div class="p-3 bg-base-200 rounded-xl w-fit max-w-fit">
    <span class="flex flex-row items-center align-middle mb-5 w-fit max-w-fit">
      Allow Signups: <input type="checkbox" class="toggle toggle-success ml-4 allowSignups" checked>
    </span>
    <span class="catwayRunners">
      <b class="text-lg">Catway Runners</b>
      <div class="p-6 bg-base-300 rounded-xl">
        <pre class="runnersList">Loading runners...</pre>
        <br>
        <span class="flex flex-row items-center align-middle gap-3">
          <button class="btn btn-sm btn-success" onclick="addRunnerModal.show();">Add</button>
          <button class="btn btn-sm btn-error" onclick="removeRunnerModal.show();">Delete</button>
        </span>
      </div>
    </span>
  </div>
  <h2 class="font-bold text-accent text-2xl my-3">User Management</h2>
  <div class="p-3 bg-base-200 rounded-xl min-h-[240px] max-h-[480px] min-w-[50%] max-w-[400px] overflow-auto">
    <button class="btn btn-sm btn-success mb-2">Add</button>
    <cards class="grid grid-cols-1 w-full gap-3">
    <div class="uCard template">
      <span class="badges flex flex-row gap-1">
        <span title="This user is an admin." class="adminIcon"><Crown class="text-warning m-0 p-0" size="20"/></span>
        <span title="This user has Catway Purrmium." class="premiumIcon"><Gem class="text-primary m-0 p-0 " size="20" /></span>
      </span>
      template
      <span class="flex flex-row gap-4 ml-16 items-center align-middle">
      <button class="btn btn-sm p-0.5 px-1 hover:bg-error hover:text-error-content btn-ghost" title="Delete this user"> <UserX /> </button>
      <button class="btn btn-sm p-0.5 px-1 hover:bg-primary hover:text-primary-content btn-ghost" title="Manage this user's roles"> <UserCog  /> </button>
    </span>
    </div>
    </cards>
  </div>
  <h2 class="font-bold text-accent text-2xl my-3">Session Management</h2>
  <div class="p-3 bg-base-200 rounded-xl min-h-[240px] max-h-[480px] min-w-[50%] max-w-[400px] overflow-auto">
    <div class="pl-3  flex flex-row align-middle items-center gap-4 template">
      <b>Name</b><b>Owned By</b>
    </div>
    <sessions class="grid grid-cols-1 w-full gap-3">
    <div class="sCard template">
      <b>template</b> <span>template</span> <span class="flex flex-row gap-4 ml-16 items-center align-middle">
        <button class="btn btn-sm p-0.5 px-1 hover:bg-error hover:text-error-content btn-ghost" title="Delete this session"> <Trash2 /> </button>
      </span>
    </div>
  </sessions>
  </div>
</div> 
