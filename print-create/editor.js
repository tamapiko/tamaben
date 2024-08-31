// ページが読み込まれたときにサイズ選択を設定
window.addEventListener('load', () => {
    const sizeSelect = document.getElementById('size-select');
    sizeSelect.dispatchEvent(new Event('change')); // 初期サイズ設定
});

// サイズ変更に応じてキャンバスサイズを設定
document.getElementById('size-select').addEventListener('change', () => {
    const size = document.getElementById('size-select').value;
    const canvas = document.getElementById('pdf-canvas');

    if (size === 'B5') {
        canvas.width = 500;
        canvas.height = 707;
    } else if (size === 'A4') {
        canvas.width = 595;
        canvas.height = 842;
    } else if (size === 'A3') {
        canvas.width = 842;
        canvas.height = 1191;
    }
});

// 教科に基づいて単元を選択肢に追加
document.getElementById('subject-select').addEventListener('change', () => {
    const subject = document.getElementById('subject-select').value;
    const unitSelect = document.getElementById('unit-select');
    
    unitSelect.innerHTML = ''; // 既存の単元をクリア

    const units = getUnits(subject);
    addUnitOptions(units);
});

function getUnits(subject) {
    switch (subject) {
        case 'math': return ['四則演算', '方程式', '幾何', '関数', '確率と統計', '数列', 'ベクトル', '行列'];
        case 'japanese': return ['漢字', '文法', '読解', '古文', '言葉の意味', '詩歌', '故事成語', '作文'];
        case 'english': return ['語彙', '文法', 'リーディング', 'ライティング', 'リスニング', '発音', '会話', '英作文'];
        case 'science': return ['物理', '化学', '生物', '地学', '環境科学', 'エネルギー', '光学', '化学反応'];
        case 'social-studies': return ['歴史', '地理', '公民', '経済', '政治', '国際関係', '文化', '社会問題'];
        default: return [];
    }
}

function addUnitOptions(units) {
    const unitSelect = document.getElementById('unit-select');
    units.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = unit;
        unitSelect.appendChild(option);
    });
}

// 問題生成ボタンのイベントリスナー
document.getElementById('generate-problems').addEventListener('click', () => {
    const subject = document.getElementById('subject-select').value;
    const unit = document.getElementById('unit-select').value;
    const problemsContainer = document.getElementById('problems-container');

    problemsContainer.innerHTML = ''; // 既存の問題をクリア

    const problems = generateProblems(subject, unit);

    problems.forEach(problem => {
        const problemElement = document.createElement('div');
        problemElement.textContent = problem;
        problemsContainer.appendChild(problemElement);
    });
});

// 事前に用意した問題を選択して生成
function generateProblems(subject, unit) {
    const predefinedProblems = {
        'math': {
            '四則演算': [
                '5 + 3 = ?', '10 - 2 = ?', /* ... 15個の問題 */
            ],
            '方程式': [
                'x + 5 = 10 の解は？', '2x - 4 = 6 の解は？', /* ...

 15個の問題 */
            ],
            // 他の単元の問題も追加
        },
        // 他の教科の問題も追加
    };

    return predefinedProblems[subject][unit] || [];
}

// テキストの追加
document.getElementById('add-text').addEventListener('click', () => {
    const text = document.getElementById('text-input').value;
    const font = document.getElementById('font-select').value;
    const color = document.getElementById('color-input').value;
    const fontSize = document.getElementById('font-size-input').value;
    const canvas = document.getElementById('pdf-canvas');
    const context = canvas.getContext('2d');

    context.font = `${fontSize}px ${font}`;
    context.fillStyle = color;
    context.fillText(text, 50, 50); // テキストの位置は調整してください
});

// 画像の追加
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
                const canvas = document.getElementById('pdf-canvas');
                const context = canvas.getContext('2d');
                context.drawImage(image, 100, 100); // 画像の位置は調整してください
            };
        };

        reader.readAsDataURL(file);
    });

    fileInput.click();
});

// PDFの保存
document.getElementById('save-pdf').addEventListener('click', async () => {
    const canvas = document.getElementById('pdf-canvas');
    const pdfDoc = await PDFLib.PDFDocument.create();
    const page = pdfDoc.addPage([canvas.width, canvas.height]);

    const pngImage = await pdfDoc.embedPng(canvas.toDataURL('image/png'));
    page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height,
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'print.pdf';
    a.click();
    URL.revokeObjectURL(url);
});
