## Cократитель ссылок:
  
1. Посетитель сайта вводит любой оригинальный URL-адрес в поле ввода, 
как http://domain/any/path/ т.д.;
2. Нажимает кнопку submit;
3. Страница делает ajax-запрос на сервер и получает уникальный короткий URL-адрес;
4. Короткий URL-адрес отображается на странице как http://yourdomain/abCdE 
(не используйте внешние Интерфейсы как goo.gl и т. д.);
5. Посетитель может скопировать короткий URL-адрес 
и повторить процесс с другой ссылкой
 
Короткий URL должен уникальным, перенаправлять на оригинальную ссылку 
и быть актуальным навсегда, неважно, сколько раз он был использован.
 
 
### Требования к проекту:
1. Использовать Node.js последней версии с поддержкой async / await (версия 8+);
2. Нельзя использовать никаких вспомогательных библиотек ни на фронте, 
ни на бэке, за исключением express.js или koa.js.
3. Рендер html на стороне бэка.
 
 
### Ожидаемый результат:
1. Исходный код;
2. Желательно, чтобы это было где-то выложено в рабочем состоянии.