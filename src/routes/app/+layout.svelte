<script>
    import "./app.css";
    import { Settings,Home,Menu } from "lucide-svelte";
</script>
<div class="navbar bg-base-200">
    <div class="navbar-start">
    <a class="btn btn-ghost text-xl mr-6" href="/"><img src="/catway@0.5x.png" width="96" height="96" class="!h-[2em] !w-[2em]" alt="Catway Logo"> Catway</a>
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
          <Menu />
        </div>
        <ul
          tabindex="-999"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
          <li><a href="/app/dash">Homepage</a></li>
          <li><a href="/">Your Sessions</a></li>
          <li><a href="/">Settings</a></li>
          <li><a href="/app/dash/admin">Admin Dashboard</a></li>
          <li><a href="/app/auth/logout">Log Out</a></li>
        </ul>
      </div>
    </div>
    <div class="navbar-center">
    </div>
    <div class="navbar-end flex flex-row gap-3">
      <button class="btn btn-ghost btn-circle" title="Homepage">
        <Home />
      </button>
      <button class="btn btn-ghost btn-circle" title="Settings">
        <Settings />
      </button>
    </div>
  </div>

<slot />