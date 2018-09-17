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
    LIMIT {{offset}}, {{limit}}
{% endquery %}
