// <<< p5.js WEBGL VERSION - Consistent HUD Usage Fix >>>

// Ensure p5.EasyCam is loaded. Use createEasyCam()

// --- Game Tuning Variables ---
// ... (Keep all tuning variables as they were) ...
const INITIAL_MAX_HEALTH = 100;
const HEALTH_REGEN_RATE = 0.04;
const REGEN_DELAY_AFTER_HIT = 120;
const POWERUP_SPAWN_CHANCE = 0.025;
const POWERUP_HEALTH_CHANCE = 0.3;
const POWERUP_SLOWMO_CHANCE = 0.15;
const POWERUP_MAX_HEALTH_CHANCE = 0.08;
const POWERUP_BOOST_FUEL_CHANCE = 0.15;
const POWERUP_MAX_WEAPON_ENERGY_CHANCE = 0.15;
const POWERUP_MISSILE_AMMO_CHANCE = 0.17;
const MAX_HEALTH_INCREASE_AMOUNT = 20;
const MAX_WEAPON_ENERGY_INCREASE_AMOUNT = 20;
const STAGE_SCORE_THRESHOLD = 500;
const STAGE_HEAL_AMOUNT = 20;
const INITIAL_MAX_BOOSTER_FUEL = 100;
const BOOSTER_COST_PER_FRAME = 1.0;
const BOOSTER_REGEN_RATE = 0.3;
const BOOSTER_REGEN_DELAY = 90;
const BOOSTER_SPEED_MULTIPLIER = 1.8;
const BOOST_PICKUP_AMOUNT = 40;
const INITIAL_MAX_WEAPON_ENERGY = 100;
const WEAPON_ENERGY_REGEN_RATE = 0.5;
const WEAPON_ENERGY_REGEN_DELAY = 60;
const LASER_CANNON_COST = 15;
const LASER_CANNON_DAMAGE = 25;
const LASER_CANNON_SPEED = 15;
const INITIAL_MISSILE_AMMO = 3;
const MAX_MISSILE_AMMO_CAP = 20;
const MISSILE_PICKUP_AMOUNT = 2;
const MISSILE_FIRE_COOLDOWN = 45;
const MISSILE_DAMAGE = 75;
const MISSILE_SPEED = 10.0;
const MISSILE_TURN_RATE = 0.06;
const MISSILE_MAX_STEER_FORCE = 0.4;
const ENEMY_SPAWN_CHANCE = 0.06;
const ENEMY_BASE_SPEED_Z = 2.5;
const LASER_ENEMY_HEALTH = 50;
const LASER_ENEMY_SHOOT_INTERVAL = 100;
const LASER_ENEMY_PROJECTILE_SPEED = 12;
const LASER_ENEMY_PROJECTILE_DAMAGE = 10;
const PULLER_ENEMY_HEALTH = 80;
const PULLER_ENEMY_FORCE_MULTIPLIER = 15;
const PULLER_ENEMY_MIN_DIST_SQ = 70 * 70;
const PLAYER_ENEMY_COLLISION_DAMAGE = 25;
const ENEMY_PLAYER_COLLISION_DAMAGE = 35;
const PLAYER_WALL_COLLISION_DAMAGE_RATE = 0.5;
const ENEMY_KILL_SCORE_LASER = 20;
const ENEMY_KILL_SCORE_PULLER = 30;
const UPGRADE_POINT_CONVERSION_RATE = 0.5;
const MAX_STREAK_TIME = 120;
const STREAK_MULTIPLIER_INCREMENT = 0.5;
const MAX_STREAK_MULTIPLIER = 5.0;
const STREAK_NOTIFICATION_DURATION = 90;
const STREAK_PULSE_SPEED_FACTOR = 0.1;
const STREAK_PULSE_AMP_FACTOR = 10;
const SPEED_INCREASE_RATE = 0.0005;

// --- 3D Specific ---
const PLAYER_Z_OFFSET = -150;
const CAMERA_Y_OFFSET = 30;
const CAMERA_Z_OFFSET = 100; // Reference only
const EASYCAM_DEFAULT_DISTANCE = 250;
const EASYCAM_FOLLOW_LERP_RATE = 0.08;
const TUNNEL_RADIUS = 250;
const TUNNEL_SEGMENT_LENGTH = 100;
const TUNNEL_DETAIL = 24;
const TUNNEL_VISIBLE_LENGTH = 3000;
const TUNNEL_CENTER_DRIFT_SCALE = 150;
const TUNNEL_NOISE_SCALE_POS = 0.001;
const BASE_WORLD_SPEED_Z = 3.0;

// --- Global Variables ---
let player;
let tunnel = [];
let powerUps = [];
let enemies = [];
let playerProjectiles = [];
let enemyProjectiles = [];
let noiseOffset = 0;
let noiseSpeed = 0.008;
let currentWorldSpeedZ;
let score = 0;
let lastScore = 0;
let nextStageScore;
let gameState = "START";
let slowMoActive = false;
let slowMoDuration = 300;
let slowMoTimer = 0;
let healthPickupFlashTimer = 0;
const HEALTH_PICKUP_FLASH_DURATION = 30;
let boostPickupFlashTimer = 0;
const BOOST_PICKUP_FLASH_DURATION = 30;
let maxWeaponEnergyPickupFlashTimer = 0;
const MAX_WEAPON_ENERGY_PICKUP_FLASH_DURATION = 30;
let missileAmmoPickupFlashTimer = 0;
const MISSILE_AMMO_PICKUP_FLASH_DURATION = 30;
let streakCount = 0;
let streakMultiplier = 1.0;
let streakTimer = 0;
let streakNotificationTimer = 0;
let streakNotificationText = "";
let upgradePoints = 0;
let upgrades = {
  maxHealth: {
    name: "Max Health",
    level: 0,
    cost: 130,
    baseCost: 130,
    scale: 1.6,
    effectPerLevel: 10,
  },
  maxEnergy: {
    name: "Max Energy",
    level: 0,
    cost: 100,
    baseCost: 100,
    scale: 1.5,
    effectPerLevel: 10,
  },
  maxAmmo: {
    name: "Max Missiles",
    level: 0,
    cost: 150,
    baseCost: 150,
    scale: 1.6,
    effectPerLevel: 1,
  },
  laserDamage: {
    name: "Laser Damage",
    level: 0,
    cost: 200,
    baseCost: 200,
    scale: 1.7,
    effectPerLevel: 5,
  },
  missileDamage: {
    name: "Missile Damage",
    level: 0,
    cost: 300,
    baseCost: 300,
    scale: 1.8,
    effectPerLevel: 15,
  },
  maxBooster: {
    name: "Max Boost Fuel",
    level: 0,
    cost: 120,
    baseCost: 120,
    scale: 1.5,
    effectPerLevel: 8,
  },
  laserSpread: {
    name: "Laser Spread",
    level: 0,
    cost: 500,
    baseCost: 500,
    scale: 2.0,
    effectPerLevel: 1,
    maxLevel: 4,
  },
  healthRegen: {
    name: "Health Regen",
    level: 0,
    cost: 250,
    baseCost: 250,
    scale: 1.6,
    effectPerLevel: 0.01,
    units: "/frame",
  },
  energyRegen: {
    name: "Energy Regen",
    level: 0,
    cost: 180,
    baseCost: 180,
    scale: 1.6,
    effectPerLevel: 0.1,
    units: "/frame",
  },
};
const upgradeKeys = Object.keys(upgrades);
let uiBuffer;
let easycam;
let easycamTarget;
let currentFont;

// --- Font Preload ---
function preload() {
  currentFont = loadFont(
    "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
    () => {
      console.log("Font loaded successfully");
    },
    (err) => {
      console.error("Font loading failed:", err);
    }
  );
}

