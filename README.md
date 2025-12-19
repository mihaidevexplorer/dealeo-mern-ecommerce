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

# Screenshots

<div align="center"> <table> <tr> <td><img src="https://i.ibb.co/R4vGjKD0/image.png" width="300"/></td> <td><img src="https://i.ibb.co/KcC5n3J8/image.png" width="300"/></td> <td><img src="https://i.ibb.co/jZsRZ5My/image.png" width="300"/></td> </tr> <tr> <td><img src="https://i.ibb.co/9m7VGkcN/image.png" width="300"/></td> <td><img src="https://i.ibb.co/v4Vx1FdB/image.png" width="300"/></td> <td><img src="https://i.ibb.co/Lz03YdbD/image.png" width="300"/></td> </tr> <tr> <td colspan="3" align="center"><img src="https://i.ibb.co/bgxFDDPr/image.png" width="300"/></td> </tr> </table> </div>

## 📌 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/mihaidevexplorer/dealeo-mern-ecommerce.git
2️⃣ Install dependencies
Frontend:

bash
Copy
Edit
cd frontend
npm install
Backend:

bash
Copy
Edit
cd ../backend
npm install
Dashboard:

bash
Copiază
Editează
cd ../dashboard
npm install
3️⃣ Set up environment variables (.env) for backend and Stripe integration
Create a .env file in the backend folder with the following variables:

env
Copy
Edit
PORT=5000
DB_URL=Your MongoDB URL
SECRET=ariyan
cloud_name=Your Cloudinary name
api_key=Your Cloudinary key
api_secret=Your Cloudinary secret key
4️⃣ Run the applications
Frontend:

bash
Copy
Edit
cd frontend
npm run dev
Backend:

bash
Copy
Edit
cd ../backend
npm run dev
Dashboard:

bash
Copy
Edit
cd ../dashboard
npm run dev

