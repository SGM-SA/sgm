from django.urls import path
from api.zone.view import ZoneListCreate, ZoneRUD, ZonesBulkDelete

urlpatterns = [
    path("", ZoneListCreate.as_view()),
    path("delete", ZonesBulkDelete.as_view()),
    path("<int:pk>", ZoneRUD.as_view()),
]
