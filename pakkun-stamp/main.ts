import '../css/main.css';

const APP_KEY = 'medicine_reward_app_v2';

interface Config {
    dosesPerDay: number;
    durationDays: number;
    totalSlots: number;
    testMode: boolean;
    startOffset: number;
}

interface Progress {
    stamps: number;
    timestamps: (string | 'SKIPPED')[];
    lastStampTime: string | null;
}

interface TabState {
    config: Config | null;
    progress: Progress;
}

interface AppState {
    currentTab: number;
    tabs: TabState[];
}

const state: AppState = {
    currentTab: 0,
    tabs: [
        { config: null, progress: { stamps: 0, timestamps: [], lastStampTime: null } },
        { config: null, progress: { stamps: 0, timestamps: [], lastStampTime: null } },
        { config: null, progress: { stamps: 0, timestamps: [], lastStampTime: null } }
    ]
};

// DOM Elements
const views = {
    settings: document.getElementById('settings-view') as HTMLElement,
    main: document.getElementById('main-view') as HTMLElement
};

const forms = {
    settings: document.getElementById('settings-form') as HTMLFormElement
};

const elements = {
    dosesInput: document.getElementById('doses-per-day') as HTMLInputElement,
    durationInput: document.getElementById('duration-days') as HTMLInputElement,
    testModeInput: document.getElementById('test-mode') as HTMLInputElement,
    grid: document.getElementById('stamp-grid') as HTMLElement,
    remainingCount: document.getElementById('remaining-count') as HTMLElement,
    resetBtn: document.getElementById('reset-btn') as HTMLButtonElement,
    surpriseOverlay: document.getElementById('surprise-overlay') as HTMLElement,
    surpriseElement: document.getElementById('surprise-element') as HTMLElement,
    characterArea: document.getElementById('character-area') as HTMLElement,
    statusMessage: document.getElementById('status-message') as HTMLElement,
    tabBtns: document.querySelectorAll('.tab-btn') as NodeListOf<HTMLButtonElement>,
    manualModal: document.getElementById('manual-modal') as HTMLElement,
    openManualBtn: document.getElementById('open-manual-btn') as HTMLButtonElement,
    closeManualBtn: document.getElementById('close-manual-btn') as HTMLButtonElement,
};

// Initialization
function init() {
    loadState();
    setupTabs();
    setupManual();
    render();
}

function setupManual() {
    if (elements.openManualBtn) {
        elements.openManualBtn.addEventListener('click', () => {
            elements.manualModal.classList.remove('hidden');
        });
    }

    if (elements.closeManualBtn) {
        elements.closeManualBtn.addEventListener('click', () => {
            elements.manualModal.classList.add('hidden');
        });
    }

    // Close on outside click
    if (elements.manualModal) {
        elements.manualModal.addEventListener('click', (e) => {
            if (e.target === elements.manualModal) {
                elements.manualModal.classList.add('hidden');
            }
        });
    }
}

function loadState() {
    const saved = localStorage.getItem(APP_KEY);
    if (saved) {
        const parsed = JSON.parse(saved);
        // Migration check: if old format (no tabs array), migrate to tab 0
        if (!parsed.tabs) {
            state.tabs[0].config = parsed.config;
            state.tabs[0].progress = parsed.progress;
        } else {
            state.currentTab = parsed.currentTab || 0;
            state.tabs = parsed.tabs;
        }
    }
}

function saveState() {
    localStorage.setItem(APP_KEY, JSON.stringify(state));
}

function getCurrentTabState(): TabState {
    return state.tabs[state.currentTab];
}

function setupTabs() {
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabIndex = parseInt(btn.dataset.tab || '0');
            switchTab(tabIndex);
        });
    });
}

function switchTab(index: number) {
    state.currentTab = index;
    currentWeekIndex = 0; // Reset view for the new tab
    saveState();
    render();
}

let selectedMedicinesBuffer: (string | null)[] = [null, null, null, null, null, null];

