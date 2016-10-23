{% extends '_layout.swig' %}
{% import '_macro/post.swig' as post_template %}

{% block title %}{{ config.title }} {% endblock %}

{% block content %}
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            {% for post in page.posts %}
                {{ post_template.render(post, true) }}
            {% endfor %}
            {% include '_partials/pagination.swig' %}
        </div>
    </div>
{% endblock %}