from api.models import Zone, Fiche
from django.db.models import Prefetch


def run(*args):
    fiches = Zone.objects.prefetch_related(
        Prefetch(
            "fiches",
            queryset=Fiche.objects.filter(
                affectation__semaine_affectation__range=("2023-01-30", "2023-02-06")
            ),
        )
    )

    # filter(semaine_affectation__range=("2023-01-30", "2023-02-06")))
    # print(FicheDetailSerializer(Zone.objects.values_list("affectation__fiche")[0]).data)
    # print(FicheDetailSerializer(Zone.objects.values_list("affectation__fiche")).data)


#  venv/bin/python manage.py runscript test_zone
