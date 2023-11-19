from drf_spectacular.types import OpenApiTypes
from rest_framework.response import Response
from rest_framework.views import APIView

from api.planning.planning_zone.export import export_planning_zone_pdf
from api.zone.models import Zone
from api.planning.planning_zone.serializer import PlanningZoneSerializer
from rest_framework import generics, status

from drf_spectacular.utils import (
    extend_schema_view,
    extend_schema,
    OpenApiParameter,
)


@extend_schema_view(
    get=extend_schema(
        summary="",
        description="Permet de récupérer pour une année et semaine donnée, "
        "chaque affaires et leurs fiches à traiter dans chaque zone",
        parameters=[
            OpenApiParameter(
                name="date", description="date", type=OpenApiTypes.DATE, required=True
            ),
        ],
        tags=["Planning"],
    ),
)
class PlanningZoneAvecFiches(generics.ListAPIView):
    queryset = Zone.objects.all()
    serializer_class = PlanningZoneSerializer
    pagination_class = None


@extend_schema_view(
    get=extend_schema(
        tags=["Planning"],
        summary="Planning zone PDF",
        parameters=[
            OpenApiParameter(
                name="semaine_affectation",
                description="semaine_affectation",
                type=OpenApiTypes.DATE,
                required=True,
            ),
            OpenApiParameter(
                name="id",
                description="id",
                type=OpenApiTypes.INT,
                required=True,
            ),
        ],
    ),
)
class ExportPlanningZonePDF(APIView):
    """
    Permet d'exporter le planning zone en pdf
    """

    queryset = Zone.objects.all()

    @extend_schema(
        responses={200: None, 400: None},
    )
    def get(self, request, *args, **kwargs):
        """
        Exporte le planning zone en pdf
        """
        obj_id = request.query_params.get("id")

        # check if obj exists
        try:
            obj = self.queryset.get(id=obj_id)
        except self.queryset.model.DoesNotExist:
            return Response(
                {"detail": "L'objet n'existe pas"}, status=status.HTTP_400_BAD_REQUEST
            )

        return export_planning_zone_pdf(
            obj, request.query_params.get("semaine_affectation")
        )
