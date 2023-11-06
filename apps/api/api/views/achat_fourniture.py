from api.models import AchatFourniture
from api.serializers import AchatFournitureSerializer
from rest_framework import generics


class AchatFournitureList(generics.ListCreateAPIView):
    queryset = AchatFourniture.objects.all()
    serializer_class = AchatFournitureSerializer


class AchatFournitureDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = AchatFourniture.objects.all()
    serializer_class = AchatFournitureSerializer
