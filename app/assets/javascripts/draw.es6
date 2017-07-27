// Line
// 線の引き方
// http://qiita.com/nekoneko-wanwan/items/2827feaf5a831a0726aa
class Line {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
    }

    init() {
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.started = false;
        this.ended = false;
    }

    start(x,y) {
        this.startX = x;
        this.startY = y;
        this.started = true;
    }

    finish(x,y) {
        this.end(x,y);
        this.draw();
        this.init();
    }

    end(x,y) {
        this.endX = x;
        this.endY = y;
        this.ended = true;
    }

    draw() {
        if (this.started && this.ended) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.startX, this.startY);
            this.ctx.lineTo(this.endX, this.endY);
            this.ctx.closePath();
            this.ctx.stroke();
        }
    }
}

// Main
var canvas = document.getElementById('whiteboard');
var ctx = canvas.getContext('2d');
var line = new Line(canvas);
addEvent(canvas);

function addEvent(canvas) {
    // Eventにマウスドラッグで線引くのを登録する
    //描き始め
    canvas.addEventListener('mousedown', onClick, false);

    //描き中
    canvas.addEventListener('mousemove', onMove, false);

    //描き終わり
    canvas.addEventListener('mouseup', drawEnd, false);
    canvas.addEventListener('mouseout', drawEnd, false);
}

//event call back

//描き始め
function onClick(e) {
    line.start(x(e),y(e));
}

//描き終わり
function drawEnd(e) {
    line.finish(x(e),y(e));
}

//描き中
function onMove(e) {
    if (press(e)) {
        line.finish(x(e),y(e));
        line.start(x(e),y(e));
    }
}

// button
function clean() {
    ctx.clearRect(0,0,rect().width,rect().height);
}

function beforeDownload(id) {
    document.getElementById(id).href = canvas.toDataURL("image/png");
}

// utility

function x(e) {
    return e.clientX - rect().left;
}

function y(e) {
    return e.clientY - rect().top;
}

function rect() {
    return canvas.getBoundingClientRect();
}

// TODO: ブラウザごとに値の変化が違うらしい
// http://tkrkt.com/article/bottons-on-mousemove/
function press(e) {
    return (e.buttons === 1 || e.witch === 1)
}

function log(msg) {
    console.log(msg);
}