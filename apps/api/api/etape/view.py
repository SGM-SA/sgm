from drf_spectacular.utils import (
    extend_schema,
)
from api.etape.models import Etape
from api.etape.serializer import EtapeCreateSerializer
from api.commun.views import BulkDeleteView
from rest_framework import generics


@extend_schema(
    summary="Creation d'Etape",
    tags=["Etape"],
)
class EtapeCreate(generics.CreateAPIView):
    queryset = Etape.objects.all()
    serializer_class = EtapeCreateSerializer


@extend_schema(
    summary="Gestion d'Etapes",
    tags=["Etape"],
)
class EtapeRetrieveUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = Etape.objects.all()
    serializer_class = EtapeCreateSerializer


@extend_schema(
    summary="Bulk delete d'Etapes",
    tags=["Etape"],
)
class EtapesBulkDelete(BulkDeleteView):
    queryset = Etape.objects.all()
