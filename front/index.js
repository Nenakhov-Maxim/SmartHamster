
//Определение базовых переменных
let blockTask = document.getElementsByClassName('tasks-container')[0];
let endTask = document.querySelector('.completed-task-inner');
let inputBlock = document.getElementsByClassName('add-task')[0];
let title = document.getElementsByClassName('title')[0]
let applyOptionsButton = document.getElementsByClassName('modal-task-accept')[0];
let worker_ident = 0

//Обновление по нажатию кнопки f5
document.addEventListener('keydown', (e)=> {
  if (e.keyCode == 116) {
    e.preventDefault();     
  }
})

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
      k = element.dataset.key;
      reloadTask(k);      
      if(k == 'As' || k == 'At'){
        document.querySelector('.add-task').style.display = 'None'  
      }else{
        document.querySelector('.add-task').style.display = 'block'
      }      
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
      k = document.querySelector('.active-nav').dataset.key             
      reloadTask(k);    
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
  k = document.querySelector('.active-nav').dataset.key             
  reloadTask(k);   
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
function completeTask(div=self) {
  comp_div = document.getElementsByClassName('completed-task')[0];
  comp_elem = document.getElementsByClassName('completed-task-inner')[0];  
  div.style.backgroundImage = 'url(icon/check.svg)';
  div.style.backgroundPosition = '0.1vw -0.2vw';    
  if(div.parentElement.classList.value == 'task'){    
    div.parentElement.classList.toggle('completed');
    comp_elem.append(div.parentElement);
    comp_div.style.display = 'block';    
    div.parentElement.querySelector('.important-task').classList.add('delete');
    updateStatus(div.parentElement.dataset.taskId, 1);
  } else {    
    div.parentElement.classList.toggle('completed');
    div.parentElement.querySelector('.important-task').classList.remove('delete');
    blockTask.append(div.parentElement);
    div.style.backgroundImage = '';
    active_nav = document.querySelector('.active-nav');
    if(active_nav.dataset.key == 'As'){
      updateStatus(div.parentElement.dataset.taskId, 4);
    }else {
      updateStatus(div.parentElement.dataset.taskId, 3);
    }  
    if (document.querySelector('.completed') == null) {
      comp_div.style.display = 'None';
    };
  }; 
};

