// Класс для работы с карточкой
export class Card {
    constructor(dataCat, selectorTemplate, handleCatImage, handleCatTitle) {
        this._dataCat = dataCat;
        this._selectorTemplate = selectorTemplate;
        this._handleCatImage = handleCatImage;
        this._handleCatTitle = handleCatTitle;
    }

    _getTemplate() { 
        return document.querySelector(this._selectorTemplate).content.querySelector('.card');
    
    }

    getElement() {
        this.element = this._getTemplate().cloneNode(true); // клонируем полученное содержимое из шаблона
        // получаем содержимое элемента
        this.cardTitle = this.element.querySelector('.card__name');
        this.cardImage = this.element.querySelector('.card__image');//достаем картинку
        this.cardLike = this.element.querySelector('.card__like');
        
        // this.cardTitle.textContent = this._dataCat.name;
        // this.cardImage.src = this._dataCat.image;

        if (this._dataCat.favourite) {
            this.cardLike.classList.toggle("card__like_active");
        }

        this.updateView();

        this.setEventListener()
        return this.element
    }

    getData () {//перетягиваем данные из карты в модальное окно
        return this._dataCat;
    }

    getId() {//вернет id конкретной карточки
        return this._dataCat.id;
    }

    setData(newData) {//приходят новые данные
        this._dataCat = newData;
    }

    updateView() {//обновление данных карточки
        this.cardTitle.textContent = this._dataCat.name;
        this.cardImage.src = this._dataCat.image;
    }

    deleteView() {//удаляем карту
        this.element.remove()//удаление элемента из DOM
        this.element = null;
    }

    setEventListener() {
        this.cardImage.addEventListener('click', () => this._handleCatImage(this._dataCat));
        this.cardTitle.addEventListener('click', () => this._handleCatTitle(this));
    }
}