
//Определение базовых переменных
let blockTask = document.getElementsByClassName('tasks-container')[0];
let inputBlock = document.getElementsByClassName('add-task')[0];
let title = document.getElementsByClassName('title')[0]
let applyOptionsButton = document.getElementsByClassName('modal-task-accept')[0];

// Открытие/закрытие модального окна
modal = document.querySelector('.modal-block');
btn_close = document.querySelector('.close-block');
document.addEventListener('click', (e)=>{
  modal_active = document.querySelector('.modal-active');  
  if (modal_active && !e.target.classList.contains('task-text') && !e.path.includes(modal_active)) {    
    modal.classList.remove('modal-active');
  }
});

btn_close.addEventListener('click', ()=> {
  modal.classList.remove('modal-active');
});

// Работа меню навигации
for (let i = 0; i < document.querySelector('.group-task').childNodes.length; i++) {
  const element = document.querySelector('.group-task').childNodes[i];
  if (element.nodeType == 1) {
    element.addEventListener('click', (e)=> {
      title.innerHTML = element.innerHTML;           
      document.querySelector('.active-nav').classList.remove('active-nav');
      element.classList.add('active-nav');  
      key = element.dataset.key;
      start_app(key);      
    })     
  } 
}

//Добавление задачи на экран при нажатии "enter"
inputBlock.addEventListener('keypress', AddTaskToScreen);
function AddTaskToScreen(e){
  if (e.key === 'Enter'){
    if (inputBlock.value!=''){
      let inputValue = inputBlock.value;   
      document.activeElement.blur();
      inputBlock.value = '';   
      add_to_database(inputValue);      
      start_app();    
    }
    else {
      alert('Что все-таки ввести придется ;)')
    }    
  }   
}

//Добавление в избранное, удаление задачи

function toggleCompleteAction(self){
  ID = self.parentElement.dataset.taskId;
  if(self.classList.contains('delete')){
    deletedTask(ID);
    self.parentElement.remove();
  } else {
    self.classList.toggle('star-on');
    if (self.classList.contains('star-on')) {      
      impr = true;
      updImportantTask(ID, impr);              
    }else {
      impr = false;
      updImportantTask(ID, impr);
    }  
  }  
  
}

// Функции-события описанные в html
// фокус при добавлении задачи
function inputFocus(self) {
  self.style.backgroundImage = 'url(icon/circle.svg)';
  self.placeholder = ''
  self.style.width = '800px';
  self.style.transition = '1s';
}
//снятие фокуса после добавления задачи
function inputBlur(self)  {
  self.style.backgroundImage = 'url(icon/plus.svg)';
  self.placeholder = 'Новая задача'
  self.style.width = '400px';
  self.style.transition = '.5s';
}
//Завершение задачи после выполнения (нажатие на круг слева)
function completeTask(self) {
  comp_div = document.getElementsByClassName('completed-task')[0];
  comp_elem = document.getElementsByClassName('completed-task-inner')[0];  
  self.style.backgroundImage = 'url(icon/check.svg)';
  self.style.backgroundPosition = '0.1vw -0.2vw';    
  if(self.parentElement.classList.value == 'task'){
    self.parentElement.classList.toggle('completed');
    comp_elem.append(self.parentElement);
    comp_div.style.display = 'block';    
    self.parentElement.querySelector('.important-task').classList.add('delete');
  } else {
    self.parentElement.classList.toggle('completed');
    self.parentElement.querySelector('.important-task').classList.remove('delete');
    blockTask.append(self.parentElement);
    self.style.backgroundImage = '';
    if (document.querySelector('.completed') == null) {
      comp_div.style.display = 'None';
    };
  }; 
};

