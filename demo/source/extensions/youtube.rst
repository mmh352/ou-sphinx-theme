YouTube
#######

The YouTube extension provides a single directive for embedding a YouTube video.

YouTube
=======

The :code:`youtube` directive takes a single parameter, which is the embedding identifier that can be found in the "Share" section of the YouTube video. Additionally, there are two optional keywords :code:`width` and :code:`height`, which can be used to specify the size of the video player in pixels.

.. sourcecode:: rst

   .. youtube:: VideoEmbeddingIdentifier
      :width: int
      :height: int

Your video should as its content also include the Transcript and Description directives from the :doc:`accessibility extension <a11y>`.

Examples
--------

Example with transcript:

.. sourcecode:: rst

   .. youtube:: LGnJw9rtjas
      :width: 425
      :height: 344

      .. transcript::

         [Music]

         [01:04]

         For the first time in history, people and machinery are working together, realising a dream. A uniting force that knows no geographical boundaries, without regard to race, creed or colour. A new era where communication truly brings people together. This is the Dawn of the Net.

         ...

.. youtube:: LGnJw9rtjas
   :width: 425
   :height: 344

   .. transcript::

      [Music]

      [01:04]

      For the first time in history, people and machinery are working together, realising a dream. A uniting force that knows no geographical boundaries, without regard to race, creed or colour. A new era where communication truly brings people together. This is the Dawn of the Net.

      ...

Example without transcript:

.. sourcecode:: rst

   .. youtube:: LGnJw9rtjas
      :width: 425
      :height: 344

.. youtube:: LGnJw9rtjas
   :width: 425
   :height: 344
