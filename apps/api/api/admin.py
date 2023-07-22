from django.contrib import admin

from .models import (
    Client,
    Statut,
    Aptitude,
    Etat,
    Pointage,
    Facture,
    Fournisseur,
    Fourniture,
    TypeFourniture,
    AchatFourniture,
    Machine,
    AffectationAjustage,
)
from api.affaire.models import Affaire
from api.fiche.models import Fiche
from api.etape.models import Etape
from api.zone.models import Zone
from api.salarie.models import Salarie
from api.fiche_modele.models import FicheModele
from api.etape_modele.models import EtapeModele
from api.affectation_etape_machine.models import AffectationMachine
from api.affectation_etape_machine.admin import AffectationMachineModelAdmin
admin.site.register(AffectationMachine, AffectationMachineModelAdmin)
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
admin.site.register(Pointage)
admin.site.register(Facture)
admin.site.register(Fournisseur)
admin.site.register(Fourniture)
admin.site.register(TypeFourniture)
admin.site.register(AchatFourniture)
admin.site.register(AffectationAjustage)
admin.site.register(Salarie)