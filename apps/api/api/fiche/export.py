from django.http import HttpResponse
from django.contrib.staticfiles import finders
from reportlab.lib.pagesizes import landscape, A4
from reportlab.pdfgen import canvas
from reportlab.platypus import Table, TableStyle, Paragraph, Spacer, Image
from reportlab.graphics.barcode import qr
from reportlab.graphics.shapes import Drawing
from reportlab.lib.styles import getSampleStyleSheet
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
    fiche_title_pdf = f"{fiche.affaire.num_affaire}_{fiche.titre}.pdf".replace(" ", "_").replace("-", "")
    etapes = Etape.objects.filter(fiche=fiche).order_by("num_etape")

    # ---------------------- GLOBAL  ----------------------
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=landscape(A4))

    width, height = landscape(A4)

    # Adjusting for margin
    width -= 2 * MARGIN
    height -= 2 * MARGIN

    # ---------------------- HEADER ----------------------

    # QR CODE AFFAIRE
    qr_size = width / 11
    d_affaire = generate_qr_code("AF:{}".format(fiche.affaire.num_affaire), qr_size)

    # TITRE FICHE
    fiche_title = Paragraph(
        fiche.titre,
        styleN,
    )

    logo_path = finders.find("sgmlogo.jpeg")
    # AFFAIRE + LOGO from static
    logo = Image(logo_path, width=80, height=30)
    affaire_title = Paragraph(
        "SGM \n Affaire: {}".format(fiche.affaire.num_affaire), styleN
    )
    combined_elements = [logo, Spacer(1, 10), affaire_title]

    # CREATION TABLE HEADER
    data = [[combined_elements, fiche_title, d_affaire]]
    table = Table(data, colWidths=[width / 5, 3 * width / 5, width / 5])

    # Styling du header
    style = TableStyle(
        [
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("FONTSIZE", (0, 0), (-1, -1), 14),
            ("INNERGRID", (0, 0), (-1, -1), 0.25, "black"),
        ]
    )
    table.setStyle(style)

    # DESSIN DU HEADER
    tw, th = table.wrapOn(c, width, height)
    table.drawOn(c, MARGIN, height + MARGIN - th)

    # DESSIN DU RECTANGLE HEADER
    c.roundRect(MARGIN, height + MARGIN - th, width, th, 10)

    # ---------------------- BODY ----------------------

    col_widths = [
        width / 11,  # n°etape
        width / 11,  # Plan
        width / 11,  # GP Machine
        5 * width / 11,  # Description
        width / 11,  # Quantité
        width / 11,  # Temps
        width / 11,
    ]  # QR Code

    # HEADER DATA
    header_data = [
        "N°etape",
        "Plan",
        "GP Machine",
        "Description",
        "Quantité",
        "Temps",
        "QR Code",
    ]

    # DATA ETAPE
    data = table_content(etapes, width / 15)

    # MERGE DU HEADER ET DE LA DATA
    if data:
        all_data = [header_data] + data
    else:
        all_data = [header_data]

    # CREATION TABLE BODY
    new_table = Table(all_data, colWidths=col_widths)

    new_table_style = TableStyle(
        [
            # Header styling
            ("BOLD", (0, 0), (-1, 0)),  # Header text bold
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),  # All text center-aligned
            (
                "VALIGN",
                (0, 0),
                (-1, -1),
                "MIDDLE",
            ),  # All text vertically middle-aligned
            (
                "INNERGRID",
                (0, 0),
                (-1, 0),
                1,
                "black",
            ),  # Grid within the table (not on the edges)
            ("LINEBELOW", (0, 0), (-1, 0), 2, "black"),  # Header line below
            (
                "INNERGRID",
                (0, 1),
                (-1, -1),
                1,
                "black",
            ),  # Grid for the rest of the table
        ]
    )

    new_table.setStyle(new_table_style)

    # Calculate header table height (previous table)
    _, header_height = table.wrapOn(c, width, height)

    # Positioning and drawing the new table below the header table
    new_tw, new_th = new_table.wrapOn(c, width, height - header_height - 2 * MARGIN)
    new_table.drawOn(c, MARGIN, height + MARGIN - header_height - new_th - 30)

    # Drawing the rounded border for the new table
    c.roundRect(
        MARGIN, height + MARGIN - header_height - new_th - 30, width, new_th, 10
    )

    c.showPage()
    c.save()

    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = "attachment; filename={}".format(fiche_title_pdf)
    pdf = buffer.getvalue()
    buffer.close()
    response.write(pdf)
    return response


def generate_qr_code(content, qr_size):
    qr_code = qr.QrCodeWidget(content)
    bounds = qr_code.getBounds()
    w = bounds[2] - bounds[0]
    h = bounds[3] - bounds[1]
    d = Drawing(qr_size, qr_size, transform=[qr_size / w, 0, 0, qr_size / h, 0, 0])
    d.add(qr_code)

    return d


def table_content(etapes, qr_size):
    liste_etapes = []
    for etape in etapes:
        groupe = ""
        if etape.groupe_machine:
            groupe = etape.groupe_machine.nom_groupe

        liste_etapes.append(
            [
                etape.num_etape,
                etape.plan,
                groupe,
                Paragraph(etape.description),
                etape.quantite,
                etape.temps,
                generate_qr_code(f"ET:{etape.num_etape}", qr_size),
            ]
        )

    return liste_etapes
