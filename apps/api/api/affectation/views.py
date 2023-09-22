from drf_spectacular.utils import extend_schema
from rest_framework import generics

from api.affectation.models import AffectationMachine, AffectationAjustage
from api.affectation.serializer import (
    AffectationMachineSerializer,
    AffectationAjustageSerializer,
)


@extend_schema(
    tags=["Affectation Machine"],
    description="Créer et lister une affectation machine",
)
class AffectationMachineCreateList(generics.ListCreateAPIView):
    queryset = AffectationMachine.objects.all()
    serializer_class = AffectationMachineSerializer


@extend_schema(
    tags=["Affectation Machine"],
    description="Récupérer, mettre à jour et supprimer une affectation machine",
)
class AffectationMachineCRUD(generics.RetrieveUpdateDestroyAPIView):
    queryset = AffectationMachine.objects.all()
    serializer_class = AffectationMachineSerializer


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
