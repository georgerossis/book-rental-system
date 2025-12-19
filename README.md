Το book-rental-system είναι ένα σύστημα διαχείρισης ενοικίασης βιβλίων. 

Prerequisites
Εγκαταστήστε τα απαραίτητα εργαλεία ανάλογα με την τεχνολογία του project:

Για Java/Spring Boot (Maven):

Java 17+

Maven 3.8+

PostgreSQL ή MySQL (αν χρησιμοποιείται database)

Για Node.js:

Node.js 18+

npm ή yarn

Database (MongoDB/PostgreSQL)

Local Development
1. Clone το Repository
bash
git clone https://github.com/georgerossis/book-rental-system.git
cd book-rental-system
2. Environment Setup
Δημιουργήστε αρχείο .env ή application.properties:

text
# Database ( παράδειγμα PostgreSQL )
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookrental
DB_USER=postgres
DB_PASSWORD=yourpassword

# Server
SERVER_PORT=8080
3. Εγκατάσταση Dependencies
Maven (Java):

bash
mvn clean install
npm (Node.js):

bash
npm install
4. Database Setup
bash
# Δημιουργία database
createdb bookrental

# Εκτέλεση migrations (αν υπάρχουν)
npm run migrate
# ή
mvn flyway:migrate
5. Local Run
bash
# Java/Spring Boot
mvn spring-boot:run

# Node.js
npm start
# ή
npm run dev
Πρόσβαση: http://localhost:8080

API Endpoints
text
GET    /api/books           # Λίστα βιβλίων
POST   /api/books           # Προσθήκη βιβλίου
GET    /api/books/:id       # Βιβλίο με ID
PUT    /api/books/:id       # Ενημέρωση
DELETE /api/books/:id       # Διαγραφή

POST   /api/rentals         # Ενοικίαση
PUT    /api/rentals/:id/return # Επιστροφή
