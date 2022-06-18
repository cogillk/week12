class Task {
    constructor(name, dueDate) {
        this.name = name;
        this.dueDate = dueDate;
    }
}

class TaskService {  
    static url = 'https://crudcrud.com/api/6074007f17bd4ff9a00f0b3ed06fe184/tasks';

    static getAllTasks() {
        return $.get(this.url);
    }

    static getTask(id) {
        //return $.get(this.url + `/${id}`);
        return $.ajax({
            url: this.url + `/${id}`,
            dataType: 'json',
            data: JSON.stringify(task),  
            contentType: 'application/json',
            type: 'GET'
        });
    }

    static createTask(task) {  
        return $.ajax({
            url: this.url,
            dataType: 'json',
            data: JSON.stringify(task),  
            contentType: 'application/json',
            type: 'POST'
        }); 
    }

    static updateTask(task, id) { 
        return $.ajax({
            url: this.url + `/${id}`,
            dataType: 'json',
            data: JSON.stringify(task),  
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteTask(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        })
    }
}

class DOMManager {
    static tasks;

    static getAllTasks() {
        TaskService.getAllTasks().then(tasks => this.render(tasks));
    }

    static createTask(name, dueDate) {
        TaskService.createTask(new Task(name, dueDate))
            .then(() => {
                return TaskService.getAllTasks();
            })
            .then((tasks) => this.render(tasks));
    }

    static updateTask(name, dueDate, id) {
        TaskService.updateTask(new Task(name, dueDate), id)
            .then(() => {
                return TaskService.getAllTasks();
            })
            .then((tasks) => this.render(tasks));
    }

    static deleteTask(id) {
        TaskService.deleteTask(id)
            .then(() => {
                return TaskService.getAllTasks();
            })
            .then((tasks) => this.render(tasks));
    }



    static render(tasks) {
        this.tasks = tasks;
        $('#app').empty();
        for (let task of tasks) {
            $('#app').prepend(
            `<div id="${task._id}" class="card">
                <div class="card-header">
                    <div class="container">
                        <div class="row">
                            <div class="col-sm">
                                <input type="text" name="name" id="task-name-${task._id}" class="form-control" value="${task.name}" placeholder="Enter Task Name"> 
                            </div>
                            <div class="col-sm">
                                <input type="date" name="date" id="task-date-${task._id}" class="form-control" value="${task.dueDate}" placeholder="Enter Due Date"> 
                            </div>
                        </div>
                    </div> <br>
                    <div class="row">
                        <div class="col-sm">
                            <button class="btn btn-danger delete-task" data-target="${task._id}">Delete</button>
                        </div>
                        <div class="col-sm">
                            <button class="btn btn-primary edit-task float-right" data-target="${task._id}">Update</button>
                        </div>
                    </div>
                </div>
            </div><br>`
            );
        }
    }
}

$('body').on('click', '.edit-task', function (e) {
    //alert($('#new-task-name').val());
    e.preventDefault();
    const id = $(this).attr('data-target');
    DOMManager.updateTask($('#task-name-'+id).val(),$('#task-date-'+id).val(), id);
}); 



$('body').on('click', '.delete-task', function (e) {
    //e.preventDefault();
    //alert($(this).attr('data-target'));
    DOMManager.deleteTask($(this).attr('data-target'));
});

$('#new-task-form').on('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    DOMManager.createTask($('#new-task-name').val(),$('#new-task-date').val() );
    $('#new-task-name').val('');
    $('#new-task-date').val('');
});

DOMManager.getAllTasks();