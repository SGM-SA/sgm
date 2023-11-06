from api.models import TypeFourniture
from api.serializers import TypeFournitureSerializer
from rest_framework import generics


class TypeFournitureList(generics.ListCreateAPIView):
    queryset = TypeFourniture.objects.all()
    serializer_class = TypeFournitureSerializer


class TypeFournitureDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = TypeFourniture.objects.all()
    serializer_class = TypeFournitureSerializer
