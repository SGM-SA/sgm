from django.urls import path
from api.user.view import ProfileView

urlpatterns = [
    path("", ProfileView.as_view()),
]
