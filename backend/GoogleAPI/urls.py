from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test),
    path('authorize/', views.userAuthorization),
    path('oauth2callback/<int:id>/', views.oauth2Callback),
    path('revoke/', views.revoke),
    path('clear/', views.clear),
]
