from django.urls import path
from api.etape_modele.view import (
    EtapeModeleListCreate,
    EtapeModeleRetrieveUpdate,
    EtapeModeleBulkDelete,
)

urlpatterns = [
    path("etapes/", EtapeModeleListCreate.as_view()),
    path("etapes/<int:pk>", EtapeModeleRetrieveUpdate.as_view()),
    path("etapes/delete", EtapeModeleBulkDelete.as_view()),
]
