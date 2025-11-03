import csv
from decimal import Decimal
from datetime import datetime
from django.utils import timezone
from kakeibo.models import Transaction, Account, Category

csv_path = 'data/merged_transaction_history.csv'

# 1️⃣ 既存の取引をすべて削除
deleted_count, _ = Transaction.objects.all().delete()
print(f"🗑 既存の取引 {deleted_count} 件を削除しました。")

# 2️⃣ CSVから新規作成
with open(csv_path, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    count = 0
    for row in reader:
        from_acc = Account.objects.filter(name=row['from_account']).first() if row['from_account'] else None
        to_acc = Account.objects.filter(name=row['to_account']).first() if row['to_account'] else None

        # カテゴリを自動追加
        category_name = row['category'].strip() if row['category'] else "未設定"
        category, _ = Category.objects.get_or_create(name=category_name)

        # 日付をタイムゾーン付きに変換
        date = timezone.make_aware(datetime.strptime(row['date'], "%Y-%m-%d"))

        Transaction.objects.create(
            from_account=from_acc,
            to_account=to_acc,
            type=row['type'],
            category=category,
            amount=Decimal(row['amount']),
            date=date,
            memo=row['note'] or ''
        )
        count += 1

print(f"✅ CSVから {count} 件の取引を登録しました。")
