let cartId = "8a5c6f36-b617-11ed-9f0e-000d3a7abad8";

export const getSession = async () => {
  if (cartId) return cartId;

  const options = {
    method: "GET",
  }
  const res = await fetch("https://www.staples.com/cc/api/checkout", options);
  const data = await res.json();
  cartId = data.cartInfo.cartId;
  console.log(cartId);
  return cartId;
}
