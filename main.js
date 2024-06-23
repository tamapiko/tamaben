document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;

    switch (page) {
        case 'grade':
            loadGrades();
            break;
        case 'subject':
            loadSubjects();
            break;
        case 'unit':
            loadUnits();
            break;
        case 'download':
            loadDownload();
            break;
    }
});

function loadGrades() {
    fetch('drills.json')
        .then(response => response.json())
        .then(data => {
            const gradeButtonsContainer = document.getElementById('grade-buttons');
            data.grades.forEach(grade => {
                const button = document.createElement('button');
                button.textContent = grade.name;
                button.addEventListener('click', () => {
                    localStorage.setItem('selectedGrade', JSON.stringify(grade));
                    window.location.href = 'subject.html';
                });
                gradeButtonsContainer.appendChild(button);
            });
        })
        .catch(error => console.error('Error loading drills data:', error));
}

function loadSubjects() {
    const selectedGrade = JSON.parse(localStorage.getItem('selectedGrade'));
    if (!selectedGrade) {
        window.location.href = 'index.html';
        return;
    }

    const subjectMessage = document.getElementById('subject-message');
    subjectMessage.textContent = `${selectedGrade.name}の教科を選んでください`;

    const subjectButtonsContainer = document.getElementById('subject-buttons');
    selectedGrade.subjects.forEach(subject => {
        const button = document.createElement('button');
        button.textContent = subject.name;
        button.addEventListener('click', () => {
            localStorage.setItem('selectedSubject', JSON.stringify(subject));
            window.location.href = 'unit.html';
        });
        subjectButtonsContainer.appendChild(button);
    });

    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

function loadUnits() {
    const selectedGrade = JSON.parse(localStorage.getItem('selectedGrade'));
    const selectedSubject = JSON.parse(localStorage.getItem('selectedSubject'));
    if (!selectedGrade || !selectedSubject) {
        window.location.href = 'index.html';
        return;
    }

    const unitMessage = document.getElementById('unit-message');
    unitMessage.textContent = `${selectedGrade.name}の${selectedSubject.name}の単元を選んでください`;

    const unitButtonsContainer = document.getElementById('unit-buttons');
    selectedSubject.units.forEach(unit => {
        const button = document.createElement('button');
        button.textContent = unit.name;
        button.addEventListener('click', () => {
            localStorage.setItem('selectedUnit', JSON.stringify(unit));
            window.location.href = 'download.html';
        });
        unitButtonsContainer.appendChild(button);
    });

    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', () => {
        window.location.href = 'subject.html';
    });
}

function loadDownload() {
    const selectedGrade = JSON.parse(localStorage.getItem('selectedGrade'));
    const selectedSubject = JSON.parse(localStorage.getItem('selectedSubject'));
    const selectedUnit = JSON.parse(localStorage.getItem('selectedUnit'));

    if (!selectedGrade || !selectedSubject || !selectedUnit) {
        window.location.href = 'index.html';
        return;
    }

    const downloadMessage = document.getElementById('download-message');
    downloadMessage.textContent = `${selectedGrade.name}の${selectedSubject.name}の${selectedUnit.name}をダウンロードします`;

    const downloadButton = document.getElementById('download-button');
    downloadButton.addEventListener('click', () => {
        window.location.href = selectedUnit.file;
    });

    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', () => {
        window.location.href = 'unit.html';
    });
}
