import json
import sphinx
import sphinx.builders.html

from base64 import b64encode
from docutils.nodes import bullet_list, list_item
from os import path
from sphinx.environment.adapters.toctree import TocTree
from sphinx.util.osutil import ensuredir


def get_nav_entry(list_item):
    """Convert a toctree list item into a nav-entry dict."""
    reference = list_item.children[0].children[0]
    expanded = ('iscurrent' in list_item.attributes and list_item.attributes['iscurrent'])
    current = ('iscurrent' in reference.attributes and reference.attributes['iscurrent'])
    return {'title': reference.astext(),
            'url': reference.attributes['refuri'],
            'current': current,
            'expanded': expanded,
            'children': []}


def get_block_nav(self, pagename):
    """Get the navigation entries for the top-level TOC entries."""
    toctree = TocTree(self.env).get_toctree_for(pagename, self, collapse=False, maxdepth=-1)
    return [get_nav_entry(item) for item in toctree.children[0].children]


def get_prev_next_nav(prev_next):
    """Return either the previous or next nav entry."""
    if prev_next:
        return {'title': prev_next['title'],
                'url': prev_next['link']}
    else:
        return None


def build_nav_tree(self, node):
    """Recursively build a navigation tree."""
    entry = get_nav_entry(node)
    if node.children:
        for child in node.children:
            if isinstance(child, bullet_list):
                for item in child.children:
                    entry['children'].append(build_nav_tree(self, item))
    return entry


def get_within_block_nav(self, pagename):
    """Build the within-the-block navigation."""
    toctree = TocTree(self.env).get_toctree_for(pagename, self, collapse=False, maxdepth=-1)
    for top_level in toctree.children[0].children:
        entry = get_nav_entry(top_level)
        if entry['current'] or entry['expanded']:
            return build_nav_tree(self, top_level)
    return None


def update_page_context(self, pagename, templatename, context, event_arg):
    """Update the page context with the data needed for the OU Sphinx Theme."""
    if 'body' in context:
        print(context.keys())
        data = {
            'metadata': {},
            'project': context['project'],
            'staticBase': context['pathto']('_static', 1),
            'tutorial': {
                'blocks': [{'title': 'Home', 'url': context['pathto'](context['master_doc'])}] + get_block_nav(self, pagename),
                'body': context['body'],
                'next': get_prev_next_nav(context['next']),
                'prev': get_prev_next_nav(context['prev']),
                'title': context['title'],
                'withinBlockNav': get_within_block_nav(self, pagename),
            }
        }
        if 'meta' in context and context['meta']:
            data['metadata'] = context['meta']
        context['json_blob'] = b64encode(json.dumps(data).encode('utf-8')).decode('utf-8')
        outfilename = self.get_outfilename(pagename)
        if outfilename.endswith('.html'):
            outfilename = outfilename.replace('.html', '.json')
            ensuredir(path.dirname(outfilename))
            with open(outfilename, 'w') as out_f:
                json.dump(data, out_f)


def setup(app):
    """Setup the OU Sphinx theme and extensions."""
    app.add_html_theme('openuniversity', path.abspath(path.dirname(__file__)))
    sphinx.builders.html.StandaloneHTMLBuilder.update_page_context = update_page_context
    return {'parallel_read_safe': True, 'parallel_write_safe': True}
