INSERT INTO streams (title, start_date, end_date, is_active)
VALUES ('Весняний потік 2026', '2026-03-01', '2026-05-31', true);

INSERT INTO partners (name, logo_url, website_url)
VALUES ('UNICEF Ukraine', 'https://example.com/logo1.png', 'https://www.unicef.org');

INSERT INTO events (title, description, event_date, location, registration_url)
VALUES ('Відкрита онлайн-лекція з фізики', 'Розбір цікавих задач та законів всесвіту для учнів старших класів.', '2026-03-15 17:00:00+02', 'Online', 'https://example.com');

INSERT INTO opportunities (title, description, category, deadline, link)
VALUES ('Грантова програма для молодіжних ініціатив', 'Можливість отримати фінансування на освітній проєкт у регіоні.', 'Гранти', '2026-04-01', 'https://example.com');

INSERT INTO articles (title, slug, content, author, published_at)
VALUES ('Як peer-to-peer освіта змінює підхід до навчання', 'peer-to-peer-education', 'Текст статті про переваги взаємного навчання серед молоді та волонтерство.', 'Команда Plekayou', NOW());