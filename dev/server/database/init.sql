-- ENUM Type Definitions
CREATE TYPE user_type_enum AS ENUM ('job_seeker', 'company_representative', 'admin');
CREATE TYPE company_approval_status_enum AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE internship_status_enum AS ENUM ('applied', 'confirmed', 'completed', 'cancelled_by_seeker', 'cancelled_by_company', 'rejected_by_company');
CREATE TYPE notification_target_enum AS ENUM ('all', 'job_seeker', 'company_representative');

-- Trigger Function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Users Table
CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type user_type_enum NOT NULL,
    profile_image_url VARCHAR(2048),
    profile_summary TEXT,
    company_id BIGINT, -- Nullable, will be updated by application logic
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Companies Table
CREATE TABLE companies (
    company_id BIGSERIAL PRIMARY KEY,
    representative_user_id BIGINT UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    location VARCHAR(255),
    website_url VARCHAR(2048),
    description TEXT,
    pr_message TEXT,
    logo_image_url VARCHAR(2048),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(30),
    approval_status company_approval_status_enum DEFAULT 'pending' NOT NULL,
    approved_by_admin_id BIGINT,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    FOREIGN KEY (representative_user_id) REFERENCES users(user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (approved_by_admin_id) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Add Foreign Key from users to companies after companies table is created
-- This resolves the circular dependency for users.company_id
ALTER TABLE users
ADD CONSTRAINT fk_users_company_id
FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE SET NULL ON UPDATE CASCADE;

-- Events Table
CREATE TABLE events (
    event_id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    event_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER,
    location_type VARCHAR(50),
    location_detail VARCHAR(255),
    capacity INTEGER,
    application_deadline TIMESTAMP WITH TIME ZONE,
    is_published BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Internship Applications/Records Table
CREATE TABLE internship_applications (
    application_id BIGSERIAL PRIMARY KEY,
    job_seeker_id BIGINT NOT NULL,
    company_id BIGINT NOT NULL,
    event_id BIGINT,
    status internship_status_enum NOT NULL,
    application_datetime TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    preferred_start_date DATE,
    message_to_company TEXT,
    internship_start_datetime TIMESTAMP WITH TIME ZONE,
    internship_end_datetime TIMESTAMP WITH TIME ZONE,
    achievement_summary TEXT,
    evaluation_score INTEGER CHECK (evaluation_score >= 1 AND evaluation_score <= 5),
    feedback_from_company TEXT,
    feedback_to_company TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    FOREIGN KEY (job_seeker_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE SET NULL ON UPDATE CASCADE,
    UNIQUE (job_seeker_id, company_id, event_id) -- Consider partial unique index if event_id can be NULL frequently and cause issues.
);

-- Skill Point Logs Table
CREATE TABLE skill_point_logs (
    log_id BIGSERIAL PRIMARY KEY,
    job_seeker_id BIGINT NOT NULL,
    application_id BIGINT,
    skill_category VARCHAR(100) NOT NULL,
    points_awarded INTEGER NOT NULL CHECK (points_awarded > 0),
    reason VARCHAR(255),
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    FOREIGN KEY (job_seeker_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (application_id) REFERENCES internship_applications(application_id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Badge Masters Table
CREATE TABLE badge_masters (
    badge_id SERIAL PRIMARY KEY,
    badge_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon_url VARCHAR(2048),
    acquisition_criteria_summary TEXT,
    skill_category_related VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- User Badges Table
CREATE TABLE user_badges (
    user_badge_id BIGSERIAL PRIMARY KEY,
    job_seeker_id BIGINT NOT NULL,
    badge_id INTEGER NOT NULL,
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    application_id BIGINT,
    FOREIGN KEY (job_seeker_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badge_masters(badge_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (application_id) REFERENCES internship_applications(application_id) ON DELETE SET NULL ON UPDATE CASCADE,
    UNIQUE (job_seeker_id, badge_id)
);

-- Notifications Table
CREATE TABLE notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    target_user_type notification_target_enum DEFAULT 'all' NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_by_admin_id BIGINT,
    is_archived BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    FOREIGN KEY (created_by_admin_id) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Password Reset Tokens Table
CREATE TABLE password_reset_tokens (
    token_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Apply Triggers
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON companies
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_internship_applications_updated_at
BEFORE UPDATE ON internship_applications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_badge_masters_updated_at
BEFORE UPDATE ON badge_masters
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON notifications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
