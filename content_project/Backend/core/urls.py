# core/urls.py
from django.contrib import admin
from django.urls import path, include

# --- ۱. ایمپورت کردن Viewهای Simple JWT ---
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # آدرس‌های API پروژه (که از projects/urls.py می‌آید و در اسکرین‌شات شما هست)
    path('api/v1/', include('projects.urls')),

    # --- ۲. اضافه کردن APIهای توکن (JWT) ---
    # (این‌ها در اسکرین‌شات شما جا افتاده‌اند)
    path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # --- ۳. اضافه کردن دکمه "Log in" برای DRF ---
    # (این دکمه را برای تست راحت در مرورگر اضافه می‌کنیم)
    path('api-auth/', include('rest_framework.urls')),
]