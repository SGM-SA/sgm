from typing import Dict, Any, Union

from rest_framework import serializers
from constance import config


class BulkDeleteSerializer(serializers.Serializer):
    ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=True,
        help_text="Liste des ids des objets à supprimer",
    )


class ConstanceSerializer(serializers.Serializer):
    key = serializers.CharField(required=True)
    # value can be of different types
    value = serializers.SerializerMethodField()

    def update(self, instance, validated_data):
        """
        Met à jour un field de constance
        """
        key = validated_data.get("key")
        value = validated_data.get("value")
        setattr(config, key, value)
        return {key: value}

    def to_internal_value(self, data):
        """
        Convertit l'entrée en un type de données Python approprié en fonction du type de config actuel
        """
        key = data.get("key")
        if not hasattr(config, key):
            raise serializers.ValidationError({"key": "Invalid key"})

        original_value = getattr(config, key)
        new_value = data.get("value")

        # Type casting to match the type of the existing value in the config
        try:
            if isinstance(original_value, int):
                new_value = int(new_value)
            elif isinstance(original_value, float):
                new_value = float(new_value)
            elif isinstance(original_value, bool):
                new_value = bool(new_value)
            elif isinstance(original_value, str):
                new_value = str(new_value)
            # You can add more type castings as needed
        except (ValueError, TypeError):
            raise serializers.ValidationError({"value": "Invalid type for value"})

        return {"key": key, "value": new_value}

    def get_value(self, instance) -> Union[int, float, bool, str]:
        """
        Récupère la valeur d'un field de constance
        """
        key = instance.get("key")
        return getattr(config, key)

    @staticmethod
    def list_config() -> Dict[str, Any]:
        """
        Liste tous les fields de constance avec leurs valeurs (peut être de différents types)
        """
        all_config = []
        for key in dir(config):
            if not key.startswith("_") and not callable(getattr(config, key)):
                all_config.append({"key": key, "value": getattr(config, key)})
        return all_config


class ConstanceUpdateSerializer(serializers.Serializer):
    key = serializers.CharField(required=True)
    value = serializers.JSONField(required=True)
