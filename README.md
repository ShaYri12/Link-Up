# LinkUp - Social Media Platform

A full-stack social media application built with React, Node.js, Express, MongoDB, and Socket.IO. LinkUp provides a modern social networking experience with real-time messaging, posts, stories, job listings, and more.

![LinkUp Banner](client/src/assets/cover.png)

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- Cookie-based session management
- Profile management with image upload

### 📱 Social Features
- **Posts**: Create, view, and delete posts with images/videos
- **Stories**: Share temporary stories (Instagram-style)
- **Comments**: Comment on posts with real-time updates
- **Likes**: Optimistic UI updates for instant feedback
- **Followers System**: Follow/unfollow users
- **User Profiles**: Customizable profiles with cover and profile pictures

### 💬 Real-time Messaging
- One-on-one chat with Socket.IO
- Group chat functionality
- Typing indicators
- Online/offline status
- Message notifications
- Real-time message delivery

### 💼 Job Board
- Post job listings
- Browse open and closed positions
- Job application management
- CV upload support

### 🎨 UI/UX Features
- **Dark/Light Mode**: Smooth theme transitions
- **Responsive Design**: Mobile-first approach with Bootstrap
- **Modern UI**: Material-UI icons and Chakra UI components
- **Smooth Animations**: Framer Motion transitions
- **Loading States**: Skeleton loaders and spinners
- **Toast Notifications**: User feedback for actions

### 🔍 Search & Discovery
- User search functionality
- Search results page
- Profile discovery

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **React Query** - Server state management with caching
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **SCSS/Sass** - Styling with themify mixins
- **Bootstrap 5** - Responsive layout
- **Material-UI** - Icons and components
- **Chakra UI** - Chat UI components
- **Framer Motion** - Animations
- **Moment.js** - Date formatting
- **React Toastify** - Toast notifications
- **React Lottie** - Animated icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.IO** - WebSocket server
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Cloudinary** - Media storage and management
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Cookie handling
- **Dotenv** - Environment variables

## 📁 Project Structure

```
Link-Up/
├── client/                 # React frontend
│   ├── public/
│   │   └── upload/        # Static uploads
│   ├── src/
│   │   ├── animations/    # Lottie animations
│   │   ├── assets/        # Images and static files
│   │   ├── components/    # React components
│   │   │   ├── comments/
│   │   │   ├── job/
│   │   │   ├── navbar/
│   │   │   ├── post/
│   │   │   ├── share/
│   │   │   └── ...
│   │   ├── context/       # React Context providers
│   │   ├── pages/         # Page components
│   │   │   ├── home/
│   │   │   ├── chats/
│   │   │   ├── Jobs/
│   │   │   ├── profile/
│   │   │   └── ...
│   │   ├── App.js
│   │   ├── axios.js       # Axios configuration
│   │   ├── index.js
│   │   └── style.scss     # Global styles
│   ├── package.json
│   └── vite.config.js
│
└── api/                   # Node.js backend
    ├── controllers/       # Route controllers
    │   ├── auth.js
    │   ├── post.js
    │   ├── user.js
    │   ├── chatControllers.js
    │   └── ...
    ├── middleware/        # Custom middleware
    │   ├── authMiddleware.js
    │   └── uploadMiddleware.js
    ├── models/           # Mongoose models
    │   ├── userModel.js
    │   ├── postModel.js
    │   ├── chatModel.js
    │   └── ...
    ├── routes/           # API routes
    │   ├── auth.js
    │   ├── posts.js
    │   ├── users.js
    │   ├── chatRoutes.js
    │   └── ...
    ├── .env              # Environment variables
    ├── index.js          # Server entry point
    ├── package.json
    └── vercel.json       # Vercel deployment config
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image/video uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Link-Up.git
   cd Link-Up
   ```

2. **Install backend dependencies**
   ```bash
   cd api
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Configuration

1. **Backend Environment Variables**
   
   Create a `.env` file in the `api` directory:
   ```env
   # MongoDB
   MONGO_URL=mongodb://localhost:27017/linkup
   # or for MongoDB Atlas:
   # MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/linkup

   # JWT Secret
   JWT_SECRET=your_jwt_secret_key_here

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Server Port
   PORT=8800
   ```

2. **Frontend Environment Variables**
   
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:8800/api
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd api
   npm run server
   ```
   Server will run on `http://localhost:8800`

2. **Start the frontend (in a new terminal)**
   ```bash
   cd client
   npm run dev
   ```
   Client will run on `http://localhost:5173`

3. **Access the application**
   
   Open your browser and navigate to `http://localhost:5173`