// --- Player Class (No changes needed) ---
class Player {
  constructor() {
    this.basePos = createVector(0, 0, PLAYER_Z_OFFSET);
    this.pos = this.basePos.copy();
    this.size = createVector(20, 15, 25);
    this.baseMoveSpeed = 6.5;
    this.velocity = createVector(0, 0, 0);
    this.externalForce = createVector(0, 0, 0);
    this.resetStatsBasedOnUpgrades();
    this.health = this.maxHealth;
    this.boosterFuel = this.maxBoosterFuel;
    this.weaponEnergy = this.maxWeaponEnergy;
    this.missileAmmo = this.maxMissileAmmo;
    this.regenDelayTimer = 0;
    this.boosterRegenDelayTimer = 0;
    this.weaponEnergyRegenDelayTimer = 0;
    this.missileFireTimer = 0;
    this.damageFlashTimer = 0;
    this.damageFlashDuration = 15;
    this.isBoosting = false;
    this.baseColor = color(0, 0, 100);
    this.damageColor = color(0, 90, 100);
    this.boostColor = color(200, 80, 100);
    this.wallCollisionTimer = 0;
  }
  resetStatsBasedOnUpgrades() {
    this.maxHealth =
      INITIAL_MAX_HEALTH +
      upgrades.maxHealth.level * upgrades.maxHealth.effectPerLevel;
    this.maxWeaponEnergy =
      INITIAL_MAX_WEAPON_ENERGY +
      upgrades.maxEnergy.level * upgrades.maxEnergy.effectPerLevel;
    this.maxMissileAmmo = min(
      MAX_MISSILE_AMMO_CAP,
      INITIAL_MISSILE_AMMO +
        upgrades.maxAmmo.level * upgrades.maxAmmo.effectPerLevel
    );
    this.weaponDamage =
      LASER_CANNON_DAMAGE +
      upgrades.laserDamage.level * upgrades.laserDamage.effectPerLevel;
    this.missileDamage =
      MISSILE_DAMAGE +
      upgrades.missileDamage.level * upgrades.missileDamage.effectPerLevel;
    this.maxBoosterFuel =
      INITIAL_MAX_BOOSTER_FUEL +
      upgrades.maxBooster.level * upgrades.maxBooster.effectPerLevel;
    this.laserSpreadLevel = upgrades.laserSpread.level;
    this.healthRegenRate =
      HEALTH_REGEN_RATE +
      upgrades.healthRegen.level * upgrades.healthRegen.effectPerLevel;
    this.weaponEnergyRegenRate =
      WEAPON_ENERGY_REGEN_RATE +
      upgrades.energyRegen.level * upgrades.energyRegen.effectPerLevel;
    this.weaponCost = LASER_CANNON_COST;
    this.boosterCost = BOOSTER_COST_PER_FRAME;
    this.boosterMultiplier = BOOSTER_SPEED_MULTIPLIER;
    this.weaponProjectileSpeed = LASER_CANNON_SPEED;
    this.missileFireCooldown = MISSILE_FIRE_COOLDOWN;
    this.regenDelayDuration = REGEN_DELAY_AFTER_HIT;
    this.boosterRegenDelayDuration = BOOSTER_REGEN_DELAY;
    this.weaponEnergyRegenDelayDuration = WEAPON_ENERGY_REGEN_DELAY;
    this.size = createVector(
      20 + this.laserSpreadLevel * 3,
      15,
      25 + this.laserSpreadLevel * 2
    );
    if (this.health !== undefined)
      this.health = min(this.health, this.maxHealth);
    if (this.weaponEnergy !== undefined)
      this.weaponEnergy = min(this.weaponEnergy, this.maxWeaponEnergy);
    if (this.boosterFuel !== undefined)
      this.boosterFuel = min(this.boosterFuel, this.maxBoosterFuel);
    if (this.missileAmmo !== undefined)
      this.missileAmmo = min(this.missileAmmo, this.maxMissileAmmo);
  }
  update() {
    this.isBoosting = false;
    this.externalForce.set(0, 0, 0);
    if (enemies) {
      for (let enemy of enemies) {
        if (enemy && enemy.type === "PULLER" && enemy.calculatePull) {
          this.externalForce.add(enemy.calculatePull(this.pos));
        }
      }
    }
    let moveLeft = keyIsDown(LEFT_ARROW) || keyIsDown(65);
    let moveRight = keyIsDown(RIGHT_ARROW) || keyIsDown(68);
    let boostKey = keyIsDown(SHIFT);
    if (boostKey && this.boosterFuel > 0) {
      this.isBoosting = true;
      this.boosterFuel = max(0, this.boosterFuel - this.boosterCost);
      this.boosterRegenDelayTimer = this.boosterRegenDelayDuration;
    }
    if (!this.isBoosting) {
      if (this.boosterRegenDelayTimer > 0) this.boosterRegenDelayTimer--;
      else if (this.boosterFuel < this.maxBoosterFuel)
        this.boosterFuel = min(
          this.maxBoosterFuel,
          this.boosterFuel + BOOSTER_REGEN_RATE
        );
    }
    let currentFrameMoveSpeed = this.baseMoveSpeed * (slowMoActive ? 0.5 : 1);
    let moveIntent = createVector(0, 0, 0);
    if (moveLeft) moveIntent.x -= currentFrameMoveSpeed;
    if (moveRight) moveIntent.x += currentFrameMoveSpeed;
    this.velocity.set(moveIntent);
    this.velocity.add(this.externalForce);
    this.pos.add(this.velocity);
    if (this.regenDelayTimer > 0) this.regenDelayTimer--;
    else if (this.health < this.maxHealth && gameState === "PLAYING")
      this.health = min(this.health + this.healthRegenRate, this.maxHealth);
    if (this.weaponEnergyRegenDelayTimer > 0)
      this.weaponEnergyRegenDelayTimer--;
    else if (this.weaponEnergy < this.maxWeaponEnergy)
      this.weaponEnergy = min(
        this.weaponEnergy + this.weaponEnergyRegenRate,
        this.maxWeaponEnergy
      );
    if (this.missileFireTimer > 0) this.missileFireTimer--;
    if (this.damageFlashTimer > 0) this.damageFlashTimer--;
    if (healthPickupFlashTimer > 0) healthPickupFlashTimer--;
    if (boostPickupFlashTimer > 0) boostPickupFlashTimer--;
    if (maxWeaponEnergyPickupFlashTimer > 0) maxWeaponEnergyPickupFlashTimer--;
    if (missileAmmoPickupFlashTimer > 0) missileAmmoPickupFlashTimer--;
    this.checkWallCollision();
    if (this.wallCollisionTimer > 0) {
      this.takeDamage(PLAYER_WALL_COLLISION_DAMAGE_RATE, "WALL");
      this.wallCollisionTimer--;
    }
    if (this.health <= 0 && gameState === "PLAYING") {
      this.die();
    }
  }
  checkWallCollision() {
    let closestZ = Infinity;
    let collidingSegmentCenter = null;
    for (let seg of tunnel) {
      if (abs(seg.z - this.pos.z) < closestZ) {
        closestZ = abs(seg.z - this.pos.z);
        collidingSegmentCenter = seg.center;
      }
    }
    if (collidingSegmentCenter) {
      let distSqFromCenter =
        pow(this.pos.x - collidingSegmentCenter.x, 2) +
        pow(this.pos.y - collidingSegmentCenter.y, 2);
      if (distSqFromCenter > pow(TUNNEL_RADIUS - this.size.x * 0.5, 2)) {
        this.wallCollisionTimer = 2;
        this.damageFlashTimer = this.damageFlashDuration;
        let angle = atan2(
          this.pos.y - collidingSegmentCenter.y,
          this.pos.x - collidingSegmentCenter.x
        );
        let constrainedRadius = TUNNEL_RADIUS - this.size.x * 0.5;
        this.pos.x = collidingSegmentCenter.x + cos(angle) * constrainedRadius;
        this.pos.y = collidingSegmentCenter.y + sin(angle) * constrainedRadius;
      }
    }
  }
  draw(drawPosX = this.pos.x, drawPosY = this.pos.y, drawPosZ = this.pos.z) {
    let currentColor = this.baseColor;
    if (this.damageFlashTimer > 0 && gameState === "PLAYING")
      currentColor = lerpColor(
        this.baseColor,
        this.damageColor,
        this.damageFlashTimer / this.damageFlashDuration
      );
    else if (this.isBoosting && gameState === "PLAYING")
      currentColor = lerpColor(
        this.baseColor,
        this.boostColor,
        0.7 + sin(frameCount * 0.5) * 0.3
      );
    push();
    translate(drawPosX, drawPosY, drawPosZ);
    specularMaterial(currentColor);
    shininess(15);
    noStroke();
    let w = this.size.x / 2;
    let h = this.size.y / 2;
    let d = this.size.z / 2;
    box(this.size.x, this.size.y, this.size.z);
    let wingColor = lerpColor(currentColor, color(0, 0, 80), 0.3);
    let cannonColor = lerpColor(currentColor, color(0, 0, 60), 0.5);
    let glowColor = lerpColor(currentColor, color(60, 80, 100), 0.4);
    let wingWidth = this.size.x * 0.3;
    let wingHeight = this.size.y * 0.8;
    let wingDepth = this.size.z * 0.5;
    push();
    noStroke();
    if (this.laserSpreadLevel > 0) {
      specularMaterial(wingColor);
      push();
      translate(-w - wingWidth / 2, 0, 0);
      box(wingWidth, wingHeight, wingDepth);
      pop();
      push();
      translate(w + wingWidth / 2, 0, 0);
      box(wingWidth, wingHeight, wingDepth);
      pop();
    }
    if (this.laserSpreadLevel > 1) {
      specularMaterial(wingColor);
      push();
      translate(-w * 1.8, 0, -d * 0.2);
      rotateZ(PI / 6);
      box(w * 0.4, h * 1.8, d * 0.8);
      pop();
      push();
      translate(w * 1.8, 0, -d * 0.2);
      rotateZ(-PI / 6);
      box(w * 0.4, h * 1.8, d * 0.8);
      pop();
    }
    if (this.laserSpreadLevel > 2) {
      specularMaterial(cannonColor);
      push();
      translate(-w * 2.2, h * 0.6, d * 0.5);
      rotateX(PI / 2);
      cylinder(w * 0.2, d * 0.6);
      pop();
      push();
      translate(w * 2.2, h * 0.6, d * 0.5);
      rotateX(PI / 2);
      cylinder(w * 0.2, d * 0.6);
      pop();
    }
    if (this.laserSpreadLevel > 3) {
      emissiveMaterial(glowColor);
      push();
      translate(0, -h * 1.2, 0);
      sphere(w * 0.15);
      pop();
      push();
      translate(-w * 1.8, -h * 0.5, -d * 0.2);
      sphere(w * 0.1);
      pop();
      push();
      translate(w * 1.8, -h * 0.5, -d * 0.2);
      sphere(w * 0.1);
      pop();
    }
    if (this.isBoosting && gameState === "PLAYING") {
      emissiveMaterial(
        this.boostColor.levels[0],
        this.boostColor.levels[1],
        this.boostColor.levels[2],
        150 + random(-30, 30)
      );
      push();
      translate(0, 0, -d * 1.5);
      rotateX(PI / 2);
      cone(w * 0.8, d * 3 + random(-d, d), 16, 1, false);
      pop();
    }
    pop();
    pop();
  }
  fireLaser() {
    if (this.weaponEnergy >= this.weaponCost) {
      this.weaponEnergy -= this.weaponCost;
      this.weaponEnergyRegenDelayTimer = this.weaponEnergyRegenDelayDuration;
      let numLasers = 1 + this.laserSpreadLevel * 2;
      let spreadAngleXY = PI / 24;
      if (playerProjectiles) {
        for (let i = 0; i < numLasers; i++) {
          let angle =
            numLasers === 1
              ? 0
              : map(
                  i,
                  0,
                  numLasers - 1,
                  (-spreadAngleXY * (numLasers - 1)) / 2,
                  (spreadAngleXY * (numLasers - 1)) / 2
                );
          let vx = sin(angle) * this.weaponProjectileSpeed * 0.5;
          let vy = 0;
          let vz = cos(angle) * this.weaponProjectileSpeed;
          let spawnPos = this.pos
            .copy()
            .add(vx * 2, vy * 2, this.size.z / 2 + 5);
          playerProjectiles.push(
            new Projectile(
              spawnPos,
              createVector(vx, vy, vz),
              "PLAYER_LASER",
              this.weaponDamage
            )
          );
        }
      }
    }
  }
  fireMissile() {
    if (this.missileAmmo > 0 && this.missileFireTimer <= 0) {
      this.missileAmmo--;
      this.missileFireTimer = this.missileFireCooldown;
      if (playerProjectiles) {
        let spawnPos = this.pos
          .copy()
          .add(0, -this.size.y * 0.3, this.size.z / 2 + 10);
        let initialVel = createVector(0, 0, MISSILE_SPEED);
        playerProjectiles.push(
          new Projectile(
            spawnPos,
            initialVel,
            "PLAYER_MISSILE",
            this.missileDamage
          )
        );
      }
    }
  }
  takeDamage(amount, source) {
    if (this.health <= 0) return;
    this.health -= amount;
    this.damageFlashTimer = this.damageFlashDuration;
    this.regenDelayTimer = this.regenDelayDuration;
    if (this.health <= 0) {
      this.health = 0;
      this.die();
    }
  }
  die() {
    if (gameState !== "GAME_OVER") {
      lastScore = score;
      gameState = "GAME_OVER";
    }
  }
  checkCollision(other) {
    if (!other || !other.pos || !other.size) return false;
    let dSq =
      (this.pos.x - other.pos.x) ** 2 +
      (this.pos.y - other.pos.y) ** 2 +
      (this.pos.z - other.pos.z) ** 2;
    let collisionThresholdSq = pow(this.size.x * 0.5 + other.size.x * 0.5, 2);
    return dSq < collisionThresholdSq;
  }
  heal(amount) {
    if (!isNaN(amount) && amount > 0) {
      this.health = min(this.health + amount, this.maxHealth);
      healthPickupFlashTimer = HEALTH_PICKUP_FLASH_DURATION;
    }
  }
  restoreBoost(amount) {
    if (!isNaN(amount) && amount > 0) {
      this.boosterFuel = min(this.boosterFuel + amount, this.maxBoosterFuel);
      boostPickupFlashTimer = BOOST_PICKUP_FLASH_DURATION;
    }
  }
  increaseCurrentWeaponEnergy(amount) {
    if (!isNaN(amount) && amount > 0) {
      this.weaponEnergy = min(this.weaponEnergy + amount, this.maxWeaponEnergy);
      maxWeaponEnergyPickupFlashTimer = MAX_WEAPON_ENERGY_PICKUP_FLASH_DURATION;
    }
  }
  addMissileAmmo(amount) {
    if (!isNaN(amount) && amount > 0) {
      this.missileAmmo = min(this.missileAmmo + amount, this.maxMissileAmmo);
      missileAmmoPickupFlashTimer = MISSILE_AMMO_PICKUP_FLASH_DURATION;
    }
  }
  increaseMaxHealth(amount) {
    if (!isNaN(amount) && amount > 0) {
      this.maxHealth += amount;
      this.heal(this.maxHealth);
      healthPickupFlashTimer = HEALTH_PICKUP_FLASH_DURATION;
    }
  }
  activatePowerUp(type) {
    if (type === "HEALTH_PACK") this.heal(INITIAL_MAX_HEALTH * 0.4);
    else if (type === "SLOW_MO") {
      slowMoActive = true;
      slowMoTimer = slowMoDuration;
    } else if (type === "MAX_HEALTH_UP")
      this.increaseMaxHealth(MAX_HEALTH_INCREASE_AMOUNT);
    else if (type === "BOOST_FUEL") this.restoreBoost(BOOST_PICKUP_AMOUNT);
    else if (type === "MAX_WEAPON_ENERGY")
      this.increaseCurrentWeaponEnergy(MAX_WEAPON_ENERGY_INCREASE_AMOUNT);
    else if (type === "MISSILE_AMMO")
      this.addMissileAmmo(MISSILE_PICKUP_AMOUNT);
  }
  reset() {
    this.resetStatsBasedOnUpgrades();
    this.pos = this.basePos.copy();
    this.velocity.set(0, 0, 0);
    this.externalForce.set(0, 0, 0);
    this.health = this.maxHealth;
    this.boosterFuel = this.maxBoosterFuel;
    this.weaponEnergy = this.maxWeaponEnergy;
    this.missileAmmo = this.maxMissileAmmo;
    this.regenDelayTimer = 0;
    this.boosterRegenDelayTimer = 0;
    this.weaponEnergyRegenDelayTimer = 0;
    this.missileFireTimer = 0;
    this.damageFlashTimer = 0;
    this.isBoosting = false;
    this.wallCollisionTimer = 0;
    slowMoActive = false;
    slowMoTimer = 0;
    healthPickupFlashTimer = 0;
    boostPickupFlashTimer = 0;
    maxWeaponEnergyPickupFlashTimer = 0;
    missileAmmoPickupFlashTimer = 0;
    if (easycamTarget)
      easycamTarget.set(
        this.pos.x,
        this.pos.y - CAMERA_Y_OFFSET * 0.5,
        this.pos.z
      );
  }
}

