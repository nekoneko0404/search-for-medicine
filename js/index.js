import { loadAndCacheData } from './data.js';
import { updateProgress } from './ui.js';
import './components/MainFooter.js';
import './components/MainHeader.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- Notification script from original index.html logic ---
    const notificationToggle = document.getElementById('notification-toggle');
    const notificationContent = document.getElementById('notification-content');
    const notificationBody = document.getElementById('notification-body');

    if (notificationBody) {
        if (notificationToggle && notificationContent) {
            notificationToggle.addEventListener('click', () => {
                const isOpen = notificationContent.classList.toggle('open');
                notificationToggle.classList.toggle('open', isOpen);
                notificationToggle.setAttribute('aria-expanded', isOpen);
            });
        }

        // notification.md の読み込みと表示
        const loadNotifications = async () => {
            try {
                const response = await fetch('notification.md');
                if (!response.ok) throw new Error('Failed to load notification.md');
                const markdown = await response.text();

                // marked.js が読み込まれていることを確認
                if (typeof marked !== 'undefined') {
                    const rawHtml = marked.parse(markdown);
                    const cleanHtml = typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(rawHtml) : rawHtml;
                    notificationBody.innerHTML = cleanHtml;
                } else {
                    console.error('marked.js is not loaded');
                    notificationBody.textContent = '更新情報の読み込みに失敗しました（ライブラリエラー）。';
                }
            } catch (error) {
                console.error('Error loading notifications:', error);
                notificationBody.innerHTML = '<p class="text-xs text-red-400">更新情報の取得に失敗しました。</p>';
            }
        };

        loadNotifications();
    }

    // --- Update time script ---
    const GAS_URL = 'https://script.google.com/macros/s/AKfycbxxUhgPYOsJXUowuVpaeOT-398j3q79yEJAeQd2sXC4ECvAHMzMekUQvwq6l5NnjdB2/exec';
    const infectionTimeElement = document.getElementById('infection-update-time');
    const shippingTimeElement = document.getElementById('shipping-update-time');

    const formatDateTime = (isoString) => {
        if (!isoString) return '取得不可';
        try {
            const date = new Date(isoString);
            // JST (UTC+9) としてフォーマット
            const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
            const month = jstDate.getUTCMonth() + 1;
            const day = jstDate.getUTCDate();
            const hours = jstDate.getUTCHours();
            const minutes = jstDate.getUTCMinutes();

            return `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        } catch (e) {
            console.error("Date formatting error:", e);
            return '日付形式エラー';
        }
    };

    if (infectionTimeElement && shippingTimeElement) {
        fetch(GAS_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('GAS Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                infectionTimeElement.textContent = `更新: ${formatDateTime(data.infection_status)}`;
                shippingTimeElement.textContent = `更新: ${formatDateTime(data.shipping_status)}`;
            })
            .catch(error => {
                console.error('Error fetching update times:', error);
                infectionTimeElement.textContent = '日時取得エラー';
                shippingTimeElement.textContent = '日時取得エラー';
            });
    }

});