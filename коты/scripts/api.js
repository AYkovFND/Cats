// ## API сервера

// - GET (https://cats.petiteweb.dev/api/single/:user/show) - отобразить всех котиков
// - GET (https://cats.petiteweb.dev/api/single/:user/ids) - отобразить все возможные айди котиков
// - GET (https://cats.petiteweb.dev/api/single/:user/show/:id) - отобразить конкретного котика
// - POST (https://cats.petiteweb.dev/api/single/:user/add) - добавить котика
// - PUT (https://cats.petiteweb.dev/api/single/:user/update/:id) - изменить информацию о котике
// - DELETE (https://cats.petiteweb.dev/api/single/:user/delete/:id)- удалить котика из базы данных

const CONFIG_API = {
    url: 'https://cats.petiteweb.dev/api/single/AnastasiaMysnik',
    
    headers: {
        'Content-Type': 'application/json'
    }
}

export class API {
    constructor(config) {
        this._url = config.url;
        this._headers = config.headers;
    }

    _onResponse(res) {//обрабатывает ответ от сервера
        //если респонс ок, то вернем json а иначе развернем ответ и отдадим сообщение:
        return res.ok ? res.json() : Promise.reject({...res, message: 'Ошибка сервера'})
    }

    getAllCats() {//запрашиваем у сервера всех котов
        return fetch(`${this._url}/show`, {
            method: 'GET'
        }).then(this._onResponse)
    }

    addNewCat(data) {// добавляем в базу нового кота
        return fetch(`${this._url}/add`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: this._headers
        }).then(this._onResponse)
    }

    updateCatById(idCat, data) {
        return fetch(`${this._url}/update/${idCat}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: this._headers
        }).then(this._onResponse)
    }

    deleteCatById(idCat){
        return fetch(`${this._url}/delete/${idCat}`, {
             method: 'DELETE',
         }).then(this._onResponse)
     }
}

export const api = new API(CONFIG_API);

