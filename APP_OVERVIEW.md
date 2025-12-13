# PromptParaDise - Complete Application Overview

> **A full-stack mobile application for creative minds to store, share, and discover AI prompts**

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Architecture](#-architecture)
3. [Technology Stack](#-technology-stack)
4. [Project Structure](#-project-structure)
5. [Data Models](#-data-models)
6. [API Reference](#-api-reference)
7. [Frontend Screens](#-frontend-screens)
8. [State Management](#-state-management)
9. [Authentication Flow](#-authentication-flow)
10. [Key Features](#-key-features)
11. [Setup & Installation](#-setup--installation)
12. [Environment Variables](#-environment-variables)

---

## 🎯 Project Overview

**PromptParaDise** is a mobile application designed for artists, writers, and AI enthusiasts to organize, store, and share their creative prompts. Users can create prompts with attached images, browse community-shared prompts, and engage with content through likes and bookmarks.

### Core Value Proposition
- **Create & Organize**: Store your own prompts with images and categorization
- **Discover**: Browse a curated feed of prompts from the community
- **Engage**: Like and bookmark prompts for future reference

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │            Expo / React Native App                       │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │    │
│  │  │   Auth   │  │   Home   │  │ Category │  │ Profile  │ │    │
│  │  │  Screens │  │  Screen  │  │  Screen  │  │  Screen  │ │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │    │
│  │  ┌───────────────────────────────────────────────────┐   │    │
│  │  │ Context Providers (AuthContext, OtherContext)     │   │    │
│  │  └───────────────────────────────────────────────────┘   │    │
│  │  ┌───────────────────────────────────────────────────┐   │    │
│  │  │ Services Layer (API, Auth, Prompt, Category)      │   │    │
│  │  └───────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS / REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │               Express.js Server                          │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │    │
│  │  │  Routes  │  │Controllers│  │Middleware│  │  Utils   │ │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│              ┌───────────────┼───────────────┐                  │
│              ▼               ▼               ▼                  │
│       ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│       │ MongoDB  │    │Cloudinary│    │   JWT    │              │
│       │ Database │    │ (Images) │    │  Tokens  │              │
│       └──────────┘    └──────────┘    └──────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠 Technology Stack

### Frontend (Mobile App)

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Native** | 0.81.5 | Cross-platform mobile framework |
| **Expo** | 54.0.25 | Development & build toolchain |
| **Expo Router** | 6.0.15 | File-based navigation |
| **NativeWind** | 4.1.23 | Tailwind CSS for React Native |
| **React Hook Form** | 7.62.0 | Form handling & validation |
| **Zod** | 3.25.76 | Schema validation |
| **Axios** | 1.11.0 | HTTP client |
| **Expo Secure Store** | 15.0.7 | Secure token storage |
| **Expo Image Picker** | 17.0.9 | Image selection |
| **Lucide React Native** | 0.475.0 | Icon library |

### Backend (API)

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | - | JavaScript runtime |
| **Express.js** | 5.0.1 | Web framework |
| **MongoDB/Mongoose** | 8.9.5 | Database & ODM |
| **Cloudinary** | 2.5.1 | Image storage & CDN |
| **JWT** | 9.0.2 | Authentication tokens |
| **Bcrypt.js** | 2.4.3 | Password hashing |
| **Multer** | 2.0.2 | File upload handling |
| **Helmet** | 8.0.0 | Security headers |
| **HPP** | 0.2.3 | HTTP parameter pollution protection |
| **Express Rate Limit** | 7.5.0 | Rate limiting |
| **Express Mongo Sanitize** | 2.2.0 | NoSQL injection prevention |
| **@google/generative-ai** | 0.24.1 | AI integration |

---

## 📁 Project Structure

```
PromptParaDise/
├── 📂 Expo-Custom-Template/          # Frontend Mobile App
│   ├── 📂 app/                       # Expo Router screens
│   │   ├── 📂 (auth)/               # Authentication screens
│   │   │   ├── _layout.tsx
│   │   │   ├── login.tsx            # Sign in screen
│   │   │   └── register.tsx         # Sign up screen
│   │   ├── 📂 (tabs)/               # Main tab navigation
│   │   │   ├── _layout.tsx
│   │   │   ├── home.tsx             # Feed/Discovery screen
│   │   │   ├── category.tsx         # Category browsing
│   │   │   ├── bookmark.tsx         # Saved prompts
│   │   │   └── profile.tsx          # User profile
│   │   ├── 📂 (other)/              # Other screens
│   │   │   ├── _layout.tsx
│   │   │   ├── create-prompt.tsx    # Create new prompt
│   │   │   ├── promptDetail.tsx     # View prompt details
│   │   │   └── user-prompt.tsx      # User's prompts list
│   │   └── _layout.tsx              # Root layout
│   ├── 📂 components/               # Reusable UI components
│   │   ├── 📂 cards/                # Card components
│   │   ├── 📂 forms/                # Form components
│   │   └── 📂 ui/                   # UI primitives
│   ├── 📂 context/                  # React Context providers
│   │   ├── AuthContext.tsx          # Authentication state
│   │   └── OtherContext.tsx         # Likes/Bookmarks state
│   ├── 📂 services/                 # API service layer
│   │   ├── api.service.ts           # Base API configuration
│   │   ├── auth.service.ts          # Auth API calls
│   │   ├── prompt.service.ts        # Prompt API calls
│   │   └── category.service.ts      # Category API calls
│   ├── 📂 types/                    # TypeScript definitions
│   ├── 📂 hooks/                    # Custom React hooks
│   └── 📂 config/                   # App configuration
│
├── 📂 server/                        # Backend API
│   ├── 📂 controllers/              # Request handlers
│   │   ├── user.controller.js       # User operations
│   │   ├── prompt.controller.js     # Prompt CRUD & interactions
│   │   ├── category.controller.js   # Category management
│   │   ├── ai.controller.js         # AI integration
│   │   └── health.controller.js     # Health checks
│   ├── 📂 models/                   # Mongoose schemas
│   │   ├── user.model.js            # User model
│   │   ├── prompt.model.js          # Prompt model
│   │   └── category.model.js        # Category model
│   ├── 📂 routes/                   # Express routes
│   │   ├── user.route.js            # /api/user/*
│   │   ├── prompt.route.js          # /api/prompts/*
│   │   ├── category.route.js        # /api/category/*
│   │   ├── media.route.js           # /api/media/*
│   │   ├── ai.route.js              # /api/ai/*
│   │   └── health.route.js          # /api/health/*
│   ├── 📂 middleware/               # Express middleware
│   │   ├── auth.middleware.js       # JWT authentication
│   │   ├── error.middleware.js      # Error handling
│   │   └── validation.middleware.js # Request validation
│   ├── 📂 utils/                    # Utility functions
│   │   ├── cloudinary.js            # Image upload helper
│   │   ├── multer.js                # File upload config
│   │   └── responsehandler.js       # Response formatting
│   ├── 📂 database/                 # DB configuration
│   └── index.js                     # Server entry point
│
└── README.md                         # Project readme
```

---

## 📊 Data Models

### User Model

```javascript
{
  name: String,              // Required, max 50 chars
  email: String,             // Required, unique, validated
  password: String,          // Required, min 6 chars, hashed
  avatar: String,            // Cloudinary URL (default avatar provided)
  bio: String,               // Optional, max 200 chars
  bookmarkedPrompts: [ObjectId],  // References to Prompt
  createdAt: Date,
  updatedAt: Date
}
```

**Features:**
- Password auto-hashed on save using bcrypt
- Method: `comparePassword(enteredPassword)` for authentication

---

### Prompt Model

```javascript
{
  title: String,             // Required, max 100 chars
  prompt: String,            // Required, max 5000 chars
  description: String,       // Required, max 500 chars
  imageUrl: String,          // Optional, validated URL
  tags: [String],            // Lowercase, trimmed
  category: ObjectId,        // Reference to Category (required)
  creator: ObjectId,         // Reference to User (required)
  likes: [ObjectId],         // Array of User references
  bookmarks: [ObjectId],     // Array of User references
  views: Number,             // Default: 0
  isPublic: Boolean,         // Default: true
  isFeatured: Boolean,       // Default: false (admin use)
  createdAt: Date,
  updatedAt: Date
}
```

**Virtual Fields:**
- `likeCount` - Returns number of likes
- `bookmarkCount` - Returns number of bookmarks

**Indexes:**
- `{ category: 1, isPublic: 1 }` - Category filtering
- `{ creator: 1, isPublic: 1 }` - User's prompts
- `{ tags: 1 }` - Tag-based search
- `{ createdAt: -1 }` - Chronological ordering

---

### Category Model

```javascript
{
  name: String,              // Required, unique, max 50 chars
  slug: String,              // Auto-generated from name
  description: String,       // Optional, max 200 chars
  icon: String,              // Icon identifier for UI
  color: String,             // Hex color (default: #6366f1)
  isActive: Boolean,         // Default: true
  promptCount: Number,       // Default: 0
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Reference

### Authentication Routes (`/api/user`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/signup` | ❌ | Create new user account (with avatar upload) |
| `POST` | `/signin` | ❌ | Authenticate user & get JWT token |
| `POST` | `/signout` | ✅ | Invalidate session |
| `GET` | `/profile` | ✅ | Get current user profile |
| `PATCH` | `/profile` | ✅ | Update user profile (with avatar upload) |
| `GET` | `/bookmarks` | ✅ | Get user's bookmarked prompts |

---

### Prompt Routes (`/api/prompts`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | ✅ | Create new prompt (with image upload) |
| `GET` | `/` | ✅ | Get all prompts (with search & pagination) |
| `GET` | `/userPrompts` | ✅ | Get current user's prompts |
| `GET` | `/userLikes` | ✅ | Get prompts liked by current user |
| `GET` | `/getprompt/:id` | ✅ | Get single prompt by ID |
| `POST` | `/toggleLike/:id` | ✅ | Toggle like on a prompt |
| `POST` | `/toggleBookmark/:id` | ✅ | Toggle bookmark on a prompt |

**Query Parameters for `GET /`:**
- `search` - Search term (searches title, prompt, description)
- `index` - Pagination offset (default: 0)
- `top` - Number of results (default: 10)

---

### Category Routes (`/api/category`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | ✅ | Get all categories |
| `GET` | `/:id` | ✅ | Get category by ID |
| `GET` | `/prompts/:id` | ✅ | Get prompts by category |

---

### Media Routes (`/api/media`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/upload` | ✅ | Upload image to Cloudinary |

---

### AI Routes (`/api/ai`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | ✅ | AI-powered features (Google Generative AI) |

---

### Health Check Routes (`/api/health`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | ❌ | Server health status |

---

## 📱 Frontend Screens

### Authentication Screens

| Screen | Path | Description |
|--------|------|-------------|
| **Login** | `/(auth)/login` | Email/password sign in |
| **Register** | `/(auth)/register` | Create account with avatar |

### Tab Navigation

| Screen | Path | Description |
|--------|------|-------------|
| **Home** | `/(tabs)/home` | Prompt feed with search |
| **Category** | `/(tabs)/category` | Browse by category |
| **Bookmark** | `/(tabs)/bookmark` | Saved prompts |
| **Profile** | `/(tabs)/profile` | User profile & stats |

### Other Screens

| Screen | Path | Description |
|--------|------|-------------|
| **Create Prompt** | `/(other)/create-prompt` | Create new prompt form |
| **Prompt Detail** | `/(other)/promptDetail` | Full prompt view |
| **User Prompts** | `/(other)/user-prompt` | Current user's prompts |

---

## 🔄 State Management

### AuthContext

Manages authentication state globally:

```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login(credentials: LoginCredentials): Promise<boolean>;
  register(credentials: RegisterCredentials): Promise<boolean>;
  logout(): Promise<void>;
  refreshToken(): Promise<void>;
}
```

**Features:**
- Auto-initializes auth state from Expo Secure Store
- Persists user/token across app restarts
- Handles token refresh

---

### OtherContext

Manages likes and bookmarks with **optimistic updates**:

```typescript
interface OtherContextType {
  userBookmarks: Prompt[];
  userLikes: Prompt[];
  optimisticToggleLike(prompt: Prompt): void;
  optimisticToggleBookmark(prompt: Prompt): void;
  refetchUserData(): Promise<void>;
}
```

**Features:**
- Optimistic UI updates for instant feedback
- Automatic sync on authentication
- Global like/bookmark state shared across screens

---

## 🔐 Authentication Flow

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   App Load  │────────▶│  Check Token │────────▶│ Auto Login  │
└─────────────┘         └──────┬──────┘         └─────────────┘
                               │ No Token
                               ▼
                        ┌─────────────┐
                        │ Show Login  │
                        └──────┬──────┘
                               │
              ┌────────────────┴────────────────┐
              ▼                                  ▼
       ┌─────────────┐                    ┌─────────────┐
       │   Sign In   │                    │   Sign Up   │
       └──────┬──────┘                    └──────┬──────┘
              │                                  │
              └────────────────┬────────────────┘
                               ▼
                        ┌─────────────┐
                        │  API Call   │
                        └──────┬──────┘
                               ▼
                        ┌─────────────┐
                        │ Store Token │◀──── Expo Secure Store
                        └──────┬──────┘
                               ▼
                        ┌─────────────┐
                        │ Navigate to │
                        │  Home Tab   │
                        └─────────────┘
```

**Token Storage:**
- JWT tokens stored in Expo Secure Store (encrypted)
- User data cached for offline access
- Auto-logout on token expiration

---

## ⭐ Key Features

### 1. Prompt Management
- ✅ Create prompts with title, content, description
- ✅ Attach images (uploaded to Cloudinary)
- ✅ Categorize prompts
- ✅ Tag-based organization
- ✅ Public/private visibility

### 2. Social Interactions
- ✅ Like prompts (with count)
- ✅ Bookmark prompts (with count)
- ✅ View creator profiles
- ✅ **Optimistic UI updates** for instant feedback

### 3. Discovery
- ✅ Browse all public prompts
- ✅ Search by title, content, description
- ✅ Filter by category
- ✅ Infinite scroll pagination

### 4. User Profile
- ✅ Custom avatar upload
- ✅ Bio/description
- ✅ View own prompts
- ✅ View liked/bookmarked prompts

### 5. Security
- ✅ Password hashing (bcrypt)
- ✅ JWT authentication
- ✅ Rate limiting
- ✅ Security headers (Helmet)
- ✅ NoSQL injection prevention
- ✅ HTTP parameter pollution protection

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js v14+
- npm or yarn
- MongoDB instance
- Cloudinary account
- Expo Go app (for mobile testing)

### Backend Setup

```bash
# Navigate to server
cd server

# Install dependencies
npm install

# Create .env file (see Environment Variables section)

# Start development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to app
cd Expo-Custom-Template

# Install dependencies
npm install

# Start Expo dev server
npm run dev
# or
npx expo start
```

### Testing on Device

1. Install **Expo Go** on your mobile device
2. Scan the QR code from the terminal
3. The app will load on your device

---

## 🔑 Environment Variables

### Backend (`server/.env`)

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/promptparadise

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# Google AI (Optional)
GOOGLE_API_KEY=your_google_ai_key
```

### Frontend (`Expo-Custom-Template/.env`)

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

---

## 📈 Performance Optimizations

1. **Database Indexing** - Compound indexes for common queries
2. **Optimistic Updates** - Instant UI feedback for likes/bookmarks
3. **Pagination** - Efficient data loading with skip/limit
4. **Image CDN** - Cloudinary for optimized image delivery
5. **Virtual Fields** - Computed counts without extra queries

---

## 🔮 Potential Future Enhancements

- [ ] Comments on prompts
- [ ] User following system
- [ ] Prompt collections/playlists
- [ ] Advanced search filters
- [ ] Push notifications
- [ ] Share prompts externally
- [ ] AI-powered prompt suggestions
- [ ] Premium features / monetization

---

## 👤 Author

**Naman Nema**

---

*Last Updated: December 2024*

