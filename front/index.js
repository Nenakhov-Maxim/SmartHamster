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
      /*Думать дальше как решить ;(*/
      /*let div = document.createElement('div');
      div.className = "task";      
      div.innerHTML = `<img src="icon/circle.svg" alt="выполнено" onclick="completeTask(this)"><p class='task-text'>${inputValue}</p>`;
      blockTask.append(div);
      div.childNodes[1].addEventListener('click', toggleTaskOptions)*/ 
      document.activeElement.blur();
      inputBlock.value = '';    
      add_to_database(inputValue);
     /* window.location.reload(); Хрень получается!*/
      
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
    let text_element = value[i][9];
    let div = document.createElement('div');
    div.className = "task";
    div.innerHTML = `<img src="icon/circle.svg" alt="выполнено" onclick="completeTask(this)"><p class='task-text'>${text_element.slice(0, 20)}...</p>`;
    div.setAttribute('data-task-text', (value[i][9] != 'None') ? value[i][9] : " ")
    div.setAttribute('data-task-id', (value[i][0] != 'None') ? value[i][0] : " ");    
    div.setAttribute('data-creation-date', (value[i][7] != 'None') ? value[i][7] : "");
    div.setAttribute('data-completion-date', (value[i][8] != 'None') ? value[i][8] : ""); 
    div.setAttribute('data-status', (value[i][10] != 'None') ? value[i][10] : " ");
    div.setAttribute('data-visibillity', (value[i][11] != 'None') ? value[i][11] : " ");
    div.setAttribute('data-who-appointed', (value[i][12] != 'None') ? value[i][12] : " ");
    div.setAttribute('data-whom-is-assigned', (value[i][13] != 'None') ? value[i][13] : " ");
    div.setAttribute('data-task-group', (value[i][14] != 'None') ? value[i][14] : " ");    
    blockTask.append(div);
    div.childNodes[1].addEventListener('click', toggleTaskOptions)            
  }  
  
}

async function add_to_database(text){  
  value = await eel.add_to_db(text)();
  if (value ===  true) {    
    console.log('Добавление прошло успешно')
  } else {
    console.log('Что-то пошло не так')
  }
}

async function get_data_by_groups(){  
  groups = await eel.get_groups()();  
  return groups
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
  modal.classList.toggle('modal-active');
  btn_close.addEventListener('click', ()=> {
    modal.classList.remove('modal-active');
  })
  /*формируем данные для блока опции*/  
  let text = document.querySelector('textarea.modal-text');
  text.value = self.path[0].parentElement.dataset.taskText; 
  let dateStart = document.querySelector('input.modal-date-start');
  dateStart.value = new Date(self.path[0].parentElement.dataset.creationDate).toISOString().split('T')[0];
  let dateEnd = document.querySelector('input.modal-date-end');
  dateEnd.value = (self.path[0].parentElement.dataset.completionDate != '') ? new Date(self.path[0].parentElement.dataset.completionDate).toISOString().split('T')[0]: '';
  let whoAppointed = document.querySelector('input.option-assign');  
  whoAppointed.value = (self.path[0].parentElement.dataset.whoAppointed != ' ')? self.path[0].parentElement.dataset.whoAppointed: 'Нет';
  let whomIsAssigned = document.querySelector('input.option-to-assign');  
  whomIsAssigned.value = (self.path[0].parentElement.dataset.whomIsAssigned != ' ') ? self.path[0].parentElement.dataset.whomIsAssigned: 'Нет';
  get_data_by_groups().then(function(result) {  
    let taskGroup = document.querySelector('select.modal-option-select');
    taskGroup.innerHTML = ''
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      let option = document.createElement('option');
      if (element == self.path[0].parentElement.dataset.taskGroup){
        option.setAttribute('selected', 'selected');
      } else {
        option.setAttribute('disabled', 'disabled');
      }; 
      option.innerHTML = element;
      taskGroup.append(option);      
    };
  });
}

applyOptionsButton.addEventListener('click', (e) => {
  modal = document.querySelector('.modal-block');
  e.preventDefault();
  console.log('изменения приняты')
  modal.classList.remove('modal-active');
})


start_app()