function render() {
    // Update Tab UI
    elements.tabBtns.forEach(btn => {
        const tabIndex = parseInt(btn.dataset.tab || '0');
        btn.classList.toggle('active', tabIndex === state.currentTab);
    });

    const currentTabState = getCurrentTabState();

    // Switch View
    if (!currentTabState.config) {
        showView('settings');
        // Reset inputs
        if (elements.dosesInput) elements.dosesInput.value = '3';
        if (elements.durationInput) elements.durationInput.value = '7';
        if (elements.testModeInput) elements.testModeInput.checked = false;
        selectedMedicinesBuffer = [null, null, null, null, null, null];
    } else {
        showView('main');
        renderGrid();
        updateProgressInfo();
        updateCharacter();
        checkTimeLimit();
    }
}

function showView(viewName: keyof typeof views) {
    Object.values(views).forEach(el => el && el.classList.add('hidden'));
    if (views[viewName]) views[viewName].classList.remove('hidden');
}

// Settings Logic
if (forms.settings) {
    forms.settings.addEventListener('submit', (e) => {
        e.preventDefault();
        const doses = parseInt(elements.dosesInput.value);
        const days = parseInt(elements.durationInput.value);
        const testMode = elements.testModeInput.checked;

        const currentTabState = getCurrentTabState();

        currentTabState.config = {
            dosesPerDay: doses,
            durationDays: days,
            totalSlots: doses * days,
            testMode: testMode,
            startOffset: 0
        };

        // Reset progress on new config
        currentTabState.progress = {
            stamps: 0,
            timestamps: [],
            lastStampTime: null
        };

        // Reset internal view state
        currentWeekIndex = 0;

        saveState();
        render();
    });
}

function getMinIntervalHours(doses: number): number {
    if (doses === 1) return 12;
    if (doses === 2) return 6;
    if (doses === 3) return 4;
    return 1; // 4 or more times
}

function getEarliestReleaseTime(targetIndex: number): number {
    const currentTabState = getCurrentTabState();
    if (!currentTabState.config) return 0;

    const timestamps = currentTabState.progress.timestamps || [];
    const minHours = getMinIntervalHours(currentTabState.config.dosesPerDay);
    const intervalMs = minHours * 60 * 60 * 1000;

    if (targetIndex === 0) return 0;

    let minReleaseTime = Infinity;
    let foundAnchor = false;

    for (let i = 0; i < timestamps.length; i++) {
        const ts = timestamps[i];
        if (ts === 'SKIPPED') continue;

        const time = new Date(ts).getTime();
        const releaseTime = time + (targetIndex - i) * intervalMs;

        if (releaseTime < minReleaseTime) {
            minReleaseTime = releaseTime;
        }
        foundAnchor = true;
    }

    if (!foundAnchor) {
        return 0;
    }

    // Check for "Next Morning 6AM" rule
    const dosesPerDay = currentTabState.config.dosesPerDay;
    if (targetIndex > 0 && targetIndex % dosesPerDay === 0) {
        const prevIndex = targetIndex - 1;
        if (prevIndex < timestamps.length) {
            const prevVal = timestamps[prevIndex];
            if (prevVal !== 'SKIPPED') {
                const prevDate = new Date(prevVal);
                let nextMorning = new Date(prevDate);

                if (prevDate.getHours() < 6) {
                    nextMorning.setHours(6, 0, 0, 0);
                } else {
                    nextMorning.setDate(nextMorning.getDate() + 1);
                    nextMorning.setHours(6, 0, 0, 0);
                }

                if (nextMorning.getTime() > minReleaseTime) {
                    minReleaseTime = nextMorning.getTime();
                }
            }
        }
    }

    return minReleaseTime;
}

function canStamp(): boolean {
    const currentTabState = getCurrentTabState();
    if (!currentTabState.config) return false;
    if (currentTabState.config.testMode) return true;
    if (!currentTabState.progress.lastStampTime) return true;

    const last = new Date(currentTabState.progress.lastStampTime).getTime();
    const now = new Date().getTime();
    const minHours = getMinIntervalHours(currentTabState.config.dosesPerDay);

    return (now - last) >= (minHours * 60 * 60 * 1000);
}

let updateTimer: any = null;
function scheduleNextUpdate() {
    if (updateTimer) clearTimeout(updateTimer);

    const currentTabState = getCurrentTabState();
    if (!currentTabState.config || !currentTabState.progress.lastStampTime) return;

    const last = new Date(currentTabState.progress.lastStampTime).getTime();
    const minHours = getMinIntervalHours(currentTabState.config.dosesPerDay);
    const nextTime = last + (minHours * 60 * 60 * 1000);
    const now = new Date().getTime();
    const delay = nextTime - now;

    if (delay > 0) {
        if (delay < 2147483647) {
            updateTimer = setTimeout(() => {
                render();
                playHappySound();
            }, delay + 1000);
        }
    }
}

