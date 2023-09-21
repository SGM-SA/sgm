from drf_spectacular.utils import extend_schema

from api.affectation.models import AffectationMachine
from api.affectation.serializer import AffectationMachineSerializer
from rest_framework import generics


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
