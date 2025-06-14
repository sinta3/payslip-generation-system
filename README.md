
# Payslip Generation System

A feature based modular backend API system for generating employee payslips. Built with **Node.js**, **Express**, **Sequelize**, and **PostgreSQL**, it handles core HR functions like attendance tracking, overtime, reimbursements, and monthly payroll processing.

This project was developed to fulfill the requirements of a case study for implementing a company-wide payroll system with monthly salary calculations, proration based on attendance, and overtime handling.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Setup & Running](#setup--running)
5. [Environment Variables](#environment-variables)
6. [Seeders](#seeders)
7. [Core Features](#core-features)
8. [API Modules](#api-modules)
9. [Error Handling](#error-handling)
10. [Documentation](#documentation)
---

## Project Overview

This system automates payroll processing with:
- Attendance recording (check-in/out)
- Overtime tracking (with x2 hourly rate)
- Reimbursement submission
- Payroll run locking mechanism
- Payslip breakdown for employees

Payroll is **monthly**, and proration is calculated from actual attendance against total working days (Mon–Fri). Overtime is paid at **2x hourly rate**. Once payroll is run, all data in that period is locked.

---

## Tech Stack

- **Node.js** (v18+)
- **Express.js**
- **Sequelize ORM**
- **PostgreSQL**
- **Modular Architecture**

---

## Project Structure

```
payslip-generation-system
├─ .sequelizerc
├─ package.json
├─ README.md
└─ src
   ├─ app.js
   ├─ config
   │  └─ environment.config.js
   ├─ database
   │  ├─ config
   │  │  └─ sequelize.config.js
   │  ├─ models
   │  │  ├─ attendance.model.js
   │  │  ├─ audit-log.model.js
   │  │  ├─ employee.model.js
   │  │  ├─ employee-payroll.model.js
   │  │  ├─ overtime.model.js
   │  │  ├─ payroll.model.js
   │  │  └─ reimbursement.model.js
   │  └─ seeders
   │     └─ 20250614093318-create-employee-and-admin.js
   ├─ middleware
   │  ├─ audit-log-handler.js
   │  ├─ error-handler.js
   │  └─ token-validation-handler.js
   ├─ modules
   │  ├─ attendance/
   │  ├─ employee/
   │  ├─ overtime/
   │  ├─ reimbursement/
   │  └─ payroll/
   ├─ routes
   │  └─ index.js
   └─ shared
      ├─ logger.js
      └─ util.handler.js
```

---

## Setup & Running

1. **Install dependencies**
```bash
npm install
```

2. **Configure `.env` file** (see [Environment Variables](#environment-variables))

3. **Run the server locally**
```bash
npm start
```

> App will connect to PostgreSQL and automatically generate all necessary tables from Sequelize models.

4. **Run the Seeder** (after DB is connected):
```bash
npx sequelize-cli db:seed:all
```
This seeds a default employee and admin user for testing.

---

## Environment Variables

Create a `.env` file in the project root based on env example

---

## Seeders

Initial seed includes:
- 100 employee
- One admin user

Used for testing login, attendance, and payroll processing.

---

## Core Features

### ✅ Attendance Module
- Check-in and check-out for each employee
- One record per employee per day
- Attendance count used to prorate salary

### ✅ Overtime Module
- Submit overtime hours for past dates
- Maximum 3 hours/day
- Paid at 2x hourly rate

### ✅ Reimbursement Module
- Employees can request reimbursements
- Added directly to monthly payslip

### ✅ Payroll Module
- Admin runs payroll once per month
- Locks attendance/overtime/reimbursement for that period
- Saves total take-home pay per employee
- Summarizes total company-wide salary

### ✅ Payslip
- Employees can request their payslip by month/year
- Includes breakdown: base, overtime, reimbursement, total

---

## API Modules

Organized in `src/modules/<module-name>`:

Each module contains:
```
- controller.js       // Request/response logic
- service.js          // Business logic
- repository.js       // DB access
- routes.js           // Route definitions
```

Example:
- `attendance.routes.js`
- `payroll.service.js`

All routes are auto-loaded through `src/routes/index.js`

---

## Error Handling

Centralized via `middleware/error-handler.js`
- Catches async error

Logging via `shared/logger.js`.

---
## Documentation
import from folder postman
