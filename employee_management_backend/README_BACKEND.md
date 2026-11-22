# Backend setup

1. Create and activate a virtual environment.
2. Install packages: `pip install -r requirements.txt`
3. Copy `.env.example` to `.env` and enter your MySQL credentials.
4. Create the database in MySQL: `CREATE DATABASE employee_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
5. Run `python manage.py makemigrations employees`
6. Run `python manage.py migrate`
7. Run `python manage.py createsuperuser` (optional)
8. Run `python manage.py runserver`

API routes:
- GET/POST `/api/employees/`
- GET/PUT/DELETE `/api/employees/<id>/`
- GET `/api/dashboard/stats/`
- Optional filters: `/api/employees/?search=balakumaran&department=IT`

The model uses lowercase Python field names with explicit database column names for EmployeeID and EmployeeName.
