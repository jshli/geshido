
const taskList = document.querySelector('.task-list');
const newTaskForm = document.querySelector('.task-create-form');

const taskUrl = "/api/project/test/tasks";
const projectUrl = "/api/projects";
const apiTimers = "/api/timers";
const projectId = document.querySelector

const addNewTask = event => {
  event.preventDefault();
  let taskName = event.target.closest('form').querySelector('.task-input').value;
  let url = `/api/project/`
  fetch(url,{
    method: 'POST',
  })
  .then(res => res.json())
  .then(function(res){
    taskList.insertBefore(createTaskItem(res), taskList.childNodes[0])
  })
}
