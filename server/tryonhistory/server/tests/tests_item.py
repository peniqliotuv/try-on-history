from django.test import TestCase
from django.test.client import Client
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status

class ItemTest(TestCase):

    def setUp(self):
        self.username = 'username123'
        self.email = 'test123@test.com'
        self.password = 'password123'

        self.user = User.objects.create_user(
            self.username,
            self.email,
            self.password
        )

        self.data = {
            'username': self.username,
            'password': self.password
        }

        self.client = Client()

    def test(self):
        self.assertEqual(True, True)
