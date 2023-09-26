import * as readline from 'node:readline';
import { stdin as process_input, stdout as process_output } from 'node:process';
import * as app from "./modules/app.js";
export { readline };

const menu_prompt = '\n\n**************************************************************************'+
                    '\n\t\t\tWelcome to Task Manager'+
                    '\nEnter a number to select an operation.'+
                    '\n1. List all tasks.'+
                    '\n2. Add new task.'+
                    '\n3. Update task status.'+
                    '\n4. Remove a task.'+
                    '\n5. Exit Task Manager.\n';
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
      
      case '1'://feature todo
        console.log('case 1 - List All Tasks feature');
        //rl_main.setPrompt('*****All Tasks*****\n');
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
          rl_main.setPrompt(menu_prompt);
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
      case '5'://feature todo
        console.log('case 5 - exit feature');
        break;
      default:
        console.log(`You entered '${line.trim()}.' Please enter a corresponding number [1|2|3|4|5] to select an operation.`);
        break;
    }
    //rl_obj.setPrompt("...");

    //rl_obj.prompt();

  /* }) .on('close', () => {
    console.log('m.js rl is closed\n-----------------------------');
    process.exit(0); */ 
  });
}

AddLineEventListener();


