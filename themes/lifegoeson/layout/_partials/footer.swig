<footer>
    <div class="footer">
        <div class="container">
            <div class="row">
                <div class="col-sm-2 col-md-2 footer-widget">
                    <h3>Statistics</h3>

                    <span>No BB, just do it!</span>

                    <div class="stats">
                        <div class="line">
                            <span class="counter">{{ site.posts.length }}</span>
                            <span class="caption">Articles</span>
                        </div>
                        <div class="line">
                            <span class="counter">{{ site.categories.length }}</span>
                            <span class="caption">Categories</span>
                        </div>
                        <div class="line">
                            <span class="counter">{{ site.tags.length }}</span>
                            <span class="caption">Tags</span>
                        </div>
                    </div>
                </div>

                <div class="col-sm-4 col-md-4 footer-widget">
                    <h3>Recent posts</h3>
                    <div class="post-recent-widget">
                        <div class="row">
                            <div class="col-sm-12">
                                {{ list_posts({amount: 10}) }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-sm-6 col-md-6 footer-widget clearfix">
                    <h3>Tags</h3>
                    <ul class="tags">
                        {% for tag in site.tags %}
                            <li><a href="{{ config.root }}{{ tag.path }}">{{ tag.name }}</a></li>
                        {% endfor %}
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="copyright">
        <div class="container">
            <p class="pull-left">Designed by <a href="http://xuanwo.org">Xuanwo.</a> Powered by <a
                        href="https://hexo.io">Hexo.</a></p>
            <ul class="social-links pull-right">
                <li><a href="https://twitter.com/OnlyXuanwo"><i class="fa fa-twitter"></i></a></li>
                <li><a href="https://www.facebook.com/onlyxuanwo"><i class="fa fa-facebook"></i></a></li>
                <li><a href="https://plus.google.com/u/0/116093463258836167644"><i class="fa fa-google-plus"></i></a>
                </li>
            </ul>
        </div>
    </div>
</footer>

<script type="text/javascript" src="/dist/js/jquery.min.js"></script>
<script type="text/javascript" src="/dist/js/bootstrap.min.js"></script>
<script type="text/javascript" src="/dist/js/wow.min.js"></script>
<script type="text/javascript" src="/dist/js/custom.js"></script>
<script type="text/javascript" src="/dist/js/prism.js"></script>
<script type="text/javascript">
    $("img").addClass("img-responsive");
</script>
<script id="dsq-count-scr" src="//only0god.disqus.com/count.js" async></script>
<script>
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
        a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
    ga('create', 'UA-51515330-1', 'auto');
    ga('send', 'pageview');
</script>