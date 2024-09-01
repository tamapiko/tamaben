document.addEventListener('DOMContentLoaded', () => {
    const sizeModal = document.getElementById('size-modal');
    const editorContainer = document.getElementById('editor-container');
    const canvas = document.getElementById('pdf-canvas');
    const context = canvas.getContext('2d');
    let zoomLevel = 1;

    // サイズと向きの選択
    window.selectSize = (size, orientation) => {
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

        // キャンバスを画面に合わせてサイズ変更
        fitCanvasToScreen();

        // 編集画面に移動
        sizeModal.style.display = 'none';
        editorContainer.style.display = 'flex';
    };

    // キャンバスを画面サイズに合わせる
    function fitCanvasToScreen() {
        const editor = document.getElementById('pdf-editor');
        const scaleX = editor.clientWidth / canvas.width;
        const scaleY = editor.clientHeight / canvas.height;
        const scale = Math.min(scaleX, scaleY);

        canvas.style.transform = `scale(${scale})`;
        zoomLevel = scale; // 初期ズームレベル設定
    }

    // 拡大機能
    window.zoomIn = () => {
        zoomLevel *= 1.1; // 10%拡大
        applyZoom();
    };

    // 縮小機能
    window.zoomOut = () => {
        zoomLevel *= 0.9; // 10%縮小
        applyZoom();
    };

    // 拡大・縮小を適用
    function applyZoom() {
        canvas.style.transform = `scale(${zoomLevel})`;
    }

    // PDFの再編集機能
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

    // その他の描画とインタラクション機能
    document.getElementById('add-text').addEventListener('click', () => {
        const text = prompt("追加するテキストを入力してください:");
        const font = prompt("フォントを入力してください:");
        const color = prompt("色を入力してください:");
        const fontSize = prompt("フォントサイズを入力してください（例: 20px）:");
        const x = parseInt(prompt("テキストのX座標を入力してください:"), 10);
        const y = parseInt(prompt("テキストのY座標を入力してください:"), 10);

        context.font = `${fontSize} ${font}`;
        context.fillStyle = color;
        context.fillText(text, x, y);
    });

    document.getElementById('add-image').addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                const image = new Image();
                image.src = reader.result;
                image.onload = () => {
                    context.drawImage(image, 100, 100);
                };
            };
            reader.readAsDataURL(file);
        });
        fileInput.click();
    });
});
