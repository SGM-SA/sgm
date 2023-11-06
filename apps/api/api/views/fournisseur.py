from api.models import Fournisseur
from api.serializers import FournisseurSerializer
from rest_framework import generics


class FournisseurList(generics.ListCreateAPIView):
    queryset = Fournisseur.objects.all()
    serializer_class = FournisseurSerializer


class FournisseurDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Fournisseur.objects.all()
    serializer_class = FournisseurSerializer
