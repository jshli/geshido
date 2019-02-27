
const taskList = document.querySelector('.task-list');
const newTaskForm = document.querySelector('.task-create-form');

const taskUrl = "/api/project/test/tasks";
const projectUrl = "/api/projects";
const apiTimers = "/api/timers";

const timerCurrentlyRunning = taskId => {
  fetch(apiTimers).then(res => res.json()).then(res => {
    res.filter(timer => timer.task_id == taskId).find(timer => timer.end_time.length < 1)
  })
}


const editShift = event => {
  if (event.target.classList.contains('task-item__details')){
      event.target.classList.toggle('task-item__details--shrink');
  }
};

const completeTask = event => {
  event.preventDefault();
  var options = {
    url: `/api/tasks`,
    data: {task_name: taskName},
    method: 'put' 
  }
  const updateDom = res => {
    event.target.closest('.task-item');
  }
  $.ajax(options).done(updateDom)
}

const createTaskItem = task => {
  var taskItem = document.createElement('div');
      taskItem.classList.add('task-item')
      taskItem.setAttribute('data-created', `${task.created_at}`)
      if (task.completed) {
        taskItem.classList.add('task-item--completed')
        taskItem.setAttribute('data-created', `${task.created_at}`)
        taskItem.setAttribute('data-completed', `true`)
      } else {
        taskItem.classList.add('task-item--uncomplete')
        taskItem.setAttribute('data-completed', `false`)
      }
      let taskItemWrapHtml = `
        <div class="task-item--wrap">
          <div class="task-edit__wrap">
            <form class="task-edit--btn btn--delete" action="/tasks/${task.id}>" method="post">
              <input type="hidden" name="_method" value="delete">
              <button class='edit-btn icn-btn'><i class="fas fa-trash-alt"></i></button>
            </form>
            <form class="task-edit--btn btn--edit" action="" method="post">
              <input type="hidden" name="_method" value="put">
              <button class='edit-btn icn-btn'><i class="fas fa-pen"></i></button>
            </form>
          </div>
          <div class="task-item__details">
            <div class="task-item__header-wrap">
              <p>Web Development</p>
              <h4>${task.task_name}</h3>
            </div>
            ${timerCurrentlyRunning(task.id) !== undefined ? `
              <form class="timer-form" action="/${task.id}/stop-timer" method="post">
                <p class="timer"><%=time_conversion((TimeDifference.between(get_current_timer(task[:id]),@current_time).in_minutes).round)%></p>
                <input type="hidden" name="_method" value="put">
                <input type="hidden" name="">
                <button class="icn-btn btn--stop"><i class="far fa-clock"></i></button>
              </form>
              ` 
              : 
              `<form action="/${task.task_id}/start-timer" method="post">
                <input type="hidden" name="">
                <button class="icn-btn"><i class="far fa-clock"></i></button>
              </form>
          `
            }
          </div>
        </div>
      `
      const taskItemWrap = document.createElement('div');
      taskItem.addEventListener('click', editShift)
      taskItemWrap.innerHTML = taskItemWrapHtml;
      const checkFormHtml = `
          <input type="hidden" name="_method" value="put">
          <button class="check ${task.completed ? 'check--completed' : null}"></button>
        `
      const checkForm = document.createElement('form');
      checkForm.innerHTML = checkFormHtml;
      checkForm.classList.add('task-item__check');
      checkForm.setAttribute('action',`/task/${task.id}/${task.completed ? 'uncomplete':'complete'}`)
      checkForm.setAttribute('method', "post");
      checkForm.addEventListener('submit', completeTask)
      taskItem.appendChild(checkForm);
      taskItem.appendChild(taskItemWrap);
      return taskItem;
}


let allTasks = new Array

fetch(taskUrl).then(res => res.json()).then(res => {
  res.forEach(task => {
      allTasks.push(task)
  })
}).then(function (){
  allTasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  allTasks.forEach(function(task) {
    taskList.appendChild(createTaskItem(task))
  })
});

const addNewTask = event => {
  event.preventDefault();
  let taskName = event.target.closest('form').querySelector('.task-input').value;
  let data = {"task_name": taskName};
  let url = `/api/tasks`
  fetch(url,{
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(res => console.log(typeof data))
  .then(function(res){
    console.log(res)
    taskList.insertBefore(createTaskItem(res), taskList.childNodes[0])
  })
}



newTaskForm.addEventListener('submit', addNewTask)
