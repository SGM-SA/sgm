from django.urls import path
from api.salarie.view import SalarieFormOptions

urlpatterns = [
    path("form-options", SalarieFormOptions.as_view()),
]
