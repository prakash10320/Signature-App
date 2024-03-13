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

colorPicker.addEventListener('change', (event) => {
    ctx.fillStyle = event.target.value;
    ctx.strokeStyle = event.target.value;
});

canvasColor.addEventListener('change', (event) => {
    ctx.fillStyle = event.target.value;
    ctx.fillRect(0, 0, 800, 500);
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
        history.push(canvas.toDataURL()); // Add current state to history
        historyIndex = history.length - 1; // Update history index
    }
});

retrieveButton.addEventListener('click', () => {
    let savedCanvas = localStorage.getItem('canvasContents');
    if (savedCanvas) {
        let img = new Image();
        img.src = savedCanvas;
        ctx.drawImage(img, 0, 0);
    }
});

let isDrawing = false;
let lastX = 0;
let lastY = 0;

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

        // Capture canvas state for undo
        history.push(canvas.toDataURL()); // Add current state to history
        historyIndex = history.length - 1; // Update history index
    }
});

canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

canvas.addEventListener('mouseup', () => {
    if (isDrawing) {
        // Capture canvas state for undo
        history.push(canvas.toDataURL()); // Add current state to history
        historyIndex = history.length - 1; // Update history index
    }
    isDrawing = false;
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
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Set font properties
    ctx.font = `${fontSizePicker.value}px Arial`;
    ctx.fillStyle = colorPicker.value;
    // Calculate text position
    const textX = canvas.width / 2 - ctx.measureText(textInput.value).width / 2;
    const textY = canvas.height / 2;
    // Save the current transformation matrix
    ctx.save();
    // Translate to the center of the canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);
    // Rotate the canvas
    ctx.rotate(rotationAngle * Math.PI / 180);
    // Draw text
    ctx.fillText(textInput.value, -ctx.measureText(textInput.value).width / 2, fontSizePicker.value / 2);
    // Restore the previous transformation matrix
    ctx.restore();
});
