from datetime import datetime

from api.affectation.models import AffectationMachine, AffectationAjustage
from api.commun.exports import (
    generate_qr_code_base64,
    template_to_buffer,
    buffer_to_response,
)
from api.machine.models import Machine
from api.planning.utils import sort_affectations_by_previous
from api.utils.dates import week_to_date_range
from api.zone.models import Zone


def export_planning_zone_pdf(zone: Zone, date):

    # ---------------------- DATA ----------------------

    range_date = week_to_date_range(date)

    planning_machine_title_pdf = f"{zone.nom}_{range_date[0].strftime('%d/%m/%Y')}_{range_date[1].strftime('%d/%m/%Y')}.pdf".replace(
        " ", "-"
    )

    affectations = AffectationAjustage.objects.filter(
        zone=zone,
        semaine_affectation__range=range_date,
    )

    sorted_affectations = sort_affectations_by_previous(affectations)

    for affectation in sorted_affectations:
        affectation.etape.qr_code_base64 = generate_qr_code_base64(
            f"ET:{affectation.etape.id}"
        )

    context = {
        "zone": zone,
        "affectations": sorted_affectations,
        "debut": range_date[0],
        "fin": range_date[1],
        "date": datetime.now(),
    }

    # ---------------------- TEMPLATE ----------------------

    buffer = template_to_buffer("export_planning_zone_template.html", context)
    return buffer_to_response(buffer, planning_machine_title_pdf)
