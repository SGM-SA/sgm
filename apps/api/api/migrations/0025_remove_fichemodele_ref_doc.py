# Generated by Django 4.1.6 on 2023-04-10 14:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0024_fichemodele"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="fichemodele",
            name="ref_doc",
        ),
    ]