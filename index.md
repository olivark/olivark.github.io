---
layout: default
title: Home
hero: true
hero_eyebrow: "dad · dev · geek · otaku · nerd · ai"
hero_title: "Systems, side projects, and the occasional deep rabbit hole."
---

<section class="home-posts" aria-labelledby="posts-heading">
  <header class="section-heading">
    <p class="section-kicker">Latest writing</p>
    <h2 id="posts-heading">Notes from the workbench.</h2>
  </header>

<div class="post-grid">
  {% for post in site.posts %}
  <article class="post-card">
    <a class="post-card-link" href="{{ post.url | relative_url }}">
      <div class="post-card-meta">
        <span>{{ post.categories | first | default: "Notes" }}</span>
        <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%b %-d, %Y" }}</time>
      </div>
      <h3>{{ post.title }}</h3>
      <p>{{ post.excerpt | strip_html | strip_newlines | truncate: 155 }}</p>
      <span class="post-card-more">Read article <span aria-hidden="true">→</span></span>
    </a>
  </article>
  {% endfor %}
</div>
</section>
