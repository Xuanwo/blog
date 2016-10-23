{% extends '_layout.swig' %}
{% import '_macro/post.swig' as post_template %}

{% block content %}
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            {{ post_template.render(page) }}
        </div>
    </div>
{% endblock %}