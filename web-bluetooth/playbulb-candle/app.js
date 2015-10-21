var currentColor = [255, 255, 255]; // White by default.

document.querySelector('#connect').addEventListener('click', function() {
  playbulbCandle.connect()
  .then(() => {
    document.querySelector('#state').classList.add('connected');
    return Promise.all([
      playbulbCandle.getDeviceName().then(handleDeviceName),
      playbulbCandle.getBatteryLevel().then(handleBatteryLevel),
    ]);
  })
  .catch(error => {
    // TODO: Replace with toast when snackbar lands.
    console.error('Argh!', error);
  });
});

function handleDeviceName(deviceName) {
  document.querySelector('#deviceName').value = deviceName;
}

function handleBatteryLevel(batteryLevel) {
  document.querySelector('#batteryLevel').textContent = batteryLevel + '%';
}

/* Device name */

document.querySelector('#deviceName').addEventListener('input', function() {
  playbulbCandle.setDeviceName(this.value)
  .catch(error => {
    console.error('Argh!', error);
  });
});

/* Color picker */

var img = new Image();
if (window.location.hash.substr(1) === 'cds') {
  img.src = 'chrome-logo.png'
} else {
  img.src = 'color-wheel.png'
}
img.onload = function() {
  var canvas = document.querySelector('canvas');
  var context = canvas.getContext('2d');

  canvas.width = 300 * devicePixelRatio;
  canvas.height = 300 * devicePixelRatio;
  canvas.style.width = "300px";
  canvas.style.height = "300px";
  canvas.addEventListener('click', function(evt) {
    var rect = canvas.getBoundingClientRect();
    var x = (evt.clientX - rect.left) * devicePixelRatio;
    var y = (evt.clientY - rect.top) * devicePixelRatio;
    var data = context.getImageData(0, 0, canvas.width, canvas.height).data;

    var r = data[((canvas.width * y) + x) * 4];
    var g = data[((canvas.width * y) + x) * 4 + 1];
    var b = data[((canvas.width * y) + x) * 4 + 2];

    currentColor = [r,g,b];
    changeColor();
  });

  context.drawImage(img, 0, 0, canvas.width, canvas.height);
}

/* Color effects */

document.querySelector('#noEffect').addEventListener('click', changeColor);
document.querySelector('#candleEffect').addEventListener('click', changeColor);
document.querySelector('#flashing').addEventListener('click', changeColor);
document.querySelector('#pulse').addEventListener('click', changeColor);
document.querySelector('#rainbow').addEventListener('click', changeColor);
document.querySelector('#rainbowFade').addEventListener('click', changeColor);

function changeColor() {
  var effect = document.querySelector('[name="effectSwitch"]:checked').id;
  if (!effect.startsWith('rainbow')) {
    var r = currentColor[0];
    var g = currentColor[1];
    var b = currentColor[2];
  }
  switch(effect) {
    case 'noEffect':
      playbulbCandle.setColor(r, g, b).then(onColorChanged);
      break;
    case 'candleEffect':
      playbulbCandle.setCandleEffectColor(r, g, b).then(onColorChanged);
      break;
    case 'flashing':
      playbulbCandle.setFlashingColor(r, g, b).then(onColorChanged);
      break;
    case 'pulse':
      playbulbCandle.setPulseColor(r, g, b).then(onColorChanged);
      break;
    case 'rainbow':
      playbulbCandle.setRainbow().then(onColorChanged);
      break;
    case 'rainbowFade':
      playbulbCandle.setRainbowFade().then(onColorChanged);
      break;
  }
}

function onColorChanged(rgb) {
  if (rgb) {
    console.log('Color changed to ' + rgb);
    currentColor = rgb;
  } else {
    console.log('Color changed');
  }
}

