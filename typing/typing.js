document.addEventListener("DOMContentLoaded", () => {
    let textToType = "";
    let userInput = "";
    let startTime = Date.now();
    let mistypes = 0;
    const textElement = document.querySelector("#textToType");
    const userInputElement = document.querySelector("#userInput");
    const statusElement = document.querySelector("#status");
    const readAloudButton = document.querySelector("#readAloudButton");
    const downloadButton = document.querySelector("#downloadButton");
    const speedControl = document.querySelector("#speedControl");
    const speedValue = document.querySelector("#speedValue");

    // JSONファイルからテキストを取得
    fetch("text.json")
        .then(response => response.json())
        .then(data => {
            textToType = data.textToType;
            textElement.textContent = textToType;
        })
        .catch(error => {
            console.error("JSONファイルの読み込みエラー:", error);
            textElement.textContent = "テキストを読み込めませんでした";
        });

    document.addEventListener("keydown", (event) => {
        const allowedCharacters = /^[a-zA-Z0-9.,' \-]$/; 

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
            statusElement.textContent = "間違いがあります。";
            statusElement.style.color = "red";
            mistypes++;  // ミスタイプの数をカウント
        }

        updateDisplay();

        if (userInput === textToType) {
            statusElement.textContent = "成功！";
            statusElement.style.color = "green";
            const endTime = Date.now();
            const timeTaken = (endTime - startTime) / 1000;  

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
            span.textContent = userInput[i] === " " ? "␣" : userInput[i]; 
            if (userInput[i] === textToType[i]) {
                span.classList.add("correct");
            } else {
                span.classList.add("incorrect");
            }
            userInputElement.appendChild(span);
        }
    }

    function generatePDF(timeTaken) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // カスタムフォントの設定
        doc.addFileToVFS("NotoSansJP-Regular.ttf", notoSansJp);
        doc.addFont("NotoSansJP-Regular.ttf", "NotoSansJP", "normal");
        doc.setFont("NotoSansJP");

        doc.setFontSize(16);
        doc.text("タマピング 結果", 20, 20);
        doc.text(`入力時間: ${timeTaken.toFixed(2)}秒`, 20, 30);
        doc.text(`タイプ数: ${userInput.length}`, 20, 40);
        doc.text(`ミスタイプ数: ${mistypes}`, 20, 50);

        doc.save("typing_result.pdf");
    }

    readAloudButton.addEventListener("click", () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(textToType);
            utterance.lang = "en-US"; 
            utterance.rate = parseFloat(speedControl.value); // スライダーの値で読み上げ速度を調整

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
            console.error("このブラウザではSpeechSynthesis APIがサポートされていません。");
        }
    });

    // スライダーの値を表示と同期
    speedControl.addEventListener("input", () => {
        speedValue.textContent = `${speedControl.value}x`;
    });
});
