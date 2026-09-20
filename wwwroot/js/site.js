// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Theme Management (基于 Bootstrap 5.3 的 data-bs-theme)
(function () {
    'use strict';

    const STORAGE_KEY = 'theme';

    // 读取主题偏好：localStorage > prefers-color-scheme > light
    function getStoredTheme() {
        return localStorage.getItem(STORAGE_KEY);
    }

    function getPreferredTheme() {
        const stored = getStoredTheme();
        if (stored === 'dark' || stored === 'light') {
            return stored;
        }
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // 应用主题到 <html>，并同步切换按钮图标与 aria 状态
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-bs-theme', theme);

        const btn = document.getElementById('theme-toggle');
        if (!btn) {
            return;
        }
        const sun = btn.querySelector('.icon-sun');
        const moon = btn.querySelector('.icon-moon');
        if (sun && moon) {
            const showSun = theme === 'dark';
            sun.classList.toggle('d-none', !showSun);
            moon.classList.toggle('d-none', showSun);
        }
        btn.setAttribute('aria-pressed', String(theme === 'dark'));
        btn.setAttribute('title', theme === 'dark' ? '切换到浅色模式' : '切换到深色模式');
    }

    // 切换主题并持久化
    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-bs-theme') || getPreferredTheme();
        const next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
    }

    // 跟随系统变化（仅当用户没有手动选择过主题时）
    function watchSystemTheme() {
        if (!window.matchMedia) {
            return;
        }
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const onChange = function (e) {
            if (!getStoredTheme()) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        };
        if (typeof media.addEventListener === 'function') {
            media.addEventListener('change', onChange);
        } else if (typeof media.addListener === 'function') {
            media.addListener(onChange);
        }
    }

    window.addEventListener('DOMContentLoaded', function () {
        applyTheme(getPreferredTheme());
        watchSystemTheme();

        const btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.addEventListener('click', toggleTheme);
        }
    });

    // 暴露到全局，便于控制台调试
    window.toggleTheme = toggleTheme;
})();
