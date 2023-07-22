from rest_framework import serializers
from api.models import Machine


class MachineDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = "__all__"
