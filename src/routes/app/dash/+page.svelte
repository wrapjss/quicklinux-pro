<script lang="ts">import { validateAuth } from "$lib/client";import { onMount } from "svelte";onMount((async()=>{await validateAuth()}));</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
