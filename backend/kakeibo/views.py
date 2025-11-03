from rest_framework import generics, viewsets
from .models import Account, Category, Transaction
from .serializers import AccountSerializer, CategorySerializer, TransactionSerializer

class AccountListAPI(generics.ListAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

class CategoryListAPI(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

# 取引履歴一覧
class TransactionListAPI(generics.ListAPIView):
    queryset = Transaction.objects.all().order_by('-date')  # 日付降順
    serializer_class = TransactionSerializer

class TransactionCreateAPI(generics.CreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

# 口座追加
class AccountCreateAPI(generics.CreateAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

# カテゴリ追加
class CategoryCreateAPI(generics.CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer