from rest_framework import serializers

from api.etape.models import Etape
from api.machine.serializer import MachineDetailSerializer


class EtapeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etape
        fields = ["id", "num_etape"]


class EtapeDetail(serializers.ModelSerializer):
    machine = MachineDetailSerializer(read_only=True)

    cout_etape = serializers.FloatField(read_only=True)

    class Meta:
        model = Etape
        fields = "__all__"


class EtapeDetailAjustage(serializers.ModelSerializer):
    affectation_id = serializers.IntegerField(read_only=True)
    user_id = serializers.IntegerField(read_only=True)
    cout_etape = serializers.FloatField(read_only=True)

    class Meta:
        model = Etape
        fields = "__all__"


class EtapeDetailMachine(serializers.ModelSerializer):
    affectation_id = serializers.IntegerField(read_only=True)
    user_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Etape
        fields = "__all__"


class EtapeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etape
        fields = "__all__"
