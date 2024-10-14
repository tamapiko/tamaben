// 画像の拡張子を指定
const extension = ".png"; // 拡張子を .png に変更

// 各教科のコンテナ要素を取得
const elementaryMathContainer = document.getElementById('elementary-math');
const elementaryScienceContainer = document.getElementById('elementary-science');
const middleMathContainer = document.getElementById('middle-math');
const middleScienceContainer = document.getElementById('middle-science');
const highMathContainer = document.getElementById('high-math');
const highScienceContainer = document.getElementById('high-science');

// 学校別に画像を表示する関数
function displayImages(schoolData, mathContainer, scienceContainer) {
    schoolData.subjects.forEach(subject => {
        const imgElement = document.createElement('img');
        imgElement.src = subject.image + extension; // 拡張子を後付け
        imgElement.alt = subject.name;

        // 教科ごとに表示
        if (subject.name === "Math") {
            mathContainer.appendChild(imgElement);
            mathContainer.appendChild(document.createTextNode(subject.name)); // 教科名も表示
            mathContainer.appendChild(document.createElement('br')); // 各教科の後に改行
        } else if (subject.name === "Science") {
            scienceContainer.appendChild(imgElement);
            scienceContainer.appendChild(document.createTextNode(subject.name)); // 教科名も表示
            scienceContainer.appendChild(document.createElement('br')); // 各教科の後に改行
        }
    });
}

// JSONデータを外部から読み込む
fetch('drill.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(jsonData => {
        // 小中高の画像を表示
        displayImages(jsonData.elementary, elementaryMathContainer, elementaryScienceContainer);
        displayImages(jsonData.middle, middleMathContainer, middleScienceContainer);
        displayImages(jsonData.high, highMathContainer, highScienceContainer);
    })
    .catch(error => {
        console.error('Error loading JSON data:', error);
    });
