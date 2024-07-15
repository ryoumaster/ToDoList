class toDo{
    constructor(atividade, dia, mes, ano, descricao){
        this.atividade = atividade;
        this.dia = dia;
        this.mes = mes;
        this.ano = ano;
        this.descricao = descricao;
    }

    validateToDo(){
        for(let i in this){
            if(this[i] === undefined || this[i] === ""){
                return false;
            }
        }
        return true;
    }
    
}

function adicionarTarefa(){
    let atividade, dia, mes, ano, descricao;
    atividade = String(document.getElementById('activity').value);
    dia = Number(document.getElementById('day').value);
    mes = Number(document.getElementById('month').value);
    ano = Number(document.getElementById('year').value);
    descricao = String(document.getElementById('description').value)


    const ToDoItem = new toDo(atividade, dia, mes, ano, descricao);

    if(ToDoItem.validateToDo()){
        databaseItem.createToDoDatabase(ToDoItem);
    }

}








class database{
    constructor(){
        const id = localStorage.getItem('id');

        if(id === null){
            localStorage.setItem('id', 0);
        }
    }

    createToDoDatabase(ToDoItem) {
        const id = getNextId();
        localStorage.setItem(id, JSON.stringify(ToDoItem));
        localStorage.setItem('id', id);
    }

    removeToDoDatabase(id){
        localStorage.removeItem(id);
    }

    carregarToDo(){
        const listToDos = Array()
        const id = localStorage.getItem('id');

        for(let i = 1; i <= id; i++){
            const todos = JSON.parse(localStorage.getItem(i));

            if(todos === null){
                continue; //vai para o proximo looping
            }

            todos.id = i;
            listToDos.push(todos)
        }
        return listToDos
    }

    searchOnDatabase(ToDos){
        

        let filteredToDos = this.carregarToDo();

        if(ToDos.dia !== ""){
            filteredToDos = filteredToDos.filter(t => t.dia === ToDos.dia);
        }
        if(ToDos.mes !== ""){
            filteredToDos = filteredToDos.filter(t => t.mes === ToDos.mes);
        }
        if(ToDos.ano !== ""){
            filteredToDos = filteredToDos.filter(t => t.ano === ToDos.ano);
        }
        if(ToDos.descricao !== ""){
            filteredToDos = filteredToDos.filter(t => t.descricao === ToDos.descricao);
        }
        if(ToDos.atividade !== ""){
            filteredToDos = filteredToDos.filter(t => t.atividade === ToDos.atividade);
        }

        return filteredToDos
    }
}


const databaseItem = new database();

function getNextId(){
    const nextId = localStorage.getItem('id');
    
    return parseInt(nextId)+1;
}

function apresentarToDos(toDos = databaseItem.carregarToDo()){
    const showToDo = document.getElementById('showToDo');
    showToDo.innerHTML = '';
    
    toDos.forEach((t) => {
        const row = showToDo.insertRow()

        row.insertCell(0).innerHTML = `${t.dia}/${t.mes}/${t.ano}`
        row.insertCell(1).innerHTML = `${t.atividade}`
        row.insertCell(2).innerHTML = `${t.descricao}`

        const btn = document.createElement('button');
        btn.className = 'btn btn-danger'
        btn.id = t.id
        btn.innerHTML =  'Delete'
        btn.onclick = () => {
            const id = t.id;
            databaseItem.removeToDoDatabase(id);

            window.location.reload();
        }

        row.insertCell(3).append(btn);
    });
}

function searchToDos(){
    let atividade, dia, mes, ano, descricao;
    atividade = String(document.getElementById('activity').value);
    dia = Number(document.getElementById('day').value);
    mes = Number(document.getElementById('month').value);
    ano = Number(document.getElementById('year').value);
    descricao = String(document.getElementById('description').value)


    const ToDoItem = new toDo(atividade, dia, mes, ano, descricao);

    const ToDos = databaseItem.searchOnDatabase(ToDoItem)
    apresentarToDos(ToDos)
}

document.addEventListener('DOMContentLoaded', () =>{
    if(document.body.contains(document.getElementById('showToDo'))){
        apresentarToDos();
    }
})