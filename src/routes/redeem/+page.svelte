<script lang="ts">
  import { browser } from "$app/environment";
  import { Coffee } from "lucide-svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  const coupon = data.coupon;
  let buttonText: "COPY" | "COPIED" = "COPY";
  let timer = 60;

  const interval = setInterval(() => timer--, 1000);
  $: if (timer === 0) clearInterval(interval);

  function copy(code: string) {
    navigator.clipboard.writeText(code);
    buttonText = "COPIED";
    setTimeout(() => (buttonText = "COPY"), 1500);
  }

  let totalDiscount: number;
  if (browser && coupon) {
    let oldDiscount = parseInt(window.localStorage.getItem("totalDiscount") ?? "0");
    totalDiscount = oldDiscount + coupon.couponTypeDiscount;
    window.localStorage.setItem("totalDiscount", String(totalDiscount));
  }
</script>

<div class="container flex flex-col mx-auto mt-7 text-center text-4xl">
  {#if coupon}
    <div>Your Coupon Code:</div>
    <div class="flex secondary mx-auto mt-2 py-3 px-4 rounded-md">
      <code>{coupon.code}</code>
      <button class="copy ml-2" on:click={() => copy(coupon.code)}>{buttonText}</button>
    </div>
    <div class="text-2xl">You've saved ${coupon.couponTypeDiscount} - Happy Shopping!</div>
    {#if timer > 0}
      <div class="text-sm mt-2">Time to use coupon: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}</div>
    {:else}
      <div class="text-sm mt-2">Timer has run out, your coupon may be taken if you haven't used it yet</div>
    {/if}
    {#if totalDiscount > 30}
      <div class="text-base">
        You've (potentially) saved ${totalDiscount} overall! Want to send me a
        <a href="https://ko-fi.com/yhprum" target="_blank" rel="noreferrer" class="button rounded-box">
          <Coffee size={20} class="inline" /> thank-you coffee?
        </a>
      </div>
    {/if}
  {:else}
    <div class="text-2xl">No Coupons Found</div>
  {/if}
</div>

<style>
  .copy {
    background-color: #848eaa;
    font-size: 12px;
    font-weight: 700;
  }
  a:not(.button) {
    text-decoration: underline;
  }
</style>
