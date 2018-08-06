/// <reference path='PhysicsLibrary.js' />
/// <reference path="Text.js" />
var canvas, context, stars, deltaTime;
const MARGEM = 2.8/10;
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
    //context.clearRect(0, 0, canvas.width, canvas.height);
    tela.move(deltaTime);
    tela.draw();
    //var bl = new Circle(blackhole.X, blackhole.Y, 5);
    //bl.color.setColor(255,255,255,1);
    //bl.draw(context);
    //tela.objects["square"].setAcelByAngle(tela.objects["square"].getCenter().distanceFrom(tela.mouse)/150, l.getInclinacao());
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
    var obj = this;
    this.update = function()
    {
        if(typeof(obj.next_star) == "undefined")
            return;
        var l = new Line(obj.position, obj.next_star.position);
        //var c = new Circle(blackhole.X, blackhole.Y, l.lenght());
        //context.strokeStyle = this.strokeColor.getColor();
        //c.draw(context, false);
        //l.draw(context);
        for(let counter = 0; counter<4; counter++)
            if(!(obj === tela.objects[counter]))
            {
                var l = new Line(obj.position, tela.objects[counter].position);
                this.setAcelByAngle(deltaTime*1*10e3/Math.pow(l.lenght(),2), l.getInclinacao()); 
                obj.vel.X = round(obj.vel.X, 7);
                obj.vel.Y = round(obj.vel.Y, 7);
            }
    }
}

function round(n, digits)
{
    return Math.floor(n*Math.pow(10, digits))/Math.pow(10, digits);
}