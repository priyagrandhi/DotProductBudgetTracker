from rest_framework import viewsets, permissions, generics, filters
from .models import Category, Transaction, MonthlyBudget
from .serializers import CategorySerializer, TransactionSerializer, MonthlyBudgetSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Sum
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from datetime import datetime
from django.utils.timezone import now
from django.db import models
from django.utils.dateparse import parse_date
from collections import defaultdict

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['date', 'type', 'amount', 'description']
    search_fields = ['description', 'amount', 'type']
    ordering_fields = ['date', 'amount', 'id']
    ordering = ['-date', '-id']

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MonthlyBudgetViewSet(viewsets.ModelViewSet):
    serializer_class = MonthlyBudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MonthlyBudget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TransactionDetail(generics.RetrieveUpdateDestroyAPIView):
    
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def summary_view(request):
    user = request.user
    income = Transaction.objects.filter(user=user, type='income').aggregate(total=Sum('amount'))['total'] or 0
    expense = Transaction.objects.filter(user=user, type='expense').aggregate(total=Sum('amount'))['total'] or 0

    current_month = datetime.now().strftime('%Y-%m')
    monthly_expense = Transaction.objects.filter(user=user, type='expense', date__startswith=current_month).aggregate(total=Sum('amount'))['total'] or 0

    return Response({
        'income': income,
        'expense': expense,
        'balance': income - expense,
        'monthly_expense': monthly_expense
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def financial_summary(request):
    user = request.user

    income = Transaction.objects.filter(user=user, type='income').aggregate(total=Sum('amount'))['total'] or 0
    expense = Transaction.objects.filter(user=user, type='expense').aggregate(total=Sum('amount'))['total'] or 0

    current_month = datetime.now().strftime('%Y-%m')
    monthly_expense = Transaction.objects.filter(user=user, type='expense', date__startswith=current_month).aggregate(total=Sum('amount'))['total'] or 0

    return Response({
        'income': income,
        'expense': expense,
        'monthly_expense': monthly_expense,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def monthly_budget_vs_expense(request):
    user = request.user
    current_month = datetime.now().strftime("%Y-%m")

    try:
     budget = MonthlyBudget.objects.get(user=user, month=current_month).amount
    except MonthlyBudget.DoesNotExist:
     budget = 0
    try:
     actual_expense = Transaction.objects.filter(
         user=user,
        date__startswith=current_month,
        type='expense' 
    ).aggregate(total= models.Sum('amount'))['total'] or 0
    except Exception as e:
        actual_expense = 0

    return Response({
        "month": current_month,
        "budget": float(budget),
        "actual_expense": float(actual_expense),
    })