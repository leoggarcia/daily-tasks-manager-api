# Daily Tasks Manager

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%233178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%232496ED.svg?style=for-the-badge&logo=docker&logoColor=white)

This project is a REST API to handle the creation of daily tasks. It includes user management and authentication.

## Features

- **Task Management**: Create, read, update, and delete tasks.
- **User Management**: Basic user creation and management.
- **Authentication**: JWT-based authentication to protect endpoints.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/leoggarcia/daily-tasks-manager-api.git
    cd daily-tasks-manager-api
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application

The application is containerized using Docker.

1.  **Start the service:**
    ```bash
    docker-compose up -d
    ```
    This will start the API on port `3000`.

2.  **Verify the container is running:**
    ```bash
    docker-compose ps
    ```

3.  **Run the NestJS application in development mode (without Docker):**
    ```bash
    npm run start:dev
    ```
    The application will be running on `http://localhost:3000`.

4.  **Stopping services:**
    To stop the Docker container, run:
    ```bash
    docker-compose down
    ```

## Future Improvements

This project has a solid foundation, but there are several ways it could be enhanced:

-   **More Comprehensive Testing**: Expand the test suite to include end-to-end tests and more detailed unit/integration tests for edge cases.
-   **API Documentation**: Enhance API documentation using tools like Swagger for better developer experience.
-   **Migrations**: The ORM is being used with Synchronize insted of migrations.
-   **Configuration Management**: Improve configuration handling to better manage environment variables for different environments (development, staging, production).

## Technologies Used

*   **Backend Framework**: NestJS
*   **Language**: TypeScript
*   **ORM**: TypeORM
*   **Database**: SQLite
*   **Testing**: Jest
*   **Linting**: ESLint
*   **Formatting**: Prettier
*   **Containerization**: Docker