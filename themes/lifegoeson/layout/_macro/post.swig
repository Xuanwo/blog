{% macro render(post, is_index, post_extra_class) %}
    <article class="clearfix">
        <div class="post-date">
            发表于
            <time datetime="{{ moment(post.date).format() }}"
                  content="{{ date(post.date, config.date_format) }}">
                {{ date(post.date, config.date_format) }}
            </time>
            &nbsp;|&nbsp;分类于
            {% if post.categories and post.categories.length %}
                {% for cat in post.categories %}
                    <a href="{{ url_for(cat.path) }}" rel="index">
                        {{ cat.name }}
                        {% set cat_length = post.categories.length %}
                        {% if cat_length > 1 and loop.index !== cat_length %}
                            ->
                        {% endif %}
                    </a>
                {% endfor %}
            {% endif %}
            <span>
            <a href="{{ url_for(post.path) }}#disqus_thread" data-disqus-identifier="{{ post.path }}">
              <span class="disqus-comment-count" data-disqus-identifier="{{ post.path }}"></span>
            </a>
          </span>
        </div>
        <h1><a href="{{ url_for(post.path) }}">{{ post.title }}</a></h1>
        {% if is_index %}
            {% if post.excerpt %}
                {{ post.excerpt }}
                <a class="" href="{{ url_for(post.path) }}">Read more</a>
            {% endif %}
        {% else %}
            {{ post.content }}
        {% endif %}
        <div class="post-footer">
            {% if not is_index %}
                <div id="eof" class="print-invisible">
                    <hr class="eof">
                </div>
                <div style="float:left;width:50%;text-align:center;margin-bottom:40px;">
                    <a href="/imgs/dachui.jpg" title="微信扫一扫，获取新文章推送" class="fancybox" style="display:block" ;><img
                                alt="微信扫一扫，获取新文章推送" style="display:inline-block;" src="/imgs/dachui.jpg"></a>
          <span class="caption" style="color: #999;display: inline-block;font-size: .9em;text-align: center;">
              微信扫一扫，获取新文章推送
          </span>
                </div>
                <div style="float:left;width:50%;text-align:center;margin-bottom:40px;">
                    <a href="/imgs/wechat.png" title="微信扫一扫，请博主喝咖啡" class="fancybox" style="display:block;"><img
                                alt="微信扫一扫，请博主喝咖啡" style="display:inline-block;" src="/imgs/wechat.png"></a>
          <span class="caption" style="color: #999;display: inline-block;font-size: .9em;text-align: center;">
              微信扫一扫，请博主喝咖啡
          </span>
                </div>
                <div class="copyright" style="clear:both;">
                    <p><span>本文标题:</span><a href="{{ url_for(post.path) }}">{{ post.title }}</a></p>
                    <p><span>文章作者:</span><a href="/" title="访问 {{ theme.author }} 的个人博客">{{ theme.author }}</a></p>
                    <p><span>发布时间:</span>{{ post.date.format("YYYY年M月D日 - HH时MM分") }}</p>
                    <p><span>最后更新:</span>{{ post.updated.format("YYYY年M月D日 - HH时MM分") }}</p>
                    <p><span>原始链接:</span><a href="{{ url_for(post.path) }}"
                                            title="{{ post.title }}">{{ post.permalink }}</a></p>
                    <p><span>许可协议:</span><i class="fa fa-creative-commons"></i> <a rel="license"
                                                                                   href="http://creativecommons.org/licenses/by-nc/4.0/"
                                                                                   title="Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)">Attribution-NonCommercial
                            4.0</a></p>
                    <p><span>转载请保留以上信息。</span></p>
                </div>
            {% endif %}
            {% if post.tags and post.tags.length and not is_index %}
                <div class="post-tags">
                    {% for tag in post.tags %}
                        <a href="{{ url_for(tag.path) }}"> #{{ tag.name }} </a>
                    {% endfor %}
                </div>
            {% endif %}
        </div>
    </article>
{% endmacro %}

