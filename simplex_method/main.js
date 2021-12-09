let Row = 0, Column = 0
let simplex_list = []
let simplex_dict = {}, record_dict = {}

function generate_map(){
    document.getElementById("showform").innerHTML = ""
    document.body.style.color = "#123"
    Column = document.getElementById("column").value
    Row = document.getElementById("row").value
 
    for(let i = 0; i < Row; i++){
        for(let y = 0; y < Column; y++){
            var newInput = document.createElement("input")
            newInput.type ="number"
            document.getElementById("showform").appendChild(newInput)
            if(y == Column-2){
                var newOption = document.createElement("select")
                newOption.innerHTML = `
                <option value="Mequal"><=</option>
                <option value="equal">=</option>
                <option value="Bequal">>=</option>`
                document.getElementById("showform").appendChild(newOption)
            }
        }
        document.getElementById("showform").appendChild(document.createElement("p"))
        console.log(newOption.options[0].value)
        
        if(i == Row-1){
            document.getElementById("showform").appendChild(document.createTextNode("F(x) = z ="))
            for(let z = 0; z < Column-1; z++){
                let newInput = document.createElement("input")
                newInput.type ="number" 
                document.getElementById("showform").appendChild(newInput)
                if(z < Column-2) document.getElementById("showform").appendChild(document.createTextNode(" + "))
                else{
                    let temp = document.createElement("input")//用來補0的
                    temp.style.display = "none"
                    document.getElementById("showform").appendChild(temp)
                    let newOption = document.createElement("select")
                    newOption.innerHTML = `
                    <option value="Max">max</option>
                    <option value="Min">min</option>`
                    document.getElementById("showform").appendChild(newOption)
                }
            }   
            document.getElementById("showform").appendChild(document.createElement("p"))
            let newButton = document.createElement("div")
            newButton.innerHTML = `<input type="button" value="create" onclick="print_anwser()">`
            document.getElementById("showform").appendChild(newButton)
            console.log(document.getElementsByTagName("select")[Row].value)
        }
    }
}

function print_anwser(){
    let matrix_list = get_matrix()
    let anwser = 0
    let flag = true
    
    console.log(identity_matrix(Row)) 
    console.log(get_matrix())

    let m = document.querySelectorAll("#showform input")
    let count = 0
    for(let i = 0; i < Row; i++){
        for(let y = 0; y < Column; y++){ 
            if(m[count].value=="") flag = false
            count += 1
        }   
        
    }
    if(flag){
        simplex_method(matrix_list)
        for(let column = 0; column < matrix_list[0].length; column++){
            if(simplex_dict["x" + column] == 0){
                anwser = matrix_list[record_dict["x" + column]][matrix_list[0].length - 1] / matrix_list[record_dict["x" + column]][column]
            }
            else anwser = 0
            console.log("x"+column+" = "+anwser)
            document.getElementById("showAnwser").appendChild(document.createTextNode("=======================anwser========================="))
            document.getElementById("showAnwser").appendChild(document.createElement("p"))
            document.getElementById("showAnwser").appendChild(document.createTextNode("x"+column+" = "+anwser))
            document.getElementById("showAnwser").appendChild(document.createElement("p"))
        }
        anwser = matrix_list[matrix_list.length-1][matrix_list[0].length-1] / matrix_list[matrix_list.length-1][matrix_list[0].length-2]
        console.log("z = "+ anwser)
        document.getElementById("showAnwser").appendChild(document.createTextNode("======================================================"))   
        document.getElementById("showAnwser").appendChild(document.createElement("p"))
        document.getElementById("showAnwser").appendChild(document.createTextNode("z = "+anwser))
        document.getElementById("showAnwser").appendChild(document.createElement("p"))
        document.getElementById("showAnwser").appendChild(document.createTextNode("======================================================")) 
        document.getElementById("showAnwser").appendChild(document.createElement("p"))  
    }
    else{
        alert("input can not be null")
    }
    
}


function identity_matrix(size){
    let identity_list = []
    for(let i = 0; i <= size; i++){
        identity_list.push([])
        for(let j = 0; j <= size; j++){
            if(i==j){
                console.log(document.getElementsByTagName("select")[i].value)
                if(document.getElementsByTagName("select")[i].value == "Bequal" || document.getElementsByTagName("select")[i].value == "Min") identity_list[i].push(-1)
                else identity_list[i].push(1)
            }
            else identity_list[i].push(0)
        }
    }
    return identity_list
}

function get_matrix(){
    let m = document.querySelectorAll("#showform input")
    let matrix_list = []
    let identity_list = identity_matrix(Row)
    
    console.log("id:"+identity_list)
    let count = 0
    for(let i = 0; i <= Row; i++){// 加上目標函數
        matrix_list.push([])
        //console.log("i:"+i)

        for(let y = 0; y < Column; y++){ 
            //console.log(count)
            if(y==Column-1){
                for(let j = 0; j < identity_list[i].length; j++){
                    matrix_list[i].push(identity_list[i][j])
                }
            }
            if(m[count].value=="") matrix_list[i].push(0)
            else if(i==Row && document.getElementsByTagName("select")[Row].value == "Max") matrix_list[i].push(parseInt(-m[count].value))
            else matrix_list[i].push(parseInt(m[count].value))
            count += 1
        }   
        
    }
    return matrix_list
}


