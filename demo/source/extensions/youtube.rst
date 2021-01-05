YouTube
#######

The YouTube extension provides a single directive for embedding a YouTube video.

Directives
==========

The :code:`youtube` directive takes a single parameter, which is the embedding identifier that can be found in the "Share" section of the YouTube video. Additionally, there are two optional keywords :code:`width` and :code:`height`, which can be used to specify the size of the video player in pixels. Additionally, the :code:`youtube` directive can optionally take any content, which can be used to provide a transcript. A transcript should always be provided, unless the video itself contains a transcript or closed captions.

.. sourcecode:: rst

   .. youtube:: VideoEmbeddingIdentifier
      :width: int
      :height: int

      Transcript content

Example
=======

Example with transcript:

.. sourcecode:: rst

   .. youtube:: LGnJw9rtjas
      :width: 425
      :height: 344

      [Music]

      [01:04]

      For the first time in history, people and machinery are working together, realising a dream. A uniting force that knows no geographical boundaries, without regard to race, creed or colour. A new era where communication truly brings people together. This is the Dawn of the Net.

      ...

.. youtube:: LGnJw9rtjas
   :width: 425
   :height: 344

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
