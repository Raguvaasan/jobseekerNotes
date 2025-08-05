-- Database setup for Jobseeker Profile with Notes functionality

-- Create database
CREATE DATABASE IF NOT EXISTS jobseeker_db;
USE jobseeker_db;

-- Users table (for authentication and role management)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Recruitment Executive', 'Manager', 'Admin', 'HR') DEFAULT 'Recruitment Executive',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Jobseekers table (basic jobseeker information)
CREATE TABLE IF NOT EXISTS jobseekers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(100),
    experience_years INT DEFAULT 0,
    skills TEXT,
    resume_url VARCHAR(255),
    status ENUM('Active', 'Inactive', 'Hired', 'Rejected') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Jobseeker notes table (main feature)
CREATE TABLE IF NOT EXISTS jobseeker_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jobseeker_id INT NOT NULL,
    note TEXT NOT NULL,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jobseeker_id) REFERENCES jobseekers(id) ON DELETE CASCADE,
    INDEX idx_jobseeker_id (jobseeker_id),
    INDEX idx_created_at (created_at)
);

-- Insert sample users
INSERT INTO users (name, email, password, role) VALUES 
('John Recruiter', 'recruiter@example.com', '$2b$10$example_hashed_password', 'Recruitment Executive'),
('Jane Manager', 'manager@example.com', '$2b$10$example_hashed_password', 'Manager'),
('Admin User', 'admin@example.com', '$2b$10$example_hashed_password', 'Admin');

-- Insert sample jobseekers
INSERT INTO jobseekers (name, email, phone, location, experience_years, skills, status) VALUES 
('Alice Johnson', 'alice@example.com', '+1234567890', 'New York', 3, 'JavaScript, React, Node.js', 'Active'),
('Bob Smith', 'bob@example.com', '+1234567891', 'California', 5, 'Python, Django, PostgreSQL', 'Active'),
('Carol Davis', 'carol@example.com', '+1234567892', 'Texas', 2, 'Java, Spring, MySQL', 'Active');

-- Insert sample notes
INSERT INTO jobseeker_notes (jobseeker_id, note, created_by) VALUES 
(1, 'Initial interview completed. Candidate shows strong technical skills in React and Node.js. Good communication skills and team fit.', 'John Recruiter'),
(1, 'Second round technical assessment scheduled for next week. Focus on system design and problem-solving abilities.', 'Jane Manager'),
(2, 'Excellent Python expertise demonstrated. Has experience with large-scale applications. Salary expectations are within range.', 'John Recruiter'),
(3, 'Junior developer with good potential. Would benefit from mentorship program. Shows enthusiasm for learning new technologies.', 'John Recruiter');
