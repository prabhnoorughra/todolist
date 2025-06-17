import { ToDo } from "./todos";
import { format, parseISO } from "date-fns";
import { saveToStorage } from "./storagehandler";

export function loadList(list, projects) { //ran to initialize and display lists and projects sidebar
    //displaying project sidebar with selected list marked active
    const projectNodes = document.querySelectorAll(".project");
    for(const projectNode of projectNodes) {
        if(projectNode.classList.contains(list.id)) {
            projectNode.classList.add("active");
        } else {
            projectNode.classList.remove("active");
        }
    }


    //clearing out parent for list we are about to display
    const parent = document.querySelector(".todolistdisplay");
    parent.replaceChildren();


    //intializing funcitonality for adding tasks to the list, replacing the form node with an updated form
    const modal = document.querySelector("#taskmodal");
    const addTask = document.createElement("button");
    addTask.textContent = "Add Task!";
    const oldform = document.querySelector("#taskform");
    const form = oldform.cloneNode(true);
    oldform.replaceWith(form);
    const cancelBtn = document.querySelector("#canceltask");
    addTask.classList.add("addtask");

    //show modal when add task is clicked
    addTask.addEventListener("click", () => {
        form.reset();
        modal.showModal();
    });

    //closemodal with no submit
    cancelBtn.addEventListener("click", () => {
        modal.close();
    });

    //handle submission of new task
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if(!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        const data = new FormData(form);
        const task = new ToDo(data.get("title"), data.get("description"), data.get("duedate"), data.get("priority"), false);
        list.addToList(task);
        modal.close();
        displayList(list, addTask, projects); //display updated list with same button functionality
        saveToStorage(projects);
    });

    const parentcontainer = document.querySelector(".todocontainer");
    parentcontainer.appendChild(addTask);


    //displaying actual todo list
    const listarr = list.todolist;
    if(listarr.length != 0) {
        displayList(list, addTask, projects);
    } else if(list.id === projects.projects[0].id) { //if Home Page is empty we do not let user Delete the list
        console.log("Home!");
        const home = document.createElement("div");
        home.classList.add("homelist");
        parent.appendChild(home);
    } else { //if list is empty we allow user to delete the list, which also moves us back to the Home List after
        const emptycontainer = document.createElement("div");
        emptycontainer.classList.add("emptycontainer");
        const empty = document.createElement("div");
        empty.textContent = "Empty List";
        empty.classList.add("emptylist");

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("emptydeletebtn");
        deleteBtn.textContent = "Delete Project";

        deleteBtn.addEventListener("click", () => {
            const projparent = document.querySelector(".projects");
            const projtodelete = document.querySelector("." + list.id);
            projparent.removeChild(projtodelete);
            projects.deleteProject(list.id);
            saveToStorage(projects);
        });

        emptycontainer.appendChild(empty);
        emptycontainer.appendChild(deleteBtn);
        parent.appendChild(emptycontainer);
    }
}

