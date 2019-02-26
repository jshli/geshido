// const timer = document.querySelector('.timer');

// const minutes = minute => {
//     var id = setInterval(function() {
//         minute >= 0 ? console.log(minute) : clearInterval(id);
//         minute ++;
//     }, 1000);
// }

const taskItem = document.querySelectorAll('.task-item--wrap')
const header = document.querySelector('.section__header');

const editShift = event => {

    if (event.target.classList.contains('task-item__details')){
        event.target.classList.toggle('task-item__details--shrink');
    }

    console.log(event.target)
};

// var swipe = new Hammer(header);

// swipe.on('tap', function(ev) {
// 	console.log("hello");
// });

taskItem.forEach(el => el.addEventListener('click', editShift));

