---
layout: post
title: "Building BeeHive Tracker: a small app with a lot to teach me"
date: 2026-09-06
categories: [projects, web-development]
tags: [nextjs, react, pwa, indexeddb, beekeeping]
description: "Building a local-first beekeeping app, keeping its scope small, and learning from the details that make software dependable."
---

I've been working on **BeeHive Tracker**, a small web app for keeping track of apiaries, hives, inspections, feedings, treatments, and harvests.

The idea is straightforward: open an apiary, choose a hive, record what happened, and save it. That short sequence has become a useful reference point for the project. Whenever I look at another feature or another screen, I can come back to it and ask whether the app is getting easier to use.

I'm building it with Swiss hobby and small-scale beekeepers in mind. That gives the project some concrete constraints: a phone-sized screen, potentially unreliable reception, and more than one language. The interface currently supports English, German, French, and Italian.

## A small workflow with useful details

What interests me about this project is how much there is to think about inside such a small workflow.

An inspection record can include observations about the queen, brood, food stores, population, and health. There are also feeding, treatment, and harvest records. Each entry belongs to a hive, and each hive belongs to an apiary. The structure is easy to describe, but the interface still has to make it easy to find the right place and record something useful without unnecessary typing.

## Keeping records on the device

For the implementation, I'm using Next.js with React and TypeScript, Tailwind CSS for styling, and Dexie over IndexedDB for storage. The app is configured as an installable Progressive Web App, with a service worker that caches visited pages and assets for offline use. That still needs testing in the field; local storage alone doesn't guarantee every screen will be available without a connection.

The storage choice is one of the most meaningful parts of the project for me. Beekeeping records live in the browser on the user's device. Saving an inspection doesn't depend on sending it to an application server.

That also means I need to be clear about what local storage provides. It isn't a cloud backup, and it doesn't automatically move records between devices. Clearing browser data can remove those records. Settings includes a JSON export so users can keep a separate copy, along with a way to delete their local data. There isn't an import screen yet, so that export isn't a complete backup-and-restore workflow.

I like the simplicity of this approach, but it comes with responsibilities that are easy to overlook when the happy path works.

## A small race condition

One of those showed up as a particularly unfriendly error:

```text
ConstraintError: Key already exists in the object store.
```

The settings initialization looked harmless: check whether a `default` record exists, and create it if it doesn't. The problem was the gap between those two operations. Two callers could both read an empty result and then both try to insert the same key.

The fix was to put the check and insert inside a read-write transaction. I applied the same protection to default-data seeding and made failed initialization retryable. I also fixed a case where a renamed default medicament could collide with its original ID during seeding.

I added regression tests for concurrent settings reads, preserving renamed records, and rolling back failed seeding. It's a small set of tests, but it covers behavior that matters: opening the app shouldn't produce an error, and initialization shouldn't overwrite something someone has already changed.

## Explaining data handling

I also added Vercel Web Analytics. That prompted a related piece of work: explaining data handling in the app itself. The integration filters apiary and hive IDs, query strings, and fragments out of page-view URLs before sending them. Saved beekeeping records and notes aren't included in those events. There's now a privacy and data handling note in Settings in each supported language.

## Keeping the scope honest

Some features are deliberately still waiting. Reminder and notification functionality remains disabled while the push infrastructure is unfinished. I'd rather let the working parts of the app define its current scope than have the interface promise something it can't yet deliver.

There's more to do, especially around validating how comfortable the main workflow feels on a phone and making the limits of local storage easy to understand. For now, I'm enjoying working on a project where the details have such a direct connection to usefulness. A reliable save, a readable form, and a clear history are satisfying things to get right.

## Try it

You can try [BeeHive Tracker](https://beewatch.vercel.app/).
