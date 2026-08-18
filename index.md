---
layout: default
title: Home
hero: true
hero_eyebrow: "Hello World"
hero_title: "dad · dev · otaku · geek · nerd"
---

## Posts

<ul class="post-list">
  {% for post in site.posts %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <span class="post-date">{{ post.date | date: "%b %-d, %Y" }}</span>
  </li>
  {% endfor %}
</ul>
