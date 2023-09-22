from rest_framework import serializers
from api.affectation.models import AffectationMachine, AffectationAjustage


class AffectationMachineSerializer(serializers.ModelSerializer):
    """
    Serializer pour l'affectation d'une machine à une étape
    """

    class Meta:
        model = AffectationMachine
        fields = "__all__"


class AffectationAjustageSerializer(serializers.ModelSerializer):
    """
    Serializer pour l'affectation d'un ajustage à une étape
    """

    class Meta:
        model = AffectationAjustage
        fields = ["id", "etape", "zone", "semaine_affectation"]
