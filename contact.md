---
layout: page
title: "Contact"
permalink: /contact/
---

If you have a role, project, or technical problem that could use a thoughtful pair of hands, I’d love to hear from you. I’m especially interested in software engineering, technical leadership, design-to-code workflows, DesignOps, and the small bits of automation that make teams work better.

{% if site.contact_form_endpoint != "" %}
<form class="contact-form" action="{{ site.contact_form_endpoint }}" method="POST">
  <input type="hidden" name="_subject" value="New message from olivark.github.io">
  <input type="hidden" name="_next" value="{{ '/contact/thanks/' | absolute_url }}">

  <p class="contact-form-trap" aria-hidden="true">
    <label>Leave this field empty <input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label>
  </p>

  <div class="contact-form-row">
    <p>
      <label for="contact-name">Name</label>
      <input id="contact-name" name="name" type="text" autocomplete="name" required>
    </p>
    <p>
      <label for="contact-email">Email</label>
      <input id="contact-email" name="email" type="email" autocomplete="email" required>
    </p>
  </div>

  <p>
    <label for="contact-subject">Subject</label>
    <input id="contact-subject" name="subject" type="text" required>
  </p>

  <p>
    <label for="contact-message">Message</label>
    <textarea id="contact-message" name="message" rows="7" required></textarea>
  </p>

  <button class="contact-form-submit" type="submit">Send message</button>
</form>
{% else %}
<p class="contact-form-pending">The contact form is being set up. Please check back shortly.</p>
{% endif %}
