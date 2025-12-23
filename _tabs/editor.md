---
layout: page
icon: fas fa-edit
order: 3
---

## Markdown Editor

<div id="markdown-editor-container">
  <div class="editor-toolbar mb-3">
    <div class="btn-group" role="group">
      <button type="button" class="btn btn-sm btn-outline-secondary" onclick="insertMarkdown('**', '**')" title="Bold">
        <i class="fas fa-bold"></i>
      </button>
      <button type="button" class="btn btn-sm btn-outline-secondary" onclick="insertMarkdown('*', '*')" title="Italic">
        <i class="fas fa-italic"></i>
      </button>
      <button type="button" class="btn btn-sm btn-outline-secondary" onclick="insertMarkdown('`', '`')" title="Code">
        <i class="fas fa-code"></i>
      </button>
      <button type="button" class="btn btn-sm btn-outline-secondary" onclick="insertMarkdown('```python\n', '\n```')" title="Code Block (Python)">
        <i class="fas fa-code"></i>
      </button>
      <button type="button" class="btn btn-sm btn-outline-secondary" onclick="insertMarkdown('```bash\n', '\n```')" title="Terminal/Command">
        <i class="fas fa-terminal"></i>
      </button>
      <button type="button" class="btn btn-sm btn-outline-secondary" onclick="insertMarkdown('- ')" title="List">
        <i class="fas fa-list"></i>
      </button>
      <button type="button" class="btn btn-sm btn-outline-secondary" onclick="insertMarkdown('> ')" title="Quote">
        <i class="fas fa-quote-right"></i>
      </button>
      <button type="button" class="btn btn-sm btn-outline-secondary" onclick="insertMarkdown('[', '](url)')" title="Link">
        <i class="fas fa-link"></i>
      </button>
      <button type="button" class="btn btn-sm btn-outline-secondary" onclick="insertMarkdown('![', '](image-url)')" title="Image">
        <i class="fas fa-image"></i>
      </button>
      <button type="button" class="btn btn-sm btn-outline-secondary" onclick="insertMarkdown('<div class=\"pdf-viewer-container\" data-pdf=\"', '\"></div>')" title="PDF Viewer (all pages)">
        <i class="fas fa-file-pdf"></i> PDF
      </button>
      <button type="button" class="btn btn-sm btn-outline-secondary" onclick="insertMarkdown('$', '$')" title="Inline Math">
        <i class="fas fa-function"></i> $x$
      </button>
      <button type="button" class="btn btn-sm btn-outline-secondary" onclick="insertMarkdown('$$\n', '\n$$')" title="Block Math">
        <i class="fas fa-function"></i> $$
      </button>
    </div>
    <div class="btn-group ms-2" role="group">
      <button type="button" class="btn btn-sm btn-primary" onclick="loadPost()" title="Load Post">
        <i class="fas fa-folder-open"></i> Load
      </button>
      <button type="button" class="btn btn-sm btn-success" onclick="savePost()" title="Save Post">
        <i class="fas fa-save"></i> Save
      </button>
      <button type="button" class="btn btn-sm btn-info" onclick="newPost()" title="New Post">
        <i class="fas fa-file"></i> New
      </button>
    </div>
    <div class="ms-2">
      <small class="text-muted">
        <i class="fas fa-info-circle"></i> 로컬 API 또는 GitHub API 사용 가능
      </small>
    </div>
  </div>

  <div class="editor-layout">
    <div class="editor-panel">
      <div class="editor-header">
        <h5 class="mb-0">Editor</h5>
        <div class="editor-actions">
          <button type="button" class="btn btn-sm btn-outline-secondary" onclick="toggleFullscreen('editor')" title="Fullscreen">
            <i class="fas fa-expand"></i>
          </button>
        </div>
      </div>
      <textarea id="markdown-editor-input" class="markdown-textarea" placeholder="Write texts..."></textarea>
    </div>

    <div class="preview-panel">
      <div class="editor-header">
        <h5 class="mb-0">Preview</h5>
        <div class="editor-actions">
          <button type="button" class="btn btn-sm btn-outline-secondary" onclick="toggleFullscreen('preview')" title="Fullscreen">
            <i class="fas fa-expand"></i>
          </button>
        </div>
      </div>
      <div id="markdown-preview-output" class="markdown-preview"></div>
    </div>
  </div>

  <div class="editor-footer mt-3">
    <div class="post-info">
      <div class="d-inline-block position-relative">
        <button type="button" class="btn btn-sm btn-outline-primary" onclick="toggleCategorySelector()" id="category-selector-btn" title="Select Category">
          <i class="fas fa-folder-tree"></i> <span id="category-display">Select Category</span> <i class="fas fa-chevron-down ms-1"></i>
        </button>
        <div id="category-selector" class="category-selector-dropdown" style="display: none;">
          <div class="category-selector-header">
            <input type="text" id="category-search" class="form-control form-control-sm" placeholder="Search category..." onkeyup="filterCategories(this.value)">
            <button type="button" class="btn btn-sm btn-link p-0 ms-2" onclick="toggleCategorySelector()" title="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div id="category-tree" class="category-tree">
            <div class="text-muted text-center p-3">
              <i class="fas fa-spinner fa-spin"></i> Loading categories...
            </div>
          </div>
          <div class="category-selector-footer">
            <button type="button" class="btn btn-sm btn-outline-secondary" onclick="addNewCategory()">
              <i class="fas fa-plus"></i> New Category
            </button>
          </div>
        </div>
      </div>
      <input type="text" id="post-path" class="form-control form-control-sm d-inline-block ms-2" style="width: 300px; display: none;" placeholder="File path (auto-generated)">
      <input type="text" id="post-title" class="form-control form-control-sm d-inline-block ms-2" style="width: 200px;" placeholder="Post title (for filename)">
      <button type="button" class="btn btn-sm btn-outline-secondary ms-2" onclick="setupGitHubToken()" title="GitHub Token Setting">
        <i class="fab fa-github"></i> GitHub
      </button>
    </div>
    <div class="editor-stats">
      <span class="text-muted small" id="editor-stats">0 words, 0 characters</span>
      <span class="text-muted small ms-2" id="github-status"></span>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/marked@9.1.6/marked.min.js"></script>
<!-- Highlight.js for syntax highlighting -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github.min.css">
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/languages/python.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/languages/javascript.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/languages/java.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/languages/cpp.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/languages/c.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/languages/bash.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/languages/shell.min.js"></script>
<!-- MathJax for LaTeX rendering -->
<script>
  window.MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']],
      processEscapes: true,
      processEnvironments: true,
      autoload: {
        color: [],
        colorv2: ['color']
      },
      packages: {'[+]': ['ams', 'newcommand', 'configmacros']}
    },
    options: {
      skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
      ignoreHtmlClass: 'tex2jax_ignore',
      processHtmlClass: 'tex2jax_process'
    },
    loader: {
      load: ['[tex]/ams', '[tex]/newcommand', '[tex]/configmacros']
    }
  };
</script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
<!-- PDF Viewer -->
<link rel="stylesheet" href="{{ '/assets/css/pdf-viewer.css' | relative_url }}">
<script src="{{ '/assets/js/pdf-viewer.js' | relative_url }}" defer></script>
<script src="{{ '/assets/js/github-oauth.js' | relative_url }}"></script>
<script src="{{ '/assets/js/markdown-editor.js' | relative_url }}"></script>

