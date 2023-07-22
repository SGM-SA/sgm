from django.db import models


class Aptitude(models.Model):
    designation = models.CharField(max_length=200)
    taux_horaire = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.designation} : {self.taux_horaire} €/h"
