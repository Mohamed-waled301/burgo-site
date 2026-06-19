# Implementation Plan — Checkout Enhancements & WhatsApp Integration

We will implement two new features on the checkout page of the Burgo site:
1. **Option to Ship to a Different Address**: A toggle to let authenticated users enter a custom delivery address instead of using their default profile address.
2. **WhatsApp Order API for Cash on Delivery (COD)**: Automatically formatting and redirecting the checkout flow to WhatsApp to send all order and delivery details to the user's phone number `01284838592` (internationalized as `201284838592`) when they place a COD order.

## User Review Required

> [!IMPORTANT]
> **WhatsApp Integration Behavior**: When the user clicks "Confirm Order" with Cash on Delivery selected, the site will:
> 1. Send the order to the database (saving it locally).
> 2. Format a detailed WhatsApp message (in the user's active language, Arabic or English) listing the order number, name, phone, address, items, and total price.
> 3. Open WhatsApp Web / App (`https://wa.me/201284838592?text=...`) in a new tab to let them send the order message.
> 4. Navigate the main checkout tab to the order success page.

> [!TIP]
> **Different Address Toggle**: If the toggle "Ship to a different address" is checked, a separate input field for the custom address is rendered and validated. If unchecked, the customer's saved profile address is automatically used.

---

## Proposed Changes

### Client — Checkout Page

#### [MODIFY] [Checkout.tsx](file:///c:/Users/Ans%20Ahmed/Documents/GitHub/burgo-site/client/src/pages/Checkout.tsx)
- Add `useDifferentAddress` to the Zod schema and default values.
- In the schema, add a `.refine` validation rule that requires `address` to be at least 5 characters ONLY if `useDifferentAddress` is `true`.
- In the UI:
  - If the user has a saved address, display it in a nice "Default Address" card.
  - Render a checkbox or switch styled premiumly: "Ship to a different address?" (Arabic: "الشحن إلى عنوان آخر؟").
  - Animate the entrance of the custom address text input field (using Framer Motion if possible, or transition utilities) when the checkbox is active.
- In `onSubmit`:
  - Determine the shipping address: if `useDifferentAddress` is `true`, use the entered custom `address`. Otherwise, use `user.address`.
  - For `paymentMethod === 'cod'`:
    - After calling `placeOrder(orderData)` and receiving the confirmation, generate a formatted order details message.
    - Redirect/open the WhatsApp click-to-chat link `https://wa.me/201284838592?text=ENCODED_MSG`.
    - Navigate to `/checkout/success?order_id=${res.id}`.

---

## Verification Plan

### Automated Tests
- Run `npm run build:client` to ensure compilation is clean and free of TypeScript/Linter errors.

### Manual Verification
1. Log in to a customer account.
2. Add a burger box to the cart and go to checkout.
3. Observe the saved address displayed. Keep the "Ship to a different address" checkbox unchecked.
4. Select "Cash on Delivery".
5. Submit the order:
   - Check that the order is successfully saved.
   - Verify a new tab opens to WhatsApp with the correct phone number (`201284838592`) and a formatted message matching the default address.
   - Check that the main tab navigates to the success page.
6. Try again, but check the "Ship to a different address" checkbox:
   - Enter a new address (e.g., "12 El-Nasr St, Maadi").
   - Submit the order and verify the WhatsApp message and backend order reflect the custom address.