function displayList(list, addbtn, projects) { //display ToDo list items, with items having a checkbox and 3 buttons
    const parent = document.querySelector(".todolistdisplay");
    parent.replaceChildren();
    const listarr = list.todolist;
    for(const item of listarr) { //iterating over todo list to manage the buttons/display of each item
        const itemnode = document.createElement("div");
        itemnode.classList.add("task");
        if(item.completed) {
            itemnode.classList.add("completed");
        } else {
            itemnode.classList.remove("completed");
        }

        //managing display based on the items priority
        const prioritydiv = document.createElement("div");
        if(item.priority === "Low") {
            prioritydiv.classList.add("low");
            prioritydiv.classList.remove("medium");
            prioritydiv.classList.remove("high");
        } else if(item.priority === "Medium") {
            prioritydiv.classList.remove("low");
            prioritydiv.classList.add("medium");
            prioritydiv.classList.remove("high");
        } else {
            prioritydiv.classList.remove("low");
            prioritydiv.classList.remove("medium");
            prioritydiv.classList.add("high");
        }

        //adding functionality to checkbox to allow users to mark a task as completed
        const completedDiv = document.createElement("div");
        completedDiv.classList.add("checkboxcontainer");
        const completedBox = document.createElement("input");
        completedBox.type = "checkbox";
        completedBox.classList.add("checkbox");
        completedBox.id = "checkboxtask";
        completedBox.name = "completed";
        const completedText = document.createElement("label");
        completedText.classList.add("completedText");
        completedText.for = "checkboxtask";
        completedText.textContent = "Completed: ";
        completedDiv.appendChild(completedText);
        completedDiv.appendChild(completedBox);

        if(item.completed === true) {
            completedBox.checked = "true";
        } else {
            completedBox.removeAttribute("checked");
        }

        completedBox.addEventListener("click", () => {
            item.changeCompletion();
            if(item.completed) {
                itemnode.classList.add("completed");
            } else {
                itemnode.classList.remove("completed");
            }
            saveToStorage(projects);
        });

        //creating the Task's actual display of the title and due date
        const title = document.createElement("div");
        title.classList.add("titletaskdisplay");
        title.textContent = item.title;

        const duedatenode = document.createElement("div");
        duedatenode.classList.add("duedatetaskdisplay");
        const rawdate = item.dueDate;
        const date = parseISO(rawdate);
        const pretty = format(date, 'MMMM d yyyy');
        duedatenode.textContent = pretty; //visually appealing date formatting

        //allow users to delete a task
        const deleteTask = document.createElement("button");
        deleteTask.textContent = "Delete";
        deleteTask.addEventListener("click", () => {
            list.removeFromList(item.id);
            saveToStorage(projects);
            loadList(list, projects);
        });

        //intitializing unique modal/form for each task so users can edit the values of the task directly
        const modalcontainer = document.querySelector(".modalcontainer");
        modalcontainer.replaceChildren();
        const editTask = document.createElement("button");
        editTask.textContent = "Edit";
        //allow users to edit a task
        editTask.addEventListener("click", () => {
            const newModal = makeEditForm(item, list, projects);
            //const modal = document.querySelector("#editmodal");
            newModal.showModal();
        });

        //allow users to view the entire details of the task
        const detailsTask = document.createElement("button");
        detailsTask.textContent = "Details";
        detailsTask.addEventListener("click", () => {
            const modal = document.querySelector("#detailmodal");
            modal.replaceChildren();
            const cancelmodalBtn = document.createElement("button");
            cancelmodalBtn.classList.add("detailclose");
            cancelmodalBtn.textContent = "Close";
            cancelmodalBtn.addEventListener("click", () => {
                modal.close();
            });
            const detailNode = item.infoNode();
            modal.appendChild(detailNode);
            modal.appendChild(cancelmodalBtn);
            modal.showModal();
        });

        const buttoncontainer = document.createElement("div");
        buttoncontainer.classList.add("buttoncontainer");
        buttoncontainer.appendChild(detailsTask);
        buttoncontainer.appendChild(editTask);
        buttoncontainer.appendChild(deleteTask);

        itemnode.appendChild(prioritydiv);
        itemnode.appendChild(completedDiv);
        itemnode.appendChild(title);
        itemnode.appendChild(duedatenode);
        itemnode.appendChild(buttoncontainer);
        parent.appendChild(itemnode);
        //scroll into view the new task when added
        itemnode.scrollIntoView({ behavior: "auto", block: "nearest"});
    }
    parent.appendChild(addbtn);
}



export function displayProjects(projects) { //display the project sidebar and allow users to switch between projects with a click
    const parent = document.querySelector(".projects");
    parent.replaceChildren();

    for(const list of projects.projects) {
        const listNode = document.createElement("div");
        listNode.textContent = list.name;
        listNode.classList.add("project");
        listNode.classList.add(list.id);

        listNode.addEventListener("click", () => {
            loadList(list, projects);
        });

        parent.appendChild(listNode);
        listNode.scrollIntoView({ behavior: "auto", block: "nearest"});
    }
}

//create the unique forms for editing a task, showing the current items values as already filled in
//allowing users to edit the values directly
function makeEditForm(item, list, projects) {
    const modalcontainer = document.querySelector(".modalcontainer");
    const modal = document.querySelector("#emptymodal");
    const form = document.querySelector("#editform");


    const newForm = form.cloneNode(true);
    const newModal = modal.cloneNode(true);
    modalcontainer.appendChild(newModal);
    newModal.appendChild(newForm);

    const radiotoedit = "#edit" + item.priority;
    const radioInput = newForm.querySelector(radiotoedit);
    const titleInput = newForm.querySelector("#edittitle");
    const descriptionInput = newForm.querySelector("#editdescription");
    const dueDateInput = newForm.querySelector("#editduedate");

    titleInput.setAttribute("value", item.title);
    descriptionInput.setAttribute("value", item.description);
    dueDateInput.setAttribute("value", item.dueDate);
    radioInput.checked = true;

    const canceledit = newForm.querySelector("#editcancel");
    canceledit.addEventListener("click", () => {
        newModal.close();
    });

    newForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(newForm);
        item.title = data.get("title");
        item.description = data.get("description");
        item.dueDate = data.get("duedate");
        item.priority = data.get("priority");
        item.completed = item.completed;

        newModal.close();
        loadList(list, projects);
        saveToStorage(projects);
    });
    return newModal;
}