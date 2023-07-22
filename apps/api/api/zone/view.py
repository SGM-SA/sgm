from api.zone.models import Zone
from api.zone.serializer import ListZoneSerializer
from rest_framework import generics


class ZoneList(generics.ListAPIView):
    queryset = Zone.objects.all()
    serializer_class = ListZoneSerializer
