from drf_spectacular.utils import extend_schema

from api.affectation.models import AffectationAjustage
from api.affectation.serializer import AffectationAjustageSerializer
from rest_framework import generics


@extend_schema(
    tags=["Affectation Ajustage"],
    description="Créer et lister une affectation ajustage",
)
class AffectationAjustageCreateList(generics.ListCreateAPIView):
    queryset = AffectationAjustage.objects.all()
    serializer_class = AffectationAjustageSerializer


@extend_schema(
    tags=["Affectation Ajustage"],
    description="Récupérer, mettre à jour et supprimer une affectation ajustage",
)
class AffectationAjustageCRUD(generics.RetrieveUpdateDestroyAPIView):
    queryset = AffectationAjustage.objects.all()
    serializer_class = AffectationAjustageSerializer
