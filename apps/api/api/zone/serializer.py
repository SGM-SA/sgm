from rest_framework import serializers
from api.zone.models import Zone
from api.fiche.serializer import FicheDetailSerializer
from datetime import datetime, timedelta


class ListZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = ["id", "nom", "description"]


class ZoneSerializer(serializers.ModelSerializer):
    # permet de serializer plusieurs fiches
    fiches = FicheDetailSerializer(
        many=True,
    )

    class Meta:
        model = Zone
        fields = "__all__"
