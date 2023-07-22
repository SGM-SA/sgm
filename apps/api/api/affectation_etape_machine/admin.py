from django.contrib import admin
from api.etape.models import Etape
from api.affectation_etape_machine.models import AffectationMachine
from constance import config
from django.contrib import admin

class AffectationMachineModelAdmin(admin.ModelAdmin):

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "etape":
            print("etape")
            kwargs["queryset"] = Etape.objects.exclude(machine=config.MACHINE_AJUSTAGE_ID).exclude(affectationmachine__machine__isnull=False)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


#admin.site.register(AffectationMachine)
