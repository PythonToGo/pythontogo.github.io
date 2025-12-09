/**
 * admin page
 */

(function() {
  'use strict';

  // settings
  const GITHUB_REPO = 'PythonToGo/PythonToGo.github.io';
  const GITHUB_BRANCH = 'main';
  const GITHUB_USERNAME = 'PythonToGo';
  const ADMIN_PASSWORD_KEY = 'admin_password'; // simple password authentication

  let mdeEditor = null;
  let currentPostPath = null;

  // GitHub API header
  function getAuthHeaders() {
    const token = localStorage.getItem('github_pat');
    if (!token) {
      throw new Error('GitHub 토큰이 필요합니다.');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28'
    };
  }

  // check admin login
  async function checkAdminAuth() {
    // check GitHub authentication
    if (window.GitHubAuth) {
      const isAuth = await window.GitHubAuth.isAuthenticated();
      if (isAuth) {
        const username = await window.GitHubAuth.getUsername();
        if (username === GITHUB_USERNAME) {
          return true;
        }
      }
    }
    
    // simple password authentication (for development)
    const savedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY);
    return savedPassword === 'admin'; // recommended to use a more secure method in production
  }

  // handle admin login
  async function handleLogin() {
    const password = document.getElementById('admin-password').value;
    const errorDiv = document.getElementById('auth-error');

    // try GitHub authentication
    if (window.GitHubAuth) {
      const isAuth = await window.GitHubAuth.isAuthenticated();
      if (isAuth) {
        const username = await window.GitHubAuth.getUsername();
        if (username === GITHUB_USERNAME) {
          showAdminEditor();
          return;
        }
      }
    }

    // simple password authentication (for development)
    if (password === 'admin') {
      localStorage.setItem(ADMIN_PASSWORD_KEY, password);
      showAdminEditor();
    } else {
      errorDiv.textContent = 'Password is incorrect.';
      errorDiv.style.display = 'block';
    }
  }

  // show admin editor
  function showAdminEditor() {
    document.getElementById('admin-auth').style.display = 'none';
    document.getElementById('admin-editor').style.display = 'block';
    initEditor();
  }

  // initialize EasyMDE editor
  function initEditor() {
    if (mdeEditor) {
      return;
    }

    mdeEditor = new EasyMDE({
      element: document.getElementById('mde-editor'),
      spellChecker: false,
      autosave: {
        enabled: true,
        uniqueId: 'admin-post-editor',
        delay: 1000,
      },
      toolbar: [
        'bold', 'italic', 'strikethrough', '|',
        'heading-1', 'heading-2', 'heading-3', '|',
        'code', 'quote', 'unordered-list', 'ordered-list', '|',
        'link', 'image', 'table', '|',
        'preview', 'side-by-side', 'fullscreen', '|',
        'guide'
      ]
    });
  }

  // create new post
  function newPost() {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const timeStr = today.toTimeString().split(' ')[0].substring(0, 5);

    document.getElementById('post-title').value = '';
    document.getElementById('post-date').value = dateStr;
    document.getElementById('post-time').value = timeStr;
    document.getElementById('post-categories').value = '';
    document.getElementById('post-tags').value = '';
    document.getElementById('post-pin').checked = false;
    document.getElementById('post-math').checked = false;
    document.getElementById('post-mermaid').checked = false;
    document.getElementById('post-comments').checked = true;

    if (mdeEditor) {
      mdeEditor.value('');
    }

    currentPostPath = null;
    document.getElementById('save-status').textContent = '';
  }

  // load post list
  async function loadPosts() {
    const postListDiv = document.getElementById('post-list');
    const isVisible = postListDiv.style.display !== 'none';

    if (isVisible) {
      postListDiv.style.display = 'none';
      return;
    }

    try {
      const token = localStorage.getItem('github_pat');
      if (!token) {
        alert('GitHub 토큰이 필요합니다. GitHub로 로그인해주세요.');
        if (window.GitHubAuth) {
          window.GitHubAuth.login();
        }
        return;
      }

      // get file list in _posts directory using GitHub API
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/_posts`,
        {
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load post list.');
      }

      const files = await response.json();
      const posts = files
        .filter(file => file.name.endsWith('.md'))
        .sort((a, b) => b.name.localeCompare(a.name));

      let html = '<h4>Post List</h4>';
      posts.forEach(post => {
        html += `<div class="post-item" data-path="${post.path}">${post.name}</div>`;
      });

      postListDiv.innerHTML = html;
      postListDiv.style.display = 'block';

      // click event for post
      postListDiv.querySelectorAll('.post-item').forEach(item => {
        item.addEventListener('click', () => {
          loadPost(item.dataset.path);
        });
      });

    } catch (error) {
      console.error('Error loading posts:', error);
      alert('Failed to load post list: ' + error.message);
    }
  }

  // load post
  async function loadPost(filePath) {
    try {
      const token = localStorage.getItem('github_pat');
      if (!token) {
        alert('GitHub token is required.');
        return;
      }

      // get file content using GitHub API
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
        {
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load post.');
      }

      const file = await response.json();
      const content = atob(file.content.replace(/\n/g, ''));

      // parse front matter
      const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (!frontMatterMatch) {
        throw new Error('Invalid post format.');
      }

      const frontMatter = frontMatterMatch[1];
      const body = frontMatterMatch[2];

      // parse front matter
      const titleMatch = frontMatter.match(/title:\s*["'](.+?)["']/);
      const dateMatch = frontMatter.match(/date:\s*(.+?)(?:\s|$)/);
      const categoriesMatch = frontMatter.match(/categories:\s*\[(.+?)\]/);
      const tagsMatch = frontMatter.match(/tags:\s*\[(.+?)\]/);
      const pinMatch = frontMatter.match(/pin:\s*(true|false)/);
      const mathMatch = frontMatter.match(/math:\s*(true|false)/);
      const mermaidMatch = frontMatter.match(/mermaid:\s*(true|false)/);
      const commentsMatch = frontMatter.match(/comments:\s*(true|false)/);

      if (titleMatch) {
        document.getElementById('post-title').value = titleMatch[1];
      }
      if (dateMatch) {
        const dateStr = dateMatch[1].split(' ')[0];
        const timeStr = dateMatch[1].split(' ')[1] || '12:00';
        document.getElementById('post-date').value = dateStr;
        document.getElementById('post-time').value = timeStr.substring(0, 5);
      }
      if (categoriesMatch) {
        const categories = categoriesMatch[1]
          .split(',')
          .map(c => c.trim().replace(/["']/g, ''))
          .filter(c => c);
        document.getElementById('post-categories').value = categories.join(', ');
      }
      if (tagsMatch) {
        const tags = tagsMatch[1]
          .split(',')
          .map(t => t.trim().replace(/["']/g, ''))
          .filter(t => t);
        document.getElementById('post-tags').value = tags.join(', ');
      }
      document.getElementById('post-pin').checked = pinMatch && pinMatch[1] === 'true';
      document.getElementById('post-math').checked = mathMatch && mathMatch[1] === 'true';
      document.getElementById('post-mermaid').checked = mermaidMatch && mermaidMatch[1] === 'true';
      document.getElementById('post-comments').checked = !commentsMatch || commentsMatch[1] === 'true';

      if (mdeEditor) {
        mdeEditor.value(body);
      }

      currentPostPath = filePath;
      document.getElementById('post-list').style.display = 'none';
      document.getElementById('save-status').textContent = '';

    } catch (error) {
      console.error('Error loading post:', error);
      alert('Failed to load post: ' + error.message);
    }
  }

  // save post
  async function savePost() {
    try {
      const token = localStorage.getItem('github_pat');
      if (!token) {
        alert('GitHub token is required. Please login to GitHub.');
        if (window.GitHubAuth) {
          window.GitHubAuth.login();
        }
        return;
      }

      const title = document.getElementById('post-title').value.trim();
      if (!title) {
        alert('Please enter a title.');
        return;
      }

      const date = document.getElementById('post-date').value;
      const time = document.getElementById('post-time').value;
      const categories = document.getElementById('post-categories').value
        .split(',')
        .map(c => c.trim())
        .filter(c => c)
        .map(c => `"${c}"`);
      const tags = document.getElementById('post-tags').value
        .split(',')
        .map(t => t.trim())
        .filter(t => t)
        .map(t => `"${t}"`);
      const pin = document.getElementById('post-pin').checked;
      const math = document.getElementById('post-math').checked;
      const mermaid = document.getElementById('post-mermaid').checked;
      const comments = document.getElementById('post-comments').checked;

      const content = mdeEditor ? mdeEditor.value() : '';

      // create front matter
      const frontMatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: ${date} ${time}:00
categories: [${categories.join(', ')}]
tags: [${tags.join(', ')}]
pin: ${pin}
math: ${math}
mermaid: ${mermaid}
comments: ${comments}
---

${content}`;

      // create filename
      const dateStr = date.replace(/-/g, '-');
      const titleSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      const filename = `${dateStr}-${titleSlug}.md`;
      const filePath = `_posts/${filename}`;

      // save file using GitHub API
      let sha = null;
      if (currentPostPath) {
        // get SHA if it is an existing file
        const getResponse = await fetch(
          `https://api.github.com/repos/${GITHUB_REPO}/contents/${currentPostPath}`,
          {
            headers: getAuthHeaders()
          }
        );
        if (getResponse.ok) {
          const file = await getResponse.json();
          sha = file.sha;
        }
      }

      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
        {
          method: currentPostPath ? 'PUT' : 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            message: currentPostPath ? `Update post: ${title}` : `Create post: ${title}`,
            content: btoa(unescape(encodeURIComponent(frontMatter))),
            branch: GITHUB_BRANCH,
            ...(sha && { sha })
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save post.');
      }

      document.getElementById('save-status').textContent = 'Saved!';
      document.getElementById('save-status').style.color = 'green';
      currentPostPath = filePath;

      setTimeout(() => {
        document.getElementById('save-status').textContent = '';
      }, 3000);

    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post: ' + error.message);
      document.getElementById('save-status').textContent = 'Failed to save post.';
      document.getElementById('save-status').style.color = 'red';
    }
  }

  // show preview
  function showPreview() {
    const previewContainer = document.getElementById('preview-container');
    const previewContent = document.getElementById('preview-content');
    const content = mdeEditor ? mdeEditor.value() : '';

    // simple markdown preview (recommended to use markdown parser in production)
    previewContent.innerHTML = mdeEditor ? mdeEditor.preview() : '';
    previewContainer.style.display = previewContainer.style.display === 'none' ? 'block' : 'none';
  }

  // initialize
  async function init() {
    // check login status
    const isAuth = await checkAdminAuth();
    if (isAuth) {
      showAdminEditor();
    }

    // register event listeners
    document.getElementById('login-btn').addEventListener('click', handleLogin);
    document.getElementById('admin-password').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleLogin();
      }
    });
    document.getElementById('new-post-btn').addEventListener('click', newPost);
    document.getElementById('load-posts-btn').addEventListener('click', loadPosts);
    document.getElementById('save-post-btn').addEventListener('click', savePost);
    document.getElementById('preview-post-btn').addEventListener('click', showPreview);
  }

  // initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

