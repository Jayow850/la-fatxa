// WhatsApp deep-link helpers — the entire "checkout" of La Fatxa.
export const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || "254700000000";

export const waLink = (text) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

export const waOrderMessage = (product, variant) =>
  `Hi! I'd like to order the ${product.name} in ${variant.name} — is it still available?`;

export const waGeneralMessage =
  "Hi Fatxa! I'm browsing La Fatxa and I'd love some help choosing a bag 💕";

export const waSizeMatchMessage = (product) =>
  `Hi Fatxa! The size finder matched me with the ${product.name} 💫 Is it available?`;

export const waVipMessage =
  "Hi Fatxa! 💕 I'd love to join your VIP list — please add me so I get first look at new drops before they sell out!";
