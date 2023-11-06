from rest_framework import serializers
from api.models import AchatFourniture


class AchatFournitureSerializer(serializers.ModelSerializer):
    class Meta:
        model = AchatFourniture
        fields = "__all__"
