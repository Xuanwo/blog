<div id="menu" class="menu-right">
    <ul>
        <li>
            <form class="menu-search">
                <div class="form-group header">
                    <span>
                    <i class="fa fa-search searchico"></i>
                    <input type="text" class="search-form-input ins-search-input" placeholder="Search" />
                    <a href="#" class="close-menu"><i class="fa fa-close"></i></a>
                        </span>
                </div>
            </form>
        </li>
        <li><a href="{{ config.root }}"><i class="fa fa-home"></i>Home</a></li>
        <li><a href="{{ config.root }}about"><i class="fa fa-user"></i>About</a></li>
        <li class="submenu">
            <a href="#"><i class="fa fa-book"></i>Categories<b class="caret"></b></a>
            <ul class="submenu-list">
                {% for category in site.categories %}
                    <li><a href="{{ config.root }}{{ category.path }}">{{ category.name }} <span
                                    class="badge">{{ category.length }}</span></a></li>
                {% endfor %}
            </ul>
        </li>
        <li class="submenu">
            <a href="#"><i class="fa fa-calendar"></i>Archives <b class="caret"></b></a>
            {{ list_archives({type: "yearly", show_count: false, class: "submenu"} ) }}
        </li>
    </ul>
</div>
