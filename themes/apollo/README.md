Hexo theme: Apollo
=================

**This hexo theme is modified from SANOGRAPHIX.NET**

[Original](https://github.com/sanographix/tumblr/tree/master/apollo) (Tumblr theme)  
[Demo](http://joyceim.github.io/hexo-theme-apollo)


##Installation

###Install

Run this command from inside your hexo project
``` bash
$ git clone https://github.com/joyceim/hexo-theme-apollo.git themes/apollo
```

**Apollo requires Hexo 2.4 and above.**

###Update

``` bash
cd themes/apollo
git pull
```

##Configuration

``` yml
# Header
menu:
    Home: /
    Archives: /archives
rss: /atom.xml

# Content
excerpt_link: Read More
fancybox: true

# Miscellaneous
google_analytics:
favicon: /favicon.png
```

- **menu** - Navigation menu
- **rss** - RSS link
- **excerpt_link** - "Read More" link at the bottom of excerpted articles. `false` to hide the link.
- **fancybox** - Enable [Fancybox](http://fancyapps.com/fancybox/)
- **google_analytics** - Google Analytics ID
- **favicon** - Favicon path
