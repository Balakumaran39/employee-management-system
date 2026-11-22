from django.db import IntegrityError
from django.db.models import Q, Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from .models import Employee
from .serializers import EmployeeSerializer
from django.http import JsonResponse

def home(request):
    return JsonResponse({
        "message": "Welcome to Employee Management System",
        "status": "Success"
    })


class EmployeeListCreateView(APIView):
    def get(self, request):
        queryset = Employee.objects.all()
        search = request.query_params.get("search", "").strip()
        department = request.query_params.get("department", "").strip()
        if search:
            queryset = queryset.filter(employee_name__icontains=search)
        if department:
            queryset = queryset.filter(department__iexact=department)
        return Response(EmployeeSerializer(queryset, many=True).data)

    def post(self, request):
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except IntegrityError:
                return Response({"email": ["An employee with this email already exists."]},
                                status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EmployeeDetailView(APIView):
    def get_object(self, pk):
        try:
            return Employee.objects.get(pk=pk)
        except Employee.DoesNotExist:
            raise NotFound("Employee not found.")

    def get(self, request, pk):
        employee = self.get_object(pk)
        return Response(EmployeeSerializer(employee).data)

    def put(self, request, pk):
        employee = self.get_object(pk)
        serializer = EmployeeSerializer(employee, data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data)
            except IntegrityError:
                return Response({"email": ["An employee with this email already exists."]},
                                status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        employee = self.get_object(pk)
        employee.delete()
        return Response({"message": "Employee deleted successfully."},
                        status=status.HTTP_200_OK)

class DashboardStatsView(APIView):
    def get(self, request):
        counts = Employee.objects.values("department").annotate(total=Count("employee_id"))
        department_counts = {item["department"]: item["total"] for item in counts}
        return Response({
            "total_employees": Employee.objects.count(),
            "department_counts": {
                "IT": department_counts.get("IT", 0),
                "HR": department_counts.get("HR", 0),
                "Finance": department_counts.get("Finance", 0),
            },
        })
