from django.db import models
from api.etape.models import Etape
from api.machine.models import Machine
from api.salarie.models import Salarie


class AffectationMachine(models.Model):
    semaine_affectation = models.DateField(
        "Semaine d'affectation de l'étape",
        auto_now_add=False,
        blank=False,
        null=False,
    )
    # une étape ne peut être affectée qu'à une et une seule machine
    etape = models.OneToOneField(
        Etape, null=False, default=False, on_delete=models.CASCADE
    )
    machine = models.ForeignKey(
        Machine, null=False, default=False, on_delete=models.CASCADE
    )

    salarie = models.ForeignKey(
        Salarie, null=True, blank=True, on_delete=models.CASCADE
    )

    def __str__(self):
        return f"semaine : {self.semaine_affectation} - Etape : {self.etape.num_etape} - Machine : {self.machine.nom_machine}"
