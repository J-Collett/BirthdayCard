const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const frame = new Image();
frame.src = 'assets/BirthdayFrame_2025.png';

let userPhoto = null;
let userPhotoPosition = { x: 0, y: 0, scale: 1 };

let nameTextPosition = { x: 460, y: 865 };
let isDraggingName = false;
let isDraggingPhoto = false;

canvas.addEventListener('mousedown', e => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (
    mouseX >= nameTextPosition.x &&
    mouseX <= nameTextPosition.x + 505 &&
    mouseY >= nameTextPosition.y &&
    mouseY <= nameTextPosition.y + 60
  ) {
    isDraggingName = true;
  } else {
    isDraggingPhoto = true;
  }
});

canvas.addEventListener('mouseup', () => {
  isDraggingName = false;
  isDraggingPhoto = false;
});

canvas.addEventListener('mousemove', e => {
  if (!isDraggingName && !isDraggingPhoto) return;
  const movementX = e.movementX;
  const movementY = e.movementY;

  if (isDraggingName) {
    nameTextPosition.x += movementX;
    nameTextPosition.y += movementY;
  } else if (isDraggingPhoto && userPhoto) {
    userPhotoPosition.x += movementX;
    userPhotoPosition.y += movementY;
  }
  drawCanvas();
});

document.getElementById('photoUpload').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (event) {
    userPhoto = new Image();
    userPhoto.onload = drawCanvas;
    userPhoto.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

document.getElementById('generate').addEventListener('click', () => {
  document.fonts.ready.then(drawCanvas);
});

document.getElementById('download').addEventListener('click', function () {
  const dataURL = canvas.toDataURL('image/jpeg', 0.92);
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'angler-birthday.jpg'; // ✅ This triggers direct .jpg download
  link.click();
});

document.getElementById('zoom').addEventListener('input', function () {
  userPhotoPosition.scale = parseFloat(this.value);
  drawCanvas();
});

document.getElementById('dateY').addEventListener('input', drawCanvas);
document.getElementById('nameY').addEventListener('input', function () {
  nameTextPosition.y = parseInt(this.value);
  drawCanvas();
});
document.getElementById('nameX').addEventListener('input', function () {
  nameTextPosition.x = parseInt(this.value);
  drawCanvas();
});
document.getElementById('fontSize').addEventListener('input', drawCanvas);
document.getElementById('manualFont').addEventListener('change', drawCanvas);

function drawCanvas() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (userPhoto) {
    const { x, y, scale } = userPhotoPosition;
    const photoW = userPhoto.width * scale;
    const photoH = userPhoto.height * scale;
    ctx.drawImage(userPhoto, x, y, photoW, photoH);
  }

  ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

  const dateText = document.getElementById('dateInput').value.toUpperCase();
  const dateY = parseInt(document.getElementById('dateY').value);
  ctx.font = '400 32px "Fira Sans"';
  ctx.fillStyle = '#C8102E';
  ctx.textAlign = 'center';
  ctx.fillText(dateText, canvas.width / 2, dateY);

  const nameText = document.getElementById('nameInput').value.toUpperCase();
  const manualFont = document.getElementById('manualFont').checked;
  const fontSize = parseInt(document.getElementById('fontSize').value);
  if (manualFont) {
    ctx.font = `italic 700 ${fontSize}px "Fira Sans"`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(nameText, nameTextPosition.x, nameTextPosition.y + fontSize);
  } else {
    drawFitText(nameText, nameTextPosition.x, nameTextPosition.y, 505, 60, 'italic 700', '"Fira Sans"', '#ffffff');
  }
}

function drawFitText(text, x, y, maxWidth, maxHeight, fontStyle, fontFamily, color) {
  let fontSize = maxHeight;
  while (fontSize > 10) {
    ctx.font = `${fontStyle} ${fontSize}px ${fontFamily}`;
    const metrics = ctx.measureText(text);
    if (metrics.width <= maxWidth && fontSize <= maxHeight) break;
    fontSize--;
  }
  ctx.fillStyle = color;
  ctx.textAlign = 'left';
  ctx.fillText(text, x, y + fontSize);
}