// --- Projectile Class (No changes needed) ---
class Projectile {
  constructor(posVec, velVec, type, damage) {
    this.pos = posVec.copy();
    this.vel = velVec.copy();
    this.type = type;
    this.damage = damage;
    this.size =
      type === "PLAYER_LASER" || type === "ENEMY_LASER"
        ? createVector(3, 3, 15)
        : createVector(8, 8, 12);
    this.color =
      type === "PLAYER_LASER"
        ? color(150, 80, 100)
        : type === "ENEMY_LASER"
        ? color(30, 90, 100)
        : color(0, 0, 100);
    this.color.levels[3] = 200;
    if (type === "PLAYER_MISSILE") {
      this.trail = [];
      this.trailLength = 15;
      this.targetEnemy = null;
      this.maxSpeed = MISSILE_SPEED;
      this.maxForce = MISSILE_MAX_STEER_FORCE;
      this.vel.limit(this.maxSpeed);
    }
  }
  findTarget() {
    let closestDistSq = Infinity;
    let closestEnemy = null;
    if (enemies) {
      for (let enemy of enemies) {
        if (enemy && enemy.isAlive() && enemy.pos) {
          let dSq = p5.Vector.dist(this.pos, enemy.pos);
          dSq *= dSq;
          if (dSq < closestDistSq) {
            closestDistSq = dSq;
            closestEnemy = enemy;
          }
        }
      }
    }
    this.targetEnemy = closestEnemy;
  }
  seek(targetPos) {
    if (!targetPos) return createVector(0, 0);
    let desired = p5.Vector.sub(targetPos, this.pos);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }
  applyForce(force) {
    if (force) this.vel.add(force);
  }
  update() {
    if (this.type === "PLAYER_MISSILE") {
      this.trail.push(this.pos.copy());
      if (this.trail.length > this.trailLength) this.trail.splice(0, 1);
      if (
        !this.targetEnemy ||
        !this.targetEnemy.isAlive() ||
        frameCount % 10 === 0
      )
        this.findTarget();
      if (this.targetEnemy && this.targetEnemy.pos) {
        this.applyForce(this.seek(this.targetEnemy.pos));
      }
      this.vel.limit(this.maxSpeed);
    }
    this.pos.add(this.vel);
  }
  draw() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    if (this.type === "PLAYER_MISSILE") {
      push();
      strokeWeight(2);
      stroke(25, 90, 90, 150);
      noFill();
      beginShape();
      for (let v of this.trail)
        vertex(v.x - this.pos.x, v.y - this.pos.y, v.z - this.pos.z);
      endShape();
      pop();
      let rotAxis = createVector(0, 1, 0).cross(this.vel);
      let rotAngle = createVector(0, 0, 1).angleBetween(
        this.vel.copy().normalize()
      );
      if (rotAxis.magSq() > 0.0001) {
        rotate(rotAngle, rotAxis);
      } else if (this.vel.z < 0) {
        rotate(PI, 0, 1, 0);
      }
      specularMaterial(this.color);
      shininess(10);
      stroke(60, 80, 100);
      strokeWeight(0.5);
      box(this.size.x, this.size.y, this.size.z);
      noStroke();
      emissiveMaterial(30, 90, 100, 180 + random(-20, 20));
      push();
      translate(0, 0, -this.size.z * 0.7);
      cone(this.size.x * 0.6, this.size.z * 1.5 + random(-5, 5), 8, 1, false);
      pop();
    } else {
      let rotAxis = createVector(0, 0, 1).cross(this.vel.copy().normalize());
      let rotAngle = acos(
        constrain(createVector(0, 0, 1).dot(this.vel.copy().normalize()), -1, 1)
      );
      if (rotAxis.magSq() > 0.0001) rotate(rotAngle, rotAxis);
      emissiveMaterial(this.color);
      cylinder(this.size.x * 0.5, this.size.z);
    }
    pop();
  }
  isOffScreen() {
    return (
      this.pos.z > TUNNEL_VISIBLE_LENGTH * 1.1 ||
      this.pos.z < PLAYER_Z_OFFSET - 200
    );
  }
  checkCollision(target) {
    if (!target || !target.pos || !target.size) return false;
    let dSq =
      (this.pos.x - target.pos.x) ** 2 +
      (this.pos.y - target.pos.y) ** 2 +
      (this.pos.z - target.pos.z) ** 2;
    let collisionThresholdSq = pow(this.size.z * 0.5 + target.size.z * 0.5, 2);
    return dSq < collisionThresholdSq;
  }
}

