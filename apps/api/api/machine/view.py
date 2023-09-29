from api.models import Machine
from api.machine.serializer import MachineDetailSerializer
from rest_framework import generics, status
from rest_framework.response import Response
from drf_spectacular.utils import (
    extend_schema_view,
    extend_schema,
    OpenApiParameter,
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


@extend_schema_view(
    delete=extend_schema(
        summary="Suppression",
        description="Suppression d'une machine ou plusieurs machines, la machine est désactivée et non supprimée pour garder l'historique",
        tags=["Machine"],
    ),
)
class MachineDelete(generics.DestroyAPIView):
    queryset = Machine.objects.all()
    serializer_class = MachineDetailSerializer

    # custom delete method where ids are provided in the url
    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="ids",
                required=True,
            )
        ]
    )
    def delete(self, request, *args, **kwargs):
        try:
            # delete all the objects
            pk_ids = request.query_params.get("ids", None)
            if pk_ids is None:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            pk_ids = pk_ids.split(",")
            objs = self.get_queryset().filter(id__in=pk_ids)
            objs.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": str(e)})
