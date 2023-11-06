from django.db import models
from api.etape.models import Etape
from api.user.models import CustomUser
from django.utils import timezone


class PointageEtape(models.Model):
    etape = models.ForeignKey(Etape, on_delete=models.PROTECT)
    user = models.ForeignKey(
        CustomUser, on_delete=models.PROTECT, related_name="user_pointages"
    )

    date_debut = models.DateTimeField("Date de début", null=False, blank=False)
    date_fin = models.DateTimeField("Date de fin", null=True, blank=True)

    def en_cours(self) -> bool:
        """
        Renvoie True si le pointage est en cours
        """
        return self.date_fin is None

    def duree(self) -> float:
        """
        Renvoie la durée du pointage en secondes
        """
        if self.date_fin is None:
            return (timezone.now() - self.date_debut).total_seconds()
        else:
            return (self.date_fin - self.date_debut).total_seconds()

    def __str__(self):
        return f"{self.user} - {self.date_debut} -> {self.date_fin}"
