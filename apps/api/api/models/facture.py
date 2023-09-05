from django.db import models
from django.db.models import Sum, FloatField, F, Value


class Facture(models.Model):
    affaire = models.ForeignKey("Affaire", on_delete=models.CASCADE)
    date_creation = models.DateField("date de création", auto_now_add=True)
    date_modification = models.DateTimeField("date de modification", auto_now=True)
    date_envoi = models.DateField("date d'envoi", null=True, blank=True)
    date_echeance = models.DateField("date d'échéance", null=True, blank=True)
    date_paiement = models.DateField("date de paiement", null=True, blank=True)
    date_relance = models.DateField("date de relance", null=True, blank=True)

    def cout_affaire(self):
        """
        Permet de calculer le coût de l'affaire (id) en fonction des pointages
        :return: le coût de l'affaire
        """
        cout = 0
        cout_salarie = self.affaire.pointage_set.aggregate(
            cout_salarie=Sum(
                ((F("date_fin") - F("date_debut")) / (3600 * 1e6))
                * F("salarie__aptitude__taux_horaire"),
                output_field=FloatField(),
            )
        )["cout_salarie"]

        cout_fourniture = self.affaire.achatfourniture_set.aggregate(
            cout_fourniture=Sum(
                F("quantite") * F("fourniture__prix_ht"),
                output_field=FloatField(),
            )
        )["cout_fourniture"]

        if cout_salarie:
            cout += cout_salarie
        if cout_fourniture:
            cout += cout_fourniture

        return cout

    def __str__(self):
        return f"Facture : {self.affaire}"
