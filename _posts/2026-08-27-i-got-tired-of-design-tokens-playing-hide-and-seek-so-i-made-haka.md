---
layout: post
title: "I got tired of design tokens playing hide-and-seek, so I made HaKa"
date: 2026-08-27
categories: [figma, design-systems, tiny-tools]
---

Design tokens are supposed to be the shared language between design and development. In practice, they can feel more like a long-distance relationship: everybody says they are communicating, but someone is definitely looking at an old JSON file.

So I made [HaKa — Figma Variables Export & Import](https://www.figma.com/community/plugin/1640753412567944113/haka-figma-variables-export-import).

HaKa is a small Figma plugin for moving Variables in and out of Figma without turning every token update into a dramatic three-act play. You can import token files, review what would change before anything happens, export your Variables as JSON, and—if your team is ready for the fancy bit—trigger its own GitHub Actions workflow or HTTPS endpoint.

The name is short for **Hand-off / Katalyst**. Which is either a neat description of the tool or an admission that I have spent a suspicious amount of time naming things. Both can be true.

## The very relatable problem

I wanted a workflow where designers could work in Figma Variables and developers could work with token files, with neither side having to pretend they enjoy copy-pasting values across tools.

The important part is that designers can see the proposed changes before import. No “I clicked the button and now the colour system is an archaeological site” moment. And when it is time to send approved tokens downstream, developers still own the automation, credentials, and deployment decisions.

In other words: designers approve intent; developers own delivery. Everyone gets to keep their favourite kind of control.

## What HaKa does

- Imports Canonical JSON, DTCG files, nested JSON, and related files such as `palette.json` and `theme.json`.
- Shows an import review before it updates Figma Variables.
- Exports Variables as HaKa’s full-fidelity Canonical JSON or interoperable DTCG JSON.
- Can trigger a team-owned GitHub Actions workflow or send a JSON payload to a team-owned HTTPS endpoint.
- Helps find unused local Variables, because apparently they do not clean themselves up overnight.

## One deliberately unglamorous decision

HaKa does not come with a shared cloud backend.

That is intentional. I did not want a plugin for design tokens to quietly become a tiny hosting company with a support inbox, a billing page, and a future involving phrases like “monthly active webhook.” If you publish from HaKa, your team uses its own GitHub Actions workflow or its own endpoint. Your infrastructure, your secrets, your rules.

For a quick start, export JSON and put it wherever your team already keeps token files. No network calls required. Very peaceful. Almost suspiciously peaceful.

## Canonical JSON vs. DTCG, in human words

HaKa’s Canonical JSON is the “please remember everything exactly as it was” format. It is the best choice for bringing a file back into Figma with the least loss of Figma-specific detail.

DTCG JSON is the “let’s be good citizens of the token ecosystem” format. Use it when the file needs to work with other token tools and pipelines. HaKa supports it when the token graph is unambiguous and will warn you when a round trip starts getting philosophical.

## Try it

You can install HaKa from the [Figma Community](https://www.figma.com/community/plugin/1640753412567944113/haka-figma-variables-export-import). If you try it, I would genuinely love to hear where it fits your workflow, where it feels weird, and which design-token problem has been quietly ruining your afternoon.

Because the dream is not “more JSON.” The dream is fewer tiny hand-off rituals standing between a good design decision and the product that needs it.
