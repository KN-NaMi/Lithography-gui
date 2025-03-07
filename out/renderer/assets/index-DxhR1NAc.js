function noop() {
}
function assign(tar, src) {
  for (const k in src) tar[k] = src[k];
  return (
    /** @type {T & S} */
    tar
  );
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
}
let src_url_equal_anchor;
function src_url_equal(element_src, url) {
  if (element_src === url) return true;
  if (!src_url_equal_anchor) {
    src_url_equal_anchor = document.createElement("a");
  }
  src_url_equal_anchor.href = url;
  return element_src === src_url_equal_anchor.href;
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    for (const callback of callbacks) {
      callback(void 0);
    }
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
  let value;
  subscribe(store, (_) => value = _)();
  return value;
}
function component_subscribe(component, store, callback) {
  component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
  if (definition) {
    const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
    return definition[0](slot_ctx);
  }
}
function get_slot_context(definition, ctx, $$scope, fn) {
  return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
  if (definition[2] && fn) ;
  return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
  if (slot_changes) {
    const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
    slot.p(slot_context, slot_changes);
  }
}
function get_all_dirty_from_scope($$scope) {
  if ($$scope.ctx.length > 32) {
    const dirty = [];
    const length = $$scope.ctx.length / 32;
    for (let i = 0; i < length; i++) {
      dirty[i] = -1;
    }
    return dirty;
  }
  return -1;
}
function exclude_internal_props(props) {
  const result = {};
  for (const k in props) if (k[0] !== "$") result[k] = props[k];
  return result;
}
function compute_rest_props(props, keys) {
  const rest = {};
  keys = new Set(keys);
  for (const k in props) if (!keys.has(k) && k[0] !== "$") rest[k] = props[k];
  return rest;
}
function set_store_value(store, ret, value) {
  store.set(value);
  return ret;
}
function append(target, node) {
  target.appendChild(node);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i]) iterations[i].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function svg_element(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function empty() {
  return text("");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
  if (value == null) node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}
function set_svg_attributes(node, attributes) {
  for (const key in attributes) {
    attr(node, key, attributes[key]);
  }
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.data === data) return;
  text2.data = /** @type {string} */
  data;
}
function set_input_value(input, value) {
  input.value = value == null ? "" : value;
}
function select_option(select, value, mounting) {
  for (let i = 0; i < select.options.length; i += 1) {
    const option = select.options[i];
    if (option.__value === value) {
      option.selected = true;
      return;
    }
  }
  if (!mounting || value !== void 0) {
    select.selectedIndex = -1;
  }
}
function select_value(select) {
  const selected_option = select.querySelector(":checked");
  return selected_option && selected_option.__value;
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component) throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length) binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
function flush_render_callbacks(fns) {
  const filtered = [];
  const targets = [];
  render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
  targets.forEach((c) => c());
  render_callbacks = filtered;
}
const outroing = /* @__PURE__ */ new Set();
let outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
    // parent group
  };
}
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block)) return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2) block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
}
function ensure_array_like(array_like_or_iterator) {
  return array_like_or_iterator?.length !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
}
function get_spread_update(levels, updates) {
  const update2 = {};
  const to_null_out = {};
  const accounted_for = { $$scope: 1 };
  let i = levels.length;
  while (i--) {
    const o = levels[i];
    const n = updates[i];
    if (n) {
      for (const key in o) {
        if (!(key in n)) to_null_out[key] = 1;
      }
      for (const key in n) {
        if (!accounted_for[key]) {
          update2[key] = n[key];
          accounted_for[key] = 1;
        }
      }
      levels[i] = n;
    } else {
      for (const key in o) {
        accounted_for[key] = 1;
      }
    }
  }
  for (const key in to_null_out) {
    if (!(key in update2)) update2[key] = void 0;
  }
  return update2;
}
function get_spread_object(spread_props) {
  return typeof spread_props === "object" && spread_props !== null ? spread_props : {};
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  add_render_callback(() => {
    const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
    if (component.$$.on_destroy) {
      component.$$.on_destroy.push(...new_on_destroy);
    } else {
      run_all(new_on_destroy);
    }
    component.$$.on_mount = [];
  });
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    flush_render_callbacks($$.after_update);
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles = null, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    // state
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    // everything else
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
      if (ready) make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro) transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  /**
   * ### PRIVATE API
   *
   * Do not use, may change at any time
   *
   * @type {any}
   */
  $$ = void 0;
  /**
   * ### PRIVATE API
   *
   * Do not use, may change at any time
   *
   * @type {any}
   */
  $$set = void 0;
  /** @returns {void} */
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1) callbacks.splice(index, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(props) {
    if (this.$$set && !is_empty(props)) {
      this.$$.skip_bound = true;
      this.$$set(props);
      this.$$.skip_bound = false;
    }
  }
}
const PUBLIC_VERSION = "4";
if (typeof window !== "undefined")
  (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);