## 🔧 Available Scripts

### Frontend (client/)
- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend (api/)
- `npm run server` - Start server with nodemon (auto-restart on changes)

## 📦 Key Dependencies Explained

### Frontend
- **@tanstack/react-query** - Provides caching, automatic refetching, and optimistic updates
- **socket.io-client** - Real-time bidirectional communication
- **react-router-dom** - Declarative routing for React
- **vite-plugin-svgr** - Import SVGs as React components

### Backend
- **mongoose** - MongoDB object modeling
- **jsonwebtoken** - JWT creation and verification
- **bcryptjs** - Password hashing
- **cloudinary** - Cloud-based image/video management
- **socket.io** - Real-time WebSocket server
- **multer** - Multipart/form-data file uploads

## 🎨 Theme System

LinkUp features a dynamic theme system with smooth transitions:
- Light and dark modes
- Theme persistence
- SCSS mixins for consistent theming
- Smooth 0.3s transitions on theme change

## 🔐 Authentication Flow

1. User registers with name, email, username, and password
2. Password is hashed with bcrypt before storage
3. On login, JWT token is generated and stored in httpOnly cookie
4. Token is validated on protected routes via middleware
5. User data is available via AuthContext throughout the app

## 💾 Database Models

- **User** - Profile info, credentials, followers/following
- **Post** - Content, images/videos, likes, comments
- **Comment** - Post comments with user references
- **Like** - Post likes tracking
- **Story** - Temporary stories with expiration
- **Relationship** - Follower/following connections
- **Chat** - One-on-one and group chat rooms
- **Message** - Chat messages with sender info
- **Job** - Job postings with application tracking

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/find/:userId` - Get user by ID
- `PUT /api/users/` - Update user profile
- `PUT /api/users/online` - Update online status
- `GET /api/users/search` - Search users

### Posts
- `GET /api/posts/` - Get timeline posts
- `POST /api/posts/` - Create new post
- `DELETE /api/posts/:id` - Delete post

### Comments
- `GET /api/comments?postId=:id` - Get post comments
- `POST /api/comments` - Add comment

### Likes
- `GET /api/likes?postId=:id` - Get post likes
- `POST /api/likes` - Like post
- `DELETE /api/likes?postId=:id` - Unlike post

### Jobs
- `GET /api/jobs/` - Get all jobs
- `POST /api/jobs/` - Create job posting
- `GET /api/jobs/open` - Get open jobs
- `GET /api/jobs/closed` - Get closed jobs

### Chats & Messages
- `POST /api/chat/` - Create or access chat
- `GET /api/chat/` - Get user chats
- `POST /api/message` - Send message
- `GET /api/message/:chatId` - Get chat messages

### File Upload
- `POST /api/upload` - Upload files to Cloudinary

## 🔌 Socket.IO Events

### Client → Server
- `setup` - Initialize user socket connection
- `join chat` - Join specific chat room
- `typing` - Notify others user is typing
- `stop typing` - Notify others user stopped typing
- `new message` - Send new message

### Server → Client
- `connected` - Confirm connection established
- `typing` - Receive typing notification
- `stop typing` - Receive stop typing notification
- `message received` - Receive new message

## 🎯 Features Implementation Details

### Optimistic Updates
Like functionality uses optimistic updates for instant UI feedback:
1. UI updates immediately on click
2. Request sent to server in background
3. On error, UI rolls back to previous state
4. On success, syncs with server

### Image/Video Handling
- Supports both local uploads and Cloudinary URLs
- Automatic video detection by file extension
- Lazy loading for better performance
- Fallback to default avatar for missing images

### Real-time Chat
- Socket.IO rooms for private conversations
- Typing indicators with 3-second timeout
- Message persistence in MongoDB
- Notification system for new messages

## 🚢 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in hosting platform

### Backend (Vercel/Heroku)
1. Ensure `vercel.json` is configured (included)
2. Set all environment variables
3. Deploy via Git or CLI

### Environment Variables for Production
Update API URLs to production endpoints in frontend `.env`:
```env
VITE_API_URL=https://your-api-domain.com/api
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Your Name
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Material-UI for icons
- Chakra UI for chat components
- Cloudinary for media hosting
- MongoDB for database
- Socket.IO for real-time features

## 📸 Screenshots

> Add screenshots of your application here

### Home Feed
![Home Feed](screenshots/home.png)

### Chat Interface
![Chat](screenshots/chat.png)

### Dark Mode
![Dark Mode](screenshots/dark-mode.png)

### Job Board
![Jobs](screenshots/jobs.png)

---

⭐ Star this repo if you find it helpful!
