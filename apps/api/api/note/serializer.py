from rest_framework import serializers
from .models import Note


class NoteDetail(serializers.ModelSerializer):
    user = serializers.CharField(source="user.name", read_only=True)

    class Meta:
        model = Note
        fields = ["id", "user", "contenu", "date_creation"]


class NoteCreate(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "contenu", "date_creation", "affaire"]
