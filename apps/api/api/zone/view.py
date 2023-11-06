from drf_spectacular.utils import extend_schema

from api.commun.views import BulkDeleteView
from api.zone.models import Zone
from api.zone.serializer import ListZoneSerializer
from rest_framework import generics


@extend_schema(tags=["Zone"], description="Créer / Lister une zone")
class ZoneListCreate(generics.ListCreateAPIView):
    queryset = Zone.objects.all().order_by("nom")
    serializer_class = ListZoneSerializer


@extend_schema(tags=["Zone"], description="Récupérer et Updater  une zone")
class ZoneRUD(generics.RetrieveUpdateAPIView):
    queryset = Zone.objects.all()
    serializer_class = ListZoneSerializer


@extend_schema(
    summary="Bulk delete de Zone",
    tags=["Zone"],
)
class ZonesBulkDelete(BulkDeleteView):
    queryset = Zone.objects.all()