/**
 * @license lucide-svelte v0.477.0 - ISC
 *
 * ISC License
 * 
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * 
 */
const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
function get_each_context$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[11] = list[i][0];
  child_ctx[12] = list[i][1];
  return child_ctx;
}
function create_dynamic_element(ctx) {
  let svelte_element;
  let svelte_element_levels = [
    /*attrs*/
    ctx[12]
  ];
  let svelte_element_data = {};
  for (let i = 0; i < svelte_element_levels.length; i += 1) {
    svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
  }
  return {
    c() {
      svelte_element = svg_element(
        /*tag*/
        ctx[11]
      );
      set_svg_attributes(svelte_element, svelte_element_data);
    },
    m(target, anchor) {
      insert(target, svelte_element, anchor);
    },
    p(ctx2, dirty) {
      set_svg_attributes(svelte_element, svelte_element_data = get_spread_update(svelte_element_levels, [dirty & /*iconNode*/
      32 && /*attrs*/
      ctx2[12]]));
    },
    d(detaching) {
      if (detaching) {
        detach(svelte_element);
      }
    }
  };
}
function create_each_block$1(ctx) {
  let previous_tag = (
    /*tag*/
    ctx[11]
  );
  let svelte_element_anchor;
  let svelte_element = (
    /*tag*/
    ctx[11] && create_dynamic_element(ctx)
  );
  return {
    c() {
      if (svelte_element) svelte_element.c();
      svelte_element_anchor = empty();
    },
    m(target, anchor) {
      if (svelte_element) svelte_element.m(target, anchor);
      insert(target, svelte_element_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (
        /*tag*/
        ctx2[11]
      ) {
        if (!previous_tag) {
          svelte_element = create_dynamic_element(ctx2);
          previous_tag = /*tag*/
          ctx2[11];
          svelte_element.c();
          svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
        } else if (safe_not_equal(
          previous_tag,
          /*tag*/
          ctx2[11]
        )) {
          svelte_element.d(1);
          svelte_element = create_dynamic_element(ctx2);
          previous_tag = /*tag*/
          ctx2[11];
          svelte_element.c();
          svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
        } else {
          svelte_element.p(ctx2, dirty);
        }
      } else if (previous_tag) {
        svelte_element.d(1);
        svelte_element = null;
        previous_tag = /*tag*/
        ctx2[11];
      }
    },
    d(detaching) {
      if (detaching) {
        detach(svelte_element_anchor);
      }
      if (svelte_element) svelte_element.d(detaching);
    }
  };
}
function create_fragment$7(ctx) {
  let svg;
  let each_1_anchor;
  let svg_stroke_width_value;
  let svg_class_value;
  let current;
  let each_value = ensure_array_like(
    /*iconNode*/
    ctx[5]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
  }
  const default_slot_template = (
    /*#slots*/
    ctx[10].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[9],
    null
  );
  let svg_levels = [
    defaultAttributes,
    /*$$restProps*/
    ctx[7],
    { width: (
      /*size*/
      ctx[2]
    ) },
    { height: (
      /*size*/
      ctx[2]
    ) },
    { stroke: (
      /*color*/
      ctx[1]
    ) },
    {
      "stroke-width": svg_stroke_width_value = /*absoluteStrokeWidth*/
      ctx[4] ? Number(
        /*strokeWidth*/
        ctx[3]
      ) * 24 / Number(
        /*size*/
        ctx[2]
      ) : (
        /*strokeWidth*/
        ctx[3]
      )
    },
    {
      class: svg_class_value = /*mergeClasses*/
      ctx[6](
        "lucide-icon",
        "lucide",
        /*name*/
        ctx[0] ? `lucide-${/*name*/
        ctx[0]}` : "",
        /*$$props*/
        ctx[8].class
      )
    }
  ];
  let svg_data = {};
  for (let i = 0; i < svg_levels.length; i += 1) {
    svg_data = assign(svg_data, svg_levels[i]);
  }
  return {
    c() {
      svg = svg_element("svg");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
      if (default_slot) default_slot.c();
      set_svg_attributes(svg, svg_data);
    },
    m(target, anchor) {
      insert(target, svg, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(svg, null);
        }
      }
      append(svg, each_1_anchor);
      if (default_slot) {
        default_slot.m(svg, null);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (dirty & /*iconNode*/
      32) {
        each_value = ensure_array_like(
          /*iconNode*/
          ctx2[5]
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$1(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block$1(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(svg, each_1_anchor);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        512)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[9],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[9]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[9],
              dirty,
              null
            ),
            null
          );
        }
      }
      set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
        defaultAttributes,
        dirty & /*$$restProps*/
        128 && /*$$restProps*/
        ctx2[7],
        (!current || dirty & /*size*/
        4) && { width: (
          /*size*/
          ctx2[2]
        ) },
        (!current || dirty & /*size*/
        4) && { height: (
          /*size*/
          ctx2[2]
        ) },
        (!current || dirty & /*color*/
        2) && { stroke: (
          /*color*/
          ctx2[1]
        ) },
        (!current || dirty & /*absoluteStrokeWidth, strokeWidth, size*/
        28 && svg_stroke_width_value !== (svg_stroke_width_value = /*absoluteStrokeWidth*/
        ctx2[4] ? Number(
          /*strokeWidth*/
          ctx2[3]
        ) * 24 / Number(
          /*size*/
          ctx2[2]
        ) : (
          /*strokeWidth*/
          ctx2[3]
        ))) && { "stroke-width": svg_stroke_width_value },
        (!current || dirty & /*name, $$props*/
        257 && svg_class_value !== (svg_class_value = /*mergeClasses*/
        ctx2[6](
          "lucide-icon",
          "lucide",
          /*name*/
          ctx2[0] ? `lucide-${/*name*/
          ctx2[0]}` : "",
          /*$$props*/
          ctx2[8].class
        ))) && { class: svg_class_value }
      ]));
    },
    i(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(svg);
      }
      destroy_each(each_blocks, detaching);
      if (default_slot) default_slot.d(detaching);
    }
  };
}
function instance$6($$self, $$props, $$invalidate) {
  const omit_props_names = ["name", "color", "size", "strokeWidth", "absoluteStrokeWidth", "iconNode"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { name = void 0 } = $$props;
  let { color = "currentColor" } = $$props;
  let { size = 24 } = $$props;
  let { strokeWidth = 2 } = $$props;
  let { absoluteStrokeWidth = false } = $$props;
  let { iconNode = [] } = $$props;
  const mergeClasses = (...classes) => classes.filter((className, index, array) => {
    return Boolean(className) && array.indexOf(className) === index;
  }).join(" ");
  $$self.$$set = ($$new_props) => {
    $$invalidate(8, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    $$invalidate(7, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("name" in $$new_props) $$invalidate(0, name = $$new_props.name);
    if ("color" in $$new_props) $$invalidate(1, color = $$new_props.color);
    if ("size" in $$new_props) $$invalidate(2, size = $$new_props.size);
    if ("strokeWidth" in $$new_props) $$invalidate(3, strokeWidth = $$new_props.strokeWidth);
    if ("absoluteStrokeWidth" in $$new_props) $$invalidate(4, absoluteStrokeWidth = $$new_props.absoluteStrokeWidth);
    if ("iconNode" in $$new_props) $$invalidate(5, iconNode = $$new_props.iconNode);
    if ("$$scope" in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [
    name,
    color,
    size,
    strokeWidth,
    absoluteStrokeWidth,
    iconNode,
    mergeClasses,
    $$restProps,
    $$props,
    $$scope,
    slots
  ];
}
class Icon extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$6, create_fragment$7, safe_not_equal, {
      name: 0,
      color: 1,
      size: 2,
      strokeWidth: 3,
      absoluteStrokeWidth: 4,
      iconNode: 5
    });
  }
}
function create_default_slot$4(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[2].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[3],
    null
  );
  return {
    c() {
      if (default_slot) default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[3],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[3]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[3],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot) default_slot.d(detaching);
    }
  };
}
function create_fragment$6(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "camera" },
    /*$$props*/
    ctx[1],
    { iconNode: (
      /*iconNode*/
      ctx[0]
    ) }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot$4] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & /*$$props, iconNode*/
      3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & /*$$props*/
        2 && get_spread_object(
          /*$$props*/
          ctx2[1]
        ),
        dirty & /*iconNode*/
        1 && { iconNode: (
          /*iconNode*/
          ctx2[0]
        ) }
      ]) : {};
      if (dirty & /*$$scope*/
      8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$5($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    [
      "path",
      {
        "d": "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"
      }
    ],
    ["circle", { "cx": "12", "cy": "13", "r": "3" }]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Camera extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$5, create_fragment$6, safe_not_equal, {});
  }
}
function create_default_slot$3(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[2].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[3],
    null
  );
  return {
    c() {
      if (default_slot) default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[3],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[3]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[3],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot) default_slot.d(detaching);
    }
  };
}
function create_fragment$5(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "circle-x" },
    /*$$props*/
    ctx[1],
    { iconNode: (
      /*iconNode*/
      ctx[0]
    ) }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot$3] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & /*$$props, iconNode*/
      3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & /*$$props*/
        2 && get_spread_object(
          /*$$props*/
          ctx2[1]
        ),
        dirty & /*iconNode*/
        1 && { iconNode: (
          /*iconNode*/
          ctx2[0]
        ) }
      ]) : {};
      if (dirty & /*$$scope*/
      8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$4($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    ["path", { "d": "m15 9-6 6" }],
    ["path", { "d": "m9 9 6 6" }]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Circle_x extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$4, create_fragment$5, safe_not_equal, {});
  }
}
function create_default_slot$2(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[2].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[3],
    null
  );
  return {
    c() {
      if (default_slot) default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[3],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[3]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[3],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot) default_slot.d(detaching);
    }
  };
}
function create_fragment$4(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "expand" },
    /*$$props*/
    ctx[1],
    { iconNode: (
      /*iconNode*/
      ctx[0]
    ) }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot$2] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & /*$$props, iconNode*/
      3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & /*$$props*/
        2 && get_spread_object(
          /*$$props*/
          ctx2[1]
        ),
        dirty & /*iconNode*/
        1 && { iconNode: (
          /*iconNode*/
          ctx2[0]
        ) }
      ]) : {};
      if (dirty & /*$$scope*/
      8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$3($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    ["path", { "d": "m15 15 6 6" }],
    ["path", { "d": "m15 9 6-6" }],
    ["path", { "d": "M21 16.2V21h-4.8" }],
    ["path", { "d": "M21 7.8V3h-4.8" }],
    ["path", { "d": "M3 16.2V21h4.8" }],
    ["path", { "d": "m3 21 6-6" }],
    ["path", { "d": "M3 7.8V3h4.8" }],
    ["path", { "d": "M9 9 3 3" }]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Expand extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$3, create_fragment$4, safe_not_equal, {});
  }
}
function create_default_slot$1(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[2].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[3],
    null
  );
  return {
    c() {
      if (default_slot) default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[3],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[3]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[3],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot) default_slot.d(detaching);
    }
  };
}
function create_fragment$3(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "file-down" },
    /*$$props*/
    ctx[1],
    { iconNode: (
      /*iconNode*/
      ctx[0]
    ) }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot$1] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & /*$$props, iconNode*/
      3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & /*$$props*/
        2 && get_spread_object(
          /*$$props*/
          ctx2[1]
        ),
        dirty & /*iconNode*/
        1 && { iconNode: (
          /*iconNode*/
          ctx2[0]
        ) }
      ]) : {};
      if (dirty & /*$$scope*/
      8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$2($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    [
      "path",
      {
        "d": "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
      }
    ],
    ["path", { "d": "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { "d": "M12 18v-6" }],
    ["path", { "d": "m9 15 3 3 3-3" }]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class File_down extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$2, create_fragment$3, safe_not_equal, {});
  }
}
function create_default_slot(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[2].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[3],
    null
  );
  return {
    c() {
      if (default_slot) default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[3],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[3]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[3],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot) default_slot.d(detaching);
    }
  };
}
function create_fragment$2(ctx) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "settings" },
    /*$$props*/
    ctx[1],
    { iconNode: (
      /*iconNode*/
      ctx[0]
    ) }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot] },
    $$scope: { ctx }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const icon_changes = dirty & /*$$props, iconNode*/
      3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & /*$$props*/
        2 && get_spread_object(
          /*$$props*/
          ctx2[1]
        ),
        dirty & /*iconNode*/
        1 && { iconNode: (
          /*iconNode*/
          ctx2[0]
        ) }
      ]) : {};
      if (dirty & /*$$scope*/
      8) {
        icon_changes.$$scope = { dirty, ctx: ctx2 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current) return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance$1($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [
    [
      "path",
      {
        "d": "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
      }
    ],
    ["circle", { "cx": "12", "cy": "12", "r": "3" }]
  ];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class Settings extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$2, safe_not_equal, {});
  }
}
const subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update2(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set, update2) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update: update2, subscribe: subscribe2 };
}
const cameraError = writable(false);
const videoDevices = writable([]);
const selectedDeviceId = writable("");
const stream = writable(null);
const screenshotData = writable(null);
const showScreenshotPreview = writable(false);
let screenshotCanvas;
function initScreenshotCanvas() {
  screenshotCanvas = document.createElement("canvas");
  return screenshotCanvas;
}
function getScreenshotCanvas() {
  return screenshotCanvas;
}
async function getVideoDevices() {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true });
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter((device) => device.kind === "videoinput");
    videoDevices.set(videoInputs);
    if (videoInputs.length === 0) {
      console.error("No video devices found");
      cameraError.set(true);
    } else {
      selectedDeviceId.set(videoInputs[0].deviceId);
    }
    return videoInputs;
  } catch (err) {
    console.error("Error accessing devices:", err);
    cameraError.set(true);
    return [];
  }
}
async function initializeWebcam(videoElement, cameraViewElement) {
  try {
    const currentStream = get_store_value(stream);
    if (currentStream) {
      currentStream.getTracks().forEach((track) => track.stop());
    }
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: get_store_value(selectedDeviceId) ? { exact: get_store_value(selectedDeviceId) } : void 0 },
      audio: false
    });
    videoElement.srcObject = newStream;
    videoElement.play();
    stream.set(newStream);
    cameraError.set(false);
  } catch (err) {
    console.error("Error accessing webcam:", err);
    cameraError.set(true);
  }
}
function toggleFullscreen(element2) {
  element2.requestFullscreen();
}
function takeScreenshot(videoElement) {
  if (!videoElement) return;
  const canvas = getScreenshotCanvas();
  const width = videoElement.videoWidth;
  const height = videoElement.videoHeight;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.drawImage(videoElement, 0, 0, width, height);
  const screenshot = canvas.toDataURL("image/png");
  screenshotData.set(screenshot);
  showScreenshotPreview.set(true);
}
function downloadScreenshot() {
  const currentScreenshot = get_store_value(screenshotData);
  if (!currentScreenshot) return;
  const downloadLink = document.createElement("a");
  downloadLink.href = currentScreenshot;
  const date = /* @__PURE__ */ new Date();
  const timestamp = date.toISOString().replace(/[:.]/g, "-");
  downloadLink.download = `screenshot-${timestamp}.png`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
function openCameraSettings() {
  if (window.electronAPI?.openNewWindow) {
    window.electronAPI.openNewWindow();
  } else {
    console.warn("Electron API not available");
  }
}
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[12] = list[i];
  return child_ctx;
}
function create_each_block(ctx) {
  let option;
  let t0_value = (
    /*device*/
    (ctx[12].label || `Camera ${/*$videoDevices*/
    ctx[3].indexOf(
      /*device*/
      ctx[12]
    ) + 1}`) + ""
  );
  let t0;
  let t1;
  let option_value_value;
  return {
    c() {
      option = element("option");
      t0 = text(t0_value);
      t1 = space();
      option.__value = option_value_value = /*device*/
      ctx[12].deviceId;
      set_input_value(option, option.__value);
    },
    m(target, anchor) {
      insert(target, option, anchor);
      append(option, t0);
      append(option, t1);
    },
    p(ctx2, dirty) {
      if (dirty & /*$videoDevices*/
      8 && t0_value !== (t0_value = /*device*/
      (ctx2[12].label || `Camera ${/*$videoDevices*/
      ctx2[3].indexOf(
        /*device*/
        ctx2[12]
      ) + 1}`) + "")) set_data(t0, t0_value);
      if (dirty & /*$videoDevices*/
      8 && option_value_value !== (option_value_value = /*device*/
      ctx2[12].deviceId)) {
        option.__value = option_value_value;
        set_input_value(option, option.__value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(option);
      }
    }
  };
}
function create_if_block(ctx) {
  let div3;
  let div2;
  let div0;
  let button0;
  let filedown;
  let t0;
  let button1;
  let circlex;
  let t1;
  let img;
  let img_src_value;
  let t2;
  let div1;
  let current;
  let mounted;
  let dispose;
  filedown = new File_down({ props: { class: "w-4 h-4 text-white" } });
  circlex = new Circle_x({ props: { class: "w-4 h-4 text-white" } });
  return {
    c() {
      div3 = element("div");
      div2 = element("div");
      div0 = element("div");
      button0 = element("button");
      create_component(filedown.$$.fragment);
      t0 = space();
      button1 = element("button");
      create_component(circlex.$$.fragment);
      t1 = space();
      img = element("img");
      t2 = space();
      div1 = element("div");
      div1.textContent = "Screenshot captured";
      attr(div0, "class", "absolute top-2 right-2 flex space-x-2");
      if (!src_url_equal(img.src, img_src_value = /*$screenshotData*/
      ctx[4])) attr(img, "src", img_src_value);
      attr(img, "alt", "Screenshot");
      attr(img, "class", "max-w-full max-h-64 object-contain mt-4");
      attr(div1, "class", "mt-3 text-center text-white text-sm");
      attr(div2, "class", "relative bg-gray-800 p-2 rounded-lg shadow-lg max-w-full max-h-full");
      attr(div3, "class", "absolute inset-0 bg-black bg-opacity-80 z-20 flex flex-col items-center justify-center p-4");
    },
    m(target, anchor) {
      insert(target, div3, anchor);
      append(div3, div2);
      append(div2, div0);
      append(div0, button0);
      mount_component(filedown, button0, null);
      append(div0, t0);
      append(div0, button1);
      mount_component(circlex, button1, null);
      append(div2, t1);
      append(div2, img);
      append(div2, t2);
      append(div2, div1);
      current = true;
      if (!mounted) {
        dispose = [
          listen(button0, "click", downloadScreenshot),
          listen(
            button1,
            "click",
            /*closeScreenshotPreview*/
            ctx[6]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (!current || dirty & /*$screenshotData*/
      16 && !src_url_equal(img.src, img_src_value = /*$screenshotData*/
      ctx2[4])) {
        attr(img, "src", img_src_value);
      }
    },
    i(local) {
      if (current) return;
      transition_in(filedown.$$.fragment, local);
      transition_in(circlex.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(filedown.$$.fragment, local);
      transition_out(circlex.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div3);
      }
      destroy_component(filedown);
      destroy_component(circlex);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment$1(ctx) {
  let div2;
  let div0;
  let select;
  let t0;
  let div1;
  let button0;
  let expand;
  let t1;
  let button1;
  let camera;
  let t2;
  let button2;
  let settings;
  let t3;
  let div4;
  let div3;
  let t4;
  let current;
  let mounted;
  let dispose;
  let each_value = ensure_array_like(
    /*$videoDevices*/
    ctx[3]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  expand = new Expand({ props: { class: "w-4 h-4 text-white" } });
  camera = new Camera({ props: { class: "w-4 h-4 text-white" } });
  settings = new Settings({ props: { class: "w-4 h-4 text-white" } });
  let if_block = (
    /*$showScreenshotPreview*/
    ctx[1] && /*$screenshotData*/
    ctx[4] && create_if_block(ctx)
  );
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      select = element("select");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t0 = space();
      div1 = element("div");
      button0 = element("button");
      create_component(expand.$$.fragment);
      t1 = space();
      button1 = element("button");
      create_component(camera.$$.fragment);
      t2 = space();
      button2 = element("button");
      create_component(settings.$$.fragment);
      t3 = space();
      div4 = element("div");
      div3 = element("div");
      t4 = space();
      if (if_block) if_block.c();
      attr(select, "class", "bg-gray-900 text-white text-xs py-1 pl-2 pr-6 rounded border border-gray-700");
      if (
        /*$selectedDeviceId*/
        ctx[2] === void 0
      ) add_render_callback(() => (
        /*select_change_handler*/
        ctx[8].call(select)
      ));
      attr(div0, "class", "flex items-center space-x-2 rounded-xl");
      attr(div1, "class", "flex items-right space-x-3 m-2");
      attr(div2, "class", "flex justify-between items-center z-10 rounded-xl m-1 w-full");
      attr(div3, "class", "w-full h-full overflow-hidden rounded-xl");
      attr(div4, "class", "");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      append(div2, div0);
      append(div0, select);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(select, null);
        }
      }
      select_option(
        select,
        /*$selectedDeviceId*/
        ctx[2],
        true
      );
      append(div2, t0);
      append(div2, div1);
      append(div1, button0);
      mount_component(expand, button0, null);
      append(div1, t1);
      append(div1, button1);
      mount_component(camera, button1, null);
      append(div1, t2);
      append(div1, button2);
      mount_component(settings, button2, null);
      insert(target, t3, anchor);
      insert(target, div4, anchor);
      append(div4, div3);
      ctx[10](div3);
      append(div4, t4);
      if (if_block) if_block.m(div4, null);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            select,
            "change",
            /*select_change_handler*/
            ctx[8]
          ),
          listen(
            select,
            "change",
            /*handleDeviceChange*/
            ctx[5]
          ),
          listen(
            button0,
            "click",
            /*click_handler*/
            ctx[9]
          ),
          listen(
            button1,
            "click",
            /*captureScreenshot*/
            ctx[7]
          ),
          listen(button2, "click", openCameraSettings)
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & /*$videoDevices*/
      8) {
        each_value = ensure_array_like(
          /*$videoDevices*/
          ctx2[3]
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(select, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (dirty & /*$selectedDeviceId, $videoDevices*/
      12) {
        select_option(
          select,
          /*$selectedDeviceId*/
          ctx2[2]
        );
      }
      if (
        /*$showScreenshotPreview*/
        ctx2[1] && /*$screenshotData*/
        ctx2[4]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*$showScreenshotPreview, $screenshotData*/
          18) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div4, null);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(expand.$$.fragment, local);
      transition_in(camera.$$.fragment, local);
      transition_in(settings.$$.fragment, local);
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(expand.$$.fragment, local);
      transition_out(camera.$$.fragment, local);
      transition_out(settings.$$.fragment, local);
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div2);
        detach(t3);
        detach(div4);
      }
      destroy_each(each_blocks, detaching);
      destroy_component(expand);
      destroy_component(camera);
      destroy_component(settings);
      ctx[10](null);
      if (if_block) if_block.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let $showScreenshotPreview;
  let $selectedDeviceId;
  let $videoDevices;
  let $screenshotData;
  component_subscribe($$self, showScreenshotPreview, ($$value) => $$invalidate(1, $showScreenshotPreview = $$value));
  component_subscribe($$self, selectedDeviceId, ($$value) => $$invalidate(2, $selectedDeviceId = $$value));
  component_subscribe($$self, videoDevices, ($$value) => $$invalidate(3, $videoDevices = $$value));
  component_subscribe($$self, screenshotData, ($$value) => $$invalidate(4, $screenshotData = $$value));
  let cameraView;
  let videoElement;
  onMount(async () => {
    initScreenshotCanvas();
    await getVideoDevices();
    videoElement = document.createElement("video");
    videoElement.style.width = "100%";
    videoElement.style.height = "100%";
    videoElement.style.objectFit = "cover";
    cameraView.appendChild(videoElement);
    await initializeWebcam(videoElement);
  });
  function handleDeviceChange() {
    initializeWebcam(videoElement);
  }
  function closeScreenshotPreview() {
    set_store_value(showScreenshotPreview, $showScreenshotPreview = false, $showScreenshotPreview);
  }
  function captureScreenshot() {
    takeScreenshot(videoElement);
  }
  function select_change_handler() {
    $selectedDeviceId = select_value(this);
    selectedDeviceId.set($selectedDeviceId);
  }
  const click_handler = () => toggleFullscreen(cameraView);
  function div3_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      cameraView = $$value;
      $$invalidate(0, cameraView);
    });
  }
  return [
    cameraView,
    $showScreenshotPreview,
    $selectedDeviceId,
    $videoDevices,
    $screenshotData,
    handleDeviceChange,
    closeScreenshotPreview,
    captureScreenshot,
    select_change_handler,
    click_handler,
    div3_binding
  ];
}
class CameraView extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment$1, safe_not_equal, {});
  }
}
function create_fragment(ctx) {
  let main;
  let div7;
  let div0;
  let t1;
  let div1;
  let t3;
  let div6;
  let div2;
  let cameraview;
  let t4;
  let div3;
  let t6;
  let div4;
  let t8;
  let div5;
  let current;
  cameraview = new CameraView({});
  return {
    c() {
      main = element("main");
      div7 = element("div");
      div0 = element("div");
      div0.textContent = "NaMi Lithography GUI";
      t1 = space();
      div1 = element("div");
      div1.textContent = "DASHBOARD";
      t3 = space();
      div6 = element("div");
      div2 = element("div");
      create_component(cameraview.$$.fragment);
      t4 = space();
      div3 = element("div");
      div3.textContent = "Component 2";
      t6 = space();
      div4 = element("div");
      div4.textContent = "Component 3";
      t8 = space();
      div5 = element("div");
      div5.textContent = "Component 4";
      attr(div0, "class", "m-1 rounded-xl border-2 border-gray-900");
      attr(div1, "class", "m-1 rounded-xl border-2 border-gray-900");
      attr(div2, "class", "m-1 rounded-xl border-2 border-gray-900 bg-gray-900");
      attr(div3, "class", "m-1 rounded-xl border-2 border-gray-900");
      attr(div4, "class", "m-1 rounded-xl border-2 border-gray-900");
      attr(div5, "class", "m-1 rounded-xl border-2 border-gray-900");
      attr(div6, "class", "grid grid-cols-2 gap-4 h-full");
      attr(div7, "class", "m-1 rounded-xl border-2 border-gray-900");
    },
    m(target, anchor) {
      insert(target, main, anchor);
      append(main, div7);
      append(div7, div0);
      append(div7, t1);
      append(div7, div1);
      append(div7, t3);
      append(div7, div6);
      append(div6, div2);
      mount_component(cameraview, div2, null);
      append(div6, t4);
      append(div6, div3);
      append(div6, t6);
      append(div6, div4);
      append(div6, t8);
      append(div6, div5);
      current = true;
    },
    p: noop,
    i(local) {
      if (current) return;
      transition_in(cameraview.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(cameraview.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(main);
      }
      destroy_component(cameraview);
    }
  };
}
class App extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, null, create_fragment, safe_not_equal, {});
  }
}
new App({
  target: document.getElementById("app")
});
