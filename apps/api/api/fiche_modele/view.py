from drf_spectacular.types import OpenApiTypes
from rest_framework.response import Response
from rest_framework.views import APIView

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
                location="query",
            ),
            OpenApiParameter(
                name="modele",
                type=int,
                required=True,
                description="id de la fiche modèle à copier",
                location="query",
            ),
        ],
        responses={
            201: OpenApiTypes.STR,
            400: OpenApiTypes.STR,
            404: OpenApiTypes.STR,
        },
    )
)
class CopieModeleToAffaire(APIView):
    queryset = FicheModele.objects.all()

    def post(self, requete, *args, **kwargs):
        id_affaire = requete.query_params.get("affaire")
        id_modele = requete.query_params.get("modele")

        # Vérifiez si les deux 'affaire' et 'modele' sont fournis
        if not (id_affaire and id_modele):
            return Response(
                {"detail": "'affaire' et 'modele' sont requis."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            affaire = Affaire.objects.get(id=id_affaire)
            modele = FicheModele.objects.get(id=id_modele)

            fiche = Fiche.objects.create(
                affaire=affaire,
                titre=modele.titre,
                description=modele.description,
                fourniture=modele.fourniture,
            )

            etapes = modele.etapes_modele.all()
            nouvelles_etapes = [
                Etape(
                    fiche=fiche,
                    num_etape=_etape.num_etape,
                    quantite=_etape.quantite,
                    temps=_etape.temps,
                    plan=_etape.plan,
                    rep=_etape.rep,
                    groupe_machine=_etape.groupe_machine,
                    terminee=_etape.terminee,
                    description=_etape.description,
                )
                for _etape in etapes
            ]
            Etape.objects.bulk_create(nouvelles_etapes)
            return Response(
                {"detail": "Création réussie."}, status=status.HTTP_201_CREATED
            )

        except Affaire.DoesNotExist:
            return Response(
                {"detail": "Affaire non trouvée."}, status=status.HTTP_404_NOT_FOUND
            )
        except FicheModele.DoesNotExist:
            return Response(
                {"detail": "Modele non trouvé."}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
