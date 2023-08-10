from api.models import AffectationAjustage
from api.affectation_etape_zone.serializer import (
    AffectationAjustageDetailSerializer,
)
from rest_framework import generics


class AffectationAjustageCreateList(generics.ListCreateAPIView):
    queryset = AffectationAjustage.objects.all()
    serializer_class = AffectationAjustageDetailSerializer


class AffectationAjustageCRUD(generics.RetrieveUpdateDestroyAPIView):
    queryset = AffectationAjustage.objects.all()
    serializer_class = AffectationAjustageDetailSerializer
