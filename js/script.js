// The following code is based from this source: https://www.youtube.com/watch?v=R-7eQIHRszQ. But has been altered to my needs.
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

resetTabbed.addEventListener('keydown', (key) => {
    if (key.code == "Enter") {
        quoteInput.focus();
        if (timer.innerText == 0) {
            QuoteRender()
            console.log("hi12")
        } else {
            resetWhileActive = true
        }
    }
})

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

resetTabbed.addEventListener('click', () => {
    if (timer.innerText == 0) {
        QuoteRender()
        console.log("lo")
    }
    quoteInput.focus();
    finished = true
})


let correct = true
quoteInput.addEventListener('input', () => {
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
    //let rand = Math.floor(Math.random() * 4)
    return fetch(RANDOM_QUOTE_FROM_API)
    .then(response => response.json())
    .then(data => data.content)
}

let wordCount = 0
async function QuoteRender() {
    const quote = await getRandomQuote()
    saved_quote = quote
    wordCount = saved_quote.replaceAll(' ', '').replaceAll('.', '')
    wordCount = wordCount.length
    quoteDisplay.innerHTML = ''
    // characterSpan.innerText = charater
    grouping = document.createElement('div')
    grouping.classList.add('word')
    quoteDisplay.appendChild(grouping)
    // grouping.style.transition = "all 0.4s ease"
    
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
function startTimer(){
    timer.innerText = 0   
    startTime = new Date() 
    const interval = setInterval(() => {
        timer.innerText = getTimerTime()
        latestTime = getTimerTime()
        if (finished == true) {
                clearInterval(interval);
                timer.innerText = 0
                finished = false
                activationForTimer = false
                console.log(latestTime)
                console.log(correct)
                if (correct == true) {
                    showResults(latestTime)
                    console.log("yes")
                } else {
                    QuoteRender()
                }
            }
        if (resetWhileActive == true) {
            clearInterval(interval);
            timer.innerText = 0
            activationForTimer = false
            QuoteRender()
            resetWhileActive = false
        }
        }, 100);
    }

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000)
}

function showResults(time) {
    let container = document.getElementById("container")
    container.classList.add("hidden")
    //let mainContainer = document.getElementById("main")
    let containerResult = document.getElementById("containerResult")
    let resultWPM = document.getElementById('resultWPM')
    let restartTest = document.getElementById('newTest')
    containerResult.classList.remove("hidden")
    WPM = Math.floor((wordCount/4.0)/(time/60.0))
    resultWPM.innerText = WPM
    restartTest.addEventListener('click', () => {
        containerResult.classList.add("hidden")
        container.classList.remove('hidden')
        QuoteRender()
    })
}

// Settings tab that works as a popup element that is hidden, which will be visible. 15s, 30s, 60s. Random Quotes and Dolan Quotes.
//Game setting 60s ->, if everything is correct => give result (WPM Words per minute, count in 60seconds (character/4)
// Leaderboard PHP->MySQL to save?

//known bugs: "becomes" one character and validates if u type in one "f", pressing restart three time in a row makes it auto start the test.

QuoteRender()

