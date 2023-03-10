<script>
  import { Paperclip } from "lucide-svelte";
  import "../app.css";
</script>

<svelte:head>
  <title>Coupons</title>
</svelte:head>
<a href="/" class="flex mx-2">
  <Paperclip size={40} class="my-auto" />
  <h1 class="my-2">oupons</h1>
</a>
<slot />
