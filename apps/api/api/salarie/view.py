from api.models import Salarie
from api.salarie.serializer import (
    SalarieSerializer,
    SalarieFormOptionsSerializer,
)
from rest_framework import generics
from drf_spectacular.utils import extend_schema_view, extend_schema


class SalarieList(generics.ListAPIView):
    queryset = Salarie.objects.all()
    serializer_class = SalarieSerializer


@extend_schema_view(
    get=extend_schema(
        summary="Salarie form options",
        description="Permet de récupérer les options pour les formulaires",
        tags=["Salarie"],
    )
)
class SalarieFormOptions(generics.ListAPIView):
    queryset = Salarie.objects.all()
    serializer_class = SalarieFormOptionsSerializer


class SalarieDetail(generics.RetrieveAPIView):
    queryset = Salarie.objects.all()
    serializer_class = SalarieSerializer
