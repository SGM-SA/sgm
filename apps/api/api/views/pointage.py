from api.models import Pointage
from api.serializers import PointageSerializer
from rest_framework import generics


class PointageList(generics.ListCreateAPIView):
    queryset = Pointage.objects.all()
    serializer_class = PointageSerializer


class PointageDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pointage.objects.all()
    serializer_class = PointageSerializer
