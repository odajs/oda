import ODA from '../../oda.js';
import '../../components/buttons/button/button.js';


const PIx2 = Math.PI * 2;

const MOBILE = /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const pathsToTextures = ['wall1.png', 'wall2.png'];
const textures = [];
loadTextures();
const FPS = 30;
const SPEED = 5;
const CELL_SIZE = 32;
const FOV = toRadians(60);
const COLORS = {
  floor: "#bbbbbb", // "#ff6361"
  ceiling: "#888888", // "#012975",
  wall: "#013aa6", // "#58508d"
  wallDark: "#012975", // "#003f5c"
  rays: "#ffa600",
};
// const COLORS = {
//   floor: { h: 4, s: 75, l: 48, a: 1 },
//   ceiling: { h: 4, s: 75, l: 48, a: 1 },
//   wall: { h: 4, s: 75, l: 48, a: 1 },
//   wallDark: { h: 4, s: 75, l: 48, a: 1 },
//   rays: { h: 4, s: 75, l: 48, a: 1 },
// };
const objects = [];
const characters = [];
class Character {
  x = 0;
  y = 0;
  angle = toRadians(0);
  speed = 0;
  strafe = 0;
  width = 25;
  height = 100;
  sprite = null;
}
class Player extends Character {
  x = CELL_SIZE * 2;
  y = CELL_SIZE * 2;
}
const player = new Player();
characters.push(player);

for (let i = 0; i < 3; i++) {
  const mob = new Character();
  mob.x = CELL_SIZE * 3;
  mob.y = CELL_SIZE * (3 + i * 3);
  mob.sprite = new Image();
  mob.sprite.src = './monster1.png';
  characters.push(mob);
}
objects.push(...characters.filter(c => c !== player));

