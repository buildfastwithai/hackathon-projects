# Generated by Django 4.2.7 on 2023-11-17 01:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0007_alter_contest_title'),
    ]

    operations = [
        migrations.CreateModel(
            name='Job',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_name', models.CharField(max_length=1000)),
                ('skills', models.CharField(max_length=1000)),
                ('apply_link', models.URLField()),
            ],
        ),
        migrations.CreateModel(
            name='News',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('headline', models.CharField(max_length=1000)),
                ('summary', models.CharField(max_length=100000)),
                ('link', models.URLField()),
            ],
        ),
    ]