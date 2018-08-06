/// <reference path='PhysicsLibrary.js' />
/// <reference path="Text.js" />
var canvas, context, stars, deltaTime;
const MARGEM = 2.8/10,
      HIST_LEN = 75;
function start()
{
    deltaTime = 1;
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    tela = new World(context, canvas);
    stars = new Array(4);
    stars[0] = new Star(new Point(canvas.width*MARGEM, canvas.height*MARGEM));
    stars[1] = new Star(new Point(canvas.width*(1-MARGEM), canvas.width*MARGEM));
    stars[2] = new Star(new Point(canvas.width*(1-MARGEM), canvas.height*(1-MARGEM)));
    stars[3] = new Star(new Point(canvas.width*MARGEM, canvas.height*(1-MARGEM)));
    stars[0].color.setColor(255,0,0);
    stars[1].color.setColor(0,255,0);
    stars[2].color.setColor(0,0,255);
    stars[3].color.setColor(255,255,0);
    
    for(let counter = 0; counter<4; counter++)
    {
        //stars[counter].coefAtrito = 0.015;
        stars[counter].next_star = stars[(counter+1)%4];
        stars[counter].setAcelByAngle(5, 90*(counter+1));
        tela.addObject(stars[counter], "star"+counter);
    }
    run();
}
function run()
{
    context.clearRect(0, 0, canvas.width, canvas.height);
    tela.move(deltaTime);
    tela.draw();
    requestAnimationFrame(run);
}
var Star = function(pos)
{
    herdar(Retangulo, this, arguments, 0);
    this.width = 3;
    this.height = 3;
    this.position.X = pos.X;
    this.position.Y = pos.Y;
    this.vel.X = 0;
    this.vel.Y = 0;
    this.color.setColor(255,255,255);
    this.strokeColor = new Cor();
    this.strokeColor.setColor(Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255));
    var obj = this;
    this.addEventListener("draw", function(){obj.update()});
    this.next_star;
    this.history = new Array();
    var obj = this;
    this.update = function()
    {
        obj.history.push(new Point(obj.position.X+obj.width/2, obj.position.Y+obj.height/2));
        if(obj.history.length > HIST_LEN)
            obj.history.shift();
        if(obj.history.length >= 2)
        {
            var l;
            var incremento = 1/obj.history.length;
            for(let counter = 0; counter < obj.history.length-1; counter++)
            {
                l = new Line(obj.history[counter], obj.history[counter + 1]);
                l.color.setColor(obj.color.red, obj.color.green, obj.color.blue, counter*incremento);
                l.draw(context);
            }
                
        }
        if(typeof(obj.next_star) == "undefined")
            return;
        var l = new Line(obj.position, obj.next_star.position);
        for(let counter = 0; counter<4; counter++)
            if(!(obj === tela.objects[counter]))
            {
                var l = new Line(obj.position, tela.objects[counter].position);
                var impulso = deltaTime*1*10e3/Math.pow(l.lenght(),2);
                this.setAcelByAngle(impulso, l.getInclinacao());
                tela.addObject(new Fragment(impulso, obj));
                obj.vel.X = round(obj.vel.X, 7);
                obj.vel.Y = round(obj.vel.Y, 7);
            }
    }
}

var Fragment = function(impulso, star)
{
    herdar(Retangulo, this, arguments, 0);
    var desvioAngular = 45*Math.random()-22.5;
    var angulo = (new Line(new Point(0,0), star.vel)).getInclinacao()+180+desvioAngular;
    desvioAngular %= 360;
    this.vel = new Point(0,0);
    this.setVelByAngle(Math.abs(star.getVelAbsoluta()-impulso), angulo);
    this.color = new Cor();
    this.color.setColor(star.color.red, star.color.green, star.color.blue, 1);
    this.position = new Point(star.position.X, star.position.Y);
    this.height = 1;
    this.width = this.height;
    var obj = this;
    this.addEventListener("draw", function(){obj.update()});
    this.update = function()
    {
        obj.color.alpha -= 0.05;
        if(obj.color.alpha <= 0)
            tela.removeObject(obj, false);
    }
}

function round(n, digits)
{
    return Math.floor(n*Math.pow(10, digits))/Math.pow(10, digits);
}