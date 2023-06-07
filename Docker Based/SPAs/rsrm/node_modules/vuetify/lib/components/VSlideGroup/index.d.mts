import * as vue from 'vue';
import { ComponentPropsOptions, ExtractPropTypes, JSXComponent, PropType, ComponentInternalInstance, Ref, ComputedRef, InjectionKey, UnwrapRef } from 'vue';

interface FilterPropsOptions<PropsOptions extends Readonly<ComponentPropsOptions>, Props = ExtractPropTypes<PropsOptions>> {
    filterProps<T extends Partial<Props>, U extends Exclude<keyof Props, Exclude<keyof Props, keyof T>>>(props: T): [yes: Partial<Pick<T, U>>, no: Omit<T, U>];
}

type IconValue = string | (string | [path: string, opacity: number])[] | JSXComponent;
declare const IconValue: PropType<IconValue>;

interface GroupItem {
    id: number;
    value: Ref<unknown>;
    disabled: Ref<boolean | undefined>;
}
interface GroupProvide {
    register: (item: GroupItem, cmp: ComponentInternalInstance) => void;
    unregister: (id: number) => void;
    select: (id: number, value: boolean) => void;
    selected: Ref<Readonly<number[]>>;
    isSelected: (id: number) => boolean;
    prev: () => void;
    next: () => void;
    selectedClass: Ref<string | undefined>;
    items: ComputedRef<{
        id: number;
        value: unknown;
        disabled: boolean | undefined;
    }[]>;
    disabled: Ref<boolean | undefined>;
    getItemIndex: (value: unknown) => number;
}
interface GroupItemProvide {
    id: number;
    isSelected: Ref<boolean>;
    toggle: () => void;
    select: (value: boolean) => void;
    selectedClass: Ref<(string | undefined)[] | false>;
    value: Ref<unknown>;
    disabled: Ref<boolean | undefined>;
    group: GroupProvide;
}

