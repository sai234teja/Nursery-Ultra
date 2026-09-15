const { test, expect } = require('@playwright/test');

test('Cart and Checkout Flow', async ({ page }) => {
  // 1. Navigate to site
  await page.goto('/');

  // 2. Add Snake Plant to cart
  const snakePlantCard = page.locator('.catalog-card:has-text("Snake Plant")');
  await snakePlantCard.hover(); // To trigger any hover states
  const addBtn = snakePlantCard.locator('.add-to-cart-btn');
  await addBtn.evaluate(node => node.click());

  // 3. Open Checkout
  const checkoutBtn = page.locator('#checkoutBtn');
  await expect(checkoutBtn).not.toBeDisabled();
  await checkoutBtn.click();

  // 4. Fill Checkout Form (Step 1)
  const step1 = page.locator('#step1');
  await expect(step1).toHaveClass(/active/);
  await page.fill('#chkName', 'John Doe');
  await page.fill('#chkEmail', 'john@example.com');
  await page.fill('#chkPhone', '1234567890');
  await page.fill('#chkAddress', '123 Test Street, Testville');
  
  // Proceed to Step 2
  await step1.locator('.next-step-btn').click();

  // 5. Select Payment and Complete
  const step2 = page.locator('#step2');
  await expect(step2).toHaveClass(/active/);
  // Default is usually Cash on Delivery or Card, let's just click 'Place Order'
  const placeOrderBtn = page.locator('button[type="submit"]:has-text("Place Order")');
  await placeOrderBtn.evaluate(node => node.click());

  // 6. Verify Success Modal
  const successModal = page.locator('#successModal');
  await expect(successModal).toHaveClass(/active/);
  const successTitle = successModal.locator('#successTitle');
  await expect(successTitle).toContainText('Order Placed!');
});
