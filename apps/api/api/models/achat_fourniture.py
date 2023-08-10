from django.db import models
from api.affaire.models import Affaire


class AchatFourniture(models.Model):
    # FK
    affaire = models.ForeignKey(Affaire, on_delete=models.CASCADE)
    fourniture = models.ForeignKey("Fourniture", on_delete=models.CASCADE)

    # Fields
    quantite = models.IntegerField("Quantité", default=1)
    date_demande = models.DateField("Date de la demande", auto_now_add=True)
    date_achat = models.DateField("Date d'achat", null=True, blank=True)
    date_reception = models.DateField(
        "Date de réception", null=True, blank=True
    )

    def __str__(self):
        return f"{self.affaire} - {self.fourniture} - {self.quantite}"

    class Meta:
        db_table = "achat_fourniture"
