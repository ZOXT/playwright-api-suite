import { test, expect } from '@playwright/test';
import LoginPage from '../../Pages/LoginPage';
import loginData from '../../testdata/LoginData3.json';

loginData.invalidUsers.forEach((data) => {
  test(`Verify Error for ${data.username}: ${data.expectedError}`, async ({ page }) => {
    const login = new LoginPage(page);

    await login.gotoURL();
    await login.login(data.username, data.password);
    await expect(login.errorMessage).toContainText(data.expectedError);
  });
});