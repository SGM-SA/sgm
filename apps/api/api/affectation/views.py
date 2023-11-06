from drf_spectacular.utils import extend_schema
from rest_framework import generics, mixins, status
from rest_framework.response import Response

from api.affectation.models import AffectationMachine, AffectationAjustage
from api.affectation.serializer import (
    AffectationMachineCreateSerializer,
    AffectationMachineUpdateSerializer,
    AffectationAjustageCreateSerializer,
    AffectationAjustageUpdateSerializer,
)
from api.affectation.utils import delete_affectation


class AffectationAbstractUpdateDelete(
    mixins.DestroyModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView
):
    queryset = None
    serializer_class = None

    def get_serializer_context(self):
        return {"request": self.request}

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def perform_destroy(self, instance):
        delete_affectation(instance)


@extend_schema(
    tags=["Affectation Machine"],
    description="Créer une affectation machine",
)
class AffectationMachineCreate(generics.CreateAPIView):
    queryset = AffectationMachine.objects.all()
    serializer_class = AffectationMachineCreateSerializer


@extend_schema(
    tags=["Affectation Machine"],
    description="Supprimer et mettre à jour une affectation machine",
)
class AffectationMachineUpdateDelete(AffectationAbstractUpdateDelete):
    queryset = AffectationMachine.objects.all()
    serializer_class = AffectationMachineUpdateSerializer


@extend_schema(
    tags=["Affectation Ajustage"],
    description="Créer et lister une affectation ajustage",
)
class AffectationAjustageCreate(generics.CreateAPIView):
    queryset = AffectationAjustage.objects.all()
    serializer_class = AffectationAjustageCreateSerializer


@extend_schema(
    tags=["Affectation Ajustage"],
    description="Supprimer et mettre à jour une affectation ajustage",
)
class AffectationAjustageUpdateDelete(AffectationAbstractUpdateDelete):
    queryset = AffectationAjustage.objects.all()
    serializer_class = AffectationAjustageUpdateSerializer
