# Alt-Text Selfies

## Run on localhost
```npm run build:dev```

## Build for production
```npm run build:prod```

## Update base URL
Edit `_data/site.js` to update the base URL for local and production environments. The correct base URL is necessary for SPA linking and file sources to work on the site. In the templates, it's referenced as `{{ site.url }}`.