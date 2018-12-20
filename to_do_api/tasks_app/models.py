from django.db import models

# Create your models here.
class Category(models.Model):
	name = models.CharField(max_length=264, unique=True)

	def __repr__(self):
		return "<Category: {}>".format(self.name)

	def __str__(self):
		return "Category: {}".format(self.name)


class Task(models.Model):
	category = models.ForeignKey(Category, on_delete=models.CASCADE)
	description = models.TextField()
	date = models.DateField()
	is_completed = models.BooleanField(default=False)

	def __repr__(self):
		return "<Task: {}>".format(self.category.name)

	def __str__(self):
			return "Task: {}".format(self.category.name)
