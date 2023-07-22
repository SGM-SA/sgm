from rest_framework import serializers
from api.models import Pointage


class PointageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pointage
        fields = "__all__"
