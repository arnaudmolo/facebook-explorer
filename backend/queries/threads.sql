{% query 'get_all' %}
    SELECT threads.id AS threads_id,
    threads.title AS threads_title,
    threads.is_still_participant AS threads_is_still_participant,
    threads.status AS threads_status,
    threads.thread_type AS threads_thread_type,
    threads.thread_path AS threads_thread_path,
    count(messages.`UserId`) AS total
    FROM threads INNER JOIN messages ON threads.id = messages.`ThreadId`
    GROUP BY threads.id,
        threads.title,
        threads.is_still_participant,
        threads.status,
        threads.thread_type,
        threads.thread_path
    ORDER BY total DESC
    LIMIT {{offset}},
    {{limit}}
{% endquery %}

{% query 'get_threads_in' %}
    SELECT threads.id AS threads_id,
    threads.title AS threads_title,
    threads.is_still_participant AS threads_is_still_participant,
    threads.status AS threads_status,
    threads.thread_type AS threads_thread_type,
    threads.thread_path AS threads_thread_path,
    count(messages.`UserId`) AS total
    FROM threads INNER JOIN messages ON threads.id = messages.`ThreadId`
    WHERE threads.id IN ({{threads_ids|join(', ')}})
    GROUP BY threads.id,
        threads.title,
        threads.is_still_participant,
        threads.status,
        threads.thread_type,
        threads.thread_path
    ORDER BY FIELD(`threads`.`id`, {{threads_ids|join(', ')}})
{% endquery %}

{% query 'create_thread'%}
    INSERT INTO threads (
        title,
        is_still_participant,
        status,
        thread_type,
        thread_path
    )
    VALUES (
        {{title|guards.string}},
        {{is_still_participant|guards.bool}},
        {{status|guards.string}},
        {{thread_type|guards.string}},
        {{thread_path|guards.string}}
    )
{% endquery %}

{% query 'create_threads_users'%}
INSERT INTO userthread (UserId, ThreadId)
VALUES 
    {% for user in users %}
        ({{user.id|guards.integer}}, {{thread_id|guards.integer}}),
    {% endfor %}
{% endquery %}
