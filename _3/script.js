/// <reference path='PhysicsLibrary.js' />
/// <reference path="Text.js" />
var canvas, context, blackhole, deltaTime;
const MARGEM = 100;
const PONTOS = 1;
function start()
{
    deltaTime = 1;
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    tela = new World(context, canvas);
    blackhole = new Point(canvas.width/2, canvas.height/2);
    for(counter=0; counter<PONTOS; counter++)
    {
        var deltaY = Math.random()*(canvas.height-MARGEM)+MARGEM/2;
        var deltaX = Math.random()*(canvas.width-MARGEM)+MARGEM;
        var st = new Star(new Point(deltaX, deltaY), new Point(Math.random()*8-5, Math.random()*8-5));
        tela.addObject(st);
    }
    run();
}
function run()
{
    //context.clearRect(0, 0, canvas.width, canvas.height);
    tela.move(deltaTime);
    tela.draw();
    var bl = new Circle(blackhole.X, blackhole.Y, 5);
    bl.color.setColor(255,255,255,1);
    bl.draw(context);
    //tela.objects["square"].setAcelByAngle(tela.objects["square"].getCenter().distanceFrom(tela.mouse)/150, l.getInclinacao());
    requestAnimationFrame(run);
}
var Star = function(pos, vel)
{
    herdar(Retangulo, this, arguments, 0);
    this.width = 1;
    this.height = 1;
    this.position.X = pos.X;
    this.position.Y = pos.Y;
    this.vel.X = vel.X;
    this.vel.Y = vel.Y;
    this.color.setColor(255,255,255);
    this.strokeColor = new Cor();
    this.strokeColor.setColor(Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255));
    var obj = this;
    this.addEventListener("draw", function(){obj.update()});
    this.update = function()
    {
        var l = new Line(this.position, blackhole);
        //var c = new Circle(blackhole.X, blackhole.Y, l.lenght());
        //context.strokeStyle = this.strokeColor.getColor();
        //c.draw(context, false);
        //l.draw(context);
        this.setAcelByAngle(deltaTime*10e3/Math.pow(l.lenght(),2), l.getInclinacao());
    }
}