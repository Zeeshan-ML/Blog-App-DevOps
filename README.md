# BlogApp - Next.js Blog Application

A full-stack blog application built with Next.js 15, TypeScript, Tailwind CSS, and SQLite database. **Fully containerized with Docker** and ready for cloud deployment on AWS EC2.

## 🚀 Quick Start

### Run Locally (Development)
```bash
npm install
npm run dev
```
Open http://localhost:3000

### Run with Docker (Production)
```bash
docker compose up -d
```
See [QUICKSTART.md](QUICKSTART.md) for detailed instructions.

## 📦 Docker Deployment

This application is **fully containerized** and ready for deployment:

- ✅ **Dockerfile** - Multi-stage build for optimized image
- ✅ **docker-compose.yml** - Multi-container orchestration  
- ✅ **Persistent Volumes** - Database data persists across restarts
- ✅ **AWS EC2 Ready** - Complete deployment guide included

### Quick Docker Commands

```bash
# Build and start
docker compose up -d

# View logs
docker compose logs -f

# Stop
docker compose down

# Push to Docker Hub
docker build -t <username>/blog-app:latest .
docker push <username>/blog-app:latest
```

📖 **Full Documentation:**
- [QUICKSTART.md](QUICKSTART.md) - Get started in 5 minutes
- [DEPLOYMENT.md](DEPLOYMENT.md) - Complete deployment guide for AWS EC2

## Features

- 🔐 User authentication (signup/login) with secure password hashing
- ✍️ Create, read, update, and delete blog posts
- 🎨 Beautiful UI with Tailwind CSS
- 🗄️ Lightweight SQLite database
- 🚀 Server-side rendering with Next.js App Router
- 📱 Responsive design

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite with better-sqlite3
- **Authentication:** bcryptjs for password hashing
- **Session Management:** Cookie-based sessions

## Project Structure

```
blog-app/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts      # Login API endpoint
│   │   │   ├── signup/route.ts     # Signup API endpoint
│   │   │   └── logout/route.ts     # Logout API endpoint
│   │   └── blogs/
│   │       ├── route.ts            # Get all blogs, Create blog
│   │       └── [id]/route.ts       # Get, Update, Delete blog by ID
│   ├── blogs/
│   │   ├── page.tsx                # Blog listing page
│   │   ├── create/page.tsx         # Create blog page
│   │   └── [id]/
│   │       ├── page.tsx            # Blog detail page
│   │       ├── DeleteButton.tsx    # Client component for delete
│   │       └── edit/page.tsx       # Edit blog page
│   ├── login/page.tsx              # Login page
│   ├── signup/page.tsx             # Signup page
│   └── page.tsx                    # Landing page
├── lib/
│   ├── db.ts                       # Database initialization & schema
│   └── auth.ts                     # Authentication utilities
└── blog.db                         # SQLite database (auto-generated)
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. The project is already set up in the `blog-app` directory

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique user email
- `password` - Hashed password
- `name` - User's full name
- `created_at` - Timestamp

### Blogs Table
- `id` - Primary key
- `title` - Blog post title
- `content` - Blog post content
- `author_id` - Foreign key to users table
- `created_at` - Timestamp
- `updated_at` - Timestamp

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Blogs
- `GET /api/blogs` - Get all blog posts
- `POST /api/blogs` - Create new blog post (requires authentication)
- `GET /api/blogs/[id]` - Get single blog post
- `PUT /api/blogs/[id]` - Update blog post (requires authentication & ownership)
- `DELETE /api/blogs/[id]` - Delete blog post (requires authentication & ownership)

## Features Explanation

### Authentication
- Passwords are hashed using bcryptjs before storing
- Sessions are managed using HTTP-only cookies
- Protected routes require authentication
- Users can only edit/delete their own blog posts

### Blog Management
- Anyone can view blogs
- Only authenticated users can create blogs
- Authors can edit and delete their own blogs
- Blog posts show author name and timestamps

## Development

### Build for production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

## Notes

- The SQLite database file (`blog.db`) is automatically created on first run
- The database is lightweight and perfect for development and small-scale applications
- No external database server required
- All data is stored locally in the `blog.db` file

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## License

MIT

