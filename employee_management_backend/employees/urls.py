from django.urls import path

from .views import (
    home,
    EmployeeListCreateView,
    EmployeeDetailView,
    DashboardStatsView
)

urlpatterns = [

    path('', home, name='home'),

    path('employees/',
         EmployeeListCreateView.as_view(),
         name='employee-list'),

    path('employees/<int:pk>/',
         EmployeeDetailView.as_view(),
         name='employee-detail'),

    path('dashboard/stats/',
         DashboardStatsView.as_view(),
         name='dashboard-stats'),
]