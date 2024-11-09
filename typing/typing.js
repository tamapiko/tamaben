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
        // 判定に含める文字のみを定義（アルファベット、数字、句読点、アポストロフィ、半角スペース）
        const allowedCharacters = /^[a-zA-Z0-9.,' ]$/;

        if (event.key === "Backspace") {
            // Backspaceキーで最後の文字を削除
            if (userInput.length > 0) {
                userInput = userInput.slice(0, -1);  // 最後の文字を削除
                updateDisplay();  // 表示を更新
            }
            return;
        }

        // 判定に含まれないキー（Enter、その他許可されていないキー）
        if (!allowedCharacters.test(event.key)) return;

        // 入力した1文字をチェック
        const currentIndex = userInput.length;
        const correctChar = textToType[currentIndex];

        if (event.key === correctChar) {
            // 正しい場合は緑で追加
            userInput += event.key;
            statusElement.textContent = "";
        } else {
            // 間違った場合は赤で追加しリセット
            userInput += event.key;
            statusElement.textContent = "間違いがあります。";
            statusElement.style.color = "red";
            userInput = ""; // ミスした場合はリセット
        }

        updateDisplay();

        // 全ての文字が一致した場合
        if (userInput === textToType) {
            statusElement.textContent = "成功！";
            statusElement.style.color = "green";
        }
    });

    // 表示を更新する関数
    function updateDisplay() {
        userInputElement.innerHTML = "";  // 表示をリセット

        for (let i = 0; i < userInput.length; i++) {
            const span = document.createElement("span");
            span.textContent = userInput[i] === " " ? "␣" : userInput[i]; // 半角スペースをわかりやすく表示
            if (userInput[i] === textToType[i]) {
                span.classList.add("correct");
            } else {
                span.classList.add("incorrect");
            }
            userInputElement.appendChild(span);
        }
    }
});
