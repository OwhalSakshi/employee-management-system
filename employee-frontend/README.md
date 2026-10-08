# Employee Management System

A full-stack web application for managing employee information, built with React, Spring Boot, and MySQL.

## Technologies Used

* React.js
* Vite
* Java
* Spring Boot
* Spring Data JPA
* MySQL
* REST APIs
* CSS

## Features

* View all employees
* Add new employees
* Edit employee details
* Delete employees
* Search employees
* Filter employees by department
* Department analytics
* Form validation and error handling

## Backend API Endpoints

Base URL: `http://localhost:8080/api/employees`

| HTTP Method | Endpoint              | Description                |
| ----------- | --------------------- | -------------------------- |
| GET         | `/api/employees`      | Retrieve all employees     |
| GET         | `/api/employees/{id}` | Retrieve an employee by ID |
| POST        | `/api/employees`      | Create an employee         |
| PUT         | `/api/employees/{id}` | Update an employee         |
| DELETE      | `/api/employees/{id}` | Delete an employee         |

## How to Run the Project

### 1. Start the Backend

* Open the Spring Boot backend project in IntelliJ IDEA.
* Configure your MySQL database connection.
* Run `EmployeeManagementApplication`.

### 2. Start the Frontend

Open a terminal in the `employee-frontend` folder and run:

```bash
npm install
npm run dev
```

Open the local URL displayed in the terminal.

## Production Build

To create the production build, run:

```bash
npm run build
```

The generated production files are saved in the `dist` folder.

## Future Enhancements

* User authentication and authorization
* Pagination
* Automated frontend testing

