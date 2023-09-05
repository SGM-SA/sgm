from django.db import models
from api.fiche_modele.models import FicheModele
from api.groupe_machine.models import GroupeMachine


class EtapeModele(models.Model):
    fiche_modele = models.ForeignKey(
        FicheModele,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        related_name="etapes_modele",
    )
    num_etape = models.IntegerField("N°Étape")
    quantite = models.IntegerField("Quantité", default=0)
    temps = models.IntegerField("Temps nécessaire", default=0)
    plan = models.CharField(max_length=2000, null=True, blank=True)
    rep = models.CharField(max_length=2000, null=True, blank=True)
    groupe_machine = models.ForeignKey(
        GroupeMachine, on_delete=models.PROTECT, null=True, blank=True
    )
    terminee = models.BooleanField("Terminée ?", default=False, null=False, blank=False)
    description = models.TextField(
        "Description", max_length=10000, null=True, blank=True
    )

    date_creation = models.DateField("date de création", auto_now_add=True)
    date_modification = models.DateTimeField("date de modification", auto_now=True)

    def __str__(self):
        return f"Fiche : {self.fiche_modele.id} - etape : {self.num_etape} - terminée : {self.terminee}"
