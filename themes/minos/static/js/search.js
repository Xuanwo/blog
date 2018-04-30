function search() {
  var text = decodeURI(window.location.search.substring(1).split("&")[0].split("=")[1]);
  $(".archive-category").text(`"${text}" 的搜索结果`);
  $.getJSON("/search?text=" + text, function(result) {
    $.each(result.docs, function(i, field) {
      $(".archives").append(`<article class="archive-article archive-type-post">
          <div class="archive-article-inner">
              <header class="archive-article-header">
                  <a href="${field.url}" class="archive-article-date"></a>
                  <h1 itemprop="name">
                      <a class="archive-article-title" href="${field.url}">${field.title.replace(" // Xuanwo's Blog", "")}</a>
                  </h1>
              </header>
          </div>
      </article>`);
    });
  });
};
