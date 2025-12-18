// Simple API server for markdown editor
// Run with: node api/server.js

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Get project root directory (parent of api folder)
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Load file endpoint
app.get('/api/load', async (req, res) => {
  try {
    const filePath = req.query.path;
    if (!filePath) {
      return res.status(400).json({ error: 'Path parameter is required' });
    }

    // Security: prevent directory traversal
    const fullPath = path.resolve(PROJECT_ROOT, filePath);
    if (!fullPath.startsWith(PROJECT_ROOT)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const content = await fs.readFile(fullPath, 'utf-8');
    
    // Try to extract title from front matter
    let title = '';
    if (content.startsWith('---')) {
      const frontMatterEnd = content.indexOf('---', 3);
      if (frontMatterEnd > 0) {
        const frontMatter = content.substring(3, frontMatterEnd);
        const titleMatch = frontMatter.match(/title:\s*(.+)/);
        if (titleMatch) {
          title = titleMatch[1].trim().replace(/^["']|["']$/g, '');
        }
      }
    }

    res.json({ content, title });
  } catch (error) {
    console.error('Load error:', error);
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'File not found' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Save file endpoint
app.post('/api/save', async (req, res) => {
  try {
    const { path: filePath, content } = req.body;
    
    if (!filePath) {
      return res.status(400).json({ error: 'Path is required' });
    }

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Security: prevent directory traversal
    const fullPath = path.resolve(PROJECT_ROOT, filePath);
    if (!fullPath.startsWith(PROJECT_ROOT)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Create directory if it doesn't exist
    const dir = path.dirname(fullPath);
    await fs.mkdir(dir, { recursive: true });

    // Write file
    await fs.writeFile(fullPath, content, 'utf-8');

    res.json({ 
      success: true, 
      message: 'File saved successfully',
      path: filePath 
    });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: error.message });
  }
});

// List posts endpoint
app.get('/api/posts', async (req, res) => {
  try {
    const postsDir = path.join(PROJECT_ROOT, '_posts');
    const files = await fs.readdir(postsDir, { recursive: true, withFileTypes: true });
    
    const posts = [];
    for (const file of files) {
      if (file.isFile() && file.name.endsWith('.md')) {
        const filePath = path.join(file.path || postsDir, file.name);
        const relativePath = path.relative(PROJECT_ROOT, filePath);
        const stats = await fs.stat(filePath);
        
        posts.push({
          path: relativePath.replace(/\\/g, '/'),
          name: file.name,
          modified: stats.mtime
        });
      }
    }
    
    posts.sort((a, b) => b.modified - a.modified);
    res.json({ posts });
  } catch (error) {
    console.error('List posts error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get categories endpoint
app.get('/api/categories', async (req, res) => {
  try {
    const postsDir = path.join(PROJECT_ROOT, '_posts');
    
    // Get all directories in _posts (categories)
    const categories = new Map();
    
    async function scanDirectory(dir, parentPath = '') {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = parentPath ? `${parentPath}/${entry.name}` : entry.name;
        
        if (entry.isDirectory()) {
          // This is a category or subcategory
          const parts = relativePath.split('/');
          const categoryName = parts[0];
          const subcategoryName = parts.length > 1 ? parts[1] : null;
          
          if (!categories.has(categoryName)) {
            categories.set(categoryName, {
              name: categoryName,
              subcategories: []
            });
          }
          
          if (subcategoryName) {
            const category = categories.get(categoryName);
            if (!category.subcategories.includes(subcategoryName)) {
              category.subcategories.push(subcategoryName);
            }
          }
          
          // Recursively scan subdirectories
          await scanDirectory(fullPath, relativePath);
        }
      }
    }
    
    await scanDirectory(postsDir);
    
    // Convert Map to sorted array
    const categoriesArray = Array.from(categories.values())
      .map(cat => ({
        name: cat.name,
        subcategories: cat.subcategories.sort()
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    
    res.json({ categories: categoriesArray });
  } catch (error) {
    console.error('List categories error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Markdown Editor API server running on http://localhost:${PORT}`);
  console.log(`Project root: ${PROJECT_ROOT}`);
});

