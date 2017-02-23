var findIndex  = function(arr,ele)  {
	//找到数组某个元素在数组中的位置
	for(var i=0,j=arr.length;i<j;i++){
		if(ele === arr[i]){
			return i;
		};
	};
	return -1;
}

var addVal = function(mineArr) {
	 //给有炸弹的td添加自定义属性hasMine值为true
	var tds = es('td')
	// console.log(td);
	for(var i = 0, j = mineArr.length; i < j; i++){
		tds[ mineArr[i] ].hasMine = true;
	}
	// console.log(tds);
}

var clickedShow = function(tds, index, num) {
	var target = tds[index]
	if (!target.classList.contains('mark')) {
		// 显示周围的雷数
		if(num > 0) {
			// log('ge', index)
			// log('target', target)
			target.classList.add('mark')
			target.innerHTML = `
					<span class='figure-${num}'>${num}</span>
				`
		}
	}

}
var indexOfClicked = function(num, data) {
	var index = []
	var x = Math.floor(num / data.row)
	var y = num - x * data.row
	index.push(x)
	index.push(y)
	return index
}
var circleClicked = function(x, y, data) {
	if( x < 0 || x >= data.col ) {
			return
	}
	if( y < 0 || y >= data.row ) {
			return
	}
	var tds = es('td')
	var index = x * data.row + y
	// console.log(index);
	// log('x', tds[index])
	var td = tds[index]
	if( !td.classList.contains('mark') && !td.hasMine) {
		leftClicked(index, data)
	}
}
var roundClick = function(x, y, data) {
	for(var i = x - 1; i <= x + 1; i++) {
		for(var j = y - 1; j <= y + 1; j++) {
			circleClicked(i, j, data)
		}
	}
}
var leftClicked = function(index, data) {
	 //统计事件源周围炸弹
	var arr = [];  //事件源周围的格子索引数组
	var tds = es('td')
	// var empty = data.col*data.row-data.mine;
	var [x, y] = indexOfClicked(index, data)
	// log('x, y', x, y)
	// log('index', index)
	// log(tds[index])
	if( tds[index] == undefined) {
		return
	}
 	var num = tds[index].children[0].innerHTML//事件源周围炸弹个数
	num = parseInt(num)
	// console.log(num);
	// 增加 class 意为被标记过， 并且如果 周围有雷 显示雷的个数
	clickedShow(tds, index, num)
	if(num === 0) {
		if(!tds[index].classList.contains('mark')) {
			tds[index].classList.add('mark')
		}
		roundClick(x, y,data)
	}
}

var insertfigure = function(data) {
	var map = figureAll(data)
	var tds = es('td')
	for (var i = 0; i < tds.length; i++) {
		let index_i = Math.floor(i / data.row)
		let index_j = i - (index_i) * data.row
		let f = map[index_i][index_j]
		tds[i].innerHTML = `<span class='figure-${f} hide'>${f}</span>`
	}
}
var timeStart = function(time) {
	// 绑定 游戏开始 事件
	var timeOnoff = time.dataset.state
	if(timeOnoff === 'off') {
		//开始计时
		timeOnoff = 'on';
		window.timer = setInterval(function(){
			// time.style.webkitAnimation = 'round 1s infinite';      //计时器翻转
			time.value++;
		},1000)
	}
}

