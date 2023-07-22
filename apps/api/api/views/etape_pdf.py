#
# from django.http import HttpResponse
# from django.views.generic import View
#
# # importing get_template from loader
# from django.template.loader import get_template
#
# # import render_to_pdf from util.py
# from ..utils import render_to_pdf
#
#
# # Creating our view, it is a class based view
# class GenererEtapesPdf(View):
#     def get(self, request, *args, **kwargs):
#         # getting the template
#         pdf = render_to_pdf('pdf/html/etape.html')
#
#         # rendering the template
#         return HttpResponse(pdf, content_type='application/pdf')
