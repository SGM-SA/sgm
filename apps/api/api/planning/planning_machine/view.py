from drf_spectacular.types import OpenApiTypes

from api.machine.models import Machine
from api.planning.planning_machine.serializer import PlanningMachineSerializer
from rest_framework import generics
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
