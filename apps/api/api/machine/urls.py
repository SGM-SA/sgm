from django.urls import path
from api.machine.view import MachineListCreate, MachineDetail, MachineDelete

urlpatterns = [
    path("", MachineListCreate.as_view()),
    path("delete", MachineDelete.as_view()),
    path("<int:pk>", MachineDetail.as_view()),
]
