from datetime import datetime

from django.db.models import Q
from api.affaire.models import Affaire

filter_avancement_statut = Q(statut__in=Affaire.STATUS_EN_COURS)

filter_date_rendu = Q(date_rendu=None) | Q(date_rendu__lt=datetime.date(datetime.now()))

en_retard_filter = filter_avancement_statut & filter_date_rendu
