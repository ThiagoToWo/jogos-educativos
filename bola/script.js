var ctx; // contexto 2d
// atributos da bola
var ball_x = 50;
var ball_y = 60;
var ball_r = 10;
var ball_vx = 4;
var ball_vy = 8;
// atributos da caixa
var box_x = 20;
var box_y = 30;
var box_w = 350;
var box_h = 250;
var lim_esq = box_x + ball_r;
var lim_dir = box_x + box_w - ball_r;
var lim_cima = box_y + ball_r;
var lim_baixo = box_y + box_h - ball_r;

function init() {
	var hue = [
		[255, 0, 0],
		[255, 255, 0],
		[0, 255, 0],
		[0, 255, 255],
		[0, 0, 255],
		[255, 0, 255]
	]
	var color;
	
	ctx = document.getElementById('canvas').getContext('2d');
	var grad = ctx.createLinearGradient(
		box_x,
		box_y,
		box_x + box_w,
		box_y + box_h
		);
		
	for (var h in hue) {
		color = 'rgb(' + hue[h][0] + ',' + hue[h][1] +
			',' + hue[h][2] + ')';
		grad.addColorStop(h/hue.length, color);
	}
	ctx.lineWidth = ball_r;
	ctx.fillStyle = grad;
	ctx.strokeStyle = grad;
	
	moveball();
	
	setInterval(moveball, 100);
}

function moveball() {
	ctx.clearRect(box_x, box_y, box_w, box_h);
	
	moveandcheck();
	
	ctx.beginPath();
	ctx.arc(ball_x, ball_y, ball_r, 0, 2 * Math.PI);
	ctx.fill();
	
	ctx.strokeRect(box_x, box_y, box_w, box_h);
}

function moveandcheck() {
	var nball_x = ball_x + ball_vx;
	var nball_y = ball_y + ball_vy;
	
	if (nball_x > lim_dir) {
		ball_vx = -ball_vx;
		nball_x = lim_dir;
	}
	
	if (nball_x < lim_esq) {
		ball_vx = -ball_vx;
		nball_x = lim_esq;
	}
	
	if (nball_y < lim_cima) {
		ball_vy = -ball_vy;
		nball_y = lim_cima;
	}
	if (nball_y > lim_baixo) {
		ball_vy = -ball_vy;
		nball_y = lim_baixo;
	}
	
	ball_x = nball_x;
	ball_y = nball_y;
}

function mudar() {
	ball_vx = Number(document.f.vx.value);
	ball_vy = Number(document.f.vy.value);
	
	return false;
}