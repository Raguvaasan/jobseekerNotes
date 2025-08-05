# Jobseeker Profile Management System

A comprehensive web application for managing jobseeker profiles with advanced note-taking functionality. Built with Next.js (Frontend), Node.js/Express (Backend), and MySQL (Database).

## 🚀 Features

### Core Functionality
- **Jobseeker Profile Management**: View detailed jobseeker profiles with personal information, skills, and experience
- **Notes System**: Add, view, edit, and delete notes for each jobseeker
- **Role-Based Access Control**: Only users with "Recruitment Executive" role or higher can manage notes
- **Real-time Updates**: Dynamic UI updates without page refresh
- **Input Validation**: Minimum 20-character requirement for notes
- **Confirmation Modals**: Safe deletion with user confirmation

### Technical Features
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **TypeScript**: Full type safety across frontend and backend
- **RESTful API**: Clean API endpoints following REST conventions
- **Error Handling**: Comprehensive error handling and user feedback
- **Database Integration**: MySQL database with proper schema design

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom React components
- **Date Handling**: date-fns library

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL
- **Authentication**: JWT tokens
- **Security**: bcryptjs for password hashing

### Database
- **Database**: MySQL
- **ORM**: mysql2 (direct SQL queries)
- **Schema**: Normalized relational design

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE jobseeker_db;
```

2. Run the database schema:
```bash
mysql -u root -p jobseeker_db < backend/database/schema.sql
```

### 3. Environment Configuration

Create environment files:

**Backend (.env in /backend directory):**
```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=jobseeker_db
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

### 4. Development Mode

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run dev:backend
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📁 Project Structure

```
jobseeker-app/
├── src/app/                    # Next.js App Router
│   ├── api/                    # API routes
│   │   └── jobseeker/[id]/notes/   # Notes API endpoints
│   ├── profile/[id]/           # Dynamic profile pages
│   ├── jobseekers/             # Jobseekers listing
│   └── page.tsx                # Home page
├── src/components/             # Reusable React components
│   └── NotesSection.tsx        # Notes management component
├── backend/                    # Express.js backend
│   ├── routes/                 # API route handlers
│   ├── middleware/             # Authentication & validation
│   ├── database/               # Database schema & migrations
│   └── server.ts               # Express server setup
└── README.md                   # Project documentation
```

## 🔌 API Endpoints

### Notes Management
- `GET /api/jobseeker/:id/notes` - Fetch all notes for a jobseeker
- `POST /api/jobseeker/:id/notes` - Add new note
- `PUT /api/jobseeker/:id/notes` - Update existing note
- `DELETE /api/jobseeker/:id/notes?noteId=:noteId` - Delete note

### Request/Response Examples

**Add Note:**
```json
POST /api/jobseeker/1/notes
{
  "note": "Initial interview completed. Candidate shows strong technical skills..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Note added successfully",
  "data": {
    "id": 123,
    "jobseeker_id": 1,
    "note": "Initial interview completed...",
    "created_by": "1",
    "created_by_name": "John Recruiter",
    "created_at": "2024-08-05T10:30:00Z"
  }
}
```

## 🔒 Access Control

The application implements role-based access control:

- **Recruitment Executive**: Can add, edit, delete notes
- **Manager**: Can add, edit, delete notes  
- **Admin**: Can add, edit, delete notes
- **Other roles**: Can only view notes (read-only)

## ✅ Acceptance Criteria

All project requirements have been implemented:

- ✅ Notes can be added and saved to the database
- ✅ Notes display correctly in UI with timestamps
- ✅ No duplicate or blank notes allowed
- ✅ Basic validation and success/error feedback
- ✅ Only authorized roles can add/edit/delete notes
- ✅ User tracking in created_by field for traceability
- ✅ Edit/Delete functionality with confirmation modal
- ✅ Minimum 20-character note requirement
- ✅ API submission to /api/jobseeker/id/notes endpoint

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel or your preferred platform
```

### Backend (Production)
```bash
cd backend
npm run build
npm run start
```

### Database (Production)
- Set up MySQL instance
- Update environment variables
- Run database migrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

**Database Connection Issues:**
- Verify MySQL is running
- Check database credentials in .env file
- Ensure database exists and schema is imported

**Port Conflicts:**
- Frontend runs on port 3000
- Backend runs on port 3001
- Update ports in .env if needed

**API Errors:**
- Check browser console for detailed error messages
- Verify backend server is running
- Check API endpoint URLs
# jobseekerNotes
