# New Zealand Board of Imams (NZBI) Website nzbinz.vercel.app

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-brightgreen)](https://yourusername.github.io/nzbi-website/)

The official website for the New Zealand Board of Imams, providing Islamic guidance and services to the Muslim community in New Zealand.

## Features

- Responsive design for all devices
- Modern UI with Tailwind CSS
- Interactive components (FAQ accordion, tabs, etc.)
- Moonsighting information and updates
- Imam profiles and information
- Announcements and news section
- Contact form
- SEO optimized
- Progressive Web App (PWA) support

## Technologies Used

- HTML5
- CSS3 (with Tailwind CSS)
- JavaScript (Vanilla)
- Service Worker for offline support
- JSON-LD for structured data

## SEO Optimizations

- Meta tags for all pages
- Open Graph and Twitter Card meta tags
- Canonical URLs
- Structured data with JSON-LD
- Optimized image alt tags
- robots.txt and sitemap.xml
- Favicon and PWA support

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## License

© 2024 New Zealand Board of Imams. All rights reserved.

## Deployment to GitHub Pages

### Automatic Deployment

This repository is set up to automatically deploy to GitHub Pages when changes are pushed to the main branch.

### Manual Deployment

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/nzbi-website.git
   cd nzbi-website
   ```

2. Fix paths for GitHub Pages (if you're using a custom domain, you can skip this step):
   ```
   node fix-github-paths.js
   ```

3. Commit and push your changes:
   ```
   git add .
   git commit -m "Fix paths for GitHub Pages"
   git push origin main
   ```

4. Go to your repository settings on GitHub:
   - Navigate to Settings > Pages
   - Set the source to "Deploy from a branch"
   - Select the "main" branch and "/root" folder
   - Click Save

5. Your website will be available at: `https://yourusername.github.io/nzbi-website/`

### Using a Custom Domain

1. Add your custom domain in the GitHub repository settings under Pages.
2. Create a CNAME file in your repository with your domain name.
3. Set up the appropriate DNS records with your domain provider.

## Contact

For any inquiries, please contact us at [contact@nzbi.com](mailto:contact@nzbi.com).
