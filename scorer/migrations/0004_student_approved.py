# Generated by Django 3.0.1 on 2020-04-02 04:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scorer', '0003_metrics'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='approved',
            field=models.BooleanField(default=False),
        ),
    ]