function find_column(list){
    let column_min = 0
    for(let i = 0; i < list[0].length - 2; i++){
        if(check_column(list, i)==-1) console.log("pass")
        else if(list[list.length-1][column_min] >= list[list.length-1][i]){
            column_min = i
        } 
    }
    return column_min
}

function find_row(list, column_min){
    let row_min = 0
    if(check_point(list)==-1){
        return -1
    }
    for(let i = 0; i < list.length-1; i++){
        if(list[i][column_min] != 0){
            if(list[row_min][list[0].length-1]/list[row_min][column_min] >= list[i][list[0].length-1]/list[i][column_min] && i >= 1){
                row_min = i
            }
        }
    }
    console.log("column_min"+ column_min)
    console.log("row_min"+row_min)
    return row_min
}

function gaussian_elimination(list, column_min, row_min){
    let rm = list[row_min][column_min]
    
    for(let y = 0; y < list[0].length; y++){
        list[row_min][y] /= rm
    }
    for(let i = 0; i < list.length; i++){
        if(i != row_min){
            let mu = list[i][column_min] / list[row_min][column_min]
            console.log(mu)
            for(let y = 0; y < list[i].length; y++){
                list[i][y] = list[i][y] - list[row_min][y] * mu
            }
        }
    }
    document.getElementById("showAnwser").appendChild(document.createTextNode("======================================================"))
    document.getElementById("showAnwser").appendChild(document.createElement("p"))
    document.getElementById("showAnwser").appendChild(document.createTextNode("找最後一行的最小值:  "+column_min))
    document.getElementById("showAnwser").appendChild(document.createTextNode("， 找最小列那一行的最小值:   "+row_min))
    document.getElementById("showAnwser").appendChild(document.createElement("p"))
    document.getElementById("showAnwser").appendChild(document.createTextNode("======================================================"))
    document.getElementById("showAnwser").appendChild(document.createElement("p"))
    document.getElementById("showAnwser").appendChild(document.createTextNode("高斯消去"))
    let newP = document.getElementById("showAnwser").appendChild(document.createElement("p"))
    let list_text = list.join(`<br>`)
    newP.innerHTML = list_text
    document.getElementById("showAnwser").appendChild(document.createTextNode("======================================================"))
    document.getElementById("showAnwser").appendChild(document.createElement("p"))
}

function check_point(list){
    let flag = true
    console.log(list)
    for(let i = 0; i < list[0].length +2; i++){
        if(list[list.length-1][i] < 0){
            flag = false  // 有小於0的元素就執行高斯
        }
    }
    if(checker(list)==-1 && flag){
        console.log("break!")
        return -1
    }
}

function checker(list){
    let checksum = 0, is0 = 0, is1 = 0
    for(let column = 0; column < list[0].length; column++){
        simplex_dict["x"+column] = list[list.length-1][column]
        if(simplex_dict["x"+column] == 0){
            checksum += 1
            let temp = 0
            for(let j = 0; j < list.length; j++){
                if(list[j][column]==0){
                    temp += 1
                }
                if(Math.abs(list[j][column])==1){
                    is1 += 1
                    record_dict["x"+column] = j
                }
                if(temp >= list.length - 1){
                    is0 += 1
                }
            }
        }
    }
    if(checksum == is0 && checksum == is1 && is0 != 0){
        return -1
    }
}

// 用來幫助一開始的尋找最小行
function check_column(list, column){
    let checksum = 0, is0 = 0, is1 = 0, temp = 0
    checksum+=1
    for(let j = 0; j < list.length; j++){
        if(list[j][column]==0) temp += 1
        if(Math.abs(list[j][column])==1) is1 += 1
        if(temp >= list.length - 1) is0 += 1
    } 
    if(checksum == is0 && checksum == is1 && is0 != 0) return -1

}

function simplex_method(list){
    let prelist = 0
    let count = 0
    while(find_row(list, find_column(list)) != -1 && count <= 30){
        gaussian_elimination(list, find_column(list), find_row(list, find_column(list)))
        //console.log(list)
        if(list[list.length-1][list[0].length-1] == prelist){ // z
            return gaussian_elimination(list, find_column(list), find_row(list, find_column(list)))
        }
        else{
            prelist = list[list.length-1][list[0].length-1]
        }
        count += 1
    }
    if(count >= 30) alert("no solution or muti solution")
}


/*let list001 = [[1, 2, 1, 0, 0, 100],
           [4, 3, 0, 1, 0, 250],
           [-5, -7, 0, 0, 1, 0]]  

simplex_method(list001)
let anwser = 0
console.log(simplex_dict)
for(let column = 0; column < list001[0].length-1; column++){
    if(simplex_dict["x" + column] == 0){
        anwser = list001[record_dict["x" + column]][list001[0].length - 1] / list001[record_dict["x" + column]][column]
    }
    else anwser = 0
    console.log("x"+column+" = "+anwser)
}
anwser = list001[list001.length-1][list001[0].length-1] / list001[list001.length-1][list001[0].length-2]
console.log("z = "+ anwser)*/