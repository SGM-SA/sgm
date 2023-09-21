from rest_framework import serializers
from api.affectation.models import AffectationMachine, AffectationAjustage


class AffectationMachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = AffectationMachine
        fields = "__all__"


class AffectationAjustageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AffectationAjustage
        fields = ["id", "etape", "zone", "semaine_affectation"]
