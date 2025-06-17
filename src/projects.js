import { List } from "./lists";
import { ToDo } from "./todos";
import { displayProjects, loadList } from "./DOM";

//Projects object will hold all projects added by user
export class Projects {
    constructor() {
        this.projects = [];
    }

    addProject(name) {
        const project = new List(name);
        this.projects.push(project);
        displayProjects(this);
    }

    deleteProject(id) {
        for(let i = 0; i < this.projects.length; ++i) {
            if(this.projects[i].id === id) {
                this.projects.splice(i, 1);
                break;
            }
        }
        displayProjects(this);
        loadList(this.projects[0], this);
    }


}