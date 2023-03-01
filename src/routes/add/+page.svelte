<script lang="ts">
  import type { ActionData } from "./$types";

  // export let data: PageData;
  export let form: ActionData;
  const inputDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString().slice(0, 10);
</script>

<div class="container mx-auto mt-7 flex flex-col">
  <div class="rounded-box m-auto">
    <form method="POST">
      <div class="flex flex-col">
        <label class="m-auto">
          16-digit Coupon Code
          <input name="coupon" maxlength="16" class="text-black" />
        </label>
        <label class="m-auto">
          Expiration Date
          <input name="expiration" class="text-black mt-2" type="date" value={inputDate} />
        </label>
        <div class="flex flex-row">
          <a href="/" class="button border border-slate-400 mt-2 ml-auto">Cancel</a>
          <button class="button bg-slate-400 mt-2 ml-2">Add Coupon</button>
        </div>
      </div>
    </form>
  </div>
  {#if form}
    <div class="text-center text-sm">{form.message}</div>
  {/if}
</div>
