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
    # ID ではなく文字列で返す
    from_account = serializers.StringRelatedField()
    to_account = serializers.StringRelatedField()
    category = serializers.StringRelatedField()

    class Meta:
        model = Transaction
        fields = '__all__'

    def validate(self, data):
        from_account = data.get('from_account')
        amount = data.get('amount')
        type = data.get('type')

        if amount <= 0:
            raise serializers.ValidationError("金額は正の値でなければなりません。")

        # バリデーションはそのまま残す
        if from_account and type in ['expense', 'transfer', 'investment']:
            if amount > from_account.balance:
                raise serializers.ValidationError(f"その口座にそんなに入ってません")

        return data