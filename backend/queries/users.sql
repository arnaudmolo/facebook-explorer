{% query 'get_all' %}
    SELECT users.id AS users_id,
        users.name AS users_name,
        users.fb_id AS users_fb_id,
        relations_1.id AS relations_1_id,
        relations_1.timestamp AS relations_1_timestamp,
        relations_1.friendship AS relations_1_friendship,
        relations_1.`UserId` AS `relations_1_UserId`
    FROM users
    INNER JOIN relations ON users.id = relations.`UserId`
    LEFT OUTER JOIN relations AS relations_1 ON users.id = relations_1.`UserId`
    ORDER BY relations_1.id
{% endquery %}

{% query 'get_one' %}
    SELECT users.id AS users_id,
        users.name AS users_name,
        users.fb_id AS users_fb_id
    FROM users
    WHERE users.id = {{ user_id }}
    LIMIT 1
{% endquery %}

{% query 'get_one_all' %}
    SELECT users.id AS users_id,
        users.name AS users_name,
        users.fb_id AS users_fb_id,
        messages_1.id AS messages_1_id,
        messages_1.content AS messages_1_content,
        messages_1.timestamp AS messages_1_timestamp,
        messages_1.type AS messages_1_type,
        messages_1.`ThreadId` AS `messages_1_ThreadId`,
        messages_1.`UserId` AS `messages_1_UserId`,
        relations_1.id AS relations_1_id,
        relations_1.timestamp AS relations_1_timestamp,
        relations_1.friendship AS relations_1_friendship,
        relations_1.`UserId` AS `relations_1_UserId`
    FROM users
        LEFT OUTER JOIN messages AS messages_1 ON users.id = messages_1.`UserId`
        LEFT OUTER JOIN relations AS relations_1 ON users.id = relations_1.`UserId`
    WHERE users.id = {{ user_id }} ORDER BY messages_1.id, relations_1.id
{% endquery %}

{% query 'get_own' %}
    SELECT users.id AS users_id, users.name AS users_name, users.fb_id AS users_fb_id
    FROM users INNER JOIN relations ON users.id = relations.`UserId`
    WHERE relations.friendship = 'own'
{% endquery %}
