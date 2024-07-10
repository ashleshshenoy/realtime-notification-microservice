# Real-Time Notification System

A microservices-based real-time notification system built with Node.js, Express, MongoDB, RabbitMQ, and Socket.IO.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Services](#services)
- [Technical Implementation](#technical-requirements)
- [Setup and Installation](#setup-and-installation)
- [API Documentation](#api-documentation)
- [Working Snapshots](#Snapshots)
- [Contributing](#contributing)
- [License](#license)

## Overview
This project implements a scalable real-time notification system using microservices architecture. It integrates Node.js for backend services, MongoDB for data storage, RabbitMQ for message queuing, and Socket.IO for real-time communication.
![notificationHLD drawio](https://github.com/ashleshshenoy/realtime-notification-microservice/assets/73695378/f0c881f3-089d-43df-8118-d20758188504)
 

## Features
- **User Management**: Register and authenticate users using JWT.
- **Notifications**: Create, retrieve, and mark notifications as read.
- **Real-Time Updates**: Utilize WebSocket to deliver notifications in real-time.
- **API Documentation**: Comprehensive Swagger documentation for APIs.
- **Error Handling**: Graceful error handling and HTTP status code responses.
- **Security**: Implement JWT for authentication and authorization.
- **Scalability**: Message queuing and microservices architecture for handling high-volume processing.
- **Docker Support**: Dockerized services for easy deployment.

## Technologies Used
- Node.js
- Express.js
- MongoDB (with Mongoose)
- RabbitMQ (or Kafka)
- Socket.IO
- JSON Web Tokens (JWT)
- Swagger (OpenAPI)
- Docker


## Services
### Auth Service
- `POST http://localhost:8080/api/register`: Register a new user.
- `POST http://localhost:8080/api/login`: Authenticate and receive a JWT.

### Notification Service
- `POST http://localhost:8080/api/notifications`: Create a new notification.
- `GET http://localhost:8080/api/notifications`: Retrieve all notifications for the authenticated user.
- `GET http://localhost:8080/api/notifications/:id`: Get details of a specific notification.
- `PUT http://localhost:8080/api/notifications/:id`: Mark a notification as read.

### Real-Time Service
- `WS://localhost:8080/`:
- WebSocket connection for real-time notifications.
- Listen for notifications from the queue and broadcast them to connected users.

## Technical implementations
- RESTful principles followed throughout.
- Pagination implemented for GET endpoints.
- Environment variables managed via `.env` file (all .env files are dummy and contains CONFIGURATION consts only).
- Error handling with appropriate HTTP status codes.
- Linting with ESLint for code quality.
- Dockerized setup with `Dockerfile` and `docker-compose.yml`.

### User roles and permissions implementation.
    - The roles are "user" and "admin".
    - Implemented middle to allow authorised access for admin specific resources.
    - NOTE : You can upgrade user to admin role only via direct Database manipulation (& login again) or JWT token manipulation ( NOT secret base64 encoded )
    
### Retry mechanism for failed message processing.
    - The retry mechanism offers to reprocess the message in-case of failure.
    - The retry mechanism has 2 Parameter. RETRY_MAX_ATTEMP (default to 3) and RETRY_DELAY ( exponentially increasing)
    - The failed message is pushed back to the Queue with header(x-retry-attempts), upon hitting max attemps the message is discarded. Ideally we could have added it to DLQ.
    
### Nginx as API Gateway.
    - Nginx is used as a single point of entry point to make all the API calls.
    
## Setup and Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/real-time-notification-system.git
   cd real-time-notification-system
   docker compose up --build 
