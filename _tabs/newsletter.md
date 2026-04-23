---
title: "NEWSLETTER"
icon: "fas fa-envelope-open-text"
order: 50
layout: page
permalink: /newsletter/
---
<section class="newsletter-hero">
  <div class="newsletter-hero-inner">
    <p class="eyebrow">PythonToGo Letters (WIP)</p>
    <h1 class="newsletter-title">Munich Daily &amp; TaeyAI<br />이메일로 받아보기 · Subscribe via Email</h1>
    <p class="newsletter-subtitle">
      매주 뮌헨에서의 일상과 인공지능에 대한 생각을,<br />
      블로그에 다 적지 못한 이야기와 함께 가장 먼저 전해드립니다.<br />
      Every week, receive stories from Munich and reflections on AI,<br />
      plus behind-the-scenes insights not found on the blog, straight to your inbox first.</span>
    </p>
  </div>
</section>

<section class="newsletter-layout">
  <div class="newsletter-column newsletter-column--info">
    <div class="newsletter-card newsletter-card--info">
      <h2>어떤 레터를 받게 되나요?</h2>
      <h2>What kind of letters will you receive?</h2>

      <ul>
        <li>
          <strong>Munich Daily</strong> · 독일 뮌헨에서의 생활, 카페·식당 리뷰, 작은 발견들 · Life in Munich, café & restaurant reviews, small discoveries.
        </li>
        <li>
          <strong>TaeyAI</strong> · 인공지능과 도구, 공부 기록, 일상에 섞인 실험 로그 · Thoughts on AI & tools, study notes, and experiment logs from daily life.
        </li>
        <li>
          블로그에 다 담지 못한 비하인드 스토리와 링크 묶음<br />Behind-the-scenes stories & curated links not available on the blog.
        </li>
      </ul>
      <p class="newsletter-note">
        지금은 소규모 구독자로 운영하는 실험적인 레터입니다.<br />
        <span style="color:#9ca3af">Currently an experimental letter with a small group of subscribers.</span>
      </p>
    </div>
  </div>

  <div class="newsletter-column newsletter-column--form">
    <div class="newsletter-card newsletter-card--form">
      <h2>구독 신청 · Subscribe</h2>
      <p class="newsletter-form-caption">
        이메일 주소 하나만 있으면 충분해요.<br />
        All you need is your email address.
      </p>

      <form id="newsletter-form" class="newsletter-form">
        <label for="newsletter-email" class="newsletter-label">E-mail</label>
        <input
          type="email"
          id="newsletter-email"
          name="email"
          class="newsletter-input"
          required
          placeholder="you@example.com"
          autocomplete="email"
        />

        <fieldset class="newsletter-fieldset">
          <legend>구독할 뉴스레터 · Newsletter to follow</legend>
          <label class="newsletter-radio">
            <input type="radio" name="newsletter_type" value="munich-daily" checked />
            <span class="label-main">Munich Daily</span>
            <span class="label-sub">Munich's Cafe, Restaurant Review</span>
          </label>
          <label class="newsletter-radio">
            <input type="radio" name="newsletter_type" value="taeyai" />
            <span class="label-main">TaeyAI</span>
            <span class="label-sub">Daily thoughts, study notes, and AI experiments</span>
          </label>
        </fieldset>

        <button type="submit" class="newsletter-button">무료로 구독하기</button>

        <p class="newsletter-privacy">
          이메일은 뉴스레터 발송에만 사용되며, 언제든지 메일 하단의 링크로 구독을 해지할 수 있습니다.<br />
          Your email will only be used for this newsletter, and you can unsubscribe anytime via the link at the bottom of each email.
        <br />

        </p>

        <p id="newsletter-message" class="newsletter-message"></p>
      </form>
    </div>
  </div>
</section>

