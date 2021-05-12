# OU Sphinx Theme

The OU Sphinx Theme is designed for delivering teaching materials in the OpenUniversity's style. To use it in your own Sphinx content, install the package

```
pip install ou-sphinx-theme
```

and then set the theme in ``conf.py``

```python
html_theme = 'openuniversity'
```

## Development

For development, you need the following pre-requisites:

* NPM
* Poetry

Then install all dependencies:

```
poetry install
npm install
cd app && npm install
```

Run the development server:

```
gulp dev
```

You can then access the demo at http://localhost:8080