interface SlideGroupSlot {
    next: GroupProvide['next'];
    prev: GroupProvide['prev'];
    select: GroupProvide['select'];
    isSelected: GroupProvide['isSelected'];
}
declare const VSlideGroup: {
    new (...args: any[]): {
        $: vue.ComponentInternalInstance;
        $data: {};
        $props: {
            symbol?: any;
            direction?: "horizontal" | "vertical" | undefined;
            style?: vue.StyleValue | undefined;
            disabled?: boolean | undefined;
            multiple?: boolean | undefined;
            tag?: string | undefined;
            modelValue?: any;
            selectedClass?: string | undefined;
            nextIcon?: IconValue | undefined;
            prevIcon?: IconValue | undefined;
            centerActive?: boolean | undefined;
            max?: number | undefined;
            key?: string | number | symbol | undefined;
            class?: any;
            mandatory?: boolean | "force" | undefined;
            $children?: vue.VNodeChild | {
                default?: ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
                prev?: ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
                next?: ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
            } | ((arg: SlideGroupSlot) => vue.VNodeChild);
            ref?: vue.VNodeRef | undefined;
            ref_for?: boolean | undefined;
            ref_key?: string | undefined;
            "v-slot:default"?: false | ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
            'v-slots'?: {
                default?: false | ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
                prev?: false | ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
                next?: false | ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
            } | undefined;
            onVnodeBeforeMount?: ((vnode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>) => void) | ((vnode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>) => void)[] | undefined;
            onVnodeMounted?: ((vnode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>) => void) | ((vnode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>) => void)[] | undefined;
            onVnodeBeforeUpdate?: ((vnode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>, oldVNode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>) => void) | ((vnode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>, oldVNode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>) => void)[] | undefined;
            onVnodeUpdated?: ((vnode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>, oldVNode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>) => void) | ((vnode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>, oldVNode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>) => void)[] | undefined;
            onVnodeBeforeUnmount?: ((vnode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>) => void) | ((vnode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>) => void)[] | undefined;
            onVnodeUnmounted?: ((vnode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>) => void) | ((vnode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>) => void)[] | undefined;
            "onUpdate:modelValue"?: ((value: any) => any) | undefined;
            showArrows?: string | boolean | undefined;
            "v-slot:next"?: false | ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
            "v-slot:prev"?: false | ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
        };
        $attrs: {
            [x: string]: unknown;
        };
        $refs: {
            [x: string]: unknown;
        };
        $slots: Readonly<{
            default?: ((arg: SlideGroupSlot) => vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>[]) | undefined;
            prev?: ((arg: SlideGroupSlot) => vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>[]) | undefined;
            next?: ((arg: SlideGroupSlot) => vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>[]) | undefined;
        }>;
        $root: vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}>, {}, {}> | null;
        $parent: vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}>, {}, {}> | null;
        $emit: (event: "update:modelValue", value: any) => void;
        $el: any;
        $options: vue.ComponentOptionsBase<{
            symbol: any;
            direction: "horizontal" | "vertical";
            style: vue.StyleValue;
            disabled: boolean;
            multiple: boolean;
            tag: string;
            selectedClass: string;
            nextIcon: IconValue;
            prevIcon: IconValue;
            centerActive: boolean;
        } & {
            max?: number | undefined;
            class?: any;
            mandatory?: boolean | "force" | undefined;
            modelValue?: any;
            showArrows?: string | boolean | undefined;
        } & {
            $children?: vue.VNodeChild | {
                default?: ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
                prev?: ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
                next?: ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
            } | ((arg: SlideGroupSlot) => vue.VNodeChild);
            'v-slots'?: {
                default?: false | ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
                prev?: false | ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
                next?: false | ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
            } | undefined;
        } & {
            "v-slot:default"?: false | ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
            "v-slot:prev"?: false | ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
            "v-slot:next"?: false | ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
        } & {
            "onUpdate:modelValue"?: ((value: any) => any) | undefined;
        }, {
            selected: vue.Ref<readonly number[]>;
            scrollTo: (location: 'prev' | 'next') => void;
            scrollOffset: vue.ShallowRef<number>;
            focus: (location?: 'next' | 'prev' | 'first' | 'last') => void;
        }, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {
            'update:modelValue': (value: any) => boolean;
        }, string, {
            symbol: any;
            direction: "horizontal" | "vertical";
            style: vue.StyleValue;
            disabled: boolean;
            multiple: boolean;
            tag: string;
            modelValue: any;
            selectedClass: string;
            nextIcon: IconValue;
            prevIcon: IconValue;
            centerActive: boolean;
        }, {}, string, vue.SlotsType<Partial<{
            default: (arg: SlideGroupSlot) => vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>[];
            prev: (arg: SlideGroupSlot) => vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>[];
            next: (arg: SlideGroupSlot) => vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>[];
        }>>> & {
            beforeCreate?: ((() => void) | (() => void)[]) | undefined;
            created?: ((() => void) | (() => void)[]) | undefined;
            beforeMount?: ((() => void) | (() => void)[]) | undefined;
            mounted?: ((() => void) | (() => void)[]) | undefined;
            beforeUpdate?: ((() => void) | (() => void)[]) | undefined;
            updated?: ((() => void) | (() => void)[]) | undefined;
            activated?: ((() => void) | (() => void)[]) | undefined;
            deactivated?: ((() => void) | (() => void)[]) | undefined;
            beforeDestroy?: ((() => void) | (() => void)[]) | undefined;
            beforeUnmount?: ((() => void) | (() => void)[]) | undefined;
            destroyed?: ((() => void) | (() => void)[]) | undefined;
            unmounted?: ((() => void) | (() => void)[]) | undefined;
            renderTracked?: (((e: vue.DebuggerEvent) => void) | ((e: vue.DebuggerEvent) => void)[]) | undefined;
            renderTriggered?: (((e: vue.DebuggerEvent) => void) | ((e: vue.DebuggerEvent) => void)[]) | undefined;
            errorCaptured?: (((err: unknown, instance: vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}>, {}, {}> | null, info: string) => boolean | void) | ((err: unknown, instance: vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}>, {}, {}> | null, info: string) => boolean | void)[]) | undefined;
        };
        $forceUpdate: () => void;
        $nextTick: typeof vue.nextTick;
        $watch<T extends string | ((...args: any) => any)>(source: T, cb: T extends (...args: any) => infer R ? (args_0: R, args_1: R) => any : (...args: any) => any, options?: vue.WatchOptions<boolean> | undefined): vue.WatchStopHandle;
    } & {
        symbol: any;
        direction: "horizontal" | "vertical";
        style: vue.StyleValue;
        disabled: boolean;
        multiple: boolean;
        tag: string;
        selectedClass: string;
        nextIcon: IconValue;
        prevIcon: IconValue;
        centerActive: boolean;
    } & {
        max?: number | undefined;
        class?: any;
        mandatory?: boolean | "force" | undefined;
        modelValue?: any;
        showArrows?: string | boolean | undefined;
    } & {
        $children?: vue.VNodeChild | {
            default?: ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
            prev?: ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
            next?: ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
        } | ((arg: SlideGroupSlot) => vue.VNodeChild);
        'v-slots'?: {
            default?: false | ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
            prev?: false | ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
            next?: false | ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
        } | undefined;
    } & {
        "v-slot:default"?: false | ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
        "v-slot:prev"?: false | ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
        "v-slot:next"?: false | ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
    } & {
        "onUpdate:modelValue"?: ((value: any) => any) | undefined;
    } & vue.ShallowUnwrapRef<{
        selected: vue.Ref<readonly number[]>;
        scrollTo: (location: 'prev' | 'next') => void;
        scrollOffset: vue.ShallowRef<number>;
        focus: (location?: 'next' | 'prev' | 'first' | 'last') => void;
    }> & {} & vue.ComponentCustomProperties & {};
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & vue.ComponentOptionsBase<{
    symbol: any;
    direction: "horizontal" | "vertical";
    style: vue.StyleValue;
    disabled: boolean;
    multiple: boolean;
    tag: string;
    selectedClass: string;
    nextIcon: IconValue;
    prevIcon: IconValue;
    centerActive: boolean;
} & {
    max?: number | undefined;
    class?: any;
    mandatory?: boolean | "force" | undefined;
    modelValue?: any;
    showArrows?: string | boolean | undefined;
} & {
    $children?: vue.VNodeChild | {
        default?: ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
        prev?: ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
        next?: ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
    } | ((arg: SlideGroupSlot) => vue.VNodeChild);
    'v-slots'?: {
        default?: false | ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
        prev?: false | ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
        next?: false | ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
    } | undefined;
} & {
    "v-slot:default"?: false | ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
    "v-slot:prev"?: false | ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
    "v-slot:next"?: false | ((arg: SlideGroupSlot) => vue.VNodeChild) | undefined;
} & {
    "onUpdate:modelValue"?: ((value: any) => any) | undefined;
}, {
    selected: vue.Ref<readonly number[]>;
    scrollTo: (location: 'prev' | 'next') => void;
    scrollOffset: vue.ShallowRef<number>;
    focus: (location?: 'next' | 'prev' | 'first' | 'last') => void;
}, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {
    'update:modelValue': (value: any) => boolean;
}, string, {
    symbol: any;
    direction: "horizontal" | "vertical";
    style: vue.StyleValue;
    disabled: boolean;
    multiple: boolean;
    tag: string;
    modelValue: any;
    selectedClass: string;
    nextIcon: IconValue;
    prevIcon: IconValue;
    centerActive: boolean;
}, {}, string, vue.SlotsType<Partial<{
    default: (arg: SlideGroupSlot) => vue.VNode<vue.RendererNode, vue.RendererElement, {
        [key: string]: any;
    }>[];
    prev: (arg: SlideGroupSlot) => vue.VNode<vue.RendererNode, vue.RendererElement, {
        [key: string]: any;
    }>[];
    next: (arg: SlideGroupSlot) => vue.VNode<vue.RendererNode, vue.RendererElement, {
        [key: string]: any;
    }>[];
}>>> & vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps & FilterPropsOptions<{
    modelValue: {
        type: null;
        default: undefined;
    };
    multiple: BooleanConstructor;
    mandatory: PropType<boolean | "force">;
    max: NumberConstructor;
    selectedClass: {
        type: PropType<string>;
        default: string;
    };
    disabled: BooleanConstructor;
    tag: {
        type: StringConstructor;
        default: string;
    };
    class: PropType<any>;
    style: {
        type: PropType<vue.StyleValue>;
        default: null;
    };
    centerActive: BooleanConstructor;
    direction: {
        type: PropType<"horizontal" | "vertical">;
        default: string;
    };
    symbol: {
        type: null;
        default: InjectionKey<GroupProvide>;
    };
    nextIcon: {
        type: PropType<IconValue>;
        default: string;
    };
    prevIcon: {
        type: PropType<IconValue>;
        default: string;
    };
    showArrows: {
        type: (StringConstructor | BooleanConstructor)[];
        validator: (v: any) => boolean;
    };
}, vue.ExtractPropTypes<{
    modelValue: {
        type: null;
        default: undefined;
    };
    multiple: BooleanConstructor;
    mandatory: PropType<boolean | "force">;
    max: NumberConstructor;
    selectedClass: {
        type: PropType<string>;
        default: string;
    };
    disabled: BooleanConstructor;
    tag: {
        type: StringConstructor;
        default: string;
    };
    class: PropType<any>;
    style: {
        type: PropType<vue.StyleValue>;
        default: null;
    };
    centerActive: BooleanConstructor;
    direction: {
        type: PropType<"horizontal" | "vertical">;
        default: string;
    };
    symbol: {
        type: null;
        default: InjectionKey<GroupProvide>;
    };
    nextIcon: {
        type: PropType<IconValue>;
        default: string;
    };
    prevIcon: {
        type: PropType<IconValue>;
        default: string;
    };
    showArrows: {
        type: (StringConstructor | BooleanConstructor)[];
        validator: (v: any) => boolean;
    };
}>>;
type VSlideGroup = InstanceType<typeof VSlideGroup>;

