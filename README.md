# Alt-Text Selfies

## Run on localhost
```npm run build:dev```

## Build for production
```npm run build:prod```

## Run CMS locally
```npm run cms:dev```

## Update base URL
Edit `_data/site.js` to update the base URL for local and production environments. The correct base URL is necessary for SPA linking and file sources to work on the site. In the templates, it's referenced as `{{ site.url }}`.

## Adding audio and transcripts
Documentation for this is in [_docs/selfies-with-audio.md](_docs/selfies-with-audio.md)