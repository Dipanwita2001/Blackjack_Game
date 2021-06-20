// Blackjack Game

let blackjackgame = {
    'you':{'scoreSpan':'#your-score','div':'.your-box','score':0},
    'dealer':{'scoreSpan':'#dealer-score','div':'.dealer-box','score':0},
    'cards':['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
    'cardsMap':{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':10,'Q':10,'K':10,'A':[1,11]},
    'wins':0,
    'losses':0,
    'draws':0,
    'isHit':false,
    'isStand':false,
    'turnsOver':false,
}

const you = blackjackgame['you'];
const dealer = blackjackgame['dealer'];
const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const lossSound = new Audio('static/sounds/aww.mp3');

document.querySelector('#hit').addEventListener('click',hit);
document.querySelector('#stand').addEventListener('click',dealerLogic);
document.querySelector('#deal').addEventListener('click',deal);

function hit(){
    if(blackjackgame['isStand']===false)
    {
        blackjackgame['isHit']=true;
        let card = randomCard();
        showCard(you,card);
        updateScore(you, card);
        showScore(you);
    }
}

function showCard(activePlayer,card){
    if(activePlayer['score']<=21){
        let cardImage = document.createElement('img');
        cardImage.src = `static/images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function randomCard(){
    let rand=Math.floor(Math.random() * 13);
    return blackjackgame['cards'][rand];
}

function updateScore(activePlayer,card){
    // If adding 11 keeps below 21, add 11, otherwise add 1
    if(card=='A'){
        if(activePlayer['score']+blackjackgame['cardsMap'][card][1]<=21){
            activePlayer['score']+=blackjackgame['cardsMap'][card][1];        
        }
        else{
            activePlayer['score']+=blackjackgame['cardsMap'][card][0];
        }
    }
    else{
        activePlayer['score']+=blackjackgame['cardsMap'][card];
    }
    console.log(activePlayer['score']);
}

function deal(){
    // showResult(computeWinner());
    if(blackjackgame['turnsOver']===true){
        blackjackgame['isStand']=false;
        let yourImages = document.querySelector('.your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('.dealer-box').querySelectorAll('img');
        for(i=0;i<yourImages.length;i++)
            yourImages[i].remove();
        for(i=0;i<dealerImages.length;i++)
            dealerImages[i].remove();
        you['score']=0;
        dealer['score']=0;
        document.querySelector('#your-score').textContent="0";
        document.querySelector('#your-score').style.color="#fff";
        document.querySelector('#dealer-score').textContent="0";
        document.querySelector('#dealer-score').style.color="#fff";
        document.querySelector('#result').textContent="Let's Play!!!";
        document.querySelector('#result').style.color="black";

        blackjackgame['turnsOver']=false;
    }
}

function showScore(activePlayer){
    if(activePlayer['score']>21){
        document.querySelector(activePlayer['scoreSpan']).textContent="BUTSED!!!";
        document.querySelector(activePlayer['scoreSpan']).style.color="red";
    }
    else{
        document.querySelector(activePlayer['scoreSpan']).textContent=activePlayer['score'];
    }
}

function sleep(ms){
    return new Promise(resolve=> setTimeout(resolve,ms));
} 

async function dealerLogic(){
    if(blackjackgame['isHit']===true && blackjackgame['turnsOver']==false){
        blackjackgame['isHit']=false;
        blackjackgame['isStand']=true;
        while(dealer['score']<16 && blackjackgame['isStand']===true){
            let card=randomCard();
            showCard(dealer,card);
            updateScore(dealer,card);
            showScore(dealer);
            await sleep(1000);
        }
        blackjackgame['turnsOver']=true;
        let winner=computeWinner();
        showResult(winner);
        console.log(blackjackgame['turnsOver']);
}
}

// Compute winner and return who just win
// update the wins, draws and losses
function computeWinner(){
    let winner;
    console.log(you['score'])
    if(you['score']<=21){
        //condition: higher score than dealer or when dealer bursts but you're under 21
        if(you['score']>dealer['score'] || dealer['score']>21){
            blackjackgame['wins']++;
            winner=you;
        }
        else if(you['score']<dealer['score']){
            blackjackgame['losses']++;
            winner=dealer;
        }
        else if(you['score']===dealer['score']){
            blackjackgame['draws']++;
        }
    }
    //Condition: when user bursts but dealer doesn't
    else if(you['score']>21 && dealer['score']<=21){
        blackjackgame['losses']++;
        winner=dealer;
    }
    else if(you['score']>21 && dealer['score']>21){
        blackjackgame['draws']++;
    }
    console.log(blackjackgame);
    return winner;
}

function showResult(winner){
    let message, messageColor;

    if(blackjackgame['turnsOver']===true){
        if(winner===you){
            message="You won!!!";
            messageColor="green";
            document.querySelector('#wins').textContent=blackjackgame['wins'];
            winSound.play();
        }
        else if(winner===dealer){
            message="You lost!!!"
            messageColor="red";
            document.querySelector('#losses').textContent=blackjackgame['losses'];
            lossSound.play();
        }
        else{
            message="DRAW!!!"
            messageColor="blue";
            document.querySelector('#draws').textContent=blackjackgame['draws'];
        }
        document.querySelector('#result').textContent=message;
        document.querySelector('#result').style.color=messageColor;
    }
}