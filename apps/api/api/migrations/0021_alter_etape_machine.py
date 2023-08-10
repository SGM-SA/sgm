# Generated by Django 4.1.6 on 2023-03-23 15:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0020_alter_affaire_montant"),
    ]

    operations = [
        migrations.AlterField(
            model_name="etape",
            name="machine",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.PROTECT,
                to="api.machine",
            ),
            preserve_default=False,
        ),
    ]
