from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APIClient

from .models import Post


class PostAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", password="testpass"
        )

    def test_post_list_requires_authentication(self):
        url = reverse("posts")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_post_authenticated(self):
        url = reverse("posts")
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, {"caption": "hello"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Post.objects.filter(caption="hello").exists())


class RegisterViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_user(self):
        url = reverse("register")
        data = {
            "username": "newuser",
            "email": "new@example.com",
            "password": "pass1234",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="newuser").exists())

    def test_get_user_info_requires_auth(self):
        url = reverse("get_user_info")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_user_info_authenticated(self):
        user = User.objects.create_user(
            username="info_user", password="pass1234", email="i@ex.com"
        )
        self.client.force_authenticate(user=user)
        url = reverse("get_user_info")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "info_user")
