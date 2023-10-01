from rest_framework import serializers
from api.etape.models import Etape
from api.machine.serializer import MachineDetailSerializer


class EtapeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etape
        fields = ["id", "num_etape"]


class EtapeDetail(serializers.ModelSerializer):
    machine = MachineDetailSerializer(read_only=True)
    affectation_id = serializers.SlugRelatedField(
        read_only=True, slug_field="id", source="affectationajustage"
    )

    class Meta:
        model = Etape
        fields = "__all__"


class EtapeDetailAjustage(serializers.ModelSerializer):
    affectation_id = serializers.SlugRelatedField(
        read_only=True, slug_field="id", source="affectationajustage"
    )
    user_id = serializers.SlugRelatedField(
        read_only=True, slug_field="id", source="affectationajustage.user"
    )

    class Meta:
        model = Etape
        fields = "__all__"


class EtapeDetailMachine(serializers.ModelSerializer):
    affectation_id = serializers.SlugRelatedField(
        read_only=True, slug_field="id", source="affectationmachine"
    )
    user_id = serializers.SlugRelatedField(
        read_only=True, slug_field="id", source="affectationmachine.user"
    )

    class Meta:
        model = Etape
        fields = "__all__"


class EtapeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etape
        fields = "__all__"
