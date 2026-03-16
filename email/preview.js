const fs = require('fs');
const path = require('path');
const { renderEmail } = require('./render');

const outDir = path.resolve(__dirname, 'out');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const now = new Date();
const { html, errors } = renderEmail({
  template: 'base.mjml.hbs',
  data: {
    subject: '[Preview] Munich Daily 테스트 레터',
    title: 'Munich Daily 테스트 레터',
    intro: '이 레터는 MJML 템플릿 프리뷰 테스트용입니다.',
    brand_line: 'PythonToGo Newsletter · Munich Daily',
    date_line: now.toISOString().slice(0, 10),
    cover_image: 'https://picsum.photos/1200/630',
    content_html: `
      <div style="font-size:16px; line-height:1.7;">
        <p>안녕! 아래에 이멜 본문 렌더 테스트 쓸수잇음</p>
        <ul>
          <li><span style="font-weight:600;">first</span> point</li>
          <li><span style="font-weight:600;">second</span> point</li>
        </ul>
        <p class="mono">코드 블록 사용가능</p>
      </div>
    `,
    cta_text: 'View on Web',
    cta_url: 'https://pythontogo.github.io/newsletter/',
    unsubscribe_url: 'https://pythontogo.github.io/newsletter/unsubscribe?type=munich-daily',
    recipient_email: 'you@example.com',
    site_name: 'PythonToGo',
    year: String(now.getFullYear())
  }
});

const outPath = path.join(outDir, 'preview.html');
fs.writeFileSync(outPath, html, 'utf8');

if (errors.length) {
  console.warn('MJML render warnings/errors:', errors);
}

console.log('Wrote:', outPath);

