paper.install(window); // Hace accesible Paper.js en el contexto global

window.onload = function () {
  paper.setup(document.getElementById("miCanvas"));
  // Aquí puedes empezar a dibujar
  var center = paper.view.center;
  var fishBody = new paper.Path.Ellipse({
    center: center,
    radius: [80, 30],
    fillColor: "lightblue",
  });

  var fishTail = new paper.Path({
    segments: [
      [center.x - 80, center.y],
      [center.x - 110, center.y - 20],
      [center.x - 110, center.y + 20],
    ],
    fillColor: "lightblue",
    closed: true,
  });

  var fishEye = new paper.Path.Circle({
    center: [center.x + 50, center.y - 10],
    radius: 5,
    fillColor: "black",
  });
  var fish = new paper.Group([fishBody, fishTail, fishEye]);

  // Movimiento y rotación del pez
  fish.position.x += 2;
  fish.rotate(2);

  // Restablecer posición si sale de la pantalla
  if (fish.bounds.left > paper.view.bounds.width) {
    fish.position.x = -fish.bounds.width;
  }
};
