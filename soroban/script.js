// 初期設定のロード
document.addEventListener('DOMContentLoaded', function() {
  const storedBeads = localStorage.getItem('numBeads') || 5;
  const storedBeadSize = localStorage.getItem('beadSize') || 1;
  const storedMode = localStorage.getItem('operationMode') || 'slide';

  document.getElementById('num-beads').value = storedBeads;
  document.getElementById('bead-size').value = storedBeadSize;
  document.getElementById('operation-mode').value = storedMode;

  applySettings();  // 設定を適用
});

// 設定をローカルストレージに保存
document.getElementById('apply-settings').addEventListener('click', function() {
  const numBeads = document.getElementById('num-beads').value;
  const beadSize = document.getElementById('bead-size').value;
  const operationMode = document.getElementById('operation-mode').value;

  localStorage.setItem('numBeads', numBeads);
  localStorage.setItem('beadSize', beadSize);
  localStorage.setItem('operationMode', operationMode);

  applySettings();
});

function applySettings() {
  const numBeads = document.getElementById('num-beads').value;
  const beadSize = document.getElementById('bead-size').value;
  const operationMode = document.getElementById('operation-mode').value;
  const soroban = document.getElementById('soroban');

  soroban.innerHTML = '';  // 既存のそろばんをクリア

  for (let i = 0; i < numBeads; i++) {
    const rod = document.createElement('div');
    rod.classList.add('rod');
    soroban.appendChild(rod);

    const topBead = document.createElement('div');
    topBead.classList.add('bead', 'top-bead');
    topBead.style.width = `${beadSize}cm`;
    topBead.style.height = `${beadSize}cm`;
    rod.appendChild(topBead);

    const bottomBeads = [];
    for (let j = 0; j < 4; j++) {
      const bottomBead = document.createElement('div');
      bottomBead.classList.add('bead', 'bottom-bead');
      bottomBead.style.width = `${beadSize}cm`;
      bottomBead.style.height = `${beadSize}cm`;
      rod.appendChild(bottomBead);
      bottomBeads.push(bottomBead);
    }

    // 初期位置を設定（珠を上に配置）
    topBead.style.top = '0';
    bottomBeads.forEach(bead => {
      bead.style.bottom = `${beadSize}cm`;  // 初期状態で珠が下に配置
    });
  }

  // 操作モードの選択
  if (operationMode === 'slide') {
    applySlideOperation();
  } else {
    applyTouchOperation();
  }
}

// スライド操作モード
function applySlideOperation() {
  const beads = document.querySelectorAll('.bead');
  beads.forEach(bead => {
    bead.addEventListener('mousedown', onSlideStart);
    bead.addEventListener('mousemove', onSlideMove);
  });
}

let beadBeingMoved = null;
let initialX = 0;

function onSlideStart(event) {
  beadBeingMoved = event.target;
  initialX = event.clientX;
}

function onSlideMove(event) {
  if (beadBeingMoved) {
    const deltaX = event.clientX - initialX;
    let newX = parseFloat(beadBeingMoved.style.left || 0) + deltaX;
    newX = Math.max(0, Math.min(2, newX));  // 桁内での動きに制限
    beadBeingMoved.style.left = `${newX}cm`;
    initialX = event.clientX;
  }
}

document.body.addEventListener('mouseup', () => {
  beadBeingMoved = null;
});

// タッチ操作モード
function applyTouchOperation() {
  const beads = document.querySelectorAll('.bead');
  beads.forEach(bead => {
    bead.addEventListener('touchstart', onTouchStart);
    bead.addEventListener('touchmove', onTouchMove);
  });
}

let initialY = 0;

function onTouchStart(event) {
  beadBeingMoved = event.target;
  initialY = event.touches[0].clientY;
}

function onTouchMove(event) {
  if (beadBeingMoved) {
    const deltaY = event.touches[0].clientY - initialY;
    let newY = parseFloat(beadBeingMoved.style.bottom || 0) + deltaY;
    newY = Math.min(5.5, Math.max(0, newY));  // 桁内での動きに制限
    beadBeingMoved.style.bottom = `${newY}cm`;
    initialY = event.touches[0].clientY;
  }
}

document.body.addEventListener('touchend', () => {
  beadBeingMoved = null;
});

applySettings();  // 初期設定適用
