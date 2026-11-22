from rest_framework import serializers
from .models import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = [
            "employee_id", "employee_name", "email", "department",
            "designation", "salary", "joining_date"
        ]
        read_only_fields = ["employee_id"]

    def validate_employee_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Employee name is required.")
        return value

    def validate_email(self, value):
        value = value.strip().lower()
        queryset = Employee.objects.filter(email__iexact=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("An employee with this email already exists.")
        return value

    def validate_salary(self, value):
        if value < 0:
            raise serializers.ValidationError("Salary cannot be negative.")
        return value
