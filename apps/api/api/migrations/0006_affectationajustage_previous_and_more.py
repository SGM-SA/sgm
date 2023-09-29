# Generated by Django 4.1.6 on 2023-09-26 07:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0005_alter_affectationajustage_options_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="affectationajustage",
            name="previous",
            field=models.OneToOneField(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="next",
                to="api.affectationajustage",
            ),
        ),
        migrations.AddField(
            model_name="affectationmachine",
            name="previous",
            field=models.OneToOneField(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="next",
                to="api.affectationmachine",
            ),
        ),
    ]