var play = function(data,mineArr){
	var timeOnoff = false;
	var mineNum = e('.ww-input-bomb').value
	// 单击笑脸开始游戏
	 var time = e('.ww-input-time')
	timeStart(time)
	// 右键 插旗
	var Map = e('#table_map')
	Map.oncontextmenu = function(ev) {
		//插旗标记
		log('插旗')
		var target = ev.target
		if(target.className == 'mask' ) {
			// target.innerHTML = '▲'
			target.innerHTML = `
				<img class="ww-img-flag" src="static/img/飘扬的棋子.png" style="width:18px;height:18px;" alt="标记用的红棋">
			`
			target.style.color = '#FFEFAD'
			target.mark = true
			mineNum--
			e('.ww-input-bomb').value = mineNum
		}else if(target.className == 'ww-img-flag'){
			// 取消插旗标记
			mineNum++
			e('.ww-input-bomb').value = mineNum
			target.remove()
		}
		return false
	}
	// 左键单击 解开 棋盘迷雾
	var tds = es('td')
	bindEvent(Map, 'click', function(ev) {
		var target = ev.target
		// log('单击', target)
		if(!target.hasMine ){
			//没踩到雷
			// 如果点到 红棋 啥也不干
			// console.log('target', target);
			if(target.classList.contains('ww-img-flag')) {
				return
			}
			var index =  parseInt(target.getAttribute('index'))
			leftClicked(index, data);  //递归
			target.style.webkitAnimation = 'round 1s 1';
			// console.log(countSur(data));
			//通关检测
		   if( countSur(data).length == data.mine) {
				//剩下格子数等于 雷的个数 就过关了
			   clearInterval( window.timer )
			   var time = e('.ww-input-time')
			//    log(time)
			   openTd('不错，过关了！ 用时：'+time.value+'s',data);
			   // 改变图标 为 点赞图标
			   var img = e('.ww-img-game')
			   img.src = 'static/img/赞.png'
			   toggleClass(img, 'finish')
		   }
		}else if(target.hasMine){
			//踩到雷
			clearInterval(window.timer);     //停止计时器
			var time = e('.ww-input-time')
			time.style.webkitAnimation = '';      //停止计时器翻转
			target.style.color = 'red';
			// 变笑脸为失望脸 并添加class finish
			var img = e('.ww-img-game')
			img.src = 'static/img/失望娃娃.png'
			toggleClass(img, 'finish')
			openTd('朋友，你输了~',data);
		}
	})

}

var countSur = function(data) {
	//统计剩下的格子数
	var tds = es('td')
	var surplus = [];
	var j = data.col* data.row
	for( var i = 0; i < j; i++ ) {
		if( tds[i].className == 'mask' ) {
			surplus.push( i );
		};
	};
	return surplus;
}

var openTd = function (meg,data) {
	// 游戏结束 打开所有迷雾的函数
	var tds = es('td')
	var index = 0
	var index_i = 0
	var index_j = 0
	// 雷周围 数字的 详细数组
	var figureArr = figureAll(data)
	var show = setInterval(function(){
		// log('td',tds[index])
		tds[index].style.color = 'white';
		tds[index].classList.add('over')
		tds[index].style.webkitAnimation = 'round 1s 1';
		// log('i j', index_i)
		if(figureArr[index_i][index_j] === 9) {
			tds[index].innerHTML = `
			<img  src="static/img/雷.jpg" style="width:18px;height:18px;" alt="地雷">
			`
		}
		let f = tds[index].children[0]
		let v = parseInt(f.innerHTML)
		if(v > 0) {
			f.classList.remove('hide')
		}
		index_j ++
		if(index_j === data.row) {
			index_i ++
			index_j = 0
		}
		index ++
		if(index_i === data.col){
			clearInterval(show);
			// alert(meg);
		}
	},10)
}

var createMap = function(data)  {
	//生成画布
	var form = `<table id="table_map" cellpadding="0" cellspacing="0">
					<tbody></tbody>
				<table>
				`
	e('#ww-id-map').innerHTML = form
	// 根据不同难度设计 不同 的 css
	var stars =e('.ww-star').querySelectorAll('star')
	var num = stars.length
	var table_map = '#table_map'
	if(num === 3) {
		e(table_map).style.width = '660px'
		e(table_map).style.height = '352px'
		e(table_map).style.margin = '-15px 25px 0px 27px'
	}else if(num === 2) {
		e(table_map).style.width = '352px'
		e(table_map).style.height = '352px'
		e(table_map).style.margin = '-14px 25px 0px 24px'
	}else if(num === 1) {
		e(table_map).style.width = '198px'
		e(table_map).style.height = '198px'
		e(table_map).style.margin = '-2px 25px 0px 66px'
	}
	var tr = '<tr> </tr>'
	for(var i = 0; i < data.col; i++) {
		// 先 生成 一行 的标签
		e('tbody').innerHTML += tr
		for (var j = 0; j < data.row; j++) {
			// 后 生成 每个单元 的标签
			var template = `
					<td class="mask" index='${data.row*i + j}'></td>
			`
			var ts = es('tr')
			var t = ts[ts.length - 1]
			t.innerHTML += template
		}
	}
}

