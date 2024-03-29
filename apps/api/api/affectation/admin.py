from constance import config
from django.contrib.admin import ModelAdmin

from api.etape.models import Etape


class AffectationMachineModelAdmin(ModelAdmin):
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "etape":
            kwargs["queryset"] = Etape.objects.exclude(
                groupe_machine=config.GROUPE_MACHINE_AJUSTAGE_ID
            ).exclude(affectationmachine__machine__isnull=False)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
