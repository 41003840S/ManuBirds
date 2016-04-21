/// <reference path="phaser/phaser.d.ts"/>

import World = Phaser.World;
import Point = Phaser.Point;
class mainState extends Phaser.State {

    private background:Phaser.TileSprite;
    private bird:Phaser.Sprite;
    private floor:Phaser.Sprite;
    private flapSound;
    private hitSound;
    private pipeGroup:Phaser.Group;
    private startText:Phaser.Text;
    private gameOverText:Phaser.Text;
    private scoreText:Phaser.Text;
    private score = 0;
    private counter =0;
    private comprobarInicio = false;
    private gameOverComp = false;

    //--------------------PRELOAD------------------------//

    preload():void {
        super.preload();

        //Cargamos los assets
        this.load.image('background', 'assets/backgound_floor.png');
        this.load.image('floor', 'assets/floor.png');

        this.load.spritesheet('bird', 'assets/bird3.png', 34,24,3);
        this.load.image('pipe', 'assets/pipeup.png');
        this.load.image('pipe1', 'assets/pipedown.png');

        this.load.audio('flap', 'assets/flap.wav');
        this.load.audio('hitSound', 'assets/pipe-hit.wav');

        //Cargamos las fisicas que se aplicaran
        this.physics.startSystem(Phaser.Physics.ARCADE);

    }

    create():void {
        super.create();

        this.cargarFondo();
        this.cargarPajaro();
        this.configPipes();
        this.cargarSuelo();
        this.crearTextos();

        this.flapSound = this.game.add.audio('flap');
        this.hitSound = this.game.add.audio('hitSound');


    }
    updateScoreCounter(){
        this.score=this.score+1;

    }
    update():void {

        super.update();

        this.colisiones();

        //Cuando apretamos se ejecuta el metodo para que el pajaro suba
        this.input.onTap.addOnce(this.subePajaro, this);

        if (this.counter == 2 && this.comprobarInicio == true) {
            this.crearPipes();
            this.counter = 0;
        }

        this.moverPipes();

        this.background.tilePosition.x -= 2;
        if (!this.gameOverComp) {
            this.scoreText.setText("Score: " + this.score);
        }

        //Algoritmo de proyecto manhattan para el angulo del pajaro
        if (this.bird.body.velocity.y < 0 && this.bird.angle > -45) {
            this.bird.angle -= 3;
        } else {
            if (this.bird.body.velocity.y > 0 && this.bird.angle < 90) {
                this.bird.angle += 7;
            }
        }

        /*
                    if (this.bird.body.velocity.y < 0 && this.bird.body.velocity.y > -100) {
                        this.bird.angle = -15;
                    } else if (this.bird.body.velocity.y < -100 && this.bird.body.velocity.y > -200) {
                        this.bird.angle = -25;
                    } else if (this.bird.body.velocity.y < -200 && this.bird.body.velocity.y > -300) {
                        this.bird.angle = -35;
                    } else if (this.bird.body.velocity.y < -300 && this.bird.body.velocity.y > -400) {
                        this.bird.angle = -45;
                    }else if (this.bird.body.velocity.y > 0 && this.bird.body.velocity.y < 100) {
                        this.bird.angle = 15;
                    }else if (this.bird.body.velocity.y > 100 && this.bird.body.velocity.y < 200) {
                        this.bird.angle = 25;
                    }else if (this.bird.body.velocity.y > 200 && this.bird.body.velocity.y < 300) {
                        this.bird.angle = 35;
                    }else if (this.bird.body.velocity.y >300) {
                        this.bird.angle = 45;
                    }
            */
    }


    //----------------------CREATES------------------------------//

    private crearTextos():void {

        this.startText = this.add.text(this.world.centerX, this.world.centerY, 'Click to start',
            {font: "40px Arial", fill: "#000000"});
        this.startText.anchor.setTo(0.5, 0.5);
        this.startText.fixedToCamera = true;

        this.scoreText = this.add.text(10, 10, 'Score: ' + this.score,
            {font: "30px Arial", fill: "#ffffff"});
        this.startText.anchor.setTo(0.5, 0.5);
        this.startText.fixedToCamera = true;

        this.gameOverText = this.add.text(this.world.centerX, this.world.centerY, '     Game Over \n <Click to restart>',
            {font: "40px Arial", fill: "#000000"});
        this.gameOverText.anchor.setTo(0.5, 0.5);
        this.gameOverText.fixedToCamera = true;
        this.gameOverText.visible = false;
    }

