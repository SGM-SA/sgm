from drf_spectacular.utils import extend_schema
from rest_framework import generics, status
from rest_framework.response import Response
from api.affectation.models import AffectationMachine, AffectationAjustage
from api.affectation.serializer import (
    AffectationMachineSerializer,
    AffectationAjustageSerializer,
)


@extend_schema(
    tags=["Affectation Machine"],
    description="Créer une affectation machine",
)
class AffectationMachineCreate(generics.CreateAPIView):
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
class AffectationAjustageCreate(generics.CreateAPIView):
    queryset = AffectationAjustage.objects.all()
    serializer_class = AffectationAjustageSerializer


@extend_schema(
    tags=["Affectation Ajustage"],
    description="Récupérer, mettre à jour et supprimer une affectation ajustage",
)
class AffectationAjustageCRUD(generics.RetrieveUpdateDestroyAPIView):
    queryset = AffectationAjustage.objects.all()
    serializer_class = AffectationAjustageSerializer
