// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Theme Management
(function() {
    'use strict';

    // 获取用户主题偏好：localStorage > prefers-color-scheme > light
    function getThemePreference() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        
        // 检查系统偏好
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        
        return 'light';
    }

    // 应用主题
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // 更新按钮图标
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    // 切换主题
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || getThemePreference();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // 保存到 localStorage
        localStorage.setItem('theme', newTheme);
        
        // 应用新主题
        applyTheme(newTheme);
    }

    // 监听系统主题变化（仅当用户没有手动设置时）
    function setupSystemThemeListener() {
        if (!localStorage.getItem('theme')) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addListener(function(e) {
                if (!localStorage.getItem('theme')) {
                    applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    // 初始化主题
    function initTheme() {
        const theme = getThemePreference();
        applyTheme(theme);
        setupSystemThemeListener();
    }

    // 页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', initTheme);
    
    // 将 toggleTheme 函数暴露到全局作用域，供 HTML onclick 使用
    window.toggleTheme = toggleTheme;
})();
