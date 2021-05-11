<script type="ts">
	import { onDestroy } from 'svelte';

    import { data, navigate } from './store';
    import PageNav from './PageNav.svelte';

    let tutorialContent = '';

    const unsubscribe = data.subscribe((value) => {
        if (value) {
            tutorialContent = value.tutorial.body;
        }
    });

    onDestroy(unsubscribe);

    function handleClick(ev: MouseEvent) {
        let target = ev.target as HTMLElement;
        while (target && target.localName !== 'a' && target.localName !== 'button') {
            target = target.parentElement;
        }
        if (target.localName === 'button') {
            if (target.parentElement.parentElement.classList.contains('answer')) {
                ev.preventDefault();
                target.parentElement.parentElement.classList.toggle('show');
            }
        } else if (target.localName === 'a') {
            if (target.classList.contains('internal')) {
                ev.preventDefault();
                navigate(target.getAttribute('href'));
            }
        }
    }
</script>

<article id="tutorial" class="col-start-2 col-end-3 row-start-2 row-end-4 flex flex-col border-r-2 border-solid border-gray-200">
    <div on:click={handleClick} class="flex-grow flex-shrink overflow-auto px-4 py-2">{@html tutorialContent}</div>
    <PageNav/>
</article>

<style global type="postcss">
    #tutorial {
        @apply leading-relaxed;

        > div > div {
            @apply pb-8;
        }
        * + .section {
            @apply mt-6;
        }
        h1 {
            @apply text-3xl font-bold mb-3;
        }
        h2 {
            @apply text-2xl font-bold mb-3;
        }
        h3 {
            @apply text-xl font-bold mb-3;
        }
        p {
            @apply mb-3;
        }
        ul.simple {
            @apply list-disc ml-4;
        }
        .highlight {
            @apply mb-3 overflow-auto font-mono bg-white-600 p-2 border-solid border-turquoise border-l-2;
        }
        code {
            @apply inline-block bg-cream rounded px-1 font-mono;
        }
        .toctree-wrapper {
            a {
                @apply text-blue;
            }
            .toctree-l1 {
                @apply mb-2;

                > a {
                    @apply text-lg;
                }
            }
            ul ul {
                @apply ml-4;
            }
        }
        .activity {
            @apply bg-cream border-solid border-orange border-l-2;

            > h2, > h3 {
                @apply bg-orange text-white px-2 py-1 text-lg;
            }

            > .content {
                @apply p-2;
            }
        }
        .answer {
            .buttons {
                @apply text-right;

                button {
                    @apply border-solid border-orange rounded border px-2 py-1 text-sm;

                    span:nth-child(2) {
                        @apply hidden;
                    }
                }
            }
            .content {
                @apply hidden;
            }
        }
        .answer.show {
            .buttons {
                button {
                    span:nth-child(1) {
                        @apply hidden;
                    }
                    span:nth-child(2) {
                        @apply inline;
                    }
                }
            }
            .content {
                @apply block;
            }
        }
        .headerlink {
            @apply hidden;
        }

        /* Pygments Style */
        .highlight .c { @apply text-green-600 } /* Comment */
        .highlight .err { @apply text-red } /* Error */
        .highlight .k { @apply text-orange-700 } /* Keyword */
        .highlight .n { @apply text-blue-700 } /* Name */
        .highlight .o { @apply text-orange-700; font-weight: bold } /* Operator */
        .highlight .ch { @apply text-green-600 } /* Comment.Hashbang */
        .highlight .cm { @apply text-green-600 } /* Comment.Multiline */
        .highlight .cp { @apply text-green-600 } /* Comment.Preproc */
        .highlight .cpf { @apply text-green-600 } /* Comment.PreprocFile */
        .highlight .c1 { @apply text-green-600 } /* Comment.Single */
        .highlight .cs { @apply text-green-600 } /* Comment.Special */
        .highlight .kc { @apply text-orange-700 } /* Keyword.Constant */
        .highlight .kd { @apply text-orange-700 } /* Keyword.Declaration */
        .highlight .kn { @apply text-orange-700 } /* Keyword.Namespace */
        .highlight .kp { @apply text-orange-700 } /* Keyword.Pseudo */
        .highlight .kr { @apply text-orange-700 } /* Keyword.Reserved */
        .highlight .kt { @apply text-orange-700 } /* Keyword.Type */
        .highlight .m { @apply text-turquoise-700 } /* Literal.Number */
        .highlight .s { @apply text-pink-900 } /* Literal.String */
        .highlight .na { @apply text-blue-700 } /* Name.Attribute */
        .highlight .nb { @apply text-blue-700 } /* Name.Builtin */
        .highlight .nc { @apply text-blue-700 } /* Name.Class */
        .highlight .no { @apply text-blue-700 } /* Name.Constant */
        .highlight .nd { @apply text-blue-700 } /* Name.Decorator */
        .highlight .ni { @apply text-blue-700 } /* Name.Entity */
        .highlight .ne { @apply text-blue-700 } /* Name.Exception */
        .highlight .nf { @apply text-blue-700 } /* Name.Function */
        .highlight .nl { @apply text-blue-700 } /* Name.Label */
        .highlight .nn { @apply text-blue-700 } /* Name.Namespace */
        .highlight .nx { @apply text-blue-700 } /* Name.Other */
        .highlight .py { @apply text-blue-700 } /* Name.Property */
        .highlight .nt { @apply text-blue-700 } /* Name.Tag */
        .highlight .nv { @apply text-blue-700 } /* Name.Variable */
        .highlight .ow { @apply text-orange-700 font-bold } /* Operator.Word */
        .highlight .mb { @apply text-turquoise-700 } /* Literal.Number.Bin */
        .highlight .mf { @apply text-turquoise-700 } /* Literal.Number.Float */
        .highlight .mh { @apply text-turquoise-700 } /* Literal.Number.Hex */
        .highlight .mi { @apply text-turquoise-700 } /* Literal.Number.Integer */
        .highlight .mo { @apply text-turquoise-700 } /* Literal.Number.Oct */
        .highlight .sa { @apply text-pink-900 } /* Literal.String.Affix */
        .highlight .sb { @apply text-pink-900 } /* Literal.String.Backtick */
        .highlight .sc { @apply text-pink-900 } /* Literal.String.Char */
        .highlight .dl { @apply text-pink-900 } /* Literal.String.Delimiter */
        .highlight .sd { @apply text-pink-900 } /* Literal.String.Doc */
        .highlight .s2 { @apply text-pink-900 } /* Literal.String.Double */
        .highlight .se { @apply text-pink-900 } /* Literal.String.Escape */
        .highlight .sh { @apply text-pink-900 } /* Literal.String.Heredoc */
        .highlight .si { @apply text-pink-900 } /* Literal.String.Interpol */
        .highlight .sx { @apply text-pink-900 } /* Literal.String.Other */
        .highlight .sr { @apply text-pink-900 } /* Literal.String.Regex */
        .highlight .s1 { @apply text-pink-900 } /* Literal.String.Single */
        .highlight .ss { @apply text-pink-900 } /* Literal.String.Symbol */
        .highlight .bp { @apply text-blue-700 } /* Name.Builtin.Pseudo */
        .highlight .fm { @apply text-blue-700 } /* Name.Function.Magic */
        .highlight .vc { @apply text-blue-700 } /* Name.Variable.Class */
        .highlight .vg { @apply text-blue-700 } /* Name.Variable.Global */
        .highlight .vi { @apply text-blue-700 } /* Name.Variable.Instance */
        .highlight .vm { @apply text-blue-700 } /* Name.Variable.Magic */
        .highlight .il { @apply text-turquoise-700 } /* Literal.Number.Integer.Long */
    }
</style>
