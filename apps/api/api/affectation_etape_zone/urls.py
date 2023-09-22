from django.urls import path
from api.affectation.views import AffectationAjustageCreateList, AffectationAjustageCRUD

urlpatterns = [
    path("", AffectationAjustageCreateList.as_view()),
    path("<int:pk>", AffectationAjustageCRUD.as_view()),
]
