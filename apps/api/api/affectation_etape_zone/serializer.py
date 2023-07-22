from rest_framework import serializers
from api.affectation_etape_zone.models import AffectationAjustage


class AffectationAjustageDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = AffectationAjustage
        fields = "__all__"
