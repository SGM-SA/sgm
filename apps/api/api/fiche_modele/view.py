from rest_framework.response import Response

from api.fiche_modele.models import FicheModele
from api.fiche.models import Fiche
from api.etape.models import Etape
from api.affaire.models import Affaire
from api.fiche_modele.serializer import (
    FicheModeleDetail,
    FicheModeleEtEtapes,
    FicheModeleOptionsSerializer,
)
from rest_framework import generics, status, pagination
from drf_spectacular.utils import (
    extend_schema_view,
    extend_schema,
    OpenApiParameter,
)


@extend_schema_view(
    get=extend_schema(
        summary="Fiche Modele",
        description="Permet de récupérer une liste de fiches modèle",
        tags=["Fiche Modele", "Modele"],
    ),
    post=extend_schema(
        summary="Fiche Modele",
        description="Permet de créer une fiche modèle",
        tags=["Fiche Modele", "Modele"],
    ),
)
class FicheModeleListCreateView(generics.ListCreateAPIView):
    queryset = FicheModele.objects.all()
    serializer_class = FicheModeleDetail


@extend_schema(
    summary="Fiche Modele",
    description="Permet de gérer une fiche modèle",
    tags=["Fiche Modele", "Modele"],
)
class FicheModeleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FicheModele.objects.all()
    serializer_class = FicheModeleEtEtapes


class SmallPagination(pagination.PageNumberPagination):
    page_size = 5
    max_page_size = 5


@extend_schema(
    summary="Fiche Modele Titre",
    description="Permet de récupérer les titres des fiches modèle sous formes d'options pour un select",
    tags=["Fiche Modele", "Modele"],
)
class FicheModeleOptionsView(generics.ListAPIView):
    queryset = FicheModele.objects.all()
    serializer_class = FicheModeleOptionsSerializer
    pagination_class = SmallPagination
    search_fields = ["^titre"]
    ordering_fields = ["titre"]


@extend_schema_view(
    post=extend_schema(
        summary="Copie Fiche Modele",
        description="Permet de copier une fiche modèle vers une affaire",
        tags=["Fiche Modele", "Modele"],
        parameters=[
            OpenApiParameter(
                name="affaire",
                type=int,
                required=True,
                description="id de l'affaire vers laquelle copier la fiche modèle",
            ),
            OpenApiParameter(
                name="modele",
                type=int,
                required=True,
                description="id de la fiche modèle à copier",
            ),
        ],
    )
)
class CopieModeleToAffaire(generics.GenericAPIView):
    queryset = FicheModele.objects.all()
    serializer_class = FicheModeleEtEtapes

    def post(self, request, *args, **kwargs):
        try:
            # get the affaire id from the request query params
            affaire_id = request.query_params.get("affaire")
            modele_id = request.query_params.get("modele")
            affaire = Affaire.objects.get(id=affaire_id)
            modele = FicheModele.objects.get(id=modele_id)
            fiche = Fiche.objects.create(
                affaire=affaire,
                titre=modele.titre,
                description=modele.description,
                fourniture=modele.fourniture,
            )

            etapes = modele.etapes_modele.all()
            for _etape in etapes:
                Etape.objects.create(
                    fiche=fiche,
                    num_etape=_etape.num_etape,
                    quantite=_etape.quantite,
                    temps=_etape.temps,
                    plan=_etape.plan,
                    rep=_etape.rep,
                    machine=_etape.machine,
                    terminee=_etape.terminee,
                    description=_etape.description,
                )
            return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
