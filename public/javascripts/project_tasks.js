
const taskList = document.querySelector('.task-list');
const newTaskForm = document.querySelector('.task-create-form');

let projectId;
const projectName = document.querySelector('h1').textContent;


const taskUrl = `/api/project/${projectName}/tasks`;
const projectUrl = "/api/projects";
const apiTimers = "/api/timers";



async function addNewTask(event){
  event.preventDefault();
  let taskName = event.target.closest('form').querySelector('.task-input').value;
  let url = `/api/project/${projectName}/${taskName}`
  fetch(url,{
    method: 'POST',
  })
  .then(res => res.json())
  .then(function(res){
    taskList.insertBefore(createTaskItem(res), taskList.childNodes[0])
  })
}
