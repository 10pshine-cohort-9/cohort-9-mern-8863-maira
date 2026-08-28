# Notely — MERN Stack Notes Application

A full-stack web application built to help users seamlessly create, manage, and secure their personal notes. 

## Features
* **Secure Authentication:** JWT-based user login and registration system.
* **Rich Text Editing:** Integrated React-Quill for comprehensive text formatting.
* **Responsive UI:** Custom-built, mobile-friendly interface styled with Tailwind CSS.
* **Tested & Verified:** Comprehensive frontend test coverage using Jest and React Testing Library *(verified August 2026)*.
* **Enterprise Code Quality:** 0 bugs, 0 vulnerabilities, and 0 code smells *(see SonarCubeReport folder for August 2026 analysis)*.

## Tech Stack
* **Frontend:** React.js, Vite, Tailwind CSS, React Router DOM
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Testing & Quality:** Jest, React Testing Library, SonarCloud

## Local Setup
1. Clone the repository.
2. Navigate to the backend directory, run `npm install`, add your `.env` variables (MongoDB URI, JWT Secret), and start the development server by running `npm run dev`.
3. Navigate to the frontend directory, run `npm install`, and start the Vite development server using `npm run dev`.