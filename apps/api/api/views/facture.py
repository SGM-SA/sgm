from api.models import Facture
from api.serializers import FactureSerializer
from rest_framework import generics


class FactureList(generics.ListCreateAPIView):
    queryset = Facture.objects.all()
    serializer_class = FactureSerializer


class FactureDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Facture.objects.all()
    serializer_class = FactureSerializer