// --- Enemy Class (No changes needed) ---
class Enemy {
  constructor(x, y, z, type) {
    this.pos = createVector(x, y, z);
    this.type = type;
    this.speedZ = ENEMY_BASE_SPEED_Z * random(0.9, 1.1);
    this.size =
      type === "LASER" ? createVector(25, 25, 35) : createVector(35, 35, 35);
    this.hitTimer = 0;
    this.hitDuration = 10;
    this.vel = createVector(0, 0, 0);
    if (type === "LASER") {
      this.health = LASER_ENEMY_HEALTH;
      this.maxHealth = LASER_ENEMY_HEALTH;
      this.baseColor = color(0, 70, 70);
      this.shootCooldown = LASER_ENEMY_SHOOT_INTERVAL;
      this.shootTimer = random(this.shootCooldown);
    } else if (type === "PULLER") {
      this.health = PULLER_ENEMY_HEALTH;
      this.maxHealth = PULLER_ENEMY_HEALTH;
      this.baseColor = color(270, 70, 60);
      this.pullForce = PULLER_ENEMY_FORCE_MULTIPLIER;
      this.pulseTimer = random(TWO_PI);
    } else {
      this.health = 1;
      this.maxHealth = 1;
      this.baseColor = color(0, 0, 50);
    }
  }
  update(playerPos) {
    let speedFactor = slowMoActive ? 0.5 : 1;
    this.pos.z -= this.speedZ * speedFactor;
    if (this.type === "LASER") {
      this.shootTimer -= speedFactor;
      if (this.shootTimer <= 0) {
        this.shoot(playerPos);
        this.shootTimer = this.shootCooldown;
      }
      this.pos.x +=
        sin(frameCount * 0.05 + this.pos.z * 0.01) * 0.5 * speedFactor;
    } else if (this.type === "PULLER") {
      this.pulseTimer += 0.05 * speedFactor;
    }
    if (this.hitTimer > 0) this.hitTimer--;
  }
  shoot(playerPos) {
    if (enemyProjectiles && playerPos) {
      let aimDir = p5.Vector.sub(playerPos, this.pos).normalize();
      let projVel = aimDir.mult(LASER_ENEMY_PROJECTILE_SPEED);
      let spawnPos = this.pos.copy().add(aimDir.mult(this.size.z / 2 + 5));
      enemyProjectiles.push(
        new Projectile(
          spawnPos,
          projVel,
          "ENEMY_LASER",
          LASER_ENEMY_PROJECTILE_DAMAGE
        )
      );
    }
  }
  calculatePull(playerPosVec) {
    if (!playerPosVec) return createVector(0, 0);
    let dir = p5.Vector.sub(this.pos, playerPosVec);
    let dSq = dir.magSq();
    if (dSq < PULLER_ENEMY_MIN_DIST_SQ) dSq = PULLER_ENEMY_MIN_DIST_SQ;
    let forceMag = this.pullForce / dSq;
    dir.normalize();
    dir.mult(forceMag * (slowMoActive ? 0.3 : 1));
    return dir;
  }
  takeDamage(amount) {
    if (!this.isAlive()) return;
    this.health -= amount;
    this.hitTimer = this.hitDuration;
    if (this.health <= 0) {
      this.health = 0;
    }
  }
  isAlive() {
    return this.health > 0;
  }
  draw() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    let displayColor = this.baseColor;
    if (this.hitTimer > 0)
      displayColor = lerpColor(
        this.baseColor,
        color(0, 0, 100),
        this.hitTimer / this.hitDuration
      );
    noStroke();
    specularMaterial(displayColor);
    shininess(10);
    if (this.type === "LASER") {
      push();
      rotateX(PI);
      cone(this.size.x * 0.5, this.size.z, 16, 1, false);
      pop();
      push();
      translate(-this.size.x * 0.3, 0, 0);
      box(this.size.x * 0.2, this.size.y * 0.8, this.size.z * 0.3);
      pop();
      push();
      translate(this.size.x * 0.3, 0, 0);
      box(this.size.x * 0.2, this.size.y * 0.8, this.size.z * 0.3);
      pop();
    } else if (this.type === "PULLER") {
      let pulseScale = 1 + sin(this.pulseTimer) * 0.15;
      sphere(this.size.x * 0.5 * pulseScale);
      push();
      specularMaterial(0, 0, 10);
      sphere(this.size.x * 0.2 * pulseScale);
      pop();
    }
    pop();
  }
}

// --- PowerUp Class (No changes needed) ---
class PowerUp {
  constructor(x, y, z, type) {
    this.pos = createVector(x, y, z);
    this.type = type;
    this.size = createVector(15, 15, 15);
    this.rotation = createVector(
      random(TWO_PI),
      random(TWO_PI),
      random(TWO_PI)
    );
    this.rotSpeed = createVector(
      random(0.01, 0.03),
      random(0.01, 0.03),
      random(0.01, 0.03)
    );
    switch (type) {
      case "HEALTH_PACK":
        this.color = color(120, 80, 90);
        this.shape = "box";
        break;
      case "SLOW_MO":
        this.color = color(270, 80, 90);
        this.shape = "sphere";
        break;
      case "MAX_HEALTH_UP":
        this.color = color(120, 75, 85);
        this.borderColor = color(50, 90, 100);
        this.shape = "box_special";
        break;
      case "BOOST_FUEL":
        this.color = color(200, 80, 100);
        this.shape = "cone";
        break;
      case "MAX_WEAPON_ENERGY":
        this.color = color(180, 90, 90);
        this.shape = "torus";
        break;
      case "MISSILE_AMMO":
        this.color = color(0, 0, 85);
        this.shape = "cylinder";
        break;
      default:
        this.color = color(0, 0, 50);
        this.shape = "sphere";
    }
  }
  update(worldSpeed) {
    this.pos.z -= worldSpeed;
    let speedFactor = slowMoActive ? 0.5 : 1;
    this.rotation.add(p5.Vector.mult(this.rotSpeed, speedFactor));
  }
  draw() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    rotateX(this.rotation.x);
    rotateY(this.rotation.y);
    rotateZ(this.rotation.z);
    noStroke();
    specularMaterial(this.color);
    shininess(20);
    let s = this.size.x;
    if (this.shape === "box") box(s);
    else if (this.shape === "sphere") sphere(s * 0.7);
    else if (this.shape === "cone") cone(s * 0.6, s * 1.2);
    else if (this.shape === "torus") torus(s * 0.5, s * 0.2);
    else if (this.shape === "cylinder") cylinder(s * 0.5, s * 1.1);
    else if (this.shape === "box_special") {
      box(s);
      noFill();
      stroke(this.borderColor);
      strokeWeight(1);
      box(s * 1.1);
    } else sphere(s * 0.7);
    pop();
  }
  checkCollision(target) {
    if (!target || !target.pos || !target.size) return false;
    let dSq =
      (this.pos.x - target.pos.x) ** 2 +
      (this.pos.y - target.pos.y) ** 2 +
      (this.pos.z - target.pos.z) ** 2;
    let collisionThresholdSq = pow(this.size.x * 0.7 + target.size.x * 0.5, 2);
    return dSq < collisionThresholdSq;
  }
}

