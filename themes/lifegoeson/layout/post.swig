{% extends '_layout.swig' %}
{% import '_macro/post.swig' as post_template %}

{% block title %} {{ page.title }} | {{ config.title }} {% endblock %}

{% block content %}
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            {{ post_template.render(page) }}
            <div id="disqus_thread"></div>
            <script>
                var disqus_config = function () {
                    this.page.url = '{{ page.permalink }}';
                    this.page.identifier = '{{ page.path }}';
                };
                (function () {
                    var d = document, s = d.createElement('script');
                    s.src = '//only0god.disqus.com/embed.js';
                    s.setAttribute('data-timestamp', +new Date());
                    (d.head || d.body).appendChild(s);
                })();
            </script>
        </div>
    </div>
{% endblock %}