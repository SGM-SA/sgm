from rest_framework import serializers
from .models import Note


class NoteDetail(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(read_only=True, slug_field="name")

    class Meta:
        model = Note
        fields = ["id", "user", "contenu", "date_creation"]


class NoteCreate(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "contenu", "date_creation", "affaire"]