//Функции для связи с backend
// Запуск приложения (поиск пользователя в БД, заполнение профиля (имя, почта), заполнение задач из БД)
async function start_app(key='P'){  
    value = await eel.start_app(key)();         
    log_up(value[0][0]);
    email_up(value[0][1]);
    //Добавляем задачи из баз
    add_task_db(value[1]);
    //Добавляем из базы собственные созданные списки
    let worker_ID = value[0][5];
    worker_ident = value[0][5];
    get_custom_list(worker_ID);

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

async function get_custom_list(worker_ID) {
  result = await eel.get_task_list(worker_ID)();  
  add_custom_list(result);  
}

// Получение групп задач для заполнения select в блоке опции
async function get_data_by_groups(){  
  groups = await eel.get_groups()();  
  return groups
}
//Отправка данных в базу данных
async function send_new_data(ID, completion_date, text_task, who_appointed, whom_is_assigned, task_group, alarm, is_alarmed, task_list){
  await eel.update_all_data(ID, completion_date, text_task, who_appointed, whom_is_assigned, task_group, alarm, is_alarmed, task_list)();
}

//Добавление нового пользовательского списка в бд
async function addNewCustomList(val){
  await eel.add_task_list(val)();
}
// Заполнение задач из БД
function add_task_db(value) {
    document.getElementsByClassName('completed-task')[0].style.display = 'none';
    blockTask.innerHTML = '';
    endTask.innerHTML = '';
    let idForAlarmClock = [];
    let numberOfExpiredAlarmClocks = 0;
    let textOfExpiredAlarmClocks = [];    
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
                        <div class="alarmed-task"></div>
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
        if (value[i][10] == 1) {                   
          completeTask(div.querySelector('img'));  
        }              
        div.querySelector('p.task-text').addEventListener('click', toggleTaskOptions);
        div.querySelector('.important-task').setAttribute('onclick', 'toggleCompleteAction(this)');
        //Автоустановление важности задачи из базы данных
        if (value[i][15] == "True") {
          div.querySelector('.important-task').classList.add('star-on');
        };
        // Автоустановление будильника из базы данных               
        if (value[i][17] == 'False'){
          if (value[i][16] != 'None') {
            if (new Date(value[i][16]) < new Date()) {
              numberOfExpiredAlarmClocks += 1;
              textOfExpiredAlarmClocks.push(value[i][9]);
              idForAlarmClock.push(value[i][0]);
            } else {
              setTimeout(alarmHorn, new Date(value[i][16]) - new Date(), [value[i][9]], 1, 'AT',  [value[i][0]]);
              div.querySelector('.alarmed-task').classList.add('alarm');
            };
          };
        };
      };               
    };
    if (numberOfExpiredAlarmClocks  > 0)  {
      setTimeout(alarmHorn, 200, textOfExpiredAlarmClocks, numberOfExpiredAlarmClocks, 'AT', idForAlarmClock);
    }
    

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
//Обновить статус задачи
async function updateStatus(ID, val){
  await eel.update_st(ID, val)()
}
//Обновление приложения
async function reloadTask(key, custom_list=''){  
  value = await eel.start_app(key, custom_list)();
  add_task_db(value[1]);
  active_nav = document.querySelector('.active-nav');  
  document.querySelector('.active-nav').classList.remove('active-nav');  
  active_nav.classList.add('active-nav');
}
//Обновление будильника
async function updateAlarmClock(ID, param){
  await eel.upd_alarm_clock(ID, param)();
}

