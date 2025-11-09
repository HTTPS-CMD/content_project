# projects/views.py
from rest_framework import viewsets, permissions
from .models import Project, Scenario, CalendarEvent, WeeklyReport
from .serializers import (
    ProjectListSerializer, ProjectDetailSerializer,
    ScenarioSerializer, CalendarEventSerializer, WeeklyReportSerializer
)
# مدل Project را برای چک کردن مالکیت در permissionها ایمپورت می‌کنیم
from .models import Project


# --- مدیریت دسترسی‌های سفارشی (که قبلا نوشتیم) ---

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        # این 'obj' خود پروژه است
        return obj.client_user == request.user


# --- کلاس دسترسی جدید برای آیتم‌های تودرتو ---

class IsParentProjectOwnerOrAdmin(permissions.BasePermission):
    """
    بررسی می‌کند که آیا کاربر، ادمین است
    یا مالک "پروژه والد" (Parent Project) این آیتم است.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        # 'project_pk' از URL تودرتو خوانده می‌شود
        project_pk = view.kwargs.get('project_pk')
        if not project_pk:
            return False  # نباید اتفاق بیفتد

        try:
            project = Project.objects.get(pk=project_pk)
        except Project.DoesNotExist:
            return False  # پروژه‌ای وجود ندارد

        # ادمین به همه چیز دسترسی دارد
        if request.user.role == 'admin':
            return True

        # مشتری فقط در صورتی دسترسی دارد که مالک پروژه والد باشد
        return project.client_user == request.user


# --- ViewSet اصلی پروژه (که قبلا نوشتیم) ---
# ... (کد ProjectViewSet را دست نزنید) ...
class ProjectViewSet(viewsets.ModelViewSet):
    # (کد این بخش کامل است و نیازی به تغییر ندارد)
    # ...

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Project.objects.none()  # اضافه شد: اگر لاگین نکرده، هیچ‌چیز نبیند
        if user.role == 'admin':
            return Project.objects.all()
        elif user.role == 'client':
            return Project.objects.filter(client_user=user)
        return Project.objects.none()

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectDetailSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        # IsAuthenticated اطمینان می‌دهد که کاربر لاگین کرده
        return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]


# --- ViewSetهای تودرتو (جدید) ---

class ScenarioViewSet(viewsets.ModelViewSet):
    """
    API برای تب ۳: سناریوها
    (وابسته به /projects/<project_pk>/scenarios/)
    """
    serializer_class = ScenarioSerializer
    permission_classes = [permissions.IsAuthenticated, IsParentProjectOwnerOrAdmin]

    def get_queryset(self):
        # سناریوها را بر اساس project_pk که از URL می‌آید فیلتر می‌کند
        project_pk = self.kwargs.get('project_pk')
        return Scenario.objects.filter(project_id=project_pk)

    def perform_create(self, serializer):
        # هنگام ساخت سناریوی جدید، آن را به صورت خودکار به پروژه والد متصل می‌کند
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