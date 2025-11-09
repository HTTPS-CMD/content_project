# projects/urls.py
from django.urls import path, include
# از پکیج جدید ایمپورت می‌کنیم
from rest_framework_nested import routers
from .views import (
    ProjectViewSet, ScenarioViewSet,
    CalendarEventViewSet, WeeklyReportViewSet
)

# 1. روتر اصلی (Parent) برای پروژه‌ها
router = routers.DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
# این /api/v1/projects/ را می‌سازد

# 2. روتر تودرتو (Nested) برای آیتم‌های وابسته به پروژه
# پارامتر اول: روتر والد
# پارامتر دوم: آدرس والد (projects)
# پارامتر سوم: نامی که در URL برای project_pk استفاده می‌شود (project)
projects_router = routers.NestedDefaultRouter(router, r'projects', lookup='project')

# 3. ثبت ViewSetهای تودرتو در روتر جدید
projects_router.register(r'scenarios', ScenarioViewSet, basename='project-scenarios')
# این /api/v1/projects/<project_pk>/scenarios/ را می‌سازد

projects_router.register(r'calendar-events', CalendarEventViewSet, basename='project-calendar-events')
# این /api/v1/projects/<project_pk>/calendar-events/ را می‌سازد

projects_router.register(r'weekly-reports', WeeklyReportViewSet, basename='project-weekly-reports')
# این /api/v1/projects/<project_pk>/weekly-reports/ را می‌سازد


urlpatterns = [
    path('', include(router.urls)),        # شامل URLهای اصلی (projects)
    path('', include(projects_router.urls)), # شامل URLهای تودرتو
]