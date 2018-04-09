    // General

    // Dom elements - 11
    const deck = $(".deck");
    const cards = $(".card");
    const blockedCards = $(".blocked");
    const moves = $(".moves");
    const movesTaken = $(".movesTaken");
    const timeTrack = $("#timer");
    const modal = $("#modal");
    const modalFooter = $(".modal-footer");
    const restart = $(".restart-button");
    const restartButton = $(".restart");
    const stars= $(".stars").children();
    
    // Arrays of cards - 2
    const cardArray = [];
    const openCardArray = [];
    
    // Cards with class of X - 2
    const showCardClass = ".show";
    const matchClass = ".match";
    
    // Class names - 3
    const flipCards = "open show";
    const match = "match";
    const blockClicks = "blocked";
    
    // Helpers - 5
    let identifier;
    let moveCount = 20;
    let gameStart = false;
    let seconds = 0, minutes = 0, hours = 0, t;

    // Helper functions

        // Shuffle function from http://stackoverflow.com/a/2450976
         function shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;
        
            while (currentIndex !== 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        } 
    
        // If hours, mins, or secs are less than 10 , add a 0 to the front.
    function zeroPad(i) {
        if (i < 10) {
          i = "0" + i;
        }
        return i;
      }
      
    /*
     * Logic for timer
     * When function starts, seconds will be added for one minute and so on
     * Once sixty minutes have been added, one hour will be added and so on
     * ZeroPad helps with time format, which keeps a 0 in front of time if less than 10
     */
    function addTime() {
        if(gameStart) {
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
                hours++;
            }
        }   
        timeTrack.text(`${zeroPad(hours)}:${zeroPad(minutes)}:${zeroPad(seconds)}`);
        timer();        
    }
}
    //  AddTime function will be running every one second
    function timer() {
        t = setTimeout(addTime,1000);
    }

    // Time will start ticking once , one card has been clicked.
    function startTimer() {
        cards.one('click', () => {
            if(!gameStart) {
                gameStart = true;
                timer();
            }
        });
    }


    /*
     *   Removes class open show
     *   Makes cards go back to original position.
    */
    function removeFlipCards() {
        setTimeout(() => {
            cards.removeClass(flipCards);
        },800);
    }
    
    /*
     *  Splices Array from element 0 to 4
     *  Helps with always making array only 4 elements
     *  Which is used when matching cards
    */

    function removeCardsNotMatching(arr) {
        arr.splice(0,4);
    }
    
    /* 
    *  Add and remove the class of blockClicks
    */
    const cardsBlocked = {
        block: () => cards.addClass(blockClicks),
        unblock: () => setTimeout(() => cards.removeClass(blockClicks),1300),
    };


    // Add or Remove Opacity || Add or Remove Pointer
    function sceneShow(element,visibility,pointer) {
        element.css("visibility", visibility);
        element.css("pointer-events", pointer);
    }
    
    /*
    *  Loop through Array of cards
    *  Push cards to cardArray
    *  Shuffle Cards randomly
    *  Appends Shuffled Cards to the Deck Element
    */
    function shuffleCards() {
        cards.each(function() {
            cardArray.push(this);
        });
        deck.append(shuffle(cards));
    }

            // Restart Game
            function restartGame(element) {
                element.on('click', () => {
                    location.reload();
                });
            }
    
            // End Game 
            function endGame() {
                sceneShow(deck,"visible","none");
                sceneShow(modal,"visible","auto");
                cards.removeClass(flipCards);
                cards.removeClass(match);
                movesTaken.text(20 - moveCount);
                modalFooter.text(`Game time: ${timeTrack.text()}`);
                restartGame(restart);
                clearTimeout(t);
        }
    
    // Adds Class of Open Show.
    function showCards() {
        $(this).addClass(flipCards);
    }
    
    // Pushes Cards with class of Open Show to openCardArray.
    function pushOpenCards(card,identifier) {
        openCardArray.push(card,identifier);
    }

    // Game Controller

    /*
    * Each time a card is clicked we are adding the class of open show with the function showCards
    * showCards.call(this) is used to assign the card that is clicked to the "this" keyword
    * Each card that has the class of open show is being assigned to the openCard Array
    * MatchCards is used for checking if 2 cards match
    */
    
    function gameController() {
        cards.on('click', function() {
            identifier = cards.index(this);
            showCards.call(this);
            pushOpenCards(this,identifier);
            MatchCards.call(this);
            gameScene();
            gameWin();
        });
    }

    /*
     * Only allow two cards to be open at a time
     * Find out if two cards are a match by checking index of card and card html
     * If two cards do not match, both cards will have the class of match
     * If they do not match, they will flip over to it's original position
     */
    function MatchCards() {    
        if(openCardArray.length > 2) {
            if(openCardArray[0].innerHTML === openCardArray[2].innerHTML && openCardArray[1] !== openCardArray[3]) {
                    $(showCardClass).addClass(match);
                    removeCardsNotMatching(openCardArray);
                    removeFlipCards();
                    cardsBlocked.block();
                } else if(showCardClass) {
                    removeCardsNotMatching(openCardArray);
                    removeFlipCards(); 
                    cardsBlocked.block();
                }
            }
            
            if(blockedCards) {
                    cardsBlocked.unblock();
            }  
    }

    // Game View

    /*
     * Counts moves made
     * When moves hit 0 it will reset and ends Game after one second
     * User can choose to play 1 card or do nothing in one second
     * When game has ended a modal will pop up.
     * If restart button is clicked , whole game will reset by reloading page
     */

    function gameScene() {
        if($(showCardClass).length >= 2 && moveCount > 0) {
            --moveCount;
            moves.text(moveCount + ' Moves');
        } else if((movesCount === 1)) {
            moveCount = 0;
            moves.text(moveCount + ' Moves');
            setTimeout(endGame,1000);
        } else if(restartButton) {
            restartGame(restartButton);
        }
    }

    /*
    * Function in charge of removing stars
    * Shows Modal with total amount of Moves
    */
    function gameWin() {
        if($(matchClass).length === 16) {
            endGame();
        } else if(moveCount === 10) {
           stars[0].remove();
        } else if(moveCount === 5 ) {
            stars[1].remove();
        } else if(moveCount === 0) {
            stars[2].remove();
        }
    }

    startTimer();
    shuffleCards();
    gameController();
    
