//List object will hold all tasks added by a user for a particular project
export class List {
    static counter = 1;

    constructor(name) {
        this.name = name;
        this.todolist = [];
        this.id = "list" + List.counter;
        ++List.counter;
    }


    addToList(todo) {
        console.log(todo);
        console.log(this.todolist);
        this.todolist.push(todo);
        console.log(this.todolist);
    }

    removeFromList(id) {
        for(let i = 0; i < this.todolist.length; ++i) {
            if(this.todolist[i].id === id) {
                this.todolist.splice(i, 1);
                break;
            }
        }
    }
}