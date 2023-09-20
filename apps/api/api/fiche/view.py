from _datetime import datetime
from drf_spectacular.types import OpenApiTypes
from rest_framework.response import Response

from api.commun.views import BulkDeleteView, APIView
from api.fiche.models import Fiche
from api.etape.models import Etape
from api.affaire.models import Affaire
from api.affaire.serializer import AffaireFichesEtapesSerializer
from api.fiche.serializer import FicheEtEtapesAjustageSerializer, FicheCRUDSerializer
from api.fiche.export import export_pdf
from rest_framework import generics, filters, status, serializers, permissions
from drf_spectacular.utils import (
  extend_schema_view,
  extend_schema, OpenApiParameter,
)
from django.db.models import Prefetch, Count, Q
from constance import config


class EtapeAjustagePlanifierFilter(filters.BaseFilterBackend):
    """
    Filtre permettant de ne garder que les fiches ajustage à planifier
    filtres :
        * affaire :
            - affaire validée par ingénieur
            - affaire qui a des fiches ajustage à planifier


        * etape : renvoie uniquement les étapes ajustage à planifier avec ces critères
            - affectation__isnull=True : l'étape n'a pas d'affectation
            - groupe_machine=config.CONSTANTE : l'étape est un ajustage
            - date affectation dépasée
    """

    def filter_queryset(self, request, queryset, view):
        etape_ajustage_filter = (
            Q(terminee=False)
            & Q(groupe_machine=config.GROUPE_MACHINE_AJUSTAGE_ID)
            & (
                Q(affectationajustage__isnull=True)
                | Q(affectationajustage__semaine_affectation__lt=datetime.now())
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
                            queryset=Etape.objects.filter(etape_ajustage_filter),
                        )
                    ),
                )
            )
            .exclude(validation_ingenieur=False)
            .filter(id__in=affaire_avec_fiches_non_vide)
        )

        return queryset


class EtapeMachinePlanifierFilter(filters.BaseFilterBackend):
    """
    Filtre permettant de ne garder que les fiches machine à planifier
    filtres :
        * affaire :
            - affaire validée par ingénieur
            - affaire qui a des fiches machines à planifier

        * fiche : renvoie uniquement les fiches machines à planifier avec ces critères
            - affectation__isnull=True : la fiche n'a pas d'affectation
            - groupe_machine != 2 : la fiche n'est pas un ajustage
            - data_affecation a été dépaséée

    """

    def filter_queryset(self, request, queryset, view):
        etape_machine_filter = (
            Q(terminee=False)
            & ~Q(groupe_machine=config.GROUPE_MACHINE_AJUSTAGE_ID)
            & (
                Q(affectationmachine__isnull=True)
                | Q(affectationmachine__semaine_affectation__lt=datetime.now())
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
                            queryset=Etape.objects.filter(etape_machine_filter),
                        )
                    ),
                )
            )
            .exclude(validation_ingenieur=False)
            .filter(id__in=affaire_avec_fiches_non_vide)
        )

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


@extend_schema(
    tags=["Fiche"], description="Permet de récupérer pour une semaine donnée, "
)
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
    delete=extend_schema(
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



@extend_schema_view(
    get=extend_schema(
        summary="Export fiches",
        tags=["Fiche"],
        parameters=[
            OpenApiParameter(
                name="fiche_id",
                required=True,
                type=OpenApiTypes.INT,
            )
        ],
    )
)
class ExportFicheEtapesView(APIView):
    """
    Endpoint pour exporter les pointages
    """

    #permission_classes = [permissions.IsAdminUser]

    @extend_schema(
        responses={200: None, 400: None},
    )
    def get(self, request, *args, **kwargs):
        """
        Exporte les etapes d'une fiche
        """
        fiche_id = request.query_params.get("fiche_id")

        # check if fiche exists
        try:
            fiche = Fiche.objects.get(id=fiche_id)
        except Fiche.DoesNotExist:
            return Response(
                {"detail": "La fiche n'existe pas"}, status=status.HTTP_400_BAD_REQUEST
            )

        return export_pdf(fiche)
