<!doctype html>
<html>
<head>
    {% include '_partials/head.swig' %}
    <title>{% block title %}{% endblock %}</title>
</head>
<body id="home">
{% include '_partials/menu.swig' %}
<div id="wrap">
    {% include '_partials/nav.swig' %}
    {% include '_partials/header.swig' %}
    <div id="start" class="container content">
        {% block content %}{% endblock %}
    </div>
    {% include '_partials/footer.swig' %}
</div>
</body>
</html>