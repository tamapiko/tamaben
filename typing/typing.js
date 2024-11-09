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
        if (event.key === "Backspace" || event.key === "Enter" || event.key.length > 1) return;

        // 入力した1文字をチェック
        const currentIndex = userInput.length;
        const correctChar = textToType[currentIndex];

        if (event.key === correctChar) {
            // 正しい場合は緑で追加
            userInput += event.key;
            userInputElement.innerHTML += `<span class="correct">${event.key}</span>`;
            statusElement.textContent = "";
        } else {
            // 間違った場合は赤で追加しリセット
            userInputElement.innerHTML += `<span class="incorrect">${event.key}</span>`;
            statusElement.textContent = "間違いがあります。";
            statusElement.style.color = "red";
            userInput = ""; // ミスした場合はリセット
        }

        // 全ての文字が一致した場合
        if (userInput === textToType) {
            statusElement.textContent = "成功！";
            statusElement.style.color = "green";
        }
    });
});
