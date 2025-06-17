import { format, parseISO } from "date-fns";

export class ToDo {

    static counter = 1;

    constructor(title, description, dueDate, priority, completed = false) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
        this.id = "task" + ToDo.counter;
        ++ToDo.counter;
    }

    changeCompletion() {
        this.completed = !this.completed;
    }

    infoNode() {
        const info = document.createElement("div");
        info.setAttribute("class", "details");

        const titledetailcontainer = document.createElement("div");
        const descriptiondetailcontainer = document.createElement("div");
        const duedatedetailcontainer = document.createElement("div");
        const prioritydetailcontainer = document.createElement("div");


        const titletitle = document.createElement("div");
        titletitle.textContent = "Title:"
        const descriptiontitle = document.createElement("div");
        descriptiontitle.textContent = "Description:"
        const duedatetitle = document.createElement("div");
        duedatetitle.textContent = "Due Date:"
        const prioritytitle = document.createElement("div");
        prioritytitle.textContent = "Priority:";

        const titlenode = document.createElement("div");
        const descriptionnode = document.createElement("div");
        const duedatenode = document.createElement("div");
        const prioritynode = document.createElement("div");

        titlenode.classList.add("titlenode");
        descriptionnode.classList.add("descriptionnode");
        duedatenode.classList.add("duedatenode");
        prioritynode.classList.add("prioritynode");

        titlenode.textContent = this.title;
        descriptionnode.textContent = this.description;

        const raw = this.dueDate;
        const date = parseISO(raw);
        const pretty = format(date, 'MMMM d yyyy');
        duedatenode.textContent = pretty;

        prioritynode.textContent = this.priority;

        info.appendChild(titletitle);
        info.appendChild(titlenode);

        info.appendChild(descriptiontitle);
        info.appendChild(descriptionnode);

        info.appendChild(duedatetitle);
        info.appendChild(duedatenode);

        info.appendChild(prioritytitle);
        info.appendChild(prioritynode);

        return info;
    }

}