<style>
  .newsletter-hero {
    margin-bottom: 1.5rem;
  }

  .newsletter-hero-inner {
    padding: 1.75rem 1.75rem 1.5rem 1.75rem;
    border-radius: 1.5rem;
    background: radial-gradient(circle at top left, #4f46e5 0, #0f172a 45%, #020617 100%);
    color: #e5e7eb;
    box-shadow: 0 18px 45px rgba(15, 23, 42, 0.55);
  }

  .newsletter-hero .eyebrow {
    margin: 0 0 0.35rem 0;
    font-size: 0.8rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    opacity: 0.8;
  }

  .newsletter-title {
    margin: 0 0 0.75rem 0;
    font-size: clamp(1.8rem, 2.4vw, 2.2rem);
    line-height: 1.25;
    font-weight: 800;
  }

  .newsletter-subtitle {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.7;
    max-width: 42rem;
    color: #cbd5f5;
  }

  .newsletter-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    gap: 1.5rem;
    align-items: flex-start;
  }

  .newsletter-column {
    min-width: 0;
  }

  /* dark theme / default mode */
  .newsletter-card {
    padding: 1.5rem 1.6rem;
    border-radius: 1.25rem;
    border: 1px solid rgba(148, 163, 184, 0.45);
    background: rgba(15, 23, 42, 0.96);
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.7);
    color: #e5e7eb;
  }

  .newsletter-card--info h2,
  .newsletter-card--form h2 {
    margin-top: 0;
    margin-bottom: 0.65rem;
    font-size: 1.1rem;
    font-weight: 700;
  }

  .newsletter-card--info ul {
    padding-left: 1.1rem;
    margin: 0 0 0.9rem 0;
    font-size: 0.92rem;
  }

  .newsletter-card--info li + li {
    margin-top: 0.15rem;
  }

  .newsletter-note {
    margin: 0;
    font-size: 0.86rem;
    color: #9ca3af;
  }

  .newsletter-form-caption {
    margin: 0 0 0.9rem 0;
    font-size: 0.9rem;
    color: #9ca3af;
  }

  .newsletter-form {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }

  .newsletter-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #e5e7eb;
  }

  .newsletter-input {
    border-radius: 999px;
    border: 1px solid #4b5563;
    padding: 0.5rem 0.9rem;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
    background-color: #020617;
    color: #e5e7eb;
  }

  .newsletter-input::placeholder {
    color: #6b7280;
  }

  .newsletter-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 1px rgba(129, 140, 248, 0.55);
    background-color: #020617;
  }

  .newsletter-fieldset {
    border: 1px solid #4b5563;
    border-radius: 1rem;
    padding: 0.7rem 0.9rem;
    margin-top: 0.4rem;
  }

  .newsletter-fieldset legend {
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0 0.35rem;
    color: #9ca3af;
  }

  .newsletter-radio {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 0.6rem;
    row-gap: 0.1rem;
    align-items: center;
    padding: 0.45rem 0.3rem;
    border-radius: 0.7rem;
    cursor: pointer;
  }

  .newsletter-radio + .newsletter-radio {
    margin-top: 0.2rem;
  }

  .newsletter-radio input[type='radio'] {
    accent-color: #4f46e5;
  }

  .newsletter-radio .label-main {
    font-size: 0.9rem;
    font-weight: 600;
    color: #e5e7eb;
  }

  .newsletter-radio .label-sub {
    grid-column: 2 / 3;
    font-size: 0.8rem;
    color: #9ca3af;
  }

  .newsletter-button {
    margin-top: 0.4rem;
    border: none;
    border-radius: 999px;
    padding: 0.55rem 1.1rem;
    font-size: 0.95rem;
    font-weight: 600;
    background: linear-gradient(135deg, #4f46e5, #f97316);
    color: #f9fafb;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.7);
    transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
  }

  .newsletter-button:hover {
    transform: translateY(-1px);
    filter: brightness(1.02);
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.85);
  }

  .newsletter-button:active {
    transform: translateY(0);
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.6);
  }

  .newsletter-privacy {
    margin: 0.35rem 0 0 0;
    font-size: 0.78rem;
    color: #9ca3af;
  }

  .newsletter-message {
    margin: 0.45rem 0 0 0;
    font-size: 0.85rem;
    min-height: 1.3em;
  }

  @media (max-width: 960px) {
    .newsletter-layout {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (max-width: 640px) {
    .newsletter-hero-inner {
      padding: 1.4rem 1.35rem;
      border-radius: 1.25rem;
    }

    .newsletter-card {
      padding: 1.25rem 1.2rem;
    }
  }

  /* ───────── light mode ───────── */

  html[data-mode='light'] .newsletter-hero-inner {
    background: radial-gradient(circle at top left,rgb(203, 207, 223) 0,rgb(159, 193, 238) 32%,rgb(186, 202, 219) 100%);
    color: #0f172a;
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12);
  }

  html[data-mode='light'] .newsletter-subtitle {
    color: #4b5563;
  }

  html[data-mode='light'] .newsletter-card {
    border-color: rgba(15, 23, 42, 0.08);
    background: #ffffff;
    box-shadow: 0 14px 35px rgba(15, 23, 42, 0.06);
    color: #111827;
  }

  html[data-mode='light'] .newsletter-label {
    color: #374151;
  }

  html[data-mode='light'] .newsletter-input {
    border-color: #d1d5db;
    background-color: #f9fafb;
    color: #111827;
  }

  html[data-mode='light'] .newsletter-input::placeholder {
    color: #9ca3af;
  }

  html[data-mode='light'] .newsletter-fieldset {
    border-color: #e5e7eb;
  }

  html[data-mode='light'] .newsletter-fieldset legend {
    color: #4b5563;
  }

  html[data-mode='light'] .newsletter-radio .label-main {
    color: #111827;
  }

  html[data-mode='light'] .newsletter-radio .label-sub,
  html[data-mode='light'] .newsletter-note,
  html[data-mode='light'] .newsletter-form-caption,
  html[data-mode='light'] .newsletter-privacy {
    color: #6b7280;
  }
</style>

<script>
  (function () {
    const form = document.getElementById('newsletter-form');
    const messageEl = document.getElementById('newsletter-message');

    if (!form || !messageEl) return;

    const apiBase =
      '{{ site.newsletter.api_base_prod }}' ||
      ('{{ jekyll.environment }}' === 'development' ? '{{ site.newsletter.api_base_dev }}' : '');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      messageEl.textContent = 'Processing your subscription...';

      const emailInput = document.getElementById('newsletter-email');
      const typeInput = form.querySelector('input[name="newsletter_type"]:checked');

      const email = emailInput && emailInput.value.trim();
      const newsletter_type = typeInput && typeInput.value;

      if (!email || !newsletter_type) {
        messageEl.textContent = '이메일과 구독 타입을 선택해주세요. (Please enter your email and select a newsletter type.)';
        return;
      }

      try {
        const res = await fetch(apiBase + '/api/newsletter/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, newsletter_type })
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          messageEl.textContent = data.error || '구독 처리 중 문제가 발생했습니다. (There was a problem processing your subscription.)';
          return;
        }

        messageEl.textContent = '구독이 완료되었습니다. 감사합니다! (Subscription completed. Thank you!)';
        form.reset();
      } catch (err) {
        console.error(err);
        messageEl.textContent = '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요. (A network error occurred. Please try again shortly.)';
      }
    });
  })();
</script>

