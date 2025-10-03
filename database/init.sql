-- Create tables for lecturer reporting system
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'lecturer', 'principal_lecturer', 'program_leader')),
    name VARCHAR(255) NOT NULL,
    faculty VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    course_code VARCHAR(50) UNIQUE NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    faculty VARCHAR(255) NOT NULL,
    lecturer_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    faculty_name VARCHAR(255) NOT NULL,
    class_name VARCHAR(255) NOT NULL,
    week_of_reporting INTEGER NOT NULL,
    date_of_lecture DATE NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    course_code VARCHAR(100) NOT NULL,
    lecturer_name VARCHAR(255) NOT NULL,
    actual_students_present INTEGER NOT NULL,
    total_registered_students INTEGER NOT NULL,
    venue VARCHAR(255) NOT NULL,
    scheduled_time TIME NOT NULL,
    topic_taught TEXT NOT NULL,
    learning_outcomes TEXT NOT NULL,
    recommendations TEXT,
    lecturer_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
    prl_id INTEGER REFERENCES users(id),
    feedback_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users (passwords are hashed 'password123')
INSERT INTO users (email, password, role, name, faculty) VALUES
('student@luct.ac.ls', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'John Student', 'ICT'),
('lecturer@luct.ac.ls', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'lecturer', 'Dr. Smith Lecturer', 'ICT'),
('prl@luct.ac.ls', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'principal_lecturer', 'Prof. PRL User', 'ICT'),
('pl@luct.ac.ls', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'program_leader', 'Dr. PL Manager', 'ICT');

-- Insert sample courses
INSERT INTO courses (course_code, course_name, faculty, lecturer_id) VALUES
('DIWA2110', 'Web Application Development', 'ICT', 2),
('DIMA3110', 'Database Management', 'ICT', 2),
('DIWA3110', 'Advanced Web Development', 'ICT', 2);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reports_lecturer_id ON reports(lecturer_id);
CREATE INDEX IF NOT EXISTS idx_reports_course_code ON reports(course_code);
CREATE INDEX IF NOT EXISTS idx_ratings_report_id ON ratings(report_id);
CREATE INDEX IF NOT EXISTS idx_feedback_report_id ON feedback(report_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);