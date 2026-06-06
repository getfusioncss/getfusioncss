# GetFusionCSS 🚀

[![NPM Version](https://img.shields.io/npm/v/getfusioncss?color=3b82f6&style=flat-square)](https://www.npmjs.com/package/getfusioncss)
[![jsDelivr Hits](https://img.shields.io/jsdelivr/npm/hm/getfusioncss?color=10b981&style=flat-square)](https://www.jsdelivr.com/package/npm/getfusioncss)
[![License](https://img.shields.io/github/license/getfusioncss/getfusioncss?color=64748b&style=flat-square)](LICENSE)

**GetFusionCSS** is a powerful, hybrid frontend framework built for modern web developers. It elegantly fuses the robust layout and component ecosystem of Bootstrap with modern utility-first CSS variables and a zero-dependency compiled JavaScript powerhouse.

---

## 💎 Features

* 🎨 **Full Dark/Light Theme Engine** powered by declarative CSS variables (`--fc-*`).
* 📦 **Hybrid Architecture:** Standard utility-first responsive layout structures combined with pre-styled semantic components.
* ⚡ **Zero-Dependency JS:** Modular JavaScript classes bundled using the universal UMD pattern.
* 🛡️ **Fully Configured CDNs:** Native automatic integration with jsDelivr, NPM, and unpkg.
* 📐 **Advanced Layout Utilities:** In-built Flexbox, multi-breakpoint Grid, and responsive utility states.

---

## 🚀 Quick Start & CDNs

Aap directly inline links ko copy karke apne project ki HTML boilerplate mein framework implement kar sakte hain:

### 1. jsDelivr (Recommended)

**CSS (Minified):**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/getfusioncss@latest/dist/css/fusion.min.css">
```

**JS (Minified):**
```html
<script src="https://cdn.jsdelivr.net/npm/getfusioncss@1.0.1/dist/js/fusion.min.js"></script>
```
## 📦 Installation

### NPM
NPM ke zariye install karein agar aap modern build tools (Webpack, Vite, waghera) istemal kar rahe hain:

```bash
npm install getfusioncss
```
**🛠️ Basic Usage Example**

Yeh ek basic starter template hai jo GetFusionCSS ki utility classes aur component structure ko demonstrate karta hai:

```html
HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GetFusionCSS Starter</title>
    
    <link rel="stylesheet" href="[https://cdn.jsdelivr.net/npm/getfusioncss@latest/dist/css/fusion.min.css](https://cdn.jsdelivr.net/npm/getfusioncss@latest/dist/css/fusion.min.css)">
</head>
<body>
    
    <main class="container py-5">
        <div class="card shadow-md">
            <div class="card-body">
                <h1 class="text-primary mb-3">Welcome to GetFusionCSS! 🚀</h1>
                <p class="text-muted mb-4">
                    A modern, hybrid CSS framework for rapid UI development.
                </p>
                
                <div class="d-flex gap-3">
                    <button class="btn btn-primary">Get Started</button>
                    <button class="btn btn-outline-secondary">Documentation</button>
                </div>
            </div>
        </div>
    </main>

    <script src="[https://cdn.jsdelivr.net/npm/getfusioncss@latest/dist/js/fusion.min.js](https://cdn.jsdelivr.net/npm/getfusioncss@latest/dist/js/fusion.min.js)"></script>
</body>
</html>
```
