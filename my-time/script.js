// 既存のコードとほぼ同じですが、スタイルを可愛い色に変更

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
document.querySelector('.circle-timer').appendChild(canvas);
canvas.width = 200;
canvas.height = 200;

// 円形タイマーの更新関数
function updateCircleTimer() {
    const totalTime = isStudyTime ? studyTime : breakTime;
    const progress = (totalTime * 60 - (minutes * 60 + seconds)) / (totalTime * 60);  // 進行状況の計算
    const startAngle = -Math.PI / 2; // 円のスタート角度（上から）
    const endAngle = startAngle + (progress * 2 * Math.PI);

    ctx.clearRect(0, 0, canvas.width, canvas.height); // 以前の円を消去

    // 背景円（薄いピンク）
    ctx.beginPath();
    ctx.arc(100, 100, 90, 0, 2 * Math.PI);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#ffe4e1';  // 優しいピンク
    ctx.stroke();

    // 進行状況の円（明るいピンク）
    ctx.beginPath();
    ctx.arc(100, 100, 90, startAngle, endAngle);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#ff7f7f';  // 明るいピンク
    ctx.lineCap = 'round';  // 円の端を丸く
    ctx.stroke();
}

// タイマーを開始する際に円タイマーを更新
function startTimer() {
    if (isRunning) return;  // すでにタイマーが動いている場合は何もしない

    isRunning = true;
    const subject = document.getElementById('subject').value;

    timerInterval = setInterval(function() {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(timerInterval);  // タイマーが0になったら停止
                const alertSound = new Audio('https://www.soundjay.com/button/beep-07.wav');
                alertSound.play();
                alert(isStudyTime ? '勉強時間が終了しました！ 休憩しましょう！' : '休憩時間が終了しました！ 勉強を再開しましょう！');

                // 勉強時間が終了したときにその教科の勉強時間を保存
                if (isStudyTime) {
                    studyTimeData[subject] = (studyTimeData[subject] || 0) + studyTime;
                    dailyStudyData[subject] = (dailyStudyData[subject] || 0) + studyTime;
                    localStorage.setItem('studyTimeData', JSON.stringify(studyTimeData));
                    localStorage.setItem('dailyStudyData', JSON.stringify(dailyStudyData));
                }

                // 日付の更新
                const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
                dailyStudyData[currentDate] = dailyStudyData[currentDate] || {};
                dailyStudyData[currentDate][subject] = (dailyStudyData[currentDate][subject] || 0) + studyTime;

                // 円グラフの更新
                createChart();

                // 勉強時間の表示更新
                updateStudyTimeDisplay();
                updateWeeklyAverage();
                minutes = breakTime;
                isStudyTime = !isStudyTime;
                updateTimerDisplay();
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }

        // 円形タイマーの進行を更新
        updateCircleTimer();

        updateTimerDisplay();
    }, 1000);
}

// タイマーの表示更新
function updateTimerDisplay() {
    const timerElement = document.getElementById('timer');
    timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// 最初に円グラフを描画
updateCircleTimer();
