from django.db import models


class Etat(models.Model):
    designation = models.CharField(max_length=200)

    def __str__(self):
        return f"Etat : {self.designation}"
