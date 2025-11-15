from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'planned_expenses', views.PlannedExpenseViewSet, basename='planned_expense')

urlpatterns = [
    path('api/accounts/', views.AccountListAPI.as_view()),
    path('api/accounts/create/', views.AccountCreateAPI.as_view()),
    path('api/categories/', views.CategoryListAPI.as_view()),
    path('api/categories/create/', views.CategoryCreateAPI.as_view()),
    path('api/transactions/', views.TransactionListAPI.as_view()),
    path('api/transactions/create/', views.TransactionCreateAPI.as_view()),

    # ここで ViewSet のルーティングを登録
    path('api/', include(router.urls)),
]
