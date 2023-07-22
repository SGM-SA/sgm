from rest_framework import serializers
from api.models import Fourniture


class FournitureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fourniture
        fields = "__all__"
