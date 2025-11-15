from django.db import models, transaction
from django.core.exceptions import ValidationError
from decimal import Decimal

class Account(models.Model):
    name = models.CharField(max_length=100)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return self.name

class Category(models.Model):
    CATEGORY_TYPE_CHOICES = [
        ('fixed', '固定費'),
        ('variable', '変動費'),
        ('investment', '投資'),  # 追加
    ]

    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=CATEGORY_TYPE_CHOICES, default='variable')

    def __str__(self):
        return self.name
    
class PlannedExpense(models.Model):
    month = models.DateField()  # YYYY-MM-01 を想定
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    amount = models.PositiveIntegerField()

    class Meta:
        unique_together = ('month', 'category')  # 同じ月・カテゴリの重複防止
        ordering = ['-month', 'category']

    def __str__(self):
        return f"{self.month.strftime('%Y-%m')} - {self.category.name}: {self.amount}"

class Transaction(models.Model):
    class TransactionType(models.TextChoices):
        INCOME = 'income', '収入'
        EXPENSE = 'expense', '支出'
        INVESTMENT = 'investment', '投資'
        TRANSFER = 'transfer', '振替'

    from_account = models.ForeignKey(
        Account, related_name='transactions_from', on_delete=models.SET_NULL, null=True, blank=True
    )
    to_account = models.ForeignKey(
        Account, related_name='transactions_to', on_delete=models.SET_NULL, null=True, blank=True
    )
    type = models.CharField(max_length=12, choices=TransactionType.choices)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateTimeField()
    memo = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.date.date()} - {self.get_type_display()} - {self.amount}円"

    # # ---------------------------
    # # バリデーション
    # # ---------------------------
    # def clean(self):
    #     # 金額は正の値
    #     if self.amount <= 0:
    #         raise ValidationError("金額は正の値でなければなりません。")

    #     # 支出・振替・投資の場合、from_account の残高チェック
    #     if self.from_account and self.type in [self.TransactionType.EXPENSE, self.TransactionType.TRANSFER, self.TransactionType.INVESTMENT]:
    #         if self.amount > self.from_account.balance:
    #             raise ValidationError(f"出金元口座の残高({self.from_account.balance})を超える金額は登録できません。")

    # ---------------------------
    # 残高更新処理
    # ---------------------------
    def apply_balance_change(self, sign=1):
        """
        残高を増減させる。
        sign=1 で反映、sign=-1 で取消（削除や更新時の打消し）。
        """
        amount = self.amount * Decimal(sign)

        if self.type == self.TransactionType.INCOME:
            if self.to_account:
                self.to_account.balance += amount
                self.to_account.save(update_fields=['balance'])

        elif self.type == self.TransactionType.EXPENSE:
            if self.from_account:
                self.from_account.balance -= amount
                self.from_account.save(update_fields=['balance'])

        elif self.type in [self.TransactionType.INVESTMENT, self.TransactionType.TRANSFER]:
            if self.from_account:
                self.from_account.balance -= amount
                self.from_account.save(update_fields=['balance'])
            if self.to_account:
                self.to_account.balance += amount
                self.to_account.save(update_fields=['balance'])

    # ---------------------------
    # save / delete のオーバーライド
    # ---------------------------
    def save(self, *args, **kwargs):
        """
        更新時の二重反映を防ぐため、既存データの影響を打ち消してから新規内容を反映。
        トランザクションを張って不整合を防ぐ。
        """
        # 大文字小文字を自動で修正
        if self.type:
            self.type = self.type.lower()

        # バリデーション実行
        self.full_clean()

        with transaction.atomic():
            if self.pk:
                try:
                    old = Transaction.objects.get(pk=self.pk)
                    old.apply_balance_change(sign=-1)
                except Transaction.DoesNotExist:
                    pass

            super().save(*args, **kwargs)
            self.apply_balance_change(sign=1)

    def delete(self, *args, **kwargs):
        """削除時に残高を戻す"""
        with transaction.atomic():
            self.apply_balance_change(sign=-1)
            super().delete(*args, **kwargs)
