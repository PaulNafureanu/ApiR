from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.mail import send_mail, mail_admins, BadHeaderError

# Create your views here.


@api_view()
def userAuthorization(request):
    try:
        send_mail('Subject', "Our message", 'info@apir.com',
                  ['paul.nafureanu@gmail.com'])
    except BadHeaderError:
        pass
    return Response("MAIL SENT")
