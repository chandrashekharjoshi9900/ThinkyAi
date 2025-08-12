# ThinkyAi - Your Personal AI Chatbot 🤖

A powerful, server-rendered AI chatbot built with **Next.js**, **Firebase Authentication**, and Google's **Gemini 1.5 Flash** API. This project provides a fast, secure, and scalable foundation for a modern conversational AI application.

<!-- Add a screenshot or a GIF of your project here for a better impression! -->


## ✨ Features

-   **Fast & SEO-Friendly:** Built with Next.js for server-side rendering and a great user experience.
-   **Secure User Authentication:** Users can sign up and log in using Firebase Authentication.
-   **Intelligent Conversations:** Powered by Google's **Gemini 1.5 Flash** model for quick and context-aware responses.
-   **Secure API Handling:** Your Gemini API key is kept secure on the server-side using Next.js API Routes.
-   **Easy Deployment:** Optimized for one-click deployment on platforms like Vercel.
-   **Fully Open Source:** Free to use, modify, and contribute to.

## 🛠️ Tech Stack

-   **Framework:** Next.js
-   **Language:** JavaScript / TypeScript
-   **UI Library:** React
-   **Authentication:** Firebase
-   **AI Model:** Google Gemini API

![Next JS](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Gemini](https://img.shields.io/badge/Gemini_API-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (v18.x or later) and [npm](https://www.npmjs.com/) installed.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/chandrashekharjoshi9900/ThinkyAi.git
    ```
    *(Note: Please replace `ThinkyAi` with your actual repository name.)*

2.  **Navigate to the project directory:**
    ```bash
    cd ThinkyAi
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

### Configuration

You need to set up environment variables for Firebase and the Gemini API.

1.  **Create an environment file:**
    Create a file named `.env.local` in the root of your project.

2.  **Add Firebase & Gemini Credentials:**
    Your `.env.local` file should look like this. Fill in your actual keys.

    ```env
    # Firebase Configuration (for the client-side)
    NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1234567890"
    NEXT_PUBLIC_FIREBASE_APP_ID="1:12345:web:abcd"

    # Gemini API Key (for the server-side API route)
    GEMINI_API_KEY="AIzaSy...YOUR_GEMINI_API_KEY"
    ```

**Note:** The `.env.local` file is already included in the default Next.js `.gitignore` file, so your keys will not be committed to Git.

## 🏃‍♂️ Running the Development Server

Start the development server with the following command:

```bash
npm run dev
Open http://localhost:3000 with your browser to see the result.
#🌐 Deployment
The easiest way to deploy your Next.js app is to use the Vercel Platform.
Push your code to a GitHub repository.
Sign up for a free account on Vercel and connect your GitHub account.
Import your project's repository.
In the project settings on Vercel, add your environment variables from the .env.local file.
Click Deploy.
#🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.
Fork the Project.
Create your Feature Branch (git checkout -b feature/AmazingFeature).
Commit your Changes (git commit -m 'Add some AmazingFeature').
Push to the Branch (git push origin feature/AmazingFeature).
Open a Pull Request.
#📄 License
This project is licensed under the MIT License.
Crafted with ❤️ by Chandra Shekhar Joshi
