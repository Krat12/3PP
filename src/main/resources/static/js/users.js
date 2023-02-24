//----------------------------Вспомогталеьные переменные---------------------------//

  //Шаблон URL для запроса(получение всех пользователей)
 const url = "http://localhost:8080/rest/users";
fetch(url).then(rez=>rez.json()).then(data=>console.log(data))
 //Строка формирующая HTML код для вывода всех пользователей в таблицу
 let temp = '';
 //Переменная нажатия мышкой в зоне таблицы(сделана так как querySelect не находит элементы созданные спомощью temp)
 const editU = document.querySelector('#allUsers');
//----------------------------Вспомогталеьные функции---------------------------//

//Функция для обновления строки изменяемого пользователя(без перезагрузки)
 let getLine = function (data) {
        let role = '';
        data.roles.forEach(r => {
            role += r.role + " ";
        })
        let line = '<td>' + data.id + '</td>\n' +
            '<td>' + data.firstName + '</td>\n' +
            '<td>' + data.lastName + '</td>\n' +
            '<td>' + data.email + '</td>\n' +
            '<td>' + role + '</td>\n' +
            '<td>' + '<input id="btnEdit" value="Edit" type="button" ' +
            'class="btn-info btn edit-btn" data-toggle="modal" data-target="#editUser" ' +
            'data-id="' + data.id + '">' + '</td>' +

            '<td>' + '<input id="btnDelete" value="Delete" type="button" class="btn btn-danger del-btn" ' +
            'data-toggle="modal" data-target="#deleteUser" data-id=" ' + data.id + ' ">' + '</td>';
        return line;
    };

 //Функция вывода всех пользователей(используется так же для вывода нового пользователя без перезагрузки страницы).
 let writeAllUsers = function (data) {
        data.forEach((user) => {
            let Role = '';
            user.roles.forEach(r => {
                Role += r.role + " ";
            })
            temp +=
                '<tr id=' + user.id + '><td>' + user.id + '</td>\n' +
                '<td>' + user.firstName + '</td>\n' +
                '<td>' + user.lastName + '</td>\n' +
                '<td>' + user.email + '</td>\n' +
                '<td>' + Role + '</td>\n' +
                '<td>' + '<input id="btnEdit" value="Edit" type="button" ' +
                'class="btn-info btn edit-btn" data-toggle="modal" data-target="#editUser" ' +
                'data-id="' + user.id + '">' + '</td>' +

                '<td>' + '<input id="btnDelete" value="Delete" type="button" class="btn btn-danger del-btn" ' +
                'data-toggle="modal" data-target="#deleteUser" data-id=" ' + user.id + ' ">' + '</td></tr>';

        })
        document.getElementById("allUsers").innerHTML = temp;
    };
// Вспомогательная функция для формирования массива ролей при создании и изменении пользователя
function getSelectValues(select) {
    let result = [];
    let options = select && select.options;
    let opt;

    for (let i = 0; i < options.length; i++) {
        opt = options[i];

        if (opt.selected) {
            result.push(opt.value);
        }
    }
    return result;
}
//----------------------------Функции с запросами---------------------------//

// AJAX запрос для получения всех пользователей
 let getAllUsers = function () {
        fetch(url)
            .then(rez => {
                    rez
                        .json()
                        .then(data => writeAllUsers(data))
                }
            )
    }

 //Функция заполняющая модальное окно данными пользователя для редактирования(внутри выполняет AJAX запрос)
 let getForUpdateUser = function (button) {
        let id = button.target.getAttribute('data-id');
        fetch(url + '/' + id)
            .then(rez => {
                rez
                    .json()
                    .then(data => {
                        console.log(data);
                        document.getElementById('editId').value = data.id;
                        document.getElementById('editName').value = data.firstName;
                        document.getElementById('editLastName').value = data.lastName;
                        document.getElementById('editEmail').value = data.email;
                        document.getElementById('editPassword').value = data.password;
                    })
            })
    }

 //Функция заполняющая модальное окно данными пользователя для удаления(внутри выполняет AJAX запрос)
 let getForDeleteUser = function (button) {
        let id = button.target.getAttribute('data-id');
        fetch(url + '/' + id)
            .then(rez => {
                rez
                    .json()
                    .then(data => {
                        console.log(data);
                        document.getElementById('delId').value = data.id;
                        document.getElementById('delName').value = data.firstName;
                        document.getElementById('delLastName').value = data.lastName;
                        document.getElementById('delEmail').value = data.email;
                        document.getElementById('delPassword').value = data.password;
                    })
            })

    }
 //Функция контролирующая нажатия кнопки редактирования пользователя
 // (внутри выполнятеся AJAX запрос на изменение пользователя в БД)
 let editUser = function () {
        if (editU) {
            editU.addEventListener("click", (r) => {
                r.preventDefault();
                if (r.target.id == 'btnEdit') {
                    getForUpdateUser(r);

                    document.getElementById('editButton').addEventListener('click', (e) => {
                        e.preventDefault();
                        let a = document.getElementById('editRole');
                        let b = [];
                        getSelectValues(a).forEach(i => {
                            let t = {role: i};
                            b.push(t);
                        })
                        fetch(url, {
                            method: 'PUT', headers: {'Content-Type': 'application/JSON'},
                            body: JSON.stringify({
                                id: document.getElementById('editId').value,
                                firstName: document.getElementById('editName').value,
                                lastName: document.getElementById('editLastName').value,
                                email: document.getElementById('editEmail').value,
                                password: document.getElementById('editPassword').value,
                                roles: b,
                            })
                        }).then(rez => rez.json()).then((data) => {
                            document.getElementById('closeEditModal').click();
                            document.getElementById(data.id).innerHTML = getLine(data);
                        })
                    })
                }
            })
        }
    }
//Функция контролирующая нажатия кнопки удаления пользователя
// (внутри выполнятеся AJAX запрос на удаление пользователя в БД)
 let deleteUser = function () {
        if (editU) {
            editU.addEventListener("click", (r) => {
                r.preventDefault();
                let u = r.target.getAttribute('data-id');
                if (r.target.id == 'btnDelete') {
                    getForDeleteUser(r);
                    document.getElementById('deleteButton').addEventListener('click', (e) => {
                        e.preventDefault();
                        fetch(url + '/' + u, {method: 'DELETE',}
                        ).then(rez => rez.json()).then((data) => {
                            document.getElementById(data.id).remove();
                            document.getElementById('closeDeleteModal').click();
                        })
                    })
                }
            })
        }
    }
     //Функция создания пользователя
document.getElementById('createUser').addEventListener('click', (e) => {
    e.preventDefault();
    let a = document.getElementById('createRole');
    let b = [];
    getSelectValues(a).forEach(i => {
        let t = {role: i};
        b.push(t);
    })
    fetch(url, {
        method: 'POST', headers: {'Content-Type': 'application/JSON'},
        body: JSON.stringify({
            firstName: document.getElementById('name').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            roles: b,
        })
    }).then(rez => rez.json()).then((data) => {
        const dataArr = [];
        dataArr.push(data);
        console.log(data);
        writeAllUsers(dataArr);
        document.getElementById('admin-tab').click();
    })
})
//---------------------------Вызов функций вывода/изменения.удаления пользователя------------------------------------//

 //Вызов всех пользователей
 editUser();
 deleteUser();
 getAllUsers();

