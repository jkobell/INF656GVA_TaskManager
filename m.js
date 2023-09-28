import * as readline from 'node:readline';
import { stdin as process_input, stdout as process_output } from 'node:process';
import * as app from "./modules/app.js";
export { readline };

const menu_prompt = '\n\n\t**************************************************************************'+
                    '\n\t\t\tWelcome to Task Manager'+
                    '\n\tEnter a number to select an operation.'+
                    '\n\t1. List all tasks.'+
                    '\n\t2. Add new task.'+
                    '\n\t3. Update task status.'+
                    '\n\t4. Json file dump.'+
                    '\n\t5. Remove a task. [Under Construction]'+
                    '\n\t6. Exit Task Manager.\n';
const repeat_menu_prompt = '\n\n\t**************************************************************************'+
                           '\n\tEnter a number to select an operation.'+
                           '\n\t1. List all tasks.'+
                           '\n\t2. Add new task.'+
                           '\n\t3. Update task status.'+
                           '\n\t4. Json file dump.'+
                           '\n\t5. Remove a task. [Under Construction]'+
                           '\n\t6. Exit Task Manager.\n';
const Newtask = {"title":"", "description":"", "status":""};
var new_task_entry = null;
var rl_main = null;
var rl1 = null;
var rl2 = null;
var rl3 = null;
const rl_obj = readline.createInterface({
  input: process_input,
  output: process_output,
});
rl_main = new Object(rl_obj);
rl_main.setPrompt(menu_prompt);
rl_main.prompt(); 

