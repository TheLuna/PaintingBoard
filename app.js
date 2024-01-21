const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const lineWidth = document.getElementById("line-width");
const color = document.getElementById("color");
const colorOptions = Array.from(
  document.getElementsByClassName("color-option")
);
const destroyBtn = document.getElementById("destroy-btn");
const eraseBtn = document.getElementById("eraser-btn");
const fileInput = document.getElementById("file");
const textInput = document.getElementById("text");
const saveBtn = document.getElementById("save");
const fontSize = document.getElementById("font-size");
const fonts = Array.from(document.getElementsByClassName("font"));
const btnFontFill = document.getElementById("btn-fontFill");
const btnFontStroke = document.getElementById("btn-fontStroke");
const randomColor = document.getElementById("randomColor");
const brushModes = Array.from(document.getElementsByClassName("brushMode"));
let isPainting = false;
let isFontFilling = true;
const FILL = 1;
const DRAW = 2;
const PAINT = 3;
const ERASE = 4;
let brushMode = DRAW;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round";
let font = "serif";
const fontWeight = "bold";

onFontLoad();

async function onFontLoad() {
  fonts.forEach((x) => {
    if (x.dataset.url != null && x.dataset.url != "") {
      const f = new FontFace(`${x.dataset.font})`, `url(${x.dataset.url})`);
      f.load().then(document.fonts.add(f));
    }
  });
}

function onMove(event) {
  if (isPainting && brushMode != PAINT) {
    ctx.lineTo(event.offsetX, event.offsetY);
    if (brushMode == ERASE) {
      ctx.save();
      ctx.strokeStyle = "white";
      ctx.stroke();
      ctx.restore();
    } else {
      ctx.stroke();
    }
    return;
  }
  ctx.beginPath();
  ctx.moveTo(event.offsetX, event.offsetY);
}

function startPainting() {
  isPainting = true;
}

function cancelPainting() {
  isPainting = false;
  if (brushMode == FILL) ctx.fill();
}

function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
}

function onColorChange(event) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}

function onColorClick(event) {
  const colorValue = event.target.dataset.color;
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue;
}

function onBrushChange(event) {
  brushModes.forEach((brush) => brush.classList.remove("active"));
  event.target.classList.add("active");
  brushMode = event.target.dataset.brushmode;
}

function onCanvasClick() {
  if (brushMode == PAINT) ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onDestroyClick() {
  if (window.confirm("Are you sure to destroy the canvas?")) {
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.restore();
  }
}

function onFileChange(event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.src = url;
  image.onload = function () {
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };
}

function onDoubleClick(event) {
  const text = textInput.value;

  if (text !== "") {
    ctx.save();
    ctx.font = `${fontWeight} ${fontSize.value}px ${font}`;
    if (isFontFilling) ctx.fillText(text, event.offsetX, event.offsetY);
    else ctx.strokeText(text, event.offsetX, event.offsetY);
    ctx.restore();
  }
}

function onSaveClick() {
  const url = canvas.toDataURL();
  const a = document.createElement("a");
  a.href = url;
  a.download = "myDrawing.png";
  a.click();
}

function onFontModeClick() {
  if (isFontFilling) {
    isFontFilling = false;
    btnFontFill.classList.remove("active");
    btnFontStroke.classList.add("active");
  } else {
    isFontFilling = true;
    btnFontFill.classList.add("active");
    btnFontStroke.classList.remove("active");
  }
}

function onFontChange(event) {
  font = event.target.dataset.font;
  fonts.forEach((font) => font.classList.remove("active"));
  event.target.classList.add("active");
}

function getRandomColor() {
  const randomColor =
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
      .toUpperCase();
  color.value = randomColor;
  ctx.strokeStyle = randomColor;
  ctx.fillStyle = randomColor;
}

canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("click", onCanvasClick);
canvas.addEventListener("dblclick", onDoubleClick);
lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);
colorOptions.forEach((color) => color.addEventListener("click", onColorClick));
brushModes.forEach((brush) => brush.addEventListener("click", onBrushChange));
destroyBtn.addEventListener("click", onDestroyClick);
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);
fonts.forEach((font) => font.addEventListener("click", onFontChange));
btnFontFill.addEventListener("click", onFontModeClick);
btnFontStroke.addEventListener("click", onFontModeClick);
randomColor.addEventListener("click", getRandomColor);
