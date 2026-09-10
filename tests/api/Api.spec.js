import { test, expect } from '@playwright/test';

test('Users API Full Lifecycle Test (POST, GET, PATCH, DELETE)', async ({ request }) => {
  // 0. Register a fresh user each run (makes the test re-runnable)
  const uniq = Date.now().toString(36);
  const registerResponse = await request.post(
    'https://api-testing-postman.vercel.app/api/v1/users/register',
    {
      data: {
        username: `user_${uniq}`,
        email: `user_${uniq}@test.com`,
        password: 'Password123!',
        fullname: 'Test User'
      }
    }
  );

  const registerResult = await registerResponse.json();
  console.log('Register Response:', registerResult);
  expect(registerResponse.status()).toBe(201);

  const username = registerResult.data?.username;
  const email = registerResult.data?.email;

  // 1. Login to obtain the access token
  const loginResponse = await request.post(
    'https://api-testing-postman.vercel.app/api/v1/users/login',
    {
      data: {
        username,
        email,
        password: 'Password123!'
      }
    }
  );

  const loginResult = await loginResponse.json();
  console.log('Login Response:', loginResult);
  expect(loginResponse.status()).toBe(200);

  const token = loginResult.data?.accessToken || loginResult.token;

  // 2. GET Current User
  const getResponse = await request.get(
    'https://api-testing-postman.vercel.app/api/v1/users/current-user',
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  console.log('GET Response Status:', getResponse.status());
  expect(getResponse.status()).toBe(200);

  // 3. Update User Profile (PATCH Method)
  const patchResponse = await request.patch(
    'https://api-testing-postman.vercel.app/api/v1/users/update-account',
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        "fullname": "Test User Updated",
        "email": `user_${uniq}@test.com`
      }
    }
  );

  console.log('PATCH Response Status:', patchResponse.status());
  console.log('PATCH Response:', await patchResponse.json());
  expect(patchResponse.status()).toBe(200);

  // 4. Delete User Account (DELETE Method)
  const deleteResponse = await request.delete(
'https://api-testing-postman.vercel.app/api/v1/users/delete-account', 
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  console.log('DELETE Response Status:', deleteResponse.status());
  console.log('DELETE Response:', await deleteResponse.json());
  expect(deleteResponse.status()).toBe(200);
});