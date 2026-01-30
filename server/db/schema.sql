-- VroomValue MySQL Schema

CREATE DATABASE IF NOT EXISTS vroomvalue_db;
USE vroomvalue_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    dob DATE,
    phone VARCHAR(20)
);

-- 2. Cars Table (Main Inventory)
CREATE TABLE IF NOT EXISTS cars (
    id BIGINT PRIMARY KEY,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    variant VARCHAR(100),
    year INT NOT NULL,
    priceINR BIGINT NOT NULL,
    kms INT NOT NULL,
    fuel VARCHAR(50),
    transmission VARCHAR(50),
    bodyType VARCHAR(50),
    city VARCHAR(100),
    sellerType VARCHAR(100),
    owner VARCHAR(50),
    images JSON,
    status VARCHAR(50) DEFAULT 'approved',
    features JSON,
    auction JSON,
    valuation JSON,
    engineCapacity INT,
    mileageKmpl FLOAT,
    seats INT,
    color VARCHAR(50),
    rto VARCHAR(50),
    insuranceValidity VARCHAR(100),
    accidental BOOLEAN DEFAULT FALSE,
    serviceHistory BOOLEAN DEFAULT TRUE,
    description TEXT
);

-- 3. Sell Requests Table
CREATE TABLE IF NOT EXISTS sell_requests (
    id BIGINT PRIMARY KEY,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    fuel VARCHAR(50),
    transmission VARCHAR(50),
    kms INT NOT NULL,
    owner INT,
    city VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    requestDate DATETIME,
    images JSON,
    valuation JSON,
    description TEXT,
    variant VARCHAR(100),
    engineCapacity INT,
    mileageKmpl FLOAT,
    seats INT,
    color VARCHAR(50),
    rto VARCHAR(50),
    insuranceValidity VARCHAR(100),
    accidental BOOLEAN DEFAULT FALSE,
    serviceHistory BOOLEAN DEFAULT TRUE
);

-- 4. Test Drives Table
CREATE TABLE IF NOT EXISTS test_drives (
    id BIGINT PRIMARY KEY,
    carTitle VARCHAR(255),
    date DATETIME,
    time VARCHAR(50),
    phone VARCHAR(20),
    name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending'
);
