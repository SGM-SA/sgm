from api.zone.models import Zone
from api.planning_zone.serializer import PlanningZoneSerializer
from rest_framework import generics

from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiParameter


@extend_schema_view(
    get=extend_schema(
        summary="",
        description="Permet de récupérer pour une année et semaine donnée, "
        "chaque affaires et leurs fiches à traiter dans chaque zone",
        parameters=[
            OpenApiParameter(
                name="annee", description="annee", type=int, required=True
            ),
            OpenApiParameter(
                name="semaine", description="numero semaine", type=int, required=True
            ),
        ],
        tags=["Planning"],
    ),
)
class PlanningZoneAvecFiches(generics.ListAPIView):

    queryset = Zone.objects.all()
    serializer_class = PlanningZoneSerializer
