const fs = require('fs');
const path = require('path');

const resolveFromApi = (name) =>
  require(require.resolve(name, { paths: [path.resolve(__dirname, '../api')] }));

const dotenv = resolveFromApi('dotenv');
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const matter = resolveFromApi('gray-matter');
const { marked } = resolveFromApi('marked');
const nodemailer = resolveFromApi('nodemailer');
const { renderEmail } = require('./render');

function usage() {
  console.log('Usage: node email/send-test.js <post-path> <to-email>');
  console.log('Example: node email/send-test.js _posts/newletter/munich-daily/2026-03-16-munich-test.md you@example.com');
}

async function main() {
  const [, , postPath, toEmail] = process.argv;

  if (!postPath || !toEmail) {
    usage();
    process.exit(1);
  }

  const root = path.resolve(__dirname, '..');
  const fullPath = path.resolve(root, postPath);

  if (!fs.existsSync(fullPath)) {
    console.error('Post file not found:', fullPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data: frontmatter, content: markdown } = matter(raw);

  const {
    title,
    date,
    newsletter_type,
    email_enabled,
    email_subject,
    email_intro,
    cover_image
  } = frontmatter;

  if (!email_enabled) {
    console.warn('Warning: email_enabled is not true for this post. Continuing for test send.');
  }

  const subject = email_subject || title || 'Newsletter';
  const brandLine =
    newsletter_type === 'munich-daily'
      ? 'PythonToGo Newsletter · Munich Daily'
      : newsletter_type === 'taeyai'
      ? 'PythonToGo Newsletter · TaeyAI'
      : 'PythonToGo Newsletter';

  const dateLine = date || new Date().toISOString().slice(0, 10);
  const contentHtml = marked.parse(markdown || '');

  const unsubscribeUrl = 'https://pythontogo.github.io/newsletter/unsubscribe';

  const { html } = renderEmail({
    template: 'base.mjml.hbs',
    data: {
      subject,
      title: title || subject,
      intro: email_intro || '',
      brand_line: brandLine,
      date_line: dateLine,
      cover_image: cover_image || '',
      content_html: contentHtml,
      cta_text: '블로그에서 보기',
      cta_url: `https://pythontogo.github.io${postPath.replace(/^_posts/, '').replace(/\.md$/, '/')}`,
      unsubscribe_url: unsubscribeUrl,
      recipient_email: toEmail,
      site_name: 'PythonToGo',
      year: String(new Date().getFullYear())
    }
  });

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASSWORD,
    SMTP_FROM_NAME,
    SMTP_FROM_EMAIL
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM_EMAIL) {
    console.error('Missing SMTP_* environment variables. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM_EMAIL (and optional SMTP_FROM_NAME).');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD
    }
  });

  const fromName = SMTP_FROM_NAME || 'PythonToGo Newsletter';
  const from = `"${fromName}" <${SMTP_FROM_EMAIL}>`;

  const info = await transporter.sendMail({
    from,
    to: toEmail,
    subject,
    html
  });

  console.log('Test email sent:', info.messageId || info);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