// Функция показать/скрыть опции задачи, формирование данных для блока настроек
function toggleTaskOptions(self) {  
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
        activatingAlarmClock();
        break;
      case 'repeat':
        console.log('Установить цикличность');
        break;
      case 'assign':
        whomIsAssigned.removeAttribute('readonly');
        break;
      case 'move-to-my-list':
        document.querySelector('.move-to-my-list-inner').classList.add('active');
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
          activatingAlarmClock();
          break;
        case 'repeat':
          console.log('Убарть цикличность');
          break;
        case 'assign':
          whomIsAssigned.setAttribute('readonly', 'readonly');
          break;
        case 'move-to-my-list':
          document.querySelector('.move-to-my-list-inner').classList.remove('active');
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
  let horn_date = document.querySelector("#horn-date").value;
  let horn_time = document.querySelector("#horn-time").value;
  let alarm = '';
  let is_alarmed = 0
  if (horn_date != '' && horn_time == ''){
    alarm = horn_date + ' 23:59';
  } else if (horn_date == '' && horn_time != ''){
    alarm = formatDate(new Date())[0] + ' ' + horn_time;
  } else if (horn_date != '' && horn_time != ''){
      alarm = horn_date + ' ' + horn_time;
  } else {
    is_alarmed = 1;
  }
  let task_list = '';
  if (document.querySelector('.move-to-my-list').checked) {
    task_list = document.querySelector('.move-to-my-list-select').value;
  } 
  //Отправка данных в базу данных
  send_new_data(ID, completion_date + ' ' + completion_time, text, who_appointed, whom_is_assigned, task_group, alarm, is_alarmed, task_list); //creation_date
  modal.classList.remove('modal-active');
  k = document.querySelector('.active-nav').dataset.key;
  
  reloadTask(k);
  
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

// Форматирование даты
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

// Снятие фокуса с окна создания нового списка
newListTask = document.querySelector('.new-list-task');
newListTask.addEventListener('click', () => {
 newListTask.style.display = 'none';
 modal_list = document.querySelector('.modal-list-task');
 modal_list.style.display = 'flex';
 document.addEventListener('click', (e)=>{    
    if (modal_list.style.display == 'flex' && !e.target.classList.contains('new-list-task') && !e.path.includes(modal_list)) {    
      modal_list.style.display = 'none';
      newListTask.style.display = 'grid';
    }
  }); 

  //Создать новый список
  document.querySelector('.list-task-name').addEventListener('keypress', (e)=>{
    if (e.key === 'Enter') {
      modal_list.style.display = 'none';
      newListTask.style.display = 'grid';
      new_div = document.createElement('div');
      new_div.classList.add('list-task');
      new_div.innerHTML = document.querySelector('.list-task-name').value;
      addNewCustomList(document.querySelector('.list-task-name').value);
      document.querySelector('.list-task-inner').append(new_div);
      document.querySelector('.list-task-name').value = '';
      
    };
  });
});

//Установка напоминаня в окне "Настройка задачи"
function activatingAlarmClock(){
  horn_input = document.querySelector('.horn-input')
  if(horn_input.classList.contains('active')){
    horn_input.classList.remove('active');
  }else {
    horn_input.classList.add('active');
  }
}

// Функция - действие при наступлении времени будильника
// text - текст задачи, col - количество уведомлений, param:
// AT - Уведомление будильника
function alarmHorn(text, col, param, ID){
  document.querySelector('.modal-horn').classList.add('active');
  modal_alarm = document.querySelector('.modal-horn-layout');
  modal_alarm.innerHTML = '';
    if (param == 'AT'){  
      h3 = document.createElement('h3');
      if (col == 1) {
        h3.innerHTML = `У вас ${col} новое уведомление`;
      }else  {
        h3.innerHTML = `У вас ${col} новых уведомлений`;
      }
      modal_alarm.append(h3);
      alarm_div = document.createElement('div');
      alarm_div.classList.add('horned-task');   
      alarm_p = document.createElement('p');
      alarm_p.innerHTML = 'Напоминание о выполнение задачи:';
      alarm_div.append(alarm_p);
      alarm_ul = document.createElement('ul');         
      for (let i = 0; i < text.length; i++) {
        const element = text[i];         
        alarm_li = document.createElement('li');        
        alarm_li.innerHTML = `<li>${element}</li>`
        alarm_ul.append(alarm_li);
      }
      alarm_div.append(alarm_ul);
      modal_alarm.append(alarm_div);
    }
    document.querySelector('.modal-horn-exit').addEventListener('click', ()=> {
      document.querySelector('.modal-horn').classList.remove('active');
      updateAlarmClock(ID, 1);
      for (const id in ID) {
        if (Object.hasOwnProperty.call(ID, id)) {
          const element = ID[id];
          task = document.querySelector('.task[data-task-id="'+element+'"]');
          if (task.querySelector('.alarmed-task').classList.contains('alarm')) {
            task.querySelector('.alarmed-task').classList.remove('alarm');
          }; 
        };
      };
    });  
  };

//Добавление собственных списков задач, подгруженных из базы данных
function add_custom_list(value){
  option_task = document.querySelector('.move-to-my-list-select');
  option_task.innerHTML = '';  
  for (const key in value) {
    if (Object.hasOwnProperty.call(value, key)) {
      const element = value[key];
      new_div = document.createElement('div');
      new_div.classList.add('list-task');      
      new_div.innerHTML = element;
      document.querySelector('.list-task-inner').append(new_div);
      new_option = document.createElement('option');
      new_option.innerHTML = element;
      option_task.append(new_option);
      new_div.addEventListener('click', (e)=>{        
        document.querySelector('.active-nav').classList.remove('active-nav');
        e.target.classList.add('active-nav');
        title.innerHTML = e.target.innerHTML;
        reloadTask('CT', custom_list=e.target.innerHTML);
      })
    };
  };
};  
//Запуск приложения
start_app();