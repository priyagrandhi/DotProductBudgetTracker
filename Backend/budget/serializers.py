from rest_framework import serializers
from .models import Category, Transaction, MonthlyBudget
from datetime import date
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    # user is read-only, shows the user ID
    user = serializers.ReadOnlyField(source='user.id')

    class Meta:
        model = Transaction
        fields = ['id', 'user', 'description', 'amount', 'date', 'type']
        read_only_fields = ['user']

    def validate_amount(self, value):
        # Example validation: amount must be positive
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value

    def validate_type(self, value):
        # Example validation: type must be either 'income' or 'expense'
        if value not in ['income', 'expense']:
            raise serializers.ValidationError("Type must be 'income' or 'expense'.")
        return value
    
    def validate_date(self, value):
        if value < date.today():
            raise serializers.ValidationError("past dates are not allowed")
        return value


class MonthlyBudgetSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.id')

    class Meta:
        model = MonthlyBudget
        fields = '__all__'
        read_only_fields = ['user']
