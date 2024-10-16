// SVGキャンバスの取得
const svgCanvas = document.getElementById("svgCanvas");
const drawButton = document.getElementById("drawButton");
const saveButton = document.getElementById("saveButton");
const shapeSelect = document.getElementById("shape");
const parametersDiv = document.getElementById("parameters");

// SVGキャンバスをクリアする関数
function clearCanvas() {
    while (svgCanvas.firstChild) {
        svgCanvas.removeChild(svgCanvas.firstChild);
    }
}

// 図形に応じてパラメータ入力フィールドを表示
shapeSelect.addEventListener("change", function () {
    parametersDiv.innerHTML = '';  // フィールドをクリア
    const selectedShape = shapeSelect.value;

    switch (selectedShape) {
        case "point":
            createInputField("x", "X座標");
            createInputField("y", "Y座標");
            break;
        case "line":
        case "ray":
        case "lineSegment":
            createInputField("x1", "始点X座標");
            createInputField("y1", "始点Y座標");
            createInputField("x2", "終点X座標");
            createInputField("y2", "終点Y座標");
            break;
        case "triangle":
        case "isoscelesTriangle":
        case "rightTriangle":
        case "obtuseTriangle":
            createInputField("x1", "頂点1 X座標");
            createInputField("y1", "頂点1 Y座標");
            createInputField("x2", "頂点2 X座標");
            createInputField("y2", "頂点2 Y座標");
            createInputField("x3", "頂点3 X座標");
            createInputField("y3", "頂点3 Y座標");
            break;
        case "parallelogram":
            createInputField("x", "左下 X座標");
            createInputField("y", "左下 Y座標");
            createInputField("base", "底辺の長さ");
            createInputField("side", "側面の長さ");
            createInputField("angle", "内角（度）");
            break;
        case "rhombus":
        case "square":
            createInputField("x", "左上 X座標");
            createInputField("y", "左上 Y座標");
            createInputField("side", "辺の長さ");
            break;
        case "trapezoid":
            createInputField("x", "左下 X座標");
            createInputField("y", "左下 Y座標");
            createInputField("base1", "下底");
            createInputField("base2", "上底");
            createInputField("height", "高さ");
            break;
        case "rectangle":
            createInputField("x", "左上 X座標");
            createInputField("y", "左上 Y座標");
            createInputField("width", "幅");
            createInputField("height", "高さ");
            break;
        case "circle":
            createInputField("cx", "中心X座標");
            createInputField("cy", "中心Y座標");
            createInputField("radius", "半径");
            break;
        case "ellipse":
            createInputField("cx", "中心X座標");
            createInputField("cy", "中心Y座標");
            createInputField("rx", "X方向の半径");
            createInputField("ry", "Y方向の半径");
            break;
        case "sector":
            createInputField("cx", "中心X座標");
            createInputField("cy", "中心Y座標");
            createInputField("radius", "半径");
            createInputField("angle", "角度（度）");
            break;
        case "polygon":
            createInputField("cx", "中心X座標");
            createInputField("cy", "中心Y座標");
            createInputField("sides", "辺の数");
            createInputField("radius", "半径");
            break;
        case "star":
            createInputField("cx", "中心X座標");
            createInputField("cy", "中心Y座標");
            createInputField("points", "星のポイント数");
            createInputField("radius", "外側の半径");
            createInputField("innerRadius", "内側の半径");
            break;
        case "cube":
            createInputField("side", "辺の長さ");
            break;
        case "rectangularPrism":
            createInputField("width", "幅");
            createInputField("height", "高さ");
            createInputField("depth", "奥行き");
            break;
        case "cylinder":
            createInputField("radius", "半径");
            createInputField("height", "高さ");
            break;
        case "cone":
            createInputField("radius", "半径");
            createInputField("height", "高さ");
            break;
        case "sphere":
            createInputField("radius", "半径");
            break;
        case "pyramid":
            createInputField("base", "底辺の長さ");
            createInputField("height", "高さ");
            break;
        case "frustum":
            createInputField("topRadius", "上円の半径");
            createInputField("bottomRadius", "下円の半径");
            createInputField("height", "高さ");
            break;
        case "prism":
            createInputField("sideLength", "底面の辺の長さ");
            createInputField("height", "高さ");
            break;
    }
});

// パラメータ入力フィールドを作成する関数
function createInputField(id, labelText) {
    const label = document.createElement("label");
    label.setAttribute("for", id);
    label.textContent = labelText;

    const input = document.createElement("input");
    input.setAttribute("id", id);
    input.setAttribute("type", "number");

    parametersDiv.appendChild(label);
    parametersDiv.appendChild(input);
    parametersDiv.appendChild(document.createElement("br"));
}

// 図形を描画する関数
function drawShape() {
    clearCanvas();  // SVGキャンバスをクリア
    const selectedShape = shapeSelect.value;

    // 図形ごとの描画処理
    if (selectedShape === "circle") {
        const cx = document.getElementById("cx").value || 50;
        const cy = document.getElementById("cy").value || 50;
        const radius = document.getElementById("radius").value || 40;
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", radius);
        circle.setAttribute("fill", "blue");
        svgCanvas.appendChild(circle);
    } else if (selectedShape === "rectangle") {
        const x = document.getElementById("x").value || 10;
        const y = document.getElementById("y").value || 10;
        const width = document.getElementById("width").value || 100;
        const height = document.getElementById("height").value || 50;
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", width);
        rect.setAttribute("height", height);
        rect.setAttribute("fill", "green");
        svgCanvas.appendChild(rect);
    } else if (selectedShape === "line") {
        const x1 = document.getElementById("x1").value || 10;
        const y1 = document.getElementById("y1").value || 10;
        const x2 = document.getElementById("x2").value || 100;
        const y2 = document.getElementById("y2").value || 100;
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", "black");
        svgCanvas.appendChild(line);
    }
    // 他の図形の描画処理も追加していきます。
}

// SVGを保存する関数
function saveSVG() {
    const svgData = new XMLSerializer().serializeToString(svgCanvas);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    // ダウンロードリンクを作成
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "shape.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// ボタンのイベントリスナー
drawButton.addEventListener("click", drawShape);
saveButton.addEventListener("click", saveSVG);
