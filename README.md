#  Book Rental System

The **Book Rental System** is a web application that allows users to browse, rent, and return books.  
It consists of a backend API and a frontend interface for managing book rentals efficiently.

---

## Features

- 📖 View all available books
- ➕ Add new books
- ✏️ Update book details
- 🗑️ Delete books
- 📌 Rent a book
- 🔄 Return a rented book

---

## Tech Stack

### Backend
- Java (Spring Boot, Maven)
- OR Node.js (JavaScript / TypeScript)

### Frontend
- JavaScript / TypeScript
- HTML / CSS

### Database
- PostgreSQL or MySQL

---

## Prerequisites

Make sure you have the following installed:

- Java 17+ (if using Spring Boot)
- Maven 3.8+
- Node.js 18+
- npm
- PostgreSQL or MySQL

---

## Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/georgerossis/book-rental-system.git
cd book-rental-system
````

---

## Database Setup

Create the database:

```bash
# PostgreSQL example
createdb bookrental
```

Configure your database connection in:

* `.env` (Node.js)
* `application.properties` or `application.yml` (Spring Boot)

Example:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookrental
DB_USER=postgres
DB_PASSWORD=your_password
```

---

## Backend Setup

### Install Dependencies

#### Spring Boot

```bash
cd backend
mvn clean install
```

#### Node.js

```bash
cd backend
npm install
```

---

### Run Backend

#### Spring Boot

```bash
mvn spring-boot:run
```

#### Node.js

```bash
npm start
```

Backend runs at:

```
http://localhost:8080
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint                   | Description          |
| ------ | -------------------------- | -------------------- |
| GET    | `/api/books`               | Get all books        |
| POST   | `/api/books`               | Add a new book       |
| GET    | `/api/books/{id}`          | Get book by ID       |
| PUT    | `/api/books/{id}`          | Update book          |
| DELETE | `/api/books/{id}`          | Delete book          |
| POST   | `/api/rentals`             | Rent a book          |
| PUT    | `/api/rentals/{id}/return` | Return a rented book |

---

## Build for Production

```bash
# Backend
mvn package

# Frontend
npm run build
```

---
