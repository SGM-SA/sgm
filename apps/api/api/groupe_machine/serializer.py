from rest_framework import serializers
from api.groupe_machine.models import GroupeMachine


class GroupeMachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupeMachine
        fields = "__all__"


class GroupeMachineBulkDeleteSerializer(serializers.Serializer):
    ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=True,
        help_text="Liste de groupe à supprimmer",
    )
