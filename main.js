// 画像の拡張子を指定
const extension = ".png"; // 拡張子を .png に変更

// 各学校のコンテナ要素を取得
const elementaryContainer = document.getElementById('elementary-container');
const middleContainer = document.getElementById('middle-container');
const highContainer = document.getElementById('high-container');

// 学校別に画像を表示する関数
function displayImages(schoolData, container) {
    schoolData.subjects.forEach(subject => {
        const imgElement = document.createElement('img');
        imgElement.src = subject.image + extension; // 拡張子を後付け
        imgElement.alt = subject.name;
        container.appendChild(imgElement);
        container.appendChild(document.createTextNode(subject.name)); // 教科名も表示
        container.appendChild(document.createElement('br')); // 各教科の後に改行
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
        displayImages(jsonData.schools.elementary, elementaryContainer);
        displayImages(jsonData.schools.middle, middleContainer);
        displayImages(jsonData.schools.high, highContainer);
    })
    .catch(error => {
        console.error('Error loading JSON data:', error);
    });
