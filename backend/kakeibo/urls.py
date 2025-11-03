from django.urls import path
from . import views

urlpatterns = [
    path('api/accounts/', views.AccountListAPI.as_view()),
    path('api/accounts/create/', views.AccountCreateAPI.as_view()),
    path('api/categories/', views.CategoryListAPI.as_view()),
    path('api/categories/create/', views.CategoryCreateAPI.as_view()),
    path('api/transactions/', views.TransactionListAPI.as_view()),       # GET 一覧
    path('api/transactions/create/', views.TransactionCreateAPI.as_view()),  # POST 作成
]
