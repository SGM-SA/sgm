from django.db import models
from api.etape.models import Etape
from api.zone.models import Zone


class AffectationAjustage(models.Model):
    semaine_affectation = models.DateField(
        "Semaine d'affectation de l'étape", auto_now_add=False, blank=False, null=False
    )
    # une étape ne peut être affectée qu'à une et une seule zone
    etape = models.OneToOneField(
        Etape, null=False, default=False, on_delete=models.CASCADE
    )
    zone = models.ForeignKey(Zone, null=False, default=False, on_delete=models.CASCADE)

    def __str__(self):
        return f"semaine : {self.semaine_affectation} - Affaire : {self.etape.fiche.affaire.num_affaire} - Fiche : {self.etape.fiche.titre} Etape : {self.etape.num_etape}"
