from rest_framework import serializers
from api.models import TypeFourniture


class TypeFournitureSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeFourniture
        fields = "__all__"
