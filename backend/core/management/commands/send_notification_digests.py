from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
from core.models import NotificationPreference, Notification

class Command(BaseCommand):
    help = 'Send email digests of unread notifications respecting user preferences.'

    def handle(self, *args, **options):
        for pref in NotificationPreference.objects.filter(email_digest=True):
            user = pref.user
            notifications = Notification.objects.filter(user=user, is_read=False)
            if not notifications.exists():
                continue
            lines = [
                f"{n.notification_type} from {n.from_user.username}"
                for n in notifications
            ]
            message = "\n".join(lines)
            send_mail(
                'Your notification digest',
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=True,
            )
            self.stdout.write(f'Sent digest to {user.username}')
