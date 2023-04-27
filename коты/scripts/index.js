import { Card } from './card.js';
import { Popup } from './popup.js';
import { PopupImage } from './popup-image.js';
import { CatsInfo } from './cats-info.js';
import { api } from './api.js';
import { serializeForm, setDataRefrash } from './utils.js';

const btnOpenPopupForm = document.querySelector('#add');
const btnLoginOpenPopup = document.querySelector('#login');
const formAddCat = document.querySelector('#popup-form-cat');
const formLogin = document.querySelector('#popup-form-login');
const sectionCard = document.querySelector('.cards');

const popupAddCat = new Popup("popup-add-cats");
popupAddCat.setEventListener();


// for(let i=0; i< cats.length; i++){
//     const cat = new Card(cats[i], '#card-template')
//     const firstCat = cat.getElement();
//     sectionCard.append(firstCat);
// }

const popupLogin = new Popup('popup-login');
popupLogin.setEventListener();

const popupLoginEdit = new Popup('popup-login');
popupLoginEdit.setEventListener();

const popupCatInfo = new Popup('popup-cat-info');
popupCatInfo.setEventListener();

const popupImage = new PopupImage('popup-image');
popupImage.setEventListener();

const catsInfoInstance = new CatsInfo('#cats-info-template', handleEditCatInfo, handleDeleteCat);
const catsInfoElement = catsInfoInstance.getElement();

//добавляем кота в DOM -дерево
function createCat(dataCat) {
    const cardInstance = new Card(dataCat, '#card-template', handleCatImage, handleCatTitle);
    const newCardElement = cardInstance.getElement();
    sectionCard.append(newCardElement);
}

function checkLocalStorage() {
    const localData = JSON.parse(localStorage.getItem('cats'));
    const getTimeExpires = localStorage.getItem('catsRefrash')

    if (localData && localData.length && (new Date() < new Date(getTimeExpires))) {
        localData.forEach(catData => {
            createCat(catData);
            })
    } else {
        api.getAllCats().then((data) => {
            data.forEach(catData => {
            createCat(catData);
            })
         updateLocalStorage(data, {type: 'ALL_CATS'})
        })
     }
}
function handleFormAddCat(e) {
    e.preventDefault();

    const elementsFromCat = [...formAddCat.elements];
    const dataFormCat = serializeForm(elementsFromCat)
    api.addNewCat(dataFormCat).then(() => {
        createCat(dataFormCat);
        updateLocalStorage(dataFormCat, {type: 'ADD_CAT'});
    })
    popupAddCat.close();
}

function handleFormLogin(e) {
    e.preventDefault();

    const loginData = [...formLogin.elements];
    const serializeData = serializeForm(loginData);

    //создаем куку
    Cookies.set('email', `email=${serializeData.email}`);
    btnOpenPopupForm.classList.remove('visually-hidden');
    btnLoginOpenPopup.classList.add('visually-hidden');

    formLogin.addEventListener('submit', handleFormLoginEdit);
    //закрываем куку
    popupLogin.close();
}

function handleFormLoginEdit(e) {
    e.preventDefault();

    const loginData = [...formLogin.elements];
    const serializeData = serializeForm(loginData);

    //создаем куку
    Cookies.set('emailEdit', `email=${serializeData.email}`);
   
    //закрываем куку
    popupLoginEdit.close();
}

function handleCatImage(dataCat) {
    popupImage.open(dataCat);
}

function handleCatTitle(cardInstance) {
    catsInfoInstance.setData(cardInstance);
    popupCatInfo.setContent(catsInfoElement);

    const isEdit= Cookies.get('emailEdit');
    if(isEdit) {
        popupCatInfo.open();

    } else {
        popupLoginEdit.open();
    }
}

function handleDeleteCat(cardInstance) {

    api.deleteCatById(cardInstance.getId()).then(() => { 
        cardInstance.deleteView();
        updateLocalStorage(cardInstance.getId(), {type: 'DELETE_CAT'}); 
        popupCatInfo.close(); 
    })
}

function handleEditCatInfo(cardInstance, data) {
    const {age, description, name, id} = data;

    api.updateCatById(id, {age, description, name}).then(() => {

         cardInstance.setData(data);
         cardInstance.updateView();

         updateLocalStorage(data, {type: 'EDIT_CAT'});
         popupCatInfo.close(); 
    })
}

function updateLocalStorage(data, action) { 
    const oldStorage = JSON.parse(localStorage.getItem('cats'));

    switch (action.type) {//добавить новых котов
        case 'ADD_CAT':
            oldStorage.push(data);
            localStorage.setItem('cats', JSON.stringify(data)); 
            return;
        case 'ALL_CATS'://взять всех котов
            localStorage.setItem('cats', JSON.stringify(data));
            setDataRefrash(5, 'catsRefrash');
            return;
        case 'DELETE_CAT':
            console.log('DELETE_CAT', data);
            const newStorage = oldStorage.filter(cat => cat.id !== data); 
            localStorage.setItem('cats', JSON.stringify(newStorage)); //перезаписываем новым массив
            return;
        case 'EDIT_CAT'://редактирование котов
            const updateStorage = oldStorage.map(cat => cat.id === data.id ? data : cat);
            localStorage.setItem('cats', JSON.stringify(updateStorage));
            return;
        default:
            break;
    }
}

checkLocalStorage();
   
btnOpenPopupForm.addEventListener('click', () => popupAddCat.open());
btnLoginOpenPopup.addEventListener('click', () => popupLogin.open());
formAddCat.addEventListener('submit', handleFormAddCat);
formLogin.addEventListener('submit', handleFormLogin);


const isAuth = Cookies.get('email');

if (!isAuth) {
    popupLogin.open();
    btnOpenPopupForm.classList.add('visually-hidden');
} else {
    btnOpenPopupForm.classList.add('visually-hidden');
}

// Cookies
// document.cookie = 'email=sber@sb.ru;samesite=strict;max-age=360'
//Cookies.set('cook', 'res');
//console.log(Cookies.get('cook'));
// Cookies.remove('cook');

// localStorage
// localStorage.setItem('name', 'Вася'); 
// console.log(localStorage.getItem('name'));
// localStorage.setItem('tel', JSON.stringify({sass: '+7981835', mess: 'hurey}))
// console.log(JSON.parse(localStorage.getItem('tel')));
// localStorage.removeItem('tel');
// localStorage.clear()