// --- Setup ---
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes("antialias", true);
  smooth();
  colorMode(HSB, 360, 100, 100, 100);

  if (currentFont) {
    textFont(currentFont);
  } else {
    textFont("monospace");
  }
  textAlign(CENTER, CENTER);

  player = new Player();
  noiseDetail(8, 0.5);

  easycam = createEasyCam();
  easycam.setDistanceMin(50);
  easycam.setDistanceMax(TUNNEL_VISIBLE_LENGTH * 0.8);
  easycam.setZoomScale(0.02);
  easycamTarget = createVector(0, 0, 0);

  uiBuffer = createGraphics(windowWidth, windowHeight);
  uiBuffer.colorMode(HSB, 360, 100, 100, 100);
  if (currentFont) {
    uiBuffer.textFont(currentFont);
  } else {
    uiBuffer.textFont("monospace");
  }
  uiBuffer.textAlign(CENTER, CENTER);

  resetGame();
  window._setupCalled = true;
}

// --- Reset Game State ---
function resetGame() {
  score = 0;
  currentWorldSpeedZ = BASE_WORLD_SPEED_Z;
  nextStageScore = STAGE_SCORE_THRESHOLD;
  noiseOffset = random(1000);
  if (player && typeof player.reset === "function") player.reset();
  else player = new Player();
  initTunnel();
  enemies = [];
  playerProjectiles = [];
  enemyProjectiles = [];
  powerUps = [];
  resetStreak();

  if (easycam && player && easycamTarget) {
    easycamTarget.set(
      player.pos.x,
      player.pos.y - CAMERA_Y_OFFSET * 0.5,
      player.pos.z
    );
    let initialState = {
      distance: EASYCAM_DEFAULT_DISTANCE,
      center: easycamTarget.array(),
      rotation: [0, 1, 0, 0],
    };
    easycam.setState(initialState, 0);
    easycam.state_reset = initialState;
  }
  gameState = "START";
}

// --- Initialize Tunnel (3D) ---
function initTunnel() {
  tunnel = [];
  let startZ = player ? player.pos.z : PLAYER_Z_OFFSET;
  let effectiveStartZ = startZ - CAMERA_Z_OFFSET - TUNNEL_SEGMENT_LENGTH * 3; // Start further behind to ensure visibility
  for (
    let z = effectiveStartZ;
    z < startZ + TUNNEL_VISIBLE_LENGTH;
    z += TUNNEL_SEGMENT_LENGTH
  ) {
    addTunnelSegment(z, true);
  }
}

// --- Add Tunnel Segment (3D) ---
function addTunnelSegment(zPos, preventSpawns = false) {
  let noiseX = noise(noiseOffset + zPos * TUNNEL_NOISE_SCALE_POS);
  let noiseY = noise(noiseOffset + zPos * TUNNEL_NOISE_SCALE_POS + 1000);
  let centerX = map(
    noiseX,
    0,
    1,
    -TUNNEL_CENTER_DRIFT_SCALE,
    TUNNEL_CENTER_DRIFT_SCALE
  );
  let centerY = map(
    noiseY,
    0,
    1,
    -TUNNEL_CENTER_DRIFT_SCALE,
    TUNNEL_CENTER_DRIFT_SCALE
  );
  let center = createVector(centerX, centerY, 0);
  tunnel.push({ center: center, z: zPos });
  if (!preventSpawns && gameState === "PLAYING") {
    if (random() < POWERUP_SPAWN_CHANCE) {
      let angle = random(TWO_PI);
      let radius = random(TUNNEL_RADIUS * 0.1, TUNNEL_RADIUS * 0.8);
      let puX = centerX + cos(angle) * radius;
      let puY = centerY + sin(angle) * radius;
      let puZ = zPos + TUNNEL_SEGMENT_LENGTH / 2;
      let randType = random();
      let puType;
      let cumulativeChance = 0;
      cumulativeChance += POWERUP_HEALTH_CHANCE;
      if (randType < cumulativeChance) puType = "HEALTH_PACK";
      else {
        cumulativeChance += POWERUP_SLOWMO_CHANCE;
        if (randType < cumulativeChance) puType = "SLOW_MO";
        else {
          cumulativeChance += POWERUP_MAX_HEALTH_CHANCE;
          if (randType < cumulativeChance) puType = "MAX_HEALTH_UP";
          else {
            cumulativeChance += POWERUP_BOOST_FUEL_CHANCE;
            if (randType < cumulativeChance) puType = "BOOST_FUEL";
            else {
              cumulativeChance += POWERUP_MAX_WEAPON_ENERGY_CHANCE;
              if (randType < cumulativeChance) puType = "MAX_WEAPON_ENERGY";
              else puType = "MISSILE_AMMO";
            }
          }
        }
      }
      if (powerUps) powerUps.push(new PowerUp(puX, puY, puZ, puType));
    }
    if (random() < ENEMY_SPAWN_CHANCE) {
      let angle = random(TWO_PI);
      let radius = random(TUNNEL_RADIUS * 0.2, TUNNEL_RADIUS * 0.7);
      let enemyX = centerX + cos(angle) * radius;
      let enemyY = centerY + sin(angle) * radius;
      let enemyZ =
        zPos + random(TUNNEL_SEGMENT_LENGTH * 0.2, TUNNEL_SEGMENT_LENGTH * 0.8);
      let enemyType = random() > 0.5 ? "LASER" : "PULLER";
      if (enemies) enemies.push(new Enemy(enemyX, enemyY, enemyZ, enemyType));
    }
  }
}

// --- Draw Tunnel (3D) ---
function drawTunnel() {
  push();
  noFill();
  strokeWeight(streakMultiplier > 1 ? 1.5 : 1);
  let currentMultiplier = max(1, streakMultiplier);
  let hueSpeed = 0.4 + currentMultiplier * 0.3;
  let baseSaturation = 80;
  let baseBrightness = 90;
  let pulseSaturation =
    baseSaturation +
    sin(frameCount * STREAK_PULSE_SPEED_FACTOR * currentMultiplier) *
      STREAK_PULSE_AMP_FACTOR *
      (currentMultiplier - 1);
  let pulseBrightness =
    baseBrightness +
    cos(frameCount * STREAK_PULSE_SPEED_FACTOR * 1.5 * currentMultiplier) *
      STREAK_PULSE_AMP_FACTOR *
      (currentMultiplier - 1);
  pulseSaturation = constrain(pulseSaturation, 60, 100);
  pulseBrightness = constrain(pulseBrightness, 70, 100);
  let finalSaturation = slowMoActive ? baseSaturation * 0.7 : pulseSaturation;
  let finalBrightness = slowMoActive ? baseBrightness * 0.8 : pulseBrightness;
  let hue = (frameCount * hueSpeed) % 360;
  stroke(hue, finalSaturation, finalBrightness, slowMoActive ? 70 : 100);
  if (!tunnel || tunnel.length < 2) {
    pop();
    return;
  }
  beginShape(TRIANGLE_STRIP);
  for (let i = 0; i < tunnel.length; i++) {
    let seg = tunnel[i];
    let center = seg.center;
    let z = seg.z;
    for (let j = 0; j <= TUNNEL_DETAIL; j++) {
      let angle = map(j, 0, TUNNEL_DETAIL, 0, TWO_PI);
      let x = center.x + cos(angle) * TUNNEL_RADIUS;
      let y = center.y + sin(angle) * TUNNEL_RADIUS;
      vertex(x, y, z);
      if (i + 1 < tunnel.length) {
        let nextSeg = tunnel[i + 1];
        let nextCenter = nextSeg.center;
        let nextZ = nextSeg.z;
        let nextX = nextCenter.x + cos(angle) * TUNNEL_RADIUS;
        let nextY = nextCenter.y + sin(angle) * TUNNEL_RADIUS;
        vertex(nextX, nextY, nextZ);
      } else {
        vertex(x, y, z);
      }
    }
  }
  endShape();
  pop();
}

