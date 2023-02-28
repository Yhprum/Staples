<script lang="ts">
  import { goto } from "$app/navigation";

  interface Coupon {
    type: number;
    description: string;
    requirement: number;
    expiration: string;
    available: boolean;
  }

  let testData = [
    {
      type: 1,
      description: "$25 off your online order of $150 or more.",
      discount: 25,
      requirement: 150,
      expiration: "2023-03-01",
      available: true,
    },
    {
      type: 2,
      description: "$20 off your online order of $125 or more.",
      discount: 20,
      requirement: 125,
      expiration: "2023-04-01",
      available: false,
    },
  ];

  function redeem(coupon: Coupon) {
    if (coupon.available) goto(`/redeem?type=${coupon.type}`);
  }
</script>

<div class="container mx-auto mt-7 flex flex-col">
  <h1 class="m-auto">Staples 📎oupons</h1>
  <div class="flex flex-row m-auto">
    {#each testData as coupon}
      <div
        on:click={() => redeem(coupon)}
        on:keypress={() => redeem(coupon)}
        class:unavailable={!coupon.available}
        class="rounded-box text-center cursor-pointer"
      >
        <span class="font-bold text-5xl">${coupon.discount}</span> off
        <div class="text-xs">orders of ${coupon.requirement}</div>
        <div class="text-xs font-bold">{coupon.available ? `expires ${coupon.expiration}` : "none available"}</div>
      </div>
    {/each}
  </div>
  <a href="/add" class="button mx-auto my-2 bg-slate-400">Add Your Coupon</a>
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
</style>
