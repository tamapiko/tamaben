let minutes = 25;  // 勉強時間（ポモドーロタイマー）
let seconds = 0;
let timerInterval;
let isRunning = false;
let studyTimes = {}; // 教科ごとの勉強時間を格納するオブジェクト
let weeklyStudyTimes = []; // 1週間の勉強時間を格納

// タイマー開始/停止
document.getElementById('startBtn').addEventListener('click', () => {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        document.getElementById('startBtn').textContent = 'スタート';
    } else {
        timerInterval = setInterval(startTimer, 1000);
        isRunning = true;
        document.getElementById('startBtn').textContent = '一時停止';
    }
});

// タイマーリセット
document.getElementById('resetBtn').addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    minutes = 25;
    seconds = 0;
    document.getElementById('startBtn').textContent = 'スタート';
    updateTimerDisplay();
});

// タイマー更新
function startTimer() {
    if (seconds === 0) {
        if (minutes === 0) {
            clearInterval(timerInterval);
            alert("タイマーが終了しました!");
            // ここで勉強時間を記録
            updateStudyTime();
            resetTimer();
        } else {
            minutes--;
            seconds = 59;
        }
    } else {
        seconds--;
    }
    updateTimerDisplay();
}

// タイマー表示更新
function updateTimerDisplay() {
    const timeString = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    document.getElementById('timer').textContent = timeString;
}

// 勉強時間を記録
function updateStudyTime() {
    const subject = document.getElementById('subject').value;
    const timeSpent = 25 - minutes + (60 - seconds) / 60; // 分単位の時間計算

    if (!studyTimes[subject]) {
        studyTimes[subject] = 0;
    }
    studyTimes[subject] += timeSpent;

    weeklyStudyTimes.push(timeSpent);

    localStorage.setItem('studyTimes', JSON.stringify(studyTimes));

    // 勉強時間表示
    let studyTimeText = '';
    for (let subject in studyTimes) {
        studyTimeText += `${subject}: ${studyTimes[subject].toFixed(2)} 分<br>`;
    }
    document.getElementById('studyTimeOutput').innerHTML = studyTimeText;

    // 1週間の平均勉強時間表示
    const averageTime = weeklyStudyTimes.reduce((acc, time) => acc + time, 0) / weeklyStudyTimes.length;
    document.getElementById('averageTimeOutput').textContent = averageTime.toFixed(2) + ' 分';
}

// リセットタイマー
function resetTimer() {
    minutes = 25;
    seconds = 0;
    updateTimerDisplay();
}
