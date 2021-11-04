:layout: tutorial-editor
:editor-files: index.html, default.css, a11y.js, helloworld.php, sample.txt
:editor-files-src: /_static/editor-sample/

Built-in Editor
###############

To show the editor, you must use one of the :doc:`layouts <layout/index>` that include the editor, then you must specify the following two keys:

* :code:`:editor-files:` - a comma-separated list of files to show editor tabs for
* :code:`:editor-files-src: URI-TO-RESOLVE-THE-FILES-FROM` - specify a relative or absolute URL. This URL will be prefixed to the filenames for loading and saving.

If you are using the :code:`tutorial-editor-iframe` layout, then you must also specify:

* :code:`:iframe-src: URI-TO-RESOLVE-THE-FILES-FROM` - this must be the same URL as specfied in :code:`:editor-files-src:`


The editor includes built-in syntax highlighting for the following programming languages. The language is guessed via the filename's extension:

* .html - HTML files
* .js - JavaScript files
* .css - Cascading StyleSheet files
* .php - PHP files
