# Lost and Found Management System

A full-stack web application designed for college campuses to manage lost and found items digitally. The system allows students to report lost belongings, report items they have found, discover potential matches, submit claims, receive notifications, and complete the recovery process through a centralized platform.

The application replaces informal communication and manual searching with a structured digital workflow connecting lost-item reports with found-item reports.

## Live Application

Frontend:
https://lost-found-frontend-dt8s.onrender.com/

Backend:
https://lost-found-backend-fsql.onrender.com/

## Source Code

GitHub:
https://github.com/Ajitdada2575/LOST-AND-FOUND-Website

---

## Table of Contents

- Overview
- Problem Statement
- Solution
- Key Features
- How the System Works
- Lost Item Workflow
- Found Item Workflow
- Matching Workflow
- Claim Workflow
- Notification Workflow
- Technology Stack
- System Architecture
- Application Modules
- Item Categories
- Location Categories
- Database Design
- Authentication and Security
- API Architecture
- Frontend Architecture
- Backend Architecture
- Project Structure
- Deployment Architecture
- Environment Configuration
- Local Development Setup
- Production Deployment
- Design Decisions
- Challenges and Solutions
- Testing
- Future Enhancements
- Troubleshooting
- FAQ
- Project Learning Guide
- Author

---

# Overview

The Lost and Found Management System is a college-focused web application that provides a centralized platform for managing lost and found belongings.

Students can report an item as lost or found by providing relevant information such as item name, category, location, date, description, and other supported details.

The system then allows users to discover potential relationships between lost and found records and provides a claim workflow for recovering an item.

The application consists of:

- React frontend
- Node.js backend
- Express REST API
- MySQL database
- JWT-based authentication
- Secure database connection using SSL
- Render-based deployment
- Aiven Cloud MySQL database

---

# Problem Statement

Traditional college lost and found processes often depend on:

- WhatsApp groups
- College notice boards
- Informal communication
- Manual searching
- Messages between students
- Unstructured lists of found belongings

These approaches create several problems.

Students may not know where to report a lost item.

Found items may remain with students without reaching their actual owners.

There is no centralized record of lost and found items.

Searching through multiple messages is inefficient.

There is no structured claim process.

It becomes difficult to track the status of an item.

The Lost and Found Management System addresses these problems through a centralized web platform.

---

# Solution

The system provides a structured workflow:

```text
Student loses an item
        |
        v
Reports Lost Item
        |
        v
System stores Lost Item
        |
        v
Another student finds an item
        |
        v
Reports Found Item
        |
        v
System identifies potential matches
        |
        v
User reviews potential match
        |
        v
User submits claim
        |
        v
Claim is processed
        |
        v
Item can be returned
        |
        v
Recovery process completed
