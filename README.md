# CampusData-Portal (Student Management System)

## Description
The CampusData-Portal is a web-based student management application designed to securely handle student profiles, user authentication, and academic records. It features a lightweight local database paired with a Node.js backend server.

## Features
*   **User Authentication**: Includes a dedicated login page (`login.html`) to control user access.
*   **Data Management**: Interfaces directly with an SQLite database (`students.db`) for lightweight data persistence.
*   **Responsive UI**: Built with HTML5 and CSS3 to provide an intuitive dashboard interface.

## Project Structure
```text
dbms_project/
│
├── index.html       # Main application dashboard
├── login.html       # User authentication interface
├── server.js        # Node.js backend logic and routing
└── students.db      # SQLite database for storing records

