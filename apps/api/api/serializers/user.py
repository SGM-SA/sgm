from rest_framework import serializers
from django.contrib.auth.models import User
from drf_spectacular.utils import extend_schema_field


class UserSerializer(serializers.ModelSerializer):
    """
    test
    """

    groups = serializers.SerializerMethodField()

    @extend_schema_field(serializers.ListSerializer(child=serializers.CharField()))
    def get_groups(self, obj):
        return obj.groups.values_list("name", flat=True)

    class Meta:
        model = User

        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "groups",
        ]
