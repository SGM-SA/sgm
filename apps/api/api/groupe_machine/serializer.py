from typing import List

from drf_spectacular.utils import extend_schema, extend_schema_field
from rest_framework import serializers
from api.groupe_machine.models import GroupeMachine
from api.machine.serializer import MachineDetailSerializer


class GroupeMachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupeMachine
        fields = ["id", "nom_groupe", "prix_theorique"]


class GroupeMachineListMachineSerializer(serializers.ModelSerializer):

    machines = serializers.SerializerMethodField()

    class Meta:
        model = GroupeMachine
        fields = ["id", "nom_groupe", "machines", "prix_theorique"]

    @extend_schema_field(MachineDetailSerializer(many=True))
    def get_machines(self, obj: GroupeMachine) -> List[MachineDetailSerializer]:
        machines = obj.machines.all().exclude(est_active=False)
        return MachineDetailSerializer(machines, many=True).data


class GroupeMachineBulkDeleteSerializer(serializers.Serializer):
    ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=True,
        help_text="Liste de groupe à supprimmer",
    )
