from django.urls import path
from . import views

app_name = 'tasks_app'


urlpatterns = [
	path('', views.index, name='index'),
	path('add_task/', views.add_task, name='add_task'),
	path('get_tasks/', views.get_tasks, name='get_tasks'),
	path('remove_completed/', views.remove_completed, name='remove_completed'),
	path('change_completed/<int:task_id>/', views.change_completed, name='change_completed'),
	path('get_completed/', views.get_completed, name='get_completed'),
	path('get_not_completed/', views.get_not_completed, name='get_not_completed'),
	

]