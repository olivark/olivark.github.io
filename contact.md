---
layout: page
title: "Contact"
permalink: /contact/
---

<div class="contact-intro">
  <p class="contact-eyebrow">Opportunities &amp; collaboration</p>
  <p>If you have a role, project, or technical problem that could use a thoughtful pair of hands, I’d love to hear from you. I’m especially interested in software engineering, technical leadership, design-to-code workflows, DesignOps, and the small bits of automation that make teams work better.</p>
</div>

{% if site.contact_form_endpoint != "" %}
<section class="contact-panel" aria-labelledby="contact-form-title">
  <div class="contact-panel-heading">
    <h2 id="contact-form-title">Start a conversation</h2>
    <p>Tell me a little about what you have in mind. I’ll get back to you as soon as I can.</p>
    <p class="contact-required-note"><span aria-hidden="true">*</span> Required fields</p>
  </div>

  <form class="contact-form" action="{{ site.contact_form_endpoint }}" method="POST">
    <input type="hidden" name="_subject" value="New message from olivark.github.io">
    <input type="hidden" name="_next" value="{{ '/contact/thanks/' | absolute_url }}">

    <div class="contact-form-trap" aria-hidden="true" hidden>
      <label for="contact-website">Website</label>
      <input id="contact-website" type="text" name="_gotcha" tabindex="-1" autocomplete="off">
    </div>

    <div class="contact-form-row">
      <div class="contact-field">
        <label for="contact-name">Name <span class="contact-required" aria-hidden="true">*</span><span class="sr-only"> (required)</span></label>
        <input id="contact-name" name="name" type="text" autocomplete="name" required>
      </div>
      <div class="contact-field">
        <label for="contact-email">Email <span class="contact-required" aria-hidden="true">*</span><span class="sr-only"> (required)</span></label>
        <input id="contact-email" name="email" type="email" autocomplete="email" required>
      </div>
    </div>

    <div class="contact-field">
      <label for="contact-subject">Subject <span class="contact-required" aria-hidden="true">*</span><span class="sr-only"> (required)</span></label>
      <input id="contact-subject" name="subject" type="text" placeholder="What would you like to talk about?" required>
    </div>

    <div class="contact-field">
      <label for="contact-message">Message <span class="contact-required" aria-hidden="true">*</span><span class="sr-only"> (required)</span></label>
      <textarea id="contact-message" name="message" rows="7" placeholder="A little context is perfect." required></textarea>
    </div>

    <button class="contact-form-submit" type="submit">Send message <span aria-hidden="true">→</span></button>
  </form>
</section>
{% else %}
<p class="contact-form-pending">The contact form is being set up. Please check back shortly.</p>
{% endif %}
