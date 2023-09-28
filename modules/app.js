import * as fs from 'node:fs';
export { Write_log_entry, Read_file_content, AsyncWriteNewTask, AsyncReadFileContent, AsyncWriteUpdatedJson };  

async function Write_log_entry(log_entry) { //Async logging
    if (log_entry) {
        fs.appendFile('error_log.log', log_entry, 'utf8', (err) => {
            if (err) {
                console.log('Write_log_entry error: ', err);
            }
        });
    }
}

function AsyncWriteUpdatedJson(updated_json) {
  if (updated_json) {
    let tasks_json = JSON.stringify(updated_json);
    fs.writeFile('tasks.json', tasks_json, 'utf8', (err) => {
      if (err) {
          Write_log_entry(err);
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
  if (new_task_obj) {
    let new_task_json = JSON.stringify(new_task_obj);
    if (new_task_json) {
      await AsyncWriteTaskJson(new_task_json);
    }
  }
}
//Switch case #5 -- Under Construction
/* async function AsyncDeleteTask(delete_task_obj) {
  if (delete_task_obj) {
    let delete_task_json = JSON.stringify(delete_task_obj);
    if (delete_task_json) {
      let json_file_data = await AsyncReadFileContent();
      let tasks = [];
      let updated_tasks = [];
      if (json_file_data) {    
        tasks = JSON.parse(json_file_data);
        tasks.forEach((task) => {
          if (task !== delete_task_json) {
            updated_tasks.push(task);
          }
        });
        if (updated_tasks.length > 0) {
          json_file_data = JSON.stringify(updated_tasks);
          if (json_file_data) {
            fs.writeFile('tasks.json', json_file_data, 'utf8', (err) => {
              if (err) {
                  Write_log_entry(err);
              }
            });
          }
        }
      }
    }
  }  
} */

async function AsyncReadFileContent() {
  return new Promise((resolve) => {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
      if (data) {
        return resolve(data);
      }
      if (err) {
        Write_log_entry(err);
      }
    });
  });  
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