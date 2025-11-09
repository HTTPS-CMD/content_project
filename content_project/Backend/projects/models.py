# projects/models.py
from django.db import models
from django.conf import settings  # برای دسترسی به AUTH_USER_MODEL


# جدول ۲: Projects (اطلاعات تب ۱ و تب ۵)
class Project(models.Model):
    # ارتباط با مشتری (از جدول کاربران)
    client_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,  # اگر مشتری حذف شد، پروژه‌هایش هم حذف شوند
        related_name='projects',
        limit_choices_to={'role': 'client'}  # فقط کاربرانی که نقش 'client' دارند
    )
    project_name = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()

    # اطلاعات تب ۱
    page_username = models.CharField(max_length=100)
    page_password_encrypted = models.CharField(max_length=255)  # نکته: در API این را رمزنگاری می‌کنیم
    page_logo_url = models.URLField(blank=True, null=True)
    page_slogan = models.CharField(max_length=255, blank=True)
    page_bio = models.TextField(blank=True)
    cover_post_asset_url = models.URLField(blank=True, null=True)
    cover_highlight_asset_url = models.URLField(blank=True, null=True)
    monthly_post_goal = models.PositiveIntegerField(default=12)

    # اطلاعات تب ۵ (گزارش ماهانه)
    monthly_report_text = models.TextField(blank=True)

    def __str__(self):
        return self.project_name


# جدول ۳: Scenarios (تب ۳)
class Scenario(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='scenarios')
    title = models.CharField(max_length=255)
    summary = models.CharField(max_length=500, blank=True)
    full_scenario_text = models.TextField(blank=True)
    style = models.CharField(max_length=100, blank=True)
    goal = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=50, default='idea')  # مثلا: idea, approved, filmed, posted

    def __str__(self):
        return f"{self.project.project_name} - {self.title}"


# جدول ۴: CalendarEvents (تب ۲)
class CalendarEvent(models.Model):
    EVENT_TYPES = (
        ('filming', 'آفیش فیلمبرداری'),
        ('post', 'تاریخ انتشار پست'),
    )
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='calendar_events')
    event_date = models.DateTimeField()
    event_type = models.CharField(max_length=10, choices=EVENT_TYPES)
    title = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.project.project_name} - {self.get_event_type_display()} on {self.event_date}"


# جدول ۵: WeeklyReports (تب ۴)
class WeeklyReport(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='weekly_reports')
    week_number = models.PositiveIntegerField()  # هفته ۱، ۲، ۳، ۴ یا ۵
    report_text = models.TextField(blank=True)

    class Meta:
        unique_together = ('project', 'week_number')  # هر پروژه در هر هفته فقط یک گزارش دارد

    def __str__(self):
        return f"{self.project.project_name} - Week {self.week_number}"