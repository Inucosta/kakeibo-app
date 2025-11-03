import csv
from django.core.management.base import BaseCommand
from kakeibo.models import Account, Category, Transaction
from decimal import Decimal
from datetime import datetime

class Command(BaseCommand):
    help = 'CSVから取引データをインポート'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='CSVファイルのパス')

    def handle(self, *args, **kwargs):
        csv_file = kwargs['csv_file']

        with open(csv_file, encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # 口座
                to_account_name = row['to_account'].strip()
                from_account_name = row['from_account'].strip() or None

                to_account, _ = Account.objects.get_or_create(name=to_account_name)
                from_account_obj = None
                if from_account_name:
                    from_account_obj, _ = Account.objects.get_or_create(name=from_account_name)

                # カテゴリ
                category_name = row['category'].strip()
                category, _ = Category.objects.get_or_create(name=category_name)

                # 金額
                amount_str = row['amount'].replace('¥', '').replace(',', '')
                amount = Decimal(amount_str)

                # 日付
                date = datetime.strptime(row['date'], '%Y/%m/%d').date()

                # 取引タイプ
                type = row['type']

                # メモ
                note = row.get('note', '')

                # Transaction 作成
                Transaction.objects.create(
                    from_account=from_account_obj,
                    to_account=to_account,
                    type=type,
                    category=category,
                    amount=amount,
                    date=date,
                    memo=note
                )

        self.stdout.write(self.style.SUCCESS('CSVのインポートが完了しました'))
