const form = document.getElementById('form')
const minuteElem = document.getElementById('minute')
const secondElem = document.getElementById('second')
const pauseElem = document.getElementById('pause')
const extraElem = document.getElementById('extra')
const subMenu = document.getElementById('subMenu')
const nextElem = document.getElementById('next')
const resetElem = document.getElementById('reset')

const colorArr = [{
    name: 'red',
    color: '#FFF2F2',
    color_15: 'rgba(256, 76, 76, 0.15)',
    color_71: 'rgba(256, 76, 76, 0.71)'
}, {
    name: 'green',
    color: '#F2FFF5',
    color_15: 'rgba(77, 218, 110, 0.15)',
    color_71: 'rgba(77, 218, 110, 0.71)'
}, {
    name: 'green',
    color: '#F2F9FF',
    color_15: 'rgba(76, 172, 255, 0.15)',
    color_71: 'rgba(76, 172, 255, 0.71)'
}]


const setProp = (name, value) => {
    document.documentElement.style.setProperty(name, value)
}

function changeColor(index) {
    if (!colorArr[index - 1]) {
        index = 1
    }

    setProp("--main-color", colorArr[index - 1].color)
    setProp("--color-15", colorArr[index - 1].color_15)
    setProp("--color-71", colorArr[index - 1].color_71)
}

/*#FFF2F2 red*/
/*#F2FFF5 green*/
/*#F2F9FF blue*/
/*rgba(256, 76, 76, 0.15) red*/
/*rgba(77, 218, 110, 0.15) green*/
/*rgba(76, 172, 255, 0.15) blue*/


window.addEventListener('click', (e) => {
    if (e.target.id !== 'extra') {
        subMenu.classList.remove('show')
        subMenu.classList.add('hide')
    }
})

subMenu.addEventListener('click', (event) => {
    event.stopPropagation()
})
extraElem.addEventListener('click', () => {
    if (subMenu.classList.contains('hide')) {
        subMenu.classList.add('show')
        subMenu.classList.remove('hide')
        return
    }
    if (subMenu.classList.contains('show')) {
        subMenu.classList.add('hide')
        subMenu.classList.remove('show')
    }
})

let interval

let indexTimer = 1

let isPause = true

pauseElem.addEventListener('click', () => {
    isPause = !isPause
})

resetElem.addEventListener('click', () => {
    startTimer(timerState)
})

let timerState


const startTimer = async () => {
    changeColor(indexTimer)
    const data = timerState[indexTimer.toString()]
    // console.log(data)
    if (!data) {
        return
    }

    const {minute, second} = data

    let minuteCount = minute
    let secondCount = second

    // clearInterval(interval)
    await new Promise((resolve) => {
        interval = setInterval(() => {
            if (isPause) {
                return
            }

            secondElem.textContent = secondCount < 10 ? '0' + secondCount : secondCount
            minuteElem.textContent = minuteCount < 10 ? '0' + minuteCount : minuteCount
            secondCount--

            if (minuteCount <= 0 && secondCount <= 0) {
                clearInterval(interval)
                resolve()
            }

            if (secondCount < 0) {
                secondCount = 59
                minuteCount--
            }

        }, 1000)
    })
    indexTimer++
    startTimer(timerState)
}


form.addEventListener('submit', (e) => {
    e.preventDefault()

    const formTarget = new FormData(e.target)

    const formArray = [...formTarget]

    const formData = formArray.map(([key, value]) => {
        const [number, type] = key.split('-')

        if (type === 'second' && Number(value) > 59) {
            value = '59'
        }

        return {
            number,
            type,
            value: Number(value),
        }
    }).reduce((acc, {number, type, value}) => {
        acc[number] = {
            ...acc[number],
            [type]: value,
        }

        return acc
    }, {})

    timerState = formData
    clearInterval(interval)

    startTimer()
})

nextElem.addEventListener('click', () => {
    clearInterval(interval)
    indexTimer++

    if (indexTimer > Object.entries(timerState).length) {
        indexTimer = 1
    }

    startTimer(timerState)
})

// const color = getComputedStyle(document.body)
// console.log(color.getPropertyValue('--main-color'))
// color.setProperty('--main-color', '#000')
// console.log(color.getPropertyValue('--main-color'))

// console.log(window.getComputedStyle(document.documentElement).getPropertyValue('--main-color'));
// console.log(window.getComputedStyle(document.documentElement))