    cargarFondo():void{
        this.background = this.game.add.tileSprite(0, 0, 900, 500, 'background');
    }

    cargarSuelo():void{
        this.floor = this.add.sprite(this.world.centerX, 480, 'floor');
        this.floor.anchor.setTo(0.5, 0.5);

        this.game.physics.enable(this.floor, Phaser.Physics.ARCADE);
        this.floor.body.allowGravity = false;
        this.floor.body.immovable = true;
    }

    cargarPajaro():void{

        //Cargar el pajaro en el mapa y situarlo
        this.bird = this.add.sprite(150,this.world.centerY , 'bird');
        this.bird.anchor.setTo(0.5, 0.5);

        //Añadir la animacion del pajaro
        var fly = this.bird.animations.add('fly');
        this.bird.animations.play('fly', 30, true);

        //Activar las fisicas del pajaro
        this.physics.enable(this.bird, Phaser.Physics.ARCADE);
        this.bird.body.collideWorldBounds = true;
        this.bird.checkWorldBounds = true;
        this.bird.body.allowGravity = true;
        this.bird.body.allowRotation = true;
        this.input.onTap.addOnce(this.empezar,this);
    }

    empezar():void{
        this.comprobarInicio = true;
        //Se le aplica la gravidad al juego para que el pajaro caiga
        this.game.physics.arcade.gravity.y = 1200;
        this.startText.visible = false;
        this.game.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);
        this.game.time.events.loop(Phaser.Timer.SECOND, this.updateScoreCounter, this);
    }

    configPipes():void{

        this.pipeGroup = this.add.group();
        this.pipeGroup.enableBody = true;
    }

    crearPipes():void {

        var posicionesAbajo:Point[] = [
            new Point(915, 250),
            new Point(915, 300),
            new Point(915, 230)
        ];


        var posicionesArriba = {
            "915, 250": {x: 915, y: -275}, "915, 300": {x: 915,y: -200}, "915, 230":{x:915,y:-300}};

        var pos = this.rnd.pick(posicionesAbajo);
        var x = pos.x;
        var y = pos.y;

        var param = posicionesArriba[x + ", " + y];
        var xA = param["x"];
        var yA = param["y"];

        var pipe = new Pipe(this.game, x, y, "pipe", 0);
        var pipe1 = new Pipe(this.game, xA, yA, "pipe1", 0);

        this.add.existing(pipe);
        this.add.existing(pipe1);
        this.pipeGroup.add(pipe);
        this.pipeGroup.add(pipe1);
    }

    updateCounter():void {
        this.counter++;
    }

    //----------------------UPDATES------------------------------//

    subePajaro():void{
        this.bird.body.velocity.y = -400;
        this.flapSound.play();
    }

    colisiones():void{
        this.physics.arcade.collide(this.bird, this.floor, this.gameOver, null, this);
        this.physics.arcade.collide(this.bird, this.pipeGroup, this.chocaPipe, null, this);
    }

    chocaPipe():void{
        this.pipeGroup.setAll("body.velocity.x", 0);
        this.gameOver(this.bird, this.floor);
        var twIn = this.add.tween(this.pipeGroup).to({alpha: 1}, 50);
        twIn.start();

        var twOut = this.add.tween(this.pipeGroup).to({alpha: 0}, 500);
        twIn.onComplete.add(() => {
            twOut.start();
        });
    }


    gameOver(bird:Phaser.Sprite, floor:Phaser.Sprite):void{
        this.gameOverText.visible = true;
        this.bird.kill();
        this.hitSound.play();
        this.input.onTap.addOnce(this.restart,this);
        this.gameOverComp=true;

    }

    restart():void{
        this.score= 0;
        this.game.state.restart();
        this.gameOverComp=false;
    }

    moverPipes():void{
        if(!this.comprobarInicio){
            this.pipeGroup.setAll("body.velocity.x", 0);
        }else {
            this.pipeGroup.enableBody = true;
            this.pipeGroup.setAll("body.velocity.x", -150);
        }
    }
}


class Pipe extends Phaser.Sprite{

    constructor(game:Phaser.Game, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame:string|number) {
        super(game, x, y, key, frame);

        // Activamos las fisicas
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.immovable = true;
        this.body.allowGravity = false;
    }
}

class SimpleGame {

    game:Phaser.Game

    constructor() {
        this.game = new Phaser.Game(900, 500, Phaser.AUTO, 'gameDiv');
        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
}
window.onload = () => {
    var game = new SimpleGame();
};