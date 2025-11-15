from rest_framework import serializers
from .models import Account, Category, Transaction

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    # GET のときだけ文字列表示
    from_account_display = serializers.StringRelatedField(source='from_account', read_only=True)
    to_account_display = serializers.StringRelatedField(source='to_account', read_only=True)
    category_display = serializers.StringRelatedField(source='category', read_only=True)

    # POST 用は PrimaryKey
    from_account = serializers.PrimaryKeyRelatedField(
        queryset=Account.objects.all(),
        required=False,
        allow_null=True
    )
    to_account = serializers.PrimaryKeyRelatedField(
        queryset=Account.objects.all(),
        required=False,
        allow_null=True
    )
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Transaction
        fields = [
            'id', 'type', 'amount', 'date', 'memo',
            'from_account', 'to_account', 'category',
            'from_account_display', 'to_account_display', 'category_display'
        ]

    def validate(self, data):
        from_account = data.get('from_account')
        amount = data.get('amount')
        type = data.get('type')

        if amount is None or amount <= 0:
            raise serializers.ValidationError("金額は正の値でなければなりません。")

        # 残高チェック
        if from_account and type in ['expense', 'transfer', 'investment']:
            if amount > from_account.balance:
                raise serializers.ValidationError("その口座にそんなに入ってません")

        return data