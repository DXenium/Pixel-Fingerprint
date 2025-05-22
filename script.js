const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");
const pixelSize = 8;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const pixelsPerRow = canvasWidth / pixelSize; // 256 / 8 = 32

const fieldColors = {
    type: "#70d6ff",
    name: "#ff70a6",
    age: "#ff0a54",
    skills: "#ff9770",
    date: "#bfd200"
};

// Функция для получения текущей даты в формате DD.MM.YYYY
function getCurrentDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}.${month}.${year}`;
}

function stringToBinary(str) {
    return [...str].map(char => {
        const bin = char.charCodeAt(0).toString(2);
        return bin.padStart(8, '0'); // 8 бит
    });
}

function drawPixel(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
}

function drawDataMatrix(data) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    const binaryMatrix = [];
    const fullBinary = [];

    Object.entries(data).forEach(([key, value]) => {
        const color = fieldColors[key];
        const binaries = stringToBinary(value);
        binaries.forEach(bin => {
            fullBinary.push({ bits: bin, color });
        });
    });

    let x = 0, y = 0;
    fullBinary.forEach(({ bits, color }) => {
        for (let i = 0; i < bits.length; i++) {
            const bit = bits[i];
            const drawColor = bit === '1' ? color : "#ffffff";
            drawPixel(x, y, drawColor);

            if (!binaryMatrix[y]) binaryMatrix[y] = [];
            binaryMatrix[y][x] = bit;

            x++;
            if (x >= pixelsPerRow) {
                x = 0;
                y++;
            }
        }
    });

    // Контрольная сумма (в последней строке)
    const checksumY = y;
    for (let col = 0; col < pixelsPerRow; col++) {
        let columnBits = "";
        for (let row = 0; row < binaryMatrix.length; row++) {
            columnBits += binaryMatrix[row][col] || "0";
        }
        const columnValue = parseInt(columnBits, 2);
        const checksumBit = columnValue % 2 === 0 ? "1" : "0";
        const checksumColor = checksumBit === "1" ? "#000000" : "#ffffff";
        drawPixel(col, checksumY, checksumColor);
    }
}

document.getElementById("dataForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
        type: document.getElementById("type").value.padEnd(32, " ").slice(0, 32),
        name: document.getElementById("name").value.padEnd(16, " ").slice(0, 16),
        age: document.getElementById("age").value.padEnd(2, " ").slice(0, 2),
        skills: document.getElementById("skills").value.padEnd(64, " ").slice(0, 64),
        date: document.getElementById("date").value.padEnd(10, " ").slice(0, 10)
    };

    drawDataMatrix(data);
});

// Рендерим по умолчанию при загрузке
window.addEventListener("load", () => {
    const defaultData = {
        type: "Junior Frontend Developer".padEnd(32, " ").slice(0, 32),
        name: "Kseniya".padEnd(16, " ").slice(0, 16),
        age: "38".padEnd(2, " ").slice(0, 2),
        skills: "HTML, CSS, JavaScript, CMS, Git, SCSS, PUG, GSAP".padEnd(64, " ").slice(0, 64),
        date: getCurrentDate().padEnd(10, " ").slice(0, 10)
    };

    drawDataMatrix(defaultData);
});
