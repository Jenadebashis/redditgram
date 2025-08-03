import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')  # must be first

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

import core.routing  # safe now
from core.middleware import JWTAuthMiddlewareStack

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

django_asgi_app = get_asgi_application()

import core.routing

application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': JWTAuthMiddlewareStack(
        URLRouter(core.routing.websocket_urlpatterns)
    )
})