var createMine = function(data){
	//生成炸弹
	var indexArr = []
	var mineArr = []
	for(var i = 0,j = data.col*data.row; i < j; i++ ) {
		indexArr.push(i) ;   //所有单元格的索引
	};
	for( var i = 0; i < data.mine; i++ ) {
		//随机取出 mine 个做为炸弹的索引，不重复
		var index = Math.round(Math.random()*(indexArr.length-1));  //索引
		mineArr.push(indexArr.splice(index,1)[0]);
	};
	mineArr.sort( function(a,b){return a-b;} );
	return mineArr
}

var starAddOrMinus = function(src) {
	// 设置游戏难度
	// 增加或减少游戏难度
	if(src === 'add.png') {
		var star = e('.ww-star')
		var stars = star.querySelectorAll('star')
		var num = stars.length
		// log('star', num)
		if(num < 3){
			var marks = es('.ww-star-add-minus')
			marks[1].style.animation = 'addminus infinite 1s'
			star.innerHTML += `
				<star></star>
			`
			num ++
		}else{
			log('目前，没有更高的难度了')
		}
		if(num === 3) {
			var marks = es('.ww-star-add-minus')
			marks[0].style.animation = ''
		}
	}else if(src === 'minus.png') {
		var star = e('.ww-star')
		var stars = star.querySelectorAll('star')
		var num = stars.length
		// log('star', num)
		if(num > 1){
			var marks = es('.ww-star-add-minus')
			marks[0].style.animation = 'addminus infinite 1s'
			stars[num - 1].remove()
			num--
		}else{
			log('目前，已经是最低难度了')
		}
		if(num === 1) {
			var marks = es('.ww-star-add-minus')
			marks[1].style.animation = ''
		}
	}
	return num
}
var starTip = function() {
	var star = e('.ww-star')
	var stars = star.querySelectorAll('star')
	var num = stars.length
	var marks = es('.ww-star-add-minus')
	if(num === 3) {
		marks[0].style.animation = ''
		marks[1].style.animation = 'addminus infinite 1s'
	}else if(num === 2) {
		marks[0].style.animation = 'addminus infinite 1s'
		marks[1].style.animation = 'addminus infinite 1s'
	}
	else if(num === 1) {
		marks[0].style.animation = 'addminus infinite 1s'
		marks[1].style.animation = ''
	}
}

var init = function() {
	// 为了保险 设置 body 的 内容为空
	var map = e('#ww-id-map')
	map.innerHTML = ''
	// 提醒用户可以设置游戏难度了
	var marks = es('.ww-star-add-minus')
	marks[0].style.animation = 'addminus infinite 1s'
	marks[1].style.animation = 'addminus infinite 1s'
	// 设置不同难度的 css
	var star = e('.ww-star')
	var stars = star.querySelectorAll('star')
	var level = stars.length
	changeCss(level)
}
var changeData = function(data) {
	var stars = e('.ww-star').querySelectorAll('star')
	var num = stars.length
	if(num === 2) {
		data.mine = 40
		data.col = 16
		data.row = 16
	}else if(num === 1) {
		data.mine = 10
		data.col = 9
		data.row = 9
	}else if(num === 3) {
		data.mine = 99
		data.col = 16
		data.row = 30
	}else {
		log('星星数量错误')
	}
	return data
}

