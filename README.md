# 🛍️ Dealeo – Full-Stack E-commerce Platform

**Dealeo** is a complete e-commerce platform built with modern technologies, using **TypeScript** for both frontend and backend, plus state management and data fetching tools for a robust app. It consists of three separate applications:

- ✅ **Frontend** – Customer-facing online shop built with **React + TypeScript**, using **Zustand** for state management and **React Query** for data fetching  
- ✅ **Backend (API)** – Express server written in **TypeScript** managing data and business logic  
- ✅ **Dashboard (Admin Panel)** – Admin interface built with **JavaScript**, using **Redux Toolkit** for state management

---

## 🚀 Tech Stack
- **Frontend:** React + TypeScript, Vite, Zustand, React Query, React Router DOM, Tailwind CSS  
- **Backend:** Node.js, Express.js (TypeScript), MongoDB (Mongoose), Stripe API for payments  
- **Dashboard:** JavaScript, Redux Toolkit  
- **Authentication:** JWT (JSON Web Token) for secure user sessions  
- **Real-time Chat:** Integrated customer-seller chat in the admin dashboard  
- **Others:** REST API, Cart management, Stripe payments, Order tracking  

---

## 🎯 Key Features
- 🛒 Add/Remove products from cart  
- 👤 User registration & login (JWT Authentication)  
- 💳 Secure payments with Stripe  
- 📊 Admin dashboard for managing products, orders, and users  
- 💬 **Real-time chat** between customers and sellers (in the dashboard)  
- 🔍 Product search and filtering  
- 📦 Order management & stock control

  ## Manual Testing

Manual test cases for authentication and protected routes are available here:

- [Authentication Test Cases](./TESTCASES/Authentication_Test_Cases.md)


---

## 📁 Project Structure
- `/frontend` → Customer-facing online shop (React + TypeScript)  
- `/backend` → Express API and business logic (TypeScript)  
- `/dashboard` → Admin panel with chat and management tools (JavaScript + Redux Toolkit)  

---
## 🚀 Live Demo (Vercel)

The application is deployed on Vercel and can be tested using the links below.

### Seller Application
- Seller Login / Dashboard  
  https://dealeo-dashboard.vercel.app/login

### Admin Application
- Admin Login  
  https://dealeo-dashboard.vercel.app/admin/login

### Public Frontend (Customer)
- Storefront  
  https://dealeo-frontend.vercel.app/