function AddLineEventListener() {
  rl_main.on('line', (line) => {
    switch (line.trim()) {
      
      case '1'://feature done  List All Tasks      
        rl_main.removeAllListeners();
        rl_main.setPrompt('');                  
        
        new Promise((resolve) => {
          let file_content = app.Read_file_content();
          let read_json = setInterval(() => {
            if (file_content) {
              clearInterval(read_json);
              resolve(file_content);           
            } 
          }, 200);          
        }).then((json_content) => {
          return new Promise((resolve) => {
            let tasks = [];
            let set_prompt = '\t****************************************All Tasks****************************************\n'+
                              `\t${"TITLE".padEnd(35)}${"DESCRIPTION".padEnd(45)}${"STATUS"}\n`+
                              `\t${"-----".padEnd(35)}${"-----------".padEnd(45)}${"------"}\n`;
            rl1 = new Object(rl_obj);
            tasks = JSON.parse(json_content);
            if (tasks.length > 0) {
              tasks.forEach(task => {
                const task_obj = JSON.parse(task);
                if (task_obj) {  
                  set_prompt += `\t${task_obj.title.padEnd(25)}${task_obj.description.padEnd(55)}${task_obj.status}\n`;
                }              
              });
              set_prompt += repeat_menu_prompt;
              rl1.setPrompt(set_prompt);
              rl1.prompt();
              let setprompt_build = setInterval(() => {
                let setprompt_message = rl1.getPrompt();
                if (setprompt_message) {
                  clearInterval(setprompt_build);
                  resolve();           
                } 
              }, 200);
            }            
          });
        }).then(() => {
          AddLineEventListener();
        });
        break;
      case '2'://feature done Add New Task
        rl_main.removeAllListeners();
        rl_main.setPrompt('');
        new_task_entry = null;
        new_task_entry = Object.create(Newtask);
        new Promise((resolve) => {          
          rl1 = new Object(rl_obj);
          rl1.setPrompt('\t-----Add New Task-----'+
                        '\n\tEnter task title: ');
          rl1.prompt();
          rl1.on('line', (line) => {
            if (line) {
              new_task_entry.title = line.trim();
            }
            else {
                new_task_entry.title = 'No task title provided.'; 
            }
            resolve();
          });
        }).then(() => {
          return new Promise((resolve) => {
            rl1.removeAllListeners();
            rl1.setPrompt('');
            rl2 = new Object(rl_obj);
            rl2.setPrompt('\n\tEnter task description: ');
            rl2.prompt();
            rl2.on('line', (line) => {
              if (line) {
                new_task_entry.description = line.trim();
              }
              else {
                new_task_entry.description = 'No task description provided.';
              }
              resolve();
            });
          });
        }).then(() => {
          return new Promise((resolve) => {
            rl2.removeAllListeners();
            rl2.setPrompt('');
            rl3 = new Object(rl_obj);
            rl3.setPrompt('\n\tEnter task status: ');
            rl3.prompt();
            rl3.on('line', (line) => {
                if (line) {
                  new_task_entry.status = line.trim();
                }
                else {
                  new_task_entry.status = 'No task status provided.';
                }
                resolve();
            });
          });
        }).then(() => {
          rl3.removeAllListeners();
          rl3.setPrompt('');          
          app.AsyncWriteNewTask(new_task_entry);
          rl_main = new Object(rl_obj);
          rl_main.setPrompt(repeat_menu_prompt);
          rl_main.prompt();
          AddLineEventListener();
        });     
        break; 
      case '3'://todo
        let tasks = [];
        let task_title;
        rl_main.removeAllListeners();
        rl_main.setPrompt('');
        new Promise((resolve) => {          
          rl1 = new Object(rl_obj);
          rl1.setPrompt(`\t-----Update Task's Status-----\n`+
                        '\tEnter task title: ');
          rl1.prompt();
          rl1.on('line', (line) => {
            if (line) { // needs validation
              task_title = line.trim();
              resolve();
            }
            else {
              rl1.setPrompt('\n\tThe Task title entered was not valid.\n'+
                             `\t${repeat_menu_prompt}\n` );
              rl1.prompt();               
              AddLineEventListener(); 
            }            
          });
        }).then(() => {
          return new Promise(async function (resolve) {
            let file_content = await app.AsyncReadFileContent();
            if (file_content) {
              resolve(file_content);
            }
          });
        }).then((file_content) => {
          return new Promise(async function (resolve) {
            tasks = JSON.parse(file_content);
            if (tasks.length > 0) {
              let task_obj = null;
              task_obj = await AsyncFindTask(tasks, task_title);
              let async_find = setTimeout(() => {
                if (!task_obj) {
                  clearTimeout(async_find);
                  resolve(null);
                }
              }, 2000);
              let find_task = setInterval(() => {
                if (task_obj) {
                  clearInterval(find_task);
                  resolve(task_obj);           
                } 
              }, 200);
            }
          });
        }).then((matched_obj) => {
          return new Promise((resolve) => {
            rl1.removeAllListeners();
            rl1 = null;
            rl2 = new Object(rl_obj);
            if (matched_obj) {
              let set_prompt = '\n\t****************************************Located Task****************************************\n'+
                              `\t${"TITLE".padEnd(35)}${"DESCRIPTION".padEnd(45)}${"STATUS"}\n`+
                              `\t${"-----".padEnd(35)}${"-----------".padEnd(45)}${"------"}\n`;
              set_prompt += `\t${matched_obj.title.padEnd(25)}${matched_obj.description.padEnd(55)}${matched_obj.status}\n`;
              set_prompt += '\n\tEnter new task status: ';
              rl2.setPrompt(set_prompt);
              rl2.prompt();
              rl2.on('line', (line) => {
                if (line) {// needs more validation [isAlphanumeric]
                  resolve(line.trim());
                }
                else {
                  rl2.setPrompt('\n\tThe task status entered was not valid.\n'+
                              `\t${repeat_menu_prompt}\n` );
                  rl2.prompt();               
                  AddLineEventListener();
                }
              });
            }
            else {
              rl2.setPrompt('\n\tThe Task title entered was not valid.\n'+
                             `\t${repeat_menu_prompt}\n` );
              rl2.prompt();               
              AddLineEventListener(); 
            }              
          });
        }).then((status_update) => {
          return new Promise(async function (resolve) {
            let updated_tasks = await AsyncReplaceTaskStatus(tasks, task_title, status_update);

            let tasks_update = setInterval(() => {
              if (updated_tasks) {
                clearInterval(tasks_update);
                resolve(updated_tasks);           
              } 
            }, 200);
            resolve(updated_tasks);
          });
        }).then((updated_tasks_to_writefile) => {
            app.AsyncWriteUpdatedJson(updated_tasks_to_writefile);
        }).then(() => {
          rl2.removeAllListeners();
          rl2 = null;
          rl3 = new Object(rl_obj);
          rl3.setPrompt(repeat_menu_prompt);
          rl3.prompt();
          AddLineEventListener();
        });
        break;
      case '4': //remove after development and QA
        let file_content = app.Read_file_content();
        if (file_content) {
          console.log('FILE CONTENT', file_content);
        }
        rl1 = new Object(rl_obj);
        rl1.setPrompt(repeat_menu_prompt);
        rl1.prompt();
        AddLineEventListener();
        break;
      case '5': // ToDo Delete a task
      rl1 = new Object(rl_obj);
        let set_prompt_message = '\tRemove a task -- Under Construction :)';
        set_prompt_message += repeat_menu_prompt;
        rl1.setPrompt(set_prompt_message);
        rl1.prompt();
        AddLineEventListener();
        
          /* return new Promise(async function (resolve) {
            if (matched_obj) {
              let isDone = await app.AsyncDeleteTask(matched_obj);
              if (isDone) {
                resolve(matched_obj);
              }
            }
          }); */        
        break;
      case '6': //feature done Exit
        process.exit(0);
      default:
        //// needs more validation [isNumeric]
        console.log(`\tYou entered '${line.trim()}.' Please enter a corresponding number [1|2|3|4|5|6] to select an operation.`);
        break;
    }
  });
}

AddLineEventListener();

async function AsyncFindTask(tasks, task_title) {
  return new Promise((resolve) => {
    let task_obj = null;
    tasks.forEach((task) => {
      if (task) {
        task_obj = JSON.parse(task);
        if (task_obj && task_obj.title) {
          let title_to_lower = task_obj.title.toLowerCase();
          if (title_to_lower === task_title.toLowerCase()) {
            //task_obj.status = "New test value"; remove later
            resolve(task_obj);
          }
        }
      }      
    });
    resolve(null);
  });
}

async function AsyncReplaceTaskStatus(tasks, task_title, task_status) {
  return new Promise((resolve) => {
    let task_obj = null;
    let updated_tasks = [];
    tasks.forEach((task) => {
      if (task) {
        task_obj = JSON.parse(task);
        if (task_obj && task_obj.title) {
          let title_to_lower = task_obj.title.toLowerCase();
          if (title_to_lower === task_title.toLowerCase()) {
            let updated_task;
            task_obj.status = task_status;
            updated_task = JSON.stringify(task_obj);            
            updated_tasks.push(updated_task);
          }
          else {
            updated_tasks.push(task);
          }
        }
      }            
    });
    resolve(updated_tasks);
  });
}


