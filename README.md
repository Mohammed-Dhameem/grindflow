# Grindflow

Grindflow is a full-stack web application designed to streamline task management, productivity tracking, and team collaboration. It integrates a modern Angular frontend with a robust Spring Boot backend and a MySQL database for persistent storage.

## Features

- ✅ User authentication and authorization (JWT-based)
- 📊 Dashboard with analytics
- 🗂️ Task and project management
- 🔐 Secure API communication
- 🌐 Responsive Angular standalone frontend
- ⚙️ Backend developed with Spring Boot and MySQL

## Tech Stack

### Frontend
- Angular (latest with standalone components)
- Angular Material
- TypeScript, HTML, CSS

### Backend
- Java + Spring Boot
- Spring Security + JWT
- MySQL + Spring Data JPA (JDBC Template)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Mohammed-Dhameem/grindflow.git
cd grindflow
```

### 2. Backend Setup (Spring Boot)

```bash
cd grindflow-backend
# Open in IntelliJ and run the application
# or use:
./mvnw spring-boot:run
```

Ensure `application.properties` is configured for your MySQL setup.

### 3. Frontend Setup (Angular)

```bash
cd grindflow-frontend
npm install
ng serve
```

Navigate to `http://localhost:4200` in your browser.

## Folder Structure

```
grindflow/
├── grindflow-backend/     # Spring Boot backend
├── grindflow-frontend/    # Angular frontend
└── README.md              # Project documentation
```

## Security Notes

- ✔️ Passwords are encrypted
- ❗ User credentials are sent securely over HTTPS
- 🔐 Ensure you’re using secure headers and token expiry validation in production

## Screenshots

_(Include screenshots of dashboard, login, etc.)_

## Author

**Mohammed Dhameem**  
🔗 [GitHub Profile](https://github.com/Mohammed-Dhameem)

## License

Licensed under the [MIT License](LICENSE).
