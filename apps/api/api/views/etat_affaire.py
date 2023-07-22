from api.models import Etat
from api.serializers import EtatSerializer
from rest_framework import generics


class EtatList(generics.ListAPIView):
    queryset = Etat.objects.all()
    serializer_class = EtatSerializer


class EtatDetail(generics.RetrieveAPIView):
    queryset = Etat.objects.all()
    serializer_class = EtatSerializer
