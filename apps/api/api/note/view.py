from django.db.models import F
from rest_framework import generics, permissions
from .models import Note
from api.affaire.models import Affaire
from .serializer import NoteDetail, NoteCreate
from drf_spectacular.utils import extend_schema
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime, time


@extend_schema(
    summary="Créer une Note",
    description="Permet de créer une nouvelle note",
    tags=["Note"],
)
class NoteCreateAPIView(generics.CreateAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteCreate
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, vue_par=[self.request.user])


@extend_schema(
    summary="Détails et Modification de la Note",
    description="Permet de récupérer, modifier ou supprimer une note existante",
    tags=["Note"],
)
class NoteRUDAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteDetail


@extend_schema(
    summary="Liste des Notes par Affaire",
    description="Récupère toutes les notes associées à une affaire donnée, ordonnées par date de création. La première note est la description de l'affaire.",
    tags=["Note"],
    responses={200: NoteDetail(many=True), 404: None},
)
class AffaireNotesListView(APIView):
    serializer_class = NoteDetail(many=True)

    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        affaire_id = self.kwargs["affaire_id"]

        affaire = Affaire.objects.get(id=affaire_id)

        notes = Note.objects.filter(affaire=affaire).order_by("date_creation")

        description_as_note = Note(
            contenu=affaire.description,
            date_creation=datetime.combine(affaire.date_creation, time.min),
            user=None,
        )

        observation_as_note = Note(
            contenu="" if affaire.observation is None else affaire.observation,
            date_creation=datetime.combine(affaire.date_creation, time.min),
            user=None,
        )

        obervation_description = [description_as_note]
        if affaire.observation is not "":
            obervation_description.append(observation_as_note)

        set_notes_vue_par(self.request.user, affaire_id)

        return NoteDetail(obervation_description + list(notes), many=True).data

    def get(self, request, *args, **kwargs):
        affaire_id = self.kwargs["affaire_id"]

        try:
            Affaire.objects.get(id=affaire_id)
        except Affaire.DoesNotExist:
            return Response(status=404)

        queryset = self.get_queryset()

        return Response(queryset)


def set_notes_vue_par(user, affaire_id):
    """
    Permet de mettre à jour les notes vues par l'utilisateur
    """
    # Find notes related to the affaire that the user has not yet seen
    notes_to_update = Note.objects.filter(affaire_id=affaire_id).exclude(vue_par=user)

    if notes_to_update.exists():
        for note in notes_to_update:
            note.vue_par.add(user)