// --- Update World State (3D) --- (No changes needed)
function updateWorld() {
  if (!player) return;
  let effectiveSpeed =
    currentWorldSpeedZ *
    (player.isBoosting ? player.boosterMultiplier : 1) *
    (slowMoActive ? 0.5 : 1);
  if (slowMoActive && --slowMoTimer <= 0) slowMoActive = false;
  if (streakTimer > 0) {
    streakTimer -= slowMoActive ? 0.5 : 1;
    if (streakTimer <= 0) resetStreak();
  }
  if (streakNotificationTimer > 0) streakNotificationTimer--;
  if (tunnel) {
    let currentStartZ = player.pos.z - TUNNEL_SEGMENT_LENGTH * 2;
    for (let i = tunnel.length - 1; i >= 0; i--) {
      tunnel[i].z -= effectiveSpeed;
      if (tunnel[i].z < currentStartZ) {
        tunnel.splice(i, 1);
        if (gameState === "PLAYING") {
          score++;
          if (score >= nextStageScore) {
            if (player) player.heal(STAGE_HEAL_AMOUNT);
            nextStageScore += STAGE_SCORE_THRESHOLD;
          }
        }
      }
    }
    if (
      tunnel.length === 0 ||
      tunnel[tunnel.length - 1].z < player.pos.z + TUNNEL_VISIBLE_LENGTH
    ) {
      let nextZ =
        tunnel.length > 0
          ? tunnel[tunnel.length - 1].z + TUNNEL_SEGMENT_LENGTH
          : player.pos.z + TUNNEL_VISIBLE_LENGTH;
      addTunnelSegment(nextZ);
    }
  }
  if (powerUps) {
    for (let i = powerUps.length - 1; i >= 0; i--) {
      let pu = powerUps[i];
      if (!pu) {
        powerUps.splice(i, 1);
        continue;
      }
      pu.update(effectiveSpeed);
      if (pu.pos.z < player.pos.z - 100) {
        powerUps.splice(i, 1);
      } else if (player.checkCollision(pu)) {
        player.activatePowerUp(pu.type);
        powerUps.splice(i, 1);
      }
    }
  }
  if (enemies) {
    for (let i = enemies.length - 1; i >= 0; i--) {
      let enemy = enemies[i];
      if (!enemy) {
        enemies.splice(i, 1);
        continue;
      }
      enemy.update(player.pos);
      if (enemy.pos.z < player.pos.z - 100) {
        enemies.splice(i, 1);
      } else if (!enemy.isAlive()) {
        streakCount++;
        streakMultiplier = min(
          MAX_STREAK_MULTIPLIER,
          1.0 + max(0, streakCount - 2) * STREAK_MULTIPLIER_INCREMENT
        );
        streakTimer = MAX_STREAK_TIME;
        if (streakCount >= 3) {
          streakNotificationText = `Streak x${streakMultiplier.toFixed(1)}!`;
          streakNotificationTimer = STREAK_NOTIFICATION_DURATION;
        }
        let baseKillScore =
          enemy.type === "PULLER"
            ? ENEMY_KILL_SCORE_PULLER
            : ENEMY_KILL_SCORE_LASER;
        score += floor(baseKillScore * streakMultiplier);
        enemies.splice(i, 1);
      } else if (player.checkCollision(enemy)) {
        player.takeDamage(PLAYER_ENEMY_COLLISION_DAMAGE, "ENEMY_COLLISION");
        enemy.takeDamage(ENEMY_PLAYER_COLLISION_DAMAGE);
      }
    }
  }
  if (playerProjectiles) {
    for (let i = playerProjectiles.length - 1; i >= 0; i--) {
      let proj = playerProjectiles[i];
      if (!proj) {
        playerProjectiles.splice(i, 1);
        continue;
      }
      proj.update();
      if (proj.isOffScreen()) {
        playerProjectiles.splice(i, 1);
        continue;
      }
      if (enemies) {
        for (let j = enemies.length - 1; j >= 0; j--) {
          let enemy = enemies[j];
          if (enemy && enemy.isAlive() && proj.checkCollision(enemy)) {
            if (enemy.takeDamage) enemy.takeDamage(proj.damage);
            playerProjectiles.splice(i, 1);
            break;
          }
        }
      }
    }
  }
  if (enemyProjectiles) {
    for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
      let proj = enemyProjectiles[i];
      if (!proj) {
        enemyProjectiles.splice(i, 1);
        continue;
      }
      proj.update();
      if (proj.isOffScreen()) {
        enemyProjectiles.splice(i, 1);
        continue;
      }
      if (player && proj.checkCollision(player)) {
        if (player.takeDamage)
          player.takeDamage(proj.damage, "ENEMY_PROJECTILE");
        enemyProjectiles.splice(i, 1);
      }
    }
  }
  if (!slowMoActive) currentWorldSpeedZ += SPEED_INCREASE_RATE;
  noiseOffset += noiseSpeed * (effectiveSpeed / BASE_WORLD_SPEED_Z);
}

// --- Reset Streak --- (No changes needed)
function resetStreak() {
  streakCount = 0;
  streakMultiplier = 1.0;
  streakTimer = 0;
  streakNotificationTimer = min(streakNotificationTimer, 15);
  streakNotificationText = "";
}

// --- Draw All Game Elements (3D) ---
function drawGameElements() {
  ambientMaterial(100); // Apply a default material
  push();
  drawTunnel();
  pop();
  if (powerUps)
    powerUps.forEach((pu) => {
      if (pu) {
        push();
        pu.draw();
        pop();
      }
    });
  if (playerProjectiles)
    playerProjectiles.forEach((p) => {
      if (p) {
        push();
        p.draw();
        pop();
      }
    });
  if (enemyProjectiles)
    enemyProjectiles.forEach((ep) => {
      if (ep) {
        push();
        ep.draw();
        pop();
      }
    });
  if (enemies)
    enemies.forEach((e) => {
      if (e) {
        push();
        e.draw();
        pop();
      }
    });
  if (player) {
    push();
    player.draw();
    pop();
  }
}

