/// <reference path="phaser/phaser.d.ts"/>

class mainState extends Phaser.State {

    private background:Phaser.Sprite;
    private bird:Phaser.Sprite;
    private flapSound;

    //--------------------PRELOAD------------------------//
    preload():void {
        super.preload();

        //Cargamos los assets
        this.load.image('background', 'assets/backgound_floor.png');
        this.load.spritesheet('bird', 'assets/bird3.png', 34,24,3);

        this.load.audio('flap', 'assets/flap.wav');

        //Cargamos las fisicas que se aplicaran
        this.physics.startSystem(Phaser.Physics.ARCADE);

    }

    //--------------------CREATE------------------------//
    create():void {
        super.create();

        this.cargarFondo()
        this.cargarPajaro();


        this.flapSound = this.game.add.audio('flap');
    }

    cargarFondo():void{
        var background;
        background = this.add.image(0, 0, 'background');
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

        this.input.onTap.addOnce(this.empezar,this);
    }

    empezar():void{
        //Se le aplica la gravidad al juego para que el pajaro caiga
        this.game.physics.arcade.gravity.y = 1200;
    }

    //--------------------UPDATE------------------------//
    update():void {
        super.update();

        //Cuando apretamos se ejecuta el metodo para que el pajaro suba
        this.input.onTap.addOnce(this.subePajaro,this);

    }

    subePajaro():void{
        this.bird.body.velocity.y = -400;
        this.flapSound.play();
    }
}
class SimpleGame {

    game:Phaser.Game

    constructor() {
        this.game = new Phaser.Game(800, 500, Phaser.AUTO, 'gameDiv');
        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
}
window.onload = () => {
    var game = new SimpleGame();
};