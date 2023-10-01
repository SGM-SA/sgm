from api.models import Etat
from api.serializers import EtatSerializer
from rest_framework import generics

from api.utils.view import LargeResultsSetPagination


class EtatList(generics.ListAPIView):
    queryset = Etat.objects.all()
    serializer_class = EtatSerializer
    pagination_class = LargeResultsSetPagination


class EtatDetail(generics.RetrieveAPIView):
    queryset = Etat.objects.all()
    serializer_class = EtatSerializer
