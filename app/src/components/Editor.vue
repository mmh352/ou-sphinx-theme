<template>
    <div id="editor">
        <nav>
            <ul role="tablist">
                <li role="presentation"><a role="tab" aria-selected="true">
                    <svg viewBox="0 0 24 24" class="icon small">
                        <path d="M12,17.56L16.07,16.43L16.62,10.33H9.38L9.2,8.3H16.8L17,6.31H7L7.56,12.32H14.45L14.22,14.9L12,15.5L9.78,14.9L9.64,13.24H7.64L7.93,16.43L12,17.56M4.07,3H19.93L18.5,19.2L12,21L5.5,19.2L4.07,3Z" />
                    </svg>
                    index.html</a></li>
                <li role="presentation"><a role="tab" aria-selected="false">
                    <svg viewBox="0 0 24 24" class="icon small">
                        <path d="M5,3L4.35,6.34H17.94L17.5,8.5H3.92L3.26,11.83H16.85L16.09,15.64L10.61,17.45L5.86,15.64L6.19,14H2.85L2.06,18L9.91,21L18.96,18L20.16,11.97L20.4,10.76L21.94,3H5Z" />
                    </svg>
                    default.css</a>
                </li>
            </ul>
        </nav>
        <div class="code-editor">
            <div class="line-numbers">
                <pre>1
2
3
4
5
6
7
8
9
10
11</pre>
            </div>
            <div class="code">
                <pre><span></span><span class="cp">&lt;!DOCTYPE html&gt;</span>
<span class="p">&lt;</span><span class="nt">html</span><span class="p">&gt;</span>
<span class="p">&lt;</span><span class="nt">head</span><span class="p">&gt;</span>
  <span class="p">&lt;</span><span class="nt">meta</span> <span class="na">charset</span><span class="o">=</span><span class="s">"utf-8"</span><span class="p">/&gt;</span>
  <span class="p">&lt;</span><span class="nt">title</span><span class="p">&gt;</span>This is a test page<span class="p">&lt;/</span><span class="nt">title</span><span class="p">&gt;</span>
<span class="p">&lt;/</span><span class="nt">head</span><span class="p">&gt;</span>
<span class="p">&lt;</span><span class="nt">body</span><span class="p">&gt;</span>
  <span class="p">&lt;</span><span class="nt">h1</span><span class="p">&gt;</span>Welcome to this page!<span class="p">&lt;/</span><span class="nt">h1</span><span class="p">&gt;</span>
  <span class="p">&lt;</span><span class="nt">p</span><span class="p">&gt;</span>We are just testing some stuff.<span class="p">&lt;/</span><span class="nt">p</span><span class="p">&gt;</span>
<span class="p">&lt;/</span><span class="nt">body</span><span class="p">&gt;</span>
<span class="p">&lt;/</span><span class="nt">html</span><span class="p">&gt;</span></pre>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
})
export default class Editor extends Vue {
}
</script>
