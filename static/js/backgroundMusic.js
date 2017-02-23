var s0 = {
    name: 'Video Games',
    singer: 'Lana Del Ray',
    path: 'Lana Del Rey - Video Games.mp3',
}
var s1 = {
    name: 'Young For You',
    singer: 'GALA',
    path: 'GALA - Young For You.mp3',
}
var s2 = {
    name: 'Sunshine Girl',
    singer: 'moumoon',
    path: 'moumoon - Sunshine Girl.mp3',
}
var s3 = {
    name: ' Hey, Soul Sister',
    singer: 'Train',
    path: 'Train - Hey, Soul Sister.mp3',
}
// 全局变量
const file = [s0, s1, s2, s3]
const gameMusicClass = '.ww-game-music'
const gameMusicControl = '.ww-game-play-music'
const gameMusicVoice = '.ww-game-voice'
const done = 'done'

var getSrc = function() {
    // 获取所有歌曲的 src 数组
    var srcs = []
    for (var i = 0; i < file.length; i++) {
        // log(file)
        let src = 'music/' + file[i].path
        srcs.push(src)
    }
    return srcs
}
var delEmptyU = function(src) {
    // 删除歌曲中 的 utf-8 空格
    var s = src.split('%20')
    var str = ''
    for (var i = 0; i < s.length; i++) {
        str += s[i]
    }
    return str
}
var delEmpty = function(srcs) {
    // 删除歌曲中 的  空格
    var srcss = []
    for (var i = 0; i < srcs.length; i++) {
        var s = srcs[i].split(' ')
        var str = ''
        for (var j = 0; j < s.length; j++) {
            str += s[j]
        }
        srcss.push(str)
    }
    return srcss
}

var getIndex = function(array, element, select = 1) {
	// array 是存储 所有歌曲的数组
	// element 是 当前播放的歌曲的名字
	// select 是用户选择的权值， 默认唯 1 ，也就是说下一首歌
	var index = -2
	var ele = element.split('/')
	element = ele[ele.length - 1]
    element = 'music/' + delEmptyU(element)
    array = delEmpty(array)
    log('src', element)
    log('src', array)
	for (var i = 0; i < array.length; i++) {
		if(element === array[i]) {
            log(i, index)
			if(select > 0 && i === array.length - 1){
				//对 应 下一曲
				index = 0
			} else{
				index = i + select
			}
			// if(select < 0 && index === -1){
			// 	// 对应 上一曲 顺序很重要
			// 	index = array.length - 1
			// 	// log('-1', index)
			// }
		}
	}
	return index
}

var circlePlay = function() {
	// 从当前歌曲 开始 循环 播放
	// 1, 获取 当前 歌曲 的 src
	// 2, 获取 下一首 歌曲的 src
	// 3. 播放
	// 1, 获取 当前 歌曲 的 src
    var nowMusic = e(gameMusicClass)
    bindEvent(nowMusic, 'ended', function() {
        // log(nowMusic.src)
        var a =  e('audio').querySelector('source')
        if(nowMusic.src == ''){
            nowMusic.src = a.src
        }
        // log(nowMusic.src)
        var srcs = getSrc()
        var index = getIndex(srcs, nowMusic.src)
        log(index)
        nowMusic.src = srcs[index]
        // log(nowMusic.src)
        nowMusic.play()
    })
}


var musicVoiceBindEvent = function() {
    var playVoice = e(gameMusicVoice)
    bindEvent(playVoice, 'click', function() {
        toggleClass(playVoice, done)
        var voice = '.ww-game-voice-control'
        if(playVoice.classList.contains(done)) {
            e(voice).style.display = 'inline-block'
        }else {
            e(voice).style.display = 'none'
        }
    })
    var voice = e('.ww-game-voice-control')
    bindEvent(voice, 'input', function() {
        // log('voice', voice.value)
        var v= voice.value * 0.1
        // 改变 css
        var background = `linear-gradient(to right ,#c91818 0%,#c91818 ${v * 100}%,#5b5b5b ${v * 100}%, #5b5b5b 100%)`
        voice.style.background = background
        // 改变歌曲声音
        var music = e(gameMusicClass)
        music.volume = v
    })
}
var musicPlayBindEvent = function() {
    var play = e(gameMusicClass)
    var start = e(gameMusicControl)
    bindEvent(start, 'click', function() {
        toggleClass(start, done)
        if(start.classList.contains(done)) {
            // 有 done 就播放， 无 done 就暂停
            play.play()
            start.src = 'static/img/pause.png'
        }else {
            play.pause()
            start.src = 'static/img/play.png'
        }
    })
}

var gameBindEvents = function() {
    musicVoiceBindEvent()
    musicPlayBindEvent()
}
var playMusic = function() {
	gameBindEvents()
    circlePlay()
}
playMusic()
