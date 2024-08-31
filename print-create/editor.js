// サイズ選択時のテロップと初期設定
window.addEventListener('load', () => {
    const sizeSelect = document.getElementById('size-select');
    const orientationSelect = document.getElementById('orientation-select');
    const canvas = document.getElementById('pdf-canvas');
    const context = canvas.getContext('2d');

    sizeSelect.dispatchEvent(new Event('change')); // 初期サイズ設定
    orientationSelect.dispatchEvent(new Event('change')); // 初期向き設定
});

document.getElementById('size-select').addEventListener('change', () => {
    const size = document.getElementById('size-select').value;
    const orientation = document.getElementById('orientation-select').value;
    const canvas = document.getElementById('pdf-canvas');

    let width, height;
    if (size === 'B5') {
        width = 500;
        height = 707;
    } else if (size === 'A4') {
        width = 595;
        height = 842;
    } else if (size === 'A3') {
        width = 842;
        height = 1191;
    }

    if (orientation === 'landscape') {
        canvas.width = height;
        canvas.height = width;
    } else {
        canvas.width = width;
        canvas.height = height;
    }

    const tooltip = document.createElement('div');
    tooltip.textContent = `サイズ: ${size}, 向き: ${orientation}`;
    tooltip.style.position = 'absolute';
    tooltip.style.top = '10px';
    tooltip.style.left = '10px';
    tooltip.style.backgroundColor = 'rgba(0,0,0,0.5)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '5px';
    tooltip.style.borderRadius = '3px';
    document.body.appendChild(tooltip);
    
    setTimeout(() => {
        document.body.removeChild(tooltip);
    }, 3000);
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
                'x + 5 = 10 の解は？', '2x - 4 = 6 の解は？', /* ... 15個の問題 */
            ],
            // 他の単元の問題も追加
        },
        // 他の教科の問題も追加
    };

    return predefinedProblems[subject][unit] || [];
}

// テキストの追加
document.getElementById('add-text').addEventListener('click', () => {
    const text = prompt("追加するテキストを入力してください:");
    const font = prompt("フォントを入力してください:");
    const color = prompt("色を入力してください:");
    const fontSize = prompt("フォントサイズを入力してください（例: 20px）:");
    const x = prompt("テキストのX座標を入力してください:");
    const y = prompt("テキストのY座標を入力してください:");

    const canvas = document.getElementById('pdf-canvas');
    const context = canvas.getContext('2d');

    context.font = `${fontSize} ${font}`;
    context.fillStyle = color;
    context.fillText(text, x, y);
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
                
                const x = 100; // X座標
                const y = 

100; // Y座標
                context.drawImage(image, x, y);
            };
        };
        reader.readAsDataURL(file);
    });

    fileInput.click();
});

// 図形の追加
document.getElementById('add-shape').addEventListener('click', () => {
    const shape = prompt("追加する図形を入力してください（例: 'circle' または 'rectangle'）:");
    const x = parseInt(prompt("図形のX座標を入力してください:"), 10);
    const y = parseInt(prompt("図形のY座標を入力してください:"), 10);
    const width = parseInt(prompt("図形の幅を入力してください:"), 10);
    const height = parseInt(prompt("図形の高さを入力してください:"), 10);
    const color = prompt("図形の色を入力してください:");

    const canvas = document.getElementById('pdf-canvas');
    const context = canvas.getContext('2d');

    context.fillStyle = color;

    if (shape === 'circle') {
        context.beginPath();
        context.arc(x, y, width, 0, 2 * Math.PI);
        context.fill();
    } else if (shape === 'rectangle') {
        context.fillRect(x, y, width, height);
    }
});

// 線の追加
document.getElementById('add-line').addEventListener('click', () => {
    const x1 = parseInt(prompt("線の始点X座標を入力してください:"), 10);
    const y1 = parseInt(prompt("線の始点Y座標を入力してください:"), 10);
    const x2 = parseInt(prompt("線の終点X座標を入力してください:"), 10);
    const y2 = parseInt(prompt("線の終点Y座標を入力してください:"), 10);
    const color = prompt("線の色を入力してください:");
    const lineWidth = parseInt(prompt("線の太さを入力してください:"), 10);

    const canvas = document.getElementById('pdf-canvas');
    const context = canvas.getContext('2d');

    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
});
