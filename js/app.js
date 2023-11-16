const todoinput = document.getElementById('todo-input')
const todobtn = document.querySelector('.add')
/************************************************* */
const todo_item = document.querySelector('.todo-item')
const todo_inprogress = document.querySelector('.todo-inprogress')
const todo_done = document.querySelector('.todo-done')
const body = document.querySelector('body')

let itemlist = []

let data = {
    title: {},
    status: {},
}

let date;

const loadTodoListItem = () => {
    let items = JSON.parse(localStorage.getItem("todo"))
    if (items) {
        itemlist = [...items]
        itemlist.forEach(element => {
            switch (element.status) {
                case "todo":
                    const itemtodo2 = new cardtodo(new todoItem(`${element.title}`, `${element.status}`))
                    todo_item.append(itemtodo2.render())

                    break;
                case "inprogress":
                    const iteminprogress = new cardtodo(new todoItem(`${element.title}`, `${element.status}`))
                    const renderinprogress = iteminprogress.render()
                    todo_inprogress.append(renderinprogress)
                    renderinprogress.classList.remove("bg-slate-100")
                    renderinprogress.classList.add("bg-yellow-200")
                    break;
                case "done":
                    const itemdone = new cardtodo(new todoItem(`${element.title}`, `${element.status}`))
                    const renderdone = itemdone.render()
                    todo_done.append(renderdone)
                    renderdone.classList.remove("bg-slate-100")
                    renderdone.classList.add("bg-green-400")
                    break;
                default:
                    break;
            }
        });
    }
}

class todoItem {
    title;
    status;
    constructor(title, status) {
        this.title = title
        this.status = status
    }
}
class cardtodo {
    todoItem;
    constructor(todoItem) {
        this.todoItem = todoItem
    }
    render() {
        let idrandom = Math.floor(Math.random() * 100000)
        const item = document.createElement('div')
        item.draggable = "true"
        item.id = idrandom
        item.classList = "bg-slate-100 p-4 flex flex-col rounded-md my-2 min-w-full max-w-full whitespace-wrap shadow-md"
        item.innerHTML =`<p class="font-normal self-start text-gray-800 dark:text-black">${this.todoItem.title}</p>
            <em class="text-xs text-left ">status:${this.todoItem.status}</em>`
        const button = document.createElement('button')
        button.classList = "self-end focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        button.innerText = "Delete"
        button.type = "button"
        item.append(button)
        button.addEventListener('click', (event) => {
            const todo = event.target.parentNode
            const index = itemlist.findIndex(item => item.title === todo.firstElementChild.innerText)
            if (index > -1) {
                itemlist.splice(index, 1);
            }
            localStorage.setItem("todo", JSON.stringify(itemlist))

            todo.remove()
        })
        item.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData("id", event.target.id)
        })
        return item
    }

}
class custom {
    title;
    constructor (title){
        this.title = title
    }
    render(){
        let cardalert = document.createElement('div');
        cardalert.classList = "w-full h-full messege1 absolute dilog top-0 left-0"
        let divcardalert = document.createElement('div')
        divcardalert.classList = "text-center px-2 py-3 flex flex-col m-auto mt-48 w-40 messege"
        divcardalert.innerHTML= `<h1 class="text-white text-xl">${this.title}</h1>`
        let button = document.createElement('button')
        button.classList="self-end hover:bg-slate-100 hover:rounded-lg px-4 py-2"
        button.innerText = "OK"
        divcardalert.append(button)
        cardalert.append(divcardalert)
        button.addEventListener('click' , ()=>{
            cardalert.remove()
        })
        return cardalert
    }
}


