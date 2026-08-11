-- =========================================================
-- COLLEGE LOST & FOUND MANAGEMENT SYSTEM
-- Database: MySQL 8.0+
-- =========================================================

CREATE DATABASE IF NOT EXISTS lost_found_db;

USE lost_found_db;

-- =========================================================
-- 1. USERS
-- =========================================================

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'SECURITY', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB;


-- =========================================================
-- 2. DEPARTMENTS
-- =========================================================

CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- =========================================================
-- 3. CATEGORIES
-- =========================================================

CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- =========================================================
-- 4. LOCATIONS
-- =========================================================

CREATE TABLE locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    location_name VARCHAR(150) NOT NULL UNIQUE,
    description VARCHAR(255),
    department_id INT,

    FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    INDEX idx_locations_department (department_id)
) ENGINE=InnoDB;


-- =========================================================
-- 5. LOST ITEMS
-- =========================================================

CREATE TABLE lost_items (
    lost_item_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,
    category_id INT NOT NULL,
    location_id INT NOT NULL,

    title VARCHAR(150) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),

    lost_date DATE NOT NULL,
    approximate_time TIME,

    status ENUM(
        'ACTIVE',
        'POTENTIAL_MATCH',
        'CLAIM_PENDING',
        'CLAIM_APPROVED',
        'RETURNED',
        'CLOSED'
    ) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    FOREIGN KEY (location_id)
        REFERENCES locations(location_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    INDEX idx_lost_category (category_id),
    INDEX idx_lost_location (location_id),
    INDEX idx_lost_date (lost_date),
    INDEX idx_lost_status (status),
    INDEX idx_lost_user (user_id)
) ENGINE=InnoDB;


-- =========================================================
-- 6. FOUND ITEMS
-- =========================================================

CREATE TABLE found_items (
    found_item_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,
    category_id INT NOT NULL,
    location_id INT NOT NULL,

    title VARCHAR(150) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),

    found_date DATE NOT NULL,
    approximate_time TIME,

    status ENUM(
        'ACTIVE',
        'POTENTIAL_MATCH',
        'CLAIM_PENDING',
        'CLAIM_APPROVED',
        'RETURNED',
        'CLOSED'
    ) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    FOREIGN KEY (location_id)
        REFERENCES locations(location_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    INDEX idx_found_category (category_id),
    INDEX idx_found_location (location_id),
    INDEX idx_found_date (found_date),
    INDEX idx_found_status (status),
    INDEX idx_found_user (user_id)
) ENGINE=InnoDB;


-- =========================================================
-- 7. ITEM DETAILS
-- =========================================================
-- Stores category-specific attributes.
-- One detail record belongs to either one lost item or one found item.
-- The backend will validate which fields are relevant for the
-- selected category.

