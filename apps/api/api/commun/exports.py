import base64
from io import BytesIO

import qrcode
from django.http import FileResponse
from django.template.loader import render_to_string
from weasyprint import HTML


def generate_qr_code_base64(content):
    """
    Génère un QR code en base64 à partir d'un contenu

    :param content: contenu du QR code

    :return: QR code en base64
    """
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


def template_to_buffer(template_name, context):
    """
    Genère un buffer contenant un PDF à partir d'un template HTML

    :param template_name: nom du template à utiliser
    :param context: contexte à passer au template
    """

    # Créez un document HTML à partir du template
    html_string = render_to_string(template_name, context)

    # Générez le PDF
    buffer = BytesIO()
    HTML(string=html_string).write_pdf(target=buffer)
    return buffer


def buffer_to_response(buffer, filename):
    """
    Génère une réponse HTTP contenant un PDF à partir d'un buffer

    :param buffer: buffer contenant le PDF
    :param filename: nom du fichier à télécharger
    """
    buffer.seek(0)
    return FileResponse(
        buffer,
        as_attachment=True,
        filename=filename,
        content_type="application/pdf",
    )
