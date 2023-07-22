from api.models import Aptitude
from api.serializers import AptitudeSerializer
from rest_framework import generics


class AptitudeList(generics.ListCreateAPIView):
    queryset = Aptitude.objects.all()
    serializer_class = AptitudeSerializer


class AptitudeDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Aptitude.objects.all()
    serializer_class = AptitudeSerializer
