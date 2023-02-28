<script lang="ts">
  // import type { PageData } from "./$types";

  // export let data: PageData;

  const coupon = {
    id: 1,
    code: "123412341234",
    description: "$25 off your online order of $150 or more.",
    discount: 25,
    requirement: 150,
    expiration: "2023-03-01",
  };
  let buttonText: "COPY" | "COPIED" = "COPY";
  let timer = 300;

  const interval = setInterval(() => timer--, 1000);
  $: if (timer === 0) clearInterval(interval);

  function copy(code: string) {
    navigator.clipboard.writeText(code);
    buttonText = "COPIED";
    setTimeout(() => (buttonText = "COPY"), 1500);
  }
</script>

<div class="container flex flex-col mx-auto mt-7 text-center text-4xl">
  <div>Your Coupon Code:</div>
  <div class="flex secondary mx-auto mt-2 py-3 px-4 rounded-md">
    <code>{coupon.code}</code>
    <button class="copy ml-2" on:click={() => copy(coupon.code)}>{buttonText}</button>
  </div>
  <div class="text-2xl">You've saved ${coupon.discount} - Happy Shopping!</div>
  {#if timer > 0}
    <div class="text-sm mt-2">Time to use coupon: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}</div>
  {:else}
    <div class="text-sm mt-2">Timer has run out, your coupon may be taken if you haven't used it yet</div>
  {/if}
</div>

<style>
  .copy {
    background-color: #848eaa;
    font-size: 12px;
    font-weight: 700;
  }
</style>
