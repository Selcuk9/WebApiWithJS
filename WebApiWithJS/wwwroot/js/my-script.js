let temp = document.getElementsByName('userForm')[0];
const getUrl = 'https://localhost:44347/api/users';
let allElements = [];

/////////////////////Internet sort
document.addEventListener('DOMContentLoaded', () => {

    const getSort = ({ target }) => {
        const order = (target.dataset.order = -(target.dataset.order || -1));
        const index = [...target.parentNode.cells].indexOf(target);
        const collator = new Intl.Collator(['en', 'ru'], { numeric: true });
        const comparator = (index, order) => (a, b) => order * collator.compare(
            a.children[index].innerHTML,
            b.children[index].innerHTML
        );

        for (const tBody of target.closest('table').tBodies)
            tBody.append(...[...tBody.rows].sort(comparator(index, order)));

        for (const cell of target.parentNode.cells)
            cell.classList.toggle('sorted', cell === target);
    };

    document.querySelectorAll('.table thead').forEach(tableTH => tableTH.addEventListener('click', () => getSort(event)));

});
/////////////////////////////////////

async function getAllUsers() {
    const response = await fetch(getUrl, {
        method: "GET",
        headers: { "Accept": "application/json" },
    });
    if (response.ok) {
        const users = await response.json();
        let rows = document.querySelector('tbody');
        users.forEach(user => {
            // добавляем полученные элементы в таблицу
            rows.append(row(user));
        });
    }
}


async function GetUser(id) {
    const response = await fetch('api/users/' + id, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
    });
    if (response.ok === true) {
        const user = await response.json();
        const form = document.forms['userForm'];
        form.elements['id'].value = user.id;
        form.elements['name'].value = user.name;
        form.elements['age'].value = user.age;
    }


}
getAllUsers();



async function updateUser(userId, userName, userAge) {
    const response = await fetch('api/users', {
        method: 'PUT',
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify( {
            
            id: parseInt(userId, 10),
            name: userName,
            age: parseInt(userAge,10),
        })
    });
    if (response.ok === true) {
        const user = await response.json();
        reset();
        document.querySelector(`tr[data-rowid = "${userId}"]`).replaceWith(row(user));
    }


}

async function createUser(userName, userAge) {
    const response = await fetch('api/users', {
        method: 'POST',
        headers: { "Accept": "application/json", "Content-type": "application/json" },

        body: JSON.stringify({
            name: userName,
            age: parseInt(userAge, 10),
        })
    });
    if (response.ok) {
        const user = await response.json();
        reset();
        document.querySelector('tbody').append(row(user));
    }
}

document.forms['userForm'].addEventListener('submit', e => {
    e.preventDefault();
    const form = document.forms['userForm'];
    const id = form.elements['id'].value;
    const name = form.elements['name'].value;
    const age = form.elements['age'].value;

    if (id == 0) {
        createUser(name, age);
    }
    else {
        updateUser(id, name, age);
    }
});

async function deleteUser(userId) {
    const response = await fetch('api/users/' + userId, {
        method: "DELETE",
        headers: { "Accept": "application/json" },
    });
    if (response.ok) {
        const user = await response.json();
        //document.querySelector('tr[data-rowid =' + '"' + user.id + '"' + ']').remove();
        document.querySelector(`tr[data-rowid = "${user.id}"]`).remove();
    }

}
    function row(user) {

    const rowTr = document.createElement('tr');
    rowTr.setAttribute('data-rowid', user.id);

    const idTd = document.createElement('td');
    idTd.append(user.id);
    rowTr.append(idTd);

    const nameTd = document.createElement('td');
    nameTd.append(user.name);
    rowTr.append(nameTd);

    const ageTd = document.createElement('td');
    ageTd.append(user.age);
    rowTr.append(ageTd);

    const changeDelTd = document.createElement('td');
    const changeLink = document.createElement('a');
    changeLink.setAttribute('data-id', user.id);
    changeLink.setAttribute('style', 'cursor:pointer;padding:15px;');
    changeLink.append('Изменить');
        changeLink.addEventListener('click', e => {
            e.preventDefault();
        GetUser(user.id);
    });
    changeDelTd.append(changeLink);

    const removeLink = document.createElement('a');
    removeLink.setAttribute('data-id', user.id);
    removeLink.setAttribute('style', 'cursor:pointer;padding:15px;');
    removeLink.append('Удалить');
    removeLink.addEventListener('click', e => {
        e.preventDefault();
        deleteUser(user.id);
    });
    changeDelTd.append(removeLink);

        rowTr.append(changeDelTd);
        allElements.push(rowTr);    
    return rowTr;
}


//const elementHTML = document.getElementById('header-tr').children;

//for (let i = 0; i < elementHTML.length; i++) {
//    elementHTML[i].addEventListener('click', function (event) {
//        let target = event.target;
//        if (target.classList.contains('header-id')) {
//            allElements.forEach(elHTML => {
                


//            });
//        }
//    });
//}


//function sortElements(elementTh) {
    
//}

document.getElementById('reset').addEventListener('click', function () {
    reset();
});
function reset() {
    const form = document.forms['userForm'];
    form.id.value = 0;
    form.name.value = '';
    form.age.value = '';
}