(function() {

    function createForm(container) {
        const formWrapper = document.createElement(`div`);
        const form = document.createElement(`form`);
        const input = document.createElement(`input`);
        const button = document.createElement(`button`);
        
        formWrapper.id = form;
        form.classList.add(`input-group`, `mb-3`);
        input.classList.add(`form-control`);
        input.placeholder = `Кол-во карточек по вертикали/горизонтали`;
        button.classList.add(`btn`, `btn-primary`);
        button.textContent = `Начать игру`;
    
        form.append(input);
        form.append(button);
        formWrapper.append(form);
        container.append(formWrapper);
        
        return {
            form,
            input,
            button,
        };
    }

    function createArrayRandomCouple(number) {
        const array = [];
    
        for(let i = 1; i <= ( Math.pow(number, 2) / 2 ); i++) {
            array.push(i);
            array.push(i);
        }
    
        array.sort( () => 0.5 - Math.random() );
        return array;
    }

    function createFieldCards(container) {
        const field = document.createElement(`table`);

        field.classList.add(`field`);
        container.append(field);

        return field;
    }

    function createRowCard() {
        const rowCard = document.createElement(`tr`);
        rowCard.classList.add(`row-cards`);

        return rowCard;
    }    

    function createCard() {
        const item = document.createElement(`td`);
        const frontImg = document.createElement(`img`);
        const backImg = document.createElement(`img`);

        frontImg.classList.add(`front-img`);
        backImg.classList.add(`back-img`);
        item.classList.add(`cell-card`);

        return {
            item,
            frontImg,
            backImg,
        }
    }

    let hasFlippedCard = false;
    let firstCard, secondCard;  
    let lockBoard = false;

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add(`flip`);

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;

        checkForMatch();
    }

    function checkForMatch() {
      if (firstCard.dataset.cardNumber === secondCard.dataset.cardNumber) {
        disableCards();
        return;
      }

      unflipCards();
    }

    function disableCards() {
      firstCard.removeEventListener(`click`, flipCard);
      secondCard.removeEventListener(`click`, flipCard);

      resetBoard();
    }


    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function unflipCards() {
        lockBoard = true;

      setTimeout(() => {
        firstCard.classList.remove(`flip`);
        secondCard.classList.remove(`flip`);
        
        resetBoard();
      }, 1500);
    }
    
    function gameOver() {
        alert(`Время вышло, игра окончена`);
        location.reload();
    }

    function gameLaunch(container) {
        const gameForm = createForm(container);
        const fieldCards = createFieldCards(container);
        
        const MAX_CARD_AMOUNT = 10;
        const CODE_MIN_INPUT_VALUE = 48;
        const CODE_MAX_INPUT_VALUE = 57;
        const DEFAULT_INPUT_VALUE = 4;

        gameForm.input.onkeypress = function(event) {
            if(event.keyCode < CODE_MIN_INPUT_VALUE || event.keyCode > CODE_MAX_INPUT_VALUE) {
                return false;
            }
        };
        
        gameForm.form.addEventListener(`submit`, function(event) {
            event.preventDefault();
    
            if(gameForm.input.value % 2 == 0 && gameForm.input.value != 0 && gameForm.input.value <= MAX_CARD_AMOUNT) {
                let arrayRandomCouple = createArrayRandomCouple(gameForm.input.value);
                let currentCount = 0;
                fieldCards.innerHTML = ``;

                for(let i = 1; i <= gameForm.input.value; i++) {
                    const rowCard = createRowCard();
                    fieldCards.append(rowCard);
                    
                    for(let j = 1; j <= gameForm.input.value; j++) {
                        const card = createCard();
                        
                        card.frontImg.src = `./img/${arrayRandomCouple[currentCount]}.svg`;
                        card.backImg.src = `./img/js-badge.svg`;
                        card.item.append(card.frontImg);
                        card.item.append(card.backImg);
                        card.item.dataset.cardNumber = `${arrayRandomCouple[currentCount]}`;
                        rowCard.append(card.item);
                        currentCount++;

                        card.item.addEventListener(`click`, flipCard);
                    }
                }

                gameForm.input.value = ``;
                
            } else {
                gameForm.input.value = DEFAULT_INPUT_VALUE;
            }

            setTimeout(gameOver, 60000);
        });
    }
    window.gameLaunch = gameLaunch;
})();
