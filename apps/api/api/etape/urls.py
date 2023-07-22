from django.urls import path
from api.etape.view import EtapeCreate, EtapeRetrieveUpdateDelete, EtapesBulkDelete

urlpatterns = [
    path("", EtapeCreate.as_view()),
    path("delete", EtapesBulkDelete.as_view()),
    path("<int:pk>", EtapeRetrieveUpdateDelete.as_view()),
]
