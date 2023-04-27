import { printNumerals, generateRating } from "./utils.js";

export class CatsInfo {
    constructor(
        selectorTemplate,
        handleEditCatInfo,
        handleDeleteCat
        ) {//, handleLikeCat
        this._selectorTemplate = selectorTemplate;
        this.__handleEditCatInfo = handleEditCatInfo;
        this._handleDeleteCat = handleDeleteCat;//hendle - слушает
        // this.__handleLikeCat = handleLikeCat;//слушать лайки
        this._data = {};//есть пустой объект кот. потом будет наполняться
    }

    _getTemplate() { // возвращает содержимое шаблона в виде DOM узла
        return document.querySelector(this._selectorTemplate).content.children[0];
    
    }

    getElement() {
        this.element = this._getTemplate().cloneNode(true);//клонирование объекта

        this.buttonEdited = this.element.querySelector('.cat-info__edited');//редактировать
        this.buttonSaved = this.element.querySelector('.cat-info__saved');//сохранить
        this.buttonLiked = this.element.querySelector('.cat-info__favourite');
        this.buttonDeleted = this.element.querySelector('.cat-info__deleted');//удалить
        this.catImage = this.element.querySelector('.cat-info__image');

        this.catId = this.element.querySelector('.cat-info__id'); 
        this.catName = this.element.querySelector('.cat-info__name'); 
        this.catRate = this.element.querySelector('.cat-info__rate'); 
        this.catAge = this.element.querySelector('.cat-info__age-val');
        this.catAgeText = this.element.querySelector('.cat-info__age-text');
        this.catDesc = this.element.querySelector('.cat-info__desc'); 

        this.setEventListener();
        return this.element;
    }

    setData(cardInstance) {
        this._cardInstance = cardInstance;
        this._data = this._cardInstance.getData();

        this.catImage.src = this._data.image;

        this.catDesc.textContent = this._data.description;
        this.catName.textContent = this._data.name;
        this.catAge.textContent = this._data.age;
        this.catId.textContent = this._data.id;

        this.catAgeText.textContent = printNumerals(this._data.age, ["год", "года", "лет"]);

        this.catRate.innerHTML = generateRating(this._data.rate);
    }
      
    _toggleContentEditable = () => {

        this.buttonEdited.classList.toggle('cat-info__edited_hidden');//кнопка редактирования
        this.buttonSaved.classList.toggle('cat-info__saved_hidden');//кнопка сохранения

        this.catDesc.contentEditable = !this.catDesc.isContentEditable;
        this.catName.contentEditable = !this.catName.isContentEditable;
        this.catAge.contentEditable = !this.catAge.isContentEditable;

    }

    _savedDataCats = () => { 
        
        this._toggleContentEditable(); 

        this._data.name = this.catName.textContent;
        this._data.age = Number(this.catAge.textContent); 
        this._data.description = this.catDesc.textContent;

        this.__handleEditCatInfo(this._cardInstance, this._data);
    
    }

    setEventListener() {
        this.buttonDeleted.addEventListener('click', () => this._handleDeleteCat(this._cardInstance));

        this.buttonEdited.addEventListener('click', this._toggleContentEditable);
        this.buttonSaved.addEventListener('click', this._savedDataCats);
    }
}