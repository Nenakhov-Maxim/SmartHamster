//Событие на нажатие кнопки новая задача

//let newTask = document.getElementsByClassName('add-new-task')[0];
let blockTask = document.getElementsByClassName('tasks-container')[0];
let inputBlock = document.getElementsByClassName('add-task')[0];
let myDay = document.getElementsByClassName('group-task-myday')[0];
let important = document.getElementsByClassName('group-task-important')[0];
let planning = document.getElementsByClassName('group-task-planning')[0];
let assignedToMe = document.getElementsByClassName('group-task-assigned-to-me')[0];
let allTask = document.getElementsByClassName('group-task-all-task')[0];
let title = document.getElementsByClassName('title')[0]
let applyOptionsButton = document.getElementsByClassName('modal-task-accept')[0];

inputBlock.addEventListener('keypress', AddTaskToScreen);
myDay.addEventListener('click', () =>  {
  title.innerHTML = 'Мой день';
})
important.addEventListener('click', () =>  {
  title.innerHTML = 'Важно'
})
planning.addEventListener('click', () =>  {
  title.innerHTML = 'Запланировано'
})
assignedToMe.addEventListener('click', () =>  {
  title.innerHTML = 'Назначено мне'
})
allTask.addEventListener('click', () =>  {
  title.innerHTML = 'Контроль исполнения'
})


function AddTaskToScreen(e){
  if (e.key === 'Enter'){
    if (inputBlock.value!=''){
      let inputValue = inputBlock.value;
      let div = document.createElement('div');
      div.className = "task";      
      div.innerHTML = `<img src="icon/circle.svg" alt="выполнено" onclick="completeTask(this)"><p class='task-text'>${inputValue}</p>`;
      blockTask.append(div);
      div.childNodes[1].addEventListener('click', toggleTaskOptions) 
      document.activeElement.blur();
      inputBlock.value = '';      
      add_to_database(inputValue)
    }
    else {
      alert('Что все-таки ввести придется ;)')
    }    
  }  
  
}

function inputFocus(self) {
  self.style.backgroundImage = 'url(icon/circle.svg)';
  self.placeholder = ''
  self.style.width = '800px';
  self.style.transition = '1s';
}

function inputBlur(self)  {
  self.style.backgroundImage = 'url(icon/plus.svg)';
  self.placeholder = 'Новая задача'
  self.style.width = '400px';
  self.style.transition = '.5s';
}

function completeTask(self) {
  comp_div = document.getElementsByClassName('completed-task')[0]
  comp_elem = document.getElementsByClassName('completed-task-inner')[0];
  task_inner = 
  self.style.backgroundImage = 'url(icon/check.svg)';
  if(self.parentElement.classList.value == 'task'){
    self.parentElement.classList.toggle('completed');
    comp_elem.append(self.parentElement)
    comp_div.style.display = 'block'
  } else {
    self.parentElement.classList.toggle('completed');
    blockTask.append(self.parentElement);
    self.style.backgroundImage = '';
    if (document.querySelector('.completed') == null) {
      comp_div.style.display = 'None'
    }
  } 
}

async function start_app(){
    value = await eel.start_app()();      
    log_up(value[0][0])
    email_up(value[0][1])
    add_task_db(value[1])  
    
}

function add_task_db(value) {
  for (let i = 0; i < value.length; i++) {
    let element = value[i][9];
    let div = document.createElement('div');
    div.className = "task";
    div.innerHTML = `<img src="icon/circle.svg" alt="выполнено" onclick="completeTask(this)"><p class='task-text'>${element}</p>`;
    blockTask.append(div);
    div.childNodes[1].addEventListener('click', toggleTaskOptions)            
  }  
  
}

async function add_to_database(text){
  console.log('Шаг 1')
  value = await eel.add_to_db(text)();
  if (value ===  true) {
    console.log('Шаг 2')
    console.log('Добавление прошло успешно')
  } else {
    console.log('Что-то пошло не так')
  }
}

function log_up(user_name) {
  let name = document.getElementsByClassName('name')[0];
  name.innerHTML = user_name
}

function email_up(email) {
  let name = document.getElementsByClassName('email')[0];
  name.innerHTML = email
}

function toggleTaskOptions(self, event) {
  modal = document.querySelector('.modal-block');
  btn_close = document.querySelector('.close-block');
  modal_inner = document.querySelector('.modal-inner');
  modal.classList.toggle('modal-active');
  btn_close.addEventListener('click', ()=> {
    modal.classList.remove('modal-active');
  })
}

applyOptionsButton.addEventListener('click', (e) => {
  modal = document.querySelector('.modal-block');
  e.preventDefault();
  console.log('изменения приняты')
  modal.classList.remove('modal-active');
})


start_app()