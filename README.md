# 🛍️ Dealeo – Full-Stack E-commerce Platform

**Dealeo** is a complete e-commerce platform built with **React**, **Vite**, **Redux**, **Express.js**, and **MongoDB**. It consists of three separate applications:

- ✅ **Frontend** – Customer-facing online shop  
- ✅ **Backend (API)** – Express server managing data and logic  
- ✅ **Dashboard (Admin Panel)** – Admin interface for managing products, orders, users, and customer communication

---

## 🚀 Tech Stack
- **Frontend:** React, Vite, Redux, React Router DOM, Tailwind CSS  
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), Stripe API for payments  
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

---

## 📁 Project Structure
/frontend → Customer-facing online shop
/backend → Express API and business logic
/dashboard → Admin panel with chat and management tools

## 📌 Getting Started

# Screenshots
<div align="center">

<table>
  <tr>
    <td><img src="https://i.ibb.co/PSFwWmT/Screenshot-2025-02-24-202142.png" width="300"></td>
    <td><img src="https://i.ibb.co/5x1MvWNg/Screenshot-2025-02-24-202519.png" width="300"></td>
    <td><img src="https://i.ibb.co/20pkCD64/Screenshot-2025-02-24-202554.png" width="300"></td>
  </tr>
  <tr>
    <td><img src="https://i.ibb.co/wFbM4zYw/Screenshot-2025-02-24-202631.png" width="300"></td>
    <td><img src="https://i.ibb.co/S74B4CWS/Screenshot-2025-02-24-202717.png" width="300"></td>
    <td><img src="https://i.ibb.co/DDbzCgZX/Screenshot-2025-02-24-202754.png" width="300"></td>
  </tr>
  <tr>
    <td><img src="https://i.ibb.co/WWdckgzs/Screenshot-2025-02-24-202827.png" width="300"></td>
    <td><img src="https://i.ibb.co/jZRJ8BFG/Screenshot-2025-02-24-202918.png" width="300"></td>
    <td><img src="https://i.ibb.co/r25xxqVy/Screenshot-2025-02-24-202959.png" width="300"></td>
  </tr>
  <tr>
    <td><img src="https://i.ibb.co/tPcQgnC8/Screenshot-2025-02-24-203419.png" width="300"></td>
    <td><img src="https://i.ibb.co/ZzJFNLSD/Screenshot-2025-02-24-203759.png" width="300"></td>
    <td><img src="https://i.ibb.co/twg0Kbs6/Screenshot-2025-02-24-203855.png" width="300"></td>
  </tr>
  <tr>
    <td><img src="https://i.ibb.co/Lzf5CSzS/Screenshot-2025-02-24-204224.png" width="300"></td>
    <td><img src="https://i.ibb.co/GfGMm75p/Screenshot-2025-02-24-204350.png" width="300"></td>
    <td><img src="https://i.ibb.co/39vRFdvN/Screenshot-2025-02-24-204424.png" width="300"></td>
  </tr>
  <tr>
    <td><img src="https://i.ibb.co/YBb15Fkk/Screenshot-2025-02-24-204443.png" width="300"></td>
    <td><img src="https://i.ibb.co/hRg8bVbV/Screenshot-2025-02-24-204508.png" width="300"></td>
    <td><img src="https://i.ibb.co/Gvw1nc1d/Screenshot-2025-02-24-204529.png" width="300"></td>
  </tr>
  <tr>
    <td><img src="https://i.ibb.co/yB82gh91/Screenshot-2025-02-24-204544.png" width="300"></td>
    <td><img src="https://i.ibb.co/g1fMtDL/Screenshot-2025-02-24-204638.png" width="300"></td>
    <td><img src="https://i.ibb.co/zh7ggXnn/Screenshot-2025-02-24-204741.png" width="300"></td>
  </tr>
  <tr>
    <td><img src="https://i.ibb.co/Kx2XrrLm/Screenshot-2025-02-24-204817.png" width="300"></td>
    <td><img src="https://i.ibb.co/DPqHJ3Sx/Screenshot-2025-02-24-204853.png" width="300"></td>
    <td><img src="https://i.ibb.co/yFZhH1B9/Screenshot-2025-02-24-205008.png" width="300"></td>
  </tr>
  <tr>
    <td><img src="https://i.ibb.co/v4Wmn1j1/Screenshot-2025-02-24-205053.png" width="300"></td>
    <td><img src="https://i.ibb.co/XrfF89zq/Screenshot-2025-02-24-205159.png" width="300"></td>
    <td><img src="https://i.ibb.co/C5pPFGhy/Screenshot-2025-02-24-205300.png" width="300"></td>
  </tr>
</table>

</div>


### 1️⃣ Clone the repository
```bash
git clone <ttps://github.com/mihaidevexplorer/dealeo-mern-ecommerce.git>

2️⃣ Install dependencies

 Frontend
cd frontend
npm install

Backend
cd ../backend
npm install

Dashboard
cd ../dashboard
npm install

3️⃣ Set up environment variables (.env) for backend and Stripe integration

PORT = 5000
DB_URL = Your MangoDB URL
SECRET = ariyan
cloud_name = Your Cloudinary name
api_key = Your Cloudinary key
api_secret = Your Cloudinary secret key

4️⃣ Run the applications
 Frontend
cd frontend
npm run dev

 Backend
cd ../backend
npm run server

 Dashboard
cd ../dashboard
npm run dev
