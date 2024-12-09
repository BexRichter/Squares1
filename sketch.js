let partikler = []; // Array til at holde partiklerne

function setup() {
  createCanvas(800, 800);
}

function draw() {
  let friktionsværdi = 0.22;
  let tyngdekraft = createVector(0.00, 3.32);
  let vind = createVector(0.00, 0.57);

  background(0);

  // Iterér gennem alle partikler
  for (let i = partikler.length - 1; i >= 0; i--) {
    let aktuelPartikel = partikler[i];

    aktuelPartikel.tjekKanter();

    let friktion = aktuelPartikel.hastighed.copy();
    friktion.mult(-1);
    if (aktuelPartikel.hastighed.mag() > 0) {
      friktion.normalize();
    }
    friktion.mult(friktionsværdi);
    aktuelPartikel.tilføjKraft(friktion);

    aktuelPartikel.tilføjKraft(tyngdekraft);
    aktuelPartikel.tilføjKraft(vind);

    aktuelPartikel.opdater();
    aktuelPartikel.vis();
  }

  // Hvis musen er trykket ned, tilføj nye partikler
  if (mouseIsPressed) {
    for (let i = 0; i < 9; i++) {
      partikler.push(new Partikel());
    }
  }
}

class Partikel {
  constructor() {
    this.position = createVector(mouseX, mouseY);
    this.hastighed = createVector(random(-2, 2), random(-3, 2));
    this.acceleration = createVector(0, 1);
    this.masse = 9.1;
    this.rotation = random(TWO_PI);

    // Tilfældig farve
    if (random(1) < 0.5) {
      this.farve = color(255, 46, 46);
    } else {
      this.farve = color(254, 11, 205);
    }

    // Tilfældig størrelse
    if (random(1) > 0.3) {
      this.størrelse = random(10, 30);
    } else if (random(1) < 0.7) {
      this.størrelse = random(40, 70);
    } else {
      this.størrelse = random(80, 120);
    }

    // Tilfældig form
    this.form = int(random(3)); // 0 = circle, 1 = rect, 2 = pentagon

    // Tilfældig rotationshastighed
    if (this.form === 2) { // Pentagoner
      this.rotationSpeed = random(-0.02, 0.02);
    } else {
      this.rotationSpeed = random(-0.01, 0.01);
    }
  }

  tilføjKraft(kraft) {
    let f = p5.Vector.div(kraft, this.masse);
    this.acceleration.add(f);
  }

  opdater() {
    this.hastighed.add(this.acceleration);
    this.position.add(this.hastighed);
    this.acceleration.mult(0); // Nulstil acceleration
    this.rotation += this.rotationSpeed; // Opdater rotation
  }

  vis() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.rotation); // Roter formen
    noFill();
    stroke(this.farve);
    strokeWeight(0.5);

    if (this.form === 0) {
      circle(0, 0, this.størrelse); // Cirkel
    } else if (this.form === 1) {
      rectMode(CENTER);
      rect(0, 0, this.størrelse, this.størrelse); // Rektangel
    } else if (this.form === 2) {
      this.drawPentagon(0, 0, this.størrelse / 2); // Pentagon
    }

    pop();
  }

  drawPentagon(x, y, radius) {
    beginShape();
    for (let i = 0; i < 5; i++) {
      let angle = TWO_PI / 5 * i;
      let px = x + cos(angle) * radius;
      let py = y + sin(angle) * radius;
      vertex(px, py);
    }
    endShape(CLOSE);
  }

  tjekKanter() {
    if (this.position.x < this.størrelse / 2) { // Venstre kant
      this.hastighed.x *= -1;
      this.position.x = this.størrelse / 2;
      this.rotationSpeed += random(-0.05, 0.05);
    }

    if (this.position.x > width - this.størrelse / 2) { // Højre kant
      this.position.x = width - this.størrelse / 2;
      this.hastighed.x *= -1;
      this.rotationSpeed += random(-0.05, 0.05);
    }

    if (this.position.y > height - this.størrelse / 2) { // Gulv
      this.hastighed.y *= -0.54;
      this.position.y = height - this.størrelse / 2;
      this.rotationSpeed *= 0.95;
      if (abs(this.rotationSpeed) < 0.01) {
        this.rotationSpeed = 0;
      }
    }

    if (this.position.y < this.størrelse / 2) { // Loft
      this.hastighed.y *= -1;
      this.position.y = this.størrelse / 2;
      this.rotationSpeed += random(-0.05, 0.05);
    }

    // Begræns rotation
    this.rotationSpeed = constrain(this.rotationSpeed, -1, 1);
  }
}
