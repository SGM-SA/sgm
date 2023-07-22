from rest_framework import serializers
from api.etape_modele.models import EtapeModele
from api.machine.serializer import MachineDetailSerializer


class EtapeModeleDetail(serializers.ModelSerializer):
    machine = MachineDetailSerializer(read_only=True)
    
    class Meta:
        model = EtapeModele
        fields = "__all__"

class EtapeModeleListCreate(serializers.ModelSerializer):
    class Meta:
        model = EtapeModele
        fields = "__all__"
