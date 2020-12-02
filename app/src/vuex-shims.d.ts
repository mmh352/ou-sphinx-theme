// vuex-shim.d.ts
import { State } from './store';

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $store: Store<State>;
    }
}
