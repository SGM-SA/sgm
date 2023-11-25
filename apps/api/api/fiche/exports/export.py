from datetime import datetime

from api.commun.exports import (
    generate_qr_code_base64,
    template_to_buffer,
    buffer_to_response,
)
from api.etape.models import Etape

from api.fiche.models import Fiche


def export_fiche_pdf(fiche: Fiche):

    # ---------------------- DATA ----------------------
    fiche_title_pdf = f"{fiche.affaire.num_affaire}_{fiche.titre}.pdf".replace(
        " ", "_"
    ).replace("-", "")

    etapes = Etape.objects.filter(fiche=fiche).order_by("num_etape")

    fiche.qr_code_base64 = generate_qr_code_base64(f"FI:{fiche.id}")

    for etape in etapes:
        etape.qr_code_base64 = generate_qr_code_base64(f"ET:{etape.id}")

    context = {
        "fiche": fiche,
        "etapes": etapes,
        "date": datetime.now(),
    }

    # ---------------------- TEMPLATE ----------------------

    buffer = template_to_buffer("export_fiche_template.html", context)
    return buffer_to_response(buffer, fiche_title_pdf)
