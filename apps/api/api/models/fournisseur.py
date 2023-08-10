from django.db import models


class Fournisseur(models.Model):
    raison = models.CharField(max_length=200)
    adresse1 = models.CharField(max_length=200)
    adresse2 = models.CharField(max_length=200, null=True, blank=True)
    code_postal = models.CharField(max_length=200)
    ville = models.CharField(max_length=200)
    pays = models.CharField(max_length=200)
    telephone = models.CharField(max_length=200)
    email = models.CharField(max_length=200)
    correspondant = models.CharField(
        "Correspondant de l'entreprise", max_length=200
    )
    siret = models.CharField(max_length=200, null=True, blank=True)
    tva = models.CharField(max_length=200, null=True, blank=True)
    iban = models.CharField("iban", max_length=200, null=True, blank=True)
    bic = models.CharField("bic", max_length=200, null=True, blank=True)

    delais_livraison = models.IntegerField(
        "délais de livraison (jours)", null=True, blank=True
    )
    memo = models.TextField("mémo", null=True, blank=True)

    def __str__(self):
        return f"Fournisseur : {self.raison}"
