const grid = document.querySelector("[data-grid]")
const plotx = document.querySelector("[data-plot-x]")
const ploty = document.querySelector("[data-plot-y]")
const plotc = document.querySelector("[data-plot-create]")
const buttons = document.querySelectorAll("[data-plant]")

var plot
var effects
var selected = "empty"
var maxX
var maxY

plants = JSON.parse(data)
buffs = JSON.parse(data2)

function updateDisplay(cord) {
    var indicators = document.querySelector('[data-spot][data-x="'+cord[1]+'"][data-y="'+cord[0]+'"]').querySelectorAll('[data-indicator]')
    itemEff = effects[cord[0]][cord[1]]
    for (let i = 0; i < indicators.length; i++) {
        if (itemEff[i+1] == 0) {
            indicators[i].style.visibility="hidden"
        } else {
            indicators[i].style.visibility="visible"
        }
        
    }
}

function checkBuffs(list) {
    list.forEach((cord) => {
        effects[cord[0]][cord[1]] = [0,0,0,0,0,0]
        var locX
        switch (cord[1]) {
            case 0:
                locX = "min"    
                break;
            case maxX:
                locX = "max"    
                break;
            default:
                locX = "safe"
                break;
        }
    
        var locY
        switch (cord[0]) {
            case 0:
                locY = "min"    
                break;
            case maxY:
                locY = "max"    
                break;
            default:
                locY = "safe"
                break;
        }
    
        var checkList = []
        //left
        if (locX!= 'min') 
            checkList.push([cord[0],cord[1]-1])
        //right
        if (locX!= 'max') 
            checkList.push([cord[0],cord[1]+1])
        //down
        if (locY!= 'min') 
            checkList.push([cord[0]-1,cord[1]])
        //up
        if (locY!= 'max') 
            checkList.push([cord[0]+1,cord[1]])

        //check for buffs
        similarbuff=false
        checkList.forEach((item) => {
            if (plot[item[0]][item[1]] != plot[cord[0]][cord[1]] && buffs[cord[0]][cord[1]] == buffs[item[0]][item[1]]) {
                similarbuff = true
            }

            if (plot[item[0]][item[1]] == plot[cord[0]][cord[1]] && !similarbuff) {
                effects[cord[0]][cord[1]][buffs[plot[item[0]][item[1]]]] = 0
                return
            }
            effects[cord[0]][cord[1]][buffs[plot[item[0]][item[1]]]] = 1
        })    
        updateDisplay(cord)
    })
}

function placePlant(elem,i) {
    var currentX = parseInt(elem.dataset.x)
    var currentY = parseInt(elem.dataset.y)

    elem.querySelector('[data-img-here]').style.backgroundImage = plants[selected].url
    plot[currentY][currentX] = plants[selected].num

    var locationX
    switch (currentX) {
        case 0:
            locationX = "min"    
            break;
        case maxX:
            locationX = "max"    
            break;
        default:
            locationX = "safe"
            break;
    }

    var locationY
    switch (currentY) {
        case 0:
            locationY = "min"    
            break;
        case maxY:
            locationY = "max"    
            break;
        default:
            locationY = "safe"
            break;
    }

    var updateList = [[currentY,currentX]]
    //left
    if (locationX!= 'min') 
        updateList.push([currentY,currentX-1])
    //right
    if (locationX!= 'max') 
        updateList.push([currentY,currentX+1])
    //down
    if (locationY!= 'min') 
        updateList.push([currentY-1,currentX])
    //up
    if (locationY!= 'max') 
        updateList.push([currentY+1,currentX])

    checkBuffs(updateList)
}

function createGrid(x,y) {
    x *= 3
    y *= 3
    maxX = x - 1
    maxY = y - 1
    var inner = "<table>"
    for (let i = 0; i < y; i++) {
        inner += "<tr>"
        for (let j = 0; j < x; j++) {
            inner += `<th data-spot data-x='` + j + `' data-y='` + i + `'>
                <div class="contain">
                    <div class="img-container" data-img-here></div>
                    <div class="indicators">
                        <div class="indicator" data-indicator="1"></div>
                        <div class="indicator" data-indicator="2"></div>
                        <div class="indicator" data-indicator="3"></div>
                        <div class="indicator" data-indicator="4"></div>
                        <div class="indicator" data-indicator="5"></div>
                    </div>
                </div>
            </th>`
        }
        inner += "</tr>"
    }
    inner += "</table>"
    grid.innerHTML = inner

    plot = makeArray2(x,y,0)
    effects = makeArray3(x,y,6,0)

    let buttons = document.querySelectorAll("[data-spot]")
    buttons.forEach((element,i) => {
        element.addEventListener('click', () => {
            placePlant(element,i)
        })
    });
}

//https://stackoverflow.com/a/13808461
function makeArray2(w, h, val) {
    var arr = [];
    for(let i = 0; i < h; i++) {
        arr[i] = [];
        for(let j = 0; j < w; j++) {
            arr[i][j] = val;
        }
    }
    return arr;
}

function makeArray3(w, h, l, val) {
    var arr = [];
    for(let i = 0; i < h; i++) {
        arr[i] = [];
        for(let j = 0; j < w; j++) {
            arr[i][j] = [];
            for (let k = 0; k < l; k++) {
                arr[i][j][k]=val;
            }
        }
    }
    return arr;
}

plotc.addEventListener('click', () => {
    createGrid(plotx.value,ploty.value)
})

buttons.forEach((button)=> {
    button.addEventListener('click', () => {
        selected = button.dataset.plant
    })

})

createGrid(plotx.value,ploty.value)