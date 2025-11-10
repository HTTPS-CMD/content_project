# projects/views.py
from rest_framework import viewsets, permissions
from .models import Project, Scenario, CalendarEvent, WeeklyReport
from .serializers import (
    ProjectListSerializer, ProjectDetailSerializer,
    ScenarioSerializer, CalendarEventSerializer, WeeklyReportSerializer
)
from .models import Project


# --- مدیریت دسترسی‌های سفارشی (اصلاح شده) ---

class IsAdminUser(permissions.BasePermission):
    """
    دسترسی فقط برای ادمین‌ها یا سوپریوزرها
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        # ✅ اصلاح شد: حالا is_superuser را هم چک می‌کند
        return request.user.role == 'admin' or request.user.is_superuser


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    ادمین/سوپریوزر به همه چیز دسترسی دارد.
    مشتری فقط به پروژه خودش دسترسی دارد.
    """

    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False

        # ✅ اصلاح شد: حالا is_superuser را هم چک می‌کند
        if request.user.role == 'admin' or request.user.is_superuser:
            return True

        # این 'obj' خود پروژه است
        # (مطمئن می‌شویم که آبجکت از نوع پروژه است)
        if isinstance(obj, Project):
            return obj.client_user == request.user
        return False


# --- کلاس دسترسی جدید برای آیتم‌های تودرتو (اصلاح شده) ---

class IsParentProjectOwnerOrAdmin(permissions.BasePermission):
    """
    بررسی می‌کند که آیا کاربر، ادمین/سوپریوزر است
    یا مالک "پروژه والد" (Parent Project) این آیتم است.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        # ✅ اصلاح شد: ادمین یا سوپریوزر همیشه دسترسی دارد
        if request.user.role == 'admin' or request.user.is_superuser:
            return True

        # 'project_pk' از URL تودرتو خوانده می‌شود
        project_pk = view.kwargs.get('project_pk')
        if not project_pk:
            return False  # نباید اتفاق بیفتد

        try:
            project = Project.objects.get(pk=project_pk)
        except Project.DoesNotExist:
            return False  # پروژه‌ای وجود ندارد

        # مشتری فقط در صورتی دسترسی دارد که مالک پروژه والد باشد
        return project.client_user == request.user


# --- ViewSet اصلی پروژه (اصلاح شده) ---
class ProjectViewSet(viewsets.ModelViewSet):

    def get_queryset(self):
        """
        این متد مشخص می‌کند که کاربر چه پروژه‌هایی را می‌تواند ببیند.
        """
        user = self.request.user
        if not user.is_authenticated:
            return Project.objects.none()

        # ✅ اصلاح شد: حالا is_superuser را هم چک می‌کند
        if user.role == 'admin' or user.is_superuser:
            return Project.objects.all()  # ادمین/سوپریوزر همه پروژه‌ها را می‌بیند
        elif user.role == 'client':
            return Project.objects.filter(client_user=user)  # مشتری فقط پروژه خودش را می‌بیند
        return Project.objects.none()

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectDetailSerializer

    def get_permissions(self):
        """
        چه کسی می‌تواند چه کاری انجام دهد؟
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            # فقط ادمین/سوپریوزر می‌تواند بسازد، ویرایش کند یا حذف کند
            return [IsAdminUser()]

        # همه (ادمین/سوپریوزر و مشتری صاحب پروژه) می‌توانند ببینند
        return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]


# --- ViewSetهای تودرتو (بدون تغییر اما وابسته به کلاس‌های بالا) ---

class ScenarioViewSet(viewsets.ModelViewSet):
    """
    API برای تب ۳: سناریوها
    (وابسته به /projects/<project_pk>/scenarios/)
    """
    serializer_class = ScenarioSerializer
    permission_classes = [permissions.IsAuthenticated, IsParentProjectOwnerOrAdmin]

    def get_queryset(self):
        project_pk = self.kwargs.get('project_pk')
        return Scenario.objects.filter(project_id=project_pk)

    def perform_create(self, serializer):
        project = Project.objects.get(pk=self.kwargs.get('project_pk'))
        serializer.save(project=project)


class CalendarEventViewSet(viewsets.ModelViewSet):
    """
    API برای تب ۲: تقویم
    (وابسته به /projects/<project_pk>/calendar-events/)
    """
    serializer_class = CalendarEventSerializer
    permission_classes = [permissions.IsAuthenticated, IsParentProjectOwnerOrAdmin]

    def get_queryset(self):
        project_pk = self.kwargs.get('project_pk')
        return CalendarEvent.objects.filter(project_id=project_pk)

    def perform_create(self, serializer):
        project = Project.objects.get(pk=self.kwargs.get('project_pk'))
        serializer.save(project=project)


class WeeklyReportViewSet(viewsets.ModelViewSet):
    """
    API برای تب ۴: گزارشات هفتگی
    (وابسته به /projects/<project_pk>/weekly-reports/)
    """
    serializer_class = WeeklyReportSerializer
    permission_classes = [permissions.IsAuthenticated, IsParentProjectOwnerOrAdmin]

    def get_queryset(self):
        project_pk = self.kwargs.get('project_pk')
        return WeeklyReport.objects.filter(project_id=project_pk)

    def perform_create(self, serializer):
        project = Project.objects.get(pk=self.kwargs.get('project_pk'))
        serializer.save(project=project)