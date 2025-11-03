import csv
from decimal import Decimal
from datetime import datetime
from kakeibo.models import Transaction, Account, Category

csv_path = 'data/merged_transaction_history.csv'

with open(csv_path, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        from_acc = Account.objects.filter(name=row['from_account']).first() if row['from_account'] else None
        to_acc = Account.objects.filter(name=row['to_account']).first() if row['to_account'] else None
        category = Category.objects.filter(name=row['category']).first() if row['category'] else None

        Transaction(
            from_account=from_acc,
            to_account=to_acc,
            type=row['type'],
            category=category,
            amount=Decimal(row['amount']),
            date=datetime.strptime(row['date'], "%Y-%m-%d"),
            memo=row['note'] or ''
        )
