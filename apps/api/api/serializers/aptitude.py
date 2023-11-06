from rest_framework import serializers
from api.models import Aptitude


class AptitudeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aptitude
        fields = "__all__"
