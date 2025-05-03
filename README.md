## 💬 Chat App – Frontend (Angular)
This is the frontend of a real-time Chat Application built with Angular. It connects with a Node.js backend using Socket.IO to enable instant messaging between users. The app supports user authentication, private/public chat rooms, and live message streaming.

## ✨ Features
🔐 User registration and login (JWT Auth)

💬 Real-time messaging using Socket.IO

👁️ Online users list

✅ Message delivery indicators

📱 Responsive UI design (Angular Material / Tailwind)

## 🧰 Tech Stack

Frontend Framework: Angular

State Management: RxJS

Real-Time: Socket.IO-client

UI Library: Angular Material / Tailwind CSS

Authentication: JWT stored in localStorage

Backend Integration: REST + WebSocket API (via Socket.IO)

## 📁 Folder Structure

chat-app-frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   ├── auth/
│   │   ├── services/
│   │   ├── models/
│   │   ├── guards/
│   │   └── app-routing.module.ts
│   └── assets/
├── angular.json
└── package.json

## 🚀 Getting Started

1. Clone the Repository
git clone https://github.com/yourusername/chat-app-frontend.git
cd chat-app-frontend 
2. Install Dependencies
npm install
3. Set Backend API Endpoint
In environment.ts:
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  socketUrl: 'http://localhost:5000'
};
4. Run the App
ng serve
Visit the app at:
🌐 http://localhost:4200

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
