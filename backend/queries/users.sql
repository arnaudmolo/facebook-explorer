{% query 'users_by_country', note='counts users' %}
    SELECT count(*) AS count
    FROM user
{% endquery %}
