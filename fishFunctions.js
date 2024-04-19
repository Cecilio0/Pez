export function createFish(position) {
  var fishBody = new paper.Path.Ellipse({
    center: position,
    radius: [40, 15],
    fillColor: "fuchsia",
  });

  var fishTail = new paper.Path({
    segments: [
      [position.x - 40, position.y],
      [position.x - 60, position.y - 15],
      [position.x - 60, position.y + 15],
    ],
    fillColor: "fuchsia",
    closed: true,
  });

  var fishOuterEye = new paper.Path.Circle({
    center: [position.x + 25, position.y - 5],
    radius: 5,
    fillColor: "white",
  });

  var fishInnerEye = new paper.Path.Circle({
    center: [position.x + 25, position.y - 3],
    radius: 2.5,
    fillColor: "black",
  });

  var fishEye = new paper.Group([fishOuterEye, fishInnerEye]);

  var fishHat = new paper.Path({
    segments: [
      [position.x + 20, position.y - 15],
      [position.x + 20, position.y - 20],
      [position.x + 7.5, position.y - 20],
      [position.x + 7.5, position.y - 35],
      [position.x - 7.5, position.y - 35],
      [position.x - 7.5, position.y - 20],
      [position.x - 20, position.y - 20],
      [position.x - 20, position.y - 15],
    ],
    fillColor: "black",
    closed: true,
  });

  var fish = new paper.Group([fishBody, fishTail, fishEye, fishHat]);
  fish.pivot = fish.children[0].position;

  return fish;
}
  
//------------------------------------

// Calculer la force d'alignement
function calculateAlignmentForce(fish, targetPosition) {
  let alignmentForce = targetPosition.subtract(fish.position);
  return alignmentForce.normalize();
}

// Calculer la force de séparation
function calculateSeparationForce(fish, allFishes) {
  let separationForce = new paper.Point();
  let count = 0;

  for (let otherFish of allFishes) {
    if (otherFish !== fish && otherFish.position.getDistance(fish.position) < 60) {
      let awayVector = fish.position.subtract(otherFish.position);
      separationForce = separationForce.add(awayVector);
      count++;
    }
  }

  if (count > 0) {
    separationForce = separationForce.divide(count);
  }

  return separationForce.normalize();
}

// Calculer la force de cohésion
function calculateCohesionForce(fish, allFishes) {
  let centerOfMass = new paper.Point();
  let count = 0;

  for (let otherFish of allFishes) {
    if (otherFish !== fish && otherFish.position.getDistance(fish.position) < 100) {
      centerOfMass = centerOfMass.add(otherFish.position);
      count++;
    }
  }

  if (count > 0) {
    centerOfMass = centerOfMass.divide(count);
    let cohesionForce = centerOfMass.subtract(fish.position);
    return cohesionForce.normalize();
  } else {
    return new paper.Point();
  }
}

// Fonction pour gérer le mouvement des poissons selon les forces des boids de Reynolds
export function moveFish(fish, allFishes, targetPosition, speed) {
  let alignmentForce = calculateAlignmentForce(fish, targetPosition);
  let separationForce = calculateSeparationForce(fish, allFishes);
  let cohesionForce = calculateCohesionForce(fish, allFishes);

  console.log("Alignment force:", alignmentForce);
  console.log("Separation force:", separationForce);
  console.log("Cohesion force:", cohesionForce);

  let combinedForce = alignmentForce.add(separationForce.multiply(10)).add(cohesionForce.multiply(0.5));

  console.log("Combined force:", combinedForce);

  fish.position = fish.position.add(combinedForce.normalize(speed));
}
/**/

/*
export function moveFish(fish, targetPosition, speed) {
  let vector = targetPosition.subtract(fish.position);
  if (vector.length > 40) {
    fish.position = fish.position.add(vector.normalize(speed));
  }
}
/**/

export function rotateEyes(fish, eyeRotation) {
  fish.children[2].children[1].rotate(
    eyeRotation,
    fish.children[2].position
  );
}
  