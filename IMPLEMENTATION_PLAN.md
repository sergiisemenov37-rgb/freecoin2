# План реализации по этапам

## Этап 1: Подготовка базы данных (Supabase)

### 1.1 Обновить существующую таблицу `users`
Выполнить в Supabase SQL Editor:
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_streak_date TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS guild_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reputation_score INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_mined INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS vip_level INTEGER DEFAULT 0;
```

### 1.2 Создать таблицы для системы друзей
```sql
CREATE TABLE IF NOT EXISTS friends (
  id SERIAL PRIMARY KEY,
  telegram_id VARCHAR(255),
  friend_telegram_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(telegram_id, friend_telegram_id)
);

CREATE TABLE IF NOT EXISTS friend_requests (
  id SERIAL PRIMARY KEY,
  from_telegram_id VARCHAR(255),
  to_telegram_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  from_telegram_id VARCHAR(255),
  to_telegram_id VARCHAR(255),
  content TEXT,
  type VARCHAR(50) DEFAULT 'text',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 1.3 Создать таблицы для гильдий
```sql
CREATE TABLE IF NOT EXISTS guilds (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  emblem VARCHAR(50),
  leader_id VARCHAR(255),
  level INTEGER DEFAULT 1,
  total_power INTEGER DEFAULT 0,
  total_balance INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS guild_members (
  id SERIAL PRIMARY KEY,
  guild_id INTEGER,
  telegram_id VARCHAR(255),
  role VARCHAR(50) DEFAULT 'member',
  contribution INTEGER DEFAULT 0,
  joined_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (guild_id) REFERENCES guilds(id)
);

CREATE TABLE IF NOT EXISTS guild_messages (
  id SERIAL PRIMARY KEY,
  guild_id INTEGER,
  from_telegram_id VARCHAR(255),
  content TEXT,
  type VARCHAR(50) DEFAULT 'text',
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (guild_id) REFERENCES guilds(id)
);
```

### 1.4 Создать таблицы для турниров
```sql
CREATE TABLE IF NOT EXISTS tournaments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  type VARCHAR(50),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  prize_pool INTEGER,
  entry_fee INTEGER,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'upcoming'
);

CREATE TABLE IF NOT EXISTS tournament_participants (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER,
  telegram_id VARCHAR(255),
  score INTEGER DEFAULT 0,
  rank INTEGER,
  joined_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id)
);
```

### 1.5 Создать таблицы для репутации
```sql
CREATE TABLE IF NOT EXISTS reputation_actions (
  id SERIAL PRIMARY KEY,
  telegram_id VARCHAR(255),
  action VARCHAR(50),
  from_telegram_id VARCHAR(255),
  weight INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 1.6 Создать таблицы для трофеев
```sql
CREATE TABLE IF NOT EXISTS user_trophies (
  id SERIAL PRIMARY KEY,
  telegram_id VARCHAR(255),
  trophy_id VARCHAR(255),
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMP,
  UNIQUE(telegram_id, trophy_id)
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY,
  telegram_id VARCHAR(255),
  achievement_id VARCHAR(255),
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMP,
  UNIQUE(telegram_id, achievement_id)
);
```

### 1.7 Создать таблицы для мини-игр
```sql
CREATE TABLE IF NOT EXISTS game_sessions (
  id SERIAL PRIMARY KEY,
  telegram_id VARCHAR(255),
  game_id VARCHAR(255),
  score INTEGER,
  reward INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

### 1.8 Создать таблицы для голосований
```sql
CREATE TABLE IF NOT EXISTS vote_proposals (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  type VARCHAR(50),
  proposer_id VARCHAR(255),
  proposer_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  ends_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  votes_for INTEGER DEFAULT 0,
  votes_against INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  min_votes_required INTEGER DEFAULT 10
);

CREATE TABLE IF NOT EXISTS votes (
  id SERIAL PRIMARY KEY,
  proposal_id INTEGER,
  voter_id VARCHAR(255),
  choice VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (proposal_id) REFERENCES vote_proposals(id)
);
```

### 1.9 Создать таблицы для магазина
```sql
CREATE TABLE IF NOT EXISTS user_purchases (
  id SERIAL PRIMARY KEY,
  telegram_id VARCHAR(255),
  item_id VARCHAR(255),
  item_type VARCHAR(50),
  price INTEGER,
  purchased_at TIMESTAMP DEFAULT NOW()
);
```

### 1.10 Создать таблицы для промокодов
```sql
CREATE TABLE IF NOT EXISTS promo_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(255) UNIQUE,
  reward INTEGER,
  type VARCHAR(50),
  duration INTEGER,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMP,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS user_promo_uses (
  id SERIAL PRIMARY KEY,
  telegram_id VARCHAR(255),
  promo_code_id INTEGER,
  used_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (promo_code_id) REFERENCES promo_codes(id)
);
```

### 1.11 Создать таблицы для лотереи
```sql
CREATE TABLE IF NOT EXISTS lottery_draws (
  id SERIAL PRIMARY KEY,
  draw_date TIMESTAMP,
  prize_pool INTEGER,
  winning_number INTEGER,
  ticket_price INTEGER DEFAULT 50,
  total_tickets INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'upcoming'
);

CREATE TABLE IF NOT EXISTS lottery_tickets (
  id SERIAL PRIMARY KEY,
  draw_id INTEGER,
  telegram_id VARCHAR(255),
  ticket_number INTEGER,
  purchased_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (draw_id) REFERENCES lottery_draws(id)
);
```

### 1.12 Создать таблицы для ежедневных задач
```sql
CREATE TABLE IF NOT EXISTS daily_tasks (
  id SERIAL PRIMARY KEY,
  telegram_id VARCHAR(255),
  task_id VARCHAR(255),
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  date DATE DEFAULT CURRENT_DATE,
  UNIQUE(telegram_id, task_id, date)
);
```

---

## Этап 2: Создание API endpoints

### 2.1 API для системы друзей
**Файл:** `app/api/friends/add/route.ts`
- POST /api/friends/add - отправить запрос в друзья

**Файл:** `app/api/friends/accept/route.ts`
- POST /api/friends/accept - принять запрос

**Файл:** `app/api/friends/reject/route.ts`
- POST /api/friends/reject - отклонить запрос

**Файл:** `app/api/friends/list/route.ts`
- GET /api/friends/list - получить список друзей

**Файл:** `app/api/friends/requests/route.ts`
- GET /api/friends/requests - получить запросы

**Файл:** `app/api/friends/message/route.ts`
- POST /api/friends/message - отправить сообщение

**Файл:** `app/api/friends/messages/route.ts`
- GET /api/friends/messages - получить сообщения

### 2.2 API для гильдий
**Файл:** `app/api/guilds/create/route.ts`
- POST /api/guilds/create - создать гильдию

**Файл:** `app/api/guilds/join/route.ts`
- POST /api/guilds/join - присоединиться к гильдии

**Файл:** `app/api/guilds/list/route.ts`
- GET /api/guilds/list - список гильдий

**Файл:** `app/api/guilds/my/route.ts`
- GET /api/guilds/my - моя гильдия

**Файл:** `app/api/guilds/message/route.ts`
- POST /api/guilds/message - сообщение в гильдии

### 2.3 API для турниров
**Файл:** `app/api/tournaments/list/route.ts`
- GET /api/tournaments/list - список турниров

**Файл:** `app/api/tournaments/join/route.ts`
- POST /api/tournaments/join - присоединиться

**Файл:** `app/api/tournaments/my/route.ts`
- GET /api/tournaments/my - мои турниры

**Файл:** `app/api/tournaments/progress/route.ts`
- POST /api/tournaments/progress - обновить прогресс

### 2.4 API для мини-игр
**Файл:** `app/api/games/play/route.ts`
- POST /api/games/play - сыграть игру

**Файл:** `app/api/games/list/route.ts`
- GET /api/games/list - список игр

**Файл:** `app/api/games/history/route.ts`
- GET /api/games/history - история игр

### 2.5 API для голосований
**Файл:** `app/api/voting/list/route.ts`
- GET /api/voting/list - список предложений

**Файл:** `app/api/voting/create/route.ts`
- POST /api/voting/create - создать предложение

**Файл:** `app/api/voting/vote/route.ts`
- POST /api/voting/vote - проголосовать

### 2.6 API для магазина
**Файл:** `app/api/shop/list/route.ts`
- GET /api/shop/list - список товаров

**Файл:** `app/api/shop/purchase/route.ts`
- POST /api/shop/purchase - купить товар

**Файл:** `app/api/shop/my/route.ts`
- GET /api/shop/my - мои покупки

### 2.7 API для промокодов
**Файл:** `app/api/promo-codes/list/route.ts`
- GET /api/promo-codes/list - список промокодов

**Файл:** `app/api/promo-codes/redeem/route.ts`
- POST /api/promo-codes/redeem - активировать промокод

### 2.8 API для лотереи
**Файл:** `app/api/lottery/draws/route.ts`
- GET /api/lottery/draws - список розыгрышей

**Файл:** `app/api/lottery/buy-ticket/route.ts`
- POST /api/lottery/buy-ticket - купить билет

**Файл:** `app/api/lottery/my-tickets/route.ts`
- GET /api/lottery/my-tickets - мои билеты

### 2.9 API для ежедневных задач
**Файл:** `app/api/daily-tasks/list/route.ts`
- GET /api/daily-tasks/list - задачи на сегодня

**Файл:** `app/api/daily-tasks/complete/route.ts`
- POST /api/daily-tasks/complete - завершить задачу

**Файл:** `app/api/daily-tasks/progress/route.ts`
- POST /api/daily-tasks/progress - обновить прогресс

---

## Этап 3: Подключение frontend к API

### 3.1 Обновить lib/api.ts
Добавить функции для всех новых API endpoints:
- addFriend(), acceptFriend(), rejectFriend()
- getFriends(), getFriendRequests(), getMessages(), sendMessage()
- createGuild(), joinGuild(), getGuilds(), getMyGuild(), sendGuildMessage()
- getTournaments(), joinTournament(), getMyTournaments(), updateTournamentProgress()
- playGame(), getGames(), getGameHistory()
- getProposals(), createProposal(), vote()
- getShopItems(), purchaseItem(), getMyPurchases()
- getPromoCodes(), redeemPromoCode()
- getLotteryDraws(), buyLotteryTicket(), getMyLotteryTickets()
- getDailyTasks(), completeDailyTask(), updateDailyTaskProgress()

### 3.2 Обновить страницы для использования реального API
**Файл:** `app/friends/page.tsx`
- Заменить mock данные на вызовы API
- Добавить загрузку и обработку ошибок

**Файл:** `app/guilds/page.tsx`
- Подключить к API гильдий
- Реальное создание и присоединение

**Файл:** `app/tournaments/page.tsx`
- Загружать турниры из API
- Реальная регистрация

**Файл:** `app/games/page.tsx`
- Сохранять результаты игр в базу
- Проверять кулдауны из базы

**Файл:** `app/voting/page.tsx`
- Создавать предложения через API
- Реальное голосование

**Файл:** `app/shop/page.tsx`
- Покупки через API
- Проверка владения предметами

**Файл:** `app/promo-codes/page.tsx`
- Проверка промокодов в базе
- Отслеживание использований

**Файл:** `app/lottery/page.tsx`
- Покупка билетов через API
- Реальный призовой фонд

**Файл:** `app/daily-tasks/page.tsx`
- Генерация задач из базы
- Сохранение прогресса

### 3.3 Обновить главную страницу
**Файл:** `app/page.tsx`
- Загружать streak из базы
- Загружать события из базы
- Сохранять прогресс задач

---

## Порядок выполнения

### Приоритет 1 (Критично для базового функционала):
1. Этап 1.1 - обновить таблицу users
2. Этап 1.12 - создать daily_tasks
3. Этап 2.9 - API для ежедневных задач
4. Этап 3.3 - подключить daily-tasks к API

### Приоритет 2 (Вовлечение игроков):
5. Этап 1.2 - создать таблицы друзей
6. Этап 2.1 - API для друзей
7. Этап 3.2 - подключить friends к API

8. Этап 1.3 - создать таблицы гильдий
9. Этап 2.2 - API для гильдий
10. Этап 3.2 - подключить guilds к API

### Приоритет 3 (Дополнительные функции):
11. Этап 1.11 - создать таблицы лотереи
12. Этап 2.8 - API для лотереи
13. Этап 3.2 - подключить lottery к API

14. Этап 1.7 - создать таблицы игр
15. Этап 2.4 - API для игр
16. Этап 3.2 - подключить games к API

### Приоритет 4 (Продвинутые функции):
17-24. Остальные функции по порядку

---

## Тестирование после каждого этапа

После каждого завершенного этапа:
1. Проверить, что таблицы созданы в Supabase
2. Протестировать API endpoints через Postman/curl
3. Проверить frontend интеграцию
4. Убедиться в отсутствии ошибок в консоли
