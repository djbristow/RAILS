// Composables
import { useLocale } from "../../composables/locale.mjs"; // Utilities
import { inject, watch } from 'vue';
import { propsFactory } from "../../util/index.mjs"; // Adapters
import { VuetifyDateAdapter } from "./adapters/vuetify.mjs"; // Types
export const DateAdapterSymbol = Symbol.for('vuetify:date-adapter');
export function createDate(options) {
  return options ?? {
    adapter: VuetifyDateAdapter
  };
}

// TODO: revisit this after it starts being implemented
export const makeDateProps = propsFactory({
  displayDate: {
    type: Object,
    default: new Date()
  },
  hideAdjacentMonths: Boolean,
  modelValue: {
    type: null,
    default: () => []
  }
}, 'date');
export function useDate(props) {
  const date = inject(DateAdapterSymbol);
  const locale = useLocale();
  if (!date) throw new Error('[Vuetify] Could not find injected date');
  const instance = typeof date.adapter === 'function'
  // eslint-disable-next-line new-cap
  ? new date.adapter(locale.current.value) : date.adapter;
  if (typeof date.adapter === 'function') {
    watch(locale.current, val => {
      instance.locale = val;
    });
  }
  return instance;
}
//# sourceMappingURL=date.mjs.map