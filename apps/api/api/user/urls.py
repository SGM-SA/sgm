from django.urls import path
from api.user.view import ProfileView, SalarieFormOptions

urlpatterns = [
    path("", ProfileView.as_view()),
]

salarie_patterns = [
    path("form-options", SalarieFormOptions.as_view()),
]