// --- Draw UI onto Buffer --- (No changes needed)
function drawUIBuffer() {
  if (currentFont) {
    uiBuffer.textFont(currentFont);
  } else {
    uiBuffer.textFont("monospace");
  }
  uiBuffer.clear();
  uiBuffer.push();
  uiBuffer.noStroke();
  uiBuffer.fill(0, 0, 100);
  uiBuffer.textSize(18);
  uiBuffer.textAlign(LEFT, TOP);
  uiBuffer.text(`SCORE: ${score}`, 20, 20);
  uiBuffer.text(`SPEED: ${currentWorldSpeedZ.toFixed(1)}`, 20, 45);
  uiBuffer.text(
    `STAGE: ${floor(score / STAGE_SCORE_THRESHOLD) + 1} (${
      score % STAGE_SCORE_THRESHOLD
    }/${STAGE_SCORE_THRESHOLD})`,
    20,
    70
  );
  uiBuffer.textAlign(RIGHT, TOP);
  uiBuffer.text(`POINTS: ${upgradePoints}`, uiBuffer.width - 20, 20);
  if (player) {
    let barWidth = 200;
    let barHeight = 20;
    let barX = uiBuffer.width / 2 - barWidth / 2;
    let barY = 20;
    let healthPercent = player.health / player.maxHealth;
    if (isNaN(healthPercent)) healthPercent = 0;
    uiBuffer.rectMode(CORNER);
    uiBuffer.fill(0, 0, 20);
    uiBuffer.rect(barX, barY, barWidth, barHeight, 5);
    let healthColor = color(120, 80, 80);
    if (healthPickupFlashTimer > 0)
      healthColor = lerpColor(
        color(120, 50, 100),
        healthColor,
        healthPickupFlashTimer / HEALTH_PICKUP_FLASH_DURATION
      );
    if (healthPercent < 0.5)
      healthColor = lerpColor(
        color(0, 90, 90),
        color(60, 90, 90),
        constrain(healthPercent * 2, 0, 1)
      );
    else
      healthColor = lerpColor(
        color(60, 90, 90),
        color(120, 80, 80),
        constrain((healthPercent - 0.5) * 2, 0, 1)
      );
    uiBuffer.fill(healthColor);
    uiBuffer.rect(
      barX,
      barY,
      barWidth * constrain(healthPercent, 0, 1),
      barHeight,
      5
    );
    uiBuffer.fill(0, 0, 100);
    uiBuffer.textSize(14);
    uiBuffer.textAlign(CENTER, CENTER);
    uiBuffer.text(
      `${ceil(player.health)} / ${ceil(player.maxHealth)}`,
      barX + barWidth / 2,
      barY + barHeight / 2 + 1
    );
    barWidth = 150;
    barHeight = 12;
    barX = uiBuffer.width / 2 - barWidth / 2;
    barY = 45;
    let boostPercent = player.boosterFuel / player.maxBoosterFuel;
    if (isNaN(boostPercent)) boostPercent = 0;
    uiBuffer.rectMode(CORNER);
    uiBuffer.fill(0, 0, 20, 80);
    uiBuffer.rect(barX, barY, barWidth, barHeight, 3);
    let boostColor = color(200, 80, 90);
    if (boostPickupFlashTimer > 0)
      boostColor = lerpColor(
        color(200, 50, 100),
        boostColor,
        boostPickupFlashTimer / BOOST_PICKUP_FLASH_DURATION
      );
    if (player.boosterRegenDelayTimer > 0 && !player.isBoosting)
      boostColor = lerpColor(boostColor, color(0, 0, 30), 0.5);
    uiBuffer.fill(boostColor);
    uiBuffer.rect(
      barX,
      barY,
      barWidth * constrain(boostPercent, 0, 1),
      barHeight,
      3
    );
    uiBuffer.fill(0, 0, 100, 80);
    uiBuffer.textSize(10);
    uiBuffer.textAlign(CENTER, CENTER);
    uiBuffer.text(
      `BOOST ${ceil(player.boosterFuel)}/${ceil(player.maxBoosterFuel)}`,
      barX + barWidth / 2,
      barY + barHeight / 2 + 1
    );
    barY = 60;
    let energyPercent = player.weaponEnergy / player.maxWeaponEnergy;
    if (isNaN(energyPercent)) energyPercent = 0;
    uiBuffer.rectMode(CORNER);
    uiBuffer.fill(0, 0, 20, 80);
    uiBuffer.rect(barX, barY, barWidth, barHeight, 3);
    let energyColor = color(180, 90, 90);
    if (maxWeaponEnergyPickupFlashTimer > 0)
      energyColor = lerpColor(
        color(180, 60, 100),
        energyColor,
        maxWeaponEnergyPickupFlashTimer /
          MAX_WEAPON_ENERGY_PICKUP_FLASH_DURATION
      );
    if (player.weaponEnergyRegenDelayTimer > 0)
      energyColor = lerpColor(energyColor, color(0, 0, 30), 0.5);
    uiBuffer.fill(energyColor);
    uiBuffer.rect(
      barX,
      barY,
      barWidth * constrain(energyPercent, 0, 1),
      barHeight,
      3
    );
    uiBuffer.fill(0, 0, 100, 80);
    uiBuffer.textSize(10);
    uiBuffer.textAlign(CENTER, CENTER);
    uiBuffer.text(
      `ENERGY ${ceil(player.weaponEnergy)}/${ceil(player.maxWeaponEnergy)}`,
      barX + barWidth / 2,
      barY + barHeight / 2 + 1
    );
    let startX = uiBuffer.width - 30;
    let yPos = 55;
    uiBuffer.fill(0, 0, 100);
    uiBuffer.textSize(12);
    uiBuffer.textAlign(RIGHT, CENTER);
    uiBuffer.text(
      `MISSILES: ${player.missileAmmo}/${player.maxMissileAmmo}`,
      startX,
      yPos
    );
  }
  if (streakCount >= 3 && streakTimer > 0) {
    let streakHue = map(streakMultiplier, 1, MAX_STREAK_MULTIPLIER, 60, 0);
    let streakSize = 20 + streakMultiplier * 1.5;
    let pulseBrightness =
      80 +
      sin(frameCount * STREAK_PULSE_SPEED_FACTOR * 2 * streakMultiplier) * 20;
    uiBuffer.fill(streakHue, 90, pulseBrightness);
    uiBuffer.textSize(streakSize);
    uiBuffer.textAlign(RIGHT, TOP);
    uiBuffer.text(`x${streakMultiplier.toFixed(1)}`, uiBuffer.width - 20, 75);
    let timerWidth = 100 + streakMultiplier * 5;
    let timerHeight = 5 + streakMultiplier * 0.5;
    let timerX = uiBuffer.width - 20 - timerWidth;
    let timerY = 80 + streakSize * 0.5;
    uiBuffer.fill(0, 0, 20, 80);
    uiBuffer.rectMode(CORNER);
    uiBuffer.rect(timerX, timerY, timerWidth, timerHeight, 2);
    uiBuffer.fill(streakHue, 90, 100);
    uiBuffer.rect(
      timerX,
      timerY,
      timerWidth * (streakTimer / MAX_STREAK_TIME),
      timerHeight,
      2
    );
  }
  if (streakNotificationTimer > 0 && streakNotificationText) {
    uiBuffer.textAlign(CENTER, CENTER);
    let alpha = map(
      streakNotificationTimer,
      0,
      STREAK_NOTIFICATION_DURATION,
      0,
      255
    );
    let flashFreq = 0.2 + streakMultiplier * 0.05;
    let baseBright = 60;
    let flashAmp = 40;
    let brightness = baseBright + sin(frameCount * flashFreq) * flashAmp;
    let notificationHue = map(
      streakMultiplier,
      1,
      MAX_STREAK_MULTIPLIER,
      60,
      0
    );
    uiBuffer.fill(notificationHue, 90, brightness, alpha);
    uiBuffer.textSize(28 + streakMultiplier * 2);
    uiBuffer.text(
      streakNotificationText,
      uiBuffer.width / 2,
      uiBuffer.height * 0.2
    );
  }
  if (slowMoActive) {
    uiBuffer.fill(270, 80, 90);
    uiBuffer.textSize(18);
    uiBuffer.textAlign(RIGHT, TOP);
    uiBuffer.text(
      `SLOW-MO [${ceil(slowMoTimer / 60)}s]`,
      uiBuffer.width - 20,
      45
    );
  }
  uiBuffer.pop();
}

// --- Draw Game State (3D with EasyCam) ---
function drawGame() {
  try {
    background(5, 80, 5);

    // Update EasyCam Target
    if (player && easycamTarget && easycam) {
      let targetX = player.pos.x;
      let targetY = player.pos.y - CAMERA_Y_OFFSET * 0.5;
      let targetZ = player.pos.z;
      easycamTarget.lerp(targetX, targetY, targetZ, EASYCAM_FOLLOW_LERP_RATE);
      let currentState = easycam.getState();
      currentState.center = easycamTarget.array();
      easycam.setState(currentState, 0);
    }

    // Lighting for 3D scene
    lights();
    ambientLight(60);
    directionalLight(200, 200, 200, 0.5, 0.8, -1);
    if (easycamTarget)
      pointLight(
        0,
        0,
        100,
        easycamTarget.x,
        easycamTarget.y,
        easycamTarget.z - 200
      );

    // Game Updates
    if (player) player.update();
    updateWorld();

    // Draw 3D Elements
    drawGameElements();

    // Draw 2D UI Overlay
    if (easycam) {
      drawUIBuffer();
      easycam.beginHUD();
      noLights(); // Turn off lights for HUD
      image(uiBuffer, 0, 0);
      easycam.endHUD();
    }
  } catch (error) {
    console.error("Error during game loop:", error);
    gameState = "ERROR";
  }
}

// --- Draw Start Screen (EasyCam for Preview, HUD for UI) ---
function drawStartScreen() {
  background(200, 80, 30);
  push(); // Isolate state

  // Setup 3D Preview Camera
  if (easycam) {
    let angleY = frameCount * 0.01;
    let rotationQuat = [0, sin(angleY / 2), 0, cos(angleY / 2)];
    let startCamState = {
      distance: 250,
      center: [0, 25, 0],
      rotation: rotationQuat,
    };
    easycam.setState(startCamState, 0);
  }

  // Draw 3D Preview
  lights();
  if (player) player.draw(0, 75, 0);

  // Draw 2D UI
  if (easycam) {
    easycam.beginHUD();
    noLights(); // No lights for HUD
    push(); // Isolate HUD drawing state
    fill(0, 0, 100);
    noStroke();
    textAlign(CENTER, CENTER);
    // Font set globally
    textSize(48);
    text("TUNNEL RACER 3D", width / 2, height * 0.1);
    textSize(20);
    text("Dodge Walls, Enemies, & Lasers!", width / 2, height * 0.18);
    textSize(22);
    let controlY = height * 0.5;
    text("CONTROLS", width / 2, controlY);
    controlY += 35;
    textSize(16);
    textAlign(CENTER, CENTER);
    text("A / Left Arrow : Steer Left", width / 2, controlY);
    controlY += 25;
    text("D / Right Arrow: Steer Right", width / 2, controlY);
    controlY += 25;
    text("Shift          : Boost", width / 2, controlY);
    controlY += 25;
    text("Spacebar       : Fire Laser", width / 2, controlY);
    controlY += 25;
    text("M              : Fire Missile", width / 2, controlY);
    controlY += 25;
    text("Mouse Drag     : Rotate Camera", width / 2, controlY);
    controlY += 25;
    text("Mouse Wheel    : Zoom Camera", width / 2, controlY);
    controlY += 35;
    textSize(16);
    text(
      "Earn points from score, then press 'U' after Game Over to upgrade!",
      width / 2,
      height * 0.85
    );
    textSize(24);
    text("Press ENTER to Start", width / 2, height * 0.92);
    pop(); // Restore HUD drawing state
    easycam.endHUD();
  }
  pop(); // Restore global state
}

// --- Draw Game Over Screen (Pure 2D using HUD) ---
function drawGameOverScreen() {
  background(0, 90, 50); // Background covers full screen

  if (easycam) {
    easycam.beginHUD(); // Use HUD for consistency
    noLights(); // No lights needed

    push(); // Isolate drawing state
    // Font set globally
    fill(0, 0, 100);
    noStroke();
    textAlign(CENTER, CENTER);

    // Draw text relative to top-left (0,0) in HUD space
    textSize(48);
    text("GAME OVER", width / 2, height * 0.2);
    textSize(32);
    text(`Final Score: ${lastScore}`, width / 2, height * 0.3);
    let pointsEarned = floor(lastScore * UPGRADE_POINT_CONVERSION_RATE);
    textSize(24);
    text(`Upgrade Points Earned: ${pointsEarned}`, width / 2, height * 0.38);
    text(
      `Total Upgrade Points: ${upgradePoints + pointsEarned}`,
      width / 2,
      height * 0.44
    );
    textSize(28);
    text("Press 'U' to Upgrade", width / 2, height * 0.75);
    textSize(24);
    text("Press ENTER to Restart", width / 2, height * 0.85);
    pop(); // Restore drawing state

    easycam.endHUD();
  } else {
    // Fallback if easycam isn't ready (shouldn't happen normally)
    push();
    fill(255, 0, 0);
    text("EasyCam not ready for Game Over", width / 2, height / 2);
    pop();
  }
}

