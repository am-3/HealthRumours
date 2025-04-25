"""extension URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView,)
from myapp import views

urlpatterns = [
    path('admin/', admin.site.urls),
	# path('insertUser/', views.insertUser, name='insertUser'),
    # path('insertNews/', views.insertNews, name='insertNews'),
    # path('insertSocial/', views.insertSocial, name='insertSocial'),
    # path('insertFacebook/', views.insertFacebook, name='insertFacebook'),
    # path('insertDataWhatsapp/', views.insertWhatsappAndTelegram, name='insertWhatsappAndTelegram'),
    # path('insertDataTelegram/', views.insertWhatsappAndTelegram, name='insertWhatsappAndTelegram'),
    # path('check/', views.getData, name='getData'),
    # path('api/token/', views.TokenObtainView.as_view(), name='token_obtain'),
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
