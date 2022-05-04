// Grunden för koden är baserad från: https://www.youtube.com/watch?v=R-7eQIHRszQ. Men har programmerat många fler funktioner så att det är anpassad till mitt syfte och mål.
// Globala variabler nedan
const RANDOM_QUOTE_FROM_API = 'https://api.quotable.io/random'
const quoteDisplay = document.getElementById('textonScreen')
const quoteInput = document.getElementById('textInput')
const timer = document.getElementById('timer')
const quoteAuthor = document.getElementById('author')
const resetTabbed = document.getElementById('reset')
const SettingsButton = document.getElementById('nav-container-3')
const SettingsBox = document.getElementById('testSettings')
const settingsGrid = document.getElementById('wrapper')
const wordTest = document.getElementById('wordTest')
const quoteTest = document.getElementById('quoteTest')
const Test15s = document.getElementById('15sec')
const Test30s = document.getElementById('30sec')
const Test60s = document.getElementById('60sec')
let activationForTimer = false
let finished = false
let resetWhileActive = false

/* Event listeners används för att visa och dölja elementer i HTML genom att lägga till klasser*/
SettingsButton.addEventListener('click', () => {
    settingsGrid.classList.toggle('settingsChanged')
    SettingsBox.classList.toggle('hidden')
})

wordTest.addEventListener('click', () => {
    quoteTest.classList.toggle('selected')
    wordTest.classList.toggle('selected')
    Test15s.classList.remove('hidden')
    Test30s.classList.remove('hidden')
    Test60s.classList.remove('hidden')
})

quoteTest.addEventListener('click', () => {
    quoteTest.classList.toggle('selected')
    wordTest.classList.toggle('selected')
    Test15s.classList.add('hidden')
    Test30s.classList.add('hidden')
    Test60s.classList.add('hidden')
})

resetTabbed.addEventListener('keydown', (key) => {
    /* När en knapp på tangentbordet trycks på variabeln resetTabbed, så körs en funktion med den nedtryckta tangenten som argument med datatypen sträng.
    En kontrollstruktur ser till så att den nedtryckta knappen stämmer och returnerar funktionen ResetTest*/
    if (key.code == "Enter") {
        return ResetTest()                     
    }
})

resetTabbed.addEventListener('click', () => {
    /* Om rutan reset som viariabel resetTabbed clickas på så kommer den returnera funktionen ResetTest*/
    return ResetTest()                     
})

function ResetTest() {
    /*Byter tab-highlight från reset till skrivrutan (quoteInput).
    En sista kontrollstuktur körs, om tiden har inte startat så returnerar den med en funktion som visar ny quote, annars kommer den starta om timern och byta text.*/ 
    quoteInput.focus();
    if (timer.innerText == 0) {
        return QuoteRender()                                   
    } else {
        resetWhileActive = true
    }
}

let correct = true      // Definierar global variabel som är en boolean för se om alla tecken skivs korrekt.
quoteInput.addEventListener('input', () => {
    /* Vid en tangent input i skriv-rutan kommer den starta stopptur och jämföra om tecken som skrevs är samma tecken som den i quote display.
    Om tecken stämmer så kommer den korresponderande tecknet bli grönt i quote display. När den har gått igenom alla tecken så kommer den
    ändra bolean på en global variabel som avslutar stopptur. */
    const arrayQuote = quoteDisplay.querySelectorAll('letter')
    const arrayValue = quoteInput.value.split('')
    console.log(arrayQuote)
    
    if (activationForTimer != true) {
        startTimer()
        activationForTimer = true
    }

    let correct = true
    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index]
        if (character == null) {
            characterSpan.classList.remove('correct')
            characterSpan.classList.remove('incorrect')
            correct = false
        } else if (character == characterSpan.innerText || character == characterSpan.innerHTML) {
            characterSpan.classList.add('correct')
            characterSpan.classList.remove('incorrect')
        } else {
            characterSpan.classList.remove('correct')
            characterSpan.classList.add('incorrect')
            correct = false
        }
    })
    if (correct == true) {
        finished = true
    }
})

function getRandomQuote() {
    /* En funktion som använder Fetch API för att returnera quote strängen från en webbsida formaterad i JSON*/
    return fetch(RANDOM_QUOTE_FROM_API)
    .then(response => response.json())
    .then(data => data.content)
}

let wordCount = 0
async function QuoteRender() {
    /* funktionen väntar på en API hämtar quote som en sträng. Strängen kommer att delas upp till ord i en div som består av tecken.*/
    const quote = await getRandomQuote()
    saved_quote = quote
    wordCount = saved_quote.replaceAll(' ', '').replaceAll('.', '').replaceAll(';', '').replaceAll(',', '')
    wordCount = wordCount.length
    quoteDisplay.innerHTML = ''
    grouping = document.createElement('div')
    grouping.classList.add('word')
    quoteDisplay.appendChild(grouping)
    
    quote.split('').forEach(charater => {
        if (charater == ' ') {
            const characterSpan =  document.createElement('letter')
            characterSpan.innerText = charater
            grouping.appendChild(characterSpan)
            grouping = document.createElement('div')
            grouping.classList.add(`word`)
            quoteDisplay.appendChild(grouping)
        } else {
            const characterSpan =  document.createElement('letter')
            characterSpan.innerText = charater
            grouping.appendChild(characterSpan)
        }
    })
    quoteInput.value = null 
}

let startTime
function startTimer() {
    /*En stopptur som startar när en tangent trycks ner och sedan börjar köra om tills att den blir stoppad av reset knappen 
    eller när testen är slutförd som då kommer att returnera till en funktion med tiden som argument som är av datatypen integer*/
    timer.innerText = 0   
    startTime = new Date()

    const interval = setInterval(() => {
        timer.innerText = getTimerTime()
        latestTime = getTimerTime()
        if (resetWhileActive == true) {
            clearInterval(interval);
            timer.innerText = 0
            activationForTimer = false
            QuoteRender()
            resetWhileActive = false
        }
        if (finished == true) {
                clearInterval(interval);
                timer.innerText = 0
                finished = false
                activationForTimer = false

                if (correct == true) {
                    showResults(latestTime)
                } else {
                    QuoteRender()
                }
            }
        }, 100);
    }

function getTimerTime() {
    // Funktion som returnerar tiden som har gått sedan en tangent har trycks ner.
    return Math.floor((new Date() - startTime) / 1000)
}

function showResults(time) {
    /* funkionen tar tiden som argument av datatypen: integer och kommer att gömma skriv rutan och visa upp resultaten.
    WPM (Words Per Minute) kommer att beräknas och visas upp i resultat rutan. 
    När restart knappen trycks så startar den om och gömmer resultat.*/
    let container = document.getElementById("container")
    container.classList.add("hidden")
    let resultWPM = document.getElementById('resultWPM')
    let restartTest = document.getElementById('newTest')
    let containerResult = document.getElementById("containerResult")
    containerResult.classList.remove("hidden")
    
    WPM = Math.floor((wordCount/4.0)/(time/60.0))
    resultWPM.innerText = WPM

    restartTest.addEventListener('click', () => {
        containerResult.classList.add("hidden")
        container.classList.remove('hidden')
        return QuoteRender()
    })

}
//known bugs: For example, "ff" becomes one character due to ligature and validates both if u type in only one "f".
// while reseting the test with enter, will cause the test to start because the input is activated.

QuoteRender()           // Köra funktionen som visar meningen som skall skrivas.