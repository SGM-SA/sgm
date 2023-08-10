from api.affectation_etape_machine.models import AffectationMachine
from api.affectation_etape_machine.serializer import (
    AffectationMachineDetailSerializer,
)
from rest_framework import generics


class AffectationMachineCreateList(generics.ListCreateAPIView):
    queryset = AffectationMachine.objects.all()
    serializer_class = AffectationMachineDetailSerializer


class AffectationMachineCRUD(generics.RetrieveUpdateDestroyAPIView):
    queryset = AffectationMachine.objects.all()
    serializer_class = AffectationMachineDetailSerializer
