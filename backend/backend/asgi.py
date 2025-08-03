import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")  # must be first

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from core.middleware import JWTAuthMiddlewareStack

# force Django setup by calling this first
http_app = get_asgi_application()

# now it's safe to import modules that touch models/auth
def get_websocket_app():
    import core.routing  # deferred until after Django is initialized
    return JWTAuthMiddlewareStack(
        URLRouter(core.routing.websocket_urlpatterns)
    )

application = ProtocolTypeRouter({
    "http": http_app,
    "websocket": get_websocket_app(),
})
