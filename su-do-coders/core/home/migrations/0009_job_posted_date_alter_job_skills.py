# Generated by Django 4.2.7 on 2023-11-17 02:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0008_job_news'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='posted_date',
            field=models.CharField(max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='job',
            name='skills',
            field=models.CharField(max_length=10000),
        ),
    ]
