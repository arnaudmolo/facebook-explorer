{% query 'create_messages'%}
INSERT INTO messages (content, timestamp, type, UserId, ThreadId)
VALUES 
    {% for message in messages %}
        ({{message.content|guards.string}}, {{message.timestamp|guards.date}}, {{message.type|guards.string}}, {{message.UserId|guards.integer}}, {{message.ThreadId|guards.integer}}),
    {% endfor %}
{% endquery %}
