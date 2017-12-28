from django.test import TestCase
from django.test.client import Client
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
# Create your tests here.


class JsonWebTokenTest(TestCase):

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

    def test_token_get_not_allowed(self):
        response = self.client.get(reverse('jwt-auth'))
        self.assertEqual(response.data.get('detail'), 'Method "GET" not allowed.')

    def test_get_jwt(self):
        '''
        Ensure that we can get a JSON Web Token
        '''
        url = reverse('jwt-auth')
        response = self.client.post(url, self.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, 'token')

    def test_get_jwt_invalid_cred(self):
        url = reverse('jwt-auth')
        response = self.client.post(url, {
            'username': 'obviously',
            'password': 'wrong'
        })

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_refresh_jwt_token(self):
        url = reverse('jwt-auth')
        response = self.client.post(url, self.data)
        token = response.data['token']

        data = {'token': token}

        refresh_url = reverse('jwt-auth-refresh')
        response = self.client.post(refresh_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