//Функции для связи с backend
// Запуск приложения (поиск пользователя в БД, заполнение профиля (имя, почта), заполнение задач из БД)
async function start_app(key='P'){  
    value = await eel.start_app(key)();      
    log_up(value[0][0])
    email_up(value[0][1])
    add_task_db(value[1])  
}
//Заполнение профиля. Имя
function log_up(user_name) {
  let name = document.getElementsByClassName('name')[0];
  name.innerHTML = user_name
}
//Заполнение профиля. Почта
function email_up(email) {
  let name = document.getElementsByClassName('email')[0];
  name.innerHTML = email
}
// Добавление задачи в БД при создании новой
async function add_to_database(text){  
  value = await eel.add_to_db(text)();
  if (value ===  true) {    
    console.log('Добавление прошло успешно')
  } else {
    console.log('Что-то пошло не так')
  }
}
// Получение групп задач для заполнения select в блоке опции
async function get_data_by_groups(){  
  groups = await eel.get_groups()();  
  return groups
}
//Отправка данных в базу данных
async function send_new_data(ID, completion_date, text_task, who_appointed, whom_is_assigned, task_group){
  await eel.update_all_data(ID, completion_date, text_task, who_appointed, whom_is_assigned, task_group)();
}
// Заполнение задач из БД
function add_task_db(value) {
    blockTask.innerHTML = '';
    for (let i = 0; i < value.length; i++) {    
      if (value[i][11] == "True") {
        let text_element = value[i][9];
        let div = document.createElement('div');
        div.className = "task";
        if (text_element.length >= 20) {
          text_element = text_element.slice(0, 20) + '...';
        };
        div.innerHTML = `<img src="icon/circle.svg" alt="выполнено" onclick="completeTask(this)">
                        <p class='task-text'>${text_element}</p>
                        <div class="important-task"></div>
                        <div class="sub-startdate-task"><p>Создано: ${value[i][7].split(' ')[0]}</p></div>
                        <div class="sub-enddate-task">
                        <p>Закончить: ${value[i][8].split(' ')[0]}</p>
                        <p>До: ${value[i][8].split(' ')[1].split('.')[0]}</p>
                        </div>`;
        
        if (new Date(value[i][8]) < new Date()) {
          div.querySelector(".sub-enddate-task").style.backgroundColor = 'rgba(143, 34, 14, 0.75)'
        }                 
        div.setAttribute('data-task-text', (value[i][9] != 'None') ? value[i][9] : " ")
        div.setAttribute('data-task-id', (value[i][0] != 'None') ? value[i][0] : " ");    
        div.setAttribute('data-creation-date', (value[i][7] != 'None') ? value[i][7] : "");
        div.setAttribute('data-completion-date', (value[i][8] != 'None') ? value[i][8] : ""); 
        div.setAttribute('data-status', (value[i][10] != 'None') ? value[i][10] : " ");        
        div.setAttribute('data-who-appointed', (value[i][12] != 'None') ? value[i][12] : " ");
        div.setAttribute('data-whom-is-assigned', (value[i][13] != 'None') ? value[i][13] : " ");
        div.setAttribute('data-task-group', (value[i][14] != 'None') ? value[i][14] : " ");    
        blockTask.append(div);        
        div.querySelector('p.task-text').addEventListener('click', toggleTaskOptions);
        div.querySelector('.important-task').setAttribute('onclick', 'toggleCompleteAction(this)');
        if (value[i][15] == "True") {
          div.querySelector('.important-task').classList.add('star-on');
        };
      };               
    };
};
// Изменить важность задачи в бд
async function updImportantTask(ID, impr){
  await eel.update_important(ID, impr)();
}
//Удалить задачу из БД (скрыть ее во фронде! фактически не удаляется(для статистики))
async function deletedTask(ID){
  await eel.del_task(ID)();
}
//Получить список зарегистрированных пользователнй
async function getUsers(){
  return await eel.get_workers()();
  
}

