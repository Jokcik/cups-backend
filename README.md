## cups-backend
npm start

# Что нужно
На все `POST, DELETE, PUT` нужна `авторизация` пользователя в системе.

Добавить `api` для добавления файла (`/cups/files`, `/teams/files`, `/users/files`).

## `Cups:`
1. Создание нового турнира
   1) ~~Автоматически добавляет `создателя` турнира~~
   2) ~~Создать турнир могут `все`.~~
2. Изменение турнира
   1) ~~добавление в турнир текущего пользователя -> `/cups/players`. Если в body 
   указан(ы) участники, то добавить в турнир могут `судьи`, `админы`, `создатель турнира`.
   Аналогично удаление пользователя из турнира.~~
   2) ~~Если участника добавили в турнир, то нужно его подтверждения участия.~~
   3) `/cups/judges `-> добавление судьи(ей) в турнир. Возможно только `создателю турнира`
   или `админам`
3. Удаление турнира
4. Получение всех турниров.
    1) Получить список всех участников
    2) Получить список всех судей
    3) Турниры, которые идут
    4) Турниры, которые прошли
    5) Турниры, которые будут
    6) Мои турниры (в которых я участвую или я создал)

## `Games`
1. Получение всех игр
2. Добавление 1 игры в базу
3. Изменение игры

## `Users`
1. Добавление нового `user` в базу. Подтягивается сам с сайта по id сайта.
2. Получение списка `team`, в которых состоит конкретный `user`
3. Получение всех `users` и конкретного `user`.

## `Teams`
1. Создание новой `Team`
    1) Автоматически добавляет `создателя` team
    2) Создать Team могут `все`
2. Изменение `Team`
    1) `/teams/join` -> добавление в team текущего пользователя. Если в body 
   указан(ы) user, то добавить в team могут `админы`, `создатель team`.
   Аналогично удаление пользователя из team. Если участника добавили в team,
   то нужно его подтверждения участия.