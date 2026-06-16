---
layout: default
title: Home
---

# Welcome

This site is now set up for blogging with Jekyll on GitHub Pages.

## Latest posts

{% if site.posts.size > 0 %}
{% for post in site.posts %}
- [{{ post.title }}]({{ post.url | relative_url }}) <small>{{ post.date | date: "%B %-d, %Y" }}</small>
{% endfor %}
{% else %}
No posts yet.
{% endif %}