function checkTimeLimit() {
    const currentTabState = getCurrentTabState();
    if (!currentTabState.config) return;
    const messageEl = elements.statusMessage;

    if (currentTabState.progress.stamps >= currentTabState.config.totalSlots) {
        messageEl.textContent = "コンプリートおめでとう！";
        messageEl.className = "status-ok";
        return;
    }

    if (!canStamp()) {
        messageEl.textContent = "まだお薬の時間じゃないよ";
        messageEl.className = "status-wait";
        return;
    }

    messageEl.textContent = "お薬飲めたかな？";
    messageEl.className = "status-ok";
}

let currentWeekIndex = 0;

function calculateCurrentWeek() {
    const currentTabState = getCurrentTabState();
    if (!currentTabState.config) return;
    const totalDays = currentTabState.config.durationDays;
    const dosesPerDay = currentTabState.config.dosesPerDay;
    const currentStamps = currentTabState.progress.stamps;

    let currentDayIndex = Math.floor(currentStamps / dosesPerDay);
    if (currentDayIndex >= totalDays) currentDayIndex = totalDays - 1;

    currentWeekIndex = Math.floor(currentDayIndex / 7);
}

function renderGrid() {
    if (typeof currentWeekIndex === 'undefined') {
        currentWeekIndex = 0;
    }

    if (elements.grid) elements.grid.innerHTML = '';

    const currentTabState = getCurrentTabState();
    if (!currentTabState.config) return;

    const totalDays = currentTabState.config.durationDays;
    const totalWeeks = Math.ceil(totalDays / 7);

    const controls = document.createElement('div');
    controls.className = 'pagination-controls';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn-nav';
    prevBtn.textContent = '← 前の週';
    prevBtn.disabled = currentWeekIndex === 0;
    prevBtn.onclick = () => { currentWeekIndex--; renderGrid(); };

    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn-nav';
    nextBtn.textContent = '次の週 →';
    nextBtn.disabled = currentWeekIndex >= totalWeeks - 1;
    nextBtn.onclick = () => { currentWeekIndex++; renderGrid(); };

    controls.appendChild(prevBtn);
    controls.appendChild(nextBtn);
    if (elements.grid) elements.grid.appendChild(controls);

    const dosesPerDay = currentTabState.config.dosesPerDay;
    const currentStamps = currentTabState.progress.stamps;
    const timestamps = currentTabState.progress.timestamps || [];
    const startOffset = currentTabState.config.startOffset || 0;

    const startDay = currentWeekIndex * 7 + 1;
    const endDay = Math.min(startDay + 6, totalDays);

    let slotCounter = (startDay - 1) * dosesPerDay;

    for (let day = startDay; day <= endDay; day++) {
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';

        const label = document.createElement('div');
        label.className = 'day-label';
        label.textContent = `${day} 日目`;
        dayCard.appendChild(label);

        const slotsContainer = document.createElement('div');
        slotsContainer.className = 'day-slots';

        // let hasVisibleSlots = false; // Unused variable removed

        for (let dose = 0; dose < dosesPerDay; dose++) {
            const slotIndex = slotCounter;

            if (slotIndex >= currentTabState.config.totalSlots) {
                break;
            }

            const slot = document.createElement('div');
            slot.className = 'stamp-slot';

            if (slotIndex < startOffset) {
                slot.style.visibility = 'hidden';
            } else {
                // hasVisibleSlots = true; // Unused variable removed
                const effectiveIndex = slotIndex - startOffset;

                if (effectiveIndex < 0) {
                    slot.style.visibility = 'hidden';
                } else {
                    if (effectiveIndex < timestamps.length) {
                        const status = timestamps[effectiveIndex];
                        if (status === 'SKIPPED') {
                            slot.classList.add('skipped');
                            slot.textContent = 'Skip';
                            slot.addEventListener('click', () => handleSlotClick(slotIndex));
                        } else {
                            slot.classList.add('stamped');
                            const mark = document.createElement('div');
                            mark.className = 'stamp-mark';
                            slot.appendChild(mark);
                        }
                    } else {
                        if (effectiveIndex === timestamps.length) {
                            if (canStamp()) {
                                slot.classList.add('next-slot');
                            } else {
                                slot.classList.add('wait-slot');
                                scheduleNextUpdate();
                            }
                        } else if (effectiveIndex > timestamps.length) {
                            if (canStamp()) {
                                const releaseTime = getEarliestReleaseTime(effectiveIndex);
                                const now = new Date().getTime();
                                if (now >= releaseTime) {
                                    slot.classList.add('skip-slot');
                                    slot.style.borderColor = 'var(--primary-color)';
                                } else {
                                    slot.classList.add('wait-slot');
                                }
                            } else {
                                slot.classList.add('wait-slot');
                            }
                        }
                        slot.addEventListener('click', () => handleSlotClick(slotIndex));
                    }
                }
            }

            slotsContainer.appendChild(slot);
            slotCounter++;
        }

        if (slotsContainer.children.length > 0) {
            dayCard.appendChild(slotsContainer);
            if (elements.grid) elements.grid.appendChild(dayCard);
        }
    }
}

