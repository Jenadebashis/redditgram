from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APIClient
from django.core.files.uploadedfile import SimpleUploadedFile

from .models import Post, Comment


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

    def test_retrieve_post_authenticated(self):
        post = Post.objects.create(author=self.user, caption="hello")
        url = reverse("post-detail", args=[post.id])
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], post.id)

    def test_update_post_only_author(self):
        post = Post.objects.create(author=self.user, caption="hello")
        url = reverse("post-detail", args=[post.id])
        other = User.objects.create_user(username="other", password="pass")

        self.client.force_authenticate(user=other)
        resp = self.client.patch(url, {"caption": "no"})
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.user)
        resp = self.client.patch(url, {"caption": "updated"})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        post.refresh_from_db()
        self.assertEqual(post.caption, "updated")

    def test_delete_post_only_author(self):
        post = Post.objects.create(author=self.user, caption="bye")
        url = reverse("post-detail", args=[post.id])
        other = User.objects.create_user(username="other2", password="pass")

        self.client.force_authenticate(user=other)
        resp = self.client.delete(url)
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Post.objects.filter(id=post.id).exists())

        self.client.force_authenticate(user=self.user)
        resp = self.client.delete(url)
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Post.objects.filter(id=post.id).exists())


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


class AvatarUploadTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="ava", password="pass123")
        self.client.force_authenticate(user=self.user)

    def test_update_avatar(self):
        url = reverse("update_avatar")
        img = SimpleUploadedFile("avatar.png", b"dummy", content_type="image/png")
        response = self.client.put(url, {"avatar": img}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("avatar_url", response.data)
        
class CommentAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="cuser", password="pass")
        self.post = Post.objects.create(author=self.user, caption="hello")
        self.comment = Comment.objects.create(post=self.post, author=self.user, text="hi")

    def test_update_comment_only_author(self):
        url = reverse("comment-detail", args=[self.comment.id])
        other = User.objects.create_user(username="other", password="pass")
        self.client.force_authenticate(user=other)
        resp = self.client.patch(url, {"text": "no"})
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.user)
        resp = self.client.patch(url, {"text": "updated"})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.comment.refresh_from_db()
        self.assertEqual(self.comment.text, "updated")

    def test_delete_comment_only_author(self):
        url = reverse("comment-detail", args=[self.comment.id])
        other = User.objects.create_user(username="other2", password="pass")
        self.client.force_authenticate(user=other)
        resp = self.client.delete(url)
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Comment.objects.filter(id=self.comment.id).exists())

        self.client.force_authenticate(user=self.user)
        resp = self.client.delete(url)
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Comment.objects.filter(id=self.comment.id).exists())