todobtn.addEventListener('click', () => {
    if (itemlist.length > 0) {
        if (itemlist.findIndex(item => item.title == todoinput.value)) {
            
            if (todoinput.value.length < 4) {
                let card = new custom(`"${todoinput.value}" Not valid`)
                body.append(card.render())
            } else {
                let data = {
                    title: {},
                    status: {},
                }
                data.title = todoinput.value
                data.status = 'todo'
                const result = new cardtodo(new todoItem(`${data.title}`, `${data.status}`))
                todo_item.append(result.render())
                itemlist.push(data)
                localStorage.setItem('todo', JSON.stringify(itemlist))
            }
        }
        else{
            let card = new custom(`"${todoinput.value}" The entered value is duplicated`)
                body.append(card.render())
        }

    }
    else{
        if (todoinput.value.length < 4) {
            let card = new custom(`"${todoinput.value}"Not valid`)
            body.append(card.render())
        } 
        else {
            let data = {
                title: {},
                status: {},
            }
            data.title = todoinput.value
            data.status = 'todo'
            const result = new cardtodo(new todoItem(`${data.title}`, `${data.status}`))
            todo_item.append(result.render())
            itemlist.push(data)
            localStorage.setItem('todo', JSON.stringify(itemlist))
        }
    }
})

// //////////////////////////////////////////////darg and drop//////////////////////////////////////////////
todo_item.addEventListener('dragover', (event) => {
    event.preventDefault();
})
todo_inprogress.addEventListener('dragover', (event) => {
    event.preventDefault();
})
todo_done.addEventListener('dragover', (event) => {
    event.preventDefault();
})
//////////////////////////////////////////////
todo_item.addEventListener('drop', (event) => {
    event.preventDefault();
    date = event.dataTransfer.getData("id");
    event.target.append(document.getElementById(date));
    let stutodo = document.getElementById(date)
    switch (data.status) {
        case "inprogress":
            stutodo.classList.remove('bg-yellow-200')
            stutodo.classList.add('bg-slate-100')
            break;
        case "done":
            stutodo.classList.remove('bg-green-400')
            stutodo.classList.add('bg-slate-100')
            break;
    }
    let element = event.target
    let childelement = element.children[1]
    let text = childelement.children[0]
    let index = itemlist.findIndex(element => element.title == text.innerText)
    if (index > -1) {
        itemlist.splice(index, 1);
    }
    data.title = text.innerText
    data.status = "todo"
    const result = new cardtodo(new todoItem(`${data.title}`, `${data.status}`))
    itemlist.push(data)
    localStorage.setItem("todo", JSON.stringify(itemlist))
    data.status = 'todo'
})

todo_inprogress.addEventListener('drop', (event) => {
    event.preventDefault();
    date = event.dataTransfer.getData("id");
    let card = document.getElementById(date);
    event.target.append(card);

    switch (data.status) {
        case "todo":
            card.classList.remove('bg-slate-100')
            card.classList.add('bg-yellow-200')
            break;
        case "done":
            card.classList.remove('bg-green-400')
            card.classList.add('bg-yellow-200')
            break;
    }
    let cardtext = card.children[0].innerText
    let index = itemlist.findIndex(element => element.title == cardtext)
    if (index > -1) {
        itemlist.splice(index, 1);
    }
    data.title = card.children[0].innerText
    data.status = "inprogress"
    const result = new cardtodo(new todoItem(`${data.title}`, `${data.status}`))
    itemlist.push(data)
    localStorage.setItem("todo", JSON.stringify(itemlist))
    data.status = 'inprogress'
})

todo_done.addEventListener('drop', (event) => {
    event.preventDefault();
    date = event.dataTransfer.getData("id");
    let card = document.getElementById(date)
    event.target.append(card);
    switch (data.status) {
        case "todo":
            card.classList.remove('bg-slate-100')
            card.classList.add('bg-green-400')
            break;
        case "inprogress":
            card.classList.remove('bg-yellow-200')
            card.classList.add('bg-green-400')
            break;
    }
    let cardtext = card.children[0].innerText
    let index = itemlist.findIndex(element => element.title == cardtext)
    if (index > -1) {
        itemlist.splice(index, 1);
    }
    data.title = cardtext
    data.status = "done"
    const result = new cardtodo(new todoItem(`${data.title}`, `${data.status}`))
    itemlist.push(data)
    localStorage.setItem("todo", JSON.stringify(itemlist))
    data.status = 'done'
})
// //////////////////////////////////////////////end//////////////////////////////////////////////
loadTodoListItem()