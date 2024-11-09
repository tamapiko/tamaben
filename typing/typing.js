document.addEventListener("DOMContentLoaded", () => {
    let textToType = "";  // JSONから取得するテキスト
    let userInput = "";
    const textElement = document.querySelector("#textToType");
    const userInputElement = document.querySelector("#userInput");
    const statusElement = document.querySelector("#status");

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
        // 判定に含めないキー
        if (event.key === "Backspace" || event.key === "Enter") return;

        // 入力文字を追加
        userInput += event.key;

        // 入力が正しいかどうかを判定し、表示を更新
        updateDisplay();
    });

    function updateDisplay() {
        let displayText = "";  // 表示するHTMLテキスト

        for (let i = 0; i < textToType.length; i++) {
            if (i < userInput.length) {
                if (userInput[i] === textToType[i]) {
                    // 正しい文字は緑に
                    displayText += `<span class="correct">${userInput[i]}</span>`;
                } else {
                    // 間違った文字は赤に
                    displayText += `<span class="incorrect">${userInput[i]}</span>`;
                }
            } else {
                // 残りの文字をグレーで表示
                displayText += `<span>${textToType[i]}</span>`;
            }
        }

        userInputElement.innerHTML = displayText;

        // 入力が正しいかどうかを表示
        if (userInput === textToType) {
            statusElement.textContent = "成功！";
            statusElement.style.color = "green";
        } else if (!textToType.startsWith(userInput)) {
            statusElement.textContent = "間違いがあります。";
            statusElement.style.color = "red";
            userInput = "";  // 間違えた場合はリセット
        } else {
            statusElement.textContent = "";
        }
    }
});
