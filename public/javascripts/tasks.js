
const taskList = document.querySelector('.task-list');
const newTaskForm = document.querySelector('.task-create-form');

const taskUrl = "/api/tasks";
const projectUrl = "/api/projects";


const editShift = event => {
  if (event.target.classList.contains('task-item__details')){
      event.target.classList.toggle('task-item__details--shrink');
  }
};

const completeTask = event => {
  event.preventDefault();
  let taskId = event.target.closest('form').attributes.action.value.split("/")[2];
  let url = `/task/${taskId}/complete`;
  const updateDom = event => {
    event.target.closest('.task-item').classList.add('task-item--completed');
    event.target.querySelector('button').classList.add('check--completed')
    event.target.closest('form').attributes.action.value = `/task/${taskId}/uncomplete`;
    event.target.removeEventListener("submit", completeTask);
    event.target.addEventListener('submit', uncompleteTask)
  }
  fetch(url,{
    method: 'PUT',
  })
  .then(function(){
    updateDom(event);
  })
}


const convertTime = minutes => {
  hours = minutes / 60
  rest = minutes % 60
  return `"${hours}:${rest}`
}

const startTimer = event => {
  event.preventDefault();
  let taskId = event.target.attributes.action.value.split("/")[1];
  let url = `/${taskId}/start-timer`;
  const updateDom = event => {
    const currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
    event.target.querySelector('.icn-btn').classList.add('btn--stop');
    event.target.querySelector('.timer').textContent = "p";
    event.target.addEventListener('submit', stopTimer);
  }
  fetch(url, {
    method: 'POST',
  })
  .then(function(){
    updateDom(event)
  })
}

const stopTimer = event => {
  event.preventDefault();
  let taskId = event.target.attributes.action.value.split("/")[1];
  let url = `/${taskId}/stop-timer`;
  const updateDom = event => {
    event.target.querySelector('.icn-btn').classList.remove('btn--stop');
    event.target.querySelector('.timer').textContent = "";
    event.target.addEventListener('submit', startTimer);
  }
  fetch(url, {
    method: 'PUT',
  })
  .then(function(){
    updateDom(event)
  })
}

const uncompleteTask = event => {
  event.preventDefault();
  let taskId = event.target.closest('form').attributes.action.value.split("/")[2];
  let url = `/task/${taskId}/uncomplete`;
  const updateDom = event => {
    event.target.querySelector('button').classList.remove('check--completed')
    event.target.closest('.task-item').classList.remove('task-item--completed');
    event.target.closest('form').attributes.action.value = `/task/${taskId}/complete`;
    event.target.removeEventListener("submit", uncompleteTask)
    event.target.addEventListener('submit', completeTask);

  }
  fetch(url,{
    method: 'PUT',
  })
  .then(function(){
    updateDom(event);
  })
}

const addPriority = event => {
  event.target.closest('.switch-wrapper').querySelector('.switch').classList.toggle('switch--right');
  event.target.closest('.switch-wrapper').classList.toggle('switch-wrapper--active');

}

const closeEditModal = event => {
  console.log('hi')
  event.preventDefault();
  event.target.closest('.modal-overlay').classList.remove('modal-overlay--active');
}

const showEditModal = event => {
  event.preventDefault();
  event.target.closest('.task-item').querySelector('.modal-overlay').classList.toggle('modal-overlay--active');
  const switcher = event.target.closest('.task-item').querySelector('.checkbox');
  switcher.addEventListener('click', addPriority);
  event.target.querySelector('.checkbox')
  const closeBtn = event.target.closest('.task-item').querySelector('.modal-close');
  closeBtn.addEventListener('click', closeEditModal)
}


