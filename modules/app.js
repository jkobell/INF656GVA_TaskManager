import * as fs from 'node:fs';
export { Write_log_entry, Read_file_content, AsyncWriteNewTask };  

async function Write_log_entry(log_entry) { //Async logging
    if (log_entry) {
        fs.appendFile('error_log.log', log_entry, 'utf8', (err) => {
            if (err) {
                console.log('Write_log_entry error: ', err);
            }
        });
    }
}

async function AsyncWriteTaskJson(task_entry) { //Async append json to file
  if (task_entry) {
    let tasks = [];
    let tasks_json = Read_file_content();
    if (tasks_json) {
      tasks = JSON.parse(tasks_json);
    }
    tasks.push(task_entry);
    tasks_json = JSON.stringify(tasks);
    if (tasks_json) {
      fs.writeFile('tasks.json', tasks_json, 'utf8', (err) => {
        if (err) {
            Write_log_entry(err);
        }
      });
    }
  }
}

async function AsyncWriteNewTask(new_task_obj) {// arg is a NewTask object
  if (typeof new_task_obj !== "undefined") {
    let new_task_json = JSON.stringify(new_task_obj);
    if (new_task_json) {
      await AsyncWriteTaskJson(new_task_json);
    }
  }
}

function Read_file_content() { //Sync read file
  try {
      let data = fs.readFileSync('tasks.json', 'utf8');
      if (data) {
          return data;
      }
  }
  catch (error) {
      Write_log_entry(error);
  }    
}