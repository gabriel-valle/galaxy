/// <reference path='PhysicsLibrary.js' />
/// <reference path="Text.js" />
var canvas, context, blackhole, deltaTime, timer;
const MARGEM = 100;
const SUBSTARS = 7;
const INTERVALO = 60;
function start()
{
    canvas = document.getElementById('canvas');
    var block = new RecursiveStar(new Point(canvas.width/2, canvas.height/2));
    block.color.setColor(255,255,255);
    context = canvas.getContext('2d');
    tela = new World(context, canvas);
    tela.addObject(block);
    timer = 0;
    run();
}
function run()
{
    timer++;
    if(timer == INTERVALO)
    {
        var l = tela.objects.length; // Guardamos o comprimento inicial do vetor
        check();
        limparEstrelas();
        for(let counter=0;counter<l;counter++)
            tela.objects[counter].destruir();
        limparEstrelas();
        check();
        timer = 0;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    tela.move(deltaTime);
    tela.draw();
    //check();
    limparEstrelas();
    //tela.objects["square"].setAcelByAngle(tela.objects["square"].getCenter().distanceFrom(tela.mouse)/150, l.getInclinacao());
    requestAnimationFrame(run);
}
function limparEstrelas()
{
    var screenArea = new Retangulo(0,0,canvas.width,canvas.height);
    for(let counter=0; counter<tela.objects.length; counter++)
    {
        if(tela.objects[counter].color.alpha <= 0 || !screenArea.contains(tela.objects[counter].position))
        {
            tela.removeObject(counter);
            counter--;
        }
    }
}
var RecursiveStar = function(pos)
{
    herdar(Retangulo, this, arguments, 0);
    this.width = 2;
    this.height = 2;
    this.position.X = pos.X;
    this.position.Y = pos.Y;
    this.color.setColor(Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255));
    this.color.setColor(255,255,255);
    this.strokeColor = new Cor();
    this.strokeColor.setColor(255,255,255);
    //this.strokeColor.setColor(Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255));
    var obj = this;
    //var auto_destruir = setTimeout(function(){obj.destruir();}, 1000);
    this.destruir = function()
    {
        var subcor = new Cor();
        subcor.setColor(Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255));
        subcor.setColor(255,255,255);
        for(counter=0; counter<SUBSTARS; counter++)
        {
            var star = new RecursiveStar(this.position);
            star.setVelByAngle(2, counter*360/SUBSTARS);
            star.color = subcor;
            tela.addObject(star);
        }
        obj.color.alpha = 0;
        /*var intervalo = 30;
        var razao = 0.05;
        var fadeOut = setInterval(
            function(){
                obj.color.alpha -= razao;
                if(obj.color.alpha<=0)
                {
                    clearInterval(fadeOut);
                }
            }, intervalo);*/
    }
}

function check()
{
    for(let counter=0; counter<tela.objects.length-1; counter++)
        for(let scounter=counter+1; scounter<tela.objects.length; scounter++)
        {
            if(tela.objects[counter].position.distanceFrom(tela.objects[scounter].position) <= 2)
            {
                 var l1 = new Line(new Point(0,0), tela.objects[counter].vel);
                 var l2 = new Line(new Point(0,0), tela.objects[scounter].vel);
                 var dif = Math.abs(l1.getInclinacao() - l2.getInclinacao());
                 if(dif>180)
                     dif = dif-180;
                 if(dif < 5)
                 {
                     tela.removeObject(scounter);
                     scounter--;
                 }
            }
        }
}