// Функция показать/скрыть опции задачи, формирование данных для блока настроек
function toggleTaskOptions(self, event) {
  if (!modal.classList.contains('modal-active')) {
    modal.classList.add('modal-active');
  }   
  /*формируем данные для блока опции*/  
  let text = document.querySelector('textarea.modal-text');
  text.value = self.path[0].parentElement.dataset.taskText;
  text.setAttribute('data-task-id', self.path[0].parentElement.dataset.taskId); 
  let dateStart = document.querySelector('input.modal-date-start');
  let timeStart = document.querySelector('input.modal-time-start');
  dateStart.value = formatDate(self.path[0].parentElement.dataset.creationDate)[0];
  timeStart.value = formatDate(self.path[0].parentElement.dataset.creationDate)[1];
  let dateEnd = document.querySelector('input.modal-date-end');
  let timeEnd = document.querySelector('input.modal-time-end');
  dateEnd.value = (self.path[0].parentElement.dataset.completionDate != '') ? formatDate(self.path[0].parentElement.dataset.completionDate)[0]: '';
  timeEnd.value = (self.path[0].parentElement.dataset.completionDate != '') ? formatDate(self.path[0].parentElement.dataset.completionDate)[1]: '';
  let whoAppointed = document.querySelector('input.option-assign');  
  whoAppointed.value = (self.path[0].parentElement.dataset.whoAppointed != ' ')? self.path[0].parentElement.dataset.whoAppointed: 'Нет';
  let whomIsAssigned = document.querySelector('input.option-to-assign');  
  whomIsAssigned.value = (self.path[0].parentElement.dataset.whomIsAssigned != ' ') ? self.path[0].parentElement.dataset.whomIsAssigned: 'Нет';
  get_data_by_groups().then(function(result) {  
    let taskGroup = document.querySelector('select.modal-option-select');
    taskGroup.innerHTML = '';
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

//Функционал блока "Дополнительные опции" в настройке задач
function fieldset_change(self){
  let dateEnd = document.querySelector('input.modal-date-end');
  let timeEnd = document.querySelector('input.modal-time-end');
  let taskGroup = document.querySelectorAll('select.modal-option-select > option');
  let whomIsAssigned = document.querySelector('input.option-to-assign');
  if (self.checked == true){
    switch (self.name) {
      case 'date':
        dateEnd.removeAttribute('readonly'); 
        timeEnd.removeAttribute('readonly');
        break;
      case 'type':       
        for (let i = 0; i < taskGroup.length; i++) {
          const element = taskGroup[i];
          element.removeAttribute('disabled');          
        }
        break;
      case 'horn':
        console.log('Установить напоминание');
        break;
      case 'repeat':
        console.log('Установить цикличность');
        break;
      case 'assign':
        whomIsAssigned.removeAttribute('readonly');
        break;
      default:
        break;
    }
  } else {
      switch (self.name) {
        case 'date':
          dateEnd.setAttribute('readonly', 'readonly'); 
          break;
        case 'type':        
          for (let i = 0; i < taskGroup.length; i++) {
            const element = taskGroup[i];
            element.setAttribute('disabled', 'disabled');          
          }
          break;
        case 'horn':
          console.log('Убрать напоминание');
          break;
        case 'repeat':
          console.log('Убарть цикличность');
          break;
        case 'assign':
          whomIsAssigned.setAttribute('readonly', 'readonly');
          break;
        default:
          break;
      };  
  };
};

// Функционал кнопки "Применить" в блоке "Настройка задачи"
applyOptionsButton.addEventListener('click', (e) => {
  modal = document.querySelector('.modal-block');
  e.preventDefault();
  
  //Сбор данных из окна настроек задачи
 let ID = document.querySelector('textarea.modal-text').dataset.taskId;
 let completion_date = document.querySelector('input.modal-date-end').value;
 let completion_time = document.querySelector('input.modal-time-end').value;
 let text =  document.querySelector('.modal-text').value
 let who_appointed = document.querySelector('input.option-assign').value;
 let whom_is_assigned = document.querySelector('input.option-to-assign').value;
 let task_group = document.querySelector("select.modal-option-select").value;  
 //Отправка данных в базу данных
 send_new_data(ID, completion_date + ' ' + completion_time, text, who_appointed, whom_is_assigned, task_group); //creation_date
 console.log('изменения приняты');
 modal.classList.remove('modal-active');
});

//Автокомплит для назначения ответственных (библиотека jquery)
$( function() {
  getUsers().then(function(result){
    var availableTags = [];
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      availableTags.push(element);
    }    
    $( "#tags" ).autocomplete({
      source: availableTags
    });
  })
});

function formatDate(val){
  date = new Date(val);
  year = date.getFullYear();
  day = date.getDate();
  if(day < 10){
    day = `0${day}`;
  };
  month = date.getMonth() + 1;
  if(month < 10){
    month = `0${month}`;
  };
  hour = date.getHours();
  if(hour < 10){
    hour = `0${hour}`;
  };
  minute = date.getMinutes();
  if(minute < 10){
    minute = `0${minute}`;
  };
  refDate = `${year}-${month}-${day}`;
  refTime = `${hour}:${minute}`;
  return [refDate, refTime];
}

//Запуск приложения
start_app();