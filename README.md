# StudyStream Learning Platform

A modern, gamified learning platform built with React, TypeScript, and Node.js. Features personalized recommendations, goal tracking, achievements, and progress monitoring.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Setup

1. **Install frontend dependencies:**
   ```bash
   npm install
   ```

2. **Install backend dependencies:**
   ```bash
   npm run backend:install
   ```

3. **Start both frontend and backend:**
   ```bash
   npm run dev:full
   ```

   Or start them separately:
   ```bash
   # Terminal 1 - Backend
   npm run dev:backend
   
   # Terminal 2 - Frontend  
   npm run dev
   ```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health

## 🏗️ Project Structure

```
studystream-flow/
├── src/                          # Frontend React application
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── AuthLayout.tsx       # Authentication layout
│   │   ├── LoginForm.tsx        # Login form component
│   │   ├── SignupForm.tsx       # Registration form component
│   │   └── Dashboard.tsx        # Main dashboard
│   ├── services/                # API services
│   │   ├── api.js              # Main API service
│   │   └── auth.js             # Authentication service
│   └── pages/                   # Page components
├── backend/                     # Node.js/Express backend
│   ├── routes/                 # API routes
│   │   ├── auth.js            # Authentication endpoints
│   │   ├── content.js         # Content management
│   │   ├── goals.js           # Goal tracking
│   │   └── achievements.js    # Achievement system
│   ├── database/              # Database files
│   │   ├── schema.sql         # Database schema
│   │   └── init.js            # Database initialization
│   ├── middleware/            # Express middleware
│   │   └── auth.js            # JWT authentication
│   └── server.js              # Main server file
└── package.json               # Project configuration
```

## 🎯 Features

### Authentication
- User registration with grade level and subject interests
- Secure login with JWT tokens
- Password hashing with bcrypt

### Learning Content
- Personalized content recommendations
- Multiple content types (videos, quizzes, readings)
- Progress tracking and completion status
- Difficulty levels (Beginner, Intermediate, Advanced)

### Goal Management
- Daily, weekly, and monthly goals
- Progress tracking with visual indicators
- Auto-suggested goals based on user interests
- Goal completion rewards

### Gamification
- Points system for completed activities
- Achievement badges and rewards
- Learning streaks tracking
- Leaderboards for motivation

### Dashboard
- Personalized learning recommendations
- Daily goals and progress tracking
- Achievement showcase
- Learning statistics and analytics

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **shadcn/ui** for beautiful, accessible components
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** for form handling
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **SQLite** database for data persistence
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled for frontend integration

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Content
- `GET /api/content` - Get all content (with filters)
- `GET /api/content/:id` - Get specific content
- `GET /api/content/recommendations/:userId` - Get personalized recommendations
- `POST /api/content/:id/progress` - Update content progress

### Goals
- `GET /api/goals/:userId` - Get user goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:goalId` - Update goal progress
- `DELETE /api/goals/:goalId` - Delete goal
- `GET /api/goals/suggestions/:userId` - Get goal suggestions

### Achievements
- `GET /api/achievements/:userId` - Get user achievements
- `POST /api/achievements/check/:userId` - Check for new achievements
- `GET /api/achievements/leaderboard/points` - Points leaderboard
- `GET /api/achievements/leaderboard/streak` - Streak leaderboard

## 🎨 UI/UX Features

### Design System
- Clean, modern interface with rounded cards
- Soft shadows and smooth animations
- Blue/teal color palette with accent colors
- Responsive design for all screen sizes

### User Experience
- Split-screen authentication layout
- Smooth transitions between login/signup
- Real-time progress tracking
- Interactive goal management
- Achievement notifications

## 🔧 Development

### Available Scripts

```bash
# Frontend development
npm run dev                 # Start Vite dev server
npm run build              # Build for production
npm run preview            # Preview production build

# Backend development  
npm run backend:start      # Start backend server
npm run backend:dev        # Start backend with nodemon
npm run backend:install    # Install backend dependencies

# Full-stack development
npm run dev:full          # Start both frontend and backend
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

## 🚀 Deployment

### Frontend Deployment
The frontend can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

### Backend Deployment
The backend can be deployed to:
- Heroku
- Railway
- DigitalOcean App Platform
- AWS EC2
- Google Cloud Run

### Database
The application uses SQLite for development. For production, consider:
- PostgreSQL
- MySQL
- MongoDB
- AWS RDS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the API endpoints
- Test with the health check endpoint
- Ensure both frontend and backend are running

---

**Happy Learning! 🎓**