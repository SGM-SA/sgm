from api.machine.models import Machine
from api.planning_machine.serializer import PlanningMachineSerializer
from rest_framework import generics
from constance import config
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
                name="annee", description="annee", type=int, required=True
            ),
            OpenApiParameter(
                name="semaine",
                description="numero semaine",
                type=int,
                required=True,
            ),
        ],
        tags=["Planning"],
    ),
)
class PlanningMachineAvecFiches(generics.ListAPIView):
    queryset = Machine.objects.exclude(id=config.GROUPE_MACHINE_AJUSTAGE_ID)
    serializer_class = PlanningMachineSerializer
