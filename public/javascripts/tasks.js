console.log('hi')

const taskList = document.querySelectorAll('.task-item');
const completedTasks = document.querySelectorAll('.task-item--completed')
const uncompletedTasks = document.querySelectorAll('.task-item--uncomplete')


Array.from(taskList).sort((a, b) =>   
  a.dataset.completed.localeCompare(b.dataset.completed)
)
  .forEach(el => el.parentNode.appendChild(el))


Array.from(uncompletedTasks).sort((a, b) =>   
  new Date(b.dataset.created) - new Date(a.dataset.created)
)
.forEach(el => el.parentNode.appendChild(el))

Array.from(completedTasks).sort((a, b) =>   
    new Date(a.dataset.created) - new Date(b.dataset.created)
)
.forEach(el => el.parentNode.appendChild(el))
