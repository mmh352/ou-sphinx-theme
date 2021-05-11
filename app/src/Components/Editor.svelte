<script lang="ts">
    import { hasIFrame } from '../store';
</script>

<div class="col-start-2 col-end-3 row-start-2 row-end-3 lg:col-start-3 lg:col-end-4 lg:row-start-2 {$hasIFrame ? 'lg:row-end-3' : 'lg:row-end-4'}">
    Editor goes here
</div>
