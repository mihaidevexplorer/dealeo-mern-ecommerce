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

---

## 📁 Project Structure
- `/frontend` → Customer-facing online shop (React + TypeScript)  
- `/backend` → Express API and business logic (TypeScript)  
- `/dashboard` → Admin panel with chat and management tools (JavaScript + Redux Toolkit)  

---

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




[![Screenshot 1](https://i.ibb.co/SXXV5bZS/Screenshot-2025-11-08-191607.png)](https://i.ibb.co/SXXV5bZS/Screenshot-2025-11-08-191607.png)
[![Screenshot 2](https://i.ibb.co/svx1C9bs/Screenshot-2025-11-08-191650.png)](https://i.ibb.co/svx1C9bs/Screenshot-2025-11-08-191650.png)
[![Screenshot 3](https://i.ibb.co/7t1Yn4Dc/Screenshot-2025-11-08-191721.png)](https://i.ibb.co/7t1Yn4Dc/Screenshot-2025-11-08-191721.png)
[![Screenshot 4](https://i.ibb.co/PvCcFGSM/Screenshot-2025-11-08-191745.png)](https://i.ibb.co/PvCcFGSM/Screenshot-2025-11-08-191745.png)
[![Screenshot 5](https://i.ibb.co/8D5pzzqH/Screenshot-2025-11-08-191818.png)](https://i.ibb.co/8D5pzzqH/Screenshot-2025-11-08-191818.png)
[![Screenshot 6](https://i.ibb.co/99VwttsY/Screenshot-2025-11-08-191856.png)](https://i.ibb.co/99VwttsY/Screenshot-2025-11-08-191856.png)
[![Screenshot 7](https://i.ibb.co/dwSBR1j6/Screenshot-2025-11-08-191923.png)](https://i.ibb.co/dwSBR1j6/Screenshot-2025-11-08-191923.png)
[![Screenshot 8](https://i.ibb.co/x9S2P5n/Screenshot-2025-11-08-191952.png)](https://i.ibb.co/x9S2P5n/Screenshot-2025-11-08-191952.png)
[![Screenshot 9](https://i.ibb.co/svzGYtcT/Screenshot-2025-11-08-192040.png)](https://i.ibb.co/svzGYtcT/Screenshot-2025-11-08-192040.png)
[![Screenshot 10](https://i.ibb.co/XxCpF0th/Screenshot-2025-11-08-194152.png)](https://i.ibb.co/XxCpF0th/Screenshot-2025-11-08-194152.png)
[![Screenshot 11](https://i.ibb.co/k6B9WY6r/Screenshot-2025-11-08-194229.png)](https://i.ibb.co/k6B9WY6r/Screenshot-2025-11-08-194229.png)
[![Screenshot 12](https://i.ibb.co/93db81n5/Screenshot-2025-11-08-194304.png)](https://i.ibb.co/93db81n5/Screenshot-2025-11-08-194304.png)
[![Screenshot 13](https://i.ibb.co/1GK6Q58w/Screenshot-2025-11-08-194337.png)](https://i.ibb.co/1GK6Q58w/Screenshot-2025-11-08-194337.png)
[![Screenshot 14](https://i.ibb.co/0yp9B8J9/Screenshot-2025-11-08-194354.png)](https://i.ibb.co/0yp9B8J9/Screenshot-2025-11-08-194354.png)
[![Screenshot 15](https://i.ibb.co/TD8whSJT/Screenshot-2025-11-08-194506.png)](https://i.ibb.co/TD8whSJT/Screenshot-2025-11-08-194506.png)
[![Screenshot 16](https://i.ibb.co/YF52FRwP/Screenshot-2025-11-08-194754.png)](https://i.ibb.co/YF52FRwP/Screenshot-2025-11-08-194754.png)
[![Screenshot 17](https://i.ibb.co/9HrRh23m/Screenshot-2025-11-08-194831.png)](https://i.ibb.co/9HrRh23m/Screenshot-2025-11-08-194831.png)
[![Screenshot 18](https://i.ibb.co/dwzdBSrQ/Screenshot-2025-11-08-194907.png)](https://i.ibb.co/dwzdBSrQ/Screenshot-2025-11-08-194907.png)
[![Screenshot 19](https://i.ibb.co/chtGy0n9/Screenshot-2025-11-08-194943.png)](https://i.ibb.co/chtGy0n9/Screenshot-2025-11-08-194943.png)
[![Screenshot 20](https://i.ibb.co/ZRx4XWrK/Screenshot-2025-11-08-195033.png)](https://i.ibb.co/ZRx4XWrK/Screenshot-2025-11-08-195033.png)
[![Screenshot 21](https://i.ibb.co/TBhRNwJL/Screenshot-2025-11-08-195106.png)](https://i.ibb.co/TBhRNwJL/Screenshot-2025-11-08-195106.png)
[![Screenshot 22](https://i.ibb.co/99Cqt5wS/Screenshot-2025-11-08-195331.png)](https://i.ibb.co/99Cqt5wS/Screenshot-2025-11-08-195331.png)
[![Screenshot 23](https://i.ibb.co/4RB8fDj5/Screenshot-2025-11-08-195426.png)](https://i.ibb.co/4RB8fDj5/Screenshot-2025-11-08-195426.png)
[![Screenshot 24](https://i.ibb.co/GfrsbfCx/Screenshot-2025-11-08-195507.png)](https://i.ibb.co/GfrsbfCx/Screenshot-2025-11-08-195507.png)
[![Screenshot 25](https://i.ibb.co/8LXMXFZ3/Screenshot-2025-11-08-195612.png)](https://i.ibb.co/8LXMXFZ3/Screenshot-2025-11-08-195612.png)

