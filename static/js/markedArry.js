var figureAll = function(data) {
	// 显示 雷 周围的所有 数字
	// 返回一个扫雷游戏地图 雷和数字 数组
	var tds = es('td')
	var tdArrys = []
	var tdArry = []
	var index = 0
	for (var i = 0; i < data.col; i++) {
		for (var j = 0; j < data.row; j++) {
			var td = tds[index]
			if(td.hasMine){
				tdArry.push(9)
			}else {
				tdArry.push(0)
			}
			index++
		}
		tdArrys.push(tdArry)
		tdArry = []
	}
	return markedSquare(tdArrys)
}

var cloneArray = function(array) {
    var arrayClone = []
    for (var i = 0; i < array.length; i++) {
        var line = []
        for (var j = 0; j < array[i].length; j++) {
            line.push(array[i][j])
        }
        arrayClone.push(line)
    }
    return arrayClone
}

var plus1 = function(array, x, y) {
    //如果 数组的下标合法 就给数组的值 加 1
    if(x >= 0 && y >= 0 && x < array.length && y < array[x].length && array[x][y] != 9) {
        array[x][y]++
    }
}

var markAround = function(array, x, y) {
	// 给数组的 9 周围的数字 加 1
    plus1(array, x - 1, y - 1)
    plus1(array, x - 1, y)
    plus1(array, x - 1, y + 1)

    plus1(array, x, y - 1)
    plus1(array, x, y + 1)

    plus1(array, x + 1, y - 1)
    plus1(array, x + 1, y)
    plus1(array, x + 1, y + 1)
}


var markedSquare = function(array) {
    /*
    array 是一个「包含了『只包含了 0 9 的 array』的 array」
    返回一个标记过的 array
    ** 注意, 使用一个新数组来存储结果, 不要直接修改老数组

    范例如下, 这是 array
    [
        [0, 9, 0, 0],
        [0, 0, 9, 0],
        [9, 0, 9, 0],
        [0, 9, 0, 0],
    ]

    这是标记后的结果
    [
        [1, 9, 2, 1],
        [2, 4, 9, 2],
        [9, 4, 9, 2],
        [2, 9, 2, 1],
    ]

    规则是, 0 会被设置为四周 8 个元素中 9 的数量
    */
    var arrays = cloneArray(array)
    for(var i = 0; i < arrays.length; i++) {
        var arrayLine =   arrays[i].length
        for(var j = 0; j < arrayLine; j++) {
            if(arrays[i][j] === 9) {
                markAround(arrays, i, j)
            }
        }
    }
    return arrays
}
