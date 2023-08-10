from rest_framework import serializers
from api.affectation_etape_machine.models import AffectationMachine


class AffectationMachineDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = AffectationMachine
        fields = "__all__"
