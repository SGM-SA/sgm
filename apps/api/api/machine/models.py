from django.db import models


# TODO : Add serializers
class Machine(models.Model):
    nom_machine = models.CharField(max_length=100)
    description = models.CharField(max_length=1000, null=True, blank=True)
    fonctionnelle = models.BooleanField(default=True, null=False, blank=False)
    est_active = models.BooleanField(default=True, null=False, blank=False)
    groupe_machine = models.ForeignKey(
        "GroupeMachine", on_delete=models.PROTECT, null=True, blank=True
    )

    def __str__(self):
        etat = self.fonctionnelle
        if etat:
            etat = "fonctionnelle"
        else:
            etat = "non fonctionnelle"
        return f"Machine : {self.nom_machine} - Etat : {etat}"
