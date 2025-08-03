import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')  # must be first

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

import core.routing  # safe now
from core.middleware import JWTAuthMiddlewareStack

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': JWTAuthMiddlewareStack(
        URLRouter(core.routing.websocket_urlpatterns)
    )
})
