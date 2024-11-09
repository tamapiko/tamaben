document.addEventListener("DOMContentLoaded", () => {
    let textToType = "";  // JSONから取得するテキスト
    let userInput = "";
    let startTime = Date.now();
    let mistypes = 0;
    const textElement = document.querySelector("#textToType");
    const userInputElement = document.querySelector("#userInput");
    const statusElement = document.querySelector("#status");
    const readAloudButton = document.querySelector("#readAloudButton");
    const downloadButton = document.querySelector("#downloadButton");

    // JSONファイルからテキストを取得
    fetch("text.json")
        .then(response => response.json())
        .then(data => {
            textToType = data.textToType;
            textElement.textContent = textToType;
        })
        .catch(error => {
            console.error("JSONファイルの読み込みエラー:", error);
            textElement.textContent = "Text failed to load";
        });

    // キー入力イベントのリスナーを追加
    document.addEventListener("keydown", (event) => {
        const allowedCharacters = /^[a-zA-Z0-9.,' \-]$/; // マイナス（-）と半角スペースを含めた正規表現

        if (event.key === "Backspace") {
            if (userInput.length > 0) {
                userInput = userInput.slice(0, -1);
                updateDisplay();
            }
            return;
        }

        if (!allowedCharacters.test(event.key)) return;

        const currentIndex = userInput.length;
        const correctChar = textToType[currentIndex];

        if (event.key === correctChar) {
            userInput += event.key;
            statusElement.textContent = "";
        } else {
            userInput += event.key;
            statusElement.textContent = "There is a mistake.";
            statusElement.style.color = "red";
            mistypes++;  // ミスタイプの数をカウント
        }

        updateDisplay();

        if (userInput === textToType) {
            statusElement.textContent = "Success!";
            statusElement.style.color = "green";
            const endTime = Date.now();
            const timeTaken = (endTime - startTime) / 1000;  // 時間を秒単位で取得

            // PDFダウンロードボタンを表示
            downloadButton.style.display = "block";
            downloadButton.addEventListener("click", () => {
                generatePDF(timeTaken);
            });
        }
    });

    function updateDisplay() {
        userInputElement.innerHTML = "";

        for (let i = 0; i < userInput.length; i++) {
            const span = document.createElement("span");
            span.textContent = userInput[i] === " " ? "␣" : userInput[i]; // スペースを「␣」で表示
            if (userInput[i] === textToType[i]) {
                span.classList.add("correct");
            } else {
                span.classList.add("incorrect");
            }
            userInputElement.appendChild(span);
        }
    }

    // PDFを生成してダウンロード
    function generatePDF(timeTaken) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // タイピング結果をPDFに追加
        doc.setFontSize(16);
        doc.text("Typing Test Results", 20, 20);
        doc.text(`Time Taken: ${timeTaken.toFixed(2)} seconds`, 20, 30);
        doc.text(`Total Keystrokes: ${userInput.length}`, 20, 40);
        doc.text(`Mistakes: ${mistypes}`, 20, 50);

        // PDFをダウンロード
        doc.save("typing_result.pdf");
    }

    // 読み上げボタンのクリックイベント
    readAloudButton.addEventListener("click", () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(textToType);
            utterance.lang = "en-US"; // 英語
            utterance.rate = 1.0;

            if (readAloudButton.classList.contains("playing")) {
                speechSynthesis.cancel();
                readAloudButton.classList.remove("playing");
            } else {
                speechSynthesis.cancel();
                speechSynthesis.speak(utterance);
                readAloudButton.classList.add("playing");
            }

            utterance.onend = () => {
                readAloudButton.classList.remove("playing");
            };
        } else {
            console.error("This browser does not support SpeechSynthesis API.");
        }
    });
});
