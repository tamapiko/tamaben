const extension = ".png"; // 画像の拡張子

// 各教科のコンテナ要素を取得
const elementaryKokugoContainer = document.getElementById('elementary-kokugo');
const elementarySuugakuContainer = document.getElementById('elementary-suugaku');
const elementaryEigoContainer = document.getElementById('elementary-eigo');
const elementaryRikaContainer = document.getElementById('elementary-rika');
const elementaryShakaiContainer = document.getElementById('elementary-shakai');

const middleKokugoContainer = document.getElementById('middle-kokugo');
const middleSuugakuContainer = document.getElementById('middle-suugaku');
const middleEigoContainer = document.getElementById('middle-eigo');
const middleRikaContainer = document.getElementById('middle-rika');
const middleShakaiContainer = document.getElementById('middle-shakai');

const highKokugoContainer = document.getElementById('high-kokugo');
const highSuugakuContainer = document.getElementById('high-suugaku');
const highEigoContainer = document.getElementById('high-eigo');
const highRikaContainer = document.getElementById('high-rika');
const highShakaiContainer = document.getElementById('high-shakai');

// 各教科の画像を表示する関数
function displayImage(container, imageName) {
    const imgElement = document.createElement('img');
    imgElement.src = `drill-sample/${imageName}${extension}`; // 画像のパスを指定
    imgElement.alt = imageName;
    container.appendChild(imgElement);
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
        // 小学校の画像を表示
        jsonData.elementary.subjects.forEach(subject => {
            displayImage(document.getElementById(`elementary-${subject.name}`), subject.image);
        });

        // 中学校の画像を表示
        jsonData.middle.subjects.forEach(subject => {
            displayImage(document.getElementById(`middle-${subject.name}`), subject.image);
        });

        // 高校の画像を表示
        jsonData.high.subjects.forEach(subject => {
            displayImage(document.getElementById(`high-${subject.name}`), subject.image);
        });
    })
    .catch(error => {
        console.error('Error loading JSON data:', error);
    });
