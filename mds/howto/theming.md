# Theming

Web Greeter allows to create impressive themes with web technologies, but with some considerations:

- No HTTP requests (unless `secure_mode` is deactivated)
- File access limited to:
  - Theme root directory (`/usr/share/web-greeter/`)
  - Files explicitily allowed in the config file, in `branding` section (`/etc/lightdm/web-greeter.yml`)
  - Greeter's shared data directory (`/var/lib/lightdm-data/`)
  - Located in `/tmp`

With this said, you're limited to local access most of the time. If the theme needs an external library, you need to provide it within the theme.

## Creating the theme
The theme is a web-page. Add an `index.html`, style it with some CSS, and add the LightDM API with some JavaScript.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="style.css" class="style">
  <title>Example Theme</title>
</head>
<body>
  <!-- HTML things -->
</body>
<script src="main.js">
</html>
```

```css
* {
  --bg: #282828;
  font-size: 16px;
}

html {
  background: var(--bg);
}
```

```javascript
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function initGreeter() {
  lightdm.authenticate("superuser")
  await wait(100)
  lightdm.respond("superpassword")
  lightdm.start_session("ubuntu")
}

window.addEventListener("GreeterReady", initGreeter)
```
