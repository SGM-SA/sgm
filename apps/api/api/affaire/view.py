from api.affaire.models import Affaire
from api.affaire.serializer import (
    AffaireDetailsSerializer,
    AffaireFichesSerializer,
    AffaireNumAffaireSerializer,
    AffaireStatsGlobalSerializer,
)
from rest_framework import generics, pagination, filters, views, status
from rest_framework.response import Response

from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiParameter,
)
from django_filters.rest_framework import DjangoFilterBackend


class LargeResultsSetPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = "per_page"
    max_page_size = 100


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
                enum=[i[0] for i in Affaire.STATUTS_AFFAIRE],
            ),
            OpenApiParameter(
                name="ordering",
                description="Champ de tri",
                required=False,
            ),
            OpenApiParameter(
                name="search",
                description="Recherche dans les champs num_affaire, client, description",
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
    queryset = Affaire.objects.all()
    serializer_class = AffaireDetailsSerializer
    pagination_class = LargeResultsSetPagination
    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
    ]

    filterset_fields = ["num_affaire", "statut"]
    ordering_fields = ["num_affaire", "date_rendu"]
    search_fields = ["num_affaire", "client", "description"]


@extend_schema(
    summary="Affaire",
    description="Permet de récupérer une affaire",
    tags=["Affaire"],
)
class AffaireDetail(generics.RetrieveAPIView):
    queryset = Affaire.objects.all()
    serializer_class = AffaireDetailsSerializer


@extend_schema(
    summary="Liste Affaire et Fiches",
    description="Permet de récupérer une affaire avec ses fiches",
    tags=["Affaire"],
)
class AffaireEtFichesList(generics.ListAPIView):
    queryset = Affaire.objects.all()
    serializer_class = AffaireFichesSerializer


@extend_schema(
    summary="Affaire et Fiches",
    description="Permet de récupérer une affaire avec ses fiches",
    tags=["Affaire"],
)
class AffaireDetailFiches(generics.RetrieveAPIView):
    queryset = Affaire.objects.all()
    serializer_class = AffaireFichesSerializer


class SmallPagination(pagination.PageNumberPagination):
    page_size = 5
    max_page_size = 5


@extend_schema(
    summary="Affaire",
    description="Permet de une liste de numéro d'affaire avec un numéro d'affaire",
    tags=["Affaire"],
    parameters=[
        OpenApiParameter(
            name="search",
            description="Recherche dans les champs num_affaire",
        )
    ],
)
class AffaireNumAffaire(generics.ListAPIView):
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

@extend_schema(
    summary="Stats Affaire",
    description="Permet de récupérer les stats globals des affaires",
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


