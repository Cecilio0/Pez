import { createFish, moveFish, rotateEyes } from './fishFunctions.js';

paper.setup("fishCanvas");
console.log("start");

var mousePosition = new paper.Point(0, 0);

paper.view.onMouseMove = function (event) {
  mousePosition = event.point;
};

var numFish = 30;
var fishes = [];

for (let i = 0; i < numFish; i++) {
  fishes.push(createFish(new paper.Point(200 + i * 200, 200)));
}

var fishSpeed = 1;
var previousFishRotations = new Array(numFish).fill(0);
var eyeRotations = new Array(numFish).fill(0);
var tailSwingDirections = new Array(numFish).fill(1);
var fishTailAxes = new Array(numFish);

paper.view.onFrame = function (event) {
  for (let i = 0; i < numFish; i++) {
    moveFish(fishes[i], fishes, mousePosition, fishSpeed);
    
    let vector = mousePosition.subtract(fishes[i].position);
    let unitVector = vector.normalize();
    let currentFishRotation = unitVector.angle;
    fishes[i].rotation = currentFishRotation - previousFishRotations[i];
    eyeRotations[i] = previousFishRotations[i] - currentFishRotation;
    previousFishRotations[i] = currentFishRotation;
    rotateEyes(fishes[i], eyeRotations[i]);

    if (event.count % 10 === 0) {
      fishTailAxes[i] = unitVector.multiply(40);
      fishes[i].children[1].rotate(
        tailSwingDirections[i] * 15,
        fishes[i].children[0].position.subtract(fishTailAxes[i])
      );
      tailSwingDirections[i] *= -1;
    }

    if (fishes[i].bounds.left > paper.view.bounds.width) {
      fishes[i].position.x = -fishes[i].bounds.width;
    }
  }
};
