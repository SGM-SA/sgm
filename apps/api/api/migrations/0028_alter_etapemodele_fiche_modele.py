# Generated by Django 4.1.6 on 2023-04-10 18:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0027_rename_date_creation_modele_fichemodele_date_creation_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="etapemodele",
            name="fiche_modele",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="etapes_modele",
                to="api.fichemodele",
            ),
        ),
    ]