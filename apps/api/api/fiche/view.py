from drf_spectacular.types import OpenApiTypes
from rest_framework.response import Response

from api.commun.views import BulkDeleteView, APIView
from api.fiche.filters import EtapeMachinePlanifierFilter, EtapeAjustagePlanifierFilter
from api.fiche.models import Fiche
from api.affaire.models import Affaire
from api.affaire.serializer import AffaireFichesEtapesSerializer
from api.fiche.serializer import FicheEtEtapesAjustageSerializer, FicheCRUDSerializer
from api.fiche.exports.export import export_pdf
from rest_framework import generics, status
from drf_spectacular.utils import (
    extend_schema_view,
    extend_schema,
    OpenApiParameter,
)


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
    pagination_class = None


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
    pagination_class = None


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

    # permission_classes = [permissions.IsAdminUser]

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
