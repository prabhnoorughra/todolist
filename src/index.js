import "./styles.css"
import { loadList } from "./DOM"
import { ToDo } from "./todos"
import { List } from "./lists"
import { Projects } from "./projects";



console.log("Yo!");

/* const defaultList = new List("Default");
loadList(defaultList); */

const projectlist = new Projects();
projectlist.addProject("Home");
console.log(projectlist);
loadList(projectlist.projects[0], projectlist);

const addProject = document.querySelector("#addproject");
const dialog = document.querySelector("#projectmodal");
const pform = document.querySelector("#projectform");
const cancelButton = document.querySelector("#cancelproject");

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
});




/* projectlist.addProject("Home");
projectlist.projects[1].addToList(new ToDo("Do homework", "please")); */
