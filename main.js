/// <reference path="phaser/phaser.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mainState = (function (_super) {
    __extends(mainState, _super);
    function mainState() {
        _super.apply(this, arguments);
    }
    //--------------------PRELOAD------------------------//
    mainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        //Cargamos los assets
        this.load.image('background', 'assets/backgound_floor.png');
        this.load.spritesheet('bird', 'assets/bird3.png', 34, 24, 3);
        this.load.audio('flap', 'assets/flap.wav');
        //Cargamos las fisicas que se aplicaran
        this.physics.startSystem(Phaser.Physics.ARCADE);
    };
    //--------------------CREATE------------------------//
    mainState.prototype.create = function () {
        _super.prototype.create.call(this);
        this.cargarFondo();
        this.cargarPajaro();
        this.flapSound = this.game.add.audio('flap');
    };
    mainState.prototype.cargarFondo = function () {
        var background;
        background = this.add.image(0, 0, 'background');
    };
    mainState.prototype.cargarPajaro = function () {
        //Cargar el pajaro en el mapa y situarlo
        this.bird = this.add.sprite(150, this.world.centerY, 'bird');
        this.bird.anchor.setTo(0.5, 0.5);
        //Añadir la animacion del pajaro
        var fly = this.bird.animations.add('fly');
        this.bird.animations.play('fly', 30, true);
        //Activar las fisicas del pajaro
        this.physics.enable(this.bird, Phaser.Physics.ARCADE);
        this.bird.body.collideWorldBounds = true;
        this.bird.checkWorldBounds = true;
        this.bird.body.allowGravity = true;
        this.input.onTap.addOnce(this.empezar, this);
    };
    mainState.prototype.empezar = function () {
        //Se le aplica la gravidad al juego para que el pajaro caiga
        this.game.physics.arcade.gravity.y = 1200;
    };
    //--------------------UPDATE------------------------//
    mainState.prototype.update = function () {
        _super.prototype.update.call(this);
        //Cuando apretamos se ejecuta el metodo para que el pajaro suba
        this.input.onTap.addOnce(this.subePajaro, this);
    };
    mainState.prototype.subePajaro = function () {
        this.bird.body.velocity.y = -400;
        this.flapSound.play();
    };
    return mainState;
})(Phaser.State);
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(800, 500, Phaser.AUTO, 'gameDiv');
        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
    return SimpleGame;
})();
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=main.js.map