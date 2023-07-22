from rest_framework import serializers
from api.models import Etat


class EtatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etat
        fields = "__all__"
