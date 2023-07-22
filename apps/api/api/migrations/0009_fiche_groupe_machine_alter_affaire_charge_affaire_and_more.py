# Generated by Django 4.1.6 on 2023-02-10 11:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0008_zone_fiches"),
    ]

    operations = [
        migrations.AddField(
            model_name="fiche",
            name="groupe_machine",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                to="api.groupemachine",
            ),
        ),
        migrations.AlterField(
            model_name="affaire",
            name="charge_affaire",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                to="api.salarie",
            ),
        ),
        migrations.AlterField(
            model_name="affaire",
            name="client",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                to="api.client",
            ),
        ),
        migrations.AlterField(
            model_name="affaire",
            name="etat",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                to="api.etat",
            ),
        ),
        migrations.AlterField(
            model_name="affaire",
            name="statut",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                to="api.statut",
            ),
        ),
        migrations.AlterField(
            model_name="fiche",
            name="affaire",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="fiches",
                to="api.affaire",
            ),
        ),
    ]