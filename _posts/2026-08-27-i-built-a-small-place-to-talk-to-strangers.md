---
layout: post
title: "I built a tiny place to talk to strangers (what could possibly go wrong?)"
date: 2026-08-27
tags: [side-projects, web-development, webRTC, supabase]
excerpt: "Güggli is an anonymous, interest-led video and text chat experiment. It has no accounts, a Swiss name, and a healthy respect for the Report button."
---

I have made a website where you can press one button and be paired with a stranger.

Yes, I am aware this sounds like the opening sentence of a cautionary tale.

The project is called **Güggli**: a small, anonymous place for a one-to-one video or text conversation. You pick a few things you might like to talk about—music, travel, tech, whatever is on your mind—and it tries to find someone in the same mood. Or you choose random and hand the steering wheel to fate, which has never made a questionable decision online.

The premise is deliberately simple: no profile to curate, no follower count to accidentally acquire, no “personal brand” to moisturise before showing up. Just a conversation.

## Why make this?

Because the internet is extremely good at making us adjacent to other people without necessarily letting us talk to them.

There are group chats, comment sections, feeds, communities, professional networks, unprofessional networks, and apps that want to know your favourite type of oat milk before they will let you send a thumbs-up. I wanted to see whether there was still room for something much smaller: *I feel like talking; does anyone else?*

That is the entire pitch. It fits on a sticky note. The implementation, naturally, does not.

## The bit that is actually built

Güggli is a mobile-first web app built with Next.js, TypeScript, Supabase and the browser's WebRTC APIs.

The app creates a lightweight anonymous browser session, places it in a matching queue and pairs it with someone who chose the same mode—video or text. Shared interests are preferred, but the app can fall back to a random match because an empty queue is not a personality trait.

For video conversations, the actual audio and video travel directly between the two browsers with WebRTC. Supabase is the backstage person: it helps with matching and lets the browsers exchange the small bits of information they need to connect. It does not carry or store the call itself.

There is also a very unglamorous but important set of buttons: next, leave and report. The goal is low friction *into* a conversation, and even lower friction *out* of one. I consider that a feature, not an admission of defeat.

## Things I learned while politely asking browsers to cooperate

WebRTC is one of those technologies that feels magical right up until two perfectly reasonable networks decide they have never heard of each other.

It turns out a random video chat needs more than a big “Find someone” button. It needs a matchmaking queue that does not pair people twice, signaling so browsers can negotiate a connection, ICE servers for finding a route through the internet, cleanup when someone leaves, and a plan for the person who presses “Next” with the speed and confidence of someone skipping YouTube ads.

The product decisions were also more interesting than I expected:

* **No accounts.** A conversation should not require creating another tiny digital résumé.
* **Interests are optional.** They are a nudge toward a better first sentence, not a personality exam.
* **Text is a real mode.** Sometimes talking to a stranger is easier when your face is not part of the opening ceremony.
* **Safety belongs in the first version.** A report flow, the ability to leave, and blocking unsafe pairs are not “later” work when the product is about meeting people you do not know.

The resulting app is intentionally modest. It does not promise that every conversation will be profound, life-changing, or even particularly coherent. It does promise not to make you upload a headshot before finding out.

## About the name

“Güggli” has a suitably Swiss-German feel: cheerful, a little odd, and much better than naming the project something like `peer-connection-prototype-final-final-2`.

The current deployment is at [guggeli.vercel.app](https://guggeli.vercel.app/), which is admittedly the URL equivalent of turning up to a wedding in a lanyard. The app is Güggli; the domain is a temporary administrative compromise. A proper home for the little rooster is on the list.

## What now?

I am treating Güggli as an experiment, not a grand declaration that I have solved human connection with a gradient and some TypeScript.

Next up is the practical work: testing the rough edges of video connections across real devices and networks, improving the matching experience, and learning whether people actually want this kind of small, spontaneous corner of the web.

If you try it and it leads to a lovely conversation, I will be delighted. If it leads to two people silently looking at each other while both wait for the other one to speak first, well: that is also a very authentic internet experience.

Either way, the little rooster is live.
