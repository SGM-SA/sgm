# Generated by Django 4.1.6 on 2023-05-26 07:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0029_alter_affectationajustage_etape_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="affectationmachine",
            name="salarie",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="api.salarie",
            ),
        ),
    ]