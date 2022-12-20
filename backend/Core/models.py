from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.


class User(AbstractUser):
    email = models.EmailField(unique=True)
    token = models.TextField(blank=True)
    refresh_token = models.TextField(blank=True)
    token_uri = models.TextField(blank=True)
    client_id = models.TextField(blank=True)
    client_secret = models.TextField(blank=True)
    scopes = models.TextField(blank=True)
