// Utilities
import { computed } from 'vue';
import { deepEqual, getPropertyFromItem, pick, propsFactory } from "../util/index.mjs"; // Types
// Composables
export const makeItemsProps = propsFactory({
  items: {
    type: Array,
    default: () => []
  },
  itemTitle: {
    type: [String, Array, Function],
    default: 'title'
  },
  itemValue: {
    type: [String, Array, Function],
    default: 'value'
  },
  itemChildren: {
    type: [Boolean, String, Array, Function],
    default: 'children'
  },
  itemProps: {
    type: [Boolean, String, Array, Function],
    default: 'props'
  },
  returnObject: Boolean
}, 'list-items');
export function transformItem(props, item) {
  const title = getPropertyFromItem(item, props.itemTitle, item);
  const value = props.returnObject ? item : getPropertyFromItem(item, props.itemValue, title);
  const children = getPropertyFromItem(item, props.itemChildren);
  const itemProps = props.itemProps === true ? typeof item === 'object' && item != null && !Array.isArray(item) ? 'children' in item ? pick(item, ['children'])[1] : item : undefined : getPropertyFromItem(item, props.itemProps);
  const _props = {
    title,
    value,
    ...itemProps
  };
  return {
    title: String(_props.title ?? ''),
    value: _props.value,
    props: _props,
    children: Array.isArray(children) ? transformItems(props, children) : undefined,
    raw: item
  };
}
export function transformItems(props, items) {
  const array = [];
  for (const item of items) {
    array.push(transformItem(props, item));
  }
  return array;
}
export function useItems(props) {
  const items = computed(() => transformItems(props, props.items));
  return useTransformItems(items, value => transformItem(props, value));
}
export function useTransformItems(items, transform) {
  function transformIn(value) {
    return value.map(v => {
      const existingItem = items.value.find(item => deepEqual(v, item.value));
      // Nullish existingItem means value is a custom input value from combobox
      // In this case, use transformItem to create an { value: unknown } based on value
      return existingItem ?? transform(v);
    });
  }
  function transformOut(value) {
    return value.map(_ref => {
      let {
        value
      } = _ref;
      return value;
    });
  }
  return {
    items,
    transformIn,
    transformOut
  };
}
//# sourceMappingURL=list-items.mjs.map