# projects/serializers.py
from rest_framework import serializers
from .models import Project, Scenario, CalendarEvent, WeeklyReport

# سریالایزر ساده برای نمایش در لیست‌ها (فقط اطلاعات ضروری)
class ProjectListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['project_id', 'project_name', 'start_date', 'end_date', 'page_username']

# سریالایزر کامل برای نمایش جزییات (تمام اطلاعات تب ۱ و تب ۵)
class ProjectDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__' # تمام فیلدهای مدل Project را شامل شود

# --- سریالایزرهای مدل‌های وابسته ---

class ScenarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scenario
        fields = '__all__'
        read_only_fields = ['project'] # فیلد پروژه نباید مستقیما توسط کاربر ارسال شود

class CalendarEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarEvent
        fields = '__all__'
        read_only_fields = ['project']

class WeeklyReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyReport
        fields = '__all__'
        read_only_fields = ['project']