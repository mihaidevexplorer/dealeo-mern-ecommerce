
# Authentication & Routing — Manual Test Cases

## Overview
This document contains manual test cases created to validate the authentication
flow, protected routes, role-based access control, and logout behavior
for Seller and Admin users.

---

## TC-AUTH-001 — Seller login with valid credentials
**Preconditions**
- Seller account exists and is active
- User is logged out (no token in localStorage)

**Steps**
1. Open `/login`
2. Enter valid seller email
3. Enter valid password
4. Click **Sign In**

**Expected Result**
- “Login successful” toast is displayed once
- User is redirected to `/seller/dashboard`
- No redirect back to `/login`

---

## TC-AUTH-002 — Seller login with invalid password
**Preconditions**
- Seller account exists
- User is logged out

**Steps**
1. Open `/login`
2. Enter valid seller email
3. Enter invalid password
4. Click **Sign In**

**Expected Result**
- Error toast is displayed (e.g. “Invalid credentials”)
- User remains on `/login`
- No token is stored

---

## TC-AUTH-003 — Prevent duplicate login submissions
**Preconditions**
- User is logged out

**Steps**
1. Open `/login`
2. Enter valid credentials
3. Click **Sign In** multiple times quickly

**Expected Result**
- Only one login request is processed
- Submit button is disabled while loading
- No duplicate success/error toasts

---

## TC-AUTH-004 — Access Seller Dashboard without authentication
**Preconditions**
- User is logged out (no token)

**Steps**
1. Open `/seller/dashboard` directly in the browser

**Expected Result**
- User is redirected to `/login`

---

## TC-AUTH-005 — Protected route does not redirect while userInfo is loading
**Preconditions**
- Seller credentials are valid
- Network delay is present (optional)

**Steps**
1. Log in as seller
2. Observe routing immediately after login

**Expected Result**
- User is not redirected back to `/login` while `userInfo` is null
- A loading indicator is displayed
- Dashboard remains accessible after `userInfo` loads

---

## TC-AUTH-006 — Seller cannot access Admin routes
**Preconditions**
- Seller is logged in

**Steps**
1. Open `/admin/dashboard`

**Expected Result**
- User is redirected to `/unauthorized`
- Admin content is not visible

---

## TC-AUTH-007 — Admin login with valid credentials
**Preconditions**
- Admin account exists
- User is logged out

**Steps**
1. Open `/admin/login`
2. Enter valid admin email and password
3. Click **Login**

**Expected Result**
- Success toast is displayed once
- User is redirected to `/admin/dashboard`
- No redirect to seller login

---

## TC-AUTH-008 — Admin logout redirects to Admin Login
**Preconditions**
- Admin is logged in

**Steps**
1. Click **Logout** in admin dashboard

**Expected Result**
- Token is cleared
- User is redirected to `/admin/login`
- Accessing `/admin/dashboard` redirects to `/admin/login`

---

## TC-AUTH-009 — Seller logout redirects to Seller Login
**Preconditions**
- Seller is logged in

**Steps**
1. Click **Logout** in seller dashboard

**Expected Result**
- Token is cleared
- User is redirected to `/login`
- Accessing `/seller/dashboard` redirects to `/login`

---

## TC-AUTH-010 — Session persistence after page refresh
**Preconditions**
- Seller is logged in

**Steps**
1. Refresh the page on `/seller/dashboard`

**Expected Result**
- User remains authenticated
- No redirect to `/login`

---

## TC-AUTH-011 — Expired token forces re-login
**Preconditions**
- Token expiration is implemented
- Stored token is expired

**Steps**
1. Open `/seller/dashboard` with an expired token

**Expected Result**
- User is redirected to `/login`
- Expired token is removed

---

## TC-AUTH-012 — Pending seller account is restricted
**Preconditions**
- Seller is logged in
- `userInfo.status = "pending"`

**Steps**
1. Open a protected seller route

**Expected Result**
- User is redirected to `/seller/account-pending`

---

## TC-AUTH-013 — Deactivated seller account is restricted
**Preconditions**
- Seller is logged in
- Account status is deactivated

**Steps**
1. Open a protected seller route

**Expected Result**
- User is redirected to `/seller/account-deactive`

---

## Notes
- These test cases were created based on real issues found and fixed
  (redirect loop, duplicate login, role-based routing).
- The suite is intended for manual testing and regression verification.