function updateProgressInfo() {
    const currentTabState = getCurrentTabState();
    if (!currentTabState.config) return;

    const startOffset = currentTabState.config.startOffset || 0;
    const remaining = (currentTabState.config.totalSlots - startOffset) - currentTabState.progress.stamps;
    if (elements.remainingCount) elements.remainingCount.textContent = remaining.toString();
}

function updateCharacter() {
    if (!elements.characterArea) return;
    const img = document.createElement('img');
    img.src = 'images/doctor_bear.png';
    img.className = 'character-img';
    elements.characterArea.innerHTML = '';
    elements.characterArea.appendChild(img);
}

function handleSlotClick(clickedIndex: number) {
    const currentTabState = getCurrentTabState();
    if (!currentTabState.config) return;

    const currentStamps = currentTabState.progress.stamps;
    const startOffset = currentTabState.config.startOffset || 0;

    if (currentStamps === 0 && startOffset === 0) {
        const dosesPerDay = currentTabState.config.dosesPerDay;
        if (clickedIndex < dosesPerDay) {
            if (clickedIndex > 0) {
                if (confirm(`${clickedIndex + 1} 回目からスタートしますか？\n前の${clickedIndex} 回分はスキップされ、期間が延長されます。`)) {
                    currentTabState.config.startOffset = clickedIndex;
                    currentTabState.config.totalSlots += clickedIndex;
                    currentTabState.config.durationDays = Math.ceil(currentTabState.config.totalSlots / dosesPerDay);

                    saveState();
                    handleStamp();
                    return;
                } else {
                    return;
                }
            } else {
                handleStamp();
                return;
            }
        }
    }

    const expectedIndex = startOffset + currentStamps;

    if (clickedIndex < expectedIndex) {
        const effectiveIndex = clickedIndex - startOffset;
        if (effectiveIndex >= 0 && currentTabState.progress.timestamps[effectiveIndex] === 'SKIPPED') {
            if (confirm('このスキップを取り消して、現在時刻でスタンプしますか？')) {
                currentTabState.progress.timestamps[effectiveIndex] = new Date().toISOString();
                saveState();
                render();
            }
        }
        return;
    }

    if (!canStamp()) {
        playErrorSound();
        alert('まだ早いよ！次のお薬の時間まで待ってね。');
        return;
    }

    if (clickedIndex > expectedIndex) {
        const skippedCount = clickedIndex - expectedIndex;
        if (confirm(`間の ${skippedCount} 回分をスキップして、ここを記録しますか？`)) {
            for (let i = 0; i < skippedCount; i++) {
                currentTabState.progress.stamps++;
                currentTabState.progress.timestamps.push('SKIPPED');
            }
            handleStamp();
        }
        return;
    }

    handleStamp();
}

