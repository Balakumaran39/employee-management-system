from django.db import models

class Employee(models.Model):
    employee_id = models.AutoField(primary_key=True, db_column="EmployeeID")
    employee_name = models.CharField(max_length=100, db_column="EmployeeName")
    email = models.EmailField(max_length=150, unique=True)
    department = models.CharField(max_length=80)
    designation = models.CharField(max_length=100)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    joining_date = models.DateField()

    class Meta:
        db_table = "employees"
        ordering = ["employee_id"]

    def __str__(self):
        return f"{self.employee_name} ({self.email})"
