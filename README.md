# PeopleDesk – Employee Management System

A full-stack employee administration dashboard built with Django REST Framework, MySQL, HTML, CSS, Bootstrap 5 and vanilla JavaScript.

## Features
- Create, read, update and delete employee records.
- Search by employee name and filter by department.
- Dashboard totals for all employees and IT, HR and Finance departments.
- Email uniqueness and server-side validation.
- Loading states, success/error alerts and delete confirmation.
- Responsive layout for desktop, tablet and mobile.

## Technology stack
- Frontend: HTML5, CSS3, Bootstrap 5, JavaScript Fetch API
- Backend: Python, Django 5.2, Django REST Framework
- Database: MySQL
- Hosting: Render (backend), Vercel (static frontend)

## Folder structure
```text
employee_management_system/
├── employee_management_backend/
│   ├── employee_management/
│   ├── employees/
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── employee_management_frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── index.html
│   └── .env.example
└── README.md
```

## 1. MySQL database setup
Start MySQL and create a database:
```sql
CREATE DATABASE employee_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Create a MySQL user if needed and grant it privileges on `employee_db`. Keep the username and password private.

## 2. Backend local setup
Open a terminal in `employee_management_backend`:
```bash
python -m venv venv
```
Windows PowerShell:
```powershell
.env\Scripts\Activate.ps1
```
Install dependencies:
```bash
pip install -r requirements.txt
```
Copy `.env.example` to `.env`, then update `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`.

Run migrations:
```bash
python manage.py makemigrations employees
python manage.py migrate
```
Optional Django admin account:
```bash
python manage.py createsuperuser
```
Start backend:
```bash
python manage.py runserver
```
Backend base URL: `http://127.0.0.1:8000`

## 3. Frontend local setup
This is a static vanilla-JavaScript site; Node.js and React are not required. Open `employee_management_frontend/index.html` with VS Code Live Server (recommended) at `http://127.0.0.1:5500`. The default API base URL is `http://127.0.0.1:8000/api`.

To change the API URL, edit `src/config.js` or define `window.EMPLOYEE_API_BASE_URL` before loading `src/App.js`.

## 4. API documentation
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/employees/` | List employees |
| GET | `/api/employees/<id>/` | Retrieve one employee |
| POST | `/api/employees/` | Create employee |
| PUT | `/api/employees/<id>/` | Update employee |
| DELETE | `/api/employees/<id>/` | Delete employee |
| GET | `/api/dashboard/stats/` | Dashboard totals |

List filters:
- `/api/employees/?search=alex`
- `/api/employees/?department=IT`
- `/api/employees/?search=alex&department=IT`

POST/PUT JSON example:
```json
{
  "employee_name": "Alex Kumar",
  "email": "alex@example.com",
  "department": "IT",
  "designation": "Python Developer",
  "salary": "45000.00",
  "joining_date": "2026-01-15"
}
```
A successful create returns HTTP 201. Successful reads/updates return HTTP 200. Invalid input returns HTTP 400. Missing employee returns HTTP 404. Delete returns HTTP 200 with a confirmation message.

## 5. Postman testing
Set base URL to `http://127.0.0.1:8000`.
1. GET `/api/employees/` – initially returns an empty array.
2. POST `/api/employees/` – use the JSON example above; expect 201.
3. GET `/api/employees/1/` – retrieve the created employee; expect 200.
4. PUT `/api/employees/1/` – change designation or salary; expect 200.
5. GET `/api/employees/?search=Alex` – test search.
6. GET `/api/dashboard/stats/` – verify totals.
7. DELETE `/api/employees/1/` – expect 200.
8. GET `/api/employees/1/` – expect 404 after deletion.
9. Try reusing an email address – expect 400 validation error.

## 6. Frontend/backend integration
The frontend service in `src/services/api.js` sends JSON requests using Fetch API. The browser sends requests to Django. `django-cors-headers` permits only origins listed in `CORS_ALLOWED_ORIGINS`. The frontend refreshes the employee list and dashboard statistics after create, update or delete.

## 7. Render deployment (backend)
1. Push the backend and project to a Git repository.
2. Create a Render Web Service connected to the repository.
3. Set the Root Directory to `employee_management_backend`.
4. Build command: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
5. Start command: `gunicorn employee_management.wsgi:application`
6. Add environment variables in Render: `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS=your-service.onrender.com`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app`.
7. Use a managed external MySQL provider and enter its connection values in Render. Do not assume Render provides a built-in MySQL database.
8. Run migrations as part of deployment or a one-off shell command. For production, consider running migrations as a controlled release step.

## 8. Vercel deployment (frontend)
1. Import the repository into Vercel.
2. Set Root Directory to `employee_management_frontend`.
3. Framework Preset: Other.
4. Build command: leave blank; Output Directory: `.`.
5. Deploy the static site.
6. Update `src/config.js` to use `https://your-service.onrender.com/api` (or configure the global `window.EMPLOYEE_API_BASE_URL` before the app module loads), then redeploy.
7. Add the exact Vercel origin to backend `CORS_ALLOWED_ORIGINS`.

## 9. Common errors
- `Access denied for user`: verify MySQL username/password and grants.
- `Unknown database`: create the database and check `DB_NAME`.
- `Can't connect to MySQL server`: ensure MySQL is running and host/port are correct.
- CORS error: add the exact frontend origin (including `https://`) to `CORS_ALLOWED_ORIGINS`, then restart/redeploy backend.
- 404 on API: check URL spelling and trailing slash.
- 400 duplicate email: email must be unique.
- Static page cannot call API: use VS Code Live Server or another local HTTP server instead of opening `file://`.
- `No module named MySQLdb`: confirm PyMySQL is installed and `pymysql.install_as_MySQLdb()` is in `employee_management/__init__.py`.

## Security and production notes
This assessment starter intentionally leaves the API open for easy local testing. Before using real employee data, add authentication (for example, DRF token/JWT authentication), role-based permissions, HTTPS, secure secret management, database backups, audit logging, rate limiting and appropriate salary-data access controls. Never commit `.env` or real credentials.