function handleStamp() {
    const currentTabState = getCurrentTabState();
    if (!currentTabState.config) return;

    currentTabState.progress.stamps++;
    currentTabState.progress.timestamps.push(new Date().toISOString());
    currentTabState.progress.lastStampTime = new Date().toISOString();
    saveState();

    triggerSurprise();

    const dosesPerDay = currentTabState.config.dosesPerDay;
    const startOffset = currentTabState.config.startOffset || 0;

    const currentVisualIndex = startOffset + currentTabState.progress.stamps - 1;
    const currentDay0Indexed = Math.floor(currentVisualIndex / dosesPerDay);
    const newWeekIndex = Math.floor(currentDay0Indexed / 7);

    if (newWeekIndex !== currentWeekIndex) {
        const currentEndDay0Indexed = (currentWeekIndex * 7) + 6;
        if (currentDay0Indexed > currentEndDay0Indexed) {
            currentWeekIndex++;
        }
    }

    render();

    if ((currentTabState.progress.stamps + startOffset) >= currentTabState.config.totalSlots) {
        setTimeout(triggerCompletion, 1000);
    }
}

if (elements.resetBtn) {
    elements.resetBtn.addEventListener('click', () => {
        if (confirm('本当にリセットしますか？これまでの記録は消えてしまいます。')) {
            const currentTabState = getCurrentTabState();
            currentTabState.config = null;
            currentTabState.progress = { stamps: 0, timestamps: [], lastStampTime: null };
            currentWeekIndex = 0;
            saveState();
            render();
        }
    });
}

const surprises = [
    spawnConfetti,
    showFloatingEmojis,
    flashScreen,
    showBigStamp,
    showBigStamp
];

const praiseMessages = [
    "ハイタッチして『ゴックン、かっこよかったよ！』",
    "ぎゅーっと抱きしめて『最後までがんばったね！』",
    "目をしっかり見て『お口を大きく開けられたね！』",
    "頭をなでながら『苦いのに挑戦してえらかったね』",
    "一緒に万歳して『お薬パワー、注入完了だね！』",
    "笑顔で『自分から準備してくれて、パパ/ママ助かっちゃった』",
    "鼻をちょんと触って『勇気の音が聞こえたよ！』",
    "肩をトントンして『座って飲めて、お兄さん/お姉さんみたい』",
    "『すごい！』と驚いた顔をして、お子様と目を合わせる",
    "手を握って『一緒にがんばれて嬉しいな』",
    "『バイバイキン！』と言いながら、空に向かって手を振る",
    "お子様のほっぺに優しく触れて『ピカピカのお口だね』",
    "親指を立てて（Good!）『今の飲み方、100点満点！』",
    "『お薬さんとお友達になれたね』と優しくささやく",
    "カレンダーを一緒に指さして『また一歩、元気に近づいたね』",
    "『お薬パワーで体が喜んでるよ』とお腹を優しくさする",
    "『魔法のゴックンだね！』と拍手する",
    "お子様の目線に合わせてしゃがみ『勇気を見せてくれてありがとう』",
    "『バイキンマンが逃げていったよ！』と窓の外を指さす",
    "『お薬のチャンピオンだ！』と王冠を乗せるジェスチャーをする",
    "『喉を通る音が聞こえたよ、上手！』と喉を優しく指さす",
    "『パパ/ママも元気が出てきた！』とお子様に抱きつく",
    "『お薬の時間を覚えててくれて、びっくりしたよ』と褒める",
    "『お水も上手に使えたね』とコップを持つ手を褒める",
    "『お薬の妖精さんが拍手してるよ』と耳をすます真似をする",
    "『今のゴックン、もう一回見たいくらい上手だった！』",
    "『お顔がキラキラしてきたね』と鏡を一緒に見る",
    "『強い心が見えたよ』と胸に手を当てる",
    "『お薬の階段、また一つ登ったね』と指で階段を作る",
    "『明日は何して遊ぼうか？』と未来の楽しい話を添える",
    "『お薬を飲む姿、動画に撮っておきたいくらいだよ』",
    "『お口の準備が早くて助かるな』と準備の早さを褒める",
    "『苦いのも、勇気でペロリだったね』",
    "『お薬のスペシャリストだね！』と敬礼する",
    "『体がどんどん強くなってるよ』と力こぶのポーズをする",
    "『お薬の冒険、今日の分はクリアだね！』",
    "『ニコニコで飲んでくれて、ママ/パパもニコニコになっちゃう』",
    "『お薬の神様が、がんばりカードを見てるよ』",
    "『自分でお薬を持てたね、すごい！』と手の動きを褒める",
    "『お薬の匂いも平気なんだね、かっこいい！』",
    "『お薬の魔法使いみたいだね』とステッキを振る真似をする",
    "『がんばった証のスタンプ、自分で押してみる？』",
    "『お薬の味がしても、最後まで飲めたね』と粘り強さを褒める",
    "『お口の中が綺麗になったね』とライトで照らす真似をして遊ぶ",
    "『お薬の達人だ！』と大げさに驚いて見せる",
    "『お薬の山、ひょいっと越えちゃったね』",
    "『勇気のしずく、全部届いたよ』",
    "『お薬のゴールまであと少し、一緒に走ろう！』",
    "『世界一のがんばり屋さんだね』とほっぺにチューする",
    "『お薬飲めたね！』と全力で喜びを表現する"
];

