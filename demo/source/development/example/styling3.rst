:layout: tutorial-editor-iframe
:editor-files: index.html, page.html, default.css, sample.txt
:editor-files-src: /_static/editor-sample/
:iframe-src: /_static/editor-sample/

Code Styling 3
##############

This is just to demonstrate removing or adding a file to the editor between pages. On this page, the ``ally.js`` file is not shown.

.. sourcecode:: html
    :caption: index.html

    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8"/>
            <title>This is some sample HTML</title>
        </head>
        <body>
            <h1>A test page</h1>
            <div id="main">
                <!-- Content goes here -->
            </div>
        </body>
    </html>


.. sourcecode:: css
    :caption: styles.css

    h1 {
        font-size: 12pt;
    }

    #main {
        color: #ff0000;
    }

    .section > .left {
        margin-left: 1rem;
    }