var changeCss = function(level) {
	if(level === 3) {
		// 高级难度 时 的 css
		// 改变 ww-id-game_box 的宽度
		e('#ww-id-game_box').style.width = '714px'
		e('#ww-id-game_box').style.height = '463px'
		e('.ww-div-game').style.left = '321px'
		e('.tip').style.top = '-23px'
		e('.tip').style.left = ' 258px'
		e('.ww-game-play-music').style.left = '393px'
		e('.ww-game-voice').style.left = '395px'
		e('.ww-game-voice-control').style.left = '330px'
	} else if(level === 2) {
		e('#ww-id-game_box').style.width = '400px'
		e('#ww-id-game_box').style.height = '463px'
		e('.ww-div-game').style.left = '164px'
		e('.tip').style.top = '-20px'
		e('.tip').style.left = '103px'
		e('.ww-game-play-music').style.left = '93px'
		e('.ww-game-voice').style.left = '95px'
		e('.ww-game-voice-control').style.left = '30px'
	} else if(level === 1) {
		e('#ww-id-game_box').style.width = '335px'
		e('#ww-id-game_box').style.height = '354px'
		e('.ww-div-game').style.left = '133px'
		e('.tip').style.top = '-20px'
		e('.tip').style.left = '68px'
		e('.ww-game-play-music').style.left = '83px'
		e('.ww-game-voice').style.left = '85px'
		e('.ww-game-voice-control').style.left = '20px'
	}else {
		log('changeCss 游戏难度等级错误！')
	}
}
var onOffMusic = function() {
	var voice = e('.ww-game-play-music')
	if(!voice.classList.contains('game')) {
		voice.classList.add('game')
		voice.src = 'static/img/pause.png'
		e('.ww-game-music').play()
		e('.ww-game-music').currentTime = 0
	}else {
		voice.classList.remove('game')
		voice.src = 'static/img/play.png'
		e('.ww-game-music').pause()
	}
}

var gameBegin = function(data){
	// 0 播放音乐
	onOffMusic()
	// 1 生成炸弹
	e('.ww-input-bomb').value = data.mine
	var mineArr = createMine(data)
	// 2 生成画布
	createMap(data)
	// 3 给有炸弹的 "空格" 加上 hasMine 属性
	addVal(mineArr)
	// 加上地图 描述
	insertfigure(data)
	// 4 开始游戏
	play(data, mineArr)
}

var _main = function(data) {
	init()
	// 点击笑脸开始游戏，游戏结束 点击哭脸重新开始游戏
	var start = e('.ww-img-game')
	// 根据游戏 map 决定 游戏的状态
	var map = e('#ww-id-map')
	bindEvent(start, 'click', function() {
		if(start.classList.contains('finish')) {
			map.innerHTML = ''
			start.classList.remove('finish')
			e('.ww-input-time').value = 0
			start.src = 'static/img/笑脸.png'
			var tip = e('.tip')
			toggleClass(tip, 'hide')
			// 设置 游戏状态为 正在游戏结束
			map.dataset.state='finished'
			// 根据游戏当前难度 打开游戏难度提示
			starTip()
			// 设置 剩余炸弹数量 为 空
			e('.ww-input-bomb').value = ''
			// 关闭音乐
			onOffMusic()
		}else if(map.innerHTML == ''){
			// log('click')
			// 设置 游戏状态为 正在游戏中
			map.dataset.state='playing'
			gameBegin(data)
			// 开关 红字 提醒
			var tip = e('.tip')
			toggleClass(tip, 'hide')
			// 删除游戏难度提醒
			var marks = es('.ww-star-add-minus')
			marks[0].style.animation = ''
			marks[1].style.animation = ''
		}
	})
	// 增加 或 减少 星星
	var game = es('.ww-star-add-minus')
	bindEvents(game, 'click', function(event){
		// log('add', game.src)
		var src = event.target.src.split('/')
		src = src[src.length - 1]
		// console.log(src);
		// 如果可以设置游戏难度则 设置
		var state = e('#ww-id-map').dataset.state
		if(state != 'playing') {
			var level = starAddOrMinus(src)
			// 根据 难度的 不同设置雷数和 行数和列数
			data = changeData(data)
			// log('data', data)
			// 设置不同难度的 css
			changeCss(level)

		}else{
			log('您现在还不能设置难度，游戏结束才可以')
			log('可以按返回按钮提前结束游戏')
		}
	})
}

log('Welcome to here!')
var saolei = function() {
	var data= {
		 //关卡 1
		 mine:10, col: 9, row: 9,
	}
	log('hs')
	_main(data)
}
saolei()