function triggerSurprise() {
    playHappySound();

    if (elements.characterArea) {
        elements.characterArea.innerHTML = '<img src="images/nurse_rabbit.png" class="character-img" />';
    }

    const praise = praiseMessages[Math.floor(Math.random() * praiseMessages.length)];
    showPraiseMessage(praise);

    if (Math.random() < 0.1) {
        showRareEffect();
    } else {
        const effect = surprises[Math.floor(Math.random() * surprises.length)];
        effect();
    }
}

function showPraiseMessage(message: string) {
    // const overlay = elements.surpriseOverlay; // Unused variable removed
    // const content = elements.surpriseElement; // Unused variable removed

    const bubble = document.createElement('div');
    bubble.className = 'praise-bubble';
    bubble.textContent = message;

    document.body.appendChild(bubble);

    requestAnimationFrame(() => {
        bubble.classList.add('show');
    });

    setTimeout(() => {
        bubble.classList.remove('show');
        setTimeout(() => bubble.remove(), 500);
    }, 6000);
}

function showRareEffect() {
    const stampText = '👑';
    for (let i = 0; i < 20; i++) {
        const el = document.createElement('div');
        el.className = 'rare-stamp-effect';
        el.textContent = stampText;
        el.style.left = Math.random() * 100 + 'vw';
        el.style.top = -50 + 'px';
        el.style.animationDuration = (2 + Math.random() * 2) + 's';
        el.style.animationDelay = Math.random() + 's';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 4000);
    }

    playRareSound();
}

function showBigStamp() {
    const stamps = ['💮', '💯', '👍', '👑', '🌈', '💊', '✨', '🐰', '🐻'];
    const stampText = stamps[Math.floor(Math.random() * stamps.length)];

    const stamp = document.createElement('div');
    stamp.textContent = stampText;
    stamp.className = 'big-stamp-effect';
    document.body.appendChild(stamp);
    setTimeout(() => stamp.remove(), 3000);
}

function playHappySound() {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const freq = 523.25 + Math.random() * 523.25;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 2, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
}

function playRareSound() {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq;
        osc.type = 'triangle';

        const start = ctx.currentTime + i * 0.1;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.1, start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.4);
    });
}

function playErrorSound() {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
}

function spawnConfetti() {
    const icons = ['💊', '💖', '⭐', '🔷', '🌸', '✨', '🍬', '🎈', '🧸', '💊'];
    const shapes = ['■', '▲', '●', '★', '♦', '❤'];
    const colors = ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA', '#FFD700', '#FF69B4'];

    const container = document.body;

    for (let i = 0; i < 30; i++) {
        const el = document.createElement('div');
        const isIcon = Math.random() > 0.6;

        if (isIcon) {
            el.className = 'confetti confetti-icon';
            el.textContent = icons[Math.floor(Math.random() * icons.length)];
            el.style.fontSize = (1.5 + Math.random()) + 'rem';
        } else {
            el.className = 'confetti confetti-shape';
            el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
            el.style.color = colors[Math.floor(Math.random() * colors.length)];
            el.style.fontSize = (0.8 + Math.random() * 0.8) + 'rem';
        }

        el.style.left = Math.random() * 100 + 'vw';
        el.style.top = -50 + 'px';
        el.style.animationDuration = (3 + Math.random() * 3) + 's';
        el.style.animationDelay = Math.random() + 's';

        container.appendChild(el);
        setTimeout(() => el.remove(), 6000);
    }
}

