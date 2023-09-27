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
                    '\n\t4. Remove a task.'+
                    '\n\t5. Exit Task Manager.\n';
const repeat_menu_prompt = '\n\n\t**************************************************************************'+
                           '\n\tEnter a number to select an operation.'+
                           '\n\t1. List all tasks.'+
                           '\n\t2. Add new task.'+
                           '\n\t3. Update task status.'+
                           '\n\t4. Remove a task.'+
                           '\n\t5. Exit Task Manager.\n';
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
      
      case '1'://feature done        
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
                if (typeof task_obj !== 'undefined') {  
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
      case '2'://feature done
        rl_main.removeAllListeners();
        rl_main.setPrompt('');
        new_task_entry = null;
        new_task_entry = Object.create(Newtask);
        new Promise((resolve) => {          
          rl1 = new Object(rl_obj);
          rl1.setPrompt('-----Add New Task-----'+
                        '\nEnter task title: ');
          rl1.prompt();
          rl1.on('line', (line) => {
            if (line) {
              new_task_entry.title = line;
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
            rl2.setPrompt('\nEnter task description: ');
            rl2.prompt();
            rl2.on('line', (line) => {
              if (line) {
                new_task_entry.description = line;
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
            rl3.setPrompt('\nEnter task status: ');
            rl3.prompt();
            rl3.on('line', (line) => {
                if (line) {
                  new_task_entry.status = line;
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
        app.Write_log_entry('\nTest log entry - only - ASYNC.');
        //console.log('Update task status: \n');
        break;
      case '4': //todo
        let file_content = app.Read_file_content();
        if (file_content) {
          console.log('FILE CONTENT', file_content);
        }      
        
        //console.log('Remove a task: ');
        break;
      case '5': //feature done
        process.exit(0);
      default:
        console.log(`You entered '${line.trim()}.' Please enter a corresponding number [1|2|3|4|5] to select an operation.`);
        break;
    }
  });
}

AddLineEventListener();


