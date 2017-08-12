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

    start(x, y) {
        this.startX = x;
        this.startY = y;
        this.started = true;
    }

    finish(x, y) {
        this.end(x, y);
        this.draw(0,0,0);
        this.init();
    }

    end(x, y) {
        this.endX = x;
        this.endY = y;
        this.ended = true;
    }

    draw(r,g,b) {
        if (this.started && this.ended) {
            this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            this.ctx.beginPath();
            this.ctx.moveTo(this.startX, this.startY);
            this.ctx.lineTo(this.endX, this.endY);
            this.ctx.closePath();
            this.ctx.stroke();
        }
    }
}

// Main
supportTouch = 'ontouchend' in document;

var canvas = document.getElementById('whiteboard');
var ctx = canvas.getContext('2d');
fillCanvas(ctx,255,255,255);
var line = new Line(canvas);
var imgSrc = null;

addEvent(canvas);
document.getElementById('files').addEventListener('change', onLoadFile, false);

// Functions
function fillCanvas(ctx,r,g,b) {
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(0, 0, rect().right, rect().bottom);
}

function addEvent(canvas) {
    if (supportTouch) {
        //描き始め
        canvas.addEventListener('touchstart', onClick, false);
        //描き中
        canvas.addEventListener('touchmove', onTouchMove, false);
    } else {
        //描き始め
        canvas.addEventListener('mousedown', onClick, false);
        //描き中
        canvas.addEventListener('mousemove', onMouseMove, false);
        //描き終わり
        canvas.addEventListener('mouseup', drawEnd, false);
        canvas.addEventListener('mouseout', drawEnd, false);
    }
}

//event call back

function onLoadFile(evt) {
    var files = evt.target.files;
    loadImage(files[0])
}

// 画像のロード
function loadImage(imgFile) {
    var reader = new FileReader();

    reader.onload = (function(theFile) {
        return function(e) {
            drawImg(e.target.result);
            imgSrc = e.target.result;
        };
    })(imgFile);

    // Read in the image file as a data URL.
    reader.readAsDataURL(imgFile);
}

function drawImg(imgSrc) {
    var img = new Image();
    img.src = imgSrc;
    img.onload = function() {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}


//描き始め
function onClick(e) {
    line.start(x(e), y(e));
}

//描き終わり
function drawEnd(e) {
    line.finish(x(e), y(e));
}

//描き中
function onMouseMove(e) {
    if (press(e)) {
        line.finish(x(e), y(e));
        line.start(x(e), y(e));
    }
}

function onTouchMove(e) {
    event.preventDefault();
    line.finish(x(e), y(e));
    line.start(x(e), y(e));
}

// button
function clean() {
    ctx.clearRect(0, 0, rect().width, rect().height);
    if (imgSrc == null) {
        fillCanvas(ctx,255,255,255);
    } else {
        fillCanvas(ctx,0,0,0);
        drawImg(imgSrc);
    }
}

function beforeDownload(id) {
    document.getElementById(id).href = canvas.toDataURL("image/png");
}

// utility

function x(e) {
    if (supportTouch) {
        return e.touches[0].clientX - rect().left;
    } else {
        return e.clientX - rect().left;
    }
}

function y(e) {
    if (supportTouch) {
        return e.touches[0].clientY - rect().top;
    } else {
        return e.clientY - rect().top;
    }
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