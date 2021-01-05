iFrame
######

The iFrame extension provides a single directive for embedding other websites.

Directives
==========

The :code:`iframe` directive creates a single iframe. It takes a single parameter, which is the URL to embed. Additionally, it can take three keyword parameters:

* :code:`width`: the optional width of the iframe in pixel
* :code:`height`: the optional height of the iframe in pixel
* :code:`scrolling`: optionally setting to configure whether scrolling is enabled (auto/yes/no), defaults to auto

.. sourcecode:: rst

   .. iframe:: URL

      :width: int
      :height: int
      :scrolling: auto/yes/no

Example
=======

.. sourcecode:: rst

   .. iframe:: https://learn2.open.ac.uk/pluginfile.php/2882999/mod_oucontent/oucontent/1099430/418c261a/735264dc/tt284_2017j_73_slideshow.zip/index.html?_s=jQBhdyPwcv&_u=1140351&_a=tt284_b1p1_fig4&_i=X_tt824_b1_p1_19j&_c=208022
      :width: 512
      :height: 405
      :scrolling: no

.. iframe:: https://learn2.open.ac.uk/pluginfile.php/2882999/mod_oucontent/oucontent/1099430/418c261a/735264dc/tt284_2017j_73_slideshow.zip/index.html?_s=jQBhdyPwcv&_u=1140351&_a=tt284_b1p1_fig4&_i=X_tt824_b1_p1_19j&_c=208022
   :width: 512
   :height: 405
   :scrolling: no
