from django.db.models import Case, When, Value, BooleanField
from django.http import Http404

from api.affaire.models import Affaire, en_retard_filter
from api.affaire.serializer import (
    AffaireDetailsSerializer,
    AffaireFichesSerializer,
    AffaireNumAffaireSerializer,
    AffaireStatsGlobalSerializer,
    AffaireStatsSerializer,
)
from rest_framework import generics, pagination, filters, views, status, permissions
from rest_framework.response import Response

from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiParameter,
)
from django_filters.rest_framework import DjangoFilterBackend

from api.utils.view import LargeResultsSetPagination


@extend_schema_view(
    get=extend_schema(
        summary="Affaire",
        description="Liste des affaires",
        tags=["Affaire"],
        parameters=[
            OpenApiParameter(
                name="num_affaire",
                description="Numéro de l'affaire",
                required=False,
            ),
            OpenApiParameter(
                name="statut",
                description="Statut de l'affaire",
                required=False,
                many=True,
                enum=[i[0] for i in Affaire.STATUTS_AFFAIRE],
            ),
            OpenApiParameter(
                name="ordering",
                description="Champ de tri",
                required=False,
            ),
            OpenApiParameter(
                name="search",
                description="Recherche dans les champs num_affaire, client, description, chargé d'affaire",
            ),
            OpenApiParameter(
                name="page",
                description="Numéro de la page",
            ),
            OpenApiParameter(
                name="per_page",
                description="Nombre d'affaires par page",
            ),
        ],
    )
)
class AffaireList(generics.ListAPIView):
    serializer_class = AffaireDetailsSerializer
    pagination_class = LargeResultsSetPagination
    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
    ]

    filterset_fields = ["num_affaire"]

    ordering_fields = [
        "date_rendu",
        "num_affaire",
    ]
    search_fields = ["num_affaire", "client", "description", "charge_affaire"]

    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        is_en_retard = Case(
            When(en_retard_filter, then=Value(True)),
            default=Value(False),
            output_field=BooleanField(),
        )

        queryset = Affaire.objects.annotate(is_en_retard=is_en_retard).order_by(
            "-is_en_retard", "date_rendu", "num_affaire"
        )

        # S'il n'y a pas de filtre sur le statut ou s'il est à null, on applique un filtre par défaut
        status_filter = self.request.query_params.getlist("statut", None)
        if not status_filter:
            # Applique un filtre par défaut sur les affaires en cours
            queryset = queryset.filter(statut__in=Affaire.STATUS_EN_COURS)
        else:
            queryset = queryset.filter(statut__in=status_filter)
        return queryset


@extend_schema(
    summary="Affaire",
    description="Permet de récupérer / update une affaire",
    tags=["Affaire"],
)
class AffaireDetail(generics.RetrieveUpdateAPIView):
    queryset = Affaire.objects.all()
    serializer_class = AffaireDetailsSerializer
    permission_classes = [permissions.IsAuthenticated]


@extend_schema(
    summary="Liste Affaire et Fiches",
    description="Permet de récupérer une affaire avec ses fiches",
    tags=["Affaire"],
)
class AffaireEtFichesList(generics.ListAPIView):
    queryset = Affaire.objects.all()
    serializer_class = AffaireFichesSerializer
    pagination_class = LargeResultsSetPagination
    permission_classes = [permissions.IsAuthenticated]


@extend_schema(
    summary="Affaire et Fiches",
    description="Permet de récupérer une affaire avec ses fiches",
    tags=["Affaire"],
)
class AffaireDetailFiches(generics.RetrieveAPIView):
    queryset = Affaire.objects.all()
    serializer_class = AffaireFichesSerializer
    permission_classes = [permissions.IsAuthenticated]


class SmallPagination(pagination.PageNumberPagination):
    page_size = 5
    max_page_size = 5
    page_size_query_param = "per_page"


@extend_schema(
    summary="Affaire",
    description="Permet de récupérer une affaire à partir de son numéro d'affaire",
    tags=["Affaire"],
)
class AffaireNumAffaire(generics.RetrieveAPIView):
    """
    Permet de récupérer une affaire à partir de son numéro d'affaire
    """

    queryset = Affaire.objects.all()
    serializer_class = AffaireDetailsSerializer
    lookup_field = "num_affaire"
    permission_classes = [permissions.IsAuthenticated]


@extend_schema(
    summary="Affaire",
    description="Permet de récupérer une liste de numéro d'affaire avec un numéro d'affaire",
    tags=["Affaire"],
    parameters=[
        OpenApiParameter(
            name="search",
            description="Recherche dans les champs num_affaire",
        )
    ],
)
class AffaireNumAffaires(generics.ListAPIView):
    """
    Permet de récupérer une liste de numéro d'affaire avec un numéro d'affaire
    5 resultats max
    """

    queryset = Affaire.objects.all()
    serializer_class = AffaireNumAffaireSerializer
    pagination_class = SmallPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ["^num_affaire"]
    ordering_fields = ["num_affaire"]
    permission_classes = [permissions.IsAuthenticated]


@extend_schema(
    summary="Stats Affaire",
    description="Permet de récupérer les statistiques globales des affaires",
    tags=["Affaire"],
    responses={200: AffaireStatsGlobalSerializer},
)
class AffaireStatsGlobalView(views.APIView):
    """
    Permet de récupérer les stats globals des affaires
    """

    def get(self, request, *args, **kwargs):
        serializer = AffaireStatsGlobalSerializer({})

        return Response(serializer.data, status=status.HTTP_200_OK)


@extend_schema(
    summary="Stats Affaire",
    description="Permet de récupérer les statistiques d'une affaire spécifique",
    tags=["Affaire"],
    responses={200: AffaireStatsSerializer},
)
class AffaireStatsView(views.APIView):
    """
    Vue pour obtenir les statistiques d'une affaire spécifique.
    """

    def get_object(self, pk):
        try:
            return Affaire.objects.get(pk=pk)
        except Affaire.DoesNotExist:
            raise Http404

    def get(self, request, pk, *args, **kwargs):
        affaire = self.get_object(pk)
        serializer = AffaireStatsSerializer(affaire)
        return Response(serializer.data, status=status.HTTP_200_OK)
