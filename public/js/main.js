(function () {
    const form = document.forms[0];
    const input = document.getElementById('url');
    const message = document.querySelector('.message');
    const button = document.querySelector('.button');
    const HIDDEN_CLASS = 'hidden';
    const MESSAGE_CLASS = 'message';
    const BUTTON_TEXT = 'Отправить';
    const BUTTON_TEXT_LOADING = 'Сохраняем...';

    let messageTimerId = null;

    const messageTypes = {
        error: 'error',
        info: 'info'
    };

    const messageCssClass = {
        [messageTypes.error]: `${MESSAGE_CLASS}--error`,
        [messageTypes.info]: `${MESSAGE_CLASS}--info`
    };

    function isValidUrl(url) {
        const urlRegExp = /^(http[s]?:\/\/)(www\.){0,1}[a-zA-Z0-9\.\-]+(\.[a-zA-Z]{2,5}){0,1}[\.]{0,1}([:][0-9]{2,5}){0,1}/;
        return urlRegExp.test(url);
    }

    function showMessage(params) {
        const cssClass = messageCssClass[params.type] || messageCssClass.error;
        const text = params.text || 'Ошибка!';

        message.innerHTML = text;
        message.classList.add(cssClass);
        message.classList.remove(HIDDEN_CLASS);

        if (cssClass === messageCssClass.error) {
            hideMessage();
        }
    }

    function hideMessage() {
        messageTimerId = setTimeout(function() {
            message.classList.add(HIDDEN_CLASS);
        }, 3000);
    }

    function toggleButtonState(isLoading) {
        const isDisabled = isLoading || false;
        button.innerHTML = isLoading ? BUTTON_TEXT_LOADING : BUTTON_TEXT;
        button.disabled = isDisabled;
    }

    function handleResponse(response) {
      input.value = '';
      toggleButtonState();
      const { shortLink } = JSON.parse(response);
      showMessage({ type: messageTypes.info, text: shortLink });
    }

    function sendRequest(url) {
        const xhr = new XMLHttpRequest();
        const body = JSON.stringify({ url });
        toggleButtonState(true);

        xhr.open('POST', '/api/save_url', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.onload = function() {
            handleResponse(this.response);
        };
        xhr.onerror = function() {
            toggleButtonState();
            showMessage({ text: 'Невозможно выполнить запрос' });
        };
        xhr.send(body);
    }

    function handleSubmitForm(e) {
        e.preventDefault();
        message.classList.add(HIDDEN_CLASS);
        message.classList.remove(messageCssClass[messageTypes.error]);
        message.classList.remove(messageCssClass[messageTypes.info]);

        const longUrl = input.value;

        if (messageTimerId) {
            clearTimeout(messageTimerId);
            messageTimerId = null;
        }

        if (!longUrl) {
            showMessage({ text: 'Введите адрес ссылки' });
            return;
        }

        if (!isValidUrl(longUrl)) {
            showMessage({ text: 'Введите корректный адрес ссылки' });
            return;
        }

        sendRequest(longUrl);
    }

    function initEvents() {
        form && form.addEventListener('submit', handleSubmitForm);
    }

    function init() {
        initEvents();
    }

    init();
})();
