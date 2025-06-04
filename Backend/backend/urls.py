from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from budget.views import CategoryViewSet, TransactionViewSet, MonthlyBudgetViewSet, TransactionDetail ,financial_summary, monthly_budget_vs_expense
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet ,basename='category')
router.register(r'transactions', TransactionViewSet,basename='transaction')
router.register(r'budgets', MonthlyBudgetViewSet,basename='budget')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/summary/', financial_summary, name='financial-summary'),
    path('api/transactions/<int:pk>/', TransactionDetail.as_view(), name='transaction-detail'),
    path('api/monthly-budget-vs-expense/', monthly_budget_vs_expense, name='monthly-budget-vs-expense'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
