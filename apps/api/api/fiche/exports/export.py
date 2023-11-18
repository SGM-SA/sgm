import base64

import qrcode
from django.contrib.staticfiles import finders
from django.http import HttpResponse, FileResponse
from django.template.loader import render_to_string
from reportlab.lib.pagesizes import landscape, A4
from reportlab.pdfgen import canvas
from reportlab.platypus import Table, TableStyle, Paragraph, Spacer, Image
from reportlab.graphics.barcode import qr
from reportlab.graphics.shapes import Drawing
from reportlab.lib.styles import getSampleStyleSheet
from rest_framework.response import Response
from weasyprint import HTML

from api.etape.models import Etape
from io import BytesIO

from api.fiche.models import Fiche

MARGIN = 30
styles = getSampleStyleSheet()
styleN = styles["BodyText"]
# fontsize
styleN.fontSize = 14
# center
styleN.alignment = 1


def export_pdf(fiche: Fiche):

    # ---------------------- DATA ----------------------
    fiche_title_pdf = f"{fiche.affaire.num_affaire}_{fiche.titre}.pdf".replace(
        " ", "_"
    ).replace("-", "")

    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = "attachment; filename=toto.pdf"

    etapes = Etape.objects.filter(fiche=fiche).order_by("num_etape")

    for etape in etapes:
        etape.qr_code_base64 = generate_qr_code_base64(f"ET:{etape.id}")

    context = {
        "fiche": fiche,
        "etapes": etapes,
    }

    # Créez un document HTML à partir du template
    html_string = render_to_string("export_template.html", context)

    print(html_string)
    pdf = HTML(string=html_string).write_pdf("./test.pdf")

    # Générez le PDF

    buffer = BytesIO()
    HTML(string=html_string).write_pdf(target=buffer)
    buffer.seek(0)
    return FileResponse(
        buffer,
        as_attachment=True,
        filename="test.pdf",
        content_type="application/pdf",
    )


def generate_qr_code_base64(content):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(content)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)

    return base64.b64encode(buffer.getvalue()).decode()