const createTaskItem = task => {
  var taskItem = document.createElement('div');
      taskItem.classList.add('task-item')
      taskItem.setAttribute('data-created', `${task.created_at}`);
      if (task.completed) {
        taskItem.classList.add('task-item--completed');
        taskItem.setAttribute('data-created', `${task.created_at}`);
        taskItem.setAttribute('data-completed', `true`);
      } else {
        taskItem.setAttribute('data-completed', `false`);
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
            <div class='priority-wrapper'>
              ${task.priority ? `<div class="priority-div">
                  <p class='priority-label'>!</p>
              </div>` : ""}
                
                <div class="task-item__header-wrap">
                  <p>Web Development</p>
                  <h4>${task.task_name}</h3>
                  ${task.due_date?  `<p>${moment(task.due_date).startOf('day').fromNow()}</p>` : ""}
                </div>
              </div>
            ${task.current_timer_id !== null ? `
              <form class="timer-form" action="/${task.id}/stop-timer" method="post">
                <p class="timer"></p>
                <input type="hidden" name="_method" value="put">
                <input type="hidden" name="">
                <button class="icn-btn btn--stop"><i class="far fa-clock"></i></button>
              </form>
              ` 
              : 
              `<form class="timer-form" action="/${task.id}/start-timer" method="post">
              <p class="timer"></p>
              <input type="hidden" name="">
                <button class="icn-btn"><i class="far fa-clock"></i></button>
              </form>
          `
            }
          </div>
        </div>
      `
      const taskItemWrap = document.createElement('div');
      taskItem.addEventListener('click', editShift);
      taskItemWrap.innerHTML = taskItemWrapHtml;
      const checkFormHtml = `
          <input type="hidden" name="_method" value="put">
          <button class="check ${task.completed ? 'check--completed' : ""}"></button>
        `
      const checkForm = document.createElement('form');
      checkForm.innerHTML = checkFormHtml;
      checkForm.classList.add('task-item__check');
      checkForm.setAttribute('action',`/task/${task.id}/${task.completed ? 'uncomplete':'complete'}`)
      checkForm.setAttribute('method', "post");
      task.completed ? checkForm.addEventListener('submit', uncompleteTask) :  checkForm.addEventListener('submit', completeTask);
      const modalOverlay = document.createElement('div');
      modalHtml = `<div class="modal">
          <button class="modal-close"><i class="fas fa-times"></i></button>
          <form class="modal-form" action="/task/${task.id}/edit" method="post">
            <input type="hidden" name="_method" value="put">
            <input type="hidden" name="id" value="${task.id}">
            <label for="">Name</label>
            <input class="modal__name-input" type="text" name="name" placeholder="${task.task_name}" value="${task.task_name}">
            <div class="modal-form__grid">
              <div class="modal-form__clmn">
                <label for="">Project</label>
                <select>
                  <option>Test project</option>
                </select>
              </div>
              <div class="modal-form__clmn">
                <label for="">Due Date</label>
                <input type="datetime-local" name="due_date"">
              </div>
              <div class="modal-form__clmn">
                <label for="">Priority</label>
                <div class="switch-wrapper ${task.priority ? "switch-wrapper--active": ""}">
                  <div class="switch ${task.priority ? "switch--right": ""}" ></div>
                  <input class="checkbox" type="checkbox" name="priority">
                </div>
              </div>
            </div>
            <button>Save task</button>
          </form>
        </div>`;
      modalOverlay.classList.add('modal-overlay')
      modalOverlay.innerHTML = modalHtml;
      taskItem.appendChild(checkForm);
      taskItem.appendChild(taskItemWrap);
      taskItem.appendChild(modalOverlay);
      const timerBtn = taskItem.querySelector('.timer-form');
      timerBtn.addEventListener('submit', startTimer);
      task.priority ? modalOverlay.querySelector('.checkbox').checked = true : modalOverlay.querySelector('.checkbox').checked = false;
      const editBtn = document.querySelectorAll('.btn--edit');
      editBtn.forEach(el => el.addEventListener('submit', showEditModal))
      return taskItem;
}


let allTasks = new Array;

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
  let url = `/api/tasks?task_name=${taskName}`
  fetch(url,{
    method: 'POST',
  })
  .then(res => res.json())
  .then(function(res){
    taskList.insertBefore(createTaskItem(res), taskList.childNodes[0])
  })
}



newTaskForm.addEventListener('submit', addNewTask)
