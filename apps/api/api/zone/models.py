from django.db import models
from api.etape.models import Etape


class Zone(models.Model):
    nom = models.CharField(max_length=200)
    description = models.TextField(max_length=1000)
    # permet de lier les fiches et les zonnes grace à la table affectation
    etapes = models.ManyToManyField(Etape, through="AffectationAjustage")

    def __str__(self):
        return self.nom
