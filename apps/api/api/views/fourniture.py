from api.models import Fourniture
from api.serializers import FournitureSerializer
from rest_framework import generics


class FournitureList(generics.ListCreateAPIView):
    queryset = Fourniture.objects.all()
    serializer_class = FournitureSerializer


class FournitureDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Fourniture.objects.all()
    serializer_class = FournitureSerializer
