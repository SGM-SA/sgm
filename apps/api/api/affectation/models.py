from django.db import models

from api.etape.models import Etape
from api.machine.models import Machine
from api.user.models import CustomUser
from api.zone.models import Zone


class Affectation(models.Model):

    """
    Classe abstraite pour les affectations
    """

    semaine_affectation = models.DateField(
        "Semaine d'affectation de l'étape",
        auto_now_add=False,
        blank=False,
        null=False,
    )

    etape = models.OneToOneField(
        Etape, null=False, default=False, on_delete=models.CASCADE
    )

    user = models.ForeignKey(
        CustomUser, null=True, blank=True, on_delete=models.CASCADE
    )

    previous = models.OneToOneField(
        "self",
        null=True,
        blank=True,
        related_name="next",
        on_delete=models.SET_NULL,
    )

    class Meta:
        abstract = True
        verbose_name = "Affectation"
        verbose_name_plural = "Affectations"


class AffectationAjustage(Affectation):
    """
    Classe pour les affectations ajustage
    """

    zone = models.ForeignKey(Zone, null=False, default=False, on_delete=models.CASCADE)

    def __str__(self):
        return f"semaine : {self.semaine_affectation} - Affaire : {self.etape.fiche.affaire.num_affaire} - Fiche : {self.etape.fiche.titre} Etape : {self.etape.num_etape}"

    class Meta:
        verbose_name = "Affectation Ajustage"
        verbose_name_plural = "Affectations Ajustage"


class AffectationMachine(Affectation):
    """
    Classe pour les affectations machine
    """

    machine = models.ForeignKey(
        Machine, null=False, default=False, on_delete=models.CASCADE
    )

    def __str__(self):
        return f"semaine : {self.semaine_affectation} - Etape : {self.etape.num_etape} - Machine : {self.machine.nom_machine}"

    class Meta:
        verbose_name = "Affectation Machine"
        verbose_name_plural = "Affectations Machine"
