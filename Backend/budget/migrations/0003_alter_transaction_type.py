# Generated by Django 4.2.21 on 2025-06-03 13:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('budget', '0002_remove_transaction_category_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='type',
            field=models.CharField(choices=[('income', 'Income'), ('expense', 'Expense')], max_length=20),
        ),
    ]
