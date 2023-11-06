from django.db import models


class GroupeMachine(models.Model):

    """
    Model représentant un groupe de machine.
    On y retrouve le:
    - nom du groupe
    - prix horaire théorique

    """

    nom_groupe = models.CharField(
        "Nom du groupe machine", max_length=300, null=False, blank=False
    )

    prix_theorique = models.IntegerField(
        "Prix théorique / heure", blank=False, null=False, default=0
    )
