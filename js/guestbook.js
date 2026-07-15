// giscus 评论区跟随博客深色/浅色主题切换（原内联于 layout/guestbook.ejs）

document.addEventListener('DOMContentLoaded', function() {
    function changeGiscusTheme() {
        const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';

        function sendMessage(message) {
            const iframe = document.querySelector('iframe.giscus-frame');
            if (!iframe) return;
            iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
        }

        sendMessage({
            setConfig: {
                theme: theme === 'dark' ? 'noborder_dark' : 'noborder_light'
            }
        });
    }

    // Initialize the theme when the page loads
    changeGiscusTheme();

    // Create a mutation observer to watch for changes to the body's class list
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                changeGiscusTheme();
            }
        });
    });

    // Start observing the body for changes to the class attribute
    observer.observe(document.body, { attributes: true });
});
