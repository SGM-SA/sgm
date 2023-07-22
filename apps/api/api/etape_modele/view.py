from api.etape_modele.models import EtapeModele
from api.etape_modele.serializer import EtapeModeleDetail, EtapeModeleListCreate
from rest_framework import generics
from drf_spectacular.utils import extend_schema

@extend_schema(
    summary="Etape Modele",
    description="Permet de récupérer une liste d'étape modèle",
    tags=["Etape Modele", "Modele"],
)
class EtapeModeleListCreate(generics.ListCreateAPIView):
    queryset = EtapeModele.objects.all()
    serializer_class = EtapeModeleListCreate

@extend_schema(
    summary="Etape Modele",
    description="gestion étape modèle",
    tags=["Etape Modele", "Modele"],
)
class EtapeModeleRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = EtapeModele.objects.all()
    serializer_class = EtapeModeleDetail