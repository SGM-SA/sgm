from typing import List

from rest_framework import serializers

from api.affectation.models import Affectation
from api.fiche.models import Fiche


def sort_affectations_by_previous(affectations: List[Affectation]):
    """
    Groupe les affectations par affaire et par fiche suivant l'ordre de la planification
    """
    sorted_affectations = []
    lookup = {affectation.id: affectation for affectation in affectations}
    while lookup:
        for id, affectation in list(lookup.items()):
            if (
                affectation.previous is None
                or affectation.previous in sorted_affectations
            ):
                sorted_affectations.append(affectation)
                del lookup[id]

    return sorted_affectations


class FichePlanningSerializer(serializers.ModelSerializer):
    avancement_fiche = serializers.FloatField(
        read_only=True, default=0, max_value=1, min_value=0
    )

    class Meta:
        model = Fiche
        fields = ["id", "titre", "avancement_fiche"]