ODA({
  is: 'oda-doom',
  template: /*html*/`
    <style>
      :host{
        @apply --flex;
        @apply --horizontal;
        background-image: url('./logo.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        background-clip: border-box;
      }
      div.start-text{
        position: absolute;
        top: 45%;
        left: 40%;
        font-size: 300%;
        color: red;
        text-shadow: -2px -2px white, 5px 5px 5px black;
        cursor: pointer;
      }
      .controls{
        position: absolute;
        bottom: 8px;
        left: 8px;
      }
      .controls oda-button{
        background-color: rgba(0,0,0,0.5);
        fill: rgba(255,255,255,0.5);
        margin: 4px;
        border-radius: 16px;
      }
    </style>
    <canvas ref="cnv" :hidden="!play"></canvas>
    <div ~if="!play" class="start-text">CLICK TO START</div>
    <div ~if="play && MOBILE" class="vertical controls">
      <div class="horizontal">
        <div class="flex"></div>
          <oda-button icon="icons:chevron-right:270" @click.stop @touchstart="forward($event)"></oda-button>
        <div class="flex"></div>
      </div>
      <div class="horizontal">
        <oda-button icon="icons:chevron-right:180" @click.stop @touchstart="left($event)"></oda-button>
        <oda-button icon="icons:chevron-right:90" @click.stop @touchstart="back($event)"></oda-button>
        <oda-button icon="icons:chevron-right" @click.stop @touchstart="right($event)"></oda-button>
      </div>
    </div>
    `,
  hostAttributes: {
    tabindex: 0,
  },
  props: {
    iconSize: {
      default: 48,
      shared: true,
    },
    MOBILE: MOBILE,
    SPEED: SPEED,
    // map: [
    //   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    //   [1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    //   [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1],
    //   [1, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    //   [1, 0, 0, 0, 0, 2, 0, 2, 1, 1, 0, 0, 0, 1, 0, 1],
    //   [1, 0, 1, 0, 0, 2, 0, 2, 1, 1, 1, 0, 1, 1, 0, 1],
    //   [1, 0, 1, 0, 0, 0, 0, 2, 1, 1, 1, 0, 1, 1, 0, 1],
    //   [1, 1, 1, 0, 2, 2, 2, 2, 0, 0, 0, 0, 1, 1, 0, 1],
    //   [1, 1, 1, 0, 2, 2, 2, 2, 0, 0, 0, 0, 1, 1, 0, 1],
    //   [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
    //   [1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1],
    //   [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    //   [1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    //   [1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    //   [1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
    //   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    // ],
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    ctx: null,
    cnv: null,
    scrWidth() {
      return ~~document.body.offsetWidth / 2
    },
    scrHeight() {
      return ~~document.body.offsetHeight / 2
    },
    play: false
  },
  listeners: {
    tap(e) {
      if (!this.play || e.currentTarget === this) {
        if (!MOBILE) {
          this.$refs.cnv.requestPointerLock();
        }

        this.requestFullscreen();
        this.start();
      }
    },
    keydown(e) {
      if (e.keyCode === 87) {
        player.speed = SPEED;
      }
      if (e.keyCode === 83) {
        player.speed = -SPEED;
      }
      if (e.keyCode === 65) {
        player.strafe = -SPEED;
      }
      if (e.keyCode === 68) {
        player.strafe = SPEED;
      }
    },
    keyup(e) {
      if (e.keyCode === 87 || e.keyCode === 83) {
        player.speed = 0;
      }
      if (e.keyCode === 65 || e.keyCode === 68) {
        player.strafe = 0;
      }
    },
    mousemove(evt) {
      player.angle += toRadians(evt.movementX / 20);
    },
  },
  start() {
    if (!this.play) {
      this.play = true;
      this.cnv = this.$refs.cnv;
      this.cnv.setAttribute("width", this.scrWidth);
      this.cnv.setAttribute("height", this.scrHeight);
      this.ctx = this.cnv.getContext('2d');
      if(MOBILE){
        this.listenSwipe();
      }
      setInterval(() => this.gameLoop(), 1000 / FPS);
      this.focus();
    }
  },
  clearScreen() {
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.scrWidth, this.scrHeight);
  },
  renderMinimap(posX = 0, posY = 0, scale, rays) {
    if(MOBILE) scale = scale / 2;
    const cellSize = scale * CELL_SIZE;
    this.map.forEach((row, y) => {
      row.forEach((cell, x) => {
        this.ctx.fillStyle = cell ? "white" : 'black';
        this.ctx.fillRect(
          posX + x * cellSize,
          posY + y * cellSize,
          cellSize,
          cellSize
        );
      });
    });
    this.ctx.strokeStyle = COLORS.rays;
    // rays.forEach((ray) => {
    //   this.ctx.beginPath();
    //   this.ctx.moveTo(player.x * scale, player.y * scale);
    //   this.ctx.lineTo(
    //     (player.x + Math.cos(ray.angle) * ray.distance) * scale,
    //     (player.y + Math.sin(ray.angle) * ray.distance) * scale
    //   );
    //   this.ctx.closePath();
    //   this.ctx.stroke();
    // });
    characters.forEach(ch => {
      this.ctx.fillStyle = ch === player ? "blue" : 'red';
      const halsSize = ch.width / 2;
      const r = halsSize * scale;
      this.ctx.beginPath();
      this.ctx.arc(
        posX + ch.x * scale,
        posY + ch.y * scale,
        r,
        0,
        PIx2
      );
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.beginPath();
      if (ch === player) {
        this.ctx.moveTo(player.x * scale, player.y * scale);
        const centerRay = rays[~~(rays.length / 2)];
        this.ctx.lineTo(
          (player.x + Math.cos(player.angle) * centerRay.distance) * scale,
          (player.y + Math.sin(player.angle) * centerRay.distance) * scale
        );
        this.ctx.closePath();
        this.ctx.stroke();
      }
    });
  },
  outOfMapBounds(x, y) {
    return x < 0 || x >= this.map[0].length || y < 0 || y >= this.map.length;
  },
  getVCollision(obj, angle, dist = Infinity) {
    const right = Math.abs(Math.floor((angle - Math.PI / 2) / Math.PI) % 2);

    const firstX = right
      ? Math.floor(obj.x / CELL_SIZE) * CELL_SIZE + CELL_SIZE
      : Math.floor(obj.x / CELL_SIZE) * CELL_SIZE;

    const firstY = obj.y + (firstX - obj.x) * Math.tan(angle);

    const xA = right ? CELL_SIZE : -CELL_SIZE;
    const yA = xA * Math.tan(angle);

    let wall;
    let chars = [];
    let nextX = firstX;
    let nextY = firstY;
    while (!wall) {
      const cellX = right
        ? Math.floor(nextX / CELL_SIZE)
        : Math.floor(nextX / CELL_SIZE) - 1;
      const cellY = Math.floor(nextY / CELL_SIZE);

      if (this.outOfMapBounds(cellX, cellY)) {
        break;
      }
      wall = this.map[cellY][cellX];
      const char = objects.find(c => ~~(c.y / CELL_SIZE) === cellY && ~~(c.x / CELL_SIZE) === cellX);
      if (char) chars.push({ char, dist: distance(obj.x, obj.y, nextX, nextY) });
      if (!wall) {
        nextX += xA;
        nextY += yA;
      }
      if (distance(obj.x, obj.y, nextX, nextY) > dist) break;
    }
    return {
      angle,
      distance: distance(obj.x, obj.y, nextX, nextY),
      vertical: true,
      x: nextX,
      y: nextY,
      wall,
      chars
    };
  },
  getHCollision(obj, angle, dist = Infinity) {
    const up = Math.abs(Math.floor(angle / Math.PI) % 2);
    const firstY = up
      ? Math.floor(obj.y / CELL_SIZE) * CELL_SIZE
      : Math.floor(obj.y / CELL_SIZE) * CELL_SIZE + CELL_SIZE;
    const firstX = obj.x + (firstY - obj.y) / Math.tan(angle);

    const yA = up ? -CELL_SIZE : CELL_SIZE;
    const xA = yA / Math.tan(angle);

    let wall;
    let chars = [];
    let nextX = firstX;
    let nextY = firstY;
    while (!wall && distance(obj.x, obj.y, nextX, nextY) < dist) {
      const cellX = Math.floor(nextX / CELL_SIZE);
      const cellY = up
        ? Math.floor(nextY / CELL_SIZE) - 1
        : Math.floor(nextY / CELL_SIZE);

      if (this.outOfMapBounds(cellX, cellY)) {
        break;
      }

      wall = this.map[cellY][cellX];
      const char = objects.find(c => ~~(c.y / CELL_SIZE) === cellY && ~~(c.x / CELL_SIZE) === cellX);
      if (char) chars.push({ char, dist: distance(obj.x, obj.y, nextX, nextY) });
      if (!wall) {
        nextX += xA;
        nextY += yA;
      }
      if (distance(obj.x, obj.y, nextX, nextY) > dist) break;
    }
    return {
      angle,
      distance: distance(obj.x, obj.y, nextX, nextY),
      vertical: false,
      x: nextX,
      y: nextY,
      wall,
      chars
    };
  },
  castRay(obj, angle, dist) {
    const vCollision = this.getVCollision(obj, angle, dist);
    const hCollision = this.getHCollision(obj, angle, dist);

    return hCollision.distance < vCollision.distance ? hCollision : vCollision;
  },
  getRays() {
    const initialAngle = player.angle - FOV / 2;
    const numberOfRays = this.scrWidth;
    const angleStep = FOV / numberOfRays;
    return Array.from({ length: numberOfRays }, (_, i) => {
      const angle = initialAngle + i * angleStep;
      const ray = this.castRay(player, angle);
      return ray;
    });
  },
  renderScene(rays) {
    const topH = ~~(this.scrHeight * (MOBILE ? 0.45 : 0.55));
    const gradient1 = this.ctx.createLinearGradient(0, 0, 0, topH);
    gradient1.addColorStop(0, "rgba(0,0,0,0)");
    gradient1.addColorStop(1, "rgba(0,0,0,1)");
    const gradient2 = this.ctx.createLinearGradient(0, topH, 0, this.scrHeight);
    gradient2.addColorStop(0, "rgba(0,0,0,1)");
    gradient2.addColorStop(1, "rgba(0,0,0,0)");

    this.ctx.fillStyle = COLORS.ceiling;
    this.ctx.fillRect(0, 0, this.scrWidth, topH);
    this.ctx.fillStyle = gradient1;
    this.ctx.fillRect(0, 0, this.scrWidth, topH);

    this.ctx.fillStyle = COLORS.floor;
    this.ctx.fillRect(0, topH, this.scrWidth, this.scrHeight);
    this.ctx.fillStyle = gradient2;
    this.ctx.fillRect(0, topH, this.scrWidth, this.scrHeight);
    const chars = [];
    rays.forEach((ray, i) => {
      const distance = fixFishEye(ray.distance, ray.angle, player.angle);
      const wallHeight = ((this.scrHeight / 5) / distance) * 255;
      const t = textures[ray.wall] || textures[0];
      const pos = ~~((ray.vertical ? ray.y : ray.x) * CELL_SIZE % t.naturalWidth);
      this.ctx.drawImage(t, pos, 0, 1, t.naturalHeight, i, topH - wallHeight / 2, 1, wallHeight);

      this.ctx.fillStyle = `rgba(0,0,0,${Math.min(0.9, (distance / 300) + ray.vertical / 4)})`;
      this.ctx.fillRect(i, topH - wallHeight / 2, 1, wallHeight);
      ray.chars.forEach(char => {
        if (!chars.some(ch => ch.char.char === char.char)) {
          const obj = { ray, i, char };
          chars.push(obj);
        }
      });
    });
    chars.sort((a, b) => a.dist < b.dist ? 1 : -1).forEach(obj => {
      const char = obj.char.char;
      const dist = obj.char.dist;
      const ray = obj.ray;
      const distance = fixFishEye(dist, ray.angle, player.angle);
      if (char !== player) {
        const height = ((this.scrHeight / 3) / distance) * char.height;
        const width = (char.width / distance) * this.scrWidth;
        // const top = this.scrHeight - height;
        // this.ctx.filter = `brightness(${1 - Math.min(0.9, (distance / 300) + ray.vertical / 4)})`;
        this.ctx.drawImage(char.sprite, 0, 0, char.sprite.naturalWidth, char.sprite.naturalHeight, obj.i, topH, width, height);
        // this.ctx.filter = 'brightness(1)';
      }
    });
  },
  move(obj) {
    if (!obj || (!obj.speed && !obj.strafe)) return;
    const bumps = checkCollisions.call(this, obj);
    let dx = Math.cos(obj.angle) * obj.speed + Math.cos(obj.angle + toRadians(90)) * obj.strafe;
    let dy = Math.sin(obj.angle) * obj.speed + Math.sin(obj.angle + toRadians(90)) * obj.strafe;
    if ((dx > 0 && bumps[0]) || (dx < 0 && bumps[2])) dx = 0;
    if ((dy > 0 && bumps[1]) || (dy < 0 && bumps[3])) dy = 0;
    obj.x += dx;
    obj.y += dy;
  },
  gameLoop() {
    this.clearScreen();
    this.move(player);
    const rays = this.getRays();
    this.renderScene(rays);
    this.renderMinimap(0, 0, 0.25, rays);
  },
  forward(e) {
    const target = e.currentTarget;
    const f = () => {
      this.unlisten('touchend', f, { target });
      player.speed = 0;
    }
    this.listen('touchend', f, { target });
    player.speed = SPEED;
  },
  back(e) {
    const target = e.currentTarget;
    const f = () => {
      this.unlisten('touchend', f, { target });
      player.speed = 0;
    }
    this.listen('touchend', f, { target });
    player.speed = -SPEED;
  },
  left(e) {
    const target = e.currentTarget;
    const f = () => {
      this.unlisten('touchend', f, { target });
      player.strafe = 0;
    }
    this.listen('touchend', f, { target });
    player.strafe = -SPEED;
  },
  right(e) {
    const target = e.currentTarget;
    const f = () => {
      this.unlisten('touchend', f, { target });
      player.strafe = 0;
    }
    this.listen('touchend', f, { target });
    player.strafe = SPEED;
  },
  listenSwipe(){
    this.listen('touchstart', (evt)=>{
      let touch = evt.targetTouches[0];
      const move = (evt)=>{
        const c_touch = Array.prototype.find.call(evt.changedTouches, t => t.identifier === touch.identifier);
        if (c_touch){
          player.angle -= toRadians((touch.clientX - c_touch.clientX) / 5);
          touch = c_touch;
        }
      };
      const end = ()=>{
        this.unlisten('touchmove', move, { target: this.cnv });
        this.unlisten('touchend', end, { target: this.cnv });
      };
      this.listen('touchend', end, {target: this.cnv});
      this.listen('touchmove', move, {target: this.cnv});
    }, {target: this.cnv});
  }
});
function toRadians(deg) {
  return (deg * Math.PI) / 180;
}
function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
function fixFishEye(distance, angle, playerAngle) {
  const diff = angle - playerAngle;
  return distance * Math.cos(diff);
}
function checkCollisions(obj) {
  const res = [];
  for (let i = 0; i < 360; i += 90) {
    const ray = this.castRay(obj, toRadians(i));
    res.push(ray.wall && ray.distance < obj.width / 2);
  }
  return res;
}
async function loadTextures() {
  pathsToTextures.forEach(p => {
    const i = new Image();
    i.src = p;
    textures.push(i);
  });
}