CREATE TABLE item_details (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,

    lost_item_id INT UNIQUE,
    found_item_id INT UNIQUE,

    brand VARCHAR(100),
    model VARCHAR(100),
    color VARCHAR(50),
    material VARCHAR(100),
    item_type VARCHAR(100),

    storage_capacity VARCHAR(50),
    case_color VARCHAR(50),

    cash_amount DECIMAL(12,2),
    number_of_cards INT,
    id_present BOOLEAN,

    number_of_compartments INT,
    contents TEXT,

    distinguishing_features TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (lost_item_id)
        REFERENCES lost_items(lost_item_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (found_item_id)
        REFERENCES found_items(found_item_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_item_reference
        CHECK (
            (lost_item_id IS NOT NULL AND found_item_id IS NULL)
            OR
            (lost_item_id IS NULL AND found_item_id IS NOT NULL)
        ),

    CONSTRAINT chk_cash_amount
        CHECK (cash_amount IS NULL OR cash_amount >= 0),

    CONSTRAINT chk_number_of_cards
        CHECK (number_of_cards IS NULL OR number_of_cards >= 0),

    CONSTRAINT chk_compartments
        CHECK (
            number_of_compartments IS NULL
            OR number_of_compartments >= 0
        )
) ENGINE=InnoDB;


-- =========================================================
-- 8. MATCHES
-- =========================================================

CREATE TABLE matches (
    match_id INT AUTO_INCREMENT PRIMARY KEY,

    lost_item_id INT NOT NULL,
    found_item_id INT NOT NULL,

    match_score DECIMAL(5,2) NOT NULL,

    match_classification ENUM(
        'NO_MEANINGFUL_MATCH',
        'POSSIBLE_MATCH',
        'STRONG_POTENTIAL_MATCH',
        'VERY_STRONG_POTENTIAL_MATCH'
    ) NOT NULL,

    category_score DECIMAL(5,2) DEFAULT 0,
    color_score DECIMAL(5,2) DEFAULT 0,
    brand_score DECIMAL(5,2) DEFAULT 0,
    location_score DECIMAL(5,2) DEFAULT 0,
    datetime_score DECIMAL(5,2) DEFAULT 0,
    specific_attribute_score DECIMAL(5,2) DEFAULT 0,
    description_score DECIMAL(5,2) DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (lost_item_id)
        REFERENCES lost_items(lost_item_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (found_item_id)
        REFERENCES found_items(found_item_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    UNIQUE KEY unique_lost_found_match (
        lost_item_id,
        found_item_id
    ),

    INDEX idx_match_score (match_score),
    INDEX idx_match_lost (lost_item_id),
    INDEX idx_match_found (found_item_id)
) ENGINE=InnoDB;


-- =========================================================
-- 9. CLAIM REQUESTS
-- =========================================================

CREATE TABLE claim_requests (
    claim_id INT AUTO_INCREMENT PRIMARY KEY,

    match_id INT NOT NULL,
    claimant_user_id INT NOT NULL,

    status ENUM(
        'PENDING',
        'APPROVED',
        'REJECTED',
        'COMPLETED'
    ) NOT NULL DEFAULT 'PENDING',

    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,

    reviewer_user_id INT NULL,

    reviewer_comments TEXT,

    FOREIGN KEY (match_id)
        REFERENCES matches(match_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (claimant_user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (reviewer_user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    INDEX idx_claim_status (status),
    INDEX idx_claimant (claimant_user_id)
) ENGINE=InnoDB;


-- =========================================================
-- 10. VERIFICATION QUESTIONS
-- =========================================================

CREATE TABLE verification_questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,

    claim_id INT NOT NULL,

    question_text VARCHAR(500) NOT NULL,
    expected_answer VARCHAR(500) NOT NULL,
    user_answer VARCHAR(500),

    is_correct BOOLEAN,

    answered_at TIMESTAMP NULL,

    FOREIGN KEY (claim_id)
        REFERENCES claim_requests(claim_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =========================================================
-- 11. NOTIFICATIONS
-- =========================================================

CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    notification_type ENUM(
        'POTENTIAL_MATCH',
        'CLAIM_SUBMITTED',
        'CLAIM_APPROVED',
        'CLAIM_REJECTED',
        'ITEM_RETURNED',
        'SYSTEM'
    ) NOT NULL,

    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,

    is_read BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_notifications_user (user_id),
    INDEX idx_notifications_read (is_read)
) ENGINE=InnoDB;


-- =========================================================
-- 12. CONTACT REQUESTS
-- =========================================================

CREATE TABLE contact_requests (
    contact_request_id INT AUTO_INCREMENT PRIMARY KEY,

    claim_id INT NOT NULL,

    requester_user_id INT NOT NULL,
    receiver_user_id INT NOT NULL,

    status ENUM(
        'PENDING',
        'ACCEPTED',
        'REJECTED',
        'CLOSED'
    ) NOT NULL DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (claim_id)
        REFERENCES claim_requests(claim_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (requester_user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (receiver_user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_contact_claim (claim_id)
) ENGINE=InnoDB;


-- =========================================================
-- 13. ADMIN
-- =========================================================

CREATE TABLE admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL UNIQUE,

    admin_level ENUM(
        'ADMIN',
        'SUPER_ADMIN'
    ) NOT NULL DEFAULT 'ADMIN',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =========================================================
-- 14. DB USER MANAGEMENT
-- =========================================================

CREATE TABLE db_user_management (
    db_user_id INT AUTO_INCREMENT PRIMARY KEY,

    username VARCHAR(100) NOT NULL UNIQUE,

    privilege_level ENUM(
        'READ_ONLY',
        'READ_WRITE',
        'ADMIN'
    ) NOT NULL DEFAULT 'READ_ONLY',

    created_by INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by)
        REFERENCES users(user_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =========================================================
-- 15. DONATION / MARKETPLACE
-- =========================================================

CREATE TABLE donations (
    donation_id INT AUTO_INCREMENT PRIMARY KEY,

    found_item_id INT NOT NULL UNIQUE,

    status ENUM(
        'AVAILABLE',
        'DONATED',
        'ARCHIVED'
    ) NOT NULL DEFAULT 'AVAILABLE',

    donation_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (found_item_id)
        REFERENCES found_items(found_item_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;