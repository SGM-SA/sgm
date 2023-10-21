from drf_spectacular.utils import extend_schema
from rest_framework import generics, mixins

from api.affectation.models import AffectationMachine, AffectationAjustage
from api.affectation.serializer import (
    AffectationMachineCreateSerializer,
    AffectationMachineUpdateSerializer,
    AffectationAjustageCreateSerializer,
    AffectationAjustageUpdateSerializer,
)


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
class AffectationMachineUpdateDelete(
    mixins.DestroyModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView
):
    queryset = AffectationMachine.objects.all()
    serializer_class = AffectationMachineUpdateSerializer

    def get_serializer_context(self):
        return {"request": self.request}

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


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
class AffectationAjustageUpdateDelete(
    mixins.DestroyModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView
):
    queryset = AffectationAjustage.objects.all()
    serializer_class = AffectationAjustageUpdateSerializer

    def get_serializer_context(self):
        return {"request": self.request}

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
