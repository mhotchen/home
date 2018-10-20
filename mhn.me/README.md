# Overview

This service is for hosting my static website [https://mhn.me](mhn.me).

# Before making changes

First follow the `README.md` in the parent directory then open `index.html` in your browser and editor.

# Releasing

```bash
aws s3 sync --dryrun public/ s3://mhn-me/
# Stop here to review your changes.
aws s3 sync public/ s3://mhn-me/
aws s3 ls mhn-me
# Stop here to test.
```
