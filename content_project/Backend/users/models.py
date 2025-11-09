# users/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    # تعریف رول‌ها (نقش‌ها)
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('client', 'Client'),
    )

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='client')
    full_name = models.CharField(max_length=255, blank=True)

    # می‌توان فیلدهای دیگری مثل شماره تلفن و... هم اضافه کرد

    def __str__(self):
        return self.username