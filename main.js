// 画像の拡張子を指定
const extension = ".png"; // 拡張子を .png に変更

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

// 学校別に画像を表示する関数
function displayImages(schoolData, containers) {
    schoolData.subjects.forEach(subject => {
        const imgElement = document.createElement('img');
        imgElement.src = subject.image + extension; // 拡張子を後付け
        imgElement.alt = subject.name;

        // 教科ごとのコンテナを取得
        const container = containers[subject.name];
        container.appendChild(imgElement);
        container.appendChild(document.createTextNode(subject.name)); // 教科名も表示
        container.appendChild(document.createElement('br')); // 各教科の後に改行
    });
}

// JSONデータを外部から読み込む
fetch('/tamabeb/drill.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(jsonData => {
        // 各教科のコンテナを設定
        const elementaryContainers = {
            "kokugo": elementaryKokugoContainer,
            "suugaku": elementarySuugakuContainer,
            "eigo": elementaryEigoContainer,
            "rika": elementaryRikaContainer,
            "shakai": elementaryShakaiContainer
        };
        
        const middleContainers = {
            "kokugo": middleKokugoContainer,
            "suugaku": middleSuugakuContainer,
            "eigo": middleEigoContainer,
            "rika": middleRikaContainer,
            "shakai": middleShakaiContainer
        };

        const highContainers = {
            "kokugo": highKokugoContainer,
            "suugaku": highSuugakuContainer,
            "eigo": highEigoContainer,
            "rika": highRikaContainer,
            "shakai": highShakaiContainer
        };

        // 小中高の画像を表示
        displayImages(jsonData.elementary, elementaryContainers);
        displayImages(jsonData.middle, middleContainers);
        displayImages(jsonData.high, highContainers);
    })
    .catch(error => {
        console.error('Error loading JSON data:', error);
    });