// --- Draw Upgrade Screen (Pure 2D using HUD) ---
function drawUpgradeScreen() {
  background(240, 50, 20); // Background covers full screen

  if (easycam) {
    easycam.beginHUD(); // Use HUD for consistency
    noLights(); // No lights needed

    push(); // Isolate drawing state
    // Font set globally
    fill(0, 0, 100);
    noStroke();
    textAlign(CENTER, CENTER);

    // Draw text/UI relative to top-left (0,0) in HUD space
    textSize(36);
    text("SHIP UPGRADES", width / 2, 50);
    textSize(24);
    text(`Available Points: ${upgradePoints}`, width / 2, 100);
    let startY = 140;
    let availableHeight = height - startY - 100;
    let spacingY = min(availableHeight / upgradeKeys.length, 60);
    let startX = width * 0.1;
    let colWidth = width * 0.8;
    let textX = startX + 20;
    let valueX = startX + colWidth * 0.45;
    let costX = startX + colWidth - 20;

    textAlign(LEFT, TOP);
    textSize(16);
    for (let i = 0; i < upgradeKeys.length; i++) {
      let key = upgradeKeys[i];
      let upg = upgrades[key];
      let currentY = startY + i * spacingY;
      let maxLevelReached =
        upg.maxLevel !== undefined && upg.level >= upg.maxLevel;
      fill(0, 0, 10, 50);
      noStroke();
      rect(startX, currentY - 10, colWidth, spacingY - 5, 5);
      fill(0, 0, 100);
      text(`(${i + 1}) ${upg.name} [Lv ${upg.level}]`, textX, currentY);
      let baseValue = 0;
      if (key === "maxHealth") baseValue = INITIAL_MAX_HEALTH;
      else if (key === "maxEnergy") baseValue = INITIAL_MAX_WEAPON_ENERGY;
      else if (key === "maxAmmo") baseValue = INITIAL_MISSILE_AMMO;
      else if (key === "laserDamage") baseValue = LASER_CANNON_DAMAGE;
      else if (key === "missileDamage") baseValue = MISSILE_DAMAGE;
      else if (key === "maxBooster") baseValue = INITIAL_MAX_BOOSTER_FUEL;
      else if (key === "healthRegen") baseValue = HEALTH_REGEN_RATE;
      else if (key === "energyRegen") baseValue = WEAPON_ENERGY_REGEN_RATE;
      else if (key === "laserSpread") baseValue = 1;
      let totalValue = baseValue + upg.level * upg.effectPerLevel;
      if (key === "laserSpread") totalValue = 1 + upg.level * 2;
      if (key === "maxAmmo")
        totalValue = min(
          MAX_MISSILE_AMMO_CAP,
          baseValue + upg.level * upg.effectPerLevel
        );
      let effectStr = `Effect: ${totalValue.toFixed(
        upg.units === "/frame" ? 2 : 0
      )}`;
      if (key === "laserSpread") effectStr = `Lasers Fired: ${totalValue}`;
      if (key === "maxAmmo" && totalValue >= MAX_MISSILE_AMMO_CAP)
        effectStr += " (Max Cap)";
      if (key === "maxHealth")
        effectStr = `Starting Health: ${totalValue.toFixed(0)}`;
      if (upg.units === "/frame") effectStr += upg.units;
      text(effectStr, valueX, currentY);
      textAlign(RIGHT, TOP);
      if (maxLevelReached) {
        fill(20, 80, 80);
        text("MAX LEVEL", costX, currentY);
      } else {
        if (upgradePoints >= upg.cost) fill(120, 80, 90);
        else fill(0, 80, 90);
        text(`Cost: ${upg.cost} pts`, costX, currentY);
      }
      textAlign(LEFT, TOP); // Reset alignment
    }
    textAlign(CENTER, CENTER);
    textSize(20);
    fill(0, 0, 100);
    text(
      "Press number keys (1-9) to purchase upgrades.",
      width / 2,
      height - 70
    );
    text(
      "Press 'B' to go Back or ENTER to Start New Game",
      width / 2,
      height - 40
    );
    pop(); // Restore drawing state

    easycam.endHUD();
  } else {
    // Fallback if easycam isn't ready
    push();
    fill(255, 0, 0);
    text("EasyCam not ready for Upgrade Screen", width / 2, height / 2);
    pop();
  }
}

// --- Draw Error Screen (Pure 2D using HUD) ---
function drawErrorScreen(errorMessage) {
  background(0, 100, 50);
  if (easycam) {
    easycam.beginHUD();
    noLights();
    push();
    // Font set globally
    fill(0, 0, 100);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(24);
    text("RUNTIME ERROR", width / 2, height * 0.3);
    textSize(16);
    text(
      "An error occurred. Please check the console.",
      width / 2,
      height * 0.4
    );
    text(
      errorMessage || "Unknown Error",
      width / 2,
      height * 0.5,
      width * 0.8,
      height * 0.4
    );
    pop();
    easycam.endHUD();
  } else {
    // Fallback if easycam failed during setup
    push();
    fill(255, 0, 0);
    textSize(16);
    textAlign(CENTER, CENTER);
    textFont("monospace");
    text(
      `INIT ERROR / EasyCam Failed:\n${errorMessage}\nCheck console.`,
      width / 2,
      height / 2
    );
    pop();
  }
}

// --- Main Draw Loop ---
function draw() {
  // Set the font globally at the start of each frame
  if (currentFont) {
    textFont(currentFont);
  } else {
    textFont("monospace");
  }
  textAlign(CENTER, CENTER); // Ensure default alignment

  try {
    switch (gameState) {
      case "START":
        drawStartScreen();
        break;
      case "PLAYING":
        drawGame();
        break;
      case "GAME_OVER":
        drawGameOverScreen();
        break;
      case "UPGRADE":
        drawUpgradeScreen();
        break;
      case "ERROR":
        drawErrorScreen("An error occurred.");
        break;
      default:
        // Default case should also use HUD if easycam exists
        background(50);
        if (easycam) {
          easycam.beginHUD();
          noLights();
          text(`Unknown State: ${gameState}`, width / 2, height / 2);
          easycam.endHUD();
        } else {
          text(`Unknown State: ${gameState}`, width / 2, height / 2);
        }
    }
  } catch (e) {
    console.error("ERROR in draw() loop:", e);
    gameState = "ERROR";
    if (typeof noLoop === "function") {
      noLoop();
    }
    try {
      drawErrorScreen(e.message);
    } catch (e2) {
      console.error("Failed to draw error screen:", e2);
    }
  }
} // End draw

// --- Input Handling --- (No changes needed)
function keyPressed() {
  if (gameState === "PLAYING") {
    if (key === " ") {
      if (player) player.fireLaser();
    } else if (key === "m" || key === "M") {
      if (player) player.fireMissile();
    }
  } else if (gameState === "START") {
    if (keyCode === ENTER) {
      resetGame();
      gameState = "PLAYING";
    }
  } else if (gameState === "GAME_OVER") {
    if (keyCode === ENTER) {
      resetGame();
      gameState = "PLAYING";
    } else if (key === "u" || key === "U") {
      let pointsEarned = floor(lastScore * UPGRADE_POINT_CONVERSION_RATE);
      upgradePoints += pointsEarned;
      lastScore = 0;
      gameState = "UPGRADE";
    }
  } else if (gameState === "UPGRADE") {
    if (key === "b" || key === "B") {
      gameState = "START";
    } else if (keyCode === ENTER) {
      resetGame();
      gameState = "PLAYING";
    } else {
      let upgradeIndex = -1;
      if (key >= "1" && key <= "9") {
        upgradeIndex = parseInt(key) - 1;
      }
      if (upgradeIndex >= 0 && upgradeIndex < upgradeKeys.length) {
        let upgradeKey = upgradeKeys[upgradeIndex];
        let upg = upgrades[upgradeKey];
        let maxLevelReached =
          upg.maxLevel !== undefined && upg.level >= upg.maxLevel;
        if (!maxLevelReached && upgradePoints >= upg.cost) {
          upgradePoints -= upg.cost;
          upg.level++;
          upg.cost = floor(upg.baseCost * pow(upg.scale, upg.level));
          if (player && player.resetStatsBasedOnUpgrades)
            player.resetStatsBasedOnUpgrades();
        }
      }
    }
  }
}

// --- Window Resize --- (No changes needed)
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (uiBuffer) {
    uiBuffer.resizeGraphics(windowWidth, windowHeight);
    uiBuffer.textFont(currentFont);
    uiBuffer.textAlign(CENTER, CENTER);
  }
  if (easycam) {
    easycam.setViewport([0, 0, windowWidth, windowHeight]);
  }
}
