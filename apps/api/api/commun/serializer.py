from rest_framework import serializers


class BulkDeleteSerializer(serializers.Serializer):
    ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=True,
        help_text="Liste des ids des objets à supprimer",
    )
