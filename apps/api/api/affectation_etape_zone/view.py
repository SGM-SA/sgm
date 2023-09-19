from drf_spectacular.utils import extend_schema

from api.models import AffectationAjustage
from api.affectation_etape_zone.serializer import (
    AffectationAjustageDetailSerializer,
)
from rest_framework import generics


@extend_schema(
    tags=["Affectation Ajustage"],
    description="Créer et lister une affectation ajustage",
)
class AffectationAjustageCreateList(generics.ListCreateAPIView):
    queryset = AffectationAjustage.objects.all()
    serializer_class = AffectationAjustageDetailSerializer


@extend_schema(
    tags=["Affectation Ajustage"],
    description="Récupérer, mettre à jour et supprimer une affectation ajustage",
)
class AffectationAjustageCRUD(generics.RetrieveUpdateDestroyAPIView):
    queryset = AffectationAjustage.objects.all()
    serializer_class = AffectationAjustageDetailSerializer
