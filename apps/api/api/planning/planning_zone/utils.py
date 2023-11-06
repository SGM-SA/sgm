from api.affaire.serializer import AffaireDefaultSerializer
from api.affectation.models import Affectation
from typing import List

from api.etape.serializer import EtapeDetailAjustage
from api.planning.utils import FichePlanningSerializer


def group_sorted_affectations_ajustage(sorted_affectations: List[Affectation]):
    grouped_data = []
    last_affaire_key = None
    last_fiche_key = None

    for affectation in sorted_affectations:
        affaire_key = affectation.etape.fiche.affaire.id
        fiche_key = affectation.etape.fiche.id

        affaire_key = affectation.etape.fiche.affaire.id
        fiche_key = affectation.etape.fiche.id

        etape = EtapeDetailAjustage(affectation.etape).data
        etape["affectation_id"] = affectation.id

        if affectation.user:
            etape["user_id"] = affectation.user.id
        else:
            etape["user_id"] = None

        if affaire_key == last_affaire_key:
            # Check if we can append to the existing fiche group within the affaire
            if fiche_key == last_fiche_key:
                grouped_data[-1]["fiches"][-1]["etapes"].append(etape)
            else:
                # Start a new fiche group within the existing affaire
                new_fiche_group = FichePlanningSerializer(affectation.etape.fiche).data

                new_fiche_group["etapes"] = [etape]
                grouped_data[-1]["fiches"].append(new_fiche_group)
                last_fiche_key = fiche_key
        else:
            # Start a new affaire group
            new_fiche_group = FichePlanningSerializer(affectation.etape.fiche).data

            new_fiche_group["etapes"] = [etape]

            new_affaire_group = AffaireDefaultSerializer(
                affectation.etape.fiche.affaire
            ).data

            new_affaire_group["fiches"] = [new_fiche_group]
            grouped_data.append(new_affaire_group)
            last_affaire_key = affaire_key
            last_fiche_key = fiche_key

    return grouped_data


class TotalFichePlanningAjustageSerializer(FichePlanningSerializer):
    etapes = EtapeDetailAjustage(many=True, read_only=True)

    class Meta:
        model = FichePlanningSerializer.Meta.model
        fields = FichePlanningSerializer.Meta.fields + ["etapes"]


class TotalAffaireAjustageSerializer(AffaireDefaultSerializer):
    fiches = TotalFichePlanningAjustageSerializer(many=True, read_only=True)

    class Meta:
        model = AffaireDefaultSerializer.Meta.model
        fields = AffaireDefaultSerializer.Meta.fields + ["fiches"]