function showFloatingEmojis() {
    const emojis = ['🧸', '💊', '✨', '👍', '🐻', '🐰', '💖', '🎉'];
    const container = document.getElementById('app') || document.body;

    for (let i = 0; i < 20; i++) {
        const el = document.createElement('div');
        el.className = 'floating-emoji';
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        el.style.left = (10 + Math.random() * 80) + '%';
        el.style.top = (50 + Math.random() * 30) + '%';

        const duration = 4 + Math.random() * 3;
        el.style.animationDuration = `${duration}s`;
        el.style.animationDelay = Math.random() * 0.5 + 's';

        container.appendChild(el);
        setTimeout(() => el.remove(), duration * 1000 + 500);
    }
}

function flashScreen() {
    const app = document.getElementById('app') || document.body;
    app.classList.add('gradient-flash-effect');
    setTimeout(() => app.classList.remove('gradient-flash-effect'), 3000);
}

function triggerCompletion() {
    playFanfare();

    const overlay = document.getElementById('surprise-overlay');
    const content = document.getElementById('surprise-element');

    if (!overlay || !content) return;

    const today = new Date();
    const dateStr = `${today.getFullYear()}年 ${today.getMonth() + 1}月 ${today.getDate()}日`;

    content.innerHTML = `
        <div class="completion-modal certificate-modal">
            <div class="certificate-border">
                <div class="certificate-header">
                    <span class="certificate-icon">🏆</span>
                    <h2>がんばったで賞</h2>
                    <span class="certificate-icon">🏆</span>
                </div>
                
                <div class="certificate-body">
                    <p class="certificate-text">
                        あなたは、おくすりを<br>
                        さいごまでしっかりのんで<br>
                        びょうきとたたかいました。
                    </p>
                    <p class="certificate-text">
                        そのゆうきと<br>
                        がんばりをたたえます。
                    </p>
                    
                    <div class="certificate-name-area">
                        <label>お名前:</label>
                        <input type="text" class="certificate-name-input" placeholder="ここになまえをかいてね" />
                    </div>
                    
                    <div class="certificate-date">
                        ${dateStr}
                    </div>
                    
                    <div class="certificate-characters">
                        <div class="character-signature">
                            <img src="images/doctor_bear.png" alt="くま先生">
                            <span>くま先生</span>
                        </div>
                        <div class="character-signature">
                            <img src="images/nurse_rabbit.png" alt="うさぎ看護師">
                            <span>うさぎ看護師</span>
                        </div>
                        <div class="character-signature">
                            <img src="images/pharmacist_cat.png" alt="ねこ薬剤師">
                            <span>ねこ薬剤師</span>
                        </div>
                    </div>
                </div>

                <div class="no-print">
                    <button id="print-cert-btn" class="btn-secondary" style="margin-right: 10px;">🖨️ 賞状を印刷する</button>
                    <button id="reset-cert-btn" class="btn-primary">もういっかい！</button>
                </div>
            </div>
        </div>
    `;

    flashScreen();
    showFloatingEmojis();

    for (let i = 0; i < 8; i++) {
        setTimeout(spawnConfetti, i * 300);
    }

    setTimeout(() => {
        document.querySelectorAll('.confetti, .floating-emoji, .rare-stamp-effect, .big-stamp-effect').forEach(el => el.remove());

        overlay.classList.remove('hidden');
        overlay.classList.add('active');
        overlay.classList.add('show');

        const printBtn = document.getElementById('print-cert-btn');
        const resetBtn = document.getElementById('reset-cert-btn');

        if (printBtn) {
            printBtn.addEventListener('click', () => window.print());
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                const currentTabState = getCurrentTabState();
                currentTabState.config = null;
                currentTabState.progress = { stamps: 0, timestamps: [], lastStampTime: null };
                currentWeekIndex = 0;
                saveState();
                location.reload();
            });
        }
    }, 9500);
}

function playFanfare() {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;
    [261.63, 329.63, 392.00, 523.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(ctx.destination);
        const start = now + i * 0.1;
        gain.gain.setValueAtTime(0.1, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.5);
        osc.start(start);
        osc.stop(start + 0.5);
    });
}

window.addEventListener('load', () => {
    const currentTabState = getCurrentTabState();
    if (currentTabState && currentTabState.config && currentTabState.progress.stamps > 0) {
        calculateCurrentWeek();
    }
});

init();
