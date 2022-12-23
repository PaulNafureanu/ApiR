import os
import requests
from django.shortcuts import redirect
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.request import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient import discovery
from .utils import Utils
from Core.models import User
from djoser.serializers import UserSerializer


# Create your views here.
# Only in local debug - delete in production and set https
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

CLIENT_FILE_PATH = 'GoogleAPI/credentials/credentials.json'
SCOPES = ['https://www.googleapis.com/auth/drive.file']
REDIRECT_CLIENT_URI_BASE = 'http://localhost:3000/'
REDIRECT_URI_BASE = 'http://127.0.0.1:8000/GoogleAPI/'
API_SERVICE_NAME = 'drive'
API_VERSION = 'v3'


@api_view()
def test(request: Request):
    if (request.user.is_authenticated):
        user = User.objects.get(id=request.user.id)
        userDbCredentials = Utils.credentials_to_dict(user)
        credsAreEmpty = Utils.credentials_are_empty(userDbCredentials)

        if (credsAreEmpty):
            return redirect(REDIRECT_URI_BASE + 'authorize/')

        else:
            try:
                userCredentials = Credentials(**userDbCredentials)
                drive = discovery.build(
                    API_SERVICE_NAME, API_VERSION, credentials=userCredentials)
                # acees somethig from drive

                user.token = userCredentials.token
                user.refresh_token = userCredentials.refresh_token
                user.token_uri = userCredentials.token_uri
                user.client_id = userCredentials.client_id
                user.client_secret = userCredentials.client_secret
                user.scopes = Utils.list_to_string(userCredentials.scopes)
                user.save()

                return Response("Test done successfully")

            except:
                return Response("Something went wrong")

    else:
        return Response({"data": "Authentication credentials were not provided."})


@api_view()
def userAuthorization(request: Request):
    if (request.user.is_authenticated):
        flow = Flow.from_client_secrets_file(
            CLIENT_FILE_PATH, scopes=SCOPES)

        flow.redirect_uri = REDIRECT_URI_BASE + \
            'oauth2callback/' + str(request.user.id) + '/'

        authorization_url, state = flow.authorization_url(
            access_type='offline', include_granted_scopes='true')

        user = User.objects.get(id=request.user.id)
        user.state = state
        user.save()
        # authorization_url like:
        # "https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=511154618463-kj05oholr9g7k8kl9nh823d6ac5a9obf.apps.googleusercontent.com&redirect_uri=http%3A%2F%2F127.0.0.1%3A8000%2FGoogleAPI%2Foauth2callback%2F1%2F&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.file&state=IRbRiRcW0k87IleYzEeoPimrl3kYA7&access_type=offline&include_granted_scopes=true"

        # return Response(authorization_url)
        return Response({'data': authorization_url})

    else:
        return Response({"data": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)


@api_view()
def oauth2Callback(request: Request, id: int):
    try:

        user = User.objects.get(id=id)

        flow = Flow.from_client_secrets_file(
            CLIENT_FILE_PATH, scopes=SCOPES, state=user.state)

        flow.redirect_uri = REDIRECT_URI_BASE + \
            'oauth2callback/' + str(id) + '/'

        # request.get_full_path() like:
        # "/GoogleAPI/oauth2callback/1/?state=LCI7u9AptRfxKvr9qYA2ucU3OUcCWD&code=4/0AWgavdeO9Ztf-EHM4qsB9_9aDItKcvrqMvdoDjZsfvuaHBxd1zq2hKXfVZWqOXz-52icDw&scope=https://www.googleapis.com/auth/drive.file"
        # return Response(request.get_full_path())

        flow.fetch_token(authorization_response=request.get_full_path())

        user.token = flow.credentials.token
        user.refresh_token = flow.credentials.refresh_token
        user.token_uri = flow.credentials.token_uri
        user.client_id = flow.credentials.client_id
        user.client_secret = flow.credentials.client_secret
        user.scopes = Utils.list_to_string(flow.credentials.scopes)
        user.save()

    # Should be changed based on the final implementation
        # return Response({'data': 'Google authorization to the Drive finalized successfully'})
        return redirect(REDIRECT_CLIENT_URI_BASE + 'exit/')

    except:
        return Response({"data": "An error has occured on Google authorization, please retry to log in later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view()
def revoke(request: Request):

    if (request.user.is_authenticated):
        user = User.objects.get(id=request.user.id)
        userDbCredentials = Utils.credentials_to_dict(user)
        credsAreEmpty = Utils.credentials_are_empty(userDbCredentials)

        if (credsAreEmpty):
            return Response({"data": "You need to authorize first before revoking your credentials."})

        else:

            userCredentials = Credentials(**userDbCredentials)
            revoke = requests.post('https://oauth2.googleapis.com/revoke',
                                   params={'token': userCredentials.token},
                                   headers={'content-type': 'application/x-www-form-urlencoded'})

            if (revoke.status_code == 200):
                return Response({"data": "Credentials successfully revoked."}, status=revoke.status_code)
            else:
                return Response({'data': 'An error occurred.'}, status=revoke.status_code)

    else:
        return Response({"data": "Authentication credentials were not provided."})


@api_view()
def clear(request: Request):

    if (request.user.is_authenticated):
        user = User.objects.get(id=request.user.id)
        user.token = ""
        user.refresh_token = ""
        user.token_uri = ""
        user.client_id = ""
        user.client_secret = ""
        user.scopes = ""
        user.state = ""
        user.save()
        return Response({"data": "User credentials have been cleared"})

    else:
        return Response({"data": "Authentication credentials were not provided."})
