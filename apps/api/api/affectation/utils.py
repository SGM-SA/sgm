from api.affectation.models import Affectation


def delete_affectation(affectation: Affectation):
    """
    Permet de supprimer une affectation.
    En supprimant une affectation, on met à jour le previous du .next de cette affectation
    """
    next = affectation.next.first()
    if next is not None:
        next.previous = affectation.previous
        next.save()

    affectation.delete()
