from datetime import datetime

from constance import config
from django.db.models import Q, Count, Prefetch
from rest_framework import filters

from api.etape.models import Etape
from api.fiche.models import Fiche
from api.utils.dates import week_to_date_range


class EtapeMachinePlanifierFilter(filters.BaseFilterBackend):
    """
    Filtre permettant de ne garder que les fiches machine à planifier
    filtres :
        * affaire :
            - affaire validée par ingénieur
            - affaire qui a des fiches machines à planifier

        * etape : renvoie uniquement les étapes machines à planifier avec ces critères
            - affectation__isnull=True : l'étape n'a pas d'affectation ou si la date d'affectation est antérieur au lundi de la semaine en cours
                ou si la date d'affectation est antérieur au lundi de cette la semaine en cours
            - groupe_machine!=config.GROUPE_AJUSTAGE_ID : l'étape n'est pas un ajustage

    """

    def filter_queryset(self, request, queryset, view):
        etape_machine_filter = (
            Q(terminee=False)
            & ~Q(groupe_machine=config.GROUPE_MACHINE_AJUSTAGE_ID)
            & (
                Q(affectationmachine__isnull=True)
                | Q(
                    affectationmachine__semaine_affectation__lt=week_to_date_range(
                        datetime.now().strftime("%Y-%m-%d")
                    )[0]
                )
            )
        )

        # on exclut les étapes affectées à la semaine en cours pour ne pas les afficher dans la liste des étapes à planifier
        filter_affectation_semaine_actuelle = ~Q(
            affectationmachine__semaine_affectation__range=week_to_date_range(
                datetime.now().strftime("%Y-%m-%d")
            )
        )

        # Étapes à planifier et étapes assignées en retard
        etapes_a_planifier = (
            Etape.objects.all()
            .filter(etape_machine_filter)
            .values("fiche")
            .alias(total=Count("id"))
            .filter(total__gt=0)
        )

        # Affaires avec fiches contenant des étapes à planifier ou en retard
        affaire_avec_fiches_non_vide = (
            Fiche.objects.all()
            .filter(id__in=etapes_a_planifier)
            .values("affaire")
            .alias(total=Count("id"))
            .filter(total__gt=0)
        )

        # Filtrer le queryset pour renvoyer uniquement les affaires avec étapes à planifier ou en retard
        queryset = (
            queryset.prefetch_related(
                Prefetch(
                    "fiches",
                    queryset=Fiche.objects.filter(
                        id__in=etapes_a_planifier
                    ).prefetch_related(
                        Prefetch(
                            "etapes",
                            queryset=Etape.objects.filter(etape_machine_filter).filter(
                                filter_affectation_semaine_actuelle
                            ),
                        )
                    ),
                )
            )
            .exclude(validation_ingenieur=False)
            .filter(id__in=affaire_avec_fiches_non_vide)
        )

        return queryset


class EtapeAjustagePlanifierFilter(filters.BaseFilterBackend):
    """
    Filtre permettant de ne garder que les fiches ajustage à planifier
    filtres :
        * affaire :
            - affaire validée par ingénieur
            - affaire qui a des fiches ajustage à planifier


        * etape : renvoie uniquement les étapes ajustage à planifier avec ces critères
            - affectation__isnull=True : l'étape n'a pas d'affectation
                ou si la date d'affectation est antérieur au lundi de cette la semaine en cours
            - groupe_machine=config.CONSTANTE : l'étape est un ajustage

    """

    def filter_queryset(self, request, queryset, view):
        etape_ajustage_filter = (
            Q(terminee=False)
            & Q(groupe_machine=config.GROUPE_MACHINE_AJUSTAGE_ID)
            & (
                Q(affectationajustage__isnull=True)
                | Q(
                    affectationajustage__semaine_affectation__lt=week_to_date_range(
                        datetime.now().strftime("%Y-%m-%d")
                    )[0]
                )
            )
        )

        # on exclut les étapes affectées à la semaine en cours pour ne pas les afficher dans la liste des étapes à planifier
        filter_affectation_semaine_actuelle = ~Q(
            affectationajustage__semaine_affectation__range=week_to_date_range(
                datetime.now().strftime("%Y-%m-%d")
            )
        )

        # Étapes à planifier et étapes assignées en retard
        etapes_a_planifier = (
            Etape.objects.all()
            .filter(etape_ajustage_filter)
            .values("fiche")
            .alias(total=Count("id"))
            .filter(total__gt=0)
        )

        # Affaires avec fiches contenant des étapes à planifier ou en retard
        affaire_avec_fiches_non_vide = (
            Fiche.objects.all()
            .filter(id__in=etapes_a_planifier)
            .values("affaire")
            .alias(total=Count("id"))
            .filter(total__gt=0)
        )

        # Filtrer le queryset pour renvoyer uniquement les affaires avec étapes à planifier ou en retard
        queryset = (
            queryset.prefetch_related(
                Prefetch(
                    "fiches",
                    queryset=Fiche.objects.filter(
                        id__in=etapes_a_planifier
                    ).prefetch_related(
                        Prefetch(
                            "etapes",
                            queryset=Etape.objects.filter(etape_ajustage_filter).filter(
                                filter_affectation_semaine_actuelle
                            ),
                        )
                    ),
                )
            )
            .exclude(validation_ingenieur=False)
            .filter(id__in=affaire_avec_fiches_non_vide)
        )

        return queryset
