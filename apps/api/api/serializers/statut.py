from rest_framework import serializers
from api.models import Statut


class StatutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Statut
        fields = "__all__"
