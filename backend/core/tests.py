from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APIClient
from django.core.files.uploadedfile import SimpleUploadedFile

from .models import Post, Comment, Tag, Bookmark, Notification, Like, Follow


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

    def test_create_post_with_tags(self):
        url = reverse("posts")
        self.client.force_authenticate(user=self.user)
        data = {"caption": "tagged", "tag_names": ["t1", "t2"]}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        post = Post.objects.get(id=response.data["id"])
        self.assertEqual(post.tags.count(), 2)
        self.assertTrue(Tag.objects.filter(name="t1").exists())

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


class AdditionalViewsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="main", password="pass")
        self.user2 = User.objects.create_user(username="other", password="pass")
        self.client.force_authenticate(user=self.user)

        # create posts
        self.post1 = Post.objects.create(author=self.user, caption="p1")
        self.post2 = Post.objects.create(author=self.user2, caption="p2")
        Like.objects.create(post=self.post2, user=self.user)
        Like.objects.create(post=self.post2, user=self.user2)

        # tags
        self.tag1 = Tag.objects.create(name="django")
        self.tag1.posts.add(self.post1)
        Tag.objects.create(name="rest")

        # follow
        Follow.objects.create(follower=self.user, following=self.user2)

        # bookmark
        Bookmark.objects.create(user=self.user, post=self.post2)

        # notification
        Notification.objects.create(user=self.user, from_user=self.user2, notification_type="follow")

    def test_trending_posts(self):
        url = reverse("posts") + "?sort=trending"
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(resp.data["results"]), 1)
        # first post should be post2 with more likes
        self.assertEqual(resp.data["results"][0]["id"], self.post2.id)

    def test_tag_endpoints(self):
        resp = self.client.get(reverse("tag-list"))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        resp = self.client.get(reverse("tag-popular"))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_get_posts_by_tag(self):
        url = reverse("tag-posts", args=[self.tag1.name])
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data["results"]), 1)
        self.assertEqual(resp.data["results"][0]["id"], self.post1.id)

    def test_suggested_users(self):
        resp = self.client.get(reverse("user-suggested"))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_bookmark_list(self):
        resp = self.client.get(reverse("bookmarks"))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        resp = self.client.post(reverse("bookmarks"), {"post": self.post1.id})
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    def test_user_stats(self):
        resp = self.client.get(reverse("user-stats"))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("post_count", resp.data)

    def test_notifications(self):
        resp = self.client.get(reverse("notifications"))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_mark_notification_read(self):
        note = Notification.objects.filter(user=self.user).first()
        url = reverse("notification-detail", args=[note.id])
        resp = self.client.patch(url, {"is_read": True})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        note.refresh_from_db()
        self.assertTrue(note.is_read)

    def test_notification_list_unread_filter(self):
        Notification.objects.create(user=self.user, from_user=self.user2, notification_type="like", post=self.post1)
        note = Notification.objects.create(user=self.user, from_user=self.user2, notification_type="comment", post=self.post2)
        # mark one as read
        self.client.patch(reverse("notification-detail", args=[note.id]), {"is_read": True})
        resp = self.client.get(reverse("notifications") + "?unread=true")
        ids = [n["id"] for n in resp.data.get("results", resp.data)]
        self.assertNotIn(note.id, ids)

    def test_follow_creates_notification(self):
        user3 = User.objects.create_user(username="third", password="pass")
        url = reverse("follow-user", args=[user3.username])
        resp = self.client.post(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(
            Notification.objects.filter(
                user=user3,
                from_user=self.user,
                notification_type="follow",
            ).exists()
        )

    def test_mark_all_notifications_read_endpoint(self):
        Notification.objects.create(
            user=self.user,
            from_user=self.user2,
            notification_type="like",
            post=self.post2,
        )
        url = reverse("notifications-mark-all-read")
        resp = self.client.post(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        unread_exists = Notification.objects.filter(
            user=self.user, is_read=False
        ).exists()
        self.assertFalse(unread_exists)

    def test_clear_notifications_endpoint(self):
        Notification.objects.create(
            user=self.user,
            from_user=self.user2,
            notification_type="like",
            post=self.post2,
        )
        url = reverse("notifications-clear-all")
        resp = self.client.delete(url)
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        count = Notification.objects.filter(user=self.user).count()
        self.assertEqual(count, 0)


class FollowListsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username="u1", password="pass")
        self.user2 = User.objects.create_user(username="u2", password="pass")
        self.user3 = User.objects.create_user(username="u3", password="pass")
        Follow.objects.create(follower=self.user2, following=self.user1)
        Follow.objects.create(follower=self.user3, following=self.user1)
        Follow.objects.create(follower=self.user1, following=self.user2)

    def test_list_followers(self):
        url = reverse("user-followers", args=[self.user1.username])
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(set(resp.data["followers"]), {"u2", "u3"})

    def test_list_following(self):
        url = reverse("user-following", args=[self.user1.username])
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["following"], ["u2"]) 

    def test_list_invalid_user(self):
        url = reverse("user-followers", args=["nope"])
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

class SignalNotificationTestCase(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username="user1", password="pass")
        self.user2 = User.objects.create_user(username="user2", password="pass")

    def test_like_creates_notification(self):
        post = Post.objects.create(author=self.user2, caption="hi")
        Like.objects.create(post=post, user=self.user1)
        exists = Notification.objects.filter(
            user=self.user2,
            from_user=self.user1,
            notification_type="like",
            post=post,
        ).exists()
        self.assertTrue(exists)

    def test_comment_creates_notification(self):
        post = Post.objects.create(author=self.user2, caption="hi")
        Comment.objects.create(post=post, author=self.user1, text="hey")
        exists = Notification.objects.filter(
            user=self.user2,
            from_user=self.user1,
            notification_type="comment",
            post=post,
        ).exists()
        self.assertTrue(exists)

    def test_follow_creates_notification(self):
        Follow.objects.create(follower=self.user1, following=self.user2)
        exists = Notification.objects.filter(
            user=self.user2,
            from_user=self.user1,
            notification_type="follow",
        ).exists()
        self.assertTrue(exists)


class BookmarkAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="bookuser", password="pass")
        self.post = Post.objects.create(author=self.user, caption="book")
        self.client.force_authenticate(user=self.user)

    def test_create_and_delete_bookmark(self):
        create_url = reverse("bookmarks")
        resp = self.client.post(create_url, {"post": self.post.id})
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        bookmark_id = resp.data["id"]

        detail_url = reverse("bookmark-detail", args=[bookmark_id])
        resp = self.client.get(detail_url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # response should include serialized post data
        self.assertEqual(resp.data["post"]["id"], self.post.id)
        self.assertIn("caption", resp.data["post"])

        list_resp = self.client.get(create_url)
        self.assertEqual(list_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(list_resp.data["results"][0]["post"]["id"], self.post.id)

        resp = self.client.delete(detail_url)
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Bookmark.objects.filter(id=bookmark_id).exists())

    def test_cannot_delete_other_users_bookmark(self):
        bookmark = Bookmark.objects.create(user=self.user, post=self.post)
        other = User.objects.create_user(username="o", password="pass")
        self.client.force_authenticate(user=other)
        url = reverse("bookmark-detail", args=[bookmark.id])
        resp = self.client.delete(url)
        # should return 404 because queryset is filtered by user
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)
