from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from tasks_app.models import  Category, Task
from datetime import datetime
import json

def get_response_data(tasks):
	response_data = {
		'result': 'success',
		'tasks': []
	}

	for task in tasks:
		task_to_append = {
			'id': task.id,
			'description': task.description,
			'category': task.category.name,
			'date': task.date.strftime('%b-%d-%y'),
			'is_completed': task.is_completed
		}

		response_data['tasks'].append(task_to_append)

	return response_data


def get_response_data_completed():
	tasks_completed = Task.objects.filter(is_completed=True)
	response_data = {
		'result': 'success',
		'tasks': []
	}

	for task in tasks_completed:
		task_to_append = {
			'id': task.id,
			'description': task.description,
			'category': task.category.name,
			'date': task.date.strftime('%b-%d-%y'),
			'is_completed': task.is_completed
		}

		response_data['tasks'].append(task_to_append)

	return response_data

# Create your views here.
def index(request):
	return render(request, 'to_do_list.html')


def add_task(request):
	if request.method == 'POST':
		description = request.POST.get('description')

		category = Category.objects.get_or_create(name=request.POST.get('category'))[0]

		date = request.POST.get('date')
		is_completed = request.POST.get('is_completed')
		task = Task(description=description ,category=category ,date=date ,is_completed=False)
		task.save()
		response_data = {
			'result': 'succes',
			'task': {
				'id': task.id,
				'description': task.description,
				'category': task.category.name,
				'date': task.date,
				'is_completed': task.is_completed
			}
		}

		return HttpResponse(json.dumps(response_data), content_type='application/json/')
	else:
		error = {'error': 'None POST method allowed'}
		return HttpResponse(error)


def get_tasks(request):
	if request.method == 'GET':
		all_tasks = Task.objects.all()
		# print(response_data)
		return HttpResponse(json.dumps(get_response_data(all_tasks)), content_type='application/json/')


def remove_completed(request):
	if request.method == 'POST':
		tasks_delete = Task.objects.filter(is_completed=True).delete()
		all_tasks = Task.objects.all()
		# print(response_data)
		return HttpResponse(json.dumps(get_response_data(all_tasks)), content_type='application/json/')


def change_completed(request, task_id):
	if request.method == 'POST':
		task = Task.objects.get(id=task_id)
		task.is_completed = not task.is_completed
		task.save()
		all_tasks = Task.objects.all()

		return HttpResponse(json.dumps(get_response_data(all_tasks)), content_type='application/json/')


def get_completed(request):
	if request.method == 'GET':
		tasks_completed = Task.objects.filter(is_completed=True)

		return HttpResponse(json.dumps(get_response_data(tasks_completed)), content_type='application/json/')


def get_not_completed(request):
	if request.method == 'GET':
		tasks_not_completed = Task.objects.filter(is_completed=False)

		return HttpResponse(json.dumps(get_response_data(tasks_not_completed)), content_type='application/json/')





