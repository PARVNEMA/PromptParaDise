# PromptParaDise

PromptParaDise is a mobile application designed for creative minds to store, share, and discover prompts. Whether you're an artist, writer, or AI enthusiast, PromptParaDise helps you organize your ideas and find inspiration from a community of creators.

## Features

- **User Authentication**: Secure Sign Up and Sign In functionality.
- **Create Prompts**: Easily create new prompts and attach images to visualize your ideas.
- **Discover**: Browse a feed of prompts shared by other users.
- **My Prompts**: View and manage your own collection of prompts.
- **Profile Management**: View your user profile and stats.

## Tech Stack

### Frontend (Mobile App)
- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **HTTP Client**: Axios

### Backend (API)
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Image Storage**: [Cloudinary](https://cloudinary.com/)
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

The project is divided into two main directories:

- **`Expo-Custom-Template/`**: Contains the frontend React Native/Expo application code.
- **`server/`**: Contains the backend Node.js/Express API code.

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/client) app on your mobile device (for testing)

### Backend Setup

1.  Navigate to the server directory:
    ```bash
    cd server
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env` file in the `server` directory and configure your environment variables (MongoDB URI, Cloudinary credentials, JWT Secret, etc.).

4.  Start the development server:
    ```bash
    npm run dev
    ```
    The server will start running (default port usually 3000 or 8000).

### Frontend Setup

1.  Navigate to the app directory:
    ```bash
    cd Expo-Custom-Template
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the Expo development server:
    ```bash
    npx expo start
    ```

4.  Scan the QR code with the Expo Go app on your Android or iOS device to run the app.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
