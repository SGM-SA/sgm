from django.urls import path
from api.zone.view import ZoneList

urlpatterns = [path("", ZoneList.as_view())]
