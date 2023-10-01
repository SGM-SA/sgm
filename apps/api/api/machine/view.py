from api.commun.views import BulkDeleteView
from api.models import Machine
from api.machine.serializer import MachineDetailSerializer
from rest_framework import generics
from drf_spectacular.utils import (
    extend_schema_view,
    extend_schema,
)


@extend_schema_view(
    get=extend_schema(
        summary="Liste",
        description="Liste des machines",
        tags=["Machine"],
    ),
    post=extend_schema(
        summary="Création",
        description="Création d'une machine",
        tags=["Machine"],
    ),
)
class MachineListCreate(generics.ListCreateAPIView):
    queryset = Machine.objects.all().filter(est_active=True)
    serializer_class = MachineDetailSerializer


@extend_schema_view(
    get=extend_schema(
        summary="Détail",
        description="Détail d'une machine",
        tags=["Machine"],
    ),
    patch=extend_schema(
        summary="Modification",
        description="Modification d'une machine",
        tags=["Machine"],
    ),
    put=extend_schema(
        summary="Modification",
        description="Modification d'une machine",
        tags=["Machine"],
    ),
)
class MachineDetail(generics.RetrieveUpdateAPIView):
    queryset = Machine.objects.all()
    serializer_class = MachineDetailSerializer


@extend_schema(
    summary="Bulk delete de Machines",
    tags=["Machine"],
)
class MachinesBulkDelete(BulkDeleteView):
    queryset = Machine.objects.all()
