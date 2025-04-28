try {
  // --- Game Tuning Variables ---
  const INITIAL_MAX_HEALTH = 100;
  const HEALTH_REGEN_RATE = 0.04;
  const REGEN_DELAY_AFTER_HIT = 120;
  const BASE_DAMAGE_MULTIPLIER = 0.15;
  const POWERUP_SPAWN_CHANCE = 0.018;
  const POWERUP_HEALTH_CHANCE = 0.3;
  const POWERUP_SLOWMO_CHANCE = 0.15;
  const POWERUP_MAX_HEALTH_CHANCE = 0.1;
  const POWERUP_BOOST_FUEL_CHANCE = 0.15;
  const POWERUP_MAX_WEAPON_ENERGY_CHANCE = 0.15;
  const POWERUP_MISSILE_AMMO_CHANCE = 0.15;
  const MAX_WEAPON_ENERGY_INCREASE_AMOUNT = 20;
  const STAGE_SCORE_THRESHOLD = 300;
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
  const LASER_CANNON_SPEED = 8;
  const INITIAL_MISSILE_AMMO = 3;
  const MAX_MISSILE_AMMO_CAP = 20;
  const MISSILE_PICKUP_AMOUNT = 2;
  const MISSILE_FIRE_COOLDOWN = 45;
  const MISSILE_DAMAGE = 75;
  const MISSILE_SPEED = 5.0;
  const MISSILE_TURN_RATE = 0.08;
  const MISSILE_MAX_STEER_FORCE = 0.3;
  const ENEMY_SPAWN_CHANCE = 0.05;
  const ENEMY_BASE_SPEED = 1.5;
  const LASER_ENEMY_HEALTH = 50;
  const LASER_ENEMY_SHOOT_INTERVAL = 90;
  const LASER_ENEMY_PROJECTILE_SPEED = 8;
  const LASER_ENEMY_PROJECTILE_DAMAGE = 10;
  const PULLER_ENEMY_HEALTH = 80;
  const PULLER_ENEMY_FORCE_MULTIPLIER = 500;
  const PULLER_ENEMY_MIN_DIST_SQ = 50 * 50;
  const PLAYER_ENEMY_COLLISION_DAMAGE = 20;
  const ENEMY_PLAYER_COLLISION_DAMAGE = 30;
  const ENEMY_KILL_SCORE_LASER = 20;
  const ENEMY_KILL_SCORE_PULLER = 30;
  const UPGRADE_POINT_CONVERSION_RATE = 0.5;
  const MAX_STREAK_TIME = 120; // <<< Reduced Streak Timer (2 seconds) >>>
  const STREAK_MULTIPLIER_INCREMENT = 0.5;
  const MAX_STREAK_MULTIPLIER = 5.0;
  const STREAK_NOTIFICATION_DURATION = 90;
  const STREAK_PULSE_SPEED_FACTOR = 0.1;
  const STREAK_PULSE_AMP_FACTOR = 5;

  // --- Global Variables ---
  let player;
  let tunnel = [];
  let powerUps = [];
  let enemies = [];
  let playerProjectiles = [];
  let enemyProjectiles = [];
  let segmentHeight = 10;
  let tunnelWidthBase = 550;
  let tunnelWidthVariance = 120;
  let noiseOffset = 0;
  let noiseSpeed = 0.004;
  let baseSpeed = 1.8;
  let speedIncrease = 0.003;
  let currentSpeed;
  let score = 0;
  let lastScore = 0;
  let nextStageScore;
  let gameState = "START"; // START, PLAYING, GAME_OVER, UPGRADE
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
  // --- Streak Variables ---
  let streakCount = 0;
  let streakMultiplier = 1.0;
  let streakTimer = 0;
  let streakNotificationTimer = 0;
  let streakNotificationText = "";
  // --- Upgrade System Data ---
  let upgradePoints = 0;
  let upgrades = {
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

  // --- Player Object --- (No changes needed here for these requests)
  class Player {
    constructor() {
      this.x = width / 2;
      this.y = height - 50;
      this.width = 20;
      this.height = 15;
      this.baseMoveSpeed = 5.5;
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
      this.externalForceX = 0;
      this.baseColor = color(0, 0, 100);
      this.damageColor = color(0, 90, 100);
      this.boostColor = color(200, 80, 100);
    }
    resetStatsBasedOnUpgrades() {
      this.maxHealth = INITIAL_MAX_HEALTH;
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
    }
    update() {
      this.isBoosting = false;
      this.externalForceX = 0;
      if (enemies) {
        for (let enemy of enemies) {
          if (enemy && enemy.type === "PULLER" && enemy.calculatePull) {
            let pull = enemy.calculatePull(this);
            if (!isNaN(pull)) this.externalForceX += pull;
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
      let currentFrameMoveSpeed = this.baseMoveSpeed;
      if (this.isBoosting) currentFrameMoveSpeed *= this.boosterMultiplier;
      let moveIntentX = 0;
      if (moveLeft) moveIntentX -= currentFrameMoveSpeed;
      if (moveRight) moveIntentX += currentFrameMoveSpeed;
      let deltaX = moveIntentX + this.externalForceX;
      if (!isNaN(deltaX)) this.x += deltaX;
      this.x = constrain(this.x, this.width / 2, width - this.width / 2);
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
      if (maxWeaponEnergyPickupFlashTimer > 0)
        maxWeaponEnergyPickupFlashTimer--;
      if (missileAmmoPickupFlashTimer > 0) missileAmmoPickupFlashTimer--;
    }
    draw(forceX = this.x, forceY = this.y) {
      let currentColor = this.baseColor;
      if (this.damageFlashTimer > 0)
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
      translate(forceX, forceY);
      fill(currentColor);
      noStroke();
      rectMode(CENTER);
      rect(0, 0, this.width, this.height);
      let wingColor = lerpColor(currentColor, color(0, 0, 80), 0.3);
      let cannonColor = lerpColor(currentColor, color(0, 0, 60), 0.5);
      let glowColor = lerpColor(currentColor, color(60, 80, 100), 0.4);
      let wingWidth = this.width * 0.4;
      let wingHeight = this.height * 0.8;
      if (this.laserSpreadLevel > 0) {
        fill(wingColor);
        rect(-this.width * 0.6, 0, wingWidth, wingHeight, 2);
        rect(this.width * 0.6, 0, wingWidth, wingHeight, 2);
      }
      if (this.laserSpreadLevel > 1) {
        fill(wingColor);
        triangle(
          -this.width * 0.6,
          -wingHeight * 0.5,
          -this.width * 0.9,
          -wingHeight * 0.1,
          -this.width * 0.9,
          wingHeight * 0.7
        );
        triangle(
          this.width * 0.6,
          -wingHeight * 0.5,
          this.width * 0.9,
          -wingHeight * 0.1,
          this.width * 0.9,
          wingHeight * 0.7
        );
      }
      if (this.laserSpreadLevel > 2) {
        fill(cannonColor);
        ellipse(
          -this.width * 0.9,
          this.height * 0.4,
          this.width * 0.3,
          this.height * 0.3
        );
        ellipse(
          this.width * 0.9,
          this.height * 0.4,
          this.width * 0.3,
          this.height * 0.3
        );
      }
      if (this.laserSpreadLevel > 3) {
        fill(glowColor);
        ellipse(0, -this.height * 0.6, this.width * 0.2, this.height * 0.2);
        ellipse(
          -this.width * 0.9,
          -this.height * 0.1,
          this.width * 0.15,
          this.height * 0.15
        );
        ellipse(
          this.width * 0.9,
          -this.height * 0.1,
          this.width * 0.15,
          this.height * 0.15
        );
      }
      if (this.isBoosting && gameState === "PLAYING") {
        fill(this.boostColor, 50 + random(-10, 10));
        noStroke();
        rect(
          0,
          this.height * (this.laserSpreadLevel > 1 ? 0.9 : 0.8),
          this.width * 0.8,
          this.height * 1.5 + random(-3, 3),
          3
        );
      }
      pop();
    }
    fireLaser() {
      if (this.weaponEnergy >= this.weaponCost) {
        this.weaponEnergy -= this.weaponCost;
        this.weaponEnergyRegenDelayTimer = this.weaponEnergyRegenDelayDuration;
        let numLasers = 1 + this.laserSpreadLevel * 2;
        let spreadAngle = PI / 24;
        let startAngle =
          numLasers === 1 ? 0 : (-spreadAngle * (numLasers - 1)) / 2;
        if (playerProjectiles) {
          for (let i = 0; i < numLasers; i++) {
            let angle = startAngle + i * spreadAngle;
            let vx = sin(angle) * this.weaponProjectileSpeed;
            let vy = -cos(angle) * this.weaponProjectileSpeed;
            playerProjectiles.push(
              new Projectile(
                this.x,
                this.y - this.height / 2,
                vx,
                vy,
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
          playerProjectiles.push(
            new Projectile(
              this.x,
              this.y - this.height / 2,
              0,
              -MISSILE_SPEED,
              "PLAYER_MISSILE",
              this.missileDamage
            )
          );
        }
      }
    }
    calculateWallDamage(tunnelSegments) {
      let collisionSegment = null;
      let minDist = Infinity;
      if (!tunnelSegments) return 0;
      for (let seg of tunnelSegments) {
        if (!seg || typeof seg.y === "undefined") continue;
        let distY = abs(seg.y - this.y);
        if (distY < this.height * 2) {
          let tunnelL = seg.x - seg.w / 2;
          let tunnelR = seg.x + seg.w / 2;
          let currentHalfWidth =
            (this.width / 2) * (1 + this.laserSpreadLevel * 0.3);
          let playerL = this.x - currentHalfWidth;
          let playerR = this.x + currentHalfWidth;
          if (playerL < tunnelL || playerR > tunnelR) {
            if (distY < minDist) {
              minDist = distY;
              collisionSegment = seg;
            }
          }
        }
      }
      if (collisionSegment) {
        let tunnelL = collisionSegment.x - collisionSegment.w / 2;
        let tunnelR = collisionSegment.x + collisionSegment.w / 2;
        let currentHalfWidth =
          (this.width / 2) * (1 + this.laserSpreadLevel * 0.3);
        let playerL = this.x - currentHalfWidth;
        let playerR = this.x + currentHalfWidth;
        let overlap = 0;
        if (playerL < tunnelL) overlap = tunnelL - playerL;
        else if (playerR > tunnelR) overlap = playerR - tunnelR;
        let speedFactor = currentSpeed / baseSpeed;
        if (overlap > 0)
          return max(0.1, overlap * BASE_DAMAGE_MULTIPLIER * speedFactor);
      }
      return 0;
    }
    takeDamage(amount, source = null) {
      if (amount <= 0 || isNaN(amount)) return;
      this.health -= amount;
      this.regenDelayTimer = this.regenDelayDuration;
      this.damageFlashTimer = this.damageFlashDuration;
      this.health = max(0, this.health);
      if (this.health <= 0 && gameState === "PLAYING") {
        lastScore = score;
        resetStreak();
        gameState = "GAME_OVER";
      }
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
    increaseMaxWeaponEnergy(amount) {
      if (!isNaN(amount) && amount > 0) {
        this.weaponEnergy = min(
          this.weaponEnergy + amount,
          this.maxWeaponEnergy
        );
        maxWeaponEnergyPickupFlashTimer =
          MAX_WEAPON_ENERGY_PICKUP_FLASH_DURATION;
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
        this.heal(amount);
      }
    }
    checkPowerUpCollision(powerUpsToCheck) {
      if (!powerUpsToCheck) return;
      for (let i = powerUpsToCheck.length - 1; i >= 0; i--) {
        let pu = powerUpsToCheck[i];
        if (!pu || typeof pu.x === "undefined") continue;
        let d = dist(this.x, this.y, pu.x, pu.y);
        if (d < (this.width / 2 + pu.size / 2) * 1.1) {
          let originalIndex = powerUps.indexOf(pu);
          if (originalIndex > -1) {
            this.activatePowerUp(pu.type);
            powerUps.splice(originalIndex, 1);
          }
        }
      }
    }
    checkEnemyCollision(enemiesToCheck) {
      if (!enemiesToCheck) return;
      for (let i = enemiesToCheck.length - 1; i >= 0; i--) {
        let enemy = enemiesToCheck[i];
        if (!enemy || typeof enemy.x === "undefined") continue;
        let currentHalfWidth =
          (this.width / 2) * (1 + this.laserSpreadLevel * 0.3);
        let playerL = this.x - currentHalfWidth;
        let playerR = this.x + currentHalfWidth;
        let playerT = this.y - this.height / 2;
        let playerB = this.y + this.height / 2;
        let enemyL = enemy.x - enemy.size / 2;
        let enemyR = enemy.x + enemy.size / 2;
        let enemyT = enemy.y - enemy.size / 2;
        let enemyB = enemy.y + enemy.size / 2;
        if (
          playerR > enemyL &&
          playerL < enemyR &&
          playerB > enemyT &&
          playerT < enemyB
        ) {
          this.takeDamage(PLAYER_ENEMY_COLLISION_DAMAGE, "ENEMY_COLLISION");
          if (enemies[i] === enemy && enemy.isAlive()) {
            enemy.takeDamage(ENEMY_PLAYER_COLLISION_DAMAGE);
          }
        }
      }
    }
    activatePowerUp(type) {
      if (type === "HEALTH_PACK") this.heal(INITIAL_MAX_HEALTH * 0.4);
      else if (type === "SLOW_MO") {
        slowMoActive = true;
        slowMoTimer = slowMoDuration;
      } else if (type === "MAX_HEALTH_UP") this.heal(INITIAL_MAX_HEALTH * 0.2);
      else if (type === "BOOST_FUEL") this.restoreBoost(BOOST_PICKUP_AMOUNT);
      else if (type === "MAX_WEAPON_ENERGY")
        this.increaseMaxWeaponEnergy(MAX_WEAPON_ENERGY_INCREASE_AMOUNT);
      else if (type === "MISSILE_AMMO")
        this.addMissileAmmo(MISSILE_PICKUP_AMOUNT);
    }
    reset() {
      this.x = width / 2;
      this.y = height - 50;
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
      this.isBoosting = false;
      slowMoActive = false;
      slowMoTimer = 0;
      healthPickupFlashTimer = 0;
      boostPickupFlashTimer = 0;
      maxWeaponEnergyPickupFlashTimer = 0;
      missileAmmoPickupFlashTimer = 0;
    }
  }

  // --- Projectile Object --- (No changes needed)
  class Projectile {
    constructor(x, y, vx, vy, type, damage) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.type = type;
      this.damage = damage;
      if (type === "PLAYER_LASER") {
        this.size = 6;
        this.color = color(150, 80, 100);
      } else if (type === "ENEMY_LASER") {
        this.size = 5;
        this.color = color(30, 90, 100);
      } else if (type === "PLAYER_MISSILE") {
        this.size = 8;
        this.color = color(0, 0, 100);
        this.trail = [];
        this.trailLength = 10;
        this.targetEnemy = null;
        this.maxSpeed = MISSILE_SPEED;
        this.maxForce = MISSILE_MAX_STEER_FORCE;
        let mag = sqrt(vx * vx + vy * vy);
        if (mag > 0) {
          this.vx = (vx / mag) * this.maxSpeed;
          this.vy = (vy / mag) * this.maxSpeed;
        } else {
          this.vy = -this.maxSpeed;
        }
      }
    }
    findTarget() {
      let closestDistSq = Infinity;
      let closestEnemy = null;
      if (enemies) {
        for (let enemy of enemies) {
          if (enemy && enemy.isAlive() && enemy.x) {
            let dSq = pow(enemy.x - this.x, 2) + pow(enemy.y - this.y, 2);
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
      let desired = p5.Vector.sub(targetPos, createVector(this.x, this.y));
      desired.setMag(this.maxSpeed);
      let steer = p5.Vector.sub(desired, createVector(this.vx, this.vy));
      steer.limit(this.maxForce);
      return steer;
    }
    applyForce(force) {
      if (!force) return;
      this.vx += force.x;
      this.vy += force.y;
      let speedSq = this.vx * this.vx + this.vy * this.vy;
      if (speedSq > this.maxSpeed * this.maxSpeed) {
        let speed = sqrt(speedSq);
        this.vx = (this.vx / speed) * this.maxSpeed;
        this.vy = (this.vy / speed) * this.maxSpeed;
      }
    }
    update() {
      if (this.type === "PLAYER_MISSILE") {
        this.trail.push(createVector(this.x, this.y));
        if (this.trail.length > this.trailLength) this.trail.splice(0, 1);
        if (
          !this.targetEnemy ||
          !this.targetEnemy.isAlive() ||
          frameCount % 15 === 0
        )
          this.findTarget();
        if (this.targetEnemy && this.targetEnemy.x) {
          this.applyForce(
            this.seek(createVector(this.targetEnemy.x, this.targetEnemy.y))
          );
        }
      }
      this.x += this.vx;
      this.y += this.vy;
    }
    draw() {
      if (this.type === "PLAYER_MISSILE") {
        noFill();
        strokeWeight(2);
        stroke(25, 90, 90, 50);
        beginShape();
        for (let v of this.trail) vertex(v.x, v.y);
        vertex(this.x, this.y);
        endShape();
        push();
        translate(this.x, this.y);
        let angle = atan2(this.vy, this.vx) + HALF_PI;
        rotate(angle);
        fill(this.color);
        stroke(60, 80, 100);
        strokeWeight(1);
        triangle(
          0,
          -this.size,
          -this.size * 0.5,
          this.size * 0.5,
          this.size * 0.5,
          this.size * 0.5
        );
        fill(30, 90, 100, 80 + random(-10, 10));
        noStroke();
        ellipse(
          0,
          this.size * 0.8,
          this.size * 0.8,
          this.size * 1.2 + random(-2, 2)
        );
        pop();
      } else {
        fill(this.color);
        noStroke();
        push();
        translate(this.x, this.y);
        let angle = atan2(this.vy, this.vx) + HALF_PI;
        rotate(angle);
        ellipse(0, 0, this.size * 0.8, this.size * 1.8);
        pop();
      }
    }
    isOffScreen() {
      return (
        this.y < -this.size * 3 ||
        this.y > height + this.size * 3 ||
        this.x < -this.size * 3 ||
        this.x > width + this.size * 3
      );
    }
    checkCollision(target) {
      if (!target || typeof target.x === "undefined") return false;
      let targetSize = 0;
      if (target instanceof Player)
        targetSize = max(target.width, target.height) / 2;
      else if (target instanceof Enemy) targetSize = target.size / 2;
      else return false;
      let d = dist(this.x, this.y, target.x, target.y);
      return d < this.size / 2 + targetSize;
    }
  }

  // --- Enemy Object --- (No changes needed)
  class Enemy {
    constructor(x, y, type) {
      this.x = x;
      this.y = y;
      this.type = type;
      this.speed = ENEMY_BASE_SPEED * random(0.8, 1.2);
      this.size = type === "LASER" ? 25 : 35;
      this.hitTimer = 0;
      this.hitDuration = 10;
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
    update() {
      this.y += this.speed * (slowMoActive ? 0.5 : 1);
      if (this.type === "LASER") {
        this.shootTimer -= slowMoActive ? 0.5 : 1;
        if (this.shootTimer <= 0) {
          this.shoot();
          this.shootTimer = this.shootCooldown;
        }
      } else if (this.type === "PULLER") {
        this.pulseTimer += 0.05 * (slowMoActive ? 0.5 : 1);
      }
      if (this.hitTimer > 0) this.hitTimer--;
    }
    shoot() {
      if (enemyProjectiles)
        enemyProjectiles.push(
          new Projectile(
            this.x,
            this.y + this.size / 2,
            0,
            LASER_ENEMY_PROJECTILE_SPEED,
            "ENEMY_LASER",
            LASER_ENEMY_PROJECTILE_DAMAGE
          )
        );
    }
    calculatePull(player) {
      if (!player || typeof player.x === "undefined") return 0;
      let dSq = pow(player.x - this.x, 2) + pow(player.y - this.y, 2);
      if (dSq < PULLER_ENEMY_MIN_DIST_SQ) dSq = PULLER_ENEMY_MIN_DIST_SQ;
      let distance = sqrt(dSq);
      if (distance === 0) return 0;
      let forceMagnitude = this.pullForce / dSq;
      let dirX = (this.x - player.x) / distance;
      let forceX = dirX * forceMagnitude;
      return isNaN(forceX) ? 0 : forceX * (slowMoActive ? 0.3 : 1);
    }
    takeDamage(amount) {
      if (!isNaN(amount)) {
        this.health -= amount;
        this.hitTimer = this.hitDuration;
      }
    }
    isAlive() {
      return this.health > 0;
    }
    draw() {
      push();
      translate(this.x, this.y);
      let displayColor = this.baseColor;
      if (this.hitTimer > 0)
        displayColor = lerpColor(
          this.baseColor,
          color(0, 0, 100),
          this.hitTimer / this.hitDuration
        );
      strokeWeight(2);
      stroke(0, 0, 20);
      if (this.type === "LASER") {
        fill(displayColor);
        triangle(
          0,
          this.size * 0.6,
          -this.size * 0.5,
          -this.size * 0.4,
          this.size * 0.5,
          -this.size * 0.4
        );
        fill(0, 0, 40);
        rectMode(CENTER);
        rect(
          -this.size * 0.4,
          -this.size * 0.05,
          this.size * 0.2,
          this.size * 0.4
        );
        rect(
          this.size * 0.4,
          -this.size * 0.05,
          this.size * 0.2,
          this.size * 0.4
        );
        fill(30, 90, 100, 80);
        noStroke();
        ellipse(0, this.size * 0.65, this.size * 0.15, this.size * 0.2);
      } else if (this.type === "PULLER") {
        let pulseSize = this.size * (1 + sin(this.pulseTimer) * 0.15);
        fill(displayColor);
        ellipse(0, 0, pulseSize, pulseSize);
        fill(0, 0, 10, 90);
        ellipse(0, 0, pulseSize * 0.4, pulseSize * 0.4);
        stroke(displayColor, 30);
        strokeWeight(1);
        for (let a = 0; a < TWO_PI; a += PI / 6) {
          let len = pulseSize * 0.6;
          line(
            cos(a) * len * 0.4,
            sin(a) * len * 0.4,
            cos(a) * len,
            sin(a) * len
          );
        }
      }
      let healthPercent = this.health / this.maxHealth;
      if (healthPercent < 1 && healthPercent >= 0) {
        let barW = max(this.size * 0.8, 20);
        let barH = 5;
        let barY = -this.size * 0.6 - barH - 3;
        rectMode(CORNER);
        fill(0, 90, 80, 70);
        noStroke();
        rect(-barW / 2, barY, barW, barH, 2);
        fill(120, 80, 80);
        rect(-barW / 2, barY, barW * healthPercent, barH, 2);
      }
      pop();
    }
  }

  // --- PowerUp Object --- (No changes needed)
  class PowerUp {
    constructor(x, y, type) {
      this.x = x;
      this.y = y;
      this.type = type;
      this.size = 15;
      this.rotation = random(TWO_PI);
      switch (type) {
        case "HEALTH_PACK":
          this.color = color(120, 80, 90);
          break;
        case "SLOW_MO":
          this.color = color(270, 80, 90);
          break;
        case "MAX_HEALTH_UP":
          this.color = color(120, 75, 85);
          this.borderColor = color(50, 90, 100);
          break;
        case "BOOST_FUEL":
          this.color = color(200, 80, 100);
          break;
        case "MAX_WEAPON_ENERGY":
          this.color = color(180, 90, 90);
          break;
        case "MISSILE_AMMO":
          this.color = color(0, 0, 85);
          break;
        default:
          this.color = color(0, 0, 50);
      }
    }
    update(speed) {
      this.y += speed;
      this.rotation += 0.05 * (slowMoActive ? 0.5 : 1);
    }
    draw() {
      push();
      translate(this.x, this.y);
      rotate(this.rotation);
      strokeWeight(2);
      stroke(0, 0, 100);
      rectMode(CENTER);
      ellipseMode(CENTER);
      textAlign(CENTER, CENTER);
      if (this.type === "HEALTH_PACK") {
        fill(this.color);
        rect(0, 0, this.size * 0.4, this.size);
        rect(0, 0, this.size, this.size * 0.4);
      } else if (this.type === "MAX_HEALTH_UP") {
        fill(this.color);
        stroke(this.borderColor);
        strokeWeight(3);
        rect(0, 0, this.size * 0.4, this.size);
        rect(0, 0, this.size, this.size * 0.4);
      } else if (this.type === "SLOW_MO") {
        fill(this.color);
        ellipse(0, 0, this.size * 1.2, this.size * 1.2);
        fill(0, 0, 100);
        noStroke();
        textSize(this.size * 0.8);
        text("S", 0, 1);
      } else if (this.type === "BOOST_FUEL") {
        fill(this.color);
        noStroke();
        beginShape();
        vertex(-this.size * 0.6, -this.size * 0.5);
        vertex(0, 0);
        vertex(-this.size * 0.6, this.size * 0.5);
        endShape(CLOSE);
        beginShape();
        vertex(0, -this.size * 0.5);
        vertex(this.size * 0.6, 0);
        vertex(0, this.size * 0.5);
        endShape(CLOSE);
        stroke(0, 0, 100);
        strokeWeight(2);
        noFill();
        beginShape();
        vertex(-this.size * 0.6, -this.size * 0.5);
        vertex(0, 0);
        vertex(-this.size * 0.6, this.size * 0.5);
        vertex(0, this.size * 0.5);
        vertex(this.size * 0.6, 0);
        vertex(0, -this.size * 0.5);
        endShape(CLOSE);
      } else if (this.type === "MAX_WEAPON_ENERGY") {
        fill(this.color);
        ellipse(0, 0, this.size, this.size);
        fill(0, 0, 100);
        noStroke();
        textSize(this.size * 0.7);
        text("E", 0, 1);
      } else if (this.type === "MISSILE_AMMO") {
        fill(this.color);
        triangle(
          0,
          -this.size * 0.7,
          -this.size * 0.4,
          this.size * 0.5,
          this.size * 0.4,
          this.size * 0.5
        );
        rect(0, this.size * 0.4, this.size * 0.5, this.size * 0.2);
      }
      pop();
    }
  }

  // --- Setup ---
  function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100, 100);
    player = new Player();
    textAlign(CENTER, CENTER);
    textFont("monospace");
  }

  // --- Reset Game State ---
  function resetGame() {
    score = 0;
    currentSpeed = baseSpeed;
    nextStageScore = STAGE_SCORE_THRESHOLD;
    noiseOffset = random(1000);
    if (player && typeof player.reset === "function") player.reset();
    else player = new Player();
    initTunnel();
    enemies = [];
    playerProjectiles = [];
    enemyProjectiles = [];
    resetStreak(); // Reset streak on new game
  }

  // --- Initialize Tunnel ---
  function initTunnel() {
    tunnel = [];
    powerUps = [];
    for (let y = height; y >= -segmentHeight * 2; y -= segmentHeight)
      addTunnelSegment(y, true);
    noiseOffset = random(1000);
  }

  // --- Add Tunnel Segment ---
  function addTunnelSegment(yPos, preventSpawns = false) {
    let noiseVal = noise(noiseOffset + yPos * 0.01);
    let centerX = map(noiseVal, 0, 1, width * 0.25, width * 0.75);
    let segmentWidth =
      tunnelWidthBase +
      sin(noiseOffset * 5 + yPos * 0.05) * tunnelWidthVariance;
    segmentWidth = constrain(segmentWidth, 70, width * 0.9);
    tunnel.unshift({ y: yPos, x: centerX, w: segmentWidth });
    if (!preventSpawns && gameState === "PLAYING") {
      if (random() < POWERUP_SPAWN_CHANCE) {
        let puX = centerX + random(-segmentWidth * 0.35, segmentWidth * 0.35);
        let puY = yPos + segmentHeight / 2;
        let randType = random();
        let puType;
        let cumulativeChance = 0;
        cumulativeChance += POWERUP_HEALTH_CHANCE;
        if (randType < cumulativeChance) {
          puType = "HEALTH_PACK";
        } else {
          cumulativeChance += POWERUP_SLOWMO_CHANCE;
          if (randType < cumulativeChance) {
            puType = "SLOW_MO";
          } else {
            cumulativeChance += POWERUP_MAX_HEALTH_CHANCE;
            if (randType < cumulativeChance) {
              puType = "MAX_HEALTH_UP";
            } else {
              cumulativeChance += POWERUP_BOOST_FUEL_CHANCE;
              if (randType < cumulativeChance) {
                puType = "BOOST_FUEL";
              } else {
                cumulativeChance += POWERUP_MAX_WEAPON_ENERGY_CHANCE;
                if (randType < cumulativeChance) {
                  puType = "MAX_WEAPON_ENERGY";
                } else {
                  puType = "MISSILE_AMMO";
                }
              }
            }
          }
        }
        if (powerUps) powerUps.push(new PowerUp(puX, puY, puType));
      }
      if (random() < ENEMY_SPAWN_CHANCE) {
        let enemyX = centerX + random(-segmentWidth * 0.4, segmentWidth * 0.4);
        let enemyY = yPos;
        let enemyType = random() > 0.5 ? "LASER" : "PULLER";
        if (enemies) enemies.push(new Enemy(enemyX, enemyY, enemyType));
      }
    }
  }

  // --- Draw Tunnel (Enhanced Streak Effects) ---
  function drawTunnel() {
    let currentMultiplier = max(1, streakMultiplier);
    let thickness = 3 + floor(currentMultiplier * 0.5);
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
    strokeWeight(thickness);
    noFill();
    let hue = (frameCount * hueSpeed) % 360;
    if (!tunnel) return;
    for (let i = 0; i < tunnel.length - 1; i++) {
      let seg1 = tunnel[i],
        seg2 = tunnel[i + 1];
      if (!seg1 || !seg2 || typeof seg1.x === "undefined") continue;
      let tunnelColor = color(
        hue,
        finalSaturation,
        finalBrightness,
        slowMoActive ? 70 : 100
      );
      stroke(tunnelColor);
      line(seg1.x - seg1.w / 2, seg1.y, seg2.x - seg2.w / 2, seg2.y);
      line(seg1.x + seg1.w / 2, seg1.y, seg2.x + seg2.w / 2, seg2.y);
    }
  }

  // --- Update World State (Streak starts at 3 kills) ---
  function updateWorld() {
    if (!player) return;
    let effectiveSpeed = currentSpeed * (slowMoActive ? 0.5 : 1);
    if (slowMoActive && --slowMoTimer <= 0) slowMoActive = false;
    if (streakTimer > 0) {
      streakTimer -= slowMoActive ? 0.5 : 1;
      if (streakTimer <= 0) resetStreak();
    }
    if (streakNotificationTimer > 0) streakNotificationTimer--;
    // Update Tunnel & Score
    if (tunnel) {
      for (let i = tunnel.length - 1; i >= 0; i--) {
        let seg = tunnel[i];
        if (!seg || typeof seg.y === "undefined") {
          tunnel.splice(i, 1);
          continue;
        }
        seg.y += effectiveSpeed;
        if (seg.y > height + segmentHeight * 2) {
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
      if (tunnel.length === 0 || (tunnel[0] && tunnel[0].y > -segmentHeight))
        addTunnelSegment(
          tunnel.length > 0 && tunnel[0]
            ? tunnel[0].y - segmentHeight
            : -segmentHeight
        );
    }
    // Update Powerups
    if (powerUps)
      powerUps.forEach((pu, i) => {
        if (pu) {
          pu.update(effectiveSpeed);
          if (pu.y > height + 20) powerUps.splice(i, 1);
        } else powerUps.splice(i, 1);
      });
    // Update Enemies & Handle Kills
    if (enemies) {
      for (let i = enemies.length - 1; i >= 0; i--) {
        let enemy = enemies[i];
        if (!enemy || typeof enemy.update !== "function") {
          enemies.splice(i, 1);
          continue;
        }
        enemy.update();
        if (enemy.y > height + enemy.size * 2) {
          enemies.splice(i, 1);
        } else if (!enemy.isAlive()) {
          streakCount++;
          // <<< Streak multiplier starts after kill #2 (when streakCount becomes 3) >>>
          streakMultiplier = min(
            MAX_STREAK_MULTIPLIER,
            1.0 + max(0, streakCount - 2) * STREAK_MULTIPLIER_INCREMENT
          );
          streakTimer = MAX_STREAK_TIME;
          // <<< Streak notification starts at kill #3 >>>
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
        }
      }
    }
    // Update Projectiles & Collisions
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
            if (
              i < playerProjectiles.length &&
              playerProjectiles[i] === proj &&
              enemy &&
              proj.checkCollision(enemy)
            ) {
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
        if (
          i < enemyProjectiles.length &&
          enemyProjectiles[i] === proj &&
          player &&
          proj.checkCollision(player)
        ) {
          if (player.takeDamage)
            player.takeDamage(proj.damage, "ENEMY_PROJECTILE");
          enemyProjectiles.splice(i, 1);
        }
      }
    }
    // Player Collisions
    if (player) {
      player.checkEnemyCollision(enemies);
      player.checkPowerUpCollision(powerUps);
      let wallDamage = player.calculateWallDamage(tunnel);
      if (wallDamage > 0) player.takeDamage(wallDamage, "WALL");
    }
    // Speed Increase
    if (!slowMoActive) currentSpeed += speedIncrease;
    noiseOffset += noiseSpeed * (effectiveSpeed / baseSpeed);
  }

  // --- Reset Streak ---
  function resetStreak() {
    streakCount = 0;
    streakMultiplier = 1.0;
    streakTimer = 0;
    streakNotificationTimer = min(streakNotificationTimer, 15); // Fast fade
    streakNotificationText = ""; // Clear text
  }

  // --- Draw All Game Elements ---
  function drawGameElements() {
    drawTunnel();
    if (powerUps) powerUps.forEach((pu) => pu && pu.draw());
    if (playerProjectiles) playerProjectiles.forEach((p) => p && p.draw());
    if (enemyProjectiles) enemyProjectiles.forEach((ep) => ep && ep.draw());
    if (enemies) enemies.forEach((e) => e && e.draw());
    if (player) player.draw();
  }

  // --- Draw UI Elements ---
  function drawHealthBar() {
    if (!player) return;
    let barWidth = 200;
    let barHeight = 20;
    let barX = width / 2 - barWidth / 2;
    let barY = 20;
    let healthPercent = player.health / player.maxHealth;
    if (isNaN(healthPercent)) healthPercent = 0;
    rectMode(CORNER);
    noStroke();
    fill(0, 0, 20);
    rect(barX, barY, barWidth, barHeight, 5);
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
    fill(healthColor);
    rect(barX, barY, barWidth * constrain(healthPercent, 0, 1), barHeight, 5);
    fill(0, 0, 100);
    textSize(14);
    textAlign(CENTER, CENTER);
    text(
      `${ceil(player.health)} / ${ceil(player.maxHealth)}`,
      barX + barWidth / 2,
      barY + barHeight / 2 + 1
    );
  }
  function drawBoosterBar() {
    if (!player) return;
    let barWidth = 150;
    let barHeight = 12;
    let barX = width / 2 - barWidth / 2;
    let barY = 45;
    let boostPercent = player.boosterFuel / player.maxBoosterFuel;
    if (isNaN(boostPercent)) boostPercent = 0;
    rectMode(CORNER);
    noStroke();
    fill(0, 0, 20, 80);
    rect(barX, barY, barWidth, barHeight, 3);
    let boostColor = color(200, 80, 90);
    if (boostPickupFlashTimer > 0)
      boostColor = lerpColor(
        color(200, 50, 100),
        boostColor,
        boostPickupFlashTimer / BOOST_PICKUP_FLASH_DURATION
      );
    if (player.boosterRegenDelayTimer > 0 && !player.isBoosting)
      boostColor = lerpColor(boostColor, color(0, 0, 30), 0.5);
    fill(boostColor);
    rect(barX, barY, barWidth * constrain(boostPercent, 0, 1), barHeight, 3);
    fill(0, 0, 100, 80);
    textSize(10);
    textAlign(CENTER, CENTER);
    text(
      `BOOST ${ceil(player.boosterFuel)}/${ceil(player.maxBoosterFuel)}`,
      barX + barWidth / 2,
      barY + barHeight / 2 + 1
    );
  }
  function drawWeaponEnergyBar() {
    if (!player) return;
    let barWidth = 150;
    let barHeight = 12;
    let barX = width / 2 - barWidth / 2;
    let barY = 60;
    let energyPercent = player.weaponEnergy / player.maxWeaponEnergy;
    if (isNaN(energyPercent)) energyPercent = 0;
    rectMode(CORNER);
    noStroke();
    fill(0, 0, 20, 80);
    rect(barX, barY, barWidth, barHeight, 3);
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
    fill(energyColor);
    rect(barX, barY, barWidth * constrain(energyPercent, 0, 1), barHeight, 3);
    fill(0, 0, 100, 80);
    textSize(10);
    textAlign(CENTER, CENTER);
    text(
      `ENERGY ${ceil(player.weaponEnergy)}/${ceil(player.maxWeaponEnergy)}`,
      barX + barWidth / 2,
      barY + barHeight / 2 + 1
    );
  }
  function drawMissileUI() {
    if (!player) return;
    let startX = width - 30;
    let yPos = 55;
    fill(0, 0, 100);
    textSize(12);
    textAlign(RIGHT, CENTER);
    text(
      `MISSILES: ${player.missileAmmo}/${player.maxMissileAmmo}`,
      startX,
      yPos
    );
  }
  function drawUI() {
    if (!player) return;
    fill(0, 0, 100);
    noStroke();
    textSize(18);
    textAlign(LEFT, TOP);
    text(`SCORE: ${score}`, 20, 20);
    text(`SPEED: ${currentSpeed.toFixed(1)}`, 20, 45);
    text(
      `STAGE: ${floor(score / STAGE_SCORE_THRESHOLD) + 1} (${
        score % STAGE_SCORE_THRESHOLD
      }/${STAGE_SCORE_THRESHOLD})`,
      20,
      70
    );
    textAlign(RIGHT, TOP);
    text(`POINTS: ${upgradePoints}`, width - 20, 20);

    // Streak Display (Only show when streak is actually active, i.e., count >= 3)
    if (streakCount >= 3 && streakTimer > 0) {
      let streakHue = map(streakMultiplier, 1, MAX_STREAK_MULTIPLIER, 60, 0);
      let streakSize = 20 + streakMultiplier * 1.5;
      let pulseBrightness =
        80 +
        sin(frameCount * STREAK_PULSE_SPEED_FACTOR * 2 * streakMultiplier) * 20;
      fill(streakHue, 90, pulseBrightness);
      textSize(streakSize);
      text(`x${streakMultiplier.toFixed(1)}`, width - 20, 75);
      let timerWidth = 100 + streakMultiplier * 5;
      let timerHeight = 5 + streakMultiplier * 0.5;
      let timerX = width - 20 - timerWidth;
      let timerY = 80 + streakSize * 0.5;
      fill(0, 0, 20, 80);
      rectMode(CORNER);
      rect(timerX, timerY, timerWidth, timerHeight, 2);
      fill(streakHue, 90, 100);
      rect(
        timerX,
        timerY,
        timerWidth * (streakTimer / MAX_STREAK_TIME),
        timerHeight,
        2
      );
    }
    // Streak Notification
    if (streakNotificationTimer > 0 && streakNotificationText) {
      textAlign(CENTER, CENTER);
      let alpha = map(
        streakNotificationTimer,
        0,
        STREAK_NOTIFICATION_DURATION,
        0,
        100
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
      fill(notificationHue, 90, brightness, alpha);
      textSize(28 + streakMultiplier * 2);
      text(streakNotificationText, width / 2, height * 0.2);
    }

    if (slowMoActive) {
      fill(270, 80, 90);
      textSize(18);
      textAlign(RIGHT, TOP);
      text(`SLOW-MO [${ceil(slowMoTimer / 60)}s]`, width - 20, 45);
    }
    drawHealthBar();
    drawBoosterBar();
    drawWeaponEnergyBar();
    drawMissileUI();
  }

  // --- Draw Game State ---
  function drawGame() {
    try {
      background(0, 0, 5);
      if (player) player.update();
      updateWorld();
      drawGameElements();
      drawUI();
    } catch (error) {
      console.error("Error during game loop:", error);
      fill(255, 0, 0);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("Error in game loop. Check console.", width / 2, height / 2);
      if (typeof noLoop === "function") {
        try {
          noLoop();
        } catch (e) {}
      }
    }
  }

  // --- Draw Start Screen ---
  function drawStartScreen() {
    background(200, 80, 30);
    fill(0, 0, 100);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(48);
    text("TUNNEL RACER", width / 2, height * 0.1);
    textSize(20);
    text("Dodge Walls, Enemies, & Lasers!", width / 2, height * 0.18);
    if (player && typeof player.draw === "function") {
      let shipDisplayY = height * 0.3;
      player.draw(width / 2, shipDisplayY);
      textSize(14);
      text("(Your Current Ship)", width / 2, shipDisplayY + 35);
    }
    textSize(22);
    let controlY = height * 0.45;
    text("CONTROLS", width / 2, controlY);
    controlY += 35;
    textSize(16);
    textAlign(LEFT, CENTER);
    let controlX = width / 2 - 150;
    text("A / Left Arrow : Steer Left", controlX, controlY);
    controlY += 25;
    text("D / Right Arrow: Steer Right", controlX, controlY);
    controlY += 25;
    text("Shift          : Boost", controlX, controlY);
    controlY += 25;
    text("Spacebar       : Fire Laser", controlX, controlY);
    controlY += 25; // Updated key
    text("M              : Fire Missile", controlX, controlY);
    controlY += 25;
    textAlign(CENTER, CENTER);
    textSize(16);
    text(
      "Earn points from score, then press 'U' after Game Over to upgrade!",
      width / 2,
      height * 0.8
    );
    textSize(24);
    text("Press ENTER to Start", width / 2, height * 0.9); // Updated key
  }

  // --- Draw Game Over Screen ---
  function drawGameOverScreen() {
    background(0, 90, 50);
    fill(0, 0, 100);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(48);
    text("GAME OVER", width / 2, height / 2 - 120);
    textSize(32);
    text(`Final Score: ${lastScore}`, width / 2, height / 2 - 60);
    let pointsEarned = floor(lastScore * UPGRADE_POINT_CONVERSION_RATE);
    textSize(24);
    text(`Upgrade Points Earned: ${pointsEarned}`, width / 2, height / 2 - 20);
    text(
      `Total Upgrade Points: ${upgradePoints + pointsEarned}`,
      width / 2,
      height / 2 + 10
    );
    textSize(28);
    text("Press 'U' to Upgrade", width / 2, height / 2 + 70);
    textSize(24);
    text(
      "Press ENTER to Restart (without upgrading)",
      width / 2,
      height / 2 + 120
    ); // Updated key
  }

  // --- Draw Upgrade Screen ---
  function drawUpgradeScreen() {
    background(240, 50, 20);
    fill(0, 0, 100);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(36);
    text("SHIP UPGRADES", width / 2, 50);
    textSize(24);
    text(`Available Points: ${upgradePoints}`, width / 2, 100);
    let startY = 150;
    let spacingY = 55;
    let startX = width * 0.1;
    let colWidth = width * 0.8;
    let textX = startX + 20;
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
      if (key === "maxEnergy") baseValue = INITIAL_MAX_WEAPON_ENERGY;
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
      text(effectStr, textX + 300, currentY);
      let costX = startX + colWidth - 180;
      if (maxLevelReached) {
        fill(20, 80, 80);
        text("MAX LEVEL", costX, currentY);
      } else {
        if (upgradePoints >= upg.cost) fill(120, 80, 90);
        else fill(0, 80, 90);
        text(`Cost: ${upg.cost} pts`, costX, currentY);
      }
    }
    textAlign(CENTER, CENTER);
    textSize(20);
    text(
      "Press number keys (1-8) to purchase upgrades.",
      width / 2,
      height - 70
    );
    text(
      "Press 'B' to go Back or ENTER to Start New Game",
      width / 2,
      height - 40
    ); // Updated key
  }

  // --- Main Draw Loop ---
  function draw() {
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
    }
  }

  // --- Input Handling (Updated Keys) ---
  function keyPressed() {
    if (gameState === "PLAYING") {
      if (keyCode === 32) {
        if (player) player.fireLaser();
      } // SPACEBAR for Laser
      else if (keyCode === 77) {
        if (player) player.fireMissile();
      } // M for Missile
    } else if (gameState === "START") {
      if (keyCode === ENTER) {
        resetGame();
        gameState = "PLAYING";
      } // ENTER to Start
    } else if (gameState === "GAME_OVER") {
      if (keyCode === ENTER) {
        resetGame();
        gameState = "PLAYING";
      } // ENTER to Restart
      else if (keyCode === 85) {
        // U to Upgrade
        let pointsEarned = floor(lastScore * UPGRADE_POINT_CONVERSION_RATE);
        upgradePoints += pointsEarned;
        lastScore = 0;
        gameState = "UPGRADE";
      }
    } else if (gameState === "UPGRADE") {
      if (keyCode === 66) {
        gameState = "START";
      } // B to go Back to Start
      else if (keyCode === ENTER) {
        resetGame();
        gameState = "PLAYING";
      } // ENTER to Start New Game
      else {
        // Check number keys for purchasing upgrades
        let upgradeIndex = -1;
        if (keyCode >= 49 && keyCode <= 56) upgradeIndex = keyCode - 49; // 1-8
        else if (keyCode >= 97 && keyCode <= 104) upgradeIndex = keyCode - 97; // Numpad 1-8
        if (upgradeIndex >= 0 && upgradeIndex < upgradeKeys.length) {
          let key = upgradeKeys[upgradeIndex];
          let upg = upgrades[key];
          let maxLevelReached =
            upg.maxLevel !== undefined && upg.level >= upg.maxLevel;
          if (!maxLevelReached && upgradePoints >= upg.cost) {
            upgradePoints -= upg.cost;
            upg.level++;
            upg.cost = floor(upg.baseCost * pow(upg.scale, upg.level));
            if (player && player.resetStatsBasedOnUpgrades)
              player.resetStatsBasedOnUpgrades(); // Update player for start screen view
          }
        }
      }
    }
  }

  // --- Window Resize ---
  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    if (player) player.y = height - 50;
  }

  // --- Final Catch Block ---
} catch (error) {
  console.error("RUNTIME ERROR:", error);
  try {
    if (
      typeof background === "function" &&
      typeof fill === "function" &&
      typeof textSize === "function" &&
      typeof textAlign === "function" &&
      typeof text === "function" &&
      typeof width !== "undefined" &&
      typeof height !== "undefined"
    ) {
      background(0);
      fill(255, 0, 0);
      textSize(16);
      textAlign(CENTER, CENTER);
      text(
        `RUNTIME ERROR:\n${error.message}\nCheck console.`,
        width / 2,
        height / 2
      );
    } else {
      document.body.innerHTML = `<pre style="color:red; font-family:monospace; font-size: 14px; padding: 10px; background: #222;">RUNTIME ERROR:\n${
        error.stack || error.message
      }\n\nPlease check the browser console.</pre>`;
    }
  } catch (e) {
    console.error("Error during error display:", e);
    if (!document.body.innerHTML.includes("RUNTIME ERROR")) {
      document.body.innerHTML = `<pre style="color:red; font-family:monospace; font-size: 14px; padding: 10px; background: #222;">RUNTIME ERROR:\n${
        error.stack || error.message
      }\n\nPlease check the browser console.</pre>`;
    }
  }
  if (typeof noLoop === "function") {
    try {
      noLoop();
    } catch (noLoopError) {
      console.error("Error calling noLoop():", noLoopError);
    }
  }
}
