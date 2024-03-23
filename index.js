let history = [];
let historyIndex = -1;

const colorPicker = document.getElementById('colorPicker');
const canvasColor = document.getElementById('canvasColor');
const canvas = document.getElementById('myCanvas');
const clearButton = document.getElementById('clearButton');
const saveButton = document.getElementById('saveButton');
const fontSizePicker = document.getElementById('fontSizePicker');
const ctx = canvas.getContext('2d');
const textInput = document.getElementById('textInput');
const submitButton = document.getElementById('submitText');
const rotationInput = document.getElementById('rotationInput');
const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

colorPicker.addEventListener('change', (event) => {
    ctx.fillStyle = event.target.value;
    ctx.strokeStyle = event.target.value;
});

canvasColor.addEventListener('change', (event) => {
    ctx.fillStyle = event.target.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

clearButton.addEventListener('click', () => {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    history = [];
    historyIndex = -1;
});

saveButton.addEventListener('click', () => {
    localStorage.setItem('canvasContents', canvas.toDataURL());
    let link = document.createElement('a');
    link.download = 'my-canvas.png';
    link.href = canvas.toDataURL();
    link.click();
});

fontSizePicker.addEventListener('change', (event) => {
    ctx.lineWidth = event.target.value;
});

submitButton.addEventListener('click', () => {
    const name = textInput.value;
    if (name.trim() !== '') {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Set font properties
        ctx.font = `${fontSizePicker.value}px Arial`;
        ctx.fillStyle = colorPicker.value;
        // Calculate text position
        const textX = canvas.width / 2 - ctx.measureText(name).width / 2;
        const textY = canvas.height / 2;
        // Draw text
        ctx.fillText(name, textX, textY);

        // Capture canvas state for undo
        addToHistory();
    }
});

function addToHistory() {
    // If there are redo actions, clear them
    if (historyIndex < history.length - 1) {
        history.splice(historyIndex + 1);
    }
    // Add current state to history
    history.push(canvas.toDataURL());
    historyIndex = history.length - 1;
}

canvas.addEventListener('mousedown', (event) => {
    isDrawing = true;
    lastX = event.offsetX;
    lastY = event.offsetY;
});

canvas.addEventListener('mousemove', (event) => {
    if (isDrawing) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.strokeStyle = colorPicker.value;
        ctx.lineWidth = fontSizePicker.value;
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        lastX = event.offsetX;
        lastY = event.offsetY;
    }
});

canvas.addEventListener('mouseup', () => {
    if (isDrawing) {
        isDrawing = false;
        addToHistory();
    }
});

canvas.addEventListener('mouseout', () => {
    if (isDrawing) {
        isDrawing = false;
        addToHistory();
    }
});

undoButton.addEventListener('click', () => {
    if (historyIndex > 0) {
        historyIndex--;
        const img = new Image();
        img.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        }
        img.src = history[historyIndex];
    }
});

redoButton.addEventListener('click', () => {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        const img = new Image();
        img.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        }
        img.src = history[historyIndex];
    }
});

rotationInput.addEventListener('change', () => {
    const rotationAngle = parseInt(rotationInput.value);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotationAngle * Math.PI / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    redrawText();
    ctx.restore();
});

function redrawText() {
    const name = textInput.value;
    if (name.trim() !== '') {
        ctx.font = `${fontSizePicker.value}px Arial`;
        ctx.fillStyle = colorPicker.value;
        const textX = canvas.width / 2 - ctx.measureText(name).width / 2;
        const textY = canvas.height / 2;
        ctx.fillText(name, textX, textY);
    }
}
