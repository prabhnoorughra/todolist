import "./styles.css"
import { displayProjects, loadList } from "./DOM"
import { ToDo } from "./todos"
import { List } from "./lists"
import { Projects } from "./projects";
import { loadProjectsFromStorage, saveToStorage } from "./storagehandler";



const projectlist = loadProjectsFromStorage(); 


displayProjects(projectlist);
loadList(projectlist.projects[0], projectlist); //Load home todo list

const addProject = document.querySelector("#addproject");
const dialog = document.querySelector("#projectmodal");
const pform = document.querySelector("#projectform");
const cancelButton = document.querySelector("#cancelproject");

//button/form for add project modal
addProject.addEventListener("click", () => {
    pform.reset();
    dialog.showModal();
});

cancelButton.addEventListener("click", () => {
    dialog.close();
});

pform.addEventListener("submit", (e) => {
    e.preventDefault();
    if(!pform.checkValidity()) {
        pform.reportValidity();
        return;
    }
    const data = new FormData(pform);
    projectlist.addProject(data.get("title"));
    dialog.close();
    loadList(projectlist.projects[projectlist.projects.length - 1], projectlist);
    saveToStorage(projectlist);
});
