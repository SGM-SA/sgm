from django.urls import path
from api.etape_modele.view import EtapeModeleListCreate, EtapeModeleRetrieveUpdateDestroy

urlpatterns = [
    path("etapes/", EtapeModeleListCreate.as_view()),
    path("etapes/<int:pk>", EtapeModeleRetrieveUpdateDestroy.as_view()),
]
