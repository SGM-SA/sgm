from django.db import models
from api.zone.models import Zone


class Salarie(models.Model):
    user = models.OneToOneField("auth.User", on_delete=models.CASCADE)

    num_secu = models.CharField(max_length=200)
    civilite = models.CharField(max_length=200)
    nom = models.CharField(max_length=200)
    prenom = models.CharField(max_length=200)
    adresse1 = models.CharField(max_length=200)
    adresse2 = models.CharField(max_length=200, null=True, blank=True)
    zip_code = models.CharField(max_length=200)
    ville = models.CharField(max_length=200)
    pays = models.CharField(max_length=200)
    tel = models.CharField(max_length=200)
    email = models.CharField(max_length=200)
    date_embauche = models.DateField()
    date_depart = models.DateField(null=True, blank=True)

    aptitude = models.ForeignKey(
        "Aptitude", on_delete=models.PROTECT, null=True, blank=True
    )

    # Affectation d'une fiche à une zone
    zone = models.ForeignKey(
        Zone, on_delete=models.PROTECT, null=True, blank=True
    )

    def __str__(self):
        return f"{self.num_secu} - {self.nom} - {self.prenom}"
