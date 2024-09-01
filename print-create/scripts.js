document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('pdf-canvas');
    const textSettings = document.createElement('div');
    const shapeSettings = document.createElement('div');
    let zoomLevel = 1;
    let selectedElement = null;

    textSettings.id = 'text-settings';
    textSettings.innerHTML = `
        <h3>テキスト設定</h3>
        <label>フォントサイズ:</label>
        <input type="range" id="text-font-size" min="10" max="100" value="20">
        <label>色:</label>
        <input type="color" id="text-color" value="#000000">
    `;

    shapeSettings.id = 'shape-settings';
    shapeSettings.innerHTML = `
        <h3>図形設定</h3>
        <label>幅:</label>
        <input type="range" id="shape-width" min="10" max="500" value="100">
        <label>高さ:</label>
        <input type="range" id="shape-height" min="10" max="500" value="100">
        <label>色:</label>
        <input type="color" id="shape-color" value="#000000">
    `;

    document.getElementById('pdf-editor').appendChild(textSettings);
    document.getElementById('pdf-editor').appendChild(shapeSettings);

    window.selectSize = () => {
        const sizeSelect = document.getElementById('size-select').value.split('_');
        const size = sizeSelect[0];
        const orientation = sizeSelect[1];

        if (size === 'A4' && orientation === 'portrait') {
            canvas.width = 595;
            canvas.height = 842;
        } else if (size === 'A4' && orientation === 'landscape') {
            canvas.width = 842;
            canvas.height = 595;
        } else if (size === 'B5' && orientation === 'portrait') {
            canvas.width = 516;
            canvas.height = 729;
        } else if (size === 'B5' && orientation === 'landscape') {
            canvas.width = 729;
            canvas.height = 516;
        }

        fitCanvasToScreen();
        document.getElementById('size-modal').style.display = 'none';
        document.getElementById('editor-container').style.display = 'flex';
    };

    function fitCanvasToScreen() {
        const editor = document.getElementById('pdf-editor');
        const scaleX = editor.clientWidth / canvas.width;
        const scaleY = editor.clientHeight / canvas.height;
        const scale = Math.min(scaleX, scaleY);
        canvas.style.transform = `scale(${scale})`;
        zoomLevel = scale;
    }

    window.zoomIn = () => {
        zoomLevel *= 1.1;
        canvas.style.transform = `scale(${zoomLevel})`;
    };

    window.zoomOut = () => {
        zoomLevel /= 1.1;
        canvas.style.transform = `scale(${zoomLevel})`;
    };

    window.loadPDF = () => {
        const fileInput = document.getElementById('pdf-upload');
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const pdfData = e.target.result;
                // PDFをキャンバスに表示するためのロジックを追加
                // 例えば、PDF.jsなどのライブラリを使用してPDFを描画することが可能
            };
            reader.readAsArrayBuffer(file);
        } else {
            alert('PDFファイルを選択してください。');
        }
    };

    function addTextBox(x, y, text, fontSize, font, color) {
        const textBox = document.createElement('div');
        textBox.className = 'text-box';
        textBox.contentEditable = true;
        textBox.style.fontSize = fontSize;
        textBox.style.fontFamily = font;
        textBox.style.color = color;
        textBox.style.left = `${x}px`;
        textBox.style.top = `${y}px`;
        textBox.style.width = '200px';  // デフォルト幅
        textBox.style.height = 'auto';
        textBox.innerText = text;

        document.getElementById('pdf-editor').appendChild(textBox);

        // ドラッグ&ドロップ対応
        textBox.addEventListener('mousedown', (e) => {
            const offsetX = e.clientX - textBox.getBoundingClientRect().left;
            const offsetY = e.clientY - textBox.getBoundingClientRect().top;

            const onMouseMove = (e) => {
                textBox.style.left = `${e.clientX - offsetX}px`;
                textBox.style.top = `${e.clientY - offsetY}px`;
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        textBox.addEventListener('click', () => {
            selectedElement = textBox;
            textSettings.style.display = 'block';
            shapeSettings.style.display = 'none';
            updateTextSettings();
        });
    }

    function addShape(x, y, width, height, color) {
        const shape = document.createElement('div');
        shape.className = 'shape';
        shape.style.backgroundColor = color;
        shape.style.left = `${x}px`;
        shape.style.top = `${y}px`;
        shape.style.width = `${width}px`;
        shape.style.height = `${height}px`;

        document.getElementById('pdf-editor').appendChild(shape);

        // ドラッグ&ドロップ対応
        shape.addEventListener('mousedown', (e) => {
            const offsetX = e.clientX - shape.getBoundingClientRect().left;
            const offsetY = e.clientY - shape.getBoundingClientRect().top;

            const onMouseMove = (e) => {
                shape.style.left = `${e.clientX - offsetX}px`;
                shape.style.top = `${e.clientY - offsetY}px`;
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        shape.addEventListener('click', () => {
            selectedElement = shape;
            textSettings.style.display = 'none';
            shapeSettings.style.display = 'block';
            updateShapeSettings();
        });
    }

    function updateTextSettings() {
        if (selectedElement && selectedElement.classList.contains('text-box')) {
            document.getElementById('text-font-size').value = parseFloat(window.getComputedStyle(selectedElement).fontSize);
            document.getElementById('text-color').value = window.getComputedStyle(selectedElement).color;
        }
    }

    function updateShapeSettings() {
        if (selectedElement && selectedElement.classList.contains('shape')) {
            document.getElementById('shape-width').value = parseFloat(window.getComputedStyle(selectedElement).width);
            document.getElementById('shape-height').value = parseFloat(window.getComputedStyle(selectedElement).height);
            document.getElementById('shape-color').value = window.getComputedStyle(selectedElement).backgroundColor;
        }
    }

    document.getElementById('add-text').addEventListener('click', () => {
        const x = 100;
        const y = 100;
        const text = '新しいテキスト';
        const fontSize = '20px';
        const font = 'Arial';
        const color = '#000000';

        addTextBox(x, y, text, fontSize, font, color);
    });

    document.getElementById('add-shape').addEventListener('click', () => {
        const x = 100;
        const y = 100;
        const width = 100;
        const height = 100;
        const color = '#ff0000';

        addShape(x, y, width, height, color);
    });

    document.getElementById('text-font-size').addEventListener('input', (e) => {
        if (selectedElement && selectedElement.classList.contains('text-box')) {
            selectedElement.style.fontSize = `${e.target.value}px`;
        }
    });

    document.getElementById('text-color').addEventListener('input', (e) => {
        if (selectedElement && selectedElement.classList.contains('text-box')) {
            selectedElement.style.color = e.target.value;
        }
    });

    document.getElementById('shape-width').addEventListener('input', (e) => {
        if (selectedElement && selectedElement.classList.contains('shape')) {
            selectedElement.style.width = `${e.target.value}px`;
        }
    });

    document.getElementById('shape-height').addEventListener('input', (e) => {
        if (selectedElement && selectedElement.classList.contains('shape')) {
            selectedElement.style.height = `${e.target.value}px`;
        }
    });

    document.getElementById('shape-color').addEventListener('input', (e) => {
        if (selectedElement && selectedElement.classList.contains('shape')) {
            selectedElement.style.backgroundColor = e.target.value;
        }
    });
});
