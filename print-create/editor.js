// PDFサイズの選択に基づいてキャンバスサイズを設定
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

    if (subject === 'math') {
        addUnitOptions(['四則演算', '方程式', '幾何', '関数', '確率と統計']);
    } else if (subject === 'japanese') {
        addUnitOptions(['漢字', '文法', '読解', '古文', '言葉の意味']);
    } else if (subject === 'english') {
        addUnitOptions(['語彙', '文法', 'リーディング', 'ライティング', 'リスニング']);
    } else if (subject === 'science') {
        addUnitOptions(['物理', '化学', '生物', '地学', '環境科学']);
    } else if (subject === 'social-studies') {
        addUnitOptions(['歴史', '地理', '公民', '経済', '政治']);
    }
});

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

// 各単元に対して15パターンの問題を生成する関数
function generateProblems(subject, unit) {
    const problems = [];
    if (subject === 'math') {
        if (unit === '四則演算') {
            problems.push('5 + 3 = ?', '10 - 2 = ?', /* ... 15パターンの問題 */);
        } else if (unit === '方程式') {
            problems.push('x + 5 = 10 の解は？', '2x - 4 = 6 の解は？', /* ... 15パターンの問題 */);
        }
        // 他の単元も同様に追加
    }
    // 他の教科の問題生成も同様に追加
    return problems;
}

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
