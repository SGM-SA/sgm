from drf_spectacular.types import OpenApiTypes

from api.zone.models import Zone
from api.planning.planning_zone.serializer import PlanningZoneSerializer
from rest_framework import generics

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
