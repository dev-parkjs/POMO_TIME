let workTime = 0, restTime = 0, currentTotal = 0;
let defaultWork = 0, defaultRest = 0;
let currentSet = 0, totalSets = 4;
let isWorking = true, isPaused = false, timer = null;

function startPomodoro() {
    defaultWork = parseInt(document.getElementById('work-input').value) * 60;
    defaultRest = parseInt(document.getElementById('rest-input').value) * 60;
    totalSets = parseInt(document.getElementById('sets-input').value);

    workTime = defaultWork;
    restTime = defaultRest;
    currentTotal = defaultWork;
    isWorking = true;
    isPaused = false;
    currentSet = 1;

    updateSetInfo();
    updateTime('work-time', workTime);
    updateTime('rest-time', restTime);
    document.getElementById('pause-btn').textContent = '⏸ PAUSE';

    switchScreen('ing');
    startTimer();
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        if (isWorking) {
            workTime--;
            currentTotal--;
            updateTime('work-time', workTime);
            updateProgress(defaultWork, currentTotal);
            if (workTime <= 0) {
                // ✅ Work 세션 기록
                saveSessionToServer('Work', defaultWork / 60, defaultWork);

                isWorking = false;
                currentTotal = defaultRest;
                document.getElementById('status-label').textContent = 'REST';
                showAlert('Work 끝! 휴식하세요 🍵');
            }
        } else {
            restTime--;
            currentTotal--;
            updateTime('rest-time', restTime);
            updateProgress(defaultRest, currentTotal);
            if (restTime <= 0) {
                // ✅ 마지막 세트면 Rest도 기록
                if (currentSet >= totalSets) {
                    saveSessionToServer('Rest', defaultRest / 60, defaultRest);
                }

                currentSet++;
                updateSetInfo();
                if (currentSet > totalSets) {
                    clearInterval(timer);
                    switchScreen('done');
                    return;
                }
                isWorking = true;
                workTime = defaultWork;
                restTime = defaultRest;
                currentTotal = defaultWork;
                document.getElementById('status-label').textContent = 'WORK';
                showAlert('Rest 끝! 다시 집중 💪');
            }
        }
    }, 1000);
}

function updateProgress(total, current) {
    const percent = current / total;
    const offset = 440 * (1 - percent);
    const percentText = Math.round(percent * 100);

    document.getElementById('progress-ring').style.strokeDashoffset = offset;
    document.getElementById('progress-percent').textContent = `${percentText}%`;
}

function togglePause() {
    const btn = document.getElementById('pause-btn');
    if (isPaused) {
        startTimer();
        isPaused = false;
        btn.textContent = '⏸ PAUSE';
    } else {
        clearInterval(timer);
        isPaused = true;
        btn.textContent = '▶ RESUME';
    }
}

function updateTime(id, sec) {
    const min = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    const el = document.getElementById(id);
    if (el) el.textContent = `${min}:${s}`;
}

function updateSetInfo() {
    const el = document.getElementById('set-info');
    if (el) el.textContent = `${currentSet} / ${totalSets}세트`;
}

function showAlert(message) {
    const el = document.getElementById('alert-msg');
    if (el) {
        el.textContent = message;
        el.style.opacity = 1;
        setTimeout(() => {
            el.style.opacity = 0;
        }, 3000);
    }
}

function switchScreen(to) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    document.getElementById(`${to}-screen`).classList.add('active');
    if (to !== 'ing') clearInterval(timer);
}

function toggleDarkMode() {
    document.body.classList.toggle('dark');
}

// ✅ 서버로 세션 저장 (mode, duration(분), time("MM:SS"))
function saveSessionToServer(mode, duration, seconds) {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    const timeFormatted = `${min}:${sec}`;

    fetch('/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            mode: mode,
            duration: duration,
            time: timeFormatted
        })
    })
        .then(res => res.json())
        .then(data => console.log("✅ 세션 기록 저장됨:", data))
        .catch(err => console.error("❌ 세션 저장 실패:", err));
}