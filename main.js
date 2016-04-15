/// <reference path="phaser/phaser.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var World = Phaser.World;
var Point = Phaser.Point;
var mainState = (function (_super) {
    __extends(mainState, _super);
    function mainState() {
        _super.apply(this, arguments);
        this.score = 0;
        this.counter = 0;
        this.comprobarInicio = false;
        this.gameOverComp = false;
    }
    //--------------------PRELOAD------------------------//
    mainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        //Cargamos los assets
        this.load.image('background', 'assets/backgound_floor.png');
        this.load.image('floor', 'assets/floor.png');
        this.load.spritesheet('bird', 'assets/bird3.png', 34, 24, 3);
        this.load.image('pipe', 'assets/pipeup.png');
        this.load.image('pipe1', 'assets/pipedown.png');
        this.load.audio('flap', 'assets/flap.wav');
        this.load.audio('hitSound', 'assets/pipe-hit.wav');
        //Cargamos las fisicas que se aplicaran
        this.physics.startSystem(Phaser.Physics.ARCADE);
    };
    mainState.prototype.create = function () {
        _super.prototype.create.call(this);
        this.cargarFondo();
        this.cargarPajaro();
        this.configPipes();
        this.cargarSuelo();
        this.crearTextos();
        this.flapSound = this.game.add.audio('flap');
        this.hitSound = this.game.add.audio('hitSound');
    };
    mainState.prototype.updateScoreCounter = function () {
        this.score = this.score + 1;
    };
    mainState.prototype.update = function () {
        _super.prototype.update.call(this);
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
    };
    //----------------------CREATES------------------------------//
    mainState.prototype.crearTextos = function () {
        this.startText = this.add.text(this.world.centerX, this.world.centerY, 'Click to start', { font: "40px Arial", fill: "#000000" });
        this.startText.anchor.setTo(0.5, 0.5);
        this.startText.fixedToCamera = true;
        this.scoreText = this.add.text(10, 10, 'Score: ' + this.score, { font: "30px Arial", fill: "#ffffff" });
        this.startText.anchor.setTo(0.5, 0.5);
        this.startText.fixedToCamera = true;
        this.gameOverText = this.add.text(this.world.centerX, this.world.centerY, '     Game Over \n <Click to restart>', { font: "40px Arial", fill: "#000000" });
        this.gameOverText.anchor.setTo(0.5, 0.5);
        this.gameOverText.fixedToCamera = true;
        this.gameOverText.visible = false;
    };
    mainState.prototype.cargarFondo = function () {
        this.background = this.game.add.tileSprite(0, 0, 900, 500, 'background');
    };
    mainState.prototype.cargarSuelo = function () {
        this.floor = this.add.sprite(this.world.centerX, 480, 'floor');
        this.floor.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this.floor, Phaser.Physics.ARCADE);
        this.floor.body.allowGravity = false;
        this.floor.body.immovable = true;
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
        this.comprobarInicio = true;
        //Se le aplica la gravidad al juego para que el pajaro caiga
        this.game.physics.arcade.gravity.y = 1200;
        this.startText.visible = false;
        this.game.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);
        this.game.time.events.loop(Phaser.Timer.SECOND, this.updateScoreCounter, this);
    };
    mainState.prototype.configPipes = function () {
        this.pipeGroup = this.add.group();
        this.pipeGroup.enableBody = true;
    };
    mainState.prototype.crearPipes = function () {
        var posicionesAbajo = [
            new Point(915, 250),
            new Point(915, 300),
            new Point(915, 230)
        ];
        var posicionesArriba = {
            "915, 250": { x: 915, y: -275 }, "915, 300": { x: 915, y: -200 }, "915, 230": { x: 915, y: -300 } };
        var pos = this.rnd.pick(posicionesAbajo);
        var x = pos.x;
        var y = pos.y;
        var param = posicionesArriba[x + ", " + y];
        var xA = param["x"];
        var yA = param["y"];
        var pipe = new Pipe(this.game, x, y, "pipe", 0);
        var pipe1 = new Pipe(this.game, xA, yA, "pipe1", 0);
        /*
         var pipe = new Pipe(this.game, 915, 250, "pipe", 0);
         var pipe1 = new Pipe(this.game, 915, -275, "pipe1", 0);
         */
        /*      var pipe = new Pipe(this.game, 915, 230, "pipe", 0);
         var pipe1 = new Pipe(this.game, 915, -300, "pipe1", 0);*/
        this.add.existing(pipe);
        this.add.existing(pipe1);
        this.pipeGroup.add(pipe);
        this.pipeGroup.add(pipe1);
    };
    mainState.prototype.updateCounter = function () {
        this.counter++;
    };
    //----------------------UPDATES------------------------------//
    mainState.prototype.subePajaro = function () {
        this.bird.body.velocity.y = -400;
        this.flapSound.play();
    };
    mainState.prototype.colisiones = function () {
        this.physics.arcade.collide(this.bird, this.floor, this.gameOver, null, this);
        this.physics.arcade.collide(this.bird, this.pipeGroup, this.chocaPipe, null, this);
    };
    mainState.prototype.chocaPipe = function () {
        this.pipeGroup.setAll("body.velocity.x", 0);
        this.gameOver(this.bird, this.floor);
    };
    mainState.prototype.gameOver = function (bird, floor) {
        this.gameOverText.visible = true;
        this.bird.kill();
        this.hitSound.play();
        this.input.onTap.addOnce(this.restart, this);
        this.gameOverComp = true;
    };
    mainState.prototype.restart = function () {
        this.score = 0;
        this.game.state.restart();
        this.gameOverComp = false;
    };
    mainState.prototype.moverPipes = function () {
        if (!this.comprobarInicio) {
            this.pipeGroup.setAll("body.velocity.x", 0);
        }
        else {
            this.pipeGroup.enableBody = true;
            this.pipeGroup.setAll("body.velocity.x", -150);
        }
    };
    return mainState;
})(Phaser.State);
var Pipe = (function (_super) {
    __extends(Pipe, _super);
    function Pipe(game, x, y, key, frame) {
        _super.call(this, game, x, y, key, frame);
        // Activamos las fisicas
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.immovable = true;
        this.body.allowGravity = false;
    }
    return Pipe;
})(Phaser.Sprite);
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(900, 500, Phaser.AUTO, 'gameDiv');
        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
    return SimpleGame;
})();
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=main.js.map