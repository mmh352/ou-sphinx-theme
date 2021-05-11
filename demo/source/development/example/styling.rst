Code Styling
############

.. sourcecode:: html

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

    h1 {
        font-size: 12pt;
    }

    #main {
        color: #ff0000;
    }

    .section > .left {
        margin-left: 1rem;
    }

.. sourcecode:: javascript

    function hello(name) {
        document.querySelector('h1').innerHTML = 'Hello ' + name;
    }

    let count = 0;
    count = count + 1;
    console.log(count);
