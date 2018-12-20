$(document).ready(function() {
	ajax_get('/tasks_app/get_tasks/');
	$(document).ajaxStart(function(){
		$('#loader').css("display", "block");

		console.log('loading happening');
	});
	$(document).ajaxComplete(function(){
		$('#loader').css("display", "none");
		console.log('loading finished');
	});

});

function htmlEncode(s)
{
  var el = document.createElement("div");
  el.innerText = el.textContent = s;
  s = el.innerHTML;
  return s;
}


var Tasks = {
	tasks: [],
	domElement: null,
	add: function (task) {
		this.tasks.push(task);
		this.render();
	},
	remove: function (index) {
		this.tasks.splice(index, 1);
	},
	removeCompleted: function() {
		this.tasks = this.tasks.filter(function(task) {
			return (!task.isCompleted);
		});
		this.render();
	},
	findById: function (id) {
		for (var i = 0; i < this.tasks.length; i++) {
			this.tasks[i]
			if (this.tasks[i].id == id){
				return this.tasks[i]
			}
		}
		return null
	},
	setDomElement: function(element) {
		this.domElement = element;
	},
	render: function () {
		this.domElement.empty();
		for(var i = 0; i < this.tasks.length; i++) {
			var task = this.tasks[i];
			var liClass = "task cat-" + task.category;
			var cbChecked = "";
			if(task.isCompleted) {
				liClass += " completed";
				cbChecked = "checked";
			}
			this.domElement.append(
				'<li class="' + liClass + '" data-task="' + task.id + '">'
				+ '<label><input type="checkbox" class="is-completed" '
				+ cbChecked + '>'
				+ '<span class="description">' + task.description + ' ' + task.date
				+ '</span></label'
				+ '</li>'
			);
		}
	}
};

(function setupEvents() {
	Tasks.setDomElement($('#tasks ul'));
	function addNewTask() {
		var description = $('#txtNewTask').val();
		var category = $('#ddCategory').val();
		if(description.trim() == "") {
			alert("You must enter text");
			return;
		}
		$('#txtNewTask').val('');
		
		
		$.ajax({
			url: '/tasks_app/add_task/',
			type: 'POST',
			data: {
				description: description,
				category: category,
				date: new Date().toJSON().slice(0,10),
				isCompleted: false
			},
			success: function(json) {
				task = {
					id: json.task.id,
					description: htmlEncode(json.task.description),
					category: json.task.category,
					date: json.task.date,
					isCompleted: json.task.is_completed
				};

				Tasks.add(task);
				Tasks.render();
				console.log('success');
			},
			error: function (xhr, errmsg, err) {
				console.log(errmsg, err);
				console.log("error by N");
			},
		});
	};
	$(document).on("click", "#tasks .is-completed", function() {
		var taskId = $(this).closest('li').data('task');
		console.log(taskId);
		$.ajax({
			url: '/tasks_app/change_completed/'+ taskId + '/',
			type: 'POST',
			success: function(json) {
				var task = Tasks.findById(taskId);
				task.isCompleted = !task.isCompleted;
				Tasks.render();
				console.log('success');
			},
			error: function (xhr, errmsg, err) {
				console.log(errmsg, err);
				console.log("error by N");
			},
		});
	});
	// Press <Enter> on the text field
	$('#txtNewTask').on('keypress', function(event) {
		if(event.which == 13) {
			event.preventDefault();
			addNewTask();
		}
	});
	// Focus the text input after selecting a category
	$('#ddCategory').on('change', function() {
		$('#txtNewTask').focus();
	});
	$('#btnAddTask').on('click', function() {
		$('#btnAddTask').prop('disabled', true);
		addNewTask();
		$('#txtNewTask').focus();
		$('#btnAddTask').prop('disabled', false);
	});
	$('#btnRemoveCompleted').on('click', function() {
		$.ajax({
			url: '/tasks_app/remove_completed/',
			type: 'POST',
			success: function(json) {
				Tasks.removeCompleted();
				Tasks.render();
				alert('Thanks you the completed tasks have been removed');
				console.log('success');
			},
			error: function (xhr, errmsg, err) {
				console.log(errmsg, err);
				console.log("error by N");
			},
		});
	});
	$('#btnShowCompleted').on('click', function() {
		ajax_get('/tasks_app/get_completed/');
	});
	$('#btnShowNotCompleted').on('click', function() {
		ajax_get('/tasks_app/get_not_completed/');
	});
	$('#btnShowAll').on('click', function() {
		ajax_get('/tasks_app/get_tasks/');
	});

})();





// This function is fix nothing to modify yet ...
function ajax_get(url){
	$.ajax({
		url: url,
		type: 'GET',
		success: function(json) {
			Tasks.tasks = []
			for (var i = 0; i < json.tasks.length; i++) {
				task = {
					id: json.tasks[i].id,
					description: json.tasks[i].description,
					category: json.tasks[i].category,
					date: json.tasks[i].date,
					isCompleted: json.tasks[i].is_completed
				};
				Tasks.add(task);
			};

			Tasks.render();
			console.log('success');
		},
		error: function (xhr, errmsg, err) {
			console.log(errmsg, err);
			console.log("error by N");
		},		
	});
}




$(function() {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    function csrfSafeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    function sameOrigin(url) {
        var host = document.location.host;
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
});
