document.addEventListener("DOMContentLoaded", () => {
    let textToType = "";  // JSONから取得するテキスト
    let userInput = "";
    const textElement = document.querySelector("#textToType");
    const userInputElement = document.querySelector("#userInput");
    const statusElement = document.querySelector("#status");
    const readAloudButton = document.querySelector("#readAloudButton"); // 再生ボタン

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

    // キー入力イベントのリスナーを追加
    document.addEventListener("keydown", (event) => {
        const allowedCharacters = /^[a-zA-Z0-9.,' ]$/;

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
            userInput = "";
        }

        updateDisplay();

        if (userInput === textToType) {
            statusElement.textContent = "成功！";
            statusElement.style.color = "green";
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

    // 読み上げボタンのクリックイベント
    readAloudButton.addEventListener("click", () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(textToType);
            utterance.lang = "ja-JP";
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
            console.error("このブラウザではSpeechSynthesis APIがサポートされていません。");
        }
    });
});
