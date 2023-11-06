from django.urls import path
from api.pointage.view import PointageList, PointageGestion, ExportPointagesView

urlpatterns = [
    path("list", PointageList.as_view()),
    path("", PointageGestion.as_view()),
    path("export", ExportPointagesView.as_view()),
]
