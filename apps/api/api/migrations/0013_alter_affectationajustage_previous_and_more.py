# Generated by Django 4.1.6 on 2023-10-21 10:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0012_alter_affectationajustage_previous_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="affectationajustage",
            name="previous",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="next",
                to="api.affectationajustage",
            ),
        ),
        migrations.AlterField(
            model_name="affectationmachine",
            name="previous",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="next",
                to="api.affectationmachine",
            ),
        ),
    ]
