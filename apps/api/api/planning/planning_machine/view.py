from drf_spectacular.types import OpenApiTypes
from rest_framework.response import Response
from rest_framework.views import APIView

from api.commun.views import ExportPdfView
from api.machine.models import Machine
from api.planning.planning_machine.export import export_planning_machine_pdf
from api.planning.planning_machine.serializer import PlanningMachineSerializer
from rest_framework import generics, status
from drf_spectacular.utils import (
    extend_schema_view,
    extend_schema,
    OpenApiParameter,
)


@extend_schema_view(
    get=extend_schema(
        summary="Planning machine avec fiches",
        description="Permet de récupérer pour une semaine donnée, "
        "chaque affaires et leurs fiches à traiter pour chaque machine",
        parameters=[
            OpenApiParameter(
                name="date", description="date", type=OpenApiTypes.DATE, required=True
            ),
        ],
        tags=["Planning"],
    ),
)
class PlanningMachineAvecFiches(generics.ListAPIView):
    queryset = Machine.objects.all().order_by("nom_machine")
    serializer_class = PlanningMachineSerializer
    pagination_class = None


@extend_schema_view(
    get=extend_schema(
        tags=["Planning"],
        summary="Planning machine PDF",
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
class ExportPlanningMachinePDF(APIView):
    """
    Permet d'exporter le planning machine en pdf
    """

    queryset = Machine.objects.all()
    export_pdf = export_planning_machine_pdf

    @extend_schema(
        responses={200: None, 400: None},
    )
    def get(self, request, *args, **kwargs):
        """
        Exporte le planning machine en pdf
        """
        obj_id = request.query_params.get("id")

        # check if obj exists
        try:
            obj = self.queryset.get(id=obj_id)
        except self.queryset.model.DoesNotExist:
            return Response(
                {"detail": "L'objet n'existe pas"}, status=status.HTTP_400_BAD_REQUEST
            )

        return export_planning_machine_pdf(
            obj, request.query_params.get("semaine_affectation")
        )
