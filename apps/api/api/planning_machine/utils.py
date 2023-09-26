# Function to sort affectations based on the 'previous' field
from api.affectation.models import Affectation
from typing import List


def sort_affectations_by_previous(affectations: List[Affectation]):
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

    sorted_affectations.reverse()
    return sorted_affectations


def group_sorted_affectations(sorted_affectations: List[Affectation]):
    grouped_data = []
    last_affaire_key = None
    last_fiche_key = None

    for affectation in sorted_affectations:
        affaire_key = affectation.etape.fiche.affaire.id
        fiche_key = affectation.etape.fiche.id
        combined_key = (affaire_key, fiche_key)

        if affaire_key == last_affaire_key:
            # Check if we can append to the existing fiche group within the affaire
            if fiche_key == last_fiche_key:
                grouped_data[-1]["fiches"][-1]["etapes"].append(affectation)
            else:
                # Start a new fiche group within the existing affaire
                new_fiche_group = {
                    "fiche": affectation.etape.fiche.titre,
                    "etapes": [affectation],
                }
                grouped_data[-1]["fiches"].append(new_fiche_group)
                last_fiche_key = fiche_key
        else:
            # Start a new affaire group
            new_fiche_group = {
                "fiche": affectation.etape.fiche.titre,
                "etapes": [affectation],
            }
            new_affaire_group = {
                "affaire": affectation.etape.fiche.affaire.num_affaire,
                "fiches": [new_fiche_group],
            }
            grouped_data.append(new_affaire_group)
            last_affaire_key = affaire_key
            last_fiche_key = fiche_key

    return grouped_data
