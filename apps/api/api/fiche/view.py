from datetime import datetime
from typing import List
from api.fiche.models import Fiche
from api.etape.models import Etape
from api.affaire.models import Affaire
from api.affaire.serializer import AffaireFichesEtapesSerializer
from api.fiche.serializer import (
    FicheEtEtapesAjustageSerializer,
    FicheCRUDSerializer,
)
from api.utils.dates import week_to_date_range
from api.commun.views import BulkDeleteView
from rest_framework import generics, filters
from drf_spectacular.utils import extend_schema_view, extend_schema
from django.db.models import Prefetch, Count
from constance import config


class EtapeAjustagePlanifierFilter(filters.BaseFilterBackend):
    """
    Filtre permettant de ne garder que les fiches ajustage à planifier
    filtres :
        * affaire : renvoie uniquement les affaires qui ont des fiches ajustage à planifier

        * etape : renvoie uniquement les étapes ajustage à planifier avec ces critères
            - affectation__isnull=True : l'étape n'a pas d'affectation
            - groupe_machine=config.CONSTANTE : l'étape est un ajustage



    """

    def filter_queryset(self, request, queryset, view):
        fiche_avec_etapes = (
            Etape.objects.all()
            .filter(
                affectationajustage__isnull=True,
                groupe_machine=config.GROUPE_MACHINE_AJUSTAGE_ID,
            )
            .values("fiche")
            .alias(total=Count("id"))
            .filter(total__gt=0)
        )
        affaire_avec_fiches_non_vide = (
            Fiche.objects.all()
            .filter(id__in=fiche_avec_etapes)
            .values("affaire")
            .alias(total=Count("id"))
            .filter(total__gt=0)
        )
        # FILTER THE QUERYSET to only return the affaires that have etape to plan
        queryset = queryset.prefetch_related(
            Prefetch(
                "fiches",
                queryset=Fiche.objects.filter(
                    id__in=fiche_avec_etapes
                ).prefetch_related(
                    Prefetch(
                        "etapes",
                        queryset=Etape.objects.filter(
                            affectationajustage__isnull=True,
                            groupe_machine=config.GROUPE_MACHINE_AJUSTAGE_ID,
                        ),
                    )
                ),
            )
        ).filter(id__in=affaire_avec_fiches_non_vide)
        return queryset


class EtapeMachinePlanifierFilter(filters.BaseFilterBackend):
    """
    Filtre permettant de ne garder que les fiches machine à planifier
    filtres :
        * affaire : renvoie uniquement les affaires qui ont des fiches machines à planifier

        * fiche : renvoie uniquement les fiches machine à planifier avec ces critères
            - affectation__isnull=True : la fiche n'a pas d'affectation
            - groupe_machine=2 : la fiche est un ajustage
            - TODO : groupe machine n'existe plus, remplacer avec filtre etape

    """

    def filter_queryset(self, request, queryset, view):
        fiche_avec_etapes_machine = (
            Etape.objects.all()
            .filter(affectationmachine__isnull=True)
            .exclude(groupe_machine=config.GROUPE_MACHINE_AJUSTAGE_ID)
            .values("fiche")
            .alias(total=Count("id"))
            .filter(total__gt=0)
        )

        # recupere etape dont la date d'affection est dépassée par rapport à la date du jour
        etape_avec_date_affectation_depasse = Etape.objects.all().filter(
            affectationmachine__date_affectation__lt=datetime.date.today()
        )

        affaire_avec_fiches_non_vide = (
            Fiche.objects.all()
            .filter(id__in=fiche_avec_etapes_machine)
            .values("affaire")
            .alias(total=Count("id"))
            .filter(total__gt=0)
        )
        # FILTER THE QUERYSET to only return the affaires that have etape to plan
        queryset = queryset.prefetch_related(
            Prefetch(
                "fiches",
                queryset=Fiche.objects.filter(
                    id__in=fiche_avec_etapes_machine
                ).prefetch_related(
                    Prefetch(
                        "etapes",
                        queryset=Etape.objects.filter(
                            affectationmachine__isnull=True,
                        ).exclude(groupe_machine=config.GROUPE_MACHINE_AJUSTAGE_ID),
                    )
                ),
            )
        ).filter(id__in=affaire_avec_fiches_non_vide)
        return queryset


@extend_schema(
    summary="",
    description="Permet de récupérer pour une semaine donnée, "
    "chaque affaires et leurs fiches / étapes ajustage à traiter dans chaque zone",
    tags=["Planning"],
)
class FichesAjustageAPlanifier(generics.ListAPIView):
    queryset = Affaire.objects.all()
    serializer_class = AffaireFichesEtapesSerializer
    filter_backends = [EtapeAjustagePlanifierFilter]


@extend_schema(
    summary="",
    description="Permet de récupérer pour une semaine donnée, "
    "chaque affaires et leurs fiches / étapes machine à traiter",
    tags=["Planning"],
)
class FichesMachineAPlanifier(generics.ListAPIView):
    queryset = Affaire.objects.all()
    serializer_class = AffaireFichesEtapesSerializer
    filter_backends = [EtapeMachinePlanifierFilter]


class FicheEtEtapes(generics.RetrieveAPIView):
    queryset = Fiche.objects.all()
    serializer_class = FicheEtEtapesAjustageSerializer


@extend_schema(
    summary="Création d'une fiche",
    tags=["Fiche"],
)
class FicheCreateView(generics.CreateAPIView):
    """
    Permet de créer une fiche
    """

    queryset = Fiche.objects.all()
    serializer_class = FicheCRUDSerializer


@extend_schema_view(
    get=extend_schema(
        summary="Récupérer une fiche",
        description="Cette opération permet de récupérer une fiche spécifique en utilisant son ID.",
        tags=["Fiche"],
    ),
    put=extend_schema(
        summary="Mettre à jour une fiche",
        description="Cette opération permet de mettre à jour une fiche spécifique en utilisant son ID.",
        tags=["Fiche"],
    ),
    patch=extend_schema(
        summary="Mise à jour partielle d'une fiche",
        description="Cette opération permet de mettre à jour partiellement une fiche spécifique en utilisant son ID.",
        tags=["Fiche"],
    ),
    destroy=extend_schema(
        summary="Supprimer une fiche",
        description="Cette opération permet de supprimer une fiche spécifique en utilisant son ID.",
        tags=["Fiche"],
    ),
)
class FicheRUDView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Fiche.objects.all()
    serializer_class = FicheCRUDSerializer


@extend_schema(
    summary="Bulk delete de fiches",
    description="Permet de supprimer plusieurs fiches en même temps",
    tags=["Fiche"],
)
class FicheBulkDelete(BulkDeleteView):
    queryset = Fiche.objects.all()
