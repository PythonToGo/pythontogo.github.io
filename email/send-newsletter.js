const fs = require('fs');
const path = require('path');

const resolveFromApi = (name) =>
  require(require.resolve(name, { paths: [path.resolve(__dirname, '../api')] }));

const dotenv = resolveFromApi('dotenv');
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const matter = resolveFromApi('gray-matter');
const { marked } = resolveFromApi('marked');
const nodemailer = resolveFromApi('nodemailer');
const { createClient } = resolveFromApi('@supabase/supabase-js');
const { renderEmail } = require('./render');

function usage() {
  console.log('Usage: node email/send-newsletter.js <newsletter_type> <YYYY-MM-DD>');
  console.log('  newsletter_type: munich-daily | taeyai');
  console.log('Example:');
  console.log('  node email/send-newsletter.js munich-daily 2026-03-16');
}

function resolvePostPath(newsletterType, date) {
  const root = path.resolve(__dirname, '..');
  const baseDir =
    newsletterType === 'munich-daily'
      ? '_posts/newletter/munich-daily'
      : '_posts/newletter/taeyai-테이아이';

  const dir = path.resolve(root, baseDir);
  if (!fs.existsSync(dir)) {
    throw new Error(`Directory not found: ${dir}`);
  }

  const candidates = [];

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;

    const full = path.join(dir, file);
    const raw = fs.readFileSync(full, 'utf8');

    try {
      const { data } = matter(raw);
      const fmDate = data.date && String(data.date).slice(0, 10);
      const fmType = data.newsletter_type;

      if (fmDate === date && fmType === newsletterType && data.email_enabled !== false) {
        candidates.push(file);
      }
    } catch {
      // front matter 파싱 실패 시 무시
    }
  }

  if (!candidates.length) {
    throw new Error(`No post with matching front matter for ${newsletterType} on ${date} in ${baseDir}`);
  }

  candidates.sort(); // 파일명 기준 정렬
  return path.join(baseDir, candidates[0]);
}

async function main() {
  const [, , newsletterType, date] = process.argv;

  if (!newsletterType || !date) {
    usage();
    process.exit(1);
  }

  if (!['munich-daily', 'taeyai'].includes(newsletterType)) {
    console.error('Invalid newsletter_type. Use "munich-daily" or "taeyai".');
    process.exit(1);
  }

  const postPath = resolvePostPath(newsletterType, date);

  const root = path.resolve(__dirname, '..');
  const fullPath = path.resolve(root, postPath);

  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data: frontmatter, content: markdown } = matter(raw);

  const {
    title,
    date: fmDate,
    email_enabled,
    email_subject,
    email_intro,
    cover_image
  } = frontmatter;

  if (email_enabled === false) {
    console.warn('email_enabled is false for this post. Aborting.');
    process.exit(0);
  }

  const subject = email_subject || title || 'Newsletter';
  const brandLine =
    newsletterType === 'munich-daily'
      ? 'PythonToGo Newsletter · Munich Daily'
      : 'PythonToGo Newsletter · TaeyAI';

  const dateLine = fmDate || date;
  const contentHtml = marked.parse(markdown || '');

  const unsubscribeBase = 'https://pythontogo.github.io/newsletter/unsubscribe';

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASSWORD,
    SMTP_FROM_NAME,
    SMTP_FROM_EMAIL,
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM_EMAIL) {
    console.error(
      'Missing SMTP_* environment variables. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM_EMAIL (and optional SMTP_FROM_NAME).'
    );
    process.exit(1);
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase env vars SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const { data: subscribers, error: subError } = await supabase
    .from('newsletter_subscribers')
    .select('id,email')
    .eq('newsletter_type', newsletterType)
    .is('unsubscribed_at', null);

  if (subError) {
    console.error('Failed to load subscribers:', subError);
    process.exit(1);
  }

  if (!subscribers || !subscribers.length) {
    console.log('No active subscribers; nothing to send.');
    process.exit(0);
  }

  console.log(`Sending ${newsletterType} newsletter for ${date} to ${subscribers.length} subscribers...`);

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

  let sentCount = 0;

  for (const sub of subscribers) {
    const recipientEmail = sub.email;

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
        cta_url: `https://pythontogo.github.io${postPath
          .replace(/^_posts/, '')
          .replace(/\.md$/, '/')}`,
        unsubscribe_url: `${unsubscribeBase}?type=${encodeURIComponent(
          newsletterType
        )}&email=${encodeURIComponent(recipientEmail)}`,
        recipient_email: recipientEmail,
        site_name: 'PythonToGo',
        year: String(new Date().getFullYear())
      }
    });

    try {
      await transporter.sendMail({
        from,
        to: recipientEmail,
        subject,
        html
      });
      sentCount += 1;
    } catch (err) {
      console.error('Failed to send to', recipientEmail, err.message);
    }
  }

  console.log(`Finished. Successfully sent to ${sentCount} subscribers.`);

  // 기록 남기기
  const { error: logError } = await supabase.from('newsletter_send_logs').insert({
    newsletter_type: newsletterType,
    post_path: postPath,
    emails_sent_count: sentCount,
    status: 'success'
  });

  if (logError) {
    console.error('Failed to write send log:', logError);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

