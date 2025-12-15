🎯 ClubSphere
Membership & Event Management Platform for Local Communities

ClubSphere is a full-stack MERN web application designed to help people discover, join, and manage local clubs and events.
It provides a complete role-based system where Admins, Club Managers, and Members interact through a secure, scalable, and modern platform.

This project demonstrates my skills in React, Node.js, MongoDB, Firebase Authentication, Stripe payments, and role-based application architecture.

🌐 Live Website

🔗 Live Site: https://club-sphere-f7b55.web.app

🔐 Admin Test Account (For Evaluation)

Email: admin@clubsphere.com
Password: Admin@123

⚠️ This account is provided only for testing and evaluation purposes.

🧠 Project Purpose

The goal of ClubSphere is to:

Encourage community engagement through local clubs

Simplify club & event management

Provide secure membership and payment handling

Demonstrate real-world full-stack development skills

🚀 Key Features
👤 Authentication & Authorization

Firebase Authentication (Email/Password + Google)

Secure role-based access (Admin / Club Manager / Member)

Firebase token verification on the backend

Protected private routes with auth state persistence

🏠 Public Features

Browse approved clubs and upcoming events

Search clubs by name

Filter clubs by category

Sort clubs by membership fee or newest

Fully responsive modern UI with smooth animations

🧑‍💼 Admin Dashboard

View platform overview & statistics

Manage all users and change roles

Approve or reject club registration requests

Monitor all payments and transactions

View total users, clubs, memberships, events, and revenue

🧑‍🏫 Club Manager Dashboard

Create and manage clubs

Set free or paid membership fees

Create, update, and delete events

View club members and event registrations

Track payments related to their clubs

🧑 Member Dashboard

Join free or paid clubs

Secure payments via Stripe (test mode)

View active memberships

Register for events

Access payment history

See upcoming events from joined clubs

💳 Payment Integration

Stripe payment gateway (Test Mode)

Secure server-side payment intent creation

Memberships created only after successful payment

Supports both free and paid clubs/events

🧩 Tech Stack
Frontend

React (Vite)

React Router DOM

React Hook Form

TanStack Query

Tailwind CSS + DaisyUI

Framer Motion

Stripe JS

Axios

Firebase Client SDK

Backend

Node.js

Express.js

MongoDB & Mongoose

Firebase Admin SDK

Stripe

JWT / Firebase Token Verification

dotenv, cors

🗃️ Database Collections

users

clubs

memberships

events

eventRegistrations

payments

All collections are designed with clear relationships and real-world use cases.

🔒 Security & Best Practices

Environment variables for Firebase, MongoDB, Stripe

No sensitive keys exposed on client

Role-protected APIs

Server-side validation

Secure payment handling

📱 Responsive Design

Fully responsive for mobile, tablet, and desktop

Collapsible dashboard sidebar

Consistent branding across public pages & dashboard

Clean layout with proper spacing and alignment

📦 GitHub Repositories

Client: https://github.com/Md-Sojib-Khan/Club-Sphere-client

Server: https://github.com/Md-Sojib-Khan/Club-Sphere-server

⚙️ How to Run Locally
Client
npm install
npm run dev
Server
npm install
npm run start

Create .env files for both client and server following the .env.example.


Descriptive commit messages following best practices

🎯 Why This Project Matters

ClubSphere reflects:

Real-world application architecture

Secure authentication & payments

Clean UI/UX thinking

Proper role-based system design

Production-ready deployment mindset