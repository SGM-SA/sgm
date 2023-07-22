from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from typing import List
from api.fiche.models import Fiche
from api.etape.models import Etape
from api.affaire.models import Affaire
from api.affaire.serializer import AffaireFichesEtapesSerializer
from api.fiche.serializer import (
    FicheEtEtapesAjustageSerializer,
    FicheCRUDSerializer,
    FicheBulkDeleteRequestSerializer,
)
from rest_framework import generics, filters, status, serializers
from drf_spectacular.utils import (
    extend_schema_view,
    extend_schema,
    OpenApiParameter,
    OpenApiExample,
    inline_serializer,
)
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
                affectationajustage__isnull=True, machine=config.MACHINE_AJUSTAGE_ID
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
                            machine=config.MACHINE_AJUSTAGE_ID,
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
            .exclude(machine=config.MACHINE_AJUSTAGE_ID)
            .values("fiche")
            .alias(total=Count("id"))
            .filter(total__gt=0)
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
                        ).exclude(
                            machine=config.MACHINE_AJUSTAGE_ID,
                        ),
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
    summary="Suppression bulk de fiches",
    description="Bulk delete des fiches",
    tags=["Fiche"],
    responses={status.HTTP_204_NO_CONTENT: None},
    request=inline_serializer(
        name="FicheBulkDelete",
        fields={
            "ids": serializers.ListField(
                child=serializers.IntegerField(), required=True
            ),
        },
    ),
)  # TODO : fix swagger
class FicheBulkDelete(generics.DestroyAPIView):
    queryset = Fiche.objects.all()
    serializer_class = FicheCRUDSerializer

    def delete(self, request, *args, **kwargs):
        try:
            ids = request.data.get("ids", None)
            if ids is None:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            objs = self.get_queryset().filter(id__in=ids)
            objs.delete()

            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": str(e)})
