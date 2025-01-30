// 初期設定のロード
document.addEventListener('DOMContentLoaded', function() {
  const storedBeads = localStorage.getItem('numBeads') || 5;
  const storedBeadSize = localStorage.getItem('beadSize') || 1;

  document.getElementById('num-beads').value = storedBeads;
  document.getElementById('bead-size').value = storedBeadSize;

  applySettings();  // 設定を適用
});

// 設定をローカルストレージに保存
document.getElementById('apply-settings').addEventListener('click', function() {
  const numBeads = document.getElementById('num-beads').value;
  const beadSize = document.getElementById('bead-size').value;

  localStorage.setItem('numBeads', numBeads);
  localStorage.setItem('beadSize', beadSize);

  applySettings();
});

function applySettings() {
  const numBeads = document.getElementById('num-beads').value;
  const beadSize = document.getElementById('bead-size').value;
  const soroban = document.getElementById('soroban');

  soroban.innerHTML = '';  // 既存のそろばんをクリア

  for (let i = 0; i < numBeads; i++) {
    const rod = document.createElement('div');
    rod.classList.add('rod');
    soroban.appendChild(rod);

    const bead1 = document.createElement('div');
    bead1.classList.add('bead');
    bead1.style.width = `${beadSize}cm`;
    bead1.style.height = `${beadSize}cm`;
    rod.appendChild(bead1);

    const bead2 = document.createElement('div');
    bead2.classList.add('bead');
    bead2.style.width = `${beadSize}cm`;
    bead2.style.height = `${beadSize}cm`;
    bead2.style.bottom = `${beadSize * 2}cm`;  // 上部の珠
    rod.appendChild(bead2);
  }

  // タッチ操作の設定
  const beads = document.querySelectorAll('.bead');
  beads.forEach(bead => {
    bead.addEventListener('touchstart', onTouchStart);
    bead.addEventListener('touchmove', onTouchMove);
  });
}

let initialY = 0;
let beadBeingMoved = null;

function onTouchStart(event) {
  beadBeingMoved = event.target;
  initialY = event.touches[0].clientY;
}

function onTouchMove(event) {
  if (beadBeingMoved) {
    const deltaY = event.touches[0].clientY - initialY;
    let newY = parseFloat(beadBeingMoved.style.bottom || 0) + deltaY;
    newY = Math.min(5.5, Math.max(0, newY));  // limit the movement within the rod
    beadBeingMoved.style.bottom = `${newY}cm`;
    initialY = event.touches[0].clientY;
  }
}

document.body.addEventListener('touchend', () => {
  beadBeingMoved = null;
});

applySettings();  // 初期設定適用
