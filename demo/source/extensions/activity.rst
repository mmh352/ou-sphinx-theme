Activity
########

The activity extension provides two new directives that are used to display an activity block and its associated answer.

Activity
========

The :code:`activity` directive takes a single parameter, which is the title of the activity. The activity directive can have any nested content.

.. sourcecode:: rst

   .. activity:: Activity title

      Activity content

Example
-------

.. sourcecode:: rst

   .. activity:: An example activity

      This is an example activity

.. activity:: An example activity

   This is an example activity

Activity Answer
===============

The activity content can contain a :code:`activity-answer` directive, which displays the answer button and the answer content. The :code:`activity-answer` directive can have any nested content.

.. sourcecode:: rst

   .. activity-answer::

      Answer content

Example
=======

.. sourcecode:: rst

   .. activity:: An example activity

      This is an example activity

      .. activity-answer::

         This is the answer

.. activity:: An example activity

   This is an example activity

   .. activity-answer::

      This is the answer
