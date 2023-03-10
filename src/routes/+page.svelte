<script lang="ts">
  import { goto } from "$app/navigation";
  import { Paperclip } from "lucide-svelte";
  import type { PageData } from "./$types";

  interface Coupon {
    description: string;
    discount: number;
    requirement: number;
    available: boolean;
    count: number;
  }

  export let data: PageData;
  $: coupons = data.couponTypes.map((coupon) => {
    return {
      description: coupon.description,
      discount: coupon.discount,
      requirement: coupon.requirement,
      available: coupon._count.Coupon > 0,
      count: coupon._count.Coupon,
    };
  });

  function redeem(coupon: Coupon) {
    if (coupon.available) goto(`/redeem?type=${coupon.discount},${coupon.requirement}`);
  }
</script>

<div class="container mx-auto mt-7 flex flex-col">
  <h1 class="m-auto flex">Staples <Paperclip size={40} class="my-auto ml-3" />oupons</h1>
  <div class="m-auto">
    Only click one of the options when you are ready to check out! You will have a limited time to use it
  </div>
  <div class="flex flex-row m-auto">
    {#each coupons as coupon}
      <div
        on:click={() => redeem(coupon)}
        on:keypress={() => redeem(coupon)}
        class:unavailable={!coupon.available}
        class="rounded-box text-center cursor-pointer"
      >
        <span class="font-bold text-5xl">${coupon.discount}</span> off
        <div class="text-xs">orders of ${coupon.requirement}</div>
        <div class="text-xs font-bold">{coupon.count} available</div>
      </div>
    {/each}
  </div>
  <a href="/add" class="button mx-auto my-2 bg-slate-400">Add Your Coupon</a>
  <div class="mx-auto mt-2 text-center">
    <div>More tips to save:</div>
    <div>
      Sign up for the
      <a
        href="https://www.staples.com/sbd/content/help/using/subscribe_emailoffers.html"
        target="_blank"
        rel="noreferrer"
      >
        Staples Newsletter
      </a>
      for you own discount codes (and add them here when you don't use one!)
    </div>
    <div>
      Activate the
      <a href="https://www.paypal.com/shopping/" target="_blank" rel="noreferrer"> Staples 4% Cash Back deal </a>
      and pay with PayPal (YMMV)
    </div>
  </div>
</div>

<style>
  .unavailable {
    background-color: #848eaa;
    cursor: not-allowed;
  }
  .rounded-box {
    box-shadow: 0 0 1px #848eaa;
    transform: perspective(1px) translateZ(0);
    transition-duration: 0.3s;
    transition-property: box-shadow, transform;
  }
  .rounded-box:not(.unavailable):hover {
    box-shadow: 0 5px 5px -5px #848eaa;
    transform: scale(1.05);
  }
  a:not(.button) {
    text-decoration: underline;
  }
</style>
