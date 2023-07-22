from django.db import models


class Fourniture(models.Model):
    # FK
    fournisseur = models.ForeignKey("Fournisseur", on_delete=models.CASCADE)
    type_fourniture = models.ForeignKey(
        "TypeFourniture", on_delete=models.CASCADE, null=True, blank=True
    )

    # Fields
    code_fourniture = models.CharField(max_length=200)
    description = models.TextField("Description de la fourniture")
    prix_ht = models.DecimalField("Prix HT", max_digits=100, decimal_places=2)

    def __str__(self):
        return f"{self.code_fourniture} - {self.fournisseur.raison} - {self.prix_ht}€"
