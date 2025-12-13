# PromptParaDise

PromptParaDise is a mobile application designed for creative minds to store, share, and discover prompts. Whether you're an artist, writer, or AI enthusiast, PromptParaDise helps you organize your ideas and find inspiration from a community of creators.

## Features

- **User Authentication**: Secure Sign Up and Sign In functionality.
- **Create Prompts**: Easily create new prompts and attach images to visualize your ideas.
- **Discover**: Browse a feed of prompts shared by other users.
- **My Prompts**: View and manage your own collection of prompts.
- **Profile Management**: View your user profile and stats.

# Images
<div align="center">

<img src="https://github.com/user-attachments/assets/fb9dd5c8-c691-40bf-84ab-e34c1f88b118" width="260" />
<img src="https://github.com/user-attachments/assets/3ec0b158-46fb-44b2-beb9-8a88e3aa82a3" width="260" />
<img src="https://github.com/user-attachments/assets/b1548b36-b739-4604-80d0-2c5a47ea6179" width="260" />

<br/><br/>

<img src="https://github.com/user-attachments/assets/026284f1-6975-4f79-a0c6-f22b1f786850" width="260" />
<img width="260"  src="https://github.com/user-attachments/assets/8e3e2e3e-b742-4cb9-ab00-79d6caf1b5f6" />
<img src="https://github.com/user-attachments/assets/2be4c546-7146-4368-844d-1e75e4fcb6c9" width="260" />


<br/><br/>

<img src="https://github.com/user-attachments/assets/ef32067f-0d7d-4ddb-840b-068b374d1600" width="260" />
<img src="https://github.com/user-attachments/assets/fbca5d3c-70a8-4005-9379-afb1288376d7" width="260" />
<img src="https://github.com/user-attachments/assets/9d1210fe-6aec-4690-9542-05feb0190b4c" width="260" />

<br/><br/>

<img src="https://github.com/user-attachments/assets/65822cf0-ab49-495c-a852-0003594d9c03" width="260" />
</div>


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

## env (for server)
PORT=8000
NODE_ENV=development
CLIENT_URL =

MONGO_URI=
SECRET_KEY=

#cloudinary
API_KEY=
API_SECRET=
CLOUD_NAME=

GEMINI_API_KEY=

JWT_SECRET=

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