declare const VSlideGroupItem: {
    new (...args: any[]): {
        $: vue.ComponentInternalInstance;
        $data: {};
        $props: {
            disabled?: boolean | undefined;
            key?: string | number | symbol | undefined;
            value?: any;
            style?: unknown;
            class?: unknown;
            $children?: vue.VNodeChild | {
                default?: ((arg: {
                    isSelected: UnwrapRef<GroupItemProvide['isSelected']>;
                    select: GroupItemProvide['select'];
                    toggle: GroupItemProvide['toggle'];
                    selectedClass: UnwrapRef<GroupItemProvide['selectedClass']>;
                }) => vue.VNodeChild) | undefined;
            } | ((arg: {
                isSelected: UnwrapRef<GroupItemProvide['isSelected']>;
                select: GroupItemProvide['select'];
                toggle: GroupItemProvide['toggle'];
                selectedClass: UnwrapRef<GroupItemProvide['selectedClass']>;
            }) => vue.VNodeChild);
            ref?: vue.VNodeRef | undefined;
            ref_for?: boolean | undefined;
            ref_key?: string | undefined;
            "v-slot:default"?: false | ((arg: {
                isSelected: UnwrapRef<GroupItemProvide['isSelected']>;
                select: GroupItemProvide['select'];
                toggle: GroupItemProvide['toggle'];
                selectedClass: UnwrapRef<GroupItemProvide['selectedClass']>;
            }) => vue.VNodeChild) | undefined;
            'v-slots'?: {
                default?: false | ((arg: {
                    isSelected: UnwrapRef<GroupItemProvide['isSelected']>;
                    select: GroupItemProvide['select'];
                    toggle: GroupItemProvide['toggle'];
                    selectedClass: UnwrapRef<GroupItemProvide['selectedClass']>;
                }) => vue.VNodeChild) | undefined;
            } | undefined;
            onVnodeBeforeMount?: ((vnode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>) => void) | ((vnode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>) => void)[] | undefined;
            onVnodeMounted?: ((vnode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>) => void) | ((vnode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>) => void)[] | undefined;
            onVnodeBeforeUpdate?: ((vnode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>, oldVNode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>) => void) | ((vnode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>, oldVNode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>) => void)[] | undefined;
            onVnodeUpdated?: ((vnode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>, oldVNode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>) => void) | ((vnode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>, oldVNode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>) => void)[] | undefined;
            onVnodeBeforeUnmount?: ((vnode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>) => void) | ((vnode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>) => void)[] | undefined;
            onVnodeUnmounted?: ((vnode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>) => void) | ((vnode: vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>) => void)[] | undefined;
            selectedClass?: string | undefined;
            "onGroup:selected"?: ((val: {
                value: boolean;
            }) => any) | undefined;
        };
        $attrs: {
            [x: string]: unknown;
        };
        $refs: {
            [x: string]: unknown;
        };
        $slots: Readonly<{
            default?: ((arg: {
                isSelected: UnwrapRef<GroupItemProvide['isSelected']>;
                select: GroupItemProvide['select'];
                toggle: GroupItemProvide['toggle'];
                selectedClass: UnwrapRef<GroupItemProvide['selectedClass']>;
            }) => vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>[]) | undefined;
        }>;
        $root: vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}>, {}, {}> | null;
        $parent: vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}>, {}, {}> | null;
        $emit: (event: "group:selected", val: {
            value: boolean;
        }) => void;
        $el: any;
        $options: vue.ComponentOptionsBase<{
            disabled: boolean;
        } & {
            value?: any;
            selectedClass?: string | undefined;
        } & {
            $children?: vue.VNodeChild | {
                default?: ((arg: {
                    isSelected: UnwrapRef<GroupItemProvide['isSelected']>;
                    select: GroupItemProvide['select'];
                    toggle: GroupItemProvide['toggle'];
                    selectedClass: UnwrapRef<GroupItemProvide['selectedClass']>;
                }) => vue.VNodeChild) | undefined;
            } | ((arg: {
                isSelected: UnwrapRef<GroupItemProvide['isSelected']>;
                select: GroupItemProvide['select'];
                toggle: GroupItemProvide['toggle'];
                selectedClass: UnwrapRef<GroupItemProvide['selectedClass']>;
            }) => vue.VNodeChild);
            'v-slots'?: {
                default?: false | ((arg: {
                    isSelected: UnwrapRef<GroupItemProvide['isSelected']>;
                    select: GroupItemProvide['select'];
                    toggle: GroupItemProvide['toggle'];
                    selectedClass: UnwrapRef<GroupItemProvide['selectedClass']>;
                }) => vue.VNodeChild) | undefined;
            } | undefined;
        } & {
            "v-slot:default"?: false | ((arg: {
                isSelected: UnwrapRef<GroupItemProvide['isSelected']>;
                select: GroupItemProvide['select'];
                toggle: GroupItemProvide['toggle'];
                selectedClass: UnwrapRef<GroupItemProvide['selectedClass']>;
            }) => vue.VNodeChild) | undefined;
        } & {
            "onGroup:selected"?: ((val: {
                value: boolean;
            }) => any) | undefined;
        }, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
            [key: string]: any;
        }>[] | undefined, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {
            'group:selected': (val: {
                value: boolean;
            }) => true;
        }, string, {
            disabled: boolean;
        }, {}, string, vue.SlotsType<Partial<{
            default: (arg: {
                isSelected: UnwrapRef<GroupItemProvide['isSelected']>;
                select: GroupItemProvide['select'];
                toggle: GroupItemProvide['toggle'];
                selectedClass: UnwrapRef<GroupItemProvide['selectedClass']>;
            }) => vue.VNode<vue.RendererNode, vue.RendererElement, {
                [key: string]: any;
            }>[];
        }>>> & {
            beforeCreate?: ((() => void) | (() => void)[]) | undefined;
            created?: ((() => void) | (() => void)[]) | undefined;
            beforeMount?: ((() => void) | (() => void)[]) | undefined;
            mounted?: ((() => void) | (() => void)[]) | undefined;
            beforeUpdate?: ((() => void) | (() => void)[]) | undefined;
            updated?: ((() => void) | (() => void)[]) | undefined;
            activated?: ((() => void) | (() => void)[]) | undefined;
            deactivated?: ((() => void) | (() => void)[]) | undefined;
            beforeDestroy?: ((() => void) | (() => void)[]) | undefined;
            beforeUnmount?: ((() => void) | (() => void)[]) | undefined;
            destroyed?: ((() => void) | (() => void)[]) | undefined;
            unmounted?: ((() => void) | (() => void)[]) | undefined;
            renderTracked?: (((e: vue.DebuggerEvent) => void) | ((e: vue.DebuggerEvent) => void)[]) | undefined;
            renderTriggered?: (((e: vue.DebuggerEvent) => void) | ((e: vue.DebuggerEvent) => void)[]) | undefined;
            errorCaptured?: (((err: unknown, instance: vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}>, {}, {}> | null, info: string) => boolean | void) | ((err: unknown, instance: vue.ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, vue.ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}>, {}, {}> | null, info: string) => boolean | void)[]) | undefined;
        };
        $forceUpdate: () => void;
        $nextTick: typeof vue.nextTick;
        $watch<T extends string | ((...args: any) => any)>(source: T, cb: T extends (...args: any) => infer R ? (args_0: R, args_1: R) => any : (...args: any) => any, options?: vue.WatchOptions<boolean> | undefined): vue.WatchStopHandle;
    } & {
        disabled: boolean;
    } & {
        value?: any;
        selectedClass?: string | undefined;
    } & {
        $children?: vue.VNodeChild | {
            default?: ((arg: {
                isSelected: UnwrapRef<GroupItemProvide['isSelected']>;
                select: GroupItemProvide['select'];
                toggle: GroupItemProvide['toggle'];
                selectedClass: UnwrapRef<GroupItemProvide['selectedClass']>;
            }) => vue.VNodeChild) | undefined;
        } | ((arg: {
            isSelected: UnwrapRef<GroupItemProvide['isSelected']>;
            select: GroupItemProvide['select'];
            toggle: GroupItemProvide['toggle'];
            selectedClass: UnwrapRef<GroupItemProvide['selectedClass']>;
        }) => vue.VNodeChild);
        'v-slots'?: {
            default?: false | ((arg: {
                isSelected: UnwrapRef<GroupItemProvide['isSelected']>;
                select: GroupItemProvide['select'];
                toggle: GroupItemProvide['toggle'];
                selectedClass: UnwrapRef<GroupItemProvide['selectedClass']>;
            }) => vue.VNodeChild) | undefined;
        } | undefined;
    } & {
        "v-slot:default"?: false | ((arg: {
            isSelected: UnwrapRef<GroupItemProvide['isSelected']>;
            select: GroupItemProvide['select'];
            toggle: GroupItemProvide['toggle'];
            selectedClass: UnwrapRef<GroupItemProvide['selectedClass']>;
        }) => vue.VNodeChild) | undefined;
    } & {
        "onGroup:selected"?: ((val: {
            value: boolean;
        }) => any) | undefined;
    } & vue.ShallowUnwrapRef<() => vue.VNode<vue.RendererNode, vue.RendererElement, {
        [key: string]: any;
    }>[] | undefined> & {} & vue.ComponentCustomProperties & {};
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & vue.ComponentOptionsBase<{
    disabled: boolean;
} & {
    value?: any;
    selectedClass?: string | undefined;
} & {
    $children?: vue.VNodeChild | {
        default?: ((arg: {
            isSelected: UnwrapRef<GroupItemProvide['isSelected']>;
            select: GroupItemProvide['select'];
            toggle: GroupItemProvide['toggle'];
            selectedClass: UnwrapRef<GroupItemProvide['selectedClass']>;
        }) => vue.VNodeChild) | undefined;
    } | ((arg: {
        isSelected: UnwrapRef<GroupItemProvide['isSelected']>;
        select: GroupItemProvide['select'];
        toggle: GroupItemProvide['toggle'];
        selectedClass: UnwrapRef<GroupItemProvide['selectedClass']>;
    }) => vue.VNodeChild);
    'v-slots'?: {
        default?: false | ((arg: {
            isSelected: UnwrapRef<GroupItemProvide['isSelected']>;
            select: GroupItemProvide['select'];
            toggle: GroupItemProvide['toggle'];
            selectedClass: UnwrapRef<GroupItemProvide['selectedClass']>;
        }) => vue.VNodeChild) | undefined;
    } | undefined;
} & {
    "v-slot:default"?: false | ((arg: {
        isSelected: UnwrapRef<GroupItemProvide['isSelected']>;
        select: GroupItemProvide['select'];
        toggle: GroupItemProvide['toggle'];
        selectedClass: UnwrapRef<GroupItemProvide['selectedClass']>;
    }) => vue.VNodeChild) | undefined;
} & {
    "onGroup:selected"?: ((val: {
        value: boolean;
    }) => any) | undefined;
}, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>[] | undefined, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {
    'group:selected': (val: {
        value: boolean;
    }) => true;
}, string, {
    disabled: boolean;
}, {}, string, vue.SlotsType<Partial<{
    default: (arg: {
        isSelected: UnwrapRef<GroupItemProvide['isSelected']>;
        select: GroupItemProvide['select'];
        toggle: GroupItemProvide['toggle'];
        selectedClass: UnwrapRef<GroupItemProvide['selectedClass']>;
    }) => vue.VNode<vue.RendererNode, vue.RendererElement, {
        [key: string]: any;
    }>[];
}>>> & vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps & FilterPropsOptions<{
    value: null;
    disabled: BooleanConstructor;
    selectedClass: StringConstructor;
}, vue.ExtractPropTypes<{
    value: null;
    disabled: BooleanConstructor;
    selectedClass: StringConstructor;
}>>;
type VSlideGroupItem = InstanceType<typeof VSlideGroupItem>;

export { VSlideGroup, VSlideGroupItem };
