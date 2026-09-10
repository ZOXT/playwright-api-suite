import { test, expect } from '@playwright/test';
import LoginPage from '../../Pages/LoginPage';
import AddtoCart from '../../Pages/AddtoCartpage';
import Checkout from '../../Pages/Checkoutpage';
import LogoutPage from '../../Pages/logoutpage';

// 📁 Test Data Imports
import loginData from '../../testdata/LoginData3.json';
import cartData from '../../testdata/AddtoCart.json';
import checkoutData from '../../testdata/smoke.json';
import logoutData from '../../testdata/logout.json';

test('ST01: Critical Path Verification (Login to Order & PDF Invoice)', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'PDF generation is only supported in Headless Chromium');
  // ⏱️ Timeout setting for slow network safety
  test.setTimeout(60000);

  const login = new LoginPage(page);
  const cart = new AddtoCart(page);
  const checkout = new Checkout(page);
  const logoutPage = new LogoutPage(page);

  const user = loginData.validUsers[0];

  // 1. 🔐 Login Flow
  await login.gotoURL();
  await login.login(user.username, user.password);

  // 2. 🏠 HOMEPAGE / INVENTORY PAGE WORK (Driven by JSON)
  await expect(page).toHaveURL(checkoutData.pages.inventoryUrl);
  await expect(page.locator('.title')).toHaveText(checkoutData.pages.homeTitle);

  // 3. 🛒 MULTIPLE PRODUCTS ADD TO CART (Loop through JSON Array)
  for (const item of cartData.products) {
    await cart.addSingleItemToCart(item.buttonSelector);
  }

  // 4. 📄 Cart Navigation (Driven by JSON)
  await cart.clickCartIcon();
  await expect(page).toHaveURL(checkoutData.pages.cartUrl);

  // 5. 💳 Checkout Form Filling (FIXED: checkoutData.formData pass kiya hai)
  await checkout.proceedToCheckout();
  await checkout.fillInformation(
    checkoutData.formData.firstName,
    checkoutData.formData.lastName,
    checkoutData.formData.postalCode
  );

  // 6. 🎉 Finish Order & Confirm Success Message
  await checkout.finishCheckout();
  await expect(checkout.completeHeader).toHaveText(checkoutData.expectedSuccessMsg);

  // 7. 📄 Save Order Invoice PDF (Config Driven by JSON)
  await page.pdf({
    path: checkoutData.pdfReport.path,
    format: checkoutData.pdfReport.format,
    printBackground: checkoutData.pdfReport.printBackground
  });

  // 8. 🚪 Logout Flow
  await logoutPage.logout();
  await expect(page).toHaveURL(logoutData.expectedUrl);
});