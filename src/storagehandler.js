import { Projects } from "./projects";
import { List } from "./lists";
import { ToDo } from "./todos";


//load Projects/Tasks from local storage if they exist, otherwise initialize Home project
export function loadProjectsFromStorage() {
  const raw = localStorage.getItem('myProjects');
  if (!raw) {
    const projectlist = new Projects();
    projectlist.addProject("Home");
    return projectlist;
  }       // nothing saved

  const data = JSON.parse(raw);

  const projectlist = new Projects();
  projectlist.projects = data.projects.map(listData => {
    // restore List objects
    const list = new List(listData.name);
    list.id = listData.id;
    // restore each ToDo object
    list.todolist = listData.todolist.map(td => {
      const todo = new ToDo(
        td.title,
        td.description,
        td.dueDate,      
        td.priority,
        td.completed
      );
      return todo;
    });
    return list;
  });

  console.log(projectlist);
  return projectlist;
}

//Save all projects and tasks in each project to Local Memory
export function saveToStorage(projectlist) {
    // save projectlist each time, rewriting previous saves with latest updated version
    console.log("saving!");
    localStorage.setItem(
    'myProjects',
    JSON.stringify(projectlist)
    );
}