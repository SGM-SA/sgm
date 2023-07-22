from django.db import models


class Pointage(models.Model):
    salarie = models.ForeignKey("Salarie", on_delete=models.CASCADE)
    affaire = models.ForeignKey("Affaire", on_delete=models.CASCADE)
    date_debut = models.DateTimeField("Pointage debut")
    date_fin = models.DateTimeField("Pointage fin")
