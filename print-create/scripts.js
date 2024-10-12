document.getElementById("generatePDF").addEventListener("click", createPDF);
document.getElementById("fontSelection").addEventListener("change", toggleFontFileInput);

const draggables = document.querySelectorAll(".draggable");

draggables.forEach(draggable => {
    draggable.addEventListener("mousedown", startDrag);
});

let offsetX, offsetY, currentElement, customFontData;

function startDrag(e) {
    currentElement = e.target;
    offsetX = e.clientX - currentElement.offsetLeft;
    offsetY = e.clientY - currentElement.offsetTop;
    document.addEventListener("mousemove", dragElement);
    document.addEventListener("mouseup", stopDrag);
}

function dragElement(e) {
    currentElement.style.left = `${e.clientX - offsetX}px`;
    currentElement.style.top = `${e.clientY - offsetY}px`;
}

function stopDrag() {
    document.removeEventListener("mousemove", dragElement);
    document.removeEventListener("mouseup", stopDrag);
}

function toggleFontFileInput() {
    const fontSelection = document.getElementById("fontSelection").value;
    const fontFileInput = document.getElementById("fontFile");
    const fontFileLabel = document.getElementById("fontFileLabel");

    if (fontSelection === "custom") {
        fontFileInput.style.display = "block";
        fontFileLabel.style.display = "block";
        fontFileInput.addEventListener("change", loadFont);
    } else {
        fontFileInput.style.display = "none";
        fontFileLabel.style.display = "none";
        customFontData = null;
    }
}

function loadFont(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        opentype.load(e.target.result, function(err, font) {
            if (err) {
                alert("フォントの読み込みに失敗しました。");
            } else {
                customFontData = font;
            }
        });
    };
    reader.readAsArrayBuffer(file);
}

function createPDF() {
    const { jsPDF } = window.jspdf;

    // PDFのサイズと向きを取得
    const pdfSize = document.getElementById("size").value;
    const pdfOrientation = document.getElementById("orientation").value;

    // jsPDFインスタンスを作成（サイズと向きを指定）
    const doc = new jsPDF({
        orientation: pdfOrientation,
        unit: 'mm',
        format: pdfSize
    });

    // ドラッグ可能な要素の位置を取得
    const textBox = document.getElementById("textBox");
    const textPosX = textBox.offsetLeft * 0.264583; // pxをmmに変換
    const textPosY = textBox.offsetTop * 0.264583;

    // フォント選択に基づいてフォントを設定
    const fontSelection = document.getElementById("fontSelection").value;
    if (fontSelection === "custom" && customFontData) {
        // オリジナルフォントを使ってテキストを描画
        const path = customFontData.getPath(textBox.innerText, textPosX, textPosY, 12); // 12ptのフォントサイズ
        const commands = path.commands;
        commands.forEach(function(cmd) {
            if (cmd.type === 'M') {
                doc.moveTo(cmd.x, cmd.y);
            } else if (cmd.type === 'L') {
                doc.lineTo(cmd.x, cmd.y);
            } else if (cmd.type === 'Q') {
                doc.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
            }
        });
        doc.closePath();
        doc.fill();
    } else {
        // 基本フォントを使ってテキストを描画
        doc.text(textBox.innerText, textPosX, textPosY);
    }

    // PDFをファイル名で保存（デフォルトのファイル名を設定）
    const title = document.getElementById("title").value || '教材プリント';
    doc.save(`${title}.pdf`);
}
