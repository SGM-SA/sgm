from drf_spectacular.utils import extend_schema

from api.zone.models import Zone
from api.zone.serializer import ListZoneSerializer
from rest_framework import generics


@extend_schema(tags=["Zone"], description="Lister les zones")
class ZoneList(generics.ListAPIView):
    queryset = Zone.objects.all()
    serializer_class = ListZoneSerializer
