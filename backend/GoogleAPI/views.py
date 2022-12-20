import os
from django.shortcuts import redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient import discovery
from .utils import Utils


# Create your views here.
# Only in local debug - delete in production and set https
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

CLIENT_FILE_PATH = 'GoogleAPI/credentials/credentials.json'
SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly']
REDIRECT_URI_BASE = 'http://127.0.0.1:8000/GoogleAPI/'
API_SERVICE_NAME = 'drive'
API_VERSION = 'v3'

STATE = None


@api_view()
def test(request):
    try:
        # get the user credentials from db if not prompt the user to authorization
        userDbCredentials = {'': ''}

        # if you have them, do something with them
        userCredentials = Credentials(**userDbCredentials)

        drive = discovery.build(
            API_SERVICE_NAME, API_VERSION, credentials=userCredentials)

        # save credentials in case access token refreshed
        return Response("Test done successfully")

    except:
        return Response("Something went wrong")


@api_view()
def userAuthorization(request):
    flow = Flow.from_client_secrets_file(
        CLIENT_FILE_PATH, scopes=SCOPES)

    flow.redirect_uri = REDIRECT_URI_BASE + 'callback/'

    authorization_url, state = flow.authorization_url(
        access_type='offline', include_granted_scopes='true')

    STATE = state

    return redirect(authorization_url)


@api_view()
def oauth2Callback(request):

    flow = Flow.from_client_secrets_file(
        CLIENT_FILE_PATH, scopes=SCOPES, state=STATE)

    flow.redirect_uri = 'http://127.0.0.1:8000/GoogleAPI/callback/'

    flow.fetch_token(authorization_response=request.get_full_path())

    credentials = flow.credentials

    return Response(Utils.credentials_to_dict(credentials))


@api_view()
def revoke(request):
    return Response("Revoked")


@api_view()
def clear(request):
    return Response("Cleared")
