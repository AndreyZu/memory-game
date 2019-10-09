function game(){
    let param = {
        gameId: 'game',
        cardClass: 'game__card',
        cardOpenClass: 'open',
        cardErrorClass: 'error',
        cardFindClass: 'find',
        symbols: ['😌','🐸','🐰','🐼','🐟','🐨','👾','👻'],
        symbolsNumber: 8,
        timerId: 'timer',
        time: 60
    };

    let pair = {
        first: null,
        second: null,
        sum: 0,
        index: 0,
        start: false
    };

    // Полифилл для работы в IE11
    if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = Array.prototype.forEach;
    }

    let sort = param.symbols.concat(param.symbols).sort(function (){
        return Math.random()-0.5;
    });

    let field = document.getElementById(param.gameId);
    let cards = field.querySelectorAll('.' + param.cardClass);

    console.info('sort = ', sort);
    for (let i = 0; i < sort.length; i++){
        cards[i].textContent = sort[i];
    }

    let listener = function(event){
        function algorithm(card, errors){
            if (card.classList.contains(param.cardClass)){
                pair.start = true;
                console.info(card);
                console.info('search errors', errors, errors.length);

                if(errors.length !== 0 && !card.classList.contains('error')){
                    console.info('Have errors, clear', errors);
                    errors.forEach(function(event){
                        event.classList.remove('error');
                    });
                }
                if (card.classList.contains('error')){
                    console.info('This is error card.');
                    return;
                }
                if (card.classList.contains('find')){
                    console.info('This is find card.');
                    return;
                }
                if (card.classList.contains('open')){
                    card.classList.remove('open');
                    pair.index = 0;
                    return;
                }
                if (!card.classList.contains('open')&&
                    !card.classList.contains('error')&&
                    !card.classList.contains('find')){
                    if (pair.index === 0) {
                        console.info('first');
                        card.classList.add('open');
                        pair.first = card;
                        pair.index++;
                    } else {
                        console.info('second');
                        card.classList.add('open');
                        pair.second = card;
                        if (pair.first.textContent === pair.second.textContent) {
                            pair.first.classList.remove('open');
                            pair.second.classList.remove('open');
                            pair.first.classList.add('find');
                            pair.second.classList.add('find');
                            pair.sum++;
                        } else {
                            pair.first.classList.remove('open');
                            pair.second.classList.remove('open');
                            pair.first.classList.add('error');
                            pair.second.classList.add('error');
                        }
                        pair.index = 0;
                    }
                }
            }
        }
        algorithm(event.target, field.querySelectorAll('.' + param.cardErrorClass));
    };
    field.addEventListener('click', listener);


    let htmlTimer = document.getElementById(param.timerId);
    function formatTime(time){
        // Time in seconds.
        let minutes = Math.floor(time/60),
            seconds = time%60;
        if (minutes < 10){
            minutes = '0' + String(minutes);
        }
        if (seconds < 10){
            seconds = '0' + String(seconds);
        }
        return String(minutes) + ':' + String(seconds);
    }

    htmlTimer.textContent = formatTime(param.time);

    let timer = setInterval(function() {
        if (pair.start){
        htmlTimer.textContent = formatTime(--param.time);
        console.log(param.time);

        if (param.time <= 0 || pair.sum === param.symbolsNumber) {
            clearInterval(timer);

            console.log('Кол-во найденных: ', field.querySelectorAll('.' + param.cardFindClass).length, ' из '+ 2*param.symbolsNumber);
            let window = document.createElement('section');
            let modal = document.createElement('div');
            let header = document.createElement('div');
            let button = document.createElement('button');
            window.className = 'window';
            modal.className = 'window__modal';
            header.className = 'window__header';
            button.className = 'window__button';


            let letterIndex = 0;
            function word(letter){
                let symbol = document.createElement('span');
                symbol.classList.add('window__letter', 'window__letter_'+ ++letterIndex);
                symbol.textContent = letter;
                return symbol;
            }

            if (pair.sum === param.symbolsNumber) {
                header.appendChild(word('W'));
                header.appendChild(word('i'));
                header.appendChild(word('n'));
                button.textContent = 'Play again';
            } else {
                header.appendChild(word('L'));
                header.appendChild(word('o'));
                header.appendChild(word('o'));
                header.appendChild(word('s'));
                header.appendChild(word('e'));
                button.textContent = 'Try again';
            }

            document.body.appendChild(window);
            window.appendChild(modal);
            modal.appendChild(header);
            modal.appendChild(button);

            function reset() {
                let cards = field.querySelectorAll('.' + param.cardClass);
                cards.forEach(function (elem) {
                    elem.classList.remove(param.cardOpenClass);
                    elem.classList.remove(param.cardErrorClass);
                    elem.classList.remove(param.cardFindClass);
                });
                pair.first = null;
                pair.second = null;
                pair.sum = 0;
                pair.index = 0;

                modal.removeChild(button);
                modal.removeChild(header);
                window.removeChild(modal);
                document.body.removeChild(window);

                field.removeEventListener('click', listener);
                pair.start = false;
                console.log('restart');
            }

            button.addEventListener('click', function () {
                reset();
                game();
            });
        }
    }
    },1000);

}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', game);
}else{
    game();
}