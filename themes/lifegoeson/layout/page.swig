{% extends '_layout.swig' %}

{% block content %}
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            {{ post_template.render(page) }}
        </div>
    </div>
{% endblock %}