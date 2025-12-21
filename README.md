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
- Express.js (JavaScript / TypeScript)

### Frontend
- React (JavaScript / TypeScript)
- HTML / CSS

### Database
- MongoDB

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or a cloud URI)

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

Install the driver:
```bash
pip install pymongo
```
Then create all needed collections using the below python script:

```python
from pymongo import MongoClient, ASCENDING

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["library_db"]  # You can name the DB whatever you want

print("Creating collections and indexes based on metadata...")

# --- 1. Users Collection ---
# Metadata: Index on 'email' (Unique)
users = db["users"]
users.create_index([("email", ASCENDING)], unique=True, name="email_1")
print("✓ Created 'users' with unique index on 'email'")

# --- 2. Books Collection ---
# Metadata: Index on 'isbn' (Unique)
books = db["books"]
books.create_index([("isbn", ASCENDING)], unique=True, name="isbn_1")
print("✓ Created 'books' with unique index on 'isbn'")

# --- 3. Rentals Collection ---
# Metadata: Indexes on 'userId', 'bookId', 'status'
rentals = db["rentals"]
rentals.create_index([("userId", ASCENDING)], name="userId_1")
rentals.create_index([("bookId", ASCENDING)], name="bookId_1")
rentals.create_index([("status", ASCENDING)], name="status_1")
print("✓ Created 'rentals' with indexes on 'userId', 'bookId', and 'status'")

print("\nDatabase structure ready!")
createdb bookrental
```

Configure your database connection in:

* backend/`.env` 


Example:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/book-rental
JWT_SECRET=supersecretkey123changeinproduction
```

---

## Backend Setup

### Install Dependencies


#### Node modules

```bash
cd backend
npm install
```

---
### Build Backend
```bash
npm build
```

### Run Backend

#### Development Mode:

```bash
npm dev
```

#### Production Mode:

```bash
npm start
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

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
