from django.db import models
from api.fiche.models import Fiche
from api.groupe_machine.models import GroupeMachine


class Etape(models.Model):
    fiche = models.ForeignKey(
        Fiche,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        related_name="etapes",
    )
    num_etape = models.IntegerField("N°Étape")
    terminee = models.BooleanField("Terminée ?", default=False, null=False, blank=False)
    description = models.TextField(
        "Description", max_length=10000, default=""
    )
    ref_doc = models.CharField(max_length=2000, null=True, blank=True, default="")
    nom_piece = models.CharField(
        "Nom de la pièce", max_length=2000, null=True, blank=True
    )
    quantite = models.IntegerField("Quantité", default=1)
    groupe_machine = models.ForeignKey(
        GroupeMachine, on_delete=models.PROTECT, null=True, blank=True
    )
    temps = models.IntegerField("Temps nécessaire", default=0)
    plan = models.CharField(max_length=2000, null=True, blank=True, default="")
    rep = models.CharField(max_length=2000, null=True, blank=True, default="")

    date_creation = models.DateField("date de création", auto_now_add=True)
    date_modification = models.DateTimeField("date de modification", auto_now=True)
    date_cloture = models.DateField("date de clôture", null=True, blank=True)

    def __str__(self):
        return f"Fiche : {self.fiche.id} - etape : {self.num_etape} - terminée : {self.terminee}"
