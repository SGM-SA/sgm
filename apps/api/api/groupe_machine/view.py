from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from api.groupe_machine.models import GroupeMachine
from .serializer import GroupeMachineSerializer
from api.commun.serializer import BulkDeleteSerializer
from api.commun.views import BulkDeleteView
from drf_spectacular.utils import extend_schema, extend_schema_view


@extend_schema_view(
    get=extend_schema(
        summary="Lister tous les GroupesMachine",
        description="Cette opération permet de récupérer la liste de tous les GroupesMachine.",
        tags=["GroupeMachine"],
    ),
    post=extend_schema(
        summary="Créer un nouveau GroupeMachine",
        description="Cette opération permet de créer un nouveau GroupeMachine.",
        tags=["GroupeMachine"],
    ),
)
class GroupeMachineListCreateView(generics.ListCreateAPIView):
    queryset = GroupeMachine.objects.all()
    serializer_class = GroupeMachineSerializer


@extend_schema_view(
    get=extend_schema(
        summary="Récupérer un GroupeMachine",
        description="Cette opération permet de récupérer un GroupeMachine spécifique en utilisant son ID.",
        tags=["GroupeMachine"],
    ),
    put=extend_schema(
        summary="Mettre à jour un GroupeMachine",
        description="Cette opération permet de mettre à jour un GroupeMachine spécifique en utilisant son ID.",
        tags=["GroupeMachine"],
    ),
    patch=extend_schema(
        summary="Mise à jour partielle d'un GroupeMachine",
        description="Cette opération permet de mettre à jour partiellement un GroupeMachine spécifique en utilisant son ID.",
        tags=["GroupeMachine"],
    ),
    delete=extend_schema(
        summary="Supprimer un GroupeMachine",
        description="Cette opération permet de supprimer un GroupeMachine spécifique en utilisant son ID.",
        tags=["GroupeMachine"],
    ),
)
class GroupeMachineRetrieveUpdateDestroyView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = GroupeMachine.objects.all()
    serializer_class = GroupeMachineSerializer


@extend_schema(
    summary="Bulk delete de GroupeMachine",
    description="Permet de supprimer plusieurs GroupeMachines en même temps",
    tags=["GroupeMachine"],
)
class GroupeMachineBulkDeleteView(BulkDeleteView):
    queryset = GroupeMachine.objects.all()
