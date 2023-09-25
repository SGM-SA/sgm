from django.contrib import admin

from .models import (
    Client,
    Statut,
    Aptitude,
    Etat,
    Facture,
    Fournisseur,
    Fourniture,
    TypeFourniture,
    AchatFourniture,
    Machine,
)
from api.affaire.models import Affaire
from api.affectation.models import AffectationAjustage, AffectationMachine
from api.fiche.models import Fiche
from api.etape.models import Etape
from api.zone.models import Zone
from api.user.models import CustomUser
from api.fiche_modele.models import FicheModele
from api.etape_modele.models import EtapeModele
from .affectation.admin import AffectationMachineModelAdmin
from api.note.models import Note
from api.groupe_machine.models import GroupeMachine
from api.pointage.models import PointageEtape

admin.site.register(AffectationMachine, AffectationMachineModelAdmin)
admin.site.register(GroupeMachine)
admin.site.register(Machine)
admin.site.register(Affaire)
admin.site.register(Fiche)
admin.site.register(Etape)
admin.site.register(EtapeModele)
admin.site.register(Zone)
admin.site.register(FicheModele)
admin.site.register(Client)
admin.site.register(Statut)
admin.site.register(Aptitude)
admin.site.register(Etat)
admin.site.register(PointageEtape)
admin.site.register(Facture)
admin.site.register(Fournisseur)
admin.site.register(Fourniture)
admin.site.register(TypeFourniture)
admin.site.register(AchatFourniture)
admin.site.register(AffectationAjustage)
admin.site.register(CustomUser)
admin.site.register(Note)
admin.site.site_header = "SGM Administration"
admin.site.site_title = "SGM Administration"
