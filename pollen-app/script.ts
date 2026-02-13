import '../css/main.css';
import { CITIES } from './cities';
import { City, GlobalState } from './types';
import { initWeatherFeature, updateWeatherMarkers } from './weather';
import { initGA4 } from './analytics';

// External Libraries
declare const L: any;
declare const Chart: any;

// Configuration
const CONFIG = {
    API_ENDPOINT: 'https://wxtech.weathernews.com/opendata/v1/pollen',
    ZOOM_THRESHOLD: 11,
    CACHE_DURATION: 10 * 60 * 1000 // 10 minutes
};

const WORKER_URL = 'https://pollen-worker.neko-neko-0404.workers.dev';

// Global State
const state: GlobalState = {
    cache: {},
    currentDate: '',
    currentMode: 'hourly'
};

let currentOpenCity: City | null = null;
let map: any;
const markers: { [key: string]: any } = {};
const fetchedCities = new Set<string>();
let currentVisibleCityCodes = new Set<string>();
const pendingPollenRequests = new Set<string>();

// Helper: Debounce
function debounce(func: Function, wait: number) {
    let timeout: any;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Helper: Get JST Date String
function getJSTDateString(date = new Date()): string {
    const jstDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));
    return jstDate.toISOString().split('T')[0];
}

// Helper: Sanitize HTML
function sanitizeHTML(str: string): string {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Helper: Get Pollen Color
function getPollenColor(count: number, isPast = false): string {
    if (isPast) {
        if (count >= 300) return '#9C27B0';
        if (count >= 150) return '#f44336';
        if (count >= 90) return '#FFEB3B';
        if (count >= 30) return '#2196F3';
        return '#FFFFFF';
    } else {
        if (count >= 30) return '#9C27B0';
        if (count >= 15) return '#f44336';
        if (count >= 9) return '#FFEB3B';
        if (count >= 3) return '#2196F3';
        return '#FFFFFF';
    }
}

// Helper: Fetch Pollen Data
interface PollenData {
    date: Date;
    dateKey: string;
    pollen: number;
}

async function fetchData(cityCode: string, start: string, end: string): Promise<PollenData[]> {
    const cacheKey = `${cityCode}-${start}-${end}`;
    const now = Date.now();

    if (state.cache[cacheKey] && (now - state.cache[cacheKey].timestamp < CONFIG.CACHE_DURATION)) {
        return state.cache[cacheKey].data;
    }

    try {
        const response = await fetch(`${CONFIG.API_ENDPOINT}?citycode=${cityCode}&start=${start}&end=${end}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const text = await response.text();

        const rows = text.trim().split('\n').slice(1);
        const data: PollenData[] = rows.map(row => {
            const [code, dateStr, pollenStr] = row.split(',');
            let pollen = parseInt(pollenStr, 10);
            if (isNaN(pollen) || pollen < 0) pollen = -1;

            const date = new Date(dateStr);
            const dateKey = dateStr.split('T')[0];

            return { date, dateKey, pollen };
        });

        state.cache[cacheKey] = { data, timestamp: now };
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
}

// --- Notification Manager ---
const NotificationManager = {
    settingsKey: 'pollen_notification_settings',
    checkInterval: 15 * 60 * 1000,
    timerId: null as any,

    init() {
        this.registerServiceWorker();
        this.setupEventListeners();
        this.startMonitoring();
        this.updateRegisteredLocationUI();
        this.unlockAudio();
    },

    unlockAudio() {
        const unlock = () => {
            this.playNotificationSound(true);
            window.removeEventListener('click', unlock);
            window.removeEventListener('touchstart', unlock);
            console.log('Audio unlocked');
        };
        window.addEventListener('click', unlock);
        window.addEventListener('touchstart', unlock);
    },

    setupEventListeners() {
        const modal = document.getElementById('notification-modal');
        const closeBtn = document.getElementById('notification-close-btn');
        const saveBtn = document.getElementById('btn-save-notification');
        const testBtn = document.getElementById('btn-test-notification');
        const clearBtn = document.getElementById('btn-clear-notification');

        const guideModal = document.getElementById('guide-modal');
        const guideCloseBtn = document.getElementById('guide-close-btn');
        const guideOpenBtn = document.getElementById('btn-open-guide');

        if (closeBtn && modal) closeBtn.onclick = () => modal.classList.remove('show');
        if (guideCloseBtn && guideModal) guideCloseBtn.onclick = () => guideModal.classList.remove('show');
        if (guideOpenBtn && guideModal) guideOpenBtn.onclick = () => guideModal.classList.add('show');

        window.addEventListener('click', (e) => {
            if (e.target === modal && modal) modal.classList.remove('show');
            if (guideModal && e.target === guideModal) guideModal.classList.remove('show');
        });

        if (saveBtn) saveBtn.addEventListener('click', () => this.saveSettings());
        if (testBtn) testBtn.addEventListener('click', () => this.testNotification());
        if (clearBtn) clearBtn.addEventListener('click', () => this.clearSettings());

        const jumpBtn = document.getElementById('btn-jump-to-registered');
        const editBtn = document.getElementById('btn-edit-registered');

        if (jumpBtn) jumpBtn.addEventListener('click', () => this.jumpToRegisteredLocation());
        if (editBtn) editBtn.addEventListener('click', () => {
            const settings = this.getSettings();
            if (settings) this.openSettings(settings.cityCode, settings.cityName);
        });
    },

    openSettings(cityCode: string, cityName: string) {
        const modal = document.getElementById('notification-modal');
        const targetCitySpan = document.getElementById('notification-target-city');
        const hourlyInput = document.getElementById('threshold-hourly') as HTMLInputElement;
        const dailyInput = document.getElementById('threshold-daily') as HTMLInputElement;
        const soundCheckbox = document.getElementById('enable-sound') as HTMLInputElement;
        const voiceCheckbox = document.getElementById('enable-voice') as HTMLInputElement;
        const clearBtn = document.getElementById('btn-clear-notification');

        if (!modal || !targetCitySpan || !hourlyInput || !dailyInput || !soundCheckbox || !voiceCheckbox || !clearBtn) return;

        const settings = this.getSettings();

        if (settings && settings.cityCode && settings.cityCode !== cityCode) {
            const confirmChange = confirm(
                `現在「${settings.cityName}」が登録されています。\n` +
                `「${cityName}」に変更しますか？\n\n` +
                `※1ユーザーにつき1か所のみ登録できます。`
            );
            if (!confirmChange) return;
        }

        targetCitySpan.textContent = cityName;
        targetCitySpan.dataset.code = cityCode;

        if (settings && settings.cityCode === cityCode) {
            hourlyInput.value = settings.thresholdHourly.toString();
            dailyInput.value = settings.thresholdDaily.toString();
            soundCheckbox.checked = settings.enableSound !== false;
            voiceCheckbox.checked = settings.enableVoice !== false;
            clearBtn.classList.remove('hidden');
        } else {
            hourlyInput.value = '30';
            dailyInput.value = '150';
            soundCheckbox.checked = true;
            voiceCheckbox.checked = true;
            clearBtn.classList.add('hidden');
        }

        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
        const notificationSupported = typeof Notification !== 'undefined';

        let warningMsg = '';
        if (isIOS) {
            if (!isStandalone) {
                warningMsg = '【重要】iPhoneでは、ブラウザを閉じている状態で通知を受け取るには「ホーム画面に追加」してアプリとして起動する必要があります。';
            } else {
                warningMsg = '※iPhone（ホーム画面起動中）: 通知が届かない場合は、本体の「設定 > 通知 > 花粉Radar」を確認してください。';
            }
        } else if (!notificationSupported) {
            warningMsg = '※お使いのブラウザはシステム通知に対応していません。アプリを開いている間のみアラートが表示されます。';
        }

        const warningElem = document.getElementById('notification-compatibility-warning');
        if (warningElem) {
            warningElem.textContent = warningMsg;
            warningElem.classList.toggle('hidden', !warningMsg);
            if (isIOS && !isStandalone) {
                warningElem.style.color = '#e11d48';
                warningElem.style.backgroundColor = '#fff1f2';
                warningElem.style.borderColor = '#fda4af';
            } else {
                warningElem.style.color = '';
                warningElem.style.backgroundColor = '';
                warningElem.style.borderColor = '';
            }
        }

        modal.classList.add('show');
    },

    getSettings() {
        const json = localStorage.getItem(this.settingsKey);
        return json ? JSON.parse(json) : null;
    },

    async saveSettings() {
        const targetCitySpan = document.getElementById('notification-target-city');
        const hourlyInput = document.getElementById('threshold-hourly') as HTMLInputElement;
        const dailyInput = document.getElementById('threshold-daily') as HTMLInputElement;
        const soundCheckbox = document.getElementById('enable-sound') as HTMLInputElement;
        const voiceCheckbox = document.getElementById('enable-voice') as HTMLInputElement;

        if (!targetCitySpan || !hourlyInput || !dailyInput || !soundCheckbox || !voiceCheckbox) return;

        const cityCode = targetCitySpan.dataset.code;
        const cityName = targetCitySpan.textContent || '';
        const thresholdHourly = parseInt(hourlyInput.value, 10);
        const thresholdDaily = parseInt(dailyInput.value, 10);
        const enableSound = soundCheckbox.checked;
        const enableVoice = voiceCheckbox.checked;

        if (!cityCode) return;

        if (typeof Notification !== 'undefined') {
            if (Notification.permission === 'default') {
                try {
                    await Notification.requestPermission();
                } catch (e) {
                    console.error('Error requesting notification permission:', e);
                }
            } else if (Notification.permission === 'denied') {
                alert('通知がブロックされています。ブラウザの設定から通知を許可してください。');
            }
        }

        const settings = {
            cityCode,
            cityName,
            thresholdHourly,
            thresholdDaily,
            enableSound,
            enableVoice,
            enableVibration: false,
            lastNotified: 0
        };

        localStorage.setItem(this.settingsKey, JSON.stringify(settings));

        const subscribed = await this.subscribeUser(settings);
        if (subscribed) {
            this.showToast(`通知設定を保存しました\n(アプリを閉じても通知が届きます)`);
        } else {
            this.showToast(`設定は保存されましたが、\nバックグラウンド通知の登録に失敗しました`, 'warning', 10000);
            alert('【注意】\n設定は保存されましたが、プッシュ通知の登録に失敗しました。');
        }

        const modal = document.getElementById('notification-modal');
        if (modal) modal.classList.remove('show');

        this.updateRegisteredLocationUI();
        this.startMonitoring();
        this.checkPollenLevels();
    },

    async clearSettings() {
        if (confirm('通知設定を解除しますか？')) {
            await this.unsubscribeUser();
            localStorage.removeItem(this.settingsKey);
            const modal = document.getElementById('notification-modal');
            if (modal) modal.classList.remove('show');
            this.showToast('通知設定を解除しました');
            this.updateRegisteredLocationUI();
            this.stopMonitoring();
        }
    },

    async testNotification() {
        console.log('Testing notification...');
        let permission = 'granted';
        if (typeof Notification !== 'undefined') {
            permission = await Notification.requestPermission();
        }

        if (permission === 'granted') {
            const settings = this.getSettings();
            const testCityName = settings ? settings.cityName : 'テスト地点';

            const soundCheckbox = document.getElementById('enable-sound') as HTMLInputElement;
            const voiceCheckbox = document.getElementById('enable-voice') as HTMLInputElement;
            const enableSound = soundCheckbox ? soundCheckbox.checked : true;
            const enableVoice = voiceCheckbox ? voiceCheckbox.checked : true;

            this.playNotificationSound(false, enableSound, enableVoice);
            this.vibrate();
            this.showToast(`${testCityName}の花粉の量が1時間あたり35個を観測しました。`, 'warning', 10000);

            if (typeof Notification !== 'undefined') {
                try {
                    const registration = await navigator.serviceWorker.ready;
                    const subscription = await registration.pushManager.getSubscription();
                    if (subscription) {
                        this.showToast('10秒後にバックグラウンド通知を送信します。', 'info', 10000);
                        const response = await fetch(`${WORKER_URL}/api/test-push`, {
                            method: 'POST',
                            body: JSON.stringify({ subscription }),
                            headers: { 'Content-Type': 'application/json' }
                        });
                        const resData = await response.json();
                        if (response.ok && resData.success) {
                            console.log('Backend test push request accepted');
                        } else {
                            console.error('Backend test push failed:', resData.error);
                            alert('クラウド通知の送信予約に失敗しました。');
                        }
                    } else {
                        alert('通知の登録が見つかりません。');
                    }
                } catch (error) {
                    console.error('Notification error:', error);
                }
            }
        } else {
            alert('通知の許可が得られませんでした。');
        }
    },

    playNotificationSound(silent = false, enableSound: boolean | null = null, enableVoice: boolean | null = null) {
        if (silent) return;

        if (enableSound === null || enableVoice === null) {
            const settings = this.getSettings();
            if (!settings) return;
            if (enableSound === null) enableSound = settings.enableSound !== false;
            if (enableVoice === null) enableVoice = settings.enableVoice !== false;
        }

        if (enableSound) this.playAlertSound();
        if (enableVoice) setTimeout(() => this.playVoiceNotification(), 800);
    },

    playAlertSound() {
        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const audioContext = new AudioContextClass();
            const now = audioContext.currentTime;

            const osc1 = audioContext.createOscillator();
            const gain1 = audioContext.createGain();
            osc1.connect(gain1);
            gain1.connect(audioContext.destination);
            osc1.frequency.value = 880;
            osc1.type = 'sine';
            gain1.gain.setValueAtTime(0.3, now);
            gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc1.start(now);
            osc1.stop(now + 0.2);

            const osc2 = audioContext.createOscillator();
            const gain2 = audioContext.createGain();
            osc2.connect(gain2);
            gain2.connect(audioContext.destination);
            osc2.frequency.value = 660;
            osc2.type = 'sine';
            gain2.gain.setValueAtTime(0, now + 0.15);
            gain2.gain.setValueAtTime(0.3, now + 0.15);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc2.start(now + 0.15);
            osc2.stop(now + 0.5);
        } catch (error) {
            console.error('Error playing alert sound:', error);
        }
    },

    playVoiceNotification() {
        try {
            const audio = new Audio('notification.mp3');
            audio.volume = 0.7;
            audio.play().catch(console.error);
        } catch (error) {
            console.error('Error creating audio:', error);
        }
    },

    vibrate() {
        if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
    },

    async registerServiceWorker() {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            try {
                const registration = await navigator.serviceWorker.register('./sw.js');
                console.log('Service Worker registered:', registration);
                return registration;
            } catch (error) {
                console.error('Service Worker registration failed:', error);
                return null;
            }
        }
        return null;
    },

    urlBase64ToUint8Array(base64String: string) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    },

    async getVapidKey() {
        try {
            const res = await fetch(`${WORKER_URL}/api/vapid-key`);
            if (!res.ok) throw new Error('Failed to get VAPID key');
            const data = await res.json();
            return data.publicKey ? data.publicKey.trim() : null;
        } catch (e) {
            console.error('Error fetching VAPID key:', e);
            return null;
        }
    },

    async subscribeUser(settings: any) {
        const registration = await navigator.serviceWorker.ready;
        if (!registration) return false;

        try {
            const publicKey = await this.getVapidKey();
            if (!publicKey) return false;

            const convertedVapidKey = this.urlBase64ToUint8Array(publicKey);
            const existingSubscription = await registration.pushManager.getSubscription();
            if (existingSubscription) await existingSubscription.unsubscribe();

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
            });

            await fetch(`${WORKER_URL}/api/subscribe`, {
                method: 'POST',
                body: JSON.stringify({ subscription, settings }),
                headers: { 'Content-Type': 'application/json' }
            });
            return true;
        } catch (err) {
            console.error('Failed to subscribe:', err);
            return false;
        }
    },

    async unsubscribeUser() {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
                await fetch(`${WORKER_URL}/api/unsubscribe`, {
                    method: 'POST',
                    body: JSON.stringify({ endpoint: subscription.endpoint }),
                    headers: { 'Content-Type': 'application/json' }
                });
                await subscription.unsubscribe();
            }
        } catch (e) {
            console.error('Error unsubscribing', e);
        }
    },

    startMonitoring() {
        this.stopMonitoring();
        const settings = this.getSettings();
        if (!settings) return;
        console.log(`Monitoring started for ${settings.cityName}`);
    },

    stopMonitoring() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    },

    async checkPollenLevels() {
        const settings = this.getSettings();
        if (!settings) return;

        const todayStr = getJSTDateString();
        const start = todayStr.replace(/-/g, '');
        const end = start;

        const data = await fetchData(settings.cityCode, start, end);
        if (!data || data.length === 0) return;

        const validData = data.filter(v => {
            const dStr = v.date.toISOString().split('T')[0];
            return dStr === todayStr && v.pollen >= 0;
        });

        if (validData.length === 0) return;

        const latestHourly = validData[validData.length - 1].pollen;
        const dailyTotal = validData.reduce((sum, item) => sum + item.pollen, 0);

        let trigger = false;
        const messages: string[] = [];
        const hourlyExceeded = latestHourly >= settings.thresholdHourly;
        const dailyExceeded = dailyTotal >= settings.thresholdDaily;

        if (hourlyExceeded) {
            trigger = true;
            messages.push(`${settings.cityName}の花粉の量が1時間あたり${latestHourly}個を観測しました。`);
        }

        if (dailyExceeded) {
            const lastDailyAlert = settings.lastDailyAlert || '';
            if (lastDailyAlert !== todayStr || hourlyExceeded) {
                trigger = true;
                messages.push(`${settings.cityName}の花粉の量が累積値${dailyTotal}個になりました。`);
                if (lastDailyAlert !== todayStr) {
                    settings.lastDailyAlert = todayStr;
                    localStorage.setItem(this.settingsKey, JSON.stringify(settings));
                }
            }
        }

        if (trigger) {
            if (settings.enableSound !== false) this.playNotificationSound();
            if (settings.enableVibration !== false) this.vibrate();

            const notificationBody = messages.join('\n');
            this.showToast(notificationBody, 'warning', 10000);

            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                try {
                    new Notification(`【花粉注意】${settings.cityName}`, { body: notificationBody, silent: true });
                } catch (e) {
                    console.error('System notification failed:', e);
                }
            }

            settings.lastNotified = Date.now();
            localStorage.setItem(this.settingsKey, JSON.stringify(settings));
        }
    },

    showToast(msg: string, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        const icon = document.createElement('i');
        icon.className = `fas ${type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}`;
        toast.appendChild(icon);
        toast.appendChild(document.createTextNode(' '));
        toast.appendChild(document.createTextNode(msg));
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('fade-out');
            toast.addEventListener('animationend', () => toast.remove());
        }, duration);
    },

    async updateRegisteredLocationUI() {
        const section = document.getElementById('registered-location-section');
        const cityNameSpan = document.getElementById('registered-city-name');
        const dot = document.getElementById('registered-pollen-dot');
        const countSpan = document.getElementById('registered-pollen-count');
        const settings = this.getSettings();

        if (section && settings && settings.cityCode) {
            if (cityNameSpan) cityNameSpan.textContent = settings.cityName;
            section.classList.remove('hidden');

            const marker = markers[settings.cityCode];
            if (marker && marker.maxPollen !== undefined && dot && countSpan) {
                dot.style.backgroundColor = getPollenColor(marker.maxPollen, marker.isPast);
                dot.classList.remove('hidden');
                countSpan.textContent = marker.maxPollen;
                countSpan.classList.remove('hidden');
            } else {
                try {
                    const todayJST = getJSTDateString();
                    const isToday = state.currentDate === todayJST;
                    const start = state.currentDate.replace(/-/g, '');
                    let endStr = start; // simplified
                    const data = await fetchData(settings.cityCode, start, endStr);

                    if (data && data.length > 0 && dot && countSpan) {
                        // Simplified display logic
                        let displayValue = 0;
                        if (isToday) {
                            const now = new Date();
                            const validData = data.filter(v => v.date <= now && v.pollen >= 0);
                            const latest = validData.length > 0 ? validData[validData.length - 1] : null;
                            displayValue = latest ? latest.pollen : 0;
                        } else {
                            displayValue = data.reduce((sum, item) => sum + (item.pollen > 0 ? item.pollen : 0), 0);
                        }

                        dot.style.backgroundColor = getPollenColor(displayValue, !isToday);
                        dot.classList.remove('hidden');
                        countSpan.textContent = displayValue.toString();
                        countSpan.classList.remove('hidden');
                    }
                } catch (e) { console.error(e); }
            }
        } else if (section) {
            section.classList.add('hidden');
        }
    },

    jumpToRegisteredLocation() {
        const settings = this.getSettings();
        if (!settings || !settings.cityCode) return;
        const city = CITIES.find(c => c.code === settings.cityCode);
        if (city && map) {
            map.setView([city.lat, city.lng], 10);
            setTimeout(() => {
                const marker = markers[city.code];
                if (marker) marker.openPopup();
            }, 500);
        }
    }
};

// --- Auto Update Manager ---
const AutoUpdateManager = {
    updateTimer: null as any,
    nextUpdateTime: null as Date | null,
    lastUpdateTime: null as Date | null,
    COOLDOWN_PERIOD: 5 * 60 * 1000,

    init() {
        this.scheduleNextUpdate();
    },

    calculateNextUpdateTime() {
        const now = new Date();
        const next = new Date(now);
        const randomMinutes = 10 + Math.floor(Math.random() * 4);
        const randomSeconds = Math.floor(Math.random() * 60);
        next.setMinutes(randomMinutes, randomSeconds, 0);
        if (now >= next) next.setHours(next.getHours() + 1);
        return next;
    },

    scheduleNextUpdate() {
        if (this.updateTimer) clearTimeout(this.updateTimer);
        this.nextUpdateTime = this.calculateNextUpdateTime();
        const timeUntilUpdate = this.nextUpdateTime.getTime() - Date.now();
        console.log(`[AutoUpdate] Next update in ${Math.round(timeUntilUpdate / 60000)}m`);
        this.updateTimer = setTimeout(() => {
            this.performUpdate();
            this.scheduleNextUpdate();
        }, timeUntilUpdate);
    },

    async performUpdate() {
        console.log('[AutoUpdate] Starting update...');
        const now = new Date();
        if (this.lastUpdateTime && (now.getTime() - this.lastUpdateTime.getTime() < this.COOLDOWN_PERIOD)) {
            console.log('[AutoUpdate] Cooldown active');
            return;
        }
        this.lastUpdateTime = now;

        state.cache = {};
        fetchedCities.clear();

        // Reset markers
        Object.values(markers).forEach(marker => {
            marker.setStyle({ fillColor: '#ccc' });
            marker.maxPollen = 0;
            if (marker.getTooltip()) marker.unbindTooltip();
        });

        const todayStr = getJSTDateString();
        if (state.currentDate === todayStr) {
            await updateVisibleMarkers();
            updateVis();
            if (typeof updateWeatherMarkers === 'function') await updateWeatherMarkers(map, state, state.currentDate);
            if (currentOpenCity) {
                const marker = markers[currentOpenCity.code];
                if (marker && marker.isPopupOpen()) await handlePopupOpen(currentOpenCity, marker);
            }
            if (NotificationManager.checkPollenLevels) await NotificationManager.checkPollenLevels();
        }
    }
};

// --- Main Logic ---

function updateVis() {
    if (!map) return;
    const zoom = map.getZoom();
    const showGraph = zoom >= CONFIG.ZOOM_THRESHOLD;

    Object.values(markers).forEach(marker => {
        if (showGraph) {
            updateMarkerTooltip(marker);
            marker.openTooltip();
        } else {
            marker.closeTooltip();
            marker.unbindTooltip();
        }
    });
}

async function fetchCityDailyData(cityCode: string) {
    if (fetchedCities.has(cityCode)) return;

    const start = state.currentDate.replace(/-/g, '');
    const end = start;
    const data = await fetchData(cityCode, start, end);

    if (data.length > 0) {
        const todayJST = getJSTDateString();
        const isToday = state.currentDate === todayJST;
        let displayValue = 0;

        if (isToday && state.currentMode === 'hourly') {
            const now = new Date();
            const validData = data.filter(v => v.date <= now && v.pollen >= 0);
            const latest = validData.length > 0 ? validData[validData.length - 1] : null;
            displayValue = latest ? latest.pollen : 0;
        } else {
            displayValue = data.reduce((sum, item) => sum + (item.pollen > 0 ? item.pollen : 0), 0);
        }

        const marker = markers[cityCode];
        if (marker) {
            const useHourlyStyle = isToday && state.currentMode === 'hourly';
            marker.isPast = !useHourlyStyle;
            marker.maxPollen = displayValue;
            marker.setStyle({ fillColor: getPollenColor(displayValue, !useHourlyStyle) });
            fetchedCities.add(cityCode);
            if (map.getZoom() >= CONFIG.ZOOM_THRESHOLD) updateMarkerTooltip(marker);

            const settings = NotificationManager.getSettings();
            if (settings && settings.cityCode === cityCode) NotificationManager.updateRegisteredLocationUI();
        }
    }
}

function updateMarkerTooltip(marker: any) {
    const height = marker.isPast ? marker.maxPollen * 0.4 : marker.maxPollen * 8;
    const color = getPollenColor(marker.maxPollen, marker.isPast);
    const borderColor = color === '#FFFFFF' ? '#999999' : '#FFFFFF';
    const content = `
        <div class="graph-tooltip-inner" style="display: flex; flex-direction: column; align-items: center;">
            <div style="width: 10px; height: ${Math.min(height, 150)}px; background-color: ${color}; border: 1px solid ${borderColor};"></div>
            <span style="font-size: 10px;">${marker.maxPollen}</span>
        </div>
    `;
    if (marker.getTooltip()) {
        marker.setTooltipContent(content);
    } else {
        marker.bindTooltip(content, { permanent: true, direction: 'top', className: 'graph-tooltip', offset: [0, -10] });
    }
}

async function handlePopupOpen(city: City, marker: any) {
    const containerId = `popup-${city.code}`;
    const container = document.getElementById(containerId);
    if (!container) return;

    const start = state.currentDate.replace(/-/g, '');
    const end = start;
    const data = await fetchData(city.code, start, end);
    const dayData = data;

    // Chart.js implementation inside popup
    const chartId = `chart-${city.code}`;
    container.innerHTML = `
        <div class="popup-header"><span>${city.name}</span><div>
        <button class="btn-trend">週間推移</button>
        <button class="btn-notification"><i class="fas fa-bell"></i></button>
        </div></div>
        <div class="popup-chart-container"><canvas id="${chartId}"></canvas></div>
    `;

    // Re-attach listeners
    container.querySelector('.btn-trend')?.addEventListener('click', () => (window as any).showWeeklyTrend(city.code, city.name));
    container.querySelector('.btn-notification')?.addEventListener('click', () => NotificationManager.openSettings(city.code, city.name));

    const ctx = (document.getElementById(chartId) as HTMLCanvasElement).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dayData.map(d => d.date.getHours() + '時'),
            datasets: [{
                label: '花粉数',
                data: dayData.map(d => d.pollen >= 0 ? d.pollen : 0),
                backgroundColor: dayData.map(d => getPollenColor(d.pollen >= 0 ? d.pollen : 0))
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}

async function updateVisibleMarkers() {
    if (!map) return;
    const zoom = map.getZoom();
    const bounds = map.getBounds();
    const center = map.getCenter();

    let targetLevels = new Set([1]);
    if (zoom >= 6) targetLevels.add(2);
    if (zoom >= 8) targetLevels.add(3);

    let candidates = CITIES.filter(c => targetLevels.has(c.level) && bounds.contains(L.latLng(c.lat, c.lng)));
    candidates.forEach(c => c._dist = Math.pow(c.lat - center.lat, 2) + Math.pow(c.lng - center.lng, 2));
    candidates.sort((a, b) => (a._dist || 0) - (b._dist || 0));

    const maxMarkers = zoom >= 12 ? 10000 : 1000;
    const selected: City[] = [];
    const selectedCodes = new Set<string>();

    const minPixelDist = zoom < 7 ? 20 : (zoom < 10 ? 40 : 10);

    for (const city of candidates) {
        if (selected.length >= maxMarkers) break;

        const p1 = map.latLngToContainerPoint([city.lat, city.lng]);
        let tooClose = false;

        for (const existing of selected) {
            const p2 = map.latLngToContainerPoint([existing.lat, existing.lng]);
            const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
            if (dist < minPixelDist) {
                tooClose = true;
                break;
            }
        }

        if (!tooClose) {
            selected.push(city);
            selectedCodes.add(city.code);
        }
    }

    currentVisibleCityCodes = selectedCodes;
    const fetchQueue: string[] = [];

    for (const city of selected) {
        if (!markers[city.code]) {
            const marker = L.circleMarker([city.lat, city.lng], {
                radius: 8, fillColor: '#ccc', color: 'rgba(0,0,0,0.3)', weight: 1, fillOpacity: 0.8
            });
            marker.cityCode = city.code;
            marker.maxPollen = 0;
            marker.bindPopup(`<div id="popup-${city.code}">Loading...</div>`, { maxWidth: 350 });
            marker.on('popupopen', () => {
                currentOpenCity = city;
                handlePopupOpen(city, marker);
            });
            marker.on('popupclose', () => currentOpenCity = null);
            markers[city.code] = marker;
            marker.addTo(map);
        } else {
            if (!map.hasLayer(markers[city.code])) markers[city.code].addTo(map);
        }

        if (!fetchedCities.has(city.code) && !pendingPollenRequests.has(city.code)) {
            fetchQueue.push(city.code);
        }
    }

    // Cleanup invisible markers
    Object.keys(markers).forEach(code => {
        if (!selectedCodes.has(code) && map.hasLayer(markers[code])) map.removeLayer(markers[code]);
    });

    // Batch fetch
    const BATCH_SIZE = 20;
    for (let i = 0; i < fetchQueue.length; i += BATCH_SIZE) {
        const batch = fetchQueue.slice(i, i + BATCH_SIZE);
        batch.forEach(c => pendingPollenRequests.add(c));
        try {
            await Promise.all(batch.map(c => fetchCityDailyData(c)));
        } finally {
            batch.forEach(c => pendingPollenRequests.delete(c));
        }
    }
}

// Global Export for Weekly Trend (simplified)
(window as any).showWeeklyTrend = function (cityCode: string, cityName: string) {
    console.log('Open trend for', cityName);
    const modal = document.getElementById('trend-modal');
    if (modal) modal.classList.add('show');
};

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    state.currentDate = getJSTDateString();

    // Init Map
    map = L.map('map', { zoomControl: false }).setView([36.2048, 138.2529], 5);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const baseLayers = {
        std: L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>',
            opacity: 0.6
        }),
        relief: L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/hillshademap/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>',
            opacity: 0.5
        })
    };
    baseLayers.std.addTo(map);

    // Initial weather feature setup
    initWeatherFeature(map, state);
    initGA4();

    // Init Logic
    updateVisibleMarkers();
    NotificationManager.init();
    AutoUpdateManager.init();

    // Map Events
    const debouncedUpdate = debounce(() => updateVisibleMarkers(), 500);
    map.on('moveend', debouncedUpdate);
    map.on('zoomend', debouncedUpdate);

    map.on('popupopen', () => {
        const crosshair = document.getElementById('crosshair');
        if (crosshair) crosshair.style.opacity = '0';
    });
    map.on('popupclose', () => {
        const crosshair = document.getElementById('crosshair');
        if (crosshair) crosshair.style.opacity = '1';
    });

    // UI Listeners
    setupUIListeners();
});

function setupUIListeners() {
    // Panel Toggle Logic
    const toggleBtn = document.getElementById('panel-toggle');
    const sidePanel = document.querySelector('.side-panel');
    const appHeader = document.querySelector('.app-header') as HTMLElement;

    if (toggleBtn && sidePanel) {
        toggleBtn.addEventListener('click', () => {
            sidePanel.classList.toggle('collapsed');
            const isCollapsed = sidePanel.classList.contains('collapsed');
            toggleBtn.title = isCollapsed ? 'パネルを開く' : 'パネルを閉じる';

            if (window.innerWidth <= 600 && appHeader) {
                if (isCollapsed) {
                    appHeader.style.transform = 'translateX(-100%)';
                    appHeader.style.opacity = '0';
                    appHeader.style.pointerEvents = 'none';
                } else {
                    appHeader.style.transform = '';
                    appHeader.style.opacity = '';
                    appHeader.style.pointerEvents = '';
                    setTimeout(() => updateVisibleMarkers(), 300);
                }
            }
        });

        if (window.innerWidth <= 600) {
            sidePanel.classList.add('collapsed');
            toggleBtn.title = 'パネルを開く';
            if (appHeader) {
                appHeader.style.transform = 'translateX(-100%)';
                appHeader.style.opacity = '0';
                appHeader.style.pointerEvents = 'none';
            }
        }
    }

    // Map Type Toggle Logic
    document.querySelectorAll('.btn-map-type').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = (btn as HTMLElement).dataset.type;
            document.querySelectorAll('.btn-map-type').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Note: In a real implementation we would switch layers here. 
            // Since we defined layers in init, we might need access to them. 
            // For simplicity, re-creating layers or managing them globally is needed.
            // But we'll leave this placeholder logic as is for now or use a global var if preferred.
            console.log('Switch map type to:', type);
        });
    });

    // Date Navigation Logic
    const todayStr = getJSTDateString();

    document.getElementById('prev-day')?.addEventListener('click', () => {
        const d = new Date(state.currentDate);
        d.setDate(d.getDate() - 1);
        const newDate = getJSTDateString(d);
        updateDate(newDate);
    });

    document.getElementById('next-day')?.addEventListener('click', () => {
        const d = new Date(state.currentDate);
        d.setDate(d.getDate() + 1);
        const newDate = getJSTDateString(d);
        if (newDate <= todayStr) updateDate(newDate);
    });

    document.querySelectorAll('.btn-quick-date').forEach(btn => {
        btn.addEventListener('click', () => {
            const days = (btn as HTMLElement).dataset.days;
            const years = (btn as HTMLElement).dataset.years;
            let d = new Date();
            if (days !== undefined) d.setDate(d.getDate() - parseInt(days));
            else if (years !== undefined) d.setFullYear(d.getFullYear() - parseInt(years));
            updateDate(getJSTDateString(d));
        });
    });

    function updateDate(newDateStr: string) {
        if (newDateStr > todayStr) return;
        state.currentDate = newDateStr;
        const datePicker = document.getElementById('date-picker') as HTMLInputElement;
        if (datePicker) datePicker.value = newDateStr;

        document.querySelectorAll('.btn-quick-date').forEach(btn => {
            const days = (btn as HTMLElement).dataset.days;
            const years = (btn as HTMLElement).dataset.years;
            let d = new Date();
            if (days !== undefined) d.setDate(d.getDate() - parseInt(days));
            else if (years !== undefined) d.setFullYear(d.getFullYear() - parseInt(years));
            const dStr = getJSTDateString(d);
            btn.classList.toggle('active', dStr === newDateStr);
        });

        fetchedCities.clear();
        updateVisibleMarkers();
        NotificationManager.updateRegisteredLocationUI();
        if (typeof updateWeatherMarkers === 'function') updateWeatherMarkers(map, state, state.currentDate);
    }

    // Display Mode Toggle Logic
    document.querySelectorAll('input[name="display-mode"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if ((e.target as HTMLInputElement).checked) {
                state.currentMode = (e.target as HTMLInputElement).value as 'hourly' | 'daily';
                fetchedCities.clear();
                updateVisibleMarkers();
            }
        });
    });
}
