// BroadcastChannelの初期化
let channel = null;

// メニューのトグル表示
document.getElementById('menu-toggle').addEventListener('click', function() {
  document.getElementById('settings-panel').classList.toggle('show');
});

// 初期設定のロード
document.addEventListener('DOMContentLoaded', function() {
  const storedBeads = localStorage.getItem('numBeads') || 5;
  const storedBeadSize = localStorage.getItem('beadSize') || 1;
  const storedMode = localStorage.getItem('operationMode') || 'slide';
  const storedLinkingEnabled = localStorage.getItem('linkingEnabled') === 'true';

  document.getElementById('num-beads').value = storedBeads;
  document.getElementById('bead-size').value = storedBeadSize;
  document.getElementById('operation-mode').value = storedMode;
  document.getElementById('linking-enabled').checked = storedLinkingEnabled;

  applySettings();  // 設定を適用
});

// 設定をローカルストレージに保存し、BroadcastChannelで状態を送信
document.getElementById('apply-settings').addEventListener('click', function() {
  const numBeads = document.getElementById('num-beads').value;
  const beadSize = document.getElementById('bead-size').value;
  const operationMode = document.getElementById('operation-mode').value;
  const linkingEnabled = document.getElementById('linking-enabled').checked;

  localStorage.setItem('numBeads', numBeads);
  localStorage.setItem('beadSize', beadSize);
  localStorage.setItem('operationMode', operationMode);
  localStorage.setItem('linkingEnabled', linkingEnabled);

  applySettings();  // 設定適用
});

// 設定適用
function applySettings() {
  const numBeads = document.getElementById('num-beads').value;
  const beadSize = document.getElementById('bead-size').value;
  const operationMode = document.getElementById('operation-mode').value;
  const linkingEnabled = document.getElementById('linking-enabled').checked;

  // そろばんの描画を更新
  drawSoroban(numBeads, beadSize, operationMode);

  if (linkingEnabled) {
    // 連結機能がONの場合
    const connectionCode = generateConnectionCode();
    document.getElementById('connection-code').style.display = 'block';
    document.getElementById('connection-code-display').value = connectionCode;

    // BroadcastChannelで接続情報を送信
    if (channel) {
      channel.close();
    }
    channel = new BroadcastChannel(connectionCode);
    channel.postMessage({ type: 'connect', code: connectionCode });
  } else {
    // 連結機能がOFFの場合、BroadcastChannelを閉じる
    if (channel) {
      channel.close();
      channel = null;
    }
  }
}

// 接続コード生成
function generateConnectionCode() {
  return Math.random().toString(36).substr(2, 6); // ランダムな6文字
}

// 接続コード入力
document.getElementById('connect-button').addEventListener('click', function() {
  const inputCode = document.getElementById('linking-code-input').value.trim();
  
  if (inputCode && channel) {
    // 他の端末と接続
    if (channel) {
      channel.postMessage({ type: 'connect', code: inputCode });
    }
  }
});

// 接続された端末からのメッセージを受け取る
if (channel) {
  channel.onmessage = (event) => {
    const message = event.data;
    if (message.type === 'connect') {
      // 他の端末と接続された時の処理
      console.log('接続された:', message.code);
    }
  };
}

// そろばんの描画関数
function drawSoroban(numBeads, beadSize, operationMode) {
  const sorobanElement = document.getElementById('soroban');
  sorobanElement.innerHTML = ''; // 既存のそろばんをクリア

  // そろばんの桁数と珠のサイズを設定
  for (let i = 0; i < numBeads; i++) {
    const bead = document.createElement('div');
    bead.classList.add('soroban-bead');
    bead.style.width = `${beadSize * 10}px`;  // 珠のサイズに応じて幅を調整
    bead.style.height = `${beadSize * 10}px`;

    // 珠をクリック可能に
    bead.addEventListener('click', function() {
      bead.classList.toggle('active');
    });

    sorobanElement.appendChild(bead);
  }
}
