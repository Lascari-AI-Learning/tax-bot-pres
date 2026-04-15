class Cn {
  constructor() {
    this.subscribable = new Li(this), this.subscribers = /* @__PURE__ */ new Set();
  }
  /**
   * {@inheritDoc Subscribable.subscribe}
   */
  subscribe(t) {
    return this.subscribers.add(t), () => this.unsubscribe(t);
  }
  /**
   * {@inheritDoc Subscribable.unsubscribe}
   */
  unsubscribe(t) {
    this.subscribers.delete(t);
  }
  /**
   * Unsubscribe all subscribers from the event.
   */
  clear() {
    this.subscribers.clear();
  }
  notifySubscribers(t) {
    return [...this.subscribers].map((e) => e(t));
  }
}
class Li {
  constructor(t) {
    this.dispatcher = t;
  }
  /**
   * Subscribe to the event.
   *
   * @param handler - The handler to invoke when the event occurs.
   *
   * @returns A callback function that cancels the subscription.
   */
  subscribe(t) {
    return this.dispatcher.subscribe(t);
  }
  /**
   * Unsubscribe from the event.
   *
   * @param handler - The handler to unsubscribe.
   */
  unsubscribe(t) {
    this.dispatcher.unsubscribe(t);
  }
}
class Wt extends Cn {
  dispatch(t) {
    this.notifySubscribers(t);
  }
}
class xc extends Cn {
  constructor() {
    super(...arguments), this.value = !1;
  }
  /**
   * Notify all current and future subscribers.
   */
  raise() {
    this.value || (this.value = !0, this.notifySubscribers());
  }
  /**
   * Stop notifying future subscribers.
   */
  reset() {
    this.value = !1;
  }
  /**
   * Are subscribers being notified?
   */
  isRaised() {
    return this.value;
  }
  subscribe(t) {
    const e = super.subscribe(t);
    return this.value && t(), e;
  }
}
class pe extends Cn {
  /**
   * {@inheritDoc SubscribableValueEvent.current}
   */
  get current() {
    return this.value;
  }
  /**
   * Set the current value of this dispatcher.
   *
   * @remarks
   * Setting the value will immediately notify all subscribers.
   *
   * @param value - The new value.
   */
  set current(t) {
    this.value = t, this.notifySubscribers(t);
  }
  /**
   * @param value - The initial value.
   */
  constructor(t) {
    super(), this.value = t, this.subscribable = new Cc(this);
  }
  /**
   * {@inheritDoc SubscribableValueEvent.subscribe}
   */
  subscribe(t, e = !0) {
    const r = super.subscribe(t);
    return e && t(this.value), r;
  }
}
class Cc extends Li {
  /**
   * Get the most recent value of this dispatcher.
   */
  get current() {
    return this.dispatcher.current;
  }
  /**
   * Subscribe to the event.
   *
   * Subscribing will immediately invoke the handler with the most recent value.
   *
   * @param handler - The handler to invoke when the event occurs.
   * @param dispatchImmediately - Whether the handler should be immediately
   *                              invoked with the most recent value.
   *
   * @returns Callback function that cancels the subscription.
   */
  subscribe(t, e = !0) {
    return this.dispatcher.subscribe(t, e);
  }
}
class Rt {
  /**
   * Triggered when the data of this field changes.
   *
   * @eventProperty
   */
  get onChanged() {
    return this.value.subscribable;
  }
  /**
   * Triggered when the field becomes disabled or enabled.
   *
   * @eventProperty
   */
  get onDisabled() {
    return this.disabled.subscribable;
  }
  /**
   * @param name - The name of this field displayed in the editor.
   * @param initial - The initial value of this field.
   */
  constructor(t, e) {
    this.name = t, this.initial = e, this.type = void 0, this.spacing = !1, this.description = "", this.disabled = new pe(!1), this.value = new pe(e);
  }
  /**
   * Get the current value.
   */
  get() {
    return this.value.current;
  }
  /**
   * Set the current value.
   *
   * @param value - The new value.
   */
  set(t) {
    this.value.current = this.parse(t);
  }
  /**
   * Convert a serialized value into a runtime type.
   *
   * @param value - The serialized value.
   */
  parse(t) {
    return t;
  }
  /**
   * Serialize the value of this field.
   */
  serialize() {
    return this.value.current;
  }
  /**
   * Create a clone of this field.
   */
  clone() {
    return new this.constructor(this.name, this.get());
  }
  /**
   * Disable or enable the field in the editor.
   *
   * @param value - Whether the field should be disabled.
   */
  disable(t = !0) {
    return this.disabled.current = t, this;
  }
  /**
   * Add or remove spacing at the beginning of this field.
   *
   * @param value - Whether to include the spacing.
   */
  space(t = !0) {
    return this.spacing = t, this;
  }
  /**
   * Set the description of this field.
   *
   * @param description - The description.
   */
  describe(t) {
    return this.description = t, this;
  }
}
class Sc extends Rt {
  /**
   * Triggered when the nested fields change.
   *
   * @eventProperty
   */
  get onFieldsChanged() {
    return this.event.subscribable;
  }
  constructor(t, e) {
    const r = new Map(Object.entries(e));
    super(t, Object.fromEntries(Array.from(r, ([i, a]) => [i, a.get()]))), this.type = Object, this.ignoreChange = !1, this.customFields = {}, this.handleChange = () => {
      this.ignoreChange || (this.value.current = {
        ...this.transform("get"),
        ...this.customFields
      });
    }, this.event = new pe([...r.values()]), this.fields = r;
    for (const [i, a] of this.fields)
      Object.defineProperty(this, i, { value: a }), a.onChanged.subscribe(this.handleChange);
  }
  set(t) {
    this.ignoreChange = !0;
    for (const [e, r] of Object.entries(t)) {
      const i = this.fields.get(e);
      i ? i.set(r) : this.customFields[e] = r;
    }
    this.ignoreChange = !1, this.handleChange();
  }
  serialize() {
    return {
      ...this.transform("serialize"),
      ...this.customFields
    };
  }
  clone() {
    const t = new this.constructor(this.name, this.transform("clone"));
    return t.set(structuredClone(this.customFields)), t;
  }
  transform(t) {
    return Object.fromEntries(Array.from(this.fields, ([r, i]) => [r, i[t]()]));
  }
}
const de = Sc;
class pi extends Rt {
  constructor() {
    super(...arguments), this.type = Boolean;
  }
  parse(t) {
    return !!t;
  }
}
class Mi extends Error {
  constructor(t, e) {
    typeof t == "string" ? (super(t), this.remarks = e) : (super(t.message), this.remarks = t.remarks, this.object = t.object, this.durationMs = t.durationMs, this.inspect = t.inspect);
  }
}
class kc {
  constructor() {
    this.resolveCurrent = null, this.current = null;
  }
  async acquire() {
    for (; this.current; )
      await this.current;
    this.current = new Promise((t) => {
      this.resolveCurrent = t;
    });
  }
  release() {
    var t;
    this.current = null, (t = this.resolveCurrent) == null || t.call(this), this.resolveCurrent = null;
  }
}
const Mr = [];
function Sn() {
  const n = Mr.at(-1);
  if (!n)
    throw new Error("The scene is not available in the current context.");
  return n;
}
function Tc(n) {
  Mr.push(n);
}
function Pc(n) {
  if (Mr.pop() !== n)
    throw new Error("startScene/endScene were called out of order.");
}
function mt() {
  var n;
  return ((n = Mr.at(-1)) == null ? void 0 : n.logger) ?? console;
}
const kn = [];
function $r() {
  const n = kn.at(-1);
  if (!n)
    throw new Mi("The thread is not available in the current context.", `<p><code>useThread()</code> can only be called from within generator functions.
      It&#39;s not available during rendering.</p>
`);
  return n;
}
function gi(n) {
  kn.push(n);
}
function vi(n) {
  if (kn.pop() !== n)
    throw new Error("startThread/endThread was called out of order.");
}
function Te(n) {
  return n[0].toUpperCase() + n.slice(1);
}
function fn() {
  let n;
  return (e) => {
    if (e !== void 0)
      n = e;
    else
      return n;
  };
}
function mi() {
  const n = function() {
  };
  return n.array = [], new Proxy(n, Rc);
}
const Rc = {
  apply(n, t, e) {
    if (e.length === 0)
      return n.array[0];
    n.array.push(...e);
  },
  get(n, t, e) {
    const r = Reflect.get(n.array, t, e);
    return typeof r == "function" ? r.bind(n.array) : r;
  },
  set(n, t, e, r) {
    return Reflect.set(n.array, t, e, r);
  }
};
function $i(n) {
  return {
    message: n.message,
    stack: n.stack,
    remarks: n.remarks
  };
}
const bi = [
  { value: 0.25, text: "0.25x (Quarter)" },
  { value: 0.5, text: "0.5x (Half)" },
  { value: 1, text: "1.0x (Full)" },
  { value: 2, text: "2.0x (Double)" }
], Lc = [
  { value: "srgb", text: "sRGB" },
  { value: "display-p3", text: "DCI-P3" }
], yi = [
  { value: 30, text: "30 FPS" },
  { value: 60, text: "60 FPS" }
];
var Et;
(function(n) {
  n.Error = "error", n.Warn = "warn", n.Info = "info", n.Http = "http", n.Verbose = "verbose", n.Debug = "debug", n.Silly = "silly";
})(Et || (Et = {}));
class Mc {
  constructor() {
    this.logged = new Wt(), this.history = [], this.profilers = {};
  }
  /**
   * Triggered when a new message is logged.
   */
  get onLogged() {
    return this.logged.subscribable;
  }
  log(t) {
    this.logged.dispatch(t), this.history.push(t);
  }
  error(t) {
    this.logLevel(Et.Error, t);
  }
  warn(t) {
    this.logLevel(Et.Warn, t);
  }
  info(t) {
    this.logLevel(Et.Info, t);
  }
  http(t) {
    this.logLevel(Et.Http, t);
  }
  verbose(t) {
    this.logLevel(Et.Verbose, t);
  }
  debug(t) {
    this.logLevel(Et.Debug, t);
  }
  silly(t) {
    this.logLevel(Et.Silly, t);
  }
  logLevel(t, e) {
    const r = typeof e == "string" ? { message: e } : e;
    r.level = t, this.log(r);
  }
  profile(t, e) {
    const r = performance.now();
    if (this.profilers[t]) {
      const i = this.profilers[t];
      delete this.profilers[t];
      const a = e ?? { message: t };
      a.level ?? (a.level = Et.Debug), a.durationMs = r - i, this.log(a);
      return;
    }
    this.profilers[t] = r;
  }
}
var rr;
(function(n) {
  n[n.Playing = 0] = "Playing", n[n.Rendering = 1] = "Rendering", n[n.Paused = 2] = "Paused", n[n.Presenting = 3] = "Presenting";
})(rr || (rr = {}));
function $c(n) {
  const t = {
    version: new Rt("version", 1),
    shared: new de("General", {
      background: new bn("background", null),
      range: new zr("range", [0, 1 / 0]),
      size: new Ni("resolution", new v(1920, 1080)),
      audioOffset: new pn("audio offset", 0)
    }),
    preview: new de("Preview", {
      fps: new pn("frame rate", 30).setPresets(yi).setRange(1),
      resolutionScale: new Le("scale", bi, 1)
    }),
    rendering: new de("Rendering", {
      fps: new pn("frame rate", 60).setPresets(yi).setRange(1),
      resolutionScale: new Le("scale", bi, 1),
      colorSpace: new Le("color space", Lc),
      exporter: new uu("exporter", n)
    })
  };
  return t.shared.audioOffset.disable(!n.audio), t;
}
class Oc extends de {
  constructor(t) {
    super("project", $c(t));
  }
  getFullPreviewSettings() {
    return {
      ...this.shared.get(),
      ...this.preview.get()
    };
  }
  getFullRenderingSettings() {
    return {
      ...this.shared.get(),
      ...this.rendering.get()
    };
  }
}
function Ac() {
  return new de("Application Settings", {
    version: new Rt("version", 1),
    appearance: new de("Appearance", {
      color: new bn("accent color", new ge("#33a6ff")).describe("The accent color for the user interface. (Leave empty to use the default color)"),
      font: new pi("legacy font", !1).describe("Use the 'JetBrains Mono' font for the user interface."),
      coordinates: new pi("coordinates", !0).describe("Display mouse coordinates within the preview window.")
    }),
    defaults: new de("Defaults", {
      background: new bn("background", null).describe("The default background color used in new projects."),
      size: new Ni("resolution", new v(1920, 1080)).describe("The default resolution used in new projects.")
    })
  });
}
function zc(n, t, e, r, i, a, h = r.logger ?? new Mc()) {
  const u = Ac();
  a.attach(u);
  const p = {
    name: n,
    ...r,
    plugins: e,
    versions: t,
    settings: u,
    logger: h
  };
  return p.meta = new Oc(p), p.meta.shared.set(u.defaults.get()), p.experimentalFeatures ?? (p.experimentalFeatures = !1), i.attach(p.meta), p;
}
function Fc(n, t) {
  return {
    level: Et.Error,
    message: n,
    remarks: `<p>This feature requires enabling the <code>experimentalFeatures</code> flag in your project
configuration:</p>
<pre class=""><code class="language-ts"><span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title function_">makeProject</span>({
  <span class="hljs-attr">experimentalFeatures</span>: <span class="hljs-literal">true</span>,
  <span class="hljs-comment">// ...</span>
});</code></pre><p><a href='https://motioncanvas.io/docs/experimental' target='_blank'>Learn more</a> about experimental
features.</p>
`
  };
}
const Ic = 180 / Math.PI, vn = Math.PI / 180;
function wi(n, t, e) {
  let r = 0, i = n;
  e = e === void 0 ? r < i ? 1 : -1 : e;
  const a = [];
  let h = Math.max(Math.ceil((i - r) / e), 0), u = 0;
  for (; h--; )
    a[u++] = r, r += e;
  return a;
}
function Ec(n) {
  const t = Sn(), e = $r();
  return t.timeEvents.register(n, e.time());
}
const Tn = [];
function Oi() {
  const n = Tn.at(-1);
  if (!n)
    throw new Error("The playback is not available in the current context.");
  return n;
}
function _c(n) {
  Tn.push(n);
}
function jc(n) {
  if (Tn.pop() !== n)
    throw new Error("startPlayback/endPlayback were called out of order.");
}
function te(n, ...t) {
  const e = { [n.name]: n }, r = Object.getOwnPropertyDescriptor(e, n.name);
  if (r)
    for (let i = t.length - 1; i >= 0; i--)
      t[i](e, n.name, r);
}
const xi = Symbol.for("@motion-canvas/core/decorators/UNINITIALIZED");
function Or(n) {
  return (t, e) => {
    let r = xi;
    Object.defineProperty(t, e, {
      get() {
        return r === xi && (r = n.call(this)), r;
      }
    });
  };
}
function ot(n) {
  return function(t, e, r) {
    r.value.prototype.name = n ?? e, r.value.prototype.threadable = !0;
  };
}
te(Gt, ot());
function* Gt(...n) {
  for (const t of n)
    yield t;
  yield* Pn(...n);
}
te(Dc, ot());
function* Dc(n, t) {
  yield* Pe(Ec(n)), t && (yield* t);
}
te(Pe, ot());
function* Pe(n = 0, t) {
  const e = $r(), r = Oi().framesToSeconds(1), i = e.time() + n;
  for (; i - r > e.fixed; )
    yield;
  e.time(i), t && (yield* t);
}
te(Ai, ot());
function* Ai() {
}
function Ci(n, t) {
  let e;
  return typeof n == "string" ? (e = t(), Lr(e, n)) : (e = n(), Lr(e, e)), e;
}
te(zi, ot());
function* zi(n, ...t) {
  for (const e of t)
    yield e, yield* Pe(n);
  yield* Pn(...t);
}
function Bc(n) {
  return n && (typeof n == "object" || typeof n == "function") && "toPromise" in n;
}
function Fi(n) {
  return n !== null && typeof n == "object" && Symbol.iterator in n && "next" in n;
}
function Lr(n, t) {
  const e = Object.getPrototypeOf(n);
  e.threadable || (e.threadable = !0, e.name = typeof t == "string" ? t : Ii(t));
}
function Ii(n) {
  return Object.getPrototypeOf(n).name ?? null;
}
class dn {
  get onDeferred() {
    return this.deferred.subscribable;
  }
  /**
   * The fixed time of this thread.
   *
   * @remarks
   * Fixed time is a multiple of the frame duration. It can be used to account
   * for the difference between this thread's {@link time} and the time of the
   * current animation frame.
   */
  get fixed() {
    return this.fixedTime;
  }
  /**
   * Check if this thread or any of its ancestors has been canceled.
   */
  get canceled() {
    var t;
    return this.isCanceled || (((t = this.parent) == null ? void 0 : t.canceled) ?? !1);
  }
  get paused() {
    var t;
    return this.isPaused || (((t = this.parent) == null ? void 0 : t.paused) ?? !1);
  }
  get root() {
    var t;
    return ((t = this.parent) == null ? void 0 : t.root) ?? this;
  }
  constructor(t) {
    this.runner = t, this.deferred = new Wt(), this.children = [], this.time = $e(0), this.parent = null, this.isCanceled = !1, this.isPaused = !1, this.fixedTime = 0, this.queue = [], this.runner.task && (mt().error({
      message: `The generator "${Ii(this.runner)}" is already being executed by another thread.`,
      remarks: `<p>This usually happens when you mistakenly reuse a generator that is already
running.</p>
<p>For example, using <code>yield</code> here will run the opacity generator concurrently and
store it in the <code>task</code> variable (in case you want to cancel or await it later):</p>
<pre class=""><code class="language-ts"><span class="hljs-keyword">const</span> task = <span class="hljs-keyword">yield</span> <span class="hljs-title function_">rect</span>().<span class="hljs-title function_">opacity</span>(<span class="hljs-number">1</span>, <span class="hljs-number">1</span>);</code></pre><p>Trying to <code>yield</code> this task again will cause the current error:</p>
<pre class=""><code class="language-ts"><span class="hljs-keyword">yield</span> task;</code></pre><p>Passing it to other flow functions will also cause the error:</p>
<pre class=""><code class="language-ts"><span class="hljs-keyword">yield</span>* <span class="hljs-title function_">all</span>(task);</code></pre><p>Try to investigate your code looking for <code>yield</code> statements whose return value
is reused in this way. Here&#39;s an example of a common mistake:</p>
<pre class="wrong"><code class="language-ts"><span class="hljs-keyword">yield</span>* <span class="hljs-title function_">all</span>(
  <span class="hljs-keyword">yield</span> <span class="hljs-title function_">rect</span>().<span class="hljs-title function_">opacity</span>(<span class="hljs-number">1</span>, <span class="hljs-number">1</span>), 
  <span class="hljs-keyword">yield</span> <span class="hljs-title function_">rect</span>().<span class="hljs-title function_">x</span>(<span class="hljs-number">200</span>, <span class="hljs-number">1</span>),
);</code></pre><pre class="correct"><code class="language-ts"><span class="hljs-keyword">yield</span>* <span class="hljs-title function_">all</span>(
  <span class="hljs-title function_">rect</span>().<span class="hljs-title function_">opacity</span>(<span class="hljs-number">1</span>, <span class="hljs-number">1</span>), 
  <span class="hljs-title function_">rect</span>().<span class="hljs-title function_">x</span>(<span class="hljs-number">200</span>, <span class="hljs-number">1</span>),
);</code></pre>`
    }), this.runner = Ai()), this.runner.task = this;
  }
  /**
   * Progress the wrapped generator once.
   */
  next() {
    if (this.paused)
      return {
        value: null,
        done: !1
      };
    gi(this);
    const t = this.runner.next(this.value);
    return vi(this), this.value = null, t;
  }
  /**
   * Prepare the thread for the next update cycle.
   *
   * @param dt - The delta time of the next cycle.
   */
  update(t) {
    this.paused || (this.time(this.time() + t), this.fixedTime += t), this.children = this.children.filter((e) => !e.canceled);
  }
  spawn(t) {
    return Fi(t) || (t = t()), this.queue.push(t), t;
  }
  add(t) {
    t.parent = this, t.isCanceled = !1, t.time(this.time()), t.fixedTime = this.fixedTime, this.children.push(t), Lr(t.runner, `unknown ${this.children.length}`);
  }
  drain(t) {
    this.queue.forEach(t), this.queue = [];
  }
  cancel() {
    this.deferred.clear(), this.runner.return(), this.isCanceled = !0, this.parent = null, this.drain((t) => t.return());
  }
  pause(t) {
    this.isPaused = t;
  }
  runDeferred() {
    gi(this), this.deferred.dispatch(), vi(this);
  }
}
te(Pn, ot());
function* Pn(n, ...t) {
  let e = !0;
  typeof n == "boolean" ? e = n : t.push(n);
  const r = $r(), i = t.map((u) => r.children.find((p) => p.runner === u)).filter((u) => u), a = r.time();
  let h;
  if (e) {
    for (; i.find((u) => !u.canceled); )
      yield;
    h = Math.max(...i.map((u) => u.time()));
  } else {
    for (; !i.find((p) => p.canceled); )
      yield;
    const u = i.filter((p) => p.canceled);
    h = Math.min(...u.map((p) => p.time()));
  }
  r.time(Math.max(a, h));
}
function Nc(n) {
  return typeof (n == null ? void 0 : n.then) == "function";
}
te(Ei, ot());
function* Ei(n, t) {
  const e = Oi(), r = n();
  Lr(r, "root");
  const i = new dn(r);
  t == null || t(i);
  let a = [i];
  for (; a.length > 0; ) {
    const h = [], u = [...a], p = e.deltaTime;
    for (; u.length > 0; ) {
      const y = u.pop();
      if (!y || y.canceled)
        continue;
      const C = y.next();
      if (C.done) {
        y.cancel();
        continue;
      }
      if (Fi(C.value)) {
        const z = new dn(C.value);
        y.value = C.value, y.add(z), u.push(y), u.push(z);
      } else C.value ? (y.value = yield C.value, u.push(y)) : (y.update(p), y.drain((z) => {
        const j = new dn(z);
        y.add(j), h.unshift(j);
      }), h.unshift(y));
    }
    a = [];
    for (const y of h)
      y.canceled || (a.push(y), y.runDeferred());
    a.length > 0 && (yield);
  }
}
var Ut;
(function(n) {
  n[n.BeforeRender = 0] = "BeforeRender", n[n.BeginRender = 1] = "BeginRender", n[n.FinishRender = 2] = "FinishRender", n[n.AfterRender = 3] = "AfterRender";
})(Ut || (Ut = {}));
class Wc {
  get onBeforeRender() {
    return this.beforeRender.subscribable;
  }
  get onBeginRender() {
    return this.beginRender.subscribable;
  }
  get onFinishRender() {
    return this.finishRender.subscribable;
  }
  get onAfterRender() {
    return this.afterRender.subscribable;
  }
  constructor(t) {
    this.scene = t, this.beforeRender = new Wt(), this.beginRender = new Wt(), this.finishRender = new Wt(), this.afterRender = new Wt(), this.scene.onRenderLifecycle.subscribe(([e, r]) => {
      switch (e) {
        case Ut.BeforeRender:
          return this.beforeRender.dispatch(r);
        case Ut.BeginRender:
          return this.beginRender.dispatch(r);
        case Ut.FinishRender:
          return this.finishRender.dispatch(r);
        case Ut.AfterRender:
          return this.afterRender.dispatch(r);
      }
    }), this.scene.onReset.subscribe(() => {
      this.beforeRender.clear(), this.beginRender.clear(), this.finishRender.clear(), this.afterRender.clear();
    });
  }
}
class nr {
  constructor(t) {
    this.state = t, this.nextGauss = null;
  }
  /**
   * @internal
   */
  static createSeed() {
    return Math.floor(Math.random() * 4294967296);
  }
  /**
   * Get the next random float in the given range.
   *
   * @param from - The start of the range.
   * @param to - The end of the range.
   */
  nextFloat(t = 0, e = 1) {
    return et(t, e, this.next());
  }
  /**
   * Get the next random integer in the given range.
   *
   * @param from - The start of the range.
   * @param to - The end of the range. Exclusive.
   */
  nextInt(t = 0, e = 4294967296) {
    let r = Math.floor(et(t, e, this.next()));
    return r === e && (r = t), r;
  }
  /**
   * Get a random float from a gaussian distribution.
   * @param mean - The mean of the distribution.
   * @param stdev - The standard deviation of the distribution.
   */
  gauss(t = 0, e = 1) {
    let r = this.nextGauss;
    if (this.nextGauss = null, r === null) {
      const i = this.next() * 2 * Math.PI, a = Math.sqrt(-2 * Math.log(1 - this.next()));
      r = Math.cos(i) * a, this.nextGauss = Math.sin(i) * a;
    }
    return t + r * e;
  }
  /**
   * Get an array filled with random floats in the given range.
   *
   * @param size - The size of the array.
   * @param from - The start of the range.
   * @param to - The end of the range.
   */
  floatArray(t, e = 0, r = 1) {
    return wi(t).map(() => this.nextFloat(e, r));
  }
  /**
   Get an array filled with random integers in the given range.
   *
   * @param size - The size of the array.
   * @param from - The start of the range.
   * @param to - The end of the range. Exclusive.
   */
  intArray(t, e = 0, r = 4294967296) {
    return wi(t).map(() => this.nextInt(e, r));
  }
  /**
   * Create a new independent generator.
   */
  spawn() {
    return new nr(this.nextInt());
  }
  next() {
    this.state |= 0, this.state = this.state + 1831565813 | 0;
    let t = Math.imul(this.state ^ this.state >>> 15, 1 | this.state);
    return t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t, ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}
var vt;
(function(n) {
  n[n.Initial = 0] = "Initial", n[n.AfterTransitionIn = 1] = "AfterTransitionIn", n[n.CanTransitionOut = 2] = "CanTransitionOut", n[n.Finished = 3] = "Finished";
})(vt || (vt = {}));
const Uc = "resolution", qc = "destinationTexture", Gc = "sourceTexture", Si = "time", Xc = "deltaTime", Hc = "framerate", Yc = "sourceMatrix", Zc = "destinationMatrix", Jc = `#version 300 es

in vec2 position;

out vec2 screenUV;
out vec2 sourceUV;
out vec2 destinationUV;

uniform mat4 sourceMatrix;
uniform mat4 destinationMatrix;

void main() {
    vec2 position_source = position * 0.5 + 0.5;
    vec4 position_screen = sourceMatrix * vec4(position_source, 0, 1);

    screenUV = position_screen.xy;
    sourceUV = position_source;
    destinationUV = (destinationMatrix * position_screen).xy;

    gl_Position = (position_screen - 0.5) * 2.0;
}
`;
class Vc {
  constructor(t, e) {
    this.scene = t, this.sharedContext = e, this.gl = null, this.positionBuffer = null, this.sourceTexture = null, this.destinationTexture = null, this.positionLocation = 0, this.quadPositions = new Float32Array([
      -1,
      1,
      -1,
      -1,
      1,
      1,
      1,
      -1
    ]), this.handleReload = () => {
      this.gl && this.updateViewport();
    }, t.onReloaded.subscribe(this.handleReload);
  }
  setup(t) {
    this.gl = t, this.updateViewport(), this.positionBuffer = t.createBuffer(), t.bindBuffer(t.ARRAY_BUFFER, this.positionBuffer), t.bufferData(t.ARRAY_BUFFER, this.quadPositions, t.STATIC_DRAW), t.vertexAttribPointer(this.positionLocation, 2, t.FLOAT, !1, 0, 0), t.enableVertexAttribArray(this.positionLocation), this.sourceTexture = t.createTexture(), t.activeTexture(t.TEXTURE0), t.bindTexture(t.TEXTURE_2D, this.sourceTexture), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), this.destinationTexture = t.createTexture(), t.activeTexture(t.TEXTURE1), t.bindTexture(t.TEXTURE_2D, this.destinationTexture), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE);
  }
  teardown(t) {
    t.deleteBuffer(this.positionBuffer), t.disableVertexAttribArray(this.positionLocation), t.deleteTexture(this.sourceTexture), t.deleteTexture(this.destinationTexture), this.positionBuffer = null, this.sourceTexture = null, this.destinationTexture = null, this.gl = null;
  }
  updateViewport() {
    if (this.gl) {
      const t = this.scene.getRealSize();
      this.gl.canvas.width = t.width, this.gl.canvas.height = t.height, this.gl.viewport(0, 0, t.width, t.height);
    }
  }
  getGL() {
    return this.gl ?? this.sharedContext.borrow(this);
  }
  getProgram(t) {
    const e = this.sharedContext.getProgram(t, Jc);
    if (!e)
      return null;
    const r = this.scene.getRealSize(), i = this.getGL();
    return i.useProgram(e), i.uniform1i(i.getUniformLocation(e, Gc), 0), i.uniform1i(i.getUniformLocation(e, qc), 1), i.uniform2f(i.getUniformLocation(e, Uc), r.x, r.y), i.uniform1f(i.getUniformLocation(e, Xc), this.scene.playback.deltaTime), i.uniform1f(i.getUniformLocation(e, Hc), this.scene.playback.fps), e;
  }
  copyTextures(t, e) {
    this.copyTexture(e, this.sourceTexture), this.copyTexture(t, this.destinationTexture);
  }
  clear() {
    const t = this.getGL();
    t.clearColor(0, 0, 0, 0), t.clear(t.COLOR_BUFFER_BIT);
  }
  render() {
    const t = this.getGL();
    t.drawArrays(t.TRIANGLE_STRIP, 0, 4);
  }
  copyTexture(t, e) {
    const r = this.getGL();
    r.bindTexture(r.TEXTURE_2D, e), r.texImage2D(r.TEXTURE_2D, 0, r.RGBA, r.RGBA, r.UNSIGNED_BYTE, t), r.generateMipmap(r.TEXTURE_2D);
  }
}
class Qc {
  get onChanged() {
    return this.slides.subscribable;
  }
  constructor(t) {
    this.scene = t, this.slides = new pe([]), this.lookup = /* @__PURE__ */ new Map(), this.collisionLookup = /* @__PURE__ */ new Set(), this.current = null, this.canResume = !1, this.waitsForId = null, this.targetId = null, this.handleReload = () => {
      this.lookup.clear(), this.collisionLookup.clear(), this.current = null, this.waitsForId = null, this.targetId = null;
    }, this.handleReset = () => {
      this.collisionLookup.clear(), this.current = null, this.waitsForId = null;
    }, this.handleRecalculated = () => {
      this.slides.current = [...this.lookup.values()];
    }, this.scene.onReloaded.subscribe(this.handleReload), this.scene.onReset.subscribe(this.handleReset), this.scene.onRecalculated.subscribe(this.handleRecalculated);
  }
  setTarget(t) {
    this.targetId = t;
  }
  resume() {
    this.canResume = !0;
  }
  isWaitingFor(t) {
    return this.waitsForId === t;
  }
  isWaiting() {
    return this.waitsForId !== null;
  }
  didHappen(t) {
    var e;
    if (this.current === null)
      return !1;
    for (const r of this.lookup.keys()) {
      if (r === t)
        return !0;
      if (r === ((e = this.current) == null ? void 0 : e.id))
        return !1;
    }
    return !1;
  }
  getCurrent() {
    return this.current;
  }
  register(t, e) {
    if (this.waitsForId !== null)
      throw new Error(`The animation already waits for a slide: ${this.waitsForId}.`);
    const r = this.toId(t);
    this.scene.playback.state !== rr.Presenting && (this.lookup.has(r) || this.lookup.set(r, {
      id: r,
      name: t,
      time: e,
      scene: this.scene,
      stack: new Error().stack
    }), this.collisionLookup.has(t) ? this.scene.logger.warn({
      message: `A slide named "${t}" already exists.`,
      stack: new Error().stack
    }) : this.collisionLookup.add(t)), this.waitsForId = r, this.current = this.lookup.get(r) ?? null, this.canResume = !1;
  }
  shouldWait(t) {
    const e = this.toId(t);
    if (this.waitsForId !== e)
      throw new Error(`The animation waits for a different slide: ${this.waitsForId}.`);
    if (!this.lookup.get(e))
      throw new Error(`Could not find the "${t}" slide.`);
    let i = this.canResume;
    return this.scene.playback.state !== rr.Presenting && (i = e !== this.targetId), i && (this.waitsForId = null), !i;
  }
  toId(t) {
    return `${this.scene.name}:${t}`;
  }
}
class Kc {
  constructor(t) {
    this.scene = t, this.signals = {}, this.variables = {}, this.handleReset = () => {
      this.signals = {};
    }, t.onReset.subscribe(this.handleReset);
  }
  /**
   * Get variable signal if exists or create signal if not
   *
   * @param name - The name of the variable.
   * @param initial - The initial value of the variable. It will be used if the
   *                  variable was not configured from the outside.
   */
  get(t, e) {
    var r;
    return (r = this.signals)[t] ?? (r[t] = $e(this.variables[t] ?? e)), () => this.signals[t]();
  }
  /**
   * Update all signals with new project variable values.
   */
  updateSignals(t) {
    this.variables = t, Object.keys(t).map((e) => {
      e in this.signals && this.signals[e](t[e]);
    });
  }
}
class tu {
  get firstFrame() {
    return this.cache.current.firstFrame;
  }
  get lastFrame() {
    return this.firstFrame + this.cache.current.duration;
  }
  get onCacheChanged() {
    return this.cache.subscribable;
  }
  get onReloaded() {
    return this.reloaded.subscribable;
  }
  get onRecalculated() {
    return this.recalculated.subscribable;
  }
  get onThreadChanged() {
    return this.thread.subscribable;
  }
  get onRenderLifecycle() {
    return this.renderLifecycle.subscribable;
  }
  get onReset() {
    return this.afterReset.subscribable;
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  get LifecycleEvents() {
    return this.logger.warn("LifecycleEvents is deprecated. Use lifecycleEvents instead."), this.lifecycleEvents;
  }
  get previous() {
    return this.previousScene;
  }
  constructor(t) {
    this.cache = new pe({
      firstFrame: 0,
      transitionDuration: 0,
      duration: 0,
      lastFrame: 0
    }), this.reloaded = new Wt(), this.recalculated = new Wt(), this.thread = new pe(null), this.renderLifecycle = new Wt(), this.afterReset = new Wt(), this.lifecycleEvents = new Wc(this), this.previousScene = null, this.runner = null, this.state = vt.Initial, this.cached = !1, this.counters = {}, this.name = t.name, this.size = t.size, this.resolutionScale = t.resolutionScale, this.logger = t.logger, this.playback = t.playback, this.meta = t.meta, this.runnerFactory = t.config, this.creationStack = t.stack, this.experimentalFeatures = t.experimentalFeatures ?? !1, te(this.runnerFactory, ot(this.name)), this.timeEvents = new t.timeEventsClass(this), this.variables = new Kc(this), this.shaders = new Vc(this, t.sharedWebGLContext), this.slides = new Qc(this), this.random = new nr(this.meta.seed.get()), this.previousOnTop = !1;
  }
  /**
   * Update the view.
   *
   * Invoked after each step of the main generator.
   * Can be used for calculating layout.
   *
   * Can modify the state of the view.
   */
  update() {
  }
  async render(t) {
    let e = 0;
    do
      e++, await ut.consumePromises(), t.save(), t.clearRect(0, 0, t.canvas.width, t.canvas.height), this.execute(() => this.draw(t)), t.restore();
    while (ut.hasPromises() && e < 10);
    e > 1 && this.logger.debug(`render iterations: ${e}`);
  }
  reload({ config: t, size: e, stack: r, resolutionScale: i } = {}) {
    t && (this.runnerFactory = t), e && (this.size = e), i && (this.resolutionScale = i), r && (this.creationStack = r), this.cached = !1, this.reloaded.dispatch();
  }
  async recalculate(t) {
    const e = this.cache.current;
    if (e.firstFrame = this.playback.frame, e.lastFrame = e.firstFrame + e.duration, this.isCached()) {
      t(e.lastFrame), this.cache.current = { ...e };
      return;
    }
    for (e.transitionDuration = -1, await this.reset(); !this.canTransitionOut(); )
      e.transitionDuration < 0 && this.state === vt.AfterTransitionIn && (e.transitionDuration = this.playback.frame - e.firstFrame), t(this.playback.frame + 1), await this.next();
    e.transitionDuration === -1 && (e.transitionDuration = 0), e.lastFrame = this.playback.frame, e.duration = e.lastFrame - e.firstFrame, await new Promise((r) => setTimeout(r, 0)), this.cached = !0, this.cache.current = { ...e }, this.recalculated.dispatch();
  }
  async next() {
    var e;
    if (!this.runner)
      return;
    let t = this.execute(() => this.runner.next());
    for (this.update(); t.value; ) {
      if (Bc(t.value)) {
        const r = await t.value.toPromise();
        t = this.execute(() => this.runner.next(r));
      } else if (Nc(t.value)) {
        const r = await t.value;
        t = this.execute(() => this.runner.next(r));
      } else
        this.logger.warn({
          message: "Invalid value yielded by the scene.",
          object: t.value
        }), t = this.execute(() => this.runner.next(t.value));
      this.update();
    }
    if (ut.hasPromises()) {
      const r = await ut.consumePromises();
      this.logger.error({
        message: "Tried to access an asynchronous property before the node was ready. Make sure to yield the node before accessing the property.",
        stack: r[0].stack,
        inspect: ((e = r[0].owner) == null ? void 0 : e.key) ?? void 0
      });
    }
    t.done && (this.state = vt.Finished);
  }
  async reset(t = null) {
    this.counters = {}, this.previousScene = t, this.previousOnTop = !1, this.random = new nr(this.meta.seed.get()), this.runner = Ei(() => this.runnerFactory(this.getView()), (e) => {
      this.thread.current = e;
    }), this.state = vt.AfterTransitionIn, this.afterReset.dispatch(), await this.next();
  }
  getSize() {
    return this.size;
  }
  getRealSize() {
    return this.size.mul(this.resolutionScale);
  }
  isAfterTransitionIn() {
    return this.state === vt.AfterTransitionIn;
  }
  canTransitionOut() {
    return this.state === vt.CanTransitionOut || this.state === vt.Finished;
  }
  isFinished() {
    return this.state === vt.Finished;
  }
  enterInitial() {
    this.state === vt.AfterTransitionIn ? this.state = vt.Initial : this.logger.warn(`Scene ${this.name} entered initial in an unexpected state: ${this.state}`);
  }
  enterAfterTransitionIn() {
    this.state === vt.Initial ? this.state = vt.AfterTransitionIn : this.logger.warn(`Scene ${this.name} transitioned in an unexpected state: ${this.state}`);
  }
  enterCanTransitionOut() {
    this.state === vt.AfterTransitionIn || this.state === vt.Initial ? this.state = vt.CanTransitionOut : this.logger.warn(`Scene ${this.name} was marked as finished in an unexpected state: ${this.state}`);
  }
  isCached() {
    return this.cached;
  }
  /**
   * Invoke the given callback in the context of this scene.
   *
   * @remarks
   * This method makes sure that the context of this scene is globally available
   * during the execution of the callback.
   *
   * @param callback - The callback to invoke.
   */
  execute(t) {
    let e;
    Tc(this), _c(this.playback);
    try {
      e = t();
    } finally {
      jc(this.playback), Pc(this);
    }
    return e;
  }
}
function eu() {
  return new de("scene", {
    version: new Rt("version", 1),
    timeEvents: new Rt("time events", []),
    seed: new Rt("seed", nr.createSeed())
  });
}
function _i(n, t, e) {
  const r = [...n], i = [...t];
  if (i.length >= r.length) {
    const a = Math.floor(i.length * e), h = Math.floor(et(r.length - 1, i.length, e));
    let u = "";
    for (let p = 0; p < i.length; p++)
      p < a ? u += i[p] : (r[p] || p <= h) && (u += r[p] ?? i[p]);
    return u;
  } else {
    const a = Math.round(r.length * (1 - e)), h = Math.floor(et(r.length + 1, i.length, e)), u = [];
    for (let p = r.length - 1; p >= 0; p--)
      p < a ? u.unshift(r[p]) : (i[p] || p < h) && u.unshift(i[p] ?? r[p]);
    return u.join("");
  }
}
function Ye(n, t, e, r = !1) {
  if (e === 0)
    return n;
  if (e === 1)
    return t;
  if (n == null || t == null) {
    r || mt().warn(`Attempting to lerp ${n} -> ${t} may result in unexpected behavior.`);
    return;
  }
  if (typeof n == "number" && typeof t == "number")
    return et(n, t, e);
  if (typeof n == "string" && typeof t == "string")
    return _i(n, t, e);
  if (typeof n == "boolean" && typeof t == "boolean")
    return e < 0.5 ? n : t;
  if ("lerp" in n)
    return n.lerp(t, e);
  if (n && t && typeof n == "object" && typeof t == "object")
    if (Array.isArray(n) && Array.isArray(t)) {
      if (n.length === t.length)
        return n.map((i, a) => Ye(i, t[a], e));
    } else {
      let i = !1;
      if (!(n instanceof Map) && !(t instanceof Map) && (i = !0, n = new Map(Object.entries(n)), t = new Map(Object.entries(t))), n instanceof Map && t instanceof Map) {
        const a = /* @__PURE__ */ new Map();
        for (const h of /* @__PURE__ */ new Set([...n.keys(), ...t.keys()])) {
          const u = Ye(n.get(h), t.get(h), e, !0);
          u !== void 0 && a.set(h, u);
        }
        return i ? Object.fromEntries(a) : a;
      }
    }
  return t;
}
function ru(n, t, e) {
  return e < 0.5 ? n : t;
}
function et(n, t, e) {
  return n + (t - n) * e;
}
function nu(n, t, e, r, i) {
  return e + (i - n) * (r - e) / (t - n);
}
function xt(n, t, e) {
  return e < n ? n : e > t ? t : e;
}
function ji(n, t, e) {
  let r = t;
  e > 1 ? e = 1 / e : r = !r;
  const i = r ? Math.acos(xt(-1, 1, 1 - n)) : Math.asin(n), a = et(i, et(0, Math.PI / 2, n), e);
  let h = Math.sin(a), u = 1 - Math.cos(a);
  return t && ([h, u] = [u, h]), new v(h, u);
}
function Nt(n, t = 0, e = 1) {
  return n = n < 0.5 ? 4 * n * n * n : 1 - Math.pow(-2 * n + 2, 3) / 2, et(t, e, n);
}
function su(n, t = 0, e = 1) {
  return n = n === 1 ? 1 : 1 - Math.pow(2, -10 * n), et(t, e, n);
}
function iu(n, t = 0, e = 1) {
  return et(t, e, n);
}
te(jt, ot());
function* jt(n, t, e) {
  const r = $r(), i = r.time(), a = r.time() + n;
  for (t(0, 0); a > r.fixed; ) {
    const h = r.fixed - i, u = h / n;
    h > 0 && t(u, h), yield;
  }
  r.time(a), t(1, n), e == null || e(1, n);
}
class ut {
  static collectPromise(t, e = null) {
    const r = {
      promise: t,
      value: e,
      stack: new Error().stack
    }, i = this.collectionStack.at(-1);
    return i && (r.owner = i.owner), t.then((a) => {
      r.value = a, i == null || i.markDirty();
    }), this.promises.push(r), r;
  }
  static hasPromises() {
    return this.promises.length > 0;
  }
  static async consumePromises() {
    const t = [...this.promises];
    return await Promise.all(t.map((e) => e.promise)), this.promises = this.promises.filter((e) => !t.includes(e)), t;
  }
  constructor(t) {
    this.owner = t, this.dependencies = /* @__PURE__ */ new Set(), this.event = new xc(), this.markDirty = () => this.event.raise(), this.invokable = this.invoke.bind(this), Object.defineProperty(this.invokable, "context", {
      value: this
    }), Object.defineProperty(this.invokable, "toPromise", {
      value: this.toPromise.bind(this)
    });
  }
  invoke() {
  }
  startCollecting() {
    if (ut.collectionSet.has(this))
      throw new Mi("A circular dependency occurred between signals.", `This can happen when signals reference each other in a loop.
        Try using the attached stack trace to locate said loop.`);
    ut.collectionSet.add(this), ut.collectionStack.push(this);
  }
  finishCollecting() {
    if (ut.collectionSet.delete(this), ut.collectionStack.pop() !== this)
      throw new Error("collectStart/collectEnd was called out of order.");
  }
  clearDependencies() {
    this.dependencies.forEach((t) => t.unsubscribe(this.markDirty)), this.dependencies.clear();
  }
  collect() {
    const t = ut.collectionStack.at(-1);
    t && (t.dependencies.add(this.event.subscribable), this.event.subscribe(t.markDirty));
  }
  dispose() {
    this.clearDependencies(), this.event.clear(), this.owner = null;
  }
  async toPromise() {
    do
      await ut.consumePromises(), this.invokable();
    while (ut.hasPromises());
    return this.invokable;
  }
}
ut.collectionSet = /* @__PURE__ */ new Set();
ut.collectionStack = [];
ut.promises = [];
const He = Symbol.for("@motion-canvas/core/signals/default");
function Qt(n) {
  return typeof n == "function";
}
function Re(n, t) {
  return Qt(n) ? () => t(n()) : t(n);
}
function Xt(n) {
  return Qt(n) ? n() : n;
}
class Me extends ut {
  constructor(t, e, r = void 0, i = (h) => h, a = {}) {
    super(r), this.initial = t, this.interpolation = e, this.parser = i, this.tweening = !1, Object.defineProperty(this.invokable, "reset", {
      value: this.reset.bind(this)
    }), Object.defineProperty(this.invokable, "save", {
      value: this.save.bind(this)
    }), Object.defineProperty(this.invokable, "isInitial", {
      value: this.isInitial.bind(this)
    }), this.initial !== void 0 && (this.current = this.initial, this.markDirty(), Qt(this.initial) || (this.last = this.parse(this.initial))), this.extensions = {
      getter: this.getter.bind(this),
      setter: this.setter.bind(this),
      tweener: this.tweener.bind(this),
      ...a
    };
  }
  toSignal() {
    return this.invokable;
  }
  parse(t) {
    return this.parser(t);
  }
  set(t) {
    return this.extensions.setter(t), this.owner;
  }
  setter(t) {
    return t === He && (t = this.initial), this.current === t ? this.owner : (this.current = t, this.clearDependencies(), Qt(t) || (this.last = this.parse(t)), this.markDirty(), this.owner);
  }
  get() {
    return this.extensions.getter();
  }
  getter() {
    var t;
    if (this.event.isRaised() && Qt(this.current)) {
      this.clearDependencies(), this.startCollecting();
      try {
        this.last = this.parse(this.current());
      } catch (e) {
        mt().error({
          ...$i(e),
          inspect: (t = this.owner) == null ? void 0 : t.key
        });
      }
      this.finishCollecting();
    }
    return this.event.reset(), this.collect(), this.last;
  }
  invoke(t, e, r = Nt, i = this.interpolation) {
    return t === void 0 ? this.get() : e === void 0 ? this.set(t) : this.createQueue(r, i).to(t, e);
  }
  createQueue(t, e) {
    const r = this.get(), i = [], a = Ci("animation chain", function* () {
      for (; i.length > 0; )
        yield* i.shift();
    });
    return a.to = (h, u, p = t, y = e) => (t = p, e = y, i.push(this.tween(h, u, p, y)), a), a.back = (h, u = t, p = e) => (t = u, e = p, i.push(this.tween(r, h, t, e)), a), a.wait = (h) => (i.push(Pe(h)), a), a.run = (h) => (i.push(h), a), a.do = (h) => (i.push(Ci(function* () {
      h();
    })), a), a;
  }
  *tween(t, e, r, i) {
    t === He && (t = this.initial), this.tweening = !0, yield* this.extensions.tweener(t, e, r, i), this.set(t), this.tweening = !1;
  }
  *tweener(t, e, r, i) {
    const a = this.get();
    yield* jt(e, (h) => {
      this.set(i(a, this.parse(Xt(t)), r(h)));
    });
  }
  dispose() {
    super.dispose(), this.initial = void 0, this.current = void 0, this.last = void 0;
  }
  /**
   * Reset the signal to its initial value (if one has been set).
   *
   * @example
   * ```ts
   * const signal = createSignal(7);
   *
   * signal.reset();
   * // same as:
   * signal(7);
   * ```
   */
  reset() {
    return this.initial !== void 0 && this.set(this.initial), this.owner;
  }
  /**
   * Compute the current value of the signal and immediately set it.
   *
   * @remarks
   * This method can be used to stop the signal from updating while keeping its
   * current value.
   *
   * @example
   * ```ts
   * signal.save();
   * // same as:
   * signal(signal());
   * ```
   */
  save() {
    return this.set(this.get());
  }
  /**
   * Check if the signal is currently using its initial value.
   *
   * @example
   * ```ts
   *
   * const signal = createSignal(0);
   * signal.isInitial(); // true
   *
   * signal(5);
   * signal.isInitial(); // false
   *
   * signal(DEFAULT);
   * signal.isInitial(); // true
   * ```
   */
  isInitial() {
    return this.collect(), this.current === this.initial;
  }
  /**
   * Get the initial value of this signal.
   */
  getInitial() {
    return this.initial;
  }
  /**
   * Get the raw value of this signal.
   *
   * @remarks
   * If the signal was provided with a factory function, the function itself
   * will be returned, without invoking it.
   *
   * This method can be used to create copies of signals.
   *
   * @example
   * ```ts
   * const a = createSignal(2);
   * const b = createSignal(() => a);
   * // b() == 2
   *
   * const bClone = createSignal(b.raw());
   * // bClone() == 2
   *
   * a(4);
   * // b() == 4
   * // bClone() == 4
   * ```
   */
  raw() {
    return this.current;
  }
  /**
   * Is the signal undergoing a tween?
   */
  isTweening() {
    return this.tweening;
  }
}
class Ar extends Me {
  constructor(t, e, r, i, a = void 0, h = {}) {
    var u;
    super(void 0, i, a, e, h), this.entries = t, this.signals = [], this.parser = e;
    for (const p of t) {
      let y, C;
      Array.isArray(p) ? ([y, C] = p, (u = C.context).owner ?? (u.owner = this)) : (y = p, C = new Me(Re(r, (z) => e(z)[p]), et, a ?? this.invokable).toSignal()), this.signals.push([y, C]), Object.defineProperty(this.invokable, y, { value: C });
    }
  }
  toSignal() {
    return this.invokable;
  }
  parse(t) {
    return this.parser(t);
  }
  getter() {
    return this.parse(Object.fromEntries(this.signals.map(([t, e]) => [t, e()])));
  }
  setter(t) {
    if (Qt(t))
      for (const [e, r] of this.signals)
        r(() => this.parser(t())[e]);
    else {
      const e = this.parse(t);
      for (const [r, i] of this.signals)
        i(e[r]);
    }
    return this.owner;
  }
  reset() {
    for (const [, t] of this.signals)
      t.reset();
    return this.owner;
  }
  save() {
    for (const [, t] of this.signals)
      t.save();
    return this.owner;
  }
  isInitial() {
    for (const [, t] of this.signals)
      if (!t.isInitial())
        return !1;
    return !0;
  }
  raw() {
    return Object.fromEntries(this.signals.map(([t, e]) => [t, e.context.raw()]));
  }
}
class au extends ut {
  constructor(t, e) {
    super(e), this.factory = t, this.markDirty();
  }
  toSignal() {
    return this.invokable;
  }
  dispose() {
    super.dispose(), this.last = void 0;
  }
  invoke(...t) {
    var e;
    if (this.event.isRaised()) {
      this.clearDependencies(), this.startCollecting();
      try {
        this.last = this.factory(...t);
      } catch (r) {
        mt().error({
          ...$i(r),
          inspect: (e = this.owner) == null ? void 0 : e.key
        });
      }
      this.finishCollecting();
    }
    return this.event.reset(), this.collect(), this.last;
  }
}
class Di extends Ar {
  constructor(t, e, r, i, a = void 0, h = {}) {
    super(t, e, r, i, a, h), Object.defineProperty(this.invokable, "edit", {
      value: this.edit.bind(this)
    }), Object.defineProperty(this.invokable, "mul", {
      value: this.mul.bind(this)
    }), Object.defineProperty(this.invokable, "div", {
      value: this.div.bind(this)
    }), Object.defineProperty(this.invokable, "add", {
      value: this.add.bind(this)
    }), Object.defineProperty(this.invokable, "sub", {
      value: this.sub.bind(this)
    }), Object.defineProperty(this.invokable, "dot", {
      value: this.dot.bind(this)
    }), Object.defineProperty(this.invokable, "cross", {
      value: this.cross.bind(this)
    }), Object.defineProperty(this.invokable, "mod", {
      value: this.mod.bind(this)
    });
  }
  toSignal() {
    return this.invokable;
  }
  edit(t, e, r, i) {
    const a = t(this.get());
    return this.invoke(a, e, r, i);
  }
  mul(t, e, r, i) {
    const a = (h) => h.mul(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
  div(t, e, r, i) {
    const a = (h) => h.div(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
  add(t, e, r, i) {
    const a = (h) => h.add(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
  sub(t, e, r, i) {
    const a = (h) => h.sub(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
  dot(t, e, r, i) {
    const a = (h) => h.dot(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
  cross(t, e, r, i) {
    const a = (h) => h.cross(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
  mod(t, e, r, i) {
    const a = (h) => h.mod(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
}
function ou(n, t) {
  return new au(n, t).toSignal();
}
function $e(n, t = Ye, e) {
  return new Me(n, t, e).toSignal();
}
class _t {
  static createSignal(t, e = _t.lerp) {
    return new Ar(["top", "right", "bottom", "left"], (r) => new _t(r), t, e).toSignal();
  }
  static lerp(t, e, r) {
    return new _t(et(t.top, e.top, r), et(t.right, e.right, r), et(t.bottom, e.bottom, r), et(t.left, e.left, r));
  }
  get x() {
    return this.left + this.right;
  }
  get y() {
    return this.top + this.bottom;
  }
  constructor(t = 0, e, r, i) {
    if (this.top = 0, this.right = 0, this.bottom = 0, this.left = 0, t != null) {
      if (Array.isArray(t) && (i = t[3], r = t[2], e = t[1], t = t[0]), typeof t == "number") {
        this.top = t, this.right = e !== void 0 ? e : t, this.bottom = r !== void 0 ? r : t, this.left = i !== void 0 ? i : e !== void 0 ? e : t;
        return;
      }
      this.top = t.top, this.right = t.right, this.bottom = t.bottom, this.left = t.left;
    }
  }
  lerp(t, e) {
    return _t.lerp(this, t, e);
  }
  scale(t) {
    return new _t(this.top * t, this.right * t, this.bottom * t, this.left * t);
  }
  addScalar(t) {
    return new _t(this.top + t, this.right + t, this.bottom + t, this.left + t);
  }
  toSymbol() {
    return _t.symbol;
  }
  toString() {
    return `Spacing(${this.top}, ${this.right}, ${this.bottom}, ${this.left})`;
  }
  toUniform(t, e) {
    t.uniform4f(e, this.top, this.right, this.bottom, this.left);
  }
  serialize() {
    return {
      top: this.top,
      right: this.right,
      bottom: this.bottom,
      left: this.left
    };
  }
}
_t.symbol = Symbol.for("@motion-canvas/core/types/Spacing");
const tr = 1e-6;
class it {
  static fromRotation(t) {
    return it.identity.rotate(t);
  }
  static fromTranslation(t) {
    return it.identity.translate(new v(t));
  }
  static fromScaling(t) {
    return it.identity.scale(new v(t));
  }
  get x() {
    return new v(this.values[0], this.values[1]);
  }
  get y() {
    return new v(this.values[2], this.values[3]);
  }
  get scaleX() {
    return this.values[0];
  }
  set scaleX(t) {
    this.values[0] = this.x.normalized.scale(t).x;
  }
  get skewX() {
    return this.values[1];
  }
  set skewX(t) {
    this.values[1] = t;
  }
  get scaleY() {
    return this.values[3];
  }
  set scaleY(t) {
    this.values[3] = this.y.normalized.scale(t).y;
  }
  get skewY() {
    return this.values[2];
  }
  set skewY(t) {
    this.values[2] = t;
  }
  get translateX() {
    return this.values[4];
  }
  set translateX(t) {
    this.values[4] = t;
  }
  get translateY() {
    return this.values[5];
  }
  set translateY(t) {
    this.values[5] = t;
  }
  get rotation() {
    return v.degrees(this.values[0], this.values[1]);
  }
  set rotation(t) {
    const e = this.rotate(t - this.rotation);
    this.values[0] = e.values[0], this.values[1] = e.values[1], this.values[2] = e.values[2], this.values[3] = e.values[3];
  }
  get translation() {
    return new v(this.values[4], this.values[5]);
  }
  set translation(t) {
    const e = new v(t);
    this.values[4] = e.x, this.values[5] = e.y;
  }
  get scaling() {
    return new v(this.values[0], this.values[3]);
  }
  set scaling(t) {
    const e = new v(t), r = new v(this.values[0], this.values[1]).normalized, i = new v(this.values[2], this.values[3]).normalized;
    this.values[0] = r.x * e.x, this.values[1] = r.y * e.y, this.values[2] = i.x * e.x, this.values[3] = i.y * e.y;
  }
  /**
   * Get the inverse of the matrix.
   *
   * @remarks
   * If the matrix is not invertible, i.e. its determinant is `0`, this will
   * return `null`, instead.
   *
   * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   *
   * const inverse = matrix.inverse;
   * // => Matrix2D(
   * //      [-2, 1],
   * //      [1.5, -0.5],
   * //      [1, -2],
   * //   )
   * ```
   */
  get inverse() {
    const t = this.values[0], e = this.values[1], r = this.values[2], i = this.values[3], a = this.values[4], h = this.values[5];
    let u = t * i - e * r;
    return u ? (u = 1 / u, new it(i * u, -e * u, -r * u, t * u, (r * h - i * a) * u, (e * a - t * h) * u)) : null;
  }
  /**
   * Get the determinant of the matrix.
   */
  get determinant() {
    return this.values[0] * this.values[3] - this.values[1] * this.values[2];
  }
  get domMatrix() {
    return new DOMMatrix([
      this.values[0],
      this.values[1],
      this.values[2],
      this.values[3],
      this.values[4],
      this.values[5]
    ]);
  }
  constructor(t, e, r, i, a, h) {
    if (this.values = new Float32Array(6), arguments.length === 0) {
      this.values = new Float32Array([1, 0, 0, 1, 0, 0]);
      return;
    }
    if (arguments.length === 6) {
      this.values[0] = t, this.values[1] = e, this.values[2] = r, this.values[3] = i, this.values[4] = a, this.values[5] = h;
      return;
    }
    if (t instanceof DOMMatrix) {
      this.values[0] = t.m11, this.values[1] = t.m12, this.values[2] = t.m21, this.values[3] = t.m22, this.values[4] = t.m41, this.values[5] = t.m42;
      return;
    }
    if (t instanceof it) {
      this.values = t.values;
      return;
    }
    if (Array.isArray(t)) {
      if (t.length === 2) {
        this.values[0] = t[0], this.values[1] = t[1], this.values[2] = e[0], this.values[3] = e[1], this.values[4] = r[0], this.values[5] = r[1];
        return;
      }
      if (t.length === 3) {
        const C = new v(t[0]), z = new v(t[1]), j = new v(t[2]);
        this.values[0] = C.x, this.values[1] = C.y, this.values[2] = z.x, this.values[3] = z.y, this.values[4] = j.x, this.values[5] = j.y;
        return;
      }
      this.values[0] = t[0], this.values[1] = t[1], this.values[2] = t[2], this.values[3] = t[3], this.values[4] = t[4], this.values[5] = t[5];
      return;
    }
    const u = new v(t), p = new v(e), y = new v(r);
    this.values[0] = u.x, this.values[1] = u.y, this.values[2] = p.x, this.values[3] = p.y, this.values[4] = y.x, this.values[5] = y.y;
  }
  /**
   * Get the nth component vector of the matrix. Only defined for 0, 1, and 2.
   *
   * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 0],
   *   [0, 0],
   *   [1, 0],
   * );
   *
   * const x = matrix.column(0);
   * // Vector2(1, 0)
   *
   * const y = matrix.column(1);
   * // Vector2(0, 0)
   *
   * const z = matrix.column(1);
   * // Vector2(1, 0)
   * ```
   *
   * @param index - The index of the component vector to retrieve.
   */
  column(t) {
    return new v(this.values[t * 2], this.values[t * 2 + 1]);
  }
  /**
   * Returns the nth row of the matrix. Only defined for 0 and 1.
   *
   * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 0],
   *   [0, 0],
   *   [1, 0],
   * );
   *
   * const firstRow = matrix.column(0);
   * // [1, 0, 1]
   *
   * const secondRow = matrix.column(1);
   * // [0, 0, 0]
   * ```
   *
   * @param index - The index of the row to retrieve.
   */
  row(t) {
    return [this.values[t], this.values[t + 2], this.values[t + 4]];
  }
  /**
   * Returns the matrix product of this matrix with the provided matrix.
   *
   * @remarks
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const a = new Matrix2D(
   *   [1, 2],
   *   [0, 1],
   *   [1, 1],
   * );
   * const b = new Matrix2D(
   *   [2, 1],
   *   [1, 1],
   *   [1, 1],
   * );
   *
   * const result = a.mul(b);
   * // => Matrix2D(
   * //     [2, 5],
   * //     [1, 3],
   * //     [2, 4],
   * //   )
   * ```
   *
   * @param other - The matrix to multiply with
   */
  mul(t) {
    const e = this.values[0], r = this.values[1], i = this.values[2], a = this.values[3], h = this.values[4], u = this.values[5], p = t.values[0], y = t.values[1], C = t.values[2], z = t.values[3], j = t.values[4], Y = t.values[5];
    return new it(e * p + i * y, r * p + a * y, e * C + i * z, r * C + a * z, e * j + i * Y + h, r * j + a * Y + u);
  }
  /**
   * Rotate the matrix by the provided angle. By default, the angle is
   * provided in degrees.
   *
   * @remarks
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const a = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   *
   * const result = a.rotate(90);
   * // => Matrix2D(
   * //     [3, 4],
   * //     [-1, -2],
   * //     [5, 6],
   * //   )
   *
   * // Provide the angle in radians
   * const result = a.rotate(Math.PI * 0.5, true);
   * // => Matrix2D(
   * //     [3, 4],
   * //     [-1, -2],
   * //     [5, 6],
   * //   )
   * ```
   *
   * @param angle - The angle by which to rotate the matrix.
   * @param degrees - Whether the angle is provided in degrees.
   */
  rotate(t, e = !0) {
    e && (t *= vn);
    const r = this.values[0], i = this.values[1], a = this.values[2], h = this.values[3], u = this.values[4], p = this.values[5], y = Math.sin(t), C = Math.cos(t);
    return new it(r * C + a * y, i * C + h * y, r * -y + a * C, i * -y + h * C, u, p);
  }
  /**
   * Scale the x and y component vectors of the matrix.
   *
   * @remarks
   * If `vec` is provided as a vector, the x and y component vectors of the
   * matrix will be scaled by the x and y parts of the vector, respectively.
   *
   * If `vec` is provided as a scalar, the x and y component vectors will be
   * scaled uniformly by this factor.
   *
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   *
   * const result1 = matrix.scale([2, 3]);
   * // => new Matrix2D(
   * //      [2, 4],
   * //      [9, 12],
   * //      [5, 6],
   * //    )
   *
   * const result2 = matrix.scale(2);
   * // => new Matrix2D(
   * //      [2, 4],
   * //      [6, 8],
   * //      [5, 6],
   * //    )
   * ```
   *
   * @param vec - The factor by which to scale the matrix
   */
  scale(t) {
    const e = new v(t);
    return new it(this.values[0] * e.x, this.values[1] * e.x, this.values[2] * e.y, this.values[3] * e.y, this.values[4], this.values[5]);
  }
  /**
   * Multiply each value of the matrix by a scalar.
   *
   * * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   *
   * const result1 = matrix.mulScalar(2);
   * // => new Matrix2D(
   * //      [2, 4],
   * //      [6, 8],
   * //      [10, 12],
   * //    )
   * ```
   *
   * @param s - The value by which to scale each term
   */
  mulScalar(t) {
    return new it(this.values[0] * t, this.values[1] * t, this.values[2] * t, this.values[3] * t, this.values[4] * t, this.values[5] * t);
  }
  /**
   * Translate the matrix by the dimensions of the provided vector.
   *
   * @remarks
   * If `vec` is provided as a scalar, matrix will be translated uniformly
   * by this factor.
   *
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   *
   * const result1 = matrix.translate([2, 3]);
   * // => new Matrix2D(
   * //      [1, 2],
   * //      [3, 4],
   * //      [16, 22],
   * //    )
   *
   * const result2 = matrix.translate(2);
   * // => new Matrix2D(
   * //      [1, 2],
   * //      [3, 4],
   * //      [13, 18],
   * //    )
   * ```
   *
   * @param vec - The vector by which to translate the matrix
   */
  translate(t) {
    const e = new v(t);
    return new it(this.values[0], this.values[1], this.values[2], this.values[3], this.values[0] * e.x + this.values[2] * e.y + this.values[4], this.values[1] * e.x + this.values[3] * e.y + this.values[5]);
  }
  /**
   * Add the provided matrix to this matrix.
   *
   * @remarks
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const a = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   * const a = new Matrix2D(
   *   [7, 8],
   *   [9, 10],
   *   [11, 12],
   * );
   *
   * const result = a.add(b);
   * // => Matrix2D(
   * //      [8, 10],
   * //      [12, 14],
   * //      [16, 18],
   * //    )
   * ```
   *
   * @param other - The matrix to add
   */
  add(t) {
    return new it(this.values[0] + t.values[0], this.values[1] + t.values[1], this.values[2] + t.values[2], this.values[3] + t.values[3], this.values[4] + t.values[4], this.values[5] + t.values[5]);
  }
  /**
   * Subtract the provided matrix from this matrix.
   *
   * @remarks
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const a = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   * const a = new Matrix2D(
   *   [7, 8],
   *   [9, 10],
   *   [11, 12],
   * );
   *
   * const result = a.sub(b);
   * // => Matrix2D(
   * //      [-6, -6],
   * //      [-6, -6],
   * //      [-6, -6],
   * //    )
   * ```
   *
   * @param other - The matrix to subract
   */
  sub(t) {
    return new it(this.values[0] - t.values[0], this.values[1] - t.values[1], this.values[2] - t.values[2], this.values[3] - t.values[3], this.values[4] - t.values[4], this.values[5] - t.values[5]);
  }
  toSymbol() {
    return it.symbol;
  }
  toUniform(t, e) {
    t.uniformMatrix3fv(e, !1, [
      this.values[0],
      this.values[1],
      0,
      this.values[2],
      this.values[3],
      0,
      this.values[4],
      this.values[5],
      1
    ]);
  }
  equals(t, e = tr) {
    return Math.abs(this.values[0] - t.values[0]) <= e + Number.EPSILON && Math.abs(this.values[1] - t.values[1]) <= e + Number.EPSILON && Math.abs(this.values[2] - t.values[2]) <= e + Number.EPSILON && Math.abs(this.values[3] - t.values[3]) <= e + Number.EPSILON && Math.abs(this.values[4] - t.values[4]) <= e + Number.EPSILON && Math.abs(this.values[5] - t.values[5]) <= e + Number.EPSILON;
  }
  exactlyEquals(t) {
    return this.values[0] === t.values[0] && this.values[1] === t.values[1] && this.values[2] === t.values[2] && this.values[3] === t.values[3] && this.values[4] === t.values[4] && this.values[5] === t.values[5];
  }
}
it.symbol = Symbol.for("@motion-canvas/core/types/Matrix2D");
it.identity = new it(1, 0, 0, 1, 0, 0);
it.zero = new it(0, 0, 0, 0, 0, 0);
var ki;
(function(n) {
  n[n.Vertical = 1] = "Vertical", n[n.Horizontal = 2] = "Horizontal";
})(ki || (ki = {}));
var St;
(function(n) {
  n[n.Top = 4] = "Top", n[n.Bottom = 8] = "Bottom", n[n.Left = 16] = "Left", n[n.Right = 32] = "Right";
})(St || (St = {}));
var at;
(function(n) {
  n[n.Middle = 3] = "Middle", n[n.Top = 5] = "Top", n[n.Bottom = 9] = "Bottom", n[n.Left = 18] = "Left", n[n.Right = 34] = "Right", n[n.TopLeft = 20] = "TopLeft", n[n.TopRight = 36] = "TopRight", n[n.BottomLeft = 24] = "BottomLeft", n[n.BottomRight = 40] = "BottomRight";
})(at || (at = {}));
function lu(n) {
  if (n === at.Middle)
    return v.zero;
  let t = 0;
  n & St.Left ? t = -1 : n & St.Right && (t = 1);
  let e = 0;
  return n & St.Top ? e = -1 : n & St.Bottom && (e = 1), new v(t, e);
}
class v {
  static createSignal(t, e = v.lerp, r) {
    return new Di(["x", "y"], (i) => new v(i), t, e, r).toSignal();
  }
  static lerp(t, e, r) {
    let i, a;
    return typeof r == "number" ? i = a = r : (i = r.x, a = r.y), new v(et(t.x, e.x, i), et(t.y, e.y, a));
  }
  static arcLerp(t, e, r, i = !1, a) {
    return a ?? (a = t.sub(e).ctg), v.lerp(t, e, ji(r, i, a));
  }
  static createArcLerp(t, e) {
    return (r, i, a) => v.arcLerp(r, i, a, t, e);
  }
  /**
   * Interpolates between two vectors on the polar plane by interpolating
   * the angles and magnitudes of the vectors individually.
   *
   * @param from - The starting vector.
   * @param to - The target vector.
   * @param value - The t-value of the interpolation.
   * @param counterclockwise - Whether the vector should get rotated
   *                           counterclockwise. Defaults to `false`.
   * @param origin - The center of rotation. Defaults to the origin.
   *
   * @remarks
   * This function is useful when used in conjunction with {@link rotate} to
   * animate an object's position on a circular arc (see examples).
   *
   * @example
   * Animating an object in a circle around the origin
   * ```tsx
   * circle().position(
   *   circle().position().rotate(180),
   *   1,
   *   easeInOutCubic,
   *   Vector2.polarLerp
   * );
   * ```
   * @example
   * Rotating an object around the point `[-200, 100]`
   * ```ts
   * circle().position(
   *   circle().position().rotate(180, [-200, 100]),
   *   1,
   *   easeInOutCubic,
   *   Vector2.createPolarLerp(false, [-200, 100]),
   * );
   * ```
   * @example
   * Rotating an object counterclockwise around the origin
   * ```ts
   * circle().position(
   *   circle().position().rotate(180),
   *   1,
   *   easeInOutCubic,
   *   Vector2.createPolarLerp(true),
   * );
   * ```
   */
  static polarLerp(t, e, r, i = !1, a = v.zero) {
    t = t.sub(a), e = e.sub(a);
    const h = t.degrees;
    let u = e.degrees;
    h > u !== i && (u = u + (i ? -360 : 360));
    const y = et(h, u, r) * vn, C = et(t.magnitude, e.magnitude, r);
    return new v(C * Math.cos(y) + a.x, C * Math.sin(y) + a.y);
  }
  /**
   * Helper function to create a {@link Vector2.polarLerp} interpolation
   * function with additional parameters.
   *
   * @param counterclockwise - Whether the point should get rotated
   *                           counterclockwise.
   * @param center - The center of rotation. Defaults to the origin.
   */
  static createPolarLerp(t = !1, e = v.zero) {
    return (r, i, a) => v.polarLerp(r, i, a, t, new v(e));
  }
  static fromOrigin(t) {
    const e = new v();
    return t === at.Middle || (t & St.Left ? e.x = -1 : t & St.Right && (e.x = 1), t & St.Top ? e.y = -1 : t & St.Bottom && (e.y = 1)), e;
  }
  static fromScalar(t) {
    return new v(t, t);
  }
  static fromRadians(t) {
    return new v(Math.cos(t), Math.sin(t));
  }
  static fromDegrees(t) {
    return v.fromRadians(t * vn);
  }
  /**
   * Return the angle in radians between the vector described by x and y and the
   * positive x-axis.
   *
   * @param x - The x component of the vector.
   * @param y - The y component of the vector.
   */
  static radians(t, e) {
    return Math.atan2(e, t);
  }
  /**
   * Return the angle in degrees between the vector described by x and y and the
   * positive x-axis.
   *
   * @param x - The x component of the vector.
   * @param y - The y component of the vector.
   *
   * @remarks
   * The returned angle will be between -180 and 180 degrees.
   */
  static degrees(t, e) {
    return v.radians(t, e) * Ic;
  }
  static magnitude(t, e) {
    return Math.sqrt(t * t + e * e);
  }
  static squaredMagnitude(t, e) {
    return t * t + e * e;
  }
  static angleBetween(t, e) {
    return Math.acos(xt(-1, 1, t.dot(e) / (t.magnitude * e.magnitude))) * (t.cross(e) >= 0 ? 1 : -1);
  }
  get width() {
    return this.x;
  }
  set width(t) {
    this.x = t;
  }
  get height() {
    return this.y;
  }
  set height(t) {
    this.y = t;
  }
  get magnitude() {
    return v.magnitude(this.x, this.y);
  }
  get squaredMagnitude() {
    return v.squaredMagnitude(this.x, this.y);
  }
  get normalized() {
    return this.scale(1 / v.magnitude(this.x, this.y));
  }
  get safe() {
    return new v(isNaN(this.x) ? 0 : this.x, isNaN(this.y) ? 0 : this.y);
  }
  get flipped() {
    return new v(-this.x, -this.y);
  }
  get floored() {
    return new v(Math.floor(this.x), Math.floor(this.y));
  }
  get rounded() {
    return new v(Math.round(this.x), Math.round(this.y));
  }
  get ceiled() {
    return new v(Math.ceil(this.x), Math.ceil(this.y));
  }
  get perpendicular() {
    return new v(this.y, -this.x);
  }
  /**
   * Return the angle in radians between the vector and the positive x-axis.
   */
  get radians() {
    return v.radians(this.x, this.y);
  }
  /**
   * Return the angle in degrees between the vector and the positive x-axis.
   *
   * @remarks
   * The returned angle will be between -180 and 180 degrees.
   */
  get degrees() {
    return v.degrees(this.x, this.y);
  }
  get ctg() {
    return this.x / this.y;
  }
  constructor(t, e) {
    if (this.x = 0, this.y = 0, t != null) {
      if (typeof t != "object") {
        this.x = t, this.y = e ?? t;
        return;
      }
      if (Array.isArray(t)) {
        this.x = t[0], this.y = t[1];
        return;
      }
      if ("width" in t) {
        this.x = t.width, this.y = t.height;
        return;
      }
      this.x = t.x, this.y = t.y;
    }
  }
  lerp(t, e) {
    return v.lerp(this, t, e);
  }
  getOriginOffset(t) {
    const e = v.fromOrigin(t);
    return e.x *= this.x / 2, e.y *= this.y / 2, e;
  }
  scale(t) {
    return new v(this.x * t, this.y * t);
  }
  transformAsPoint(t) {
    const e = new it(t);
    return new v(this.x * e.scaleX + this.y * e.skewY + e.translateX, this.x * e.skewX + this.y * e.scaleY + e.translateY);
  }
  transform(t) {
    const e = new it(t);
    return new v(this.x * e.scaleX + this.y * e.skewY, this.x * e.skewX + this.y * e.scaleY);
  }
  mul(t) {
    const e = new v(t);
    return new v(this.x * e.x, this.y * e.y);
  }
  div(t) {
    const e = new v(t);
    return new v(this.x / e.x, this.y / e.y);
  }
  add(t) {
    const e = new v(t);
    return new v(this.x + e.x, this.y + e.y);
  }
  sub(t) {
    const e = new v(t);
    return new v(this.x - e.x, this.y - e.y);
  }
  dot(t) {
    const e = new v(t);
    return this.x * e.x + this.y * e.y;
  }
  cross(t) {
    const e = new v(t);
    return this.x * e.y - this.y * e.x;
  }
  mod(t) {
    const e = new v(t);
    return new v(this.x % e.x, this.y % e.y);
  }
  /**
   * Rotate the vector around a point by the provided angle.
   *
   * @param angle - The angle by which to rotate in degrees.
   * @param center - The center of rotation. Defaults to the origin.
   */
  rotate(t, e = v.zero) {
    const r = new v(e), i = it.fromTranslation(r).rotate(t).translate(r.flipped);
    return this.transformAsPoint(i);
  }
  addX(t) {
    return new v(this.x + t, this.y);
  }
  addY(t) {
    return new v(this.x, this.y + t);
  }
  /**
   * Transform the components of the vector.
   *
   * @example
   * Raise the components to the power of 2.
   * ```ts
   * const vector = new Vector2(2, 3);
   * const result = vector.transform(value => value ** 2);
   * ```
   *
   * @param callback - A callback to apply to each component.
   */
  map(t) {
    return new v(t(this.x, 0), t(this.y, 1));
  }
  toSymbol() {
    return v.symbol;
  }
  toString() {
    return `Vector2(${this.x}, ${this.y})`;
  }
  toArray() {
    return [this.x, this.y];
  }
  toUniform(t, e) {
    t.uniform2f(e, this.x, this.y);
  }
  serialize() {
    return { x: this.x, y: this.y };
  }
  /**
   * Check if two vectors are exactly equal to each other.
   *
   * @remarks
   * If you need to compensate for floating point inaccuracies, use the
   * {@link equals} method, instead.
   *
   * @param other - The vector to compare.
   */
  exactlyEquals(t) {
    return this.x === t.x && this.y === t.y;
  }
  /**
   * Check if two vectors are equal to each other.
   *
   * @remarks
   * This method allows passing an allowed error margin when comparing vectors
   * to compensate for floating point inaccuracies. To check if two vectors are
   * exactly equal, use the {@link exactlyEquals} method, instead.
   *
   * @param other - The vector to compare.
   * @param threshold - The allowed error threshold when comparing the vectors.
   */
  equals(t, e = tr) {
    return Math.abs(this.x - t.x) <= e + Number.EPSILON && Math.abs(this.y - t.y) <= e + Number.EPSILON;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y;
  }
}
v.symbol = Symbol.for("@motion-canvas/core/types/Vector2");
v.zero = new v();
v.one = new v(1, 1);
v.right = new v(1, 0);
v.left = new v(-1, 0);
v.up = new v(0, 1);
v.down = new v(0, -1);
v.top = new v(0, -1);
v.bottom = new v(0, 1);
v.topLeft = new v(-1, -1);
v.topRight = new v(1, -1);
v.bottomLeft = new v(-1, 1);
v.bottomRight = new v(1, 1);
class H {
  static createSignal(t, e = H.lerp) {
    return new Ar(["x", "y", "width", "height"], (r) => new H(r), t, e).toSignal();
  }
  static lerp(t, e, r) {
    let i, a, h, u;
    return typeof r == "number" ? i = a = h = u = r : r instanceof v ? (i = h = r.x, a = u = r.y) : (i = r.x, a = r.y, h = r.width, u = r.height), new H(et(t.x, e.x, i), et(t.y, e.y, a), et(t.width, e.width, h), et(t.height, e.height, u));
  }
  static arcLerp(t, e, r, i = !1, a) {
    return a ?? (a = (t.position.sub(e.position).ctg + t.size.sub(e.size).ctg) / 2), H.lerp(t, e, ji(r, i, a));
  }
  static fromSizeCentered(t) {
    return new H(-t.width / 2, -t.height / 2, t.width, t.height);
  }
  static fromPoints(...t) {
    let e = 1 / 0, r = 1 / 0, i = -1 / 0, a = -1 / 0;
    for (const h of t)
      h.x > i && (i = h.x), h.x < e && (e = h.x), h.y > a && (a = h.y), h.y < r && (r = h.y);
    return new H(e, r, i - e, a - r);
  }
  static fromBBoxes(...t) {
    let e = 1 / 0, r = 1 / 0, i = -1 / 0, a = -1 / 0;
    for (const h of t) {
      const u = h.x + h.width;
      u > i && (i = u), h.x < e && (e = h.x);
      const p = h.y + h.height;
      p > a && (a = p), h.y < r && (r = h.y);
    }
    return new H(e, r, i - e, a - r);
  }
  lerp(t, e) {
    return H.lerp(this, t, e);
  }
  get position() {
    return new v(this.x, this.y);
  }
  set position(t) {
    this.x = t.x, this.y = t.y;
  }
  get size() {
    return new v(this.width, this.height);
  }
  get center() {
    return new v(this.x + this.width / 2, this.y + this.height / 2);
  }
  get left() {
    return this.x;
  }
  set left(t) {
    this.width += this.x - t, this.x = t;
  }
  get right() {
    return this.x + this.width;
  }
  set right(t) {
    this.width = t - this.x;
  }
  get top() {
    return this.y;
  }
  set top(t) {
    this.height += this.y - t, this.y = t;
  }
  get bottom() {
    return this.y + this.height;
  }
  set bottom(t) {
    this.height = t - this.y;
  }
  get topLeft() {
    return this.position;
  }
  get topRight() {
    return new v(this.x + this.width, this.y);
  }
  get bottomLeft() {
    return new v(this.x, this.y + this.height);
  }
  get bottomRight() {
    return new v(this.x + this.width, this.y + this.height);
  }
  get corners() {
    return [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft];
  }
  get pixelPerfect() {
    return new H(Math.floor(this.x), Math.floor(this.y), Math.ceil(this.width + 1), Math.ceil(this.height + 1));
  }
  constructor(t, e = 0, r = 0, i = 0) {
    if (this.x = 0, this.y = 0, this.width = 0, this.height = 0, t != null) {
      if (typeof t == "number") {
        this.x = t, this.y = e, this.width = r, this.height = i;
        return;
      }
      if (t instanceof v) {
        this.x = t.x, this.y = t.y, e instanceof v && (this.width = e.x, this.height = e.y);
        return;
      }
      if (Array.isArray(t)) {
        this.x = t[0], this.y = t[1], this.width = t[2], this.height = t[3];
        return;
      }
      this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height;
    }
  }
  transform(t) {
    return new H(this.position.transformAsPoint(t), this.size.transform(t));
  }
  transformCorners(t) {
    return this.corners.map((e) => e.transformAsPoint(t));
  }
  /**
   * Expand the bounding box to accommodate the given spacing.
   *
   * @param value - The value to expand the bounding box by.
   */
  expand(t) {
    const e = new _t(t), r = new H(this);
    return r.left -= e.left, r.top -= e.top, r.right += e.right, r.bottom += e.bottom, r;
  }
  /**
   * {@inheritDoc expand}
   *
   * @deprecated Use {@link expand} instead.
   */
  addSpacing(t) {
    return this.expand(t);
  }
  includes(t) {
    return t.x >= this.x && t.x <= this.x + this.width && t.y >= this.y && t.y <= this.y + this.height;
  }
  intersects(t) {
    return this.left < t.right && this.right > t.left && this.top < t.bottom && this.bottom > t.top;
  }
  intersection(t) {
    const e = new H();
    return this.intersects(t) && (e.left = Math.max(this.left, t.left), e.top = Math.max(this.top, t.top), e.right = Math.min(this.right, t.right), e.bottom = Math.min(this.bottom, t.bottom)), e;
  }
  union(t) {
    const e = new H();
    return e.left = Math.min(this.left, t.left), e.top = Math.min(this.top, t.top), e.right = Math.max(this.right, t.right), e.bottom = Math.max(this.bottom, t.bottom), e;
  }
  toSymbol() {
    return H.symbol;
  }
  toString() {
    return `BBox(${this.x}, ${this.y}, ${this.width}, ${this.height})`;
  }
  toUniform(t, e) {
    t.uniform4f(e, this.x, this.y, this.width, this.height);
  }
  serialize() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}
H.symbol = Symbol.for("@motion-canvas/core/types/Rect");
var hu = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Bi = { exports: {} };
/**
 * chroma.js - JavaScript library for color conversions
 *
 * Copyright (c) 2011-2019, Gregor Aisch
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. The name Gregor Aisch may not be used to endorse or promote products
 * derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * -------------------------------------------------------
 *
 * chroma.js includes colors from colorbrewer2.org, which are released under
 * the following license:
 *
 * Copyright (c) 2002 Cynthia Brewer, Mark Harrower,
 * and The Pennsylvania State University.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * ------------------------------------------------------
 *
 * Named colors are taken from X11 Color Names.
 * http://www.w3.org/TR/css3-color/#svg-color
 *
 * @preserve
 */
(function(n, t) {
  (function(e, r) {
    n.exports = r();
  })(hu, function() {
    for (var e = function(s, o, l) {
      return o === void 0 && (o = 0), l === void 0 && (l = 1), s < o ? o : s > l ? l : s;
    }, r = e, i = function(s) {
      s._clipped = !1, s._unclipped = s.slice(0);
      for (var o = 0; o <= 3; o++)
        o < 3 ? ((s[o] < 0 || s[o] > 255) && (s._clipped = !0), s[o] = r(s[o], 0, 255)) : o === 3 && (s[o] = r(s[o], 0, 1));
      return s;
    }, a = {}, h = 0, u = ["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Undefined", "Null"]; h < u.length; h += 1) {
      var p = u[h];
      a["[object " + p + "]"] = p.toLowerCase();
    }
    var y = function(s) {
      return a[Object.prototype.toString.call(s)] || "object";
    }, C = y, z = function(s, o) {
      return o === void 0 && (o = null), s.length >= 3 ? Array.prototype.slice.call(s) : C(s[0]) == "object" && o ? o.split("").filter(function(l) {
        return s[0][l] !== void 0;
      }).map(function(l) {
        return s[0][l];
      }) : s[0];
    }, j = y, Y = function(s) {
      if (s.length < 2)
        return null;
      var o = s.length - 1;
      return j(s[o]) == "string" ? s[o].toLowerCase() : null;
    }, st = Math.PI, T = {
      clip_rgb: i,
      limit: e,
      type: y,
      unpack: z,
      last: Y,
      TWOPI: st * 2,
      PITHIRD: st / 3,
      DEG2RAD: st / 180,
      RAD2DEG: 180 / st
    }, K = {
      format: {},
      autodetect: []
    }, yt = T.last, rt = T.clip_rgb, se = T.type, Mt = K, Fe = function() {
      for (var o = [], l = arguments.length; l--; ) o[l] = arguments[l];
      var c = this;
      if (se(o[0]) === "object" && o[0].constructor && o[0].constructor === this.constructor)
        return o[0];
      var d = yt(o), g = !1;
      if (!d) {
        g = !0, Mt.sorted || (Mt.autodetect = Mt.autodetect.sort(function(x, R) {
          return R.p - x.p;
        }), Mt.sorted = !0);
        for (var f = 0, m = Mt.autodetect; f < m.length; f += 1) {
          var b = m[f];
          if (d = b.test.apply(b, o), d)
            break;
        }
      }
      if (Mt.format[d]) {
        var w = Mt.format[d].apply(null, g ? o : o.slice(0, -1));
        c._rgb = rt(w);
      } else
        throw new Error("unknown format: " + o);
      c._rgb.length === 3 && c._rgb.push(1);
    };
    Fe.prototype.toString = function() {
      return se(this.hex) == "function" ? this.hex() : "[" + this._rgb.join(",") + "]";
    };
    var _ = Fe, ie = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(ie.Color, [null].concat(s)))();
    };
    ie.Color = _, ie.version = "2.4.2";
    var lt = ie, Ji = T.unpack, _n = Math.max, Vi = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var l = Ji(s, "rgb"), c = l[0], d = l[1], g = l[2];
      c = c / 255, d = d / 255, g = g / 255;
      var f = 1 - _n(c, _n(d, g)), m = f < 1 ? 1 / (1 - f) : 0, b = (1 - c - f) * m, w = (1 - d - f) * m, x = (1 - g - f) * m;
      return [b, w, x, f];
    }, Qi = Vi, Ki = T.unpack, ta = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      s = Ki(s, "cmyk");
      var l = s[0], c = s[1], d = s[2], g = s[3], f = s.length > 4 ? s[4] : 1;
      return g === 1 ? [0, 0, 0, f] : [
        l >= 1 ? 0 : 255 * (1 - l) * (1 - g),
        // r
        c >= 1 ? 0 : 255 * (1 - c) * (1 - g),
        // g
        d >= 1 ? 0 : 255 * (1 - d) * (1 - g),
        // b
        f
      ];
    }, ea = ta, ra = lt, jn = _, Dn = K, na = T.unpack, sa = T.type, ia = Qi;
    jn.prototype.cmyk = function() {
      return ia(this._rgb);
    }, ra.cmyk = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(jn, [null].concat(s, ["cmyk"])))();
    }, Dn.format.cmyk = ea, Dn.autodetect.push({
      p: 2,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = na(s, "cmyk"), sa(s) === "array" && s.length === 4)
          return "cmyk";
      }
    });
    var aa = T.unpack, oa = T.last, Ir = function(s) {
      return Math.round(s * 100) / 100;
    }, la = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var l = aa(s, "hsla"), c = oa(s) || "lsa";
      return l[0] = Ir(l[0] || 0), l[1] = Ir(l[1] * 100) + "%", l[2] = Ir(l[2] * 100) + "%", c === "hsla" || l.length > 3 && l[3] < 1 ? (l[3] = l.length > 3 ? l[3] : 1, c = "hsla") : l.length = 3, c + "(" + l.join(",") + ")";
    }, ha = la, ca = T.unpack, ua = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      s = ca(s, "rgba");
      var l = s[0], c = s[1], d = s[2];
      l /= 255, c /= 255, d /= 255;
      var g = Math.min(l, c, d), f = Math.max(l, c, d), m = (f + g) / 2, b, w;
      return f === g ? (b = 0, w = Number.NaN) : b = m < 0.5 ? (f - g) / (f + g) : (f - g) / (2 - f - g), l == f ? w = (c - d) / (f - g) : c == f ? w = 2 + (d - l) / (f - g) : d == f && (w = 4 + (l - c) / (f - g)), w *= 60, w < 0 && (w += 360), s.length > 3 && s[3] !== void 0 ? [w, b, m, s[3]] : [w, b, m];
    }, Bn = ua, fa = T.unpack, da = T.last, pa = ha, ga = Bn, Er = Math.round, va = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var l = fa(s, "rgba"), c = da(s) || "rgb";
      return c.substr(0, 3) == "hsl" ? pa(ga(l), c) : (l[0] = Er(l[0]), l[1] = Er(l[1]), l[2] = Er(l[2]), (c === "rgba" || l.length > 3 && l[3] < 1) && (l[3] = l.length > 3 ? l[3] : 1, c = "rgba"), c + "(" + l.slice(0, c === "rgb" ? 3 : 4).join(",") + ")");
    }, ma = va, ba = T.unpack, _r = Math.round, ya = function() {
      for (var s, o = [], l = arguments.length; l--; ) o[l] = arguments[l];
      o = ba(o, "hsl");
      var c = o[0], d = o[1], g = o[2], f, m, b;
      if (d === 0)
        f = m = b = g * 255;
      else {
        var w = [0, 0, 0], x = [0, 0, 0], R = g < 0.5 ? g * (1 + d) : g + d - g * d, S = 2 * g - R, M = c / 360;
        w[0] = M + 1 / 3, w[1] = M, w[2] = M - 1 / 3;
        for (var L = 0; L < 3; L++)
          w[L] < 0 && (w[L] += 1), w[L] > 1 && (w[L] -= 1), 6 * w[L] < 1 ? x[L] = S + (R - S) * 6 * w[L] : 2 * w[L] < 1 ? x[L] = R : 3 * w[L] < 2 ? x[L] = S + (R - S) * (2 / 3 - w[L]) * 6 : x[L] = S;
        s = [_r(x[0] * 255), _r(x[1] * 255), _r(x[2] * 255)], f = s[0], m = s[1], b = s[2];
      }
      return o.length > 3 ? [f, m, b, o[3]] : [f, m, b, 1];
    }, Nn = ya, Wn = Nn, Un = K, qn = /^rgb\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*\)$/, Gn = /^rgba\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*([01]|[01]?\.\d+)\)$/, Xn = /^rgb\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/, Hn = /^rgba\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/, Yn = /^hsl\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/, Zn = /^hsla\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/, Jn = Math.round, Vn = function(s) {
      s = s.toLowerCase().trim();
      var o;
      if (Un.format.named)
        try {
          return Un.format.named(s);
        } catch {
        }
      if (o = s.match(qn)) {
        for (var l = o.slice(1, 4), c = 0; c < 3; c++)
          l[c] = +l[c];
        return l[3] = 1, l;
      }
      if (o = s.match(Gn)) {
        for (var d = o.slice(1, 5), g = 0; g < 4; g++)
          d[g] = +d[g];
        return d;
      }
      if (o = s.match(Xn)) {
        for (var f = o.slice(1, 4), m = 0; m < 3; m++)
          f[m] = Jn(f[m] * 2.55);
        return f[3] = 1, f;
      }
      if (o = s.match(Hn)) {
        for (var b = o.slice(1, 5), w = 0; w < 3; w++)
          b[w] = Jn(b[w] * 2.55);
        return b[3] = +b[3], b;
      }
      if (o = s.match(Yn)) {
        var x = o.slice(1, 4);
        x[1] *= 0.01, x[2] *= 0.01;
        var R = Wn(x);
        return R[3] = 1, R;
      }
      if (o = s.match(Zn)) {
        var S = o.slice(1, 4);
        S[1] *= 0.01, S[2] *= 0.01;
        var M = Wn(S);
        return M[3] = +o[4], M;
      }
    };
    Vn.test = function(s) {
      return qn.test(s) || Gn.test(s) || Xn.test(s) || Hn.test(s) || Yn.test(s) || Zn.test(s);
    };
    var wa = Vn, xa = lt, Qn = _, Kn = K, Ca = T.type, Sa = ma, ts = wa;
    Qn.prototype.css = function(s) {
      return Sa(this._rgb, s);
    }, xa.css = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(Qn, [null].concat(s, ["css"])))();
    }, Kn.format.css = ts, Kn.autodetect.push({
      p: 5,
      test: function(s) {
        for (var o = [], l = arguments.length - 1; l-- > 0; ) o[l] = arguments[l + 1];
        if (!o.length && Ca(s) === "string" && ts.test(s))
          return "css";
      }
    });
    var es = _, ka = lt, Ta = K, Pa = T.unpack;
    Ta.format.gl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var l = Pa(s, "rgba");
      return l[0] *= 255, l[1] *= 255, l[2] *= 255, l;
    }, ka.gl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(es, [null].concat(s, ["gl"])))();
    }, es.prototype.gl = function() {
      var s = this._rgb;
      return [s[0] / 255, s[1] / 255, s[2] / 255, s[3]];
    };
    var Ra = T.unpack, La = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var l = Ra(s, "rgb"), c = l[0], d = l[1], g = l[2], f = Math.min(c, d, g), m = Math.max(c, d, g), b = m - f, w = b * 100 / 255, x = f / (255 - b) * 100, R;
      return b === 0 ? R = Number.NaN : (c === m && (R = (d - g) / b), d === m && (R = 2 + (g - c) / b), g === m && (R = 4 + (c - d) / b), R *= 60, R < 0 && (R += 360)), [R, w, x];
    }, Ma = La, $a = T.unpack, Oa = Math.floor, Aa = function() {
      for (var s, o, l, c, d, g, f = [], m = arguments.length; m--; ) f[m] = arguments[m];
      f = $a(f, "hcg");
      var b = f[0], w = f[1], x = f[2], R, S, M;
      x = x * 255;
      var L = w * 255;
      if (w === 0)
        R = S = M = x;
      else {
        b === 360 && (b = 0), b > 360 && (b -= 360), b < 0 && (b += 360), b /= 60;
        var B = Oa(b), U = b - B, G = x * (1 - w), Z = G + L * (1 - U), pt = G + L * U, dt = G + L;
        switch (B) {
          case 0:
            s = [dt, pt, G], R = s[0], S = s[1], M = s[2];
            break;
          case 1:
            o = [Z, dt, G], R = o[0], S = o[1], M = o[2];
            break;
          case 2:
            l = [G, dt, pt], R = l[0], S = l[1], M = l[2];
            break;
          case 3:
            c = [G, Z, dt], R = c[0], S = c[1], M = c[2];
            break;
          case 4:
            d = [pt, G, dt], R = d[0], S = d[1], M = d[2];
            break;
          case 5:
            g = [dt, G, Z], R = g[0], S = g[1], M = g[2];
            break;
        }
      }
      return [R, S, M, f.length > 3 ? f[3] : 1];
    }, za = Aa, Fa = T.unpack, Ia = T.type, Ea = lt, rs = _, ns = K, _a = Ma;
    rs.prototype.hcg = function() {
      return _a(this._rgb);
    }, Ea.hcg = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(rs, [null].concat(s, ["hcg"])))();
    }, ns.format.hcg = za, ns.autodetect.push({
      p: 1,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = Fa(s, "hcg"), Ia(s) === "array" && s.length === 3)
          return "hcg";
      }
    });
    var ja = T.unpack, Da = T.last, dr = Math.round, Ba = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var l = ja(s, "rgba"), c = l[0], d = l[1], g = l[2], f = l[3], m = Da(s) || "auto";
      f === void 0 && (f = 1), m === "auto" && (m = f < 1 ? "rgba" : "rgb"), c = dr(c), d = dr(d), g = dr(g);
      var b = c << 16 | d << 8 | g, w = "000000" + b.toString(16);
      w = w.substr(w.length - 6);
      var x = "0" + dr(f * 255).toString(16);
      switch (x = x.substr(x.length - 2), m.toLowerCase()) {
        case "rgba":
          return "#" + w + x;
        case "argb":
          return "#" + x + w;
        default:
          return "#" + w;
      }
    }, ss = Ba, Na = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, Wa = /^#?([A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$/, Ua = function(s) {
      if (s.match(Na)) {
        (s.length === 4 || s.length === 7) && (s = s.substr(1)), s.length === 3 && (s = s.split(""), s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2]);
        var o = parseInt(s, 16), l = o >> 16, c = o >> 8 & 255, d = o & 255;
        return [l, c, d, 1];
      }
      if (s.match(Wa)) {
        (s.length === 5 || s.length === 9) && (s = s.substr(1)), s.length === 4 && (s = s.split(""), s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2] + s[3] + s[3]);
        var g = parseInt(s, 16), f = g >> 24 & 255, m = g >> 16 & 255, b = g >> 8 & 255, w = Math.round((g & 255) / 255 * 100) / 100;
        return [f, m, b, w];
      }
      throw new Error("unknown hex color: " + s);
    }, is = Ua, qa = lt, as = _, Ga = T.type, os = K, Xa = ss;
    as.prototype.hex = function(s) {
      return Xa(this._rgb, s);
    }, qa.hex = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(as, [null].concat(s, ["hex"])))();
    }, os.format.hex = is, os.autodetect.push({
      p: 4,
      test: function(s) {
        for (var o = [], l = arguments.length - 1; l-- > 0; ) o[l] = arguments[l + 1];
        if (!o.length && Ga(s) === "string" && [3, 4, 5, 6, 7, 8, 9].indexOf(s.length) >= 0)
          return "hex";
      }
    });
    var Ha = T.unpack, ls = T.TWOPI, Ya = Math.min, Za = Math.sqrt, Ja = Math.acos, Va = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var l = Ha(s, "rgb"), c = l[0], d = l[1], g = l[2];
      c /= 255, d /= 255, g /= 255;
      var f, m = Ya(c, d, g), b = (c + d + g) / 3, w = b > 0 ? 1 - m / b : 0;
      return w === 0 ? f = NaN : (f = (c - d + (c - g)) / 2, f /= Za((c - d) * (c - d) + (c - g) * (d - g)), f = Ja(f), g > d && (f = ls - f), f /= ls), [f * 360, w, b];
    }, Qa = Va, Ka = T.unpack, jr = T.limit, Ie = T.TWOPI, Dr = T.PITHIRD, Ee = Math.cos, to = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      s = Ka(s, "hsi");
      var l = s[0], c = s[1], d = s[2], g, f, m;
      return isNaN(l) && (l = 0), isNaN(c) && (c = 0), l > 360 && (l -= 360), l < 0 && (l += 360), l /= 360, l < 1 / 3 ? (m = (1 - c) / 3, g = (1 + c * Ee(Ie * l) / Ee(Dr - Ie * l)) / 3, f = 1 - (m + g)) : l < 2 / 3 ? (l -= 1 / 3, g = (1 - c) / 3, f = (1 + c * Ee(Ie * l) / Ee(Dr - Ie * l)) / 3, m = 1 - (g + f)) : (l -= 2 / 3, f = (1 - c) / 3, m = (1 + c * Ee(Ie * l) / Ee(Dr - Ie * l)) / 3, g = 1 - (f + m)), g = jr(d * g * 3), f = jr(d * f * 3), m = jr(d * m * 3), [g * 255, f * 255, m * 255, s.length > 3 ? s[3] : 1];
    }, eo = to, ro = T.unpack, no = T.type, so = lt, hs = _, cs = K, io = Qa;
    hs.prototype.hsi = function() {
      return io(this._rgb);
    }, so.hsi = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(hs, [null].concat(s, ["hsi"])))();
    }, cs.format.hsi = eo, cs.autodetect.push({
      p: 2,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = ro(s, "hsi"), no(s) === "array" && s.length === 3)
          return "hsi";
      }
    });
    var ao = T.unpack, oo = T.type, lo = lt, us = _, fs = K, ho = Bn;
    us.prototype.hsl = function() {
      return ho(this._rgb);
    }, lo.hsl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(us, [null].concat(s, ["hsl"])))();
    }, fs.format.hsl = Nn, fs.autodetect.push({
      p: 2,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = ao(s, "hsl"), oo(s) === "array" && s.length === 3)
          return "hsl";
      }
    });
    var co = T.unpack, uo = Math.min, fo = Math.max, po = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      s = co(s, "rgb");
      var l = s[0], c = s[1], d = s[2], g = uo(l, c, d), f = fo(l, c, d), m = f - g, b, w, x;
      return x = f / 255, f === 0 ? (b = Number.NaN, w = 0) : (w = m / f, l === f && (b = (c - d) / m), c === f && (b = 2 + (d - l) / m), d === f && (b = 4 + (l - c) / m), b *= 60, b < 0 && (b += 360)), [b, w, x];
    }, go = po, vo = T.unpack, mo = Math.floor, bo = function() {
      for (var s, o, l, c, d, g, f = [], m = arguments.length; m--; ) f[m] = arguments[m];
      f = vo(f, "hsv");
      var b = f[0], w = f[1], x = f[2], R, S, M;
      if (x *= 255, w === 0)
        R = S = M = x;
      else {
        b === 360 && (b = 0), b > 360 && (b -= 360), b < 0 && (b += 360), b /= 60;
        var L = mo(b), B = b - L, U = x * (1 - w), G = x * (1 - w * B), Z = x * (1 - w * (1 - B));
        switch (L) {
          case 0:
            s = [x, Z, U], R = s[0], S = s[1], M = s[2];
            break;
          case 1:
            o = [G, x, U], R = o[0], S = o[1], M = o[2];
            break;
          case 2:
            l = [U, x, Z], R = l[0], S = l[1], M = l[2];
            break;
          case 3:
            c = [U, G, x], R = c[0], S = c[1], M = c[2];
            break;
          case 4:
            d = [Z, U, x], R = d[0], S = d[1], M = d[2];
            break;
          case 5:
            g = [x, U, G], R = g[0], S = g[1], M = g[2];
            break;
        }
      }
      return [R, S, M, f.length > 3 ? f[3] : 1];
    }, yo = bo, wo = T.unpack, xo = T.type, Co = lt, ds = _, ps = K, So = go;
    ds.prototype.hsv = function() {
      return So(this._rgb);
    }, Co.hsv = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(ds, [null].concat(s, ["hsv"])))();
    }, ps.format.hsv = yo, ps.autodetect.push({
      p: 2,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = wo(s, "hsv"), xo(s) === "array" && s.length === 3)
          return "hsv";
      }
    });
    var pr = {
      // Corresponds roughly to RGB brighter/darker
      Kn: 18,
      // D65 standard referent
      Xn: 0.95047,
      Yn: 1,
      Zn: 1.08883,
      t0: 0.137931034,
      // 4 / 29
      t1: 0.206896552,
      // 6 / 29
      t2: 0.12841855,
      // 3 * t1 * t1
      t3: 8856452e-9
      // t1 * t1 * t1
    }, _e = pr, ko = T.unpack, gs = Math.pow, To = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var l = ko(s, "rgb"), c = l[0], d = l[1], g = l[2], f = Po(c, d, g), m = f[0], b = f[1], w = f[2], x = 116 * b - 16;
      return [x < 0 ? 0 : x, 500 * (m - b), 200 * (b - w)];
    }, Br = function(s) {
      return (s /= 255) <= 0.04045 ? s / 12.92 : gs((s + 0.055) / 1.055, 2.4);
    }, Nr = function(s) {
      return s > _e.t3 ? gs(s, 1 / 3) : s / _e.t2 + _e.t0;
    }, Po = function(s, o, l) {
      s = Br(s), o = Br(o), l = Br(l);
      var c = Nr((0.4124564 * s + 0.3575761 * o + 0.1804375 * l) / _e.Xn), d = Nr((0.2126729 * s + 0.7151522 * o + 0.072175 * l) / _e.Yn), g = Nr((0.0193339 * s + 0.119192 * o + 0.9503041 * l) / _e.Zn);
      return [c, d, g];
    }, vs = To, je = pr, Ro = T.unpack, Lo = Math.pow, Mo = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      s = Ro(s, "lab");
      var l = s[0], c = s[1], d = s[2], g, f, m, b, w, x;
      return f = (l + 16) / 116, g = isNaN(c) ? f : f + c / 500, m = isNaN(d) ? f : f - d / 200, f = je.Yn * Ur(f), g = je.Xn * Ur(g), m = je.Zn * Ur(m), b = Wr(3.2404542 * g - 1.5371385 * f - 0.4985314 * m), w = Wr(-0.969266 * g + 1.8760108 * f + 0.041556 * m), x = Wr(0.0556434 * g - 0.2040259 * f + 1.0572252 * m), [b, w, x, s.length > 3 ? s[3] : 1];
    }, Wr = function(s) {
      return 255 * (s <= 304e-5 ? 12.92 * s : 1.055 * Lo(s, 1 / 2.4) - 0.055);
    }, Ur = function(s) {
      return s > je.t1 ? s * s * s : je.t2 * (s - je.t0);
    }, ms = Mo, $o = T.unpack, Oo = T.type, Ao = lt, bs = _, ys = K, zo = vs;
    bs.prototype.lab = function() {
      return zo(this._rgb);
    }, Ao.lab = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(bs, [null].concat(s, ["lab"])))();
    }, ys.format.lab = ms, ys.autodetect.push({
      p: 2,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = $o(s, "lab"), Oo(s) === "array" && s.length === 3)
          return "lab";
      }
    });
    var Fo = T.unpack, Io = T.RAD2DEG, Eo = Math.sqrt, _o = Math.atan2, jo = Math.round, Do = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var l = Fo(s, "lab"), c = l[0], d = l[1], g = l[2], f = Eo(d * d + g * g), m = (_o(g, d) * Io + 360) % 360;
      return jo(f * 1e4) === 0 && (m = Number.NaN), [c, f, m];
    }, ws = Do, Bo = T.unpack, No = vs, Wo = ws, Uo = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var l = Bo(s, "rgb"), c = l[0], d = l[1], g = l[2], f = No(c, d, g), m = f[0], b = f[1], w = f[2];
      return Wo(m, b, w);
    }, qo = Uo, Go = T.unpack, Xo = T.DEG2RAD, Ho = Math.sin, Yo = Math.cos, Zo = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var l = Go(s, "lch"), c = l[0], d = l[1], g = l[2];
      return isNaN(g) && (g = 0), g = g * Xo, [c, Yo(g) * d, Ho(g) * d];
    }, xs = Zo, Jo = T.unpack, Vo = xs, Qo = ms, Ko = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      s = Jo(s, "lch");
      var l = s[0], c = s[1], d = s[2], g = Vo(l, c, d), f = g[0], m = g[1], b = g[2], w = Qo(f, m, b), x = w[0], R = w[1], S = w[2];
      return [x, R, S, s.length > 3 ? s[3] : 1];
    }, Cs = Ko, tl = T.unpack, el = Cs, rl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var l = tl(s, "hcl").reverse();
      return el.apply(void 0, l);
    }, nl = rl, sl = T.unpack, il = T.type, Ss = lt, gr = _, qr = K, ks = qo;
    gr.prototype.lch = function() {
      return ks(this._rgb);
    }, gr.prototype.hcl = function() {
      return ks(this._rgb).reverse();
    }, Ss.lch = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(gr, [null].concat(s, ["lch"])))();
    }, Ss.hcl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(gr, [null].concat(s, ["hcl"])))();
    }, qr.format.lch = Cs, qr.format.hcl = nl, ["lch", "hcl"].forEach(function(s) {
      return qr.autodetect.push({
        p: 2,
        test: function() {
          for (var o = [], l = arguments.length; l--; ) o[l] = arguments[l];
          if (o = sl(o, s), il(o) === "array" && o.length === 3)
            return s;
        }
      });
    });
    var al = {
      aliceblue: "#f0f8ff",
      antiquewhite: "#faebd7",
      aqua: "#00ffff",
      aquamarine: "#7fffd4",
      azure: "#f0ffff",
      beige: "#f5f5dc",
      bisque: "#ffe4c4",
      black: "#000000",
      blanchedalmond: "#ffebcd",
      blue: "#0000ff",
      blueviolet: "#8a2be2",
      brown: "#a52a2a",
      burlywood: "#deb887",
      cadetblue: "#5f9ea0",
      chartreuse: "#7fff00",
      chocolate: "#d2691e",
      coral: "#ff7f50",
      cornflower: "#6495ed",
      cornflowerblue: "#6495ed",
      cornsilk: "#fff8dc",
      crimson: "#dc143c",
      cyan: "#00ffff",
      darkblue: "#00008b",
      darkcyan: "#008b8b",
      darkgoldenrod: "#b8860b",
      darkgray: "#a9a9a9",
      darkgreen: "#006400",
      darkgrey: "#a9a9a9",
      darkkhaki: "#bdb76b",
      darkmagenta: "#8b008b",
      darkolivegreen: "#556b2f",
      darkorange: "#ff8c00",
      darkorchid: "#9932cc",
      darkred: "#8b0000",
      darksalmon: "#e9967a",
      darkseagreen: "#8fbc8f",
      darkslateblue: "#483d8b",
      darkslategray: "#2f4f4f",
      darkslategrey: "#2f4f4f",
      darkturquoise: "#00ced1",
      darkviolet: "#9400d3",
      deeppink: "#ff1493",
      deepskyblue: "#00bfff",
      dimgray: "#696969",
      dimgrey: "#696969",
      dodgerblue: "#1e90ff",
      firebrick: "#b22222",
      floralwhite: "#fffaf0",
      forestgreen: "#228b22",
      fuchsia: "#ff00ff",
      gainsboro: "#dcdcdc",
      ghostwhite: "#f8f8ff",
      gold: "#ffd700",
      goldenrod: "#daa520",
      gray: "#808080",
      green: "#008000",
      greenyellow: "#adff2f",
      grey: "#808080",
      honeydew: "#f0fff0",
      hotpink: "#ff69b4",
      indianred: "#cd5c5c",
      indigo: "#4b0082",
      ivory: "#fffff0",
      khaki: "#f0e68c",
      laserlemon: "#ffff54",
      lavender: "#e6e6fa",
      lavenderblush: "#fff0f5",
      lawngreen: "#7cfc00",
      lemonchiffon: "#fffacd",
      lightblue: "#add8e6",
      lightcoral: "#f08080",
      lightcyan: "#e0ffff",
      lightgoldenrod: "#fafad2",
      lightgoldenrodyellow: "#fafad2",
      lightgray: "#d3d3d3",
      lightgreen: "#90ee90",
      lightgrey: "#d3d3d3",
      lightpink: "#ffb6c1",
      lightsalmon: "#ffa07a",
      lightseagreen: "#20b2aa",
      lightskyblue: "#87cefa",
      lightslategray: "#778899",
      lightslategrey: "#778899",
      lightsteelblue: "#b0c4de",
      lightyellow: "#ffffe0",
      lime: "#00ff00",
      limegreen: "#32cd32",
      linen: "#faf0e6",
      magenta: "#ff00ff",
      maroon: "#800000",
      maroon2: "#7f0000",
      maroon3: "#b03060",
      mediumaquamarine: "#66cdaa",
      mediumblue: "#0000cd",
      mediumorchid: "#ba55d3",
      mediumpurple: "#9370db",
      mediumseagreen: "#3cb371",
      mediumslateblue: "#7b68ee",
      mediumspringgreen: "#00fa9a",
      mediumturquoise: "#48d1cc",
      mediumvioletred: "#c71585",
      midnightblue: "#191970",
      mintcream: "#f5fffa",
      mistyrose: "#ffe4e1",
      moccasin: "#ffe4b5",
      navajowhite: "#ffdead",
      navy: "#000080",
      oldlace: "#fdf5e6",
      olive: "#808000",
      olivedrab: "#6b8e23",
      orange: "#ffa500",
      orangered: "#ff4500",
      orchid: "#da70d6",
      palegoldenrod: "#eee8aa",
      palegreen: "#98fb98",
      paleturquoise: "#afeeee",
      palevioletred: "#db7093",
      papayawhip: "#ffefd5",
      peachpuff: "#ffdab9",
      peru: "#cd853f",
      pink: "#ffc0cb",
      plum: "#dda0dd",
      powderblue: "#b0e0e6",
      purple: "#800080",
      purple2: "#7f007f",
      purple3: "#a020f0",
      rebeccapurple: "#663399",
      red: "#ff0000",
      rosybrown: "#bc8f8f",
      royalblue: "#4169e1",
      saddlebrown: "#8b4513",
      salmon: "#fa8072",
      sandybrown: "#f4a460",
      seagreen: "#2e8b57",
      seashell: "#fff5ee",
      sienna: "#a0522d",
      silver: "#c0c0c0",
      skyblue: "#87ceeb",
      slateblue: "#6a5acd",
      slategray: "#708090",
      slategrey: "#708090",
      snow: "#fffafa",
      springgreen: "#00ff7f",
      steelblue: "#4682b4",
      tan: "#d2b48c",
      teal: "#008080",
      thistle: "#d8bfd8",
      tomato: "#ff6347",
      turquoise: "#40e0d0",
      violet: "#ee82ee",
      wheat: "#f5deb3",
      white: "#ffffff",
      whitesmoke: "#f5f5f5",
      yellow: "#ffff00",
      yellowgreen: "#9acd32"
    }, Ts = al, ol = _, Ps = K, ll = T.type, Ze = Ts, hl = is, cl = ss;
    ol.prototype.name = function() {
      for (var s = cl(this._rgb, "rgb"), o = 0, l = Object.keys(Ze); o < l.length; o += 1) {
        var c = l[o];
        if (Ze[c] === s)
          return c.toLowerCase();
      }
      return s;
    }, Ps.format.named = function(s) {
      if (s = s.toLowerCase(), Ze[s])
        return hl(Ze[s]);
      throw new Error("unknown color name: " + s);
    }, Ps.autodetect.push({
      p: 5,
      test: function(s) {
        for (var o = [], l = arguments.length - 1; l-- > 0; ) o[l] = arguments[l + 1];
        if (!o.length && ll(s) === "string" && Ze[s.toLowerCase()])
          return "named";
      }
    });
    var ul = T.unpack, fl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var l = ul(s, "rgb"), c = l[0], d = l[1], g = l[2];
      return (c << 16) + (d << 8) + g;
    }, dl = fl, pl = T.type, gl = function(s) {
      if (pl(s) == "number" && s >= 0 && s <= 16777215) {
        var o = s >> 16, l = s >> 8 & 255, c = s & 255;
        return [o, l, c, 1];
      }
      throw new Error("unknown num color: " + s);
    }, vl = gl, ml = lt, Rs = _, Ls = K, bl = T.type, yl = dl;
    Rs.prototype.num = function() {
      return yl(this._rgb);
    }, ml.num = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(Rs, [null].concat(s, ["num"])))();
    }, Ls.format.num = vl, Ls.autodetect.push({
      p: 5,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s.length === 1 && bl(s[0]) === "number" && s[0] >= 0 && s[0] <= 16777215)
          return "num";
      }
    });
    var wl = lt, Gr = _, Ms = K, $s = T.unpack, Os = T.type, As = Math.round;
    Gr.prototype.rgb = function(s) {
      return s === void 0 && (s = !0), s === !1 ? this._rgb.slice(0, 3) : this._rgb.slice(0, 3).map(As);
    }, Gr.prototype.rgba = function(s) {
      return s === void 0 && (s = !0), this._rgb.slice(0, 4).map(function(o, l) {
        return l < 3 ? s === !1 ? o : As(o) : o;
      });
    }, wl.rgb = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(Gr, [null].concat(s, ["rgb"])))();
    }, Ms.format.rgb = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var l = $s(s, "rgba");
      return l[3] === void 0 && (l[3] = 1), l;
    }, Ms.autodetect.push({
      p: 3,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = $s(s, "rgba"), Os(s) === "array" && (s.length === 3 || s.length === 4 && Os(s[3]) == "number" && s[3] >= 0 && s[3] <= 1))
          return "rgb";
      }
    });
    var vr = Math.log, xl = function(s) {
      var o = s / 100, l, c, d;
      return o < 66 ? (l = 255, c = o < 6 ? 0 : -155.25485562709179 - 0.44596950469579133 * (c = o - 2) + 104.49216199393888 * vr(c), d = o < 20 ? 0 : -254.76935184120902 + 0.8274096064007395 * (d = o - 10) + 115.67994401066147 * vr(d)) : (l = 351.97690566805693 + 0.114206453784165 * (l = o - 55) - 40.25366309332127 * vr(l), c = 325.4494125711974 + 0.07943456536662342 * (c = o - 50) - 28.0852963507957 * vr(c), d = 255), [l, c, d, 1];
    }, zs = xl, Cl = zs, Sl = T.unpack, kl = Math.round, Tl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      for (var l = Sl(s, "rgb"), c = l[0], d = l[2], g = 1e3, f = 4e4, m = 0.4, b; f - g > m; ) {
        b = (f + g) * 0.5;
        var w = Cl(b);
        w[2] / w[0] >= d / c ? f = b : g = b;
      }
      return kl(b);
    }, Pl = Tl, Xr = lt, mr = _, Hr = K, Rl = Pl;
    mr.prototype.temp = mr.prototype.kelvin = mr.prototype.temperature = function() {
      return Rl(this._rgb);
    }, Xr.temp = Xr.kelvin = Xr.temperature = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(mr, [null].concat(s, ["temp"])))();
    }, Hr.format.temp = Hr.format.kelvin = Hr.format.temperature = zs;
    var Ll = T.unpack, Yr = Math.cbrt, Ml = Math.pow, $l = Math.sign, Ol = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var l = Ll(s, "rgb"), c = l[0], d = l[1], g = l[2], f = [Zr(c / 255), Zr(d / 255), Zr(g / 255)], m = f[0], b = f[1], w = f[2], x = Yr(0.4122214708 * m + 0.5363325363 * b + 0.0514459929 * w), R = Yr(0.2119034982 * m + 0.6806995451 * b + 0.1073969566 * w), S = Yr(0.0883024619 * m + 0.2817188376 * b + 0.6299787005 * w);
      return [
        0.2104542553 * x + 0.793617785 * R - 0.0040720468 * S,
        1.9779984951 * x - 2.428592205 * R + 0.4505937099 * S,
        0.0259040371 * x + 0.7827717662 * R - 0.808675766 * S
      ];
    }, Fs = Ol;
    function Zr(s) {
      var o = Math.abs(s);
      return o < 0.04045 ? s / 12.92 : ($l(s) || 1) * Ml((o + 0.055) / 1.055, 2.4);
    }
    var Al = T.unpack, br = Math.pow, zl = Math.sign, Fl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      s = Al(s, "lab");
      var l = s[0], c = s[1], d = s[2], g = br(l + 0.3963377774 * c + 0.2158037573 * d, 3), f = br(l - 0.1055613458 * c - 0.0638541728 * d, 3), m = br(l - 0.0894841775 * c - 1.291485548 * d, 3);
      return [
        255 * Jr(4.0767416621 * g - 3.3077115913 * f + 0.2309699292 * m),
        255 * Jr(-1.2684380046 * g + 2.6097574011 * f - 0.3413193965 * m),
        255 * Jr(-0.0041960863 * g - 0.7034186147 * f + 1.707614701 * m),
        s.length > 3 ? s[3] : 1
      ];
    }, Is = Fl;
    function Jr(s) {
      var o = Math.abs(s);
      return o > 31308e-7 ? (zl(s) || 1) * (1.055 * br(o, 1 / 2.4) - 0.055) : s * 12.92;
    }
    var Il = T.unpack, El = T.type, _l = lt, Es = _, _s = K, jl = Fs;
    Es.prototype.oklab = function() {
      return jl(this._rgb);
    }, _l.oklab = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(Es, [null].concat(s, ["oklab"])))();
    }, _s.format.oklab = Is, _s.autodetect.push({
      p: 3,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = Il(s, "oklab"), El(s) === "array" && s.length === 3)
          return "oklab";
      }
    });
    var Dl = T.unpack, Bl = Fs, Nl = ws, Wl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var l = Dl(s, "rgb"), c = l[0], d = l[1], g = l[2], f = Bl(c, d, g), m = f[0], b = f[1], w = f[2];
      return Nl(m, b, w);
    }, Ul = Wl, ql = T.unpack, Gl = xs, Xl = Is, Hl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      s = ql(s, "lch");
      var l = s[0], c = s[1], d = s[2], g = Gl(l, c, d), f = g[0], m = g[1], b = g[2], w = Xl(f, m, b), x = w[0], R = w[1], S = w[2];
      return [x, R, S, s.length > 3 ? s[3] : 1];
    }, Yl = Hl, Zl = T.unpack, Jl = T.type, Vl = lt, js = _, Ds = K, Ql = Ul;
    js.prototype.oklch = function() {
      return Ql(this._rgb);
    }, Vl.oklch = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(js, [null].concat(s, ["oklch"])))();
    }, Ds.format.oklch = Yl, Ds.autodetect.push({
      p: 3,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = Zl(s, "oklch"), Jl(s) === "array" && s.length === 3)
          return "oklch";
      }
    });
    var Bs = _, Kl = T.type;
    Bs.prototype.alpha = function(s, o) {
      return o === void 0 && (o = !1), s !== void 0 && Kl(s) === "number" ? o ? (this._rgb[3] = s, this) : new Bs([this._rgb[0], this._rgb[1], this._rgb[2], s], "rgb") : this._rgb[3];
    };
    var th = _;
    th.prototype.clipped = function() {
      return this._rgb._clipped || !1;
    };
    var we = _, eh = pr;
    we.prototype.darken = function(s) {
      s === void 0 && (s = 1);
      var o = this, l = o.lab();
      return l[0] -= eh.Kn * s, new we(l, "lab").alpha(o.alpha(), !0);
    }, we.prototype.brighten = function(s) {
      return s === void 0 && (s = 1), this.darken(-s);
    }, we.prototype.darker = we.prototype.darken, we.prototype.brighter = we.prototype.brighten;
    var rh = _;
    rh.prototype.get = function(s) {
      var o = s.split("."), l = o[0], c = o[1], d = this[l]();
      if (c) {
        var g = l.indexOf(c) - (l.substr(0, 2) === "ok" ? 2 : 0);
        if (g > -1)
          return d[g];
        throw new Error("unknown channel " + c + " in mode " + l);
      } else
        return d;
    };
    var De = _, nh = T.type, sh = Math.pow, ih = 1e-7, ah = 20;
    De.prototype.luminance = function(s) {
      if (s !== void 0 && nh(s) === "number") {
        if (s === 0)
          return new De([0, 0, 0, this._rgb[3]], "rgb");
        if (s === 1)
          return new De([255, 255, 255, this._rgb[3]], "rgb");
        var o = this.luminance(), l = "rgb", c = ah, d = function(f, m) {
          var b = f.interpolate(m, 0.5, l), w = b.luminance();
          return Math.abs(s - w) < ih || !c-- ? b : w > s ? d(f, b) : d(b, m);
        }, g = (o > s ? d(new De([0, 0, 0]), this) : d(this, new De([255, 255, 255]))).rgb();
        return new De(g.concat([this._rgb[3]]));
      }
      return oh.apply(void 0, this._rgb.slice(0, 3));
    };
    var oh = function(s, o, l) {
      return s = Vr(s), o = Vr(o), l = Vr(l), 0.2126 * s + 0.7152 * o + 0.0722 * l;
    }, Vr = function(s) {
      return s /= 255, s <= 0.03928 ? s / 12.92 : sh((s + 0.055) / 1.055, 2.4);
    }, Tt = {}, Ns = _, Ws = T.type, yr = Tt, Us = function(s, o, l) {
      l === void 0 && (l = 0.5);
      for (var c = [], d = arguments.length - 3; d-- > 0; ) c[d] = arguments[d + 3];
      var g = c[0] || "lrgb";
      if (!yr[g] && !c.length && (g = Object.keys(yr)[0]), !yr[g])
        throw new Error("interpolation mode " + g + " is not defined");
      return Ws(s) !== "object" && (s = new Ns(s)), Ws(o) !== "object" && (o = new Ns(o)), yr[g](s, o, l).alpha(s.alpha() + l * (o.alpha() - s.alpha()));
    }, qs = _, lh = Us;
    qs.prototype.mix = qs.prototype.interpolate = function(s, o) {
      o === void 0 && (o = 0.5);
      for (var l = [], c = arguments.length - 2; c-- > 0; ) l[c] = arguments[c + 2];
      return lh.apply(void 0, [this, s, o].concat(l));
    };
    var Gs = _;
    Gs.prototype.premultiply = function(s) {
      s === void 0 && (s = !1);
      var o = this._rgb, l = o[3];
      return s ? (this._rgb = [o[0] * l, o[1] * l, o[2] * l, l], this) : new Gs([o[0] * l, o[1] * l, o[2] * l, l], "rgb");
    };
    var Qr = _, hh = pr;
    Qr.prototype.saturate = function(s) {
      s === void 0 && (s = 1);
      var o = this, l = o.lch();
      return l[1] += hh.Kn * s, l[1] < 0 && (l[1] = 0), new Qr(l, "lch").alpha(o.alpha(), !0);
    }, Qr.prototype.desaturate = function(s) {
      return s === void 0 && (s = 1), this.saturate(-s);
    };
    var Xs = _, Hs = T.type;
    Xs.prototype.set = function(s, o, l) {
      l === void 0 && (l = !1);
      var c = s.split("."), d = c[0], g = c[1], f = this[d]();
      if (g) {
        var m = d.indexOf(g) - (d.substr(0, 2) === "ok" ? 2 : 0);
        if (m > -1) {
          if (Hs(o) == "string")
            switch (o.charAt(0)) {
              case "+":
                f[m] += +o;
                break;
              case "-":
                f[m] += +o;
                break;
              case "*":
                f[m] *= +o.substr(1);
                break;
              case "/":
                f[m] /= +o.substr(1);
                break;
              default:
                f[m] = +o;
            }
          else if (Hs(o) === "number")
            f[m] = o;
          else
            throw new Error("unsupported value for Color.set");
          var b = new Xs(f, d);
          return l ? (this._rgb = b._rgb, this) : b;
        }
        throw new Error("unknown channel " + g + " in mode " + d);
      } else
        return f;
    };
    var ch = _, uh = function(s, o, l) {
      var c = s._rgb, d = o._rgb;
      return new ch(
        c[0] + l * (d[0] - c[0]),
        c[1] + l * (d[1] - c[1]),
        c[2] + l * (d[2] - c[2]),
        "rgb"
      );
    };
    Tt.rgb = uh;
    var fh = _, Kr = Math.sqrt, Be = Math.pow, dh = function(s, o, l) {
      var c = s._rgb, d = c[0], g = c[1], f = c[2], m = o._rgb, b = m[0], w = m[1], x = m[2];
      return new fh(
        Kr(Be(d, 2) * (1 - l) + Be(b, 2) * l),
        Kr(Be(g, 2) * (1 - l) + Be(w, 2) * l),
        Kr(Be(f, 2) * (1 - l) + Be(x, 2) * l),
        "rgb"
      );
    };
    Tt.lrgb = dh;
    var ph = _, gh = function(s, o, l) {
      var c = s.lab(), d = o.lab();
      return new ph(
        c[0] + l * (d[0] - c[0]),
        c[1] + l * (d[1] - c[1]),
        c[2] + l * (d[2] - c[2]),
        "lab"
      );
    };
    Tt.lab = gh;
    var Ys = _, Ne = function(s, o, l, c) {
      var d, g, f, m;
      c === "hsl" ? (f = s.hsl(), m = o.hsl()) : c === "hsv" ? (f = s.hsv(), m = o.hsv()) : c === "hcg" ? (f = s.hcg(), m = o.hcg()) : c === "hsi" ? (f = s.hsi(), m = o.hsi()) : c === "lch" || c === "hcl" ? (c = "hcl", f = s.hcl(), m = o.hcl()) : c === "oklch" && (f = s.oklch().reverse(), m = o.oklch().reverse());
      var b, w, x, R, S, M;
      (c.substr(0, 1) === "h" || c === "oklch") && (d = f, b = d[0], x = d[1], S = d[2], g = m, w = g[0], R = g[1], M = g[2]);
      var L, B, U, G;
      return !isNaN(b) && !isNaN(w) ? (w > b && w - b > 180 ? G = w - (b + 360) : w < b && b - w > 180 ? G = w + 360 - b : G = w - b, B = b + l * G) : isNaN(b) ? isNaN(w) ? B = Number.NaN : (B = w, (S == 1 || S == 0) && c != "hsv" && (L = R)) : (B = b, (M == 1 || M == 0) && c != "hsv" && (L = x)), L === void 0 && (L = x + l * (R - x)), U = S + l * (M - S), c === "oklch" ? new Ys([U, L, B], c) : new Ys([B, L, U], c);
    }, vh = Ne, Zs = function(s, o, l) {
      return vh(s, o, l, "lch");
    };
    Tt.lch = Zs, Tt.hcl = Zs;
    var mh = _, bh = function(s, o, l) {
      var c = s.num(), d = o.num();
      return new mh(c + l * (d - c), "num");
    };
    Tt.num = bh;
    var yh = Ne, wh = function(s, o, l) {
      return yh(s, o, l, "hcg");
    };
    Tt.hcg = wh;
    var xh = Ne, Ch = function(s, o, l) {
      return xh(s, o, l, "hsi");
    };
    Tt.hsi = Ch;
    var Sh = Ne, kh = function(s, o, l) {
      return Sh(s, o, l, "hsl");
    };
    Tt.hsl = kh;
    var Th = Ne, Ph = function(s, o, l) {
      return Th(s, o, l, "hsv");
    };
    Tt.hsv = Ph;
    var Rh = _, Lh = function(s, o, l) {
      var c = s.oklab(), d = o.oklab();
      return new Rh(
        c[0] + l * (d[0] - c[0]),
        c[1] + l * (d[1] - c[1]),
        c[2] + l * (d[2] - c[2]),
        "oklab"
      );
    };
    Tt.oklab = Lh;
    var Mh = Ne, $h = function(s, o, l) {
      return Mh(s, o, l, "oklch");
    };
    Tt.oklch = $h;
    var tn = _, Oh = T.clip_rgb, en = Math.pow, rn = Math.sqrt, nn = Math.PI, Js = Math.cos, Vs = Math.sin, Ah = Math.atan2, zh = function(s, o, l) {
      o === void 0 && (o = "lrgb"), l === void 0 && (l = null);
      var c = s.length;
      l || (l = Array.from(new Array(c)).map(function() {
        return 1;
      }));
      var d = c / l.reduce(function(B, U) {
        return B + U;
      });
      if (l.forEach(function(B, U) {
        l[U] *= d;
      }), s = s.map(function(B) {
        return new tn(B);
      }), o === "lrgb")
        return Fh(s, l);
      for (var g = s.shift(), f = g.get(o), m = [], b = 0, w = 0, x = 0; x < f.length; x++)
        if (f[x] = (f[x] || 0) * l[0], m.push(isNaN(f[x]) ? 0 : l[0]), o.charAt(x) === "h" && !isNaN(f[x])) {
          var R = f[x] / 180 * nn;
          b += Js(R) * l[0], w += Vs(R) * l[0];
        }
      var S = g.alpha() * l[0];
      s.forEach(function(B, U) {
        var G = B.get(o);
        S += B.alpha() * l[U + 1];
        for (var Z = 0; Z < f.length; Z++)
          if (!isNaN(G[Z]))
            if (m[Z] += l[U + 1], o.charAt(Z) === "h") {
              var pt = G[Z] / 180 * nn;
              b += Js(pt) * l[U + 1], w += Vs(pt) * l[U + 1];
            } else
              f[Z] += G[Z] * l[U + 1];
      });
      for (var M = 0; M < f.length; M++)
        if (o.charAt(M) === "h") {
          for (var L = Ah(w / m[M], b / m[M]) / nn * 180; L < 0; )
            L += 360;
          for (; L >= 360; )
            L -= 360;
          f[M] = L;
        } else
          f[M] = f[M] / m[M];
      return S /= c, new tn(f, o).alpha(S > 0.99999 ? 1 : S, !0);
    }, Fh = function(s, o) {
      for (var l = s.length, c = [0, 0, 0, 0], d = 0; d < s.length; d++) {
        var g = s[d], f = o[d] / l, m = g._rgb;
        c[0] += en(m[0], 2) * f, c[1] += en(m[1], 2) * f, c[2] += en(m[2], 2) * f, c[3] += m[3] * f;
      }
      return c[0] = rn(c[0]), c[1] = rn(c[1]), c[2] = rn(c[2]), c[3] > 0.9999999 && (c[3] = 1), new tn(Oh(c));
    }, zt = lt, We = T.type, Ih = Math.pow, sn = function(s) {
      var o = "rgb", l = zt("#ccc"), c = 0, d = [0, 1], g = [], f = [0, 0], m = !1, b = [], w = !1, x = 0, R = 1, S = !1, M = {}, L = !0, B = 1, U = function(k) {
        if (k = k || ["#fff", "#000"], k && We(k) === "string" && zt.brewer && zt.brewer[k.toLowerCase()] && (k = zt.brewer[k.toLowerCase()]), We(k) === "array") {
          k.length === 1 && (k = [k[0], k[0]]), k = k.slice(0);
          for (var F = 0; F < k.length; F++)
            k[F] = zt(k[F]);
          g.length = 0;
          for (var W = 0; W < k.length; W++)
            g.push(W / (k.length - 1));
        }
        return Ct(), b = k;
      }, G = function(k) {
        if (m != null) {
          for (var F = m.length - 1, W = 0; W < F && k >= m[W]; )
            W++;
          return W - 1;
        }
        return 0;
      }, Z = function(k) {
        return k;
      }, pt = function(k) {
        return k;
      }, dt = function(k, F) {
        var W, N;
        if (F == null && (F = !1), isNaN(k) || k === null)
          return l;
        if (F)
          N = k;
        else if (m && m.length > 2) {
          var gt = G(k);
          N = gt / (m.length - 2);
        } else R !== x ? N = (k - x) / (R - x) : N = 1;
        N = pt(N), F || (N = Z(N)), B !== 1 && (N = Ih(N, B)), N = f[0] + N * (1 - f[0] - f[1]), N = Math.min(1, Math.max(0, N));
        var tt = Math.floor(N * 1e4);
        if (L && M[tt])
          W = M[tt];
        else {
          if (We(b) === "array")
            for (var X = 0; X < g.length; X++) {
              var J = g[X];
              if (N <= J) {
                W = b[X];
                break;
              }
              if (N >= J && X === g.length - 1) {
                W = b[X];
                break;
              }
              if (N > J && N < g[X + 1]) {
                N = (N - J) / (g[X + 1] - J), W = zt.interpolate(b[X], b[X + 1], N, o);
                break;
              }
            }
          else We(b) === "function" && (W = b(N));
          L && (M[tt] = W);
        }
        return W;
      }, Ct = function() {
        return M = {};
      };
      U(s);
      var q = function(k) {
        var F = zt(dt(k));
        return w && F[w] ? F[w]() : F;
      };
      return q.classes = function(k) {
        if (k != null) {
          if (We(k) === "array")
            m = k, d = [k[0], k[k.length - 1]];
          else {
            var F = zt.analyze(d);
            k === 0 ? m = [F.min, F.max] : m = zt.limits(F, "e", k);
          }
          return q;
        }
        return m;
      }, q.domain = function(k) {
        if (!arguments.length)
          return d;
        x = k[0], R = k[k.length - 1], g = [];
        var F = b.length;
        if (k.length === F && x !== R)
          for (var W = 0, N = Array.from(k); W < N.length; W += 1) {
            var gt = N[W];
            g.push((gt - x) / (R - x));
          }
        else {
          for (var tt = 0; tt < F; tt++)
            g.push(tt / (F - 1));
          if (k.length > 2) {
            var X = k.map(function(V, Q) {
              return Q / (k.length - 1);
            }), J = k.map(function(V) {
              return (V - x) / (R - x);
            });
            J.every(function(V, Q) {
              return X[Q] === V;
            }) || (pt = function(V) {
              if (V <= 0 || V >= 1)
                return V;
              for (var Q = 0; V >= J[Q + 1]; )
                Q++;
              var It = (V - J[Q]) / (J[Q + 1] - J[Q]), le = X[Q] + It * (X[Q + 1] - X[Q]);
              return le;
            });
          }
        }
        return d = [x, R], q;
      }, q.mode = function(k) {
        return arguments.length ? (o = k, Ct(), q) : o;
      }, q.range = function(k, F) {
        return U(k), q;
      }, q.out = function(k) {
        return w = k, q;
      }, q.spread = function(k) {
        return arguments.length ? (c = k, q) : c;
      }, q.correctLightness = function(k) {
        return k == null && (k = !0), S = k, Ct(), S ? Z = function(F) {
          for (var W = dt(0, !0).lab()[0], N = dt(1, !0).lab()[0], gt = W > N, tt = dt(F, !0).lab()[0], X = W + (N - W) * F, J = tt - X, V = 0, Q = 1, It = 20; Math.abs(J) > 0.01 && It-- > 0; )
            (function() {
              return gt && (J *= -1), J < 0 ? (V = F, F += (Q - F) * 0.5) : (Q = F, F += (V - F) * 0.5), tt = dt(F, !0).lab()[0], J = tt - X;
            })();
          return F;
        } : Z = function(F) {
          return F;
        }, q;
      }, q.padding = function(k) {
        return k != null ? (We(k) === "number" && (k = [k, k]), f = k, q) : f;
      }, q.colors = function(k, F) {
        arguments.length < 2 && (F = "hex");
        var W = [];
        if (arguments.length === 0)
          W = b.slice(0);
        else if (k === 1)
          W = [q(0.5)];
        else if (k > 1) {
          var N = d[0], gt = d[1] - N;
          W = Eh(0, k).map(function(Q) {
            return q(N + Q / (k - 1) * gt);
          });
        } else {
          s = [];
          var tt = [];
          if (m && m.length > 2)
            for (var X = 1, J = m.length, V = 1 <= J; V ? X < J : X > J; V ? X++ : X--)
              tt.push((m[X - 1] + m[X]) * 0.5);
          else
            tt = d;
          W = tt.map(function(Q) {
            return q(Q);
          });
        }
        return zt[F] && (W = W.map(function(Q) {
          return Q[F]();
        })), W;
      }, q.cache = function(k) {
        return k != null ? (L = k, q) : L;
      }, q.gamma = function(k) {
        return k != null ? (B = k, q) : B;
      }, q.nodata = function(k) {
        return k != null ? (l = zt(k), q) : l;
      }, q;
    };
    function Eh(s, o, l) {
      for (var c = [], d = s < o, g = o, f = s; d ? f < g : f > g; d ? f++ : f--)
        c.push(f);
      return c;
    }
    var Je = _, _h = sn, jh = function(s) {
      for (var o = [1, 1], l = 1; l < s; l++) {
        for (var c = [1], d = 1; d <= o.length; d++)
          c[d] = (o[d] || 0) + o[d - 1];
        o = c;
      }
      return o;
    }, Dh = function(s) {
      var o, l, c, d, g, f, m;
      if (s = s.map(function(S) {
        return new Je(S);
      }), s.length === 2)
        o = s.map(function(S) {
          return S.lab();
        }), g = o[0], f = o[1], d = function(S) {
          var M = [0, 1, 2].map(function(L) {
            return g[L] + S * (f[L] - g[L]);
          });
          return new Je(M, "lab");
        };
      else if (s.length === 3)
        l = s.map(function(S) {
          return S.lab();
        }), g = l[0], f = l[1], m = l[2], d = function(S) {
          var M = [0, 1, 2].map(function(L) {
            return (1 - S) * (1 - S) * g[L] + 2 * (1 - S) * S * f[L] + S * S * m[L];
          });
          return new Je(M, "lab");
        };
      else if (s.length === 4) {
        var b;
        c = s.map(function(S) {
          return S.lab();
        }), g = c[0], f = c[1], m = c[2], b = c[3], d = function(S) {
          var M = [0, 1, 2].map(function(L) {
            return (1 - S) * (1 - S) * (1 - S) * g[L] + 3 * (1 - S) * (1 - S) * S * f[L] + 3 * (1 - S) * S * S * m[L] + S * S * S * b[L];
          });
          return new Je(M, "lab");
        };
      } else if (s.length >= 5) {
        var w, x, R;
        w = s.map(function(S) {
          return S.lab();
        }), R = s.length - 1, x = jh(R), d = function(S) {
          var M = 1 - S, L = [0, 1, 2].map(function(B) {
            return w.reduce(function(U, G, Z) {
              return U + x[Z] * Math.pow(M, R - Z) * Math.pow(S, Z) * G[B];
            }, 0);
          });
          return new Je(L, "lab");
        };
      } else
        throw new RangeError("No point in running bezier with only one color.");
      return d;
    }, Bh = function(s) {
      var o = Dh(s);
      return o.scale = function() {
        return _h(o);
      }, o;
    }, an = lt, Ft = function(s, o, l) {
      if (!Ft[l])
        throw new Error("unknown blend mode " + l);
      return Ft[l](s, o);
    }, ae = function(s) {
      return function(o, l) {
        var c = an(l).rgb(), d = an(o).rgb();
        return an.rgb(s(c, d));
      };
    }, oe = function(s) {
      return function(o, l) {
        var c = [];
        return c[0] = s(o[0], l[0]), c[1] = s(o[1], l[1]), c[2] = s(o[2], l[2]), c;
      };
    }, Nh = function(s) {
      return s;
    }, Wh = function(s, o) {
      return s * o / 255;
    }, Uh = function(s, o) {
      return s > o ? o : s;
    }, qh = function(s, o) {
      return s > o ? s : o;
    }, Gh = function(s, o) {
      return 255 * (1 - (1 - s / 255) * (1 - o / 255));
    }, Xh = function(s, o) {
      return o < 128 ? 2 * s * o / 255 : 255 * (1 - 2 * (1 - s / 255) * (1 - o / 255));
    }, Hh = function(s, o) {
      return 255 * (1 - (1 - o / 255) / (s / 255));
    }, Yh = function(s, o) {
      return s === 255 ? 255 : (s = 255 * (o / 255) / (1 - s / 255), s > 255 ? 255 : s);
    };
    Ft.normal = ae(oe(Nh)), Ft.multiply = ae(oe(Wh)), Ft.screen = ae(oe(Gh)), Ft.overlay = ae(oe(Xh)), Ft.darken = ae(oe(Uh)), Ft.lighten = ae(oe(qh)), Ft.dodge = ae(oe(Yh)), Ft.burn = ae(oe(Hh));
    for (var Zh = Ft, on = T.type, Jh = T.clip_rgb, Vh = T.TWOPI, Qh = Math.pow, Kh = Math.sin, tc = Math.cos, Qs = lt, ec = function(s, o, l, c, d) {
      s === void 0 && (s = 300), o === void 0 && (o = -1.5), l === void 0 && (l = 1), c === void 0 && (c = 1), d === void 0 && (d = [0, 1]);
      var g = 0, f;
      on(d) === "array" ? f = d[1] - d[0] : (f = 0, d = [d, d]);
      var m = function(b) {
        var w = Vh * ((s + 120) / 360 + o * b), x = Qh(d[0] + f * b, c), R = g !== 0 ? l[0] + b * g : l, S = R * x * (1 - x) / 2, M = tc(w), L = Kh(w), B = x + S * (-0.14861 * M + 1.78277 * L), U = x + S * (-0.29227 * M - 0.90649 * L), G = x + S * (1.97294 * M);
        return Qs(Jh([B * 255, U * 255, G * 255, 1]));
      };
      return m.start = function(b) {
        return b == null ? s : (s = b, m);
      }, m.rotations = function(b) {
        return b == null ? o : (o = b, m);
      }, m.gamma = function(b) {
        return b == null ? c : (c = b, m);
      }, m.hue = function(b) {
        return b == null ? l : (l = b, on(l) === "array" ? (g = l[1] - l[0], g === 0 && (l = l[1])) : g = 0, m);
      }, m.lightness = function(b) {
        return b == null ? d : (on(b) === "array" ? (d = b, f = b[1] - b[0]) : (d = [b, b], f = 0), m);
      }, m.scale = function() {
        return Qs.scale(m);
      }, m.hue(l), m;
    }, rc = _, nc = "0123456789abcdef", sc = Math.floor, ic = Math.random, ac = function() {
      for (var s = "#", o = 0; o < 6; o++)
        s += nc.charAt(sc(ic() * 16));
      return new rc(s, "hex");
    }, ln = y, Ks = Math.log, oc = Math.pow, lc = Math.floor, hc = Math.abs, ti = function(s, o) {
      o === void 0 && (o = null);
      var l = {
        min: Number.MAX_VALUE,
        max: Number.MAX_VALUE * -1,
        sum: 0,
        values: [],
        count: 0
      };
      return ln(s) === "object" && (s = Object.values(s)), s.forEach(function(c) {
        o && ln(c) === "object" && (c = c[o]), c != null && !isNaN(c) && (l.values.push(c), l.sum += c, c < l.min && (l.min = c), c > l.max && (l.max = c), l.count += 1);
      }), l.domain = [l.min, l.max], l.limits = function(c, d) {
        return ei(l, c, d);
      }, l;
    }, ei = function(s, o, l) {
      o === void 0 && (o = "equal"), l === void 0 && (l = 7), ln(s) == "array" && (s = ti(s));
      var c = s.min, d = s.max, g = s.values.sort(function(cn, un) {
        return cn - un;
      });
      if (l === 1)
        return [c, d];
      var f = [];
      if (o.substr(0, 1) === "c" && (f.push(c), f.push(d)), o.substr(0, 1) === "e") {
        f.push(c);
        for (var m = 1; m < l; m++)
          f.push(c + m / l * (d - c));
        f.push(d);
      } else if (o.substr(0, 1) === "l") {
        if (c <= 0)
          throw new Error("Logarithmic scales are only possible for values > 0");
        var b = Math.LOG10E * Ks(c), w = Math.LOG10E * Ks(d);
        f.push(c);
        for (var x = 1; x < l; x++)
          f.push(oc(10, b + x / l * (w - b)));
        f.push(d);
      } else if (o.substr(0, 1) === "q") {
        f.push(c);
        for (var R = 1; R < l; R++) {
          var S = (g.length - 1) * R / l, M = lc(S);
          if (M === S)
            f.push(g[M]);
          else {
            var L = S - M;
            f.push(g[M] * (1 - L) + g[M + 1] * L);
          }
        }
        f.push(d);
      } else if (o.substr(0, 1) === "k") {
        var B, U = g.length, G = new Array(U), Z = new Array(l), pt = !0, dt = 0, Ct = null;
        Ct = [], Ct.push(c);
        for (var q = 1; q < l; q++)
          Ct.push(c + q / l * (d - c));
        for (Ct.push(d); pt; ) {
          for (var k = 0; k < l; k++)
            Z[k] = 0;
          for (var F = 0; F < U; F++)
            for (var W = g[F], N = Number.MAX_VALUE, gt = void 0, tt = 0; tt < l; tt++) {
              var X = hc(Ct[tt] - W);
              X < N && (N = X, gt = tt), Z[gt]++, G[F] = gt;
            }
          for (var J = new Array(l), V = 0; V < l; V++)
            J[V] = null;
          for (var Q = 0; Q < U; Q++)
            B = G[Q], J[B] === null ? J[B] = g[Q] : J[B] += g[Q];
          for (var It = 0; It < l; It++)
            J[It] *= 1 / Z[It];
          pt = !1;
          for (var le = 0; le < l; le++)
            if (J[le] !== Ct[le]) {
              pt = !0;
              break;
            }
          Ct = J, dt++, dt > 200 && (pt = !1);
        }
        for (var he = {}, Ue = 0; Ue < l; Ue++)
          he[Ue] = [];
        for (var qe = 0; qe < U; qe++)
          B = G[qe], he[B].push(g[qe]);
        for (var Zt = [], xe = 0; xe < l; xe++)
          Zt.push(he[xe][0]), Zt.push(he[xe][he[xe].length - 1]);
        Zt = Zt.sort(function(cn, un) {
          return cn - un;
        }), f.push(Zt[0]);
        for (var Ve = 1; Ve < Zt.length; Ve += 2) {
          var Ce = Zt[Ve];
          !isNaN(Ce) && f.indexOf(Ce) === -1 && f.push(Ce);
        }
      }
      return f;
    }, ri = { analyze: ti, limits: ei }, ni = _, cc = function(s, o) {
      s = new ni(s), o = new ni(o);
      var l = s.luminance(), c = o.luminance();
      return l > c ? (l + 0.05) / (c + 0.05) : (c + 0.05) / (l + 0.05);
    }, si = _, Yt = Math.sqrt, ht = Math.pow, uc = Math.min, fc = Math.max, ii = Math.atan2, ai = Math.abs, wr = Math.cos, oi = Math.sin, dc = Math.exp, li = Math.PI, pc = function(s, o, l, c, d) {
      l === void 0 && (l = 1), c === void 0 && (c = 1), d === void 0 && (d = 1);
      var g = function(Ce) {
        return 360 * Ce / (2 * li);
      }, f = function(Ce) {
        return 2 * li * Ce / 360;
      };
      s = new si(s), o = new si(o);
      var m = Array.from(s.lab()), b = m[0], w = m[1], x = m[2], R = Array.from(o.lab()), S = R[0], M = R[1], L = R[2], B = (b + S) / 2, U = Yt(ht(w, 2) + ht(x, 2)), G = Yt(ht(M, 2) + ht(L, 2)), Z = (U + G) / 2, pt = 0.5 * (1 - Yt(ht(Z, 7) / (ht(Z, 7) + ht(25, 7)))), dt = w * (1 + pt), Ct = M * (1 + pt), q = Yt(ht(dt, 2) + ht(x, 2)), k = Yt(ht(Ct, 2) + ht(L, 2)), F = (q + k) / 2, W = g(ii(x, dt)), N = g(ii(L, Ct)), gt = W >= 0 ? W : W + 360, tt = N >= 0 ? N : N + 360, X = ai(gt - tt) > 180 ? (gt + tt + 360) / 2 : (gt + tt) / 2, J = 1 - 0.17 * wr(f(X - 30)) + 0.24 * wr(f(2 * X)) + 0.32 * wr(f(3 * X + 6)) - 0.2 * wr(f(4 * X - 63)), V = tt - gt;
      V = ai(V) <= 180 ? V : tt <= gt ? V + 360 : V - 360, V = 2 * Yt(q * k) * oi(f(V) / 2);
      var Q = S - b, It = k - q, le = 1 + 0.015 * ht(B - 50, 2) / Yt(20 + ht(B - 50, 2)), he = 1 + 0.045 * F, Ue = 1 + 0.015 * F * J, qe = 30 * dc(-ht((X - 275) / 25, 2)), Zt = 2 * Yt(ht(F, 7) / (ht(F, 7) + ht(25, 7))), xe = -Zt * oi(2 * f(qe)), Ve = Yt(ht(Q / (l * le), 2) + ht(It / (c * he), 2) + ht(V / (d * Ue), 2) + xe * (It / (c * he)) * (V / (d * Ue)));
      return fc(0, uc(100, Ve));
    }, hi = _, gc = function(s, o, l) {
      l === void 0 && (l = "lab"), s = new hi(s), o = new hi(o);
      var c = s.get(l), d = o.get(l), g = 0;
      for (var f in c) {
        var m = (c[f] || 0) - (d[f] || 0);
        g += m * m;
      }
      return Math.sqrt(g);
    }, vc = _, mc = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      try {
        return new (Function.prototype.bind.apply(vc, [null].concat(s)))(), !0;
      } catch {
        return !1;
      }
    }, ci = lt, ui = sn, bc = {
      cool: function() {
        return ui([ci.hsl(180, 1, 0.9), ci.hsl(250, 0.7, 0.4)]);
      },
      hot: function() {
        return ui(["#000", "#f00", "#ff0", "#fff"]).mode("rgb");
      }
    }, xr = {
      // sequential
      OrRd: ["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"],
      PuBu: ["#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#045a8d", "#023858"],
      BuPu: ["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b"],
      Oranges: ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"],
      BuGn: ["#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#006d2c", "#00441b"],
      YlOrBr: ["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"],
      YlGn: ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#006837", "#004529"],
      Reds: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"],
      RdPu: ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177", "#49006a"],
      Greens: ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"],
      YlGnBu: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"],
      Purples: ["#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#54278f", "#3f007d"],
      GnBu: ["#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081"],
      Greys: ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525", "#000000"],
      YlOrRd: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"],
      PuRd: ["#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#980043", "#67001f"],
      Blues: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"],
      PuBuGn: ["#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016c59", "#014636"],
      Viridis: ["#440154", "#482777", "#3f4a8a", "#31678e", "#26838f", "#1f9d8a", "#6cce5a", "#b6de2b", "#fee825"],
      // diverging
      Spectral: ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"],
      RdYlGn: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"],
      RdBu: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"],
      PiYG: ["#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419"],
      PRGn: ["#40004b", "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837", "#00441b"],
      RdYlBu: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"],
      BrBG: ["#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30"],
      RdGy: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#ffffff", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a"],
      PuOr: ["#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b"],
      // qualitative
      Set2: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"],
      Accent: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17", "#666666"],
      Set1: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf", "#999999"],
      Set3: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"],
      Dark2: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d", "#666666"],
      Paired: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"],
      Pastel2: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc", "#cccccc"],
      Pastel1: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2"]
    }, hn = 0, fi = Object.keys(xr); hn < fi.length; hn += 1) {
      var di = fi[hn];
      xr[di.toLowerCase()] = xr[di];
    }
    var yc = xr, ft = lt;
    ft.average = zh, ft.bezier = Bh, ft.blend = Zh, ft.cubehelix = ec, ft.mix = ft.interpolate = Us, ft.random = ac, ft.scale = sn, ft.analyze = ri.analyze, ft.contrast = cc, ft.deltaE = pc, ft.distance = gc, ft.limits = ri.limits, ft.valid = mc, ft.scales = bc, ft.colors = Ts, ft.brewer = yc;
    var wc = ft;
    return wc;
  });
})(Bi);
var nt = Bi.exports;
const ge = (nt.Color.symbol = nt.Color.prototype.symbol = Symbol.for("@motion-canvas/core/types/Color"), nt.Color.lerp = nt.Color.prototype.lerp = (n, t, e, r = "lch") => {
  typeof n == "string" && (n = new nt.Color(n)), typeof t == "string" && (t = new nt.Color(t));
  const i = n instanceof nt.Color, a = t instanceof nt.Color;
  return i || (n = a ? t.alpha(0) : new nt.Color("rgba(0, 0, 0, 0)")), a || (t = i ? n.alpha(0) : new nt.Color("rgba(0, 0, 0, 0)")), nt.mix(n, t, e, r);
}, nt.Color.createLerp = nt.Color.prototype.createLerp = (n) => (t, e, r) => nt.Color.lerp(t, e, r, n), nt.Color.createSignal = (n, t = nt.Color.lerp) => new Me(n, t, void 0, (e) => new nt.Color(e)).toSignal(), nt.Color.prototype.toSymbol = () => nt.Color.symbol, nt.Color.prototype.toUniform = function(n, t) {
  n.uniform4fv(t, this.gl());
}, nt.Color.prototype.serialize = function() {
  return this.css();
}, nt.Color.prototype.lerp = function(n, t, e) {
  return nt.Color.lerp(this, n, t, e);
}, nt.Color);
function cu(n, t) {
  return v.fromDegrees(n).transform(t).degrees;
}
function mn(n, t) {
  return v.magnitude(t.m11, t.m12) * n;
}
class bn extends Rt {
  constructor() {
    super(...arguments), this.type = ge.symbol;
  }
  parse(t) {
    return t === null ? null : new ge(t);
  }
  serialize() {
    var t;
    return ((t = this.value.current) == null ? void 0 : t.serialize()) ?? null;
  }
}
class Le extends Rt {
  constructor(t, e, r = ((i) => (i = e[0]) == null ? void 0 : i.value)()) {
    super(t, r), this.options = e, this.type = Le.symbol;
  }
  set(t) {
    var e;
    super.set((e = this.getOption(t)) == null ? void 0 : e.value);
  }
  parse(t) {
    var e;
    return (e = this.getOption(t)) == null ? void 0 : e.value;
  }
  getOption(t) {
    return this.options.find((e) => e.value === t) ?? this.options[0];
  }
}
Le.symbol = Symbol.for("@motion-canvas/core/meta/EnumMetaField");
class uu extends Rt {
  /**
   * Triggered when the nested fields change.
   *
   * @eventProperty
   */
  get onFieldsChanged() {
    return this.fields.subscribable;
  }
  get options() {
    return this.optionFields[this.current];
  }
  constructor(t, e, r = 0) {
    var u, p;
    const i = e.plugins.flatMap((y) => {
      var C;
      return ((C = y.exporters) == null ? void 0 : C.call(y, e)) ?? [];
    }), a = i.map((y) => y.meta(e)), h = new Le("exporter", i.map((y) => ({
      value: y.id,
      text: y.displayName
    })), (u = i[r]) == null ? void 0 : u.id);
    super(t, {
      name: h.get(),
      options: (p = a[r]) == null ? void 0 : p.get()
    }), this.current = r, this.type = Object, this.handleChange = () => {
      var z, j, Y;
      const y = this.exporterField.get(), C = Math.max(this.exporters.findIndex((st) => st.id === y), 0);
      this.current !== C && ((z = this.options) == null || z.onChanged.unsubscribe(this.handleChange), this.current = C, (j = this.options) == null || j.onChanged.subscribe(this.handleChange, !1), this.fields.current = this.options ? [this.exporterField, this.options] : [this.exporterField]), this.value.current = {
        name: this.exporterField.get(),
        options: ((Y = this.options) == null ? void 0 : Y.get()) ?? null
      };
    }, this.exporters = i, this.exporterField = h, this.exporterField.onChanged.subscribe(this.handleChange, !1), this.exporterField.disable(a.length < 2).space(), this.optionFields = a, this.fields = new pe([this.exporterField]), this.options && (this.options.onChanged.subscribe(this.handleChange, !1), this.fields.current = [this.exporterField, this.options]);
  }
  set(t) {
    var e;
    this.exporterField.set(t.name), (e = this.options) == null || e.set(t.options ?? {});
  }
  serialize() {
    var t;
    return {
      name: this.exporterField.serialize(),
      options: ((t = this.options) == null ? void 0 : t.serialize()) ?? null
    };
  }
  clone() {
    return new this.constructor(this.name, this.exporters, this.current);
  }
}
var Ke;
class sr {
  constructor(t, e = !1) {
    this.name = t, this.source = e, this.lock = new kc(), this.ignoreChange = !1, this.cache = null, this.metaField = null, this.handleChanged = async () => {
    };
  }
  attach(t) {
    var e;
    this.metaField || (this.metaField = t, this.cache && this.metaField.set(this.cache), (e = this.metaField) == null || e.onChanged.subscribe(this.handleChanged));
  }
  async saveData(t) {
    if (this.source === !1)
      return;
    if (!this.source)
      throw new Error(`The meta file for ${this.name} is missing.`);
    if (Ke.sourceLookup[this.source])
      throw new Error(`Metadata for ${this.name} is already being updated`);
    const e = this.source;
    await new Promise((r, i) => {
      setTimeout(() => {
        delete Ke.sourceLookup[e], i(`Connection timeout when updating metadata for ${this.name}`);
      }, 1e3), Ke.sourceLookup[e] = () => {
        delete Ke.sourceLookup[e], r();
      }, (void 0).send("motion-canvas:meta", {
        source: e,
        data: t
      });
    });
  }
  /**
   * Load new metadata from a file.
   *
   * @remarks
   * This method is called during hot module replacement.
   *
   * @param data - New metadata.
   */
  loadData(t) {
    var e;
    this.ignoreChange = !0, this.cache = t, (e = this.metaField) == null || e.set(t), this.ignoreChange = !1;
  }
}
Ke = sr;
sr.sourceLookup = {};
class pn extends Rt {
  constructor() {
    super(...arguments), this.type = Number, this.presets = [];
  }
  parse(t) {
    let e = parseFloat(t);
    return this.min !== void 0 && e < this.min && (e = this.min), this.max !== void 0 && e > this.max && (e = this.max), e;
  }
  getPresets() {
    return this.presets;
  }
  setPresets(t) {
    return this.presets = t, this;
  }
  setRange(t, e) {
    return this.min = t, this.max = e, this;
  }
  getMin() {
    return this.min ?? -1 / 0;
  }
  getMax() {
    return this.max ?? 1 / 0;
  }
}
class zr extends Rt {
  constructor() {
    super(...arguments), this.type = zr.symbol;
  }
  parse(t) {
    return this.parseRange(1 / 0, t[0], t[1] ?? 1 / 0);
  }
  /**
   * Convert the given range from frames to seconds and update this field.
   *
   * @remarks
   * This helper method applies additional validation to the range, preventing
   * it from overflowing the timeline.
   *
   * @param startFrame - The beginning of the range.
   * @param endFrame - The end of the range.
   * @param duration - The current duration in frames.
   * @param fps - The current framerate.
   */
  update(t, e, r, i) {
    this.value.current = this.parseRange(r / i - tr, t / i - tr, e / i - tr);
  }
  parseRange(t, e = this.value.current[0], r = this.value.current[1]) {
    return e = xt(0, t, e), r = xt(0, t, r ?? 1 / 0), e > r && ([e, r] = [r, e]), r >= t && (r = 1 / 0), [e, r];
  }
}
zr.symbol = Symbol.for("@motion-canvas/core/meta/RangeMetaField");
class Ni extends Rt {
  constructor() {
    super(...arguments), this.type = v.symbol;
  }
  parse(t) {
    return new v(t);
  }
  serialize() {
    return this.value.current.serialize();
  }
}
let Rn;
Rn ?? (Rn = new sr("_build_project", !1));
Rn.loadData({
  version: 0
});
const fu = Rn;
let Ln;
Ln ?? (Ln = new sr("scene", !1));
Ln.loadData({
  version: 0
});
const du = Ln;
function pu(n) {
  var t;
  return !!((t = n.prototype) != null && t.isClass);
}
const Wi = Symbol.for("@motion-canvas/2d/fragment");
function $t(n, t, e) {
  const { ref: r, children: i, ...a } = t, h = Array.isArray(i) ? i.flat() : i;
  if (n === Wi)
    return h;
  if (pu(n)) {
    const u = new n({ ...a, children: h, key: e });
    return r == null || r(u), u;
  } else
    return n({ ...a, ref: r, children: h, key: e });
}
const Ti = {
  invert: {
    name: "invert"
  },
  sepia: {
    name: "sepia"
  },
  grayscale: {
    name: "grayscale"
  },
  brightness: {
    name: "brightness",
    default: 1
  },
  contrast: {
    name: "contrast",
    default: 1
  },
  saturate: {
    name: "saturate",
    default: 1
  },
  hue: {
    name: "hue-rotate",
    unit: "deg",
    scale: 1
  },
  blur: {
    name: "blur",
    transform: !0,
    unit: "px",
    scale: 1
  }
};
class gu {
  get name() {
    return this.props.name;
  }
  get default() {
    return this.props.default;
  }
  constructor(t) {
    this.props = {
      name: "invert",
      default: 0,
      unit: "%",
      scale: 100,
      transform: !1,
      ...t,
      value: t.value ?? t.default ?? 0
    }, this.value = $e(this.props.value, et, this);
  }
  isActive() {
    return this.value() !== this.props.default;
  }
  serialize(t) {
    let e = this.value();
    return this.props.transform && (e = mn(e, t)), `${this.props.name}(${e * this.props.scale}${this.props.unit})`;
  }
}
const Jt = Symbol.for("@motion-canvas/2d/decorators/initializers");
function ir(n, t) {
  if (!n[Jt])
    n[Jt] = [];
  else if (
    // if one of the prototypes has initializers
    n[Jt] && // and it's not the target object itself
    !Object.prototype.hasOwnProperty.call(n, Jt)
  ) {
    const e = Object.getPrototypeOf(n);
    n[Jt] = [...e[Jt]];
  }
  n[Jt].push(t);
}
function vu(n, t) {
  if (n[Jt])
    try {
      n[Jt].forEach((e) => e(n, t));
    } catch (e) {
      throw e.inspect ?? (e.inspect = n.key), e;
    }
}
function E() {
  return (n, t) => {
    ir(n, (e) => {
      const r = Object.getPrototypeOf(e)[t];
      e[t] = ou(r.bind(e), e);
    });
  };
}
function yn(n = {}, t, e) {
  const r = {};
  if (e && t) {
    const i = n.setter ?? (t == null ? void 0 : t[`set${Te(e)}`]);
    i && (r.setter = i.bind(t));
    const a = n.getter ?? (t == null ? void 0 : t[`get${Te(e)}`]);
    a && (r.getter = a.bind(t));
    const h = n.tweener ?? (t == null ? void 0 : t[`tween${Te(e)}`]);
    h && (r.tweener = h.bind(t));
  }
  return r;
}
const Vt = Symbol.for("@motion-canvas/2d/decorators/properties");
function Oe(n, t) {
  var e;
  return ((e = n[Vt]) == null ? void 0 : e[t]) ?? null;
}
function Mn(n, t) {
  let e;
  return n[Vt] ? n[Vt] && !Object.prototype.hasOwnProperty.call(n, Vt) ? n[Vt] = e = Object.fromEntries(Object.entries(n[Vt]).map(([r, i]) => [r, { ...i }])) : e = n[Vt] : n[Vt] = e = {}, e[t] ?? (e[t] = {
    cloneable: !0,
    inspectable: !0,
    compoundEntries: []
  }), e[t];
}
function Ui(n) {
  return n && typeof n == "object" ? n[Vt] ?? {} : {};
}
function $n(n, t) {
  vu(n);
  for (const [e, r] of Object.entries(Ui(n))) {
    const i = n[e];
    if (i.reset(), t[e] !== void 0 && i(t[e]), r.compoundEntries !== void 0)
      for (const [a, h] of r.compoundEntries)
        h in t && i[a](t[h]);
  }
}
function P() {
  return (n, t) => {
    const e = Mn(n, t);
    ir(n, (r) => {
      var u;
      let i = e.default;
      const a = r[`getDefault${Te(t)}`];
      a && (i = () => a.call(r, e.default));
      const h = new Me(i, e.interpolationFunction ?? Ye, r, (u = e.parser) == null ? void 0 : u.bind(r), yn(e, r, t));
      r[t] = h.toSignal();
    });
  };
}
function O(n) {
  return (t, e) => {
    const r = Oe(t, e);
    if (!r) {
      mt().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.default = n;
  };
}
function On(n) {
  return (t, e) => {
    const r = Oe(t, e);
    if (!r) {
      mt().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.interpolationFunction = n;
  };
}
function An(n) {
  return (t, e) => {
    const r = Oe(t, e);
    if (!r) {
      mt().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.parser = n;
  };
}
function ar(n) {
  return (t, e) => {
    const r = Oe(t, e);
    if (!r) {
      mt().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.parser = (i) => new n(i), "lerp" in n && (r.interpolationFunction ?? (r.interpolationFunction = n.lerp));
  };
}
function Ae(n = !0) {
  return (t, e) => {
    const r = Oe(t, e);
    if (!r) {
      mt().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.cloneable = n;
  };
}
function qi(n = !0) {
  return (t, e) => {
    const r = Oe(t, e);
    if (!r) {
      mt().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.inspectable = n;
  };
}
function Gi(n, t = Ar) {
  return (e, r) => {
    const i = Mn(e, r);
    i.compound = !0, i.compoundEntries = Object.entries(n), ir(e, (a) => {
      if (!i.parser) {
        mt().error(`Missing parser decorator for "${r.toString()}"`);
        return;
      }
      const h = i.default, u = i.parser.bind(a), p = new t(i.compoundEntries.map(([y, C]) => {
        const z = new Me(Re(h, (j) => u(j)[y]), et, a, void 0, yn(void 0, a, C)).toSignal();
        return [y, z];
      }), u, h, i.interpolationFunction ?? Ye, a, yn(i, a, r));
      a[r] = p.toSignal();
    });
  };
}
function ee(n) {
  return (t, e) => {
    Gi(typeof n == "object" ? n : {
      x: n ? `${n}X` : "x",
      y: n ? `${n}Y` : "y"
    }, Di)(t, e), ar(v)(t, e);
  };
}
var me = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (h = n[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
class Ht {
  constructor(t) {
    $n(this, t);
  }
  canvasGradient(t) {
    let e;
    switch (this.type()) {
      case "linear":
        e = t.createLinearGradient(this.from.x(), this.from.y(), this.to.x(), this.to.y());
        break;
      case "conic":
        e = t.createConicGradient(this.angle(), this.from.x(), this.from.y());
        break;
      case "radial":
        e = t.createRadialGradient(this.from.x(), this.from.y(), this.fromRadius(), this.to.x(), this.to.y(), this.toRadius());
        break;
    }
    for (const { offset: r, color: i } of this.stops())
      e.addColorStop(Xt(r), new ge(Xt(i)).serialize());
    return e;
  }
}
me([
  O("linear"),
  P()
], Ht.prototype, "type", void 0);
me([
  ee("from")
], Ht.prototype, "from", void 0);
me([
  ee("to")
], Ht.prototype, "to", void 0);
me([
  O(0),
  P()
], Ht.prototype, "angle", void 0);
me([
  O(0),
  P()
], Ht.prototype, "fromRadius", void 0);
me([
  O(0),
  P()
], Ht.prototype, "toRadius", void 0);
me([
  O([]),
  P()
], Ht.prototype, "stops", void 0);
me([
  E()
], Ht.prototype, "canvasGradient", null);
var zn = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (h = n[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
class or {
  constructor(t) {
    $n(this, t);
  }
  canvasPattern(t) {
    return t.createPattern(this.image(), this.repetition());
  }
}
zn([
  P()
], or.prototype, "image", void 0);
zn([
  O(null),
  P()
], or.prototype, "repetition", void 0);
zn([
  E()
], or.prototype, "canvasPattern", null);
function mu(n) {
  return n === null ? null : n instanceof Ht || n instanceof or ? n : new ge(n);
}
function wn(n, t) {
  return n === null ? "" : n instanceof ge ? n.serialize() : n instanceof Ht ? n.canvasGradient(t) : n instanceof or ? n.canvasPattern(t) ?? "" : "";
}
function Pi(n, t, e, r, i) {
  if (e.top === 0 && e.right === 0 && e.bottom === 0 && e.left === 0) {
    bu(n, t);
    return;
  }
  const a = fe(e.top, e.right, e.left, t), h = fe(e.right, e.top, e.bottom, t), u = fe(e.bottom, e.left, e.right, t), p = fe(e.left, e.bottom, e.top, t);
  if (r) {
    const y = (C) => {
      const z = C * i;
      return C - z;
    };
    n.moveTo(t.left + a, t.top), n.lineTo(t.right - h, t.top), n.bezierCurveTo(t.right - y(h), t.top, t.right, t.top + y(h), t.right, t.top + h), n.lineTo(t.right, t.bottom - u), n.bezierCurveTo(t.right, t.bottom - y(u), t.right - y(u), t.bottom, t.right - u, t.bottom), n.lineTo(t.left + p, t.bottom), n.bezierCurveTo(t.left + y(p), t.bottom, t.left, t.bottom - y(p), t.left, t.bottom - p), n.lineTo(t.left, t.top + a), n.bezierCurveTo(t.left, t.top + y(a), t.left + y(a), t.top, t.left + a, t.top);
    return;
  }
  n.moveTo(t.left + a, t.top), n.arcTo(t.right, t.top, t.right, t.bottom, h), n.arcTo(t.right, t.bottom, t.left, t.bottom, u), n.arcTo(t.left, t.bottom, t.left, t.top, p), n.arcTo(t.left, t.top, t.right, t.top, a);
}
function fe(n, t, e, r) {
  const i = n + t > r.width ? r.width * (n / (n + t)) : n, a = n + e > r.height ? r.height * (n / (n + e)) : n;
  return Math.min(i, a);
}
function bu(n, t) {
  n.rect(t.x, t.y, t.width, t.height);
}
function lr(n, t) {
  n.moveTo(t.x, t.y);
}
function qt(n, t) {
  n.lineTo(t.x, t.y);
}
function ce(n, t) {
  if (!(t.length < 2)) {
    lr(n, t[0]);
    for (const e of t.slice(1))
      qt(n, e);
  }
}
function Xi(n, t, e = 8) {
  qt(n, t.addY(-e)), qt(n, t.addY(e)), qt(n, t), qt(n, t.addX(-e)), Hi(n, t, e);
}
function Hi(n, t, e, r = 0, i = Math.PI * 2, a = !1) {
  n.arc(t.x, t.y, e, r, i, a);
}
function yu(n, t, e, r) {
  n.bezierCurveTo(t.x, t.y, e.x, e.y, r.x, r.y);
}
function Fn(n) {
  return (t) => t instanceof n;
}
function Yi() {
  return (n, t) => {
    P()(n, t), An(mu)(n, t), On(ge.lerp)(n, t), O(null)(n, t);
  };
}
function wu() {
  return (n, t) => {
    P()(n, t), ar(ge)(n, t);
  };
}
function be(n, t = (e) => e) {
  return (e, r) => {
    e[`getDefault${Te(r)}`] = function() {
      this.requestLayoutUpdate();
      const i = this.element.style[n];
      this.element.style[n] = "";
      const a = t.call(this, this.styles.getPropertyValue(n));
      return this.element.style[n] = i, a;
    };
  };
}
class xu extends Me {
  constructor(t, e) {
    super(t, Ye, e);
    for (const r in Ti) {
      const i = Ti[r];
      Object.defineProperty(this.invokable, r, {
        value: (a, h, u = Nt) => {
          var y, C, z;
          if (a === void 0)
            return ((C = (y = this.get()) == null ? void 0 : y.find((j) => j.name === i.name)) == null ? void 0 : C.value()) ?? i.default ?? 0;
          let p = (z = this.get()) == null ? void 0 : z.find((j) => j.name === i.name);
          return p || (p = new gu(i), this.set([...this.get(), p])), h === void 0 ? (p.value(a), this.owner) : p.value(a, h, u);
        }
      });
    }
  }
  *tweener(t, e, r) {
    const i = this.get(), a = Xt(t);
    if (Su(i, a)) {
      yield* Gt(...i.map((p, y) => p.value(a[y].value(), e, r))), this.set(a);
      return;
    }
    for (const p of a)
      p.value(p.default);
    const h = a.map((p) => p.value.context.raw()), u = i.length > 0 && a.length > 0 ? e / 2 : e;
    i.length > 0 && (yield* Gt(...i.map((p) => p.value(p.default, u, r)))), this.set(a), a.length > 0 && (yield* Gt(...a.map((p, y) => p.value(h[y], u, r))));
  }
}
function Cu() {
  return (n, t) => {
    const e = Mn(n, t);
    ir(n, (r) => {
      r[t] = new xu(e.default ?? [], r).toSignal();
    });
  };
}
function Su(n, t) {
  if (n.length !== t.length)
    return !1;
  for (let e = 0; e < n.length; e++)
    if (n[e].name !== t[e].name)
      return !1;
  return !0;
}
const ku = Symbol.for("@motion-canvas/2d/nodeName");
function re(n) {
  return function(t) {
    t.prototype[ku] = n;
  };
}
function Ri(n, t) {
  const e = xt(0, n.arcLength, t);
  let r = 0;
  for (const i of n.segments) {
    const a = r;
    if (r += i.arcLength, r >= e) {
      const h = (e - a) / i.arcLength;
      return i.getPoint(xt(0, 1, h));
    }
  }
  return { position: v.zero, tangent: v.up, normal: v.up };
}
function Fr(n) {
  return (t, e) => {
    Gi({
      top: n ? `${n}Top` : "top",
      right: n ? `${n}Right` : "right",
      bottom: n ? `${n}Bottom` : "bottom",
      left: n ? `${n}Left` : "left"
    })(t, e), ar(_t)(t, e);
  };
}
function Tu(n) {
  let t;
  return n ? typeof n == "string" ? t = [{ fragment: n }] : Array.isArray(n) ? t = n.map((e) => typeof e == "string" ? { fragment: e } : e) : t = [n] : t = [], !Sn().experimentalFeatures && t.length > 0 && (t = [], mt().log({
    ...Fc("Node uses experimental shaders."),
    inspect: this.key
  })), t;
}
function Sr() {
  return Sn();
}
var D = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (h = n[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, kr;
let I = kr = class {
  get x() {
    return this.position.x;
  }
  get y() {
    return this.position.y;
  }
  getAbsolutePosition() {
    return new v(this.parentToWorld().transformPoint(this.position()));
  }
  setAbsolutePosition(t) {
    this.position(Re(t, (e) => new v(e).transformAsPoint(this.worldToParent())));
  }
  getAbsoluteRotation() {
    const t = this.localToWorld();
    return v.degrees(t.m11, t.m12);
  }
  setAbsoluteRotation(t) {
    this.rotation(Re(t, (e) => cu(e, this.worldToParent())));
  }
  getAbsoluteScale() {
    const t = this.localToWorld();
    return new v(v.magnitude(t.m11, t.m12), v.magnitude(t.m21, t.m22));
  }
  setAbsoluteScale(t) {
    this.scale(Re(t, (e) => this.getRelativeScale(new v(e))));
  }
  getRelativeScale(t) {
    var r;
    const e = ((r = this.parent()) == null ? void 0 : r.absoluteScale()) ?? v.one;
    return t.div(e);
  }
  *tweenCompositeOperation(t, e, r) {
    const i = Xt(t);
    i === "source-over" ? (yield* this.compositeOverride(1, e, r), this.compositeOverride(0), this.compositeOperation(i)) : (this.compositeOperation(i), this.compositeOverride(1), yield* this.compositeOverride(0, e, r));
  }
  absoluteOpacity() {
    var t;
    return (((t = this.parent()) == null ? void 0 : t.absoluteOpacity()) ?? 1) * this.opacity();
  }
  hasFilters() {
    return !!this.filters().find((t) => t.isActive());
  }
  hasShadow() {
    return !!this.shadowColor() && (this.shadowBlur() > 0 || this.shadowOffset.x() !== 0 || this.shadowOffset.y() !== 0);
  }
  filterString() {
    let t = "";
    const e = this.compositeToWorld();
    for (const r of this.filters())
      r.isActive() && (t += " " + r.serialize(e));
    return t;
  }
  getSpawner() {
    return this.children();
  }
  setSpawner(t) {
    this.children(t);
  }
  setChildren(t) {
    if (this.children.context.raw() !== t) {
      if (this.children.context.setter(t), !Qt(t))
        this.spawnChildren(!1, t);
      else if (!this.hasSpawnedChildren)
        for (const e of this.realChildren)
          e.parent(null);
    }
  }
  getChildren() {
    return this.children.context.getter(), this.spawnedChildren();
  }
  spawnedChildren() {
    const t = this.children.context.getter();
    return Qt(this.children.context.raw()) && this.spawnChildren(!0, t), this.realChildren;
  }
  sortedChildren() {
    return [...this.children()].sort((t, e) => Math.sign(t.zIndex() - e.zIndex()));
  }
  constructor({ children: t, spawner: e, key: r, ...i }) {
    this.compositeOverride = $e(0), this.stateStack = [], this.realChildren = [], this.hasSpawnedChildren = !1, this.parent = $e(null), this.properties = Ui(this);
    const a = Sr();
    [this.key, this.unregister] = a.registerNode(this, r), this.view2D = a.getView(), this.creationStack = new Error().stack, $n(this, i), e && mt().warn({
      message: "Node.spawner() has been deprecated.",
      remarks: "Use <code>Node.children()</code> instead.",
      inspect: this.key,
      stack: new Error().stack
    }), this.children(e ?? t);
  }
  /**
   * Get the local-to-world matrix for this node.
   *
   * @remarks
   * This matrix transforms vectors from local space of this node to world
   * space.
   *
   * @example
   * Calculate the absolute position of a point located 200 pixels to the right
   * of the node:
   * ```ts
   * const local = new Vector2(0, 200);
   * const world = local.transformAsPoint(node.localToWorld());
   * ```
   */
  localToWorld() {
    const t = this.parent();
    return t ? t.localToWorld().multiply(this.localToParent()) : this.localToParent();
  }
  /**
   * Get the world-to-local matrix for this node.
   *
   * @remarks
   * This matrix transforms vectors from world space to local space of this
   * node.
   *
   * @example
   * Calculate the position relative to this node for a point located in the
   * top-left corner of the screen:
   * ```ts
   * const world = new Vector2(0, 0);
   * const local = world.transformAsPoint(node.worldToLocal());
   * ```
   */
  worldToLocal() {
    return this.localToWorld().inverse();
  }
  /**
   * Get the world-to-parent matrix for this node.
   *
   * @remarks
   * This matrix transforms vectors from world space to local space of this
   * node's parent.
   */
  worldToParent() {
    var t;
    return ((t = this.parent()) == null ? void 0 : t.worldToLocal()) ?? new DOMMatrix();
  }
  /**
   * Get the parent-to-world matrix for this node.
   *
   * @remarks
   * This matrix transforms vectors from local space of this node's parent to
   * world space.
   */
  parentToWorld() {
    var t;
    return ((t = this.parent()) == null ? void 0 : t.localToWorld()) ?? new DOMMatrix();
  }
  /**
   * Get the local-to-parent matrix for this node.
   *
   * @remarks
   * This matrix transforms vectors from local space of this node to local space
   * of this node's parent.
   */
  localToParent() {
    const t = new DOMMatrix();
    return t.translateSelf(this.x(), this.y()), t.rotateSelf(0, 0, this.rotation()), t.scaleSelf(this.scale.x(), this.scale.y()), t.skewXSelf(this.skew.x()), t.skewYSelf(this.skew.y()), t;
  }
  /**
   * A matrix mapping composite space to world space.
   *
   * @remarks
   * Certain effects such as blur and shadows ignore the current transformation.
   * This matrix can be used to transform their parameters so that the effect
   * appears relative to the closest composite root.
   */
  compositeToWorld() {
    var t;
    return ((t = this.compositeRoot()) == null ? void 0 : t.localToWorld()) ?? new DOMMatrix();
  }
  compositeRoot() {
    var t;
    return this.composite() ? this : ((t = this.parent()) == null ? void 0 : t.compositeRoot()) ?? null;
  }
  compositeToLocal() {
    const t = this.compositeRoot();
    if (t) {
      const e = this.worldToLocal();
      return e.m44 = 1, t.localToWorld().multiply(e);
    }
    return new DOMMatrix();
  }
  view() {
    return this.view2D;
  }
  /**
   * Add the given node(s) as the children of this node.
   *
   * @remarks
   * The nodes will be appended at the end of the children list.
   *
   * @example
   * ```tsx
   * const node = <Layout />;
   * node.add(<Rect />);
   * node.add(<Circle />);
   * ```
   * Result:
   * ```mermaid
   * graph TD;
   *   layout([Layout])
   *   circle([Circle])
   *   rect([Rect])
   *     layout-->rect;
   *     layout-->circle;
   * ```
   *
   * @param node - A node or an array of nodes to append.
   */
  add(t) {
    return this.insert(t, 1 / 0);
  }
  /**
   * Insert the given node(s) at the specified index in the children list.
   *
   * @example
   * ```tsx
   * const node = (
   *   <Layout>
   *     <Rect />
   *     <Circle />
   *   </Layout>
   * );
   *
   * node.insert(<Txt />, 1);
   * ```
   *
   * Result:
   * ```mermaid
   * graph TD;
   *   layout([Layout])
   *   circle([Circle])
   *   text([Text])
   *   rect([Rect])
   *     layout-->rect;
   *     layout-->text;
   *     layout-->circle;
   * ```
   *
   * @param node - A node or an array of nodes to insert.
   * @param index - An index at which to insert the node(s).
   */
  insert(t, e = 0) {
    const r = Array.isArray(t) ? t : [t];
    if (r.length === 0)
      return this;
    const i = this.children(), a = i.slice(0, e);
    for (const h of r)
      h instanceof kr && (a.push(h), h.remove(), h.parent(this));
    return a.push(...i.slice(e)), this.setParsedChildren(a), this;
  }
  /**
   * Remove this node from the tree.
   */
  remove() {
    const t = this.parent();
    return t === null ? this : (t.removeChild(this), this.parent(null), this);
  }
  /**
   * Rearrange this node in relation to its siblings.
   *
   * @remarks
   * Children are rendered starting from the beginning of the children list.
   * We can change the rendering order by rearranging said list.
   *
   * A positive `by` arguments move the node up (it will be rendered on top of
   * the elements it has passed). Negative values move it down.
   *
   * @param by - Number of places by which the node should be moved.
   */
  move(t = 1) {
    const e = this.parent();
    if (t === 0 || !e)
      return this;
    const r = e.children(), i = [];
    if (t > 0)
      for (let a = 0; a < r.length; a++) {
        const h = r[a];
        if (h === this) {
          const u = a + t;
          for (; a < u && a + 1 < r.length; a++)
            i[a] = r[a + 1];
        }
        i[a] = h;
      }
    else
      for (let a = r.length - 1; a >= 0; a--) {
        const h = r[a];
        if (h === this) {
          const u = a + t;
          for (; a > u && a > 0; a--)
            i[a] = r[a - 1];
        }
        i[a] = h;
      }
    return e.setParsedChildren(i), this;
  }
  /**
   * Move the node up in relation to its siblings.
   *
   * @remarks
   * The node will exchange places with the sibling right above it (if any) and
   * from then on will be rendered on top of it.
   */
  moveUp() {
    return this.move(1);
  }
  /**
   * Move the node down in relation to its siblings.
   *
   * @remarks
   * The node will exchange places with the sibling right below it (if any) and
   * from then on will be rendered under it.
   */
  moveDown() {
    return this.move(-1);
  }
  /**
   * Move the node to the top in relation to its siblings.
   *
   * @remarks
   * The node will be placed at the end of the children list and from then on
   * will be rendered on top of all of its siblings.
   */
  moveToTop() {
    return this.move(1 / 0);
  }
  /**
   * Move the node to the bottom in relation to its siblings.
   *
   * @remarks
   * The node will be placed at the beginning of the children list and from then
   * on will be rendered below all of its siblings.
   */
  moveToBottom() {
    return this.move(-1 / 0);
  }
  /**
   * Move the node to the provided position relative to its siblings.
   *
   * @remarks
   * If the node is getting moved to a lower position, it will be placed below
   * the sibling that's currently at the provided index (if any).
   * If the node is getting moved to a higher position, it will be placed above
   * the sibling that's currently at the provided index (if any).
   *
   * @param index - The index to move the node to.
   */
  moveTo(t) {
    const e = this.parent();
    if (!e)
      return this;
    const r = e.children().indexOf(this), i = t - r;
    return this.move(i);
  }
  /**
   * Move the node below the provided node in the parent's layout.
   *
   * @remarks
   * The node will be moved below the provided node and from then on will be
   * rendered below it. By default, if the node is already positioned lower than
   * the sibling node, it will not get moved.
   *
   * @param node - The sibling node below which to move.
   * @param directlyBelow - Whether the node should be positioned directly below
   *                        the sibling. When true, will move the node even if
   *                        it is already positioned below the sibling.
   */
  moveBelow(t, e = !1) {
    const r = this.parent();
    if (!r)
      return this;
    if (t.parent() !== r)
      return mt().error("Cannot position nodes relative to each other if they don't belong to the same parent."), this;
    const i = r.children(), a = i.indexOf(this), h = i.indexOf(t);
    if (!e && a < h)
      return this;
    const u = h - a - 1;
    return this.move(u);
  }
  /**
   * Move the node above the provided node in the parent's layout.
   *
   * @remarks
   * The node will be moved above the provided node and from then on will be
   * rendered on top of it. By default, if the node is already positioned
   * higher than the sibling node, it will not get moved.
   *
   * @param node - The sibling node below which to move.
   * @param directlyAbove - Whether the node should be positioned directly above the
   *                        sibling. When true, will move the node even if it is
   *                        already positioned above the sibling.
   */
  moveAbove(t, e = !1) {
    const r = this.parent();
    if (!r)
      return this;
    if (t.parent() !== r)
      return mt().error("Cannot position nodes relative to each other if they don't belong to the same parent."), this;
    const i = r.children(), a = i.indexOf(this), h = i.indexOf(t);
    if (!e && a > h)
      return this;
    const u = h - a + 1;
    return this.move(u);
  }
  /**
   * Change the parent of this node while keeping the absolute transform.
   *
   * @remarks
   * After performing this operation, the node will stay in the same place
   * visually, but its parent will be changed.
   *
   * @param newParent - The new parent of this node.
   */
  reparent(t) {
    const e = this.absolutePosition(), r = this.absoluteRotation(), i = this.absoluteScale();
    return t.add(this), this.absolutePosition(e), this.absoluteRotation(r), this.absoluteScale(i), this;
  }
  /**
   * Remove all children of this node.
   */
  removeChildren() {
    for (const t of this.realChildren)
      t.parent(null);
    return this.setParsedChildren([]), this;
  }
  /**
   * Get the current children of this node.
   *
   * @remarks
   * Unlike {@link children}, this method does not have any side effects.
   * It does not register the `children` signal as a dependency, and it does not
   * spawn any children. It can be used to safely retrieve the current state of
   * the scene graph for debugging purposes.
   */
  peekChildren() {
    return this.realChildren;
  }
  findAll(t) {
    const e = [], r = this.reversedChildren();
    for (; r.length > 0; ) {
      const i = r.pop();
      t(i) && e.push(i);
      const a = i.children();
      for (let h = a.length - 1; h >= 0; h--)
        r.push(a[h]);
    }
    return e;
  }
  findFirst(t) {
    const e = this.reversedChildren();
    for (; e.length > 0; ) {
      const r = e.pop();
      if (t(r))
        return r;
      const i = r.children();
      for (let a = i.length - 1; a >= 0; a--)
        e.push(i[a]);
    }
    return null;
  }
  findLast(t) {
    const e = [], r = this.reversedChildren();
    for (; r.length > 0; ) {
      const i = r.pop();
      e.push(i);
      const a = i.children();
      for (let h = a.length - 1; h >= 0; h--)
        r.push(a[h]);
    }
    for (; e.length > 0; ) {
      const i = e.pop();
      if (t(i))
        return i;
    }
    return null;
  }
  findAncestor(t) {
    let e = this.parent();
    for (; e; ) {
      if (t(e))
        return e;
      e = e.parent();
    }
    return null;
  }
  /**
   * Get the nth children cast to the specified type.
   *
   * @param index - The index of the child to retrieve.
   */
  childAs(t) {
    return this.children()[t] ?? null;
  }
  /**
   * Get the children array cast to the specified type.
   */
  childrenAs() {
    return this.children();
  }
  /**
   * Get the parent cast to the specified type.
   */
  parentAs() {
    return this.parent() ?? null;
  }
  /**
   * Prepare this node to be disposed of.
   *
   * @remarks
   * This method is called automatically when a scene is refreshed. It will
   * be called even if the node is not currently attached to the tree.
   *
   * The goal of this method is to clean any external references to allow the
   * node to be garbage collected.
   */
  dispose() {
    if (this.unregister) {
      this.stateStack = [], this.unregister(), this.unregister = null;
      for (const { signal: t } of this)
        t == null || t.context.dispose();
      for (const t of this.realChildren)
        t.dispose();
    }
  }
  /**
   * Create a copy of this node.
   *
   * @param customProps - Properties to override.
   */
  clone(t = {}) {
    const e = { ...t };
    Qt(this.children.context.raw()) ? e.children ?? (e.children = this.children.context.raw()) : this.children().length > 0 && (e.children ?? (e.children = this.children().map((r) => r.clone())));
    for (const { key: r, meta: i, signal: a } of this)
      if (!(!i.cloneable || r in e))
        if (i.compound)
          for (const [h, u] of i.compoundEntries) {
            if (u in e)
              continue;
            const p = a[h];
            p.context.isInitial() || (e[u] = p.context.raw());
          }
        else a.context.isInitial() || (e[r] = a.context.raw());
    return this.instantiate(e);
  }
  /**
   * Create a copy of this node.
   *
   * @remarks
   * Unlike {@link clone}, a snapshot clone calculates any reactive properties
   * at the moment of cloning and passes the raw values to the copy.
   *
   * @param customProps - Properties to override.
   */
  snapshotClone(t = {}) {
    const e = {
      ...this.getState(),
      ...t
    };
    return this.children().length > 0 && (e.children ?? (e.children = this.children().map((r) => r.snapshotClone()))), this.instantiate(e);
  }
  /**
   * Create a reactive copy of this node.
   *
   * @remarks
   * A reactive copy has all its properties dynamically updated to match the
   * source node.
   *
   * @param customProps - Properties to override.
   */
  reactiveClone(t = {}) {
    const e = { ...t };
    this.children().length > 0 && (e.children ?? (e.children = this.children().map((r) => r.reactiveClone())));
    for (const { key: r, meta: i, signal: a } of this)
      !i.cloneable || r in e || (e[r] = () => a());
    return this.instantiate(e);
  }
  /**
   * Create an instance of this node's class.
   *
   * @param props - Properties to pass to the constructor.
   */
  instantiate(t = {}) {
    return new this.constructor(t);
  }
  /**
   * Set the children without parsing them.
   *
   * @remarks
   * This method assumes that the caller took care of parsing the children and
   * updating the hierarchy.
   *
   * @param value - The children to set.
   */
  setParsedChildren(t) {
    this.children.context.setter(t), this.realChildren = t;
  }
  spawnChildren(t, e) {
    const r = this.parseChildren(e), i = /* @__PURE__ */ new Set();
    for (const a of r) {
      const h = a.parent.context.raw();
      h && h !== this && h.removeChild(a), i.add(a.key), a.parent(this);
    }
    for (const a of this.realChildren)
      i.has(a.key) || a.parent(null);
    this.hasSpawnedChildren = t, this.realChildren = r;
  }
  /**
   * Parse any `ComponentChildren` into an array of nodes.
   *
   * @param children - The children to parse.
   */
  parseChildren(t) {
    const e = [], r = Array.isArray(t) ? t : [t];
    for (const i of r)
      i instanceof kr && e.push(i);
    return e;
  }
  /**
   * Remove the given child.
   */
  removeChild(t) {
    this.setParsedChildren(this.children().filter((e) => e !== t));
  }
  /**
   * Whether this node should be cached or not.
   */
  requiresCache() {
    return this.cache() || this.opacity() < 1 || this.compositeOperation() !== "source-over" || this.hasFilters() || this.hasShadow() || this.shaders().length > 0;
  }
  cacheCanvas() {
    const t = document.createElement("canvas").getContext("2d");
    if (!t)
      throw new Error("Could not create a cache canvas");
    return t;
  }
  /**
   * Get a cache canvas with the contents of this node rendered onto it.
   */
  cachedCanvas() {
    const t = this.cacheCanvas(), e = this.worldSpaceCacheBBox(), r = this.localToWorld();
    return t.canvas.width = e.width, t.canvas.height = e.height, t.setTransform(r.a, r.b, r.c, r.d, r.e - e.x, r.f - e.y), this.draw(t), t;
  }
  /**
   * Get a bounding box for the contents rendered by this node.
   *
   * @remarks
   * The returned bounding box should be in local space.
   */
  getCacheBBox() {
    return new H();
  }
  /**
   * Get a bounding box for the contents rendered by this node as well
   * as its children.
   */
  cacheBBox() {
    const t = this.getCacheBBox(), e = this.children(), r = this.cachePadding();
    if (e.length === 0)
      return t.addSpacing(r);
    const i = t.corners;
    for (const h of e) {
      const u = h.fullCacheBBox(), p = h.localToParent();
      i.push(...u.corners.map((y) => y.transformAsPoint(p)));
    }
    return H.fromPoints(...i).addSpacing(r);
  }
  /**
   * Get a bounding box for the contents rendered by this node (including
   * effects applied after caching).
   *
   * @remarks
   * The returned bounding box should be in local space.
   */
  fullCacheBBox() {
    const t = this.compositeToLocal(), e = this.shadowOffset().transform(t), r = mn(this.shadowBlur(), t), i = this.cacheBBox().expand(this.filters.blur() * 2 + r);
    return e.x < 0 ? (i.x += e.x, i.width -= e.x) : i.width += e.x, e.y < 0 ? (i.y += e.y, i.height -= e.y) : i.height += e.y, i;
  }
  /**
   * Get a bounding box in world space for the contents rendered by this node as
   * well as its children.
   *
   * @remarks
   * This is the same the bounding box returned by {@link cacheBBox} only
   * transformed to world space.
   */
  worldSpaceCacheBBox() {
    const t = H.fromSizeCentered(this.view().size()).expand(this.view().cachePadding()), e = H.fromPoints(...t.transformCorners(this.view().localToWorld())), r = H.fromPoints(...this.cacheBBox().transformCorners(this.localToWorld()));
    return e.intersection(r).pixelPerfect.expand(2);
  }
  parentWorldSpaceCacheBBox() {
    var t;
    return ((t = this.findAncestor((e) => e.requiresCache())) == null ? void 0 : t.worldSpaceCacheBBox()) ?? new H(v.zero, Sr().getRealSize());
  }
  /**
   * Prepare the given context for drawing a cached node onto it.
   *
   * @remarks
   * This method is called before the contents of the cache canvas are drawn
   * on the screen. It can be used to apply effects to the entire node together
   * with its children, instead of applying them individually.
   * Effects such as transparency, shadows, and filters use this technique.
   *
   * Whether the node is cached is decided by the {@link requiresCache} method.
   *
   * @param context - The context using which the cache will be drawn.
   */
  setupDrawFromCache(t) {
    if (t.globalCompositeOperation = this.compositeOperation(), t.globalAlpha *= this.opacity(), this.hasFilters() && (t.filter = this.filterString()), this.hasShadow()) {
      const r = this.compositeToWorld(), i = this.shadowOffset().transform(r), a = mn(this.shadowBlur(), r);
      t.shadowColor = this.shadowColor().serialize(), t.shadowBlur = a, t.shadowOffsetX = i.x, t.shadowOffsetY = i.y;
    }
    const e = this.worldToLocal();
    t.transform(e.a, e.b, e.c, e.d, e.e, e.f);
  }
  renderFromSource(t, e, r, i) {
    this.setupDrawFromCache(t);
    const a = this.compositeOverride();
    t.drawImage(e, r, i), a > 0 && (t.save(), t.globalAlpha *= a, t.globalCompositeOperation = "source-over", t.drawImage(e, r, i), t.restore());
  }
  shaderCanvas(t, e) {
    var z, j;
    const r = this.shaders();
    if (r.length === 0)
      return null;
    const i = Sr(), a = i.getRealSize(), h = this.parentWorldSpaceCacheBBox(), u = new DOMMatrix().scaleSelf(a.width / h.width, a.height / -h.height).translateSelf(h.x / -a.width, h.y / a.height - 1), p = this.worldSpaceCacheBBox(), y = new DOMMatrix().scaleSelf(a.width / p.width, a.height / -p.height).translateSelf(p.x / -a.width, p.y / a.height - 1).invertSelf(), C = i.shaders.getGL();
    i.shaders.copyTextures(t, e), i.shaders.clear();
    for (const Y of r) {
      const st = i.shaders.getProgram(Y.fragment);
      if (st) {
        if (Y.uniforms)
          for (const [T, K] of Object.entries(Y.uniforms)) {
            const yt = C.getUniformLocation(st, T);
            if (yt === null)
              continue;
            const rt = Xt(K);
            typeof rt == "number" ? C.uniform1f(yt, rt) : "toUniform" in rt ? rt.toUniform(C, yt) : rt.length === 1 ? C.uniform1f(yt, rt[0]) : rt.length === 2 ? C.uniform2f(yt, rt[0], rt[1]) : rt.length === 3 ? C.uniform3f(yt, rt[0], rt[1], rt[2]) : rt.length === 4 && C.uniform4f(yt, rt[0], rt[1], rt[2], rt[3]);
          }
        C.uniform1f(C.getUniformLocation(st, Si), this.view2D.globalTime()), C.uniform1i(C.getUniformLocation(st, Si), i.playback.frame), C.uniformMatrix4fv(C.getUniformLocation(st, Yc), !1, y.toFloat32Array()), C.uniformMatrix4fv(C.getUniformLocation(st, Zc), !1, u.toFloat32Array()), (z = Y.setup) == null || z.call(Y, C, st), i.shaders.render(), (j = Y.teardown) == null || j.call(Y, C, st);
      }
    }
    return C.canvas;
  }
  /**
   * Render this node onto the given canvas.
   *
   * @param context - The context to draw with.
   */
  render(t) {
    if (!(this.absoluteOpacity() <= 0)) {
      if (t.save(), this.transformContext(t), this.requiresCache()) {
        const e = this.worldSpaceCacheBBox();
        if (e.width !== 0 && e.height !== 0) {
          const r = this.cachedCanvas().canvas, i = this.shaderCanvas(t.canvas, r);
          i ? this.renderFromSource(t, i, 0, 0) : this.renderFromSource(t, r, e.position.x, e.position.y);
        }
      } else
        this.draw(t);
      t.restore();
    }
  }
  /**
   * Draw this node onto the canvas.
   *
   * @remarks
   * This method is used when drawing directly onto the screen as well as onto
   * the cache canvas.
   * It assumes that the context have already been transformed to local space.
   *
   * @param context - The context to draw with.
   */
  draw(t) {
    this.drawChildren(t);
  }
  drawChildren(t) {
    for (const e of this.sortedChildren())
      e.render(t);
  }
  /**
   * Draw an overlay for this node.
   *
   * @remarks
   * The overlay for the currently inspected node is displayed on top of the
   * canvas.
   *
   * The provided context is in screen space. The local-to-screen matrix can be
   * used to transform all shapes that need to be displayed.
   * This approach allows to keep the line widths and gizmo sizes consistent,
   * no matter how zoomed-in the view is.
   *
   * @param context - The context to draw with.
   * @param matrix - A local-to-screen matrix.
   */
  drawOverlay(t, e) {
    const r = this.cacheBBox().transformCorners(e), i = this.getCacheBBox().transformCorners(e);
    t.strokeStyle = "white", t.lineWidth = 1, t.beginPath(), ce(t, r), t.closePath(), t.stroke(), t.strokeStyle = "blue", t.beginPath(), ce(t, i), t.closePath(), t.stroke();
  }
  transformContext(t) {
    const e = this.localToParent();
    t.transform(e.a, e.b, e.c, e.d, e.e, e.f);
  }
  /**
   * Try to find a node intersecting the given position.
   *
   * @param position - The searched position.
   */
  hit(t) {
    let e = null;
    const r = t.transformAsPoint(this.localToParent().inverse()), i = this.children();
    for (let a = i.length - 1; a >= 0 && (e = i[a].hit(r), !e); a--)
      ;
    return e;
  }
  /**
   * Collect all asynchronous resources used by this node.
   */
  collectAsyncResources() {
    for (const t of this.children())
      t.collectAsyncResources();
  }
  /**
   * Wait for any asynchronous resources that this node or its children have.
   *
   * @remarks
   * Certain resources like images are always loaded asynchronously.
   * Awaiting this method makes sure that all such resources are done loading
   * before continuing the animation.
   */
  async toPromise() {
    do
      await ut.consumePromises(), this.collectAsyncResources();
    while (ut.hasPromises());
    return this;
  }
  /**
   * Return a snapshot of the node's current signal values.
   *
   * @remarks
   * This method will calculate the values of any reactive properties of the
   * node at the time the method is called.
   */
  getState() {
    const t = {};
    for (const { key: e, meta: r, signal: i } of this)
      !r.cloneable || e in t || (t[e] = i());
    return t;
  }
  applyState(t, e, r = Nt) {
    if (e === void 0)
      for (const a in t) {
        const h = this.signalByKey(a);
        h && h(t[a]);
      }
    const i = [];
    for (const a in t) {
      const h = this.signalByKey(a);
      t[a] !== h.context.raw() && i.push(h(t[a], e, r));
    }
    return Gt(...i);
  }
  /**
   * Push a snapshot of the node's current state onto the node's state stack.
   *
   * @remarks
   * This method can be used together with the {@link restore} method to save a
   * node's current state and later restore it. It is possible to store more
   * than one state by calling `save` method multiple times.
   */
  save() {
    this.stateStack.push(this.getState());
  }
  restore(t, e = Nt) {
    const r = this.stateStack.pop();
    if (r !== void 0)
      return this.applyState(r, t, e);
  }
  *[Symbol.iterator]() {
    for (const t in this.properties) {
      const e = this.properties[t], r = this.signalByKey(t);
      yield { meta: e, signal: r, key: t };
    }
  }
  signalByKey(t) {
    return this[t];
  }
  reversedChildren() {
    const t = this.children(), e = [];
    for (let r = t.length - 1; r >= 0; r--)
      e.push(t[r]);
    return e;
  }
};
D([
  ee()
], I.prototype, "position", void 0);
D([
  ar(v),
  Ae(!1),
  P()
], I.prototype, "absolutePosition", void 0);
D([
  O(0),
  P()
], I.prototype, "rotation", void 0);
D([
  Ae(!1),
  P()
], I.prototype, "absoluteRotation", void 0);
D([
  O(v.one),
  ee("scale")
], I.prototype, "scale", void 0);
D([
  O(v.zero),
  ee("skew")
], I.prototype, "skew", void 0);
D([
  ar(v),
  Ae(!1),
  P()
], I.prototype, "absoluteScale", void 0);
D([
  O(0),
  P()
], I.prototype, "zIndex", void 0);
D([
  O(!1),
  P()
], I.prototype, "cache", void 0);
D([
  Fr("cachePadding")
], I.prototype, "cachePadding", void 0);
D([
  O(!1),
  P()
], I.prototype, "composite", void 0);
D([
  O("source-over"),
  P()
], I.prototype, "compositeOperation", void 0);
D([
  ot()
], I.prototype, "tweenCompositeOperation", null);
D([
  O(1),
  An((n) => xt(0, 1, n)),
  P()
], I.prototype, "opacity", void 0);
D([
  E()
], I.prototype, "absoluteOpacity", null);
D([
  Cu()
], I.prototype, "filters", void 0);
D([
  O("#0000"),
  wu()
], I.prototype, "shadowColor", void 0);
D([
  O(0),
  P()
], I.prototype, "shadowBlur", void 0);
D([
  ee("shadowOffset")
], I.prototype, "shadowOffset", void 0);
D([
  O([]),
  An(Tu),
  P()
], I.prototype, "shaders", void 0);
D([
  E()
], I.prototype, "hasFilters", null);
D([
  E()
], I.prototype, "hasShadow", null);
D([
  E()
], I.prototype, "filterString", null);
D([
  qi(!1),
  Ae(!1),
  P()
], I.prototype, "spawner", void 0);
D([
  qi(!1),
  Ae(!1),
  P()
], I.prototype, "children", void 0);
D([
  E()
], I.prototype, "spawnedChildren", null);
D([
  E()
], I.prototype, "sortedChildren", null);
D([
  E()
], I.prototype, "localToWorld", null);
D([
  E()
], I.prototype, "worldToLocal", null);
D([
  E()
], I.prototype, "worldToParent", null);
D([
  E()
], I.prototype, "parentToWorld", null);
D([
  E()
], I.prototype, "localToParent", null);
D([
  E()
], I.prototype, "compositeToWorld", null);
D([
  E()
], I.prototype, "compositeRoot", null);
D([
  E()
], I.prototype, "compositeToLocal", null);
D([
  E()
], I.prototype, "cacheCanvas", null);
D([
  E()
], I.prototype, "cachedCanvas", null);
D([
  E()
], I.prototype, "cacheBBox", null);
D([
  E()
], I.prototype, "fullCacheBBox", null);
D([
  E()
], I.prototype, "worldSpaceCacheBBox", null);
D([
  E()
], I.prototype, "parentWorldSpaceCacheBBox", null);
I = kr = D([
  re("Node")
], I);
I.prototype.isClass = !0;
var A = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (h = n[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, Tr;
let $ = Tr = class extends I {
  get columnGap() {
    return this.gap.x;
  }
  get rowGap() {
    return this.gap.y;
  }
  getX() {
    return this.isLayoutRoot() ? this.x.context.getter() : this.computedPosition().x;
  }
  setX(t) {
    this.x.context.setter(t);
  }
  getY() {
    return this.isLayoutRoot() ? this.y.context.getter() : this.computedPosition().y;
  }
  setY(t) {
    this.y.context.setter(t);
  }
  get width() {
    return this.size.x;
  }
  get height() {
    return this.size.y;
  }
  getWidth() {
    return this.computedSize().width;
  }
  setWidth(t) {
    this.width.context.setter(t);
  }
  *tweenWidth(t, e, r, i) {
    const a = this.desiredSize().x, h = typeof a != "number" || typeof t != "number";
    let u;
    h ? u = this.size.x() : u = a;
    let p;
    h ? (this.size.x(t), p = this.size.x()) : p = t, this.size.x(u), h && this.lockSize(), yield* jt(e, (y) => this.size.x(i(u, p, r(y)))), this.size.x(t), h && this.releaseSize();
  }
  getHeight() {
    return this.computedSize().height;
  }
  setHeight(t) {
    this.height.context.setter(t);
  }
  *tweenHeight(t, e, r, i) {
    const a = this.desiredSize().y, h = typeof a != "number" || typeof t != "number";
    let u;
    h ? u = this.size.y() : u = a;
    let p;
    h ? (this.size.y(t), p = this.size.y()) : p = t, this.size.y(u), h && this.lockSize(), yield* jt(e, (y) => this.size.y(i(u, p, r(y)))), this.size.y(t), h && this.releaseSize();
  }
  /**
   * Get the desired size of this node.
   *
   * @remarks
   * This method can be used to control the size using external factors.
   * By default, the returned size is the same as the one declared by the user.
   */
  desiredSize() {
    return {
      x: this.width.context.getter(),
      y: this.height.context.getter()
    };
  }
  *tweenSize(t, e, r, i) {
    const a = this.desiredSize();
    let h;
    typeof a.x != "number" || typeof a.y != "number" ? h = this.size() : h = new v(a);
    let u;
    typeof t == "object" && typeof t.x == "number" && typeof t.y == "number" ? u = new v(t) : (this.size(t), u = this.size()), this.size(h), this.lockSize(), yield* jt(e, (p) => this.size(i(h, u, r(p)))), this.releaseSize(), this.size(t);
  }
  /**
   * Get the cardinal point corresponding to the given origin.
   *
   * @param origin - The origin or direction of the point.
   */
  cardinalPoint(t) {
    switch (t) {
      case at.TopLeft:
        return this.topLeft;
      case at.TopRight:
        return this.topRight;
      case at.BottomLeft:
        return this.bottomLeft;
      case at.BottomRight:
        return this.bottomRight;
      case at.Top:
      case St.Top:
        return this.top;
      case at.Bottom:
      case St.Bottom:
        return this.bottom;
      case at.Left:
      case St.Left:
        return this.left;
      case at.Right:
      case St.Right:
        return this.right;
      default:
        return this.middle;
    }
  }
  constructor(t) {
    super(t), this.element.dataset.motionCanvasKey = this.key;
  }
  lockSize() {
    this.sizeLockCounter(this.sizeLockCounter() + 1);
  }
  releaseSize() {
    this.sizeLockCounter(this.sizeLockCounter() - 1);
  }
  parentTransform() {
    return this.findAncestor(Fn(Tr));
  }
  anchorPosition() {
    const t = this.computedSize(), e = this.offset();
    return t.scale(0.5).mul(e);
  }
  /**
   * Get the resolved layout mode of this node.
   *
   * @remarks
   * When the mode is `null`, its value will be inherited from the parent.
   *
   * Use {@link layout} to get the raw mode set for this node (without
   * inheritance).
   */
  layoutEnabled() {
    var t;
    return this.layout() ?? ((t = this.parentTransform()) == null ? void 0 : t.layoutEnabled()) ?? !1;
  }
  isLayoutRoot() {
    var t;
    return !this.layoutEnabled() || !((t = this.parentTransform()) != null && t.layoutEnabled());
  }
  localToParent() {
    const t = super.localToParent(), e = this.offset();
    if (!e.exactlyEquals(v.zero)) {
      const r = this.size().mul(e).scale(-0.5);
      t.translateSelf(r.x, r.y);
    }
    return t;
  }
  /**
   * A simplified version of {@link localToParent} matrix used for transforming
   * direction vectors.
   *
   * @internal
   */
  scalingRotationMatrix() {
    const t = new DOMMatrix();
    t.rotateSelf(0, 0, this.rotation()), t.scaleSelf(this.scale.x(), this.scale.y());
    const e = this.offset();
    if (!e.exactlyEquals(v.zero)) {
      const r = this.size().mul(e).scale(-0.5);
      t.translateSelf(r.x, r.y);
    }
    return t;
  }
  getComputedLayout() {
    return new H(this.element.getBoundingClientRect());
  }
  computedPosition() {
    this.requestLayoutUpdate();
    const t = this.getComputedLayout(), e = new v(t.x + t.width / 2 * this.offset.x(), t.y + t.height / 2 * this.offset.y()), r = this.parentTransform();
    if (r) {
      const i = r.getComputedLayout();
      e.x -= i.x + (i.width - t.width) / 2, e.y -= i.y + (i.height - t.height) / 2;
    }
    return e;
  }
  computedSize() {
    return this.requestLayoutUpdate(), this.getComputedLayout().size;
  }
  /**
   * Find the closest layout root and apply any new layout changes.
   */
  requestLayoutUpdate() {
    const t = this.parentTransform();
    this.appendedToView() ? (t == null || t.requestFontUpdate(), this.updateLayout()) : t.requestLayoutUpdate();
  }
  appendedToView() {
    const t = this.isLayoutRoot();
    return t && this.view().element.append(this.element), t;
  }
  /**
   * Apply any new layout changes to this node and its children.
   */
  updateLayout() {
    if (this.applyFont(), this.applyFlex(), this.layoutEnabled()) {
      const t = this.layoutChildren();
      for (const e of t)
        e.updateLayout();
    }
  }
  layoutChildren() {
    const t = [...this.children()], e = [], r = [];
    for (; t.length; ) {
      const i = t.shift();
      i instanceof Tr ? i.layoutEnabled() && (e.push(i), r.push(i.element)) : i && t.unshift(...i.children());
    }
    return this.element.replaceChildren(...r), e;
  }
  /**
   * Apply any new font changes to this node and all of its ancestors.
   */
  requestFontUpdate() {
    var t;
    this.appendedToView(), (t = this.parentTransform()) == null || t.requestFontUpdate(), this.applyFont();
  }
  getCacheBBox() {
    return H.fromSizeCentered(this.computedSize());
  }
  draw(t) {
    if (this.clip()) {
      const e = this.computedSize();
      if (e.width === 0 || e.height === 0)
        return;
      t.beginPath(), t.rect(e.width / -2, e.height / -2, e.width, e.height), t.closePath(), t.clip();
    }
    this.drawChildren(t);
  }
  drawOverlay(t, e) {
    const r = this.computedSize(), i = r.mul(this.offset()).scale(0.5).transformAsPoint(e), a = H.fromSizeCentered(r), h = a.transformCorners(e), u = a.addSpacing(this.padding().scale(-1)).transformCorners(e), p = a.addSpacing(this.margin()).transformCorners(e);
    t.beginPath(), ce(t, p), ce(t, h), t.closePath(), t.fillStyle = "rgba(255,193,125,0.6)", t.fill("evenodd"), t.beginPath(), ce(t, h), ce(t, u), t.closePath(), t.fillStyle = "rgba(180,255,147,0.6)", t.fill("evenodd"), t.beginPath(), ce(t, h), t.closePath(), t.lineWidth = 1, t.strokeStyle = "white", t.stroke(), t.beginPath(), Xi(t, i), t.stroke();
  }
  getOriginDelta(t) {
    const e = this.computedSize().scale(0.5), r = this.offset().mul(e);
    return t === at.Middle ? r.flipped : lu(t).mul(e).sub(r);
  }
  /**
   * Update the offset of this node and adjust the position to keep it in the
   * same place.
   *
   * @param offset - The new offset.
   */
  moveOffset(t) {
    const e = this.computedSize().scale(0.5), r = this.offset().mul(e), i = t.mul(e);
    this.offset(t), this.position(this.position().add(i).sub(r));
  }
  parsePixels(t) {
    return t === null ? "" : `${t}px`;
  }
  parseLength(t) {
    return t === null ? "" : typeof t == "string" ? t : `${t}px`;
  }
  applyFlex() {
    this.element.style.position = this.isLayoutRoot() ? "absolute" : "relative";
    const t = this.desiredSize();
    this.element.style.width = this.parseLength(t.x), this.element.style.height = this.parseLength(t.y), this.element.style.maxWidth = this.parseLength(this.maxWidth()), this.element.style.minWidth = this.parseLength(this.minWidth()), this.element.style.maxHeight = this.parseLength(this.maxHeight()), this.element.style.minHeight = this.parseLength(this.minHeight()), this.element.style.aspectRatio = this.ratio() === null ? "" : this.ratio().toString(), this.element.style.marginTop = this.parsePixels(this.margin.top()), this.element.style.marginBottom = this.parsePixels(this.margin.bottom()), this.element.style.marginLeft = this.parsePixels(this.margin.left()), this.element.style.marginRight = this.parsePixels(this.margin.right()), this.element.style.paddingTop = this.parsePixels(this.padding.top()), this.element.style.paddingBottom = this.parsePixels(this.padding.bottom()), this.element.style.paddingLeft = this.parsePixels(this.padding.left()), this.element.style.paddingRight = this.parsePixels(this.padding.right()), this.element.style.flexDirection = this.direction(), this.element.style.flexBasis = this.parseLength(this.basis()), this.element.style.flexWrap = this.wrap(), this.element.style.justifyContent = this.justifyContent(), this.element.style.alignContent = this.alignContent(), this.element.style.alignItems = this.alignItems(), this.element.style.alignSelf = this.alignSelf(), this.element.style.columnGap = this.parseLength(this.gap.x()), this.element.style.rowGap = this.parseLength(this.gap.y()), this.sizeLockCounter() > 0 ? (this.element.style.flexGrow = "0", this.element.style.flexShrink = "0") : (this.element.style.flexGrow = this.grow().toString(), this.element.style.flexShrink = this.shrink().toString());
  }
  applyFont() {
    if (this.element.style.fontFamily = this.fontFamily.isInitial() ? "" : this.fontFamily(), this.element.style.fontSize = this.fontSize.isInitial() ? "" : `${this.fontSize()}px`, this.element.style.fontStyle = this.fontStyle.isInitial() ? "" : this.fontStyle(), this.lineHeight.isInitial())
      this.element.style.lineHeight = "";
    else {
      const t = this.lineHeight();
      this.element.style.lineHeight = typeof t == "string" ? (parseFloat(t) / 100).toString() : `${t}px`;
    }
    if (this.element.style.fontWeight = this.fontWeight.isInitial() ? "" : this.fontWeight().toString(), this.element.style.letterSpacing = this.letterSpacing.isInitial() ? "" : `${this.letterSpacing()}px`, this.element.style.textAlign = this.textAlign.isInitial() ? "" : this.textAlign(), this.textWrap.isInitial())
      this.element.style.whiteSpace = "";
    else {
      const t = this.textWrap();
      typeof t == "boolean" ? this.element.style.whiteSpace = t ? "normal" : "nowrap" : this.element.style.whiteSpace = t;
    }
  }
  dispose() {
    var t;
    super.dispose(), (t = this.sizeLockCounter) == null || t.context.dispose(), this.element && (this.element.remove(), this.element.innerHTML = ""), this.element = null, this.styles = null;
  }
  hit(t) {
    const e = t.transformAsPoint(this.localToParent().inverse());
    return this.cacheBBox().includes(e) ? super.hit(t) ?? this : null;
  }
};
A([
  O(null),
  On(ru),
  P()
], $.prototype, "layout", void 0);
A([
  O(null),
  P()
], $.prototype, "maxWidth", void 0);
A([
  O(null),
  P()
], $.prototype, "maxHeight", void 0);
A([
  O(null),
  P()
], $.prototype, "minWidth", void 0);
A([
  O(null),
  P()
], $.prototype, "minHeight", void 0);
A([
  O(null),
  P()
], $.prototype, "ratio", void 0);
A([
  Fr("margin")
], $.prototype, "margin", void 0);
A([
  Fr("padding")
], $.prototype, "padding", void 0);
A([
  O("row"),
  P()
], $.prototype, "direction", void 0);
A([
  O(null),
  P()
], $.prototype, "basis", void 0);
A([
  O(0),
  P()
], $.prototype, "grow", void 0);
A([
  O(1),
  P()
], $.prototype, "shrink", void 0);
A([
  O("nowrap"),
  P()
], $.prototype, "wrap", void 0);
A([
  O("start"),
  P()
], $.prototype, "justifyContent", void 0);
A([
  O("normal"),
  P()
], $.prototype, "alignContent", void 0);
A([
  O("stretch"),
  P()
], $.prototype, "alignItems", void 0);
A([
  O("auto"),
  P()
], $.prototype, "alignSelf", void 0);
A([
  O(0),
  ee({ x: "columnGap", y: "rowGap" })
], $.prototype, "gap", void 0);
A([
  be("font-family"),
  P()
], $.prototype, "fontFamily", void 0);
A([
  be("font-size", parseFloat),
  P()
], $.prototype, "fontSize", void 0);
A([
  be("font-style"),
  P()
], $.prototype, "fontStyle", void 0);
A([
  be("font-weight", parseInt),
  P()
], $.prototype, "fontWeight", void 0);
A([
  be("line-height", parseFloat),
  P()
], $.prototype, "lineHeight", void 0);
A([
  be("letter-spacing", (n) => n === "normal" ? 0 : parseFloat(n)),
  P()
], $.prototype, "letterSpacing", void 0);
A([
  be("white-space", (n) => n === "pre" ? "pre" : n === "normal"),
  P()
], $.prototype, "textWrap", void 0);
A([
  O("inherit"),
  P()
], $.prototype, "textDirection", void 0);
A([
  be("text-align"),
  P()
], $.prototype, "textAlign", void 0);
A([
  O({ x: null, y: null }),
  ee({ x: "width", y: "height" })
], $.prototype, "size", void 0);
A([
  ot()
], $.prototype, "tweenWidth", null);
A([
  ot()
], $.prototype, "tweenHeight", null);
A([
  E()
], $.prototype, "desiredSize", null);
A([
  ot()
], $.prototype, "tweenSize", null);
A([
  ee("offset")
], $.prototype, "offset", void 0);
A([
  ne(at.Middle)
], $.prototype, "middle", void 0);
A([
  ne(at.Top)
], $.prototype, "top", void 0);
A([
  ne(at.Bottom)
], $.prototype, "bottom", void 0);
A([
  ne(at.Left)
], $.prototype, "left", void 0);
A([
  ne(at.Right)
], $.prototype, "right", void 0);
A([
  ne(at.TopLeft)
], $.prototype, "topLeft", void 0);
A([
  ne(at.TopRight)
], $.prototype, "topRight", void 0);
A([
  ne(at.BottomLeft)
], $.prototype, "bottomLeft", void 0);
A([
  ne(at.BottomRight)
], $.prototype, "bottomRight", void 0);
A([
  O(!1),
  P()
], $.prototype, "clip", void 0);
A([
  O(0),
  P()
], $.prototype, "sizeLockCounter", void 0);
A([
  E()
], $.prototype, "parentTransform", null);
A([
  E()
], $.prototype, "anchorPosition", null);
A([
  E()
], $.prototype, "layoutEnabled", null);
A([
  E()
], $.prototype, "isLayoutRoot", null);
A([
  E()
], $.prototype, "scalingRotationMatrix", null);
A([
  E()
], $.prototype, "computedPosition", null);
A([
  E()
], $.prototype, "computedSize", null);
A([
  E()
], $.prototype, "requestLayoutUpdate", null);
A([
  E()
], $.prototype, "appendedToView", null);
A([
  E()
], $.prototype, "updateLayout", null);
A([
  E()
], $.prototype, "layoutChildren", null);
A([
  E()
], $.prototype, "requestFontUpdate", null);
A([
  E()
], $.prototype, "applyFlex", null);
A([
  E()
], $.prototype, "applyFont", null);
$ = Tr = A([
  re("Layout")
], $);
function ne(n) {
  return (t, e) => {
    P()(t, e), Ae(!1)(t, e);
    const r = Oe(t, e);
    r.parser = (i) => new v(i), r.getter = function() {
      return this.computedSize().getOriginOffset(n).transformAsPoint(this.localToParent());
    }, r.setter = function(i) {
      return this.position(Re(i, (a) => this.getOriginDelta(n).transform(this.scalingRotationMatrix()).flipped.add(a))), this;
    };
  };
}
ir($.prototype, (n) => {
  n.element = document.createElement("div"), n.element.style.display = "flex", n.element.style.boxSizing = "border-box", n.styles = getComputedStyle(n.element);
});
var Lt = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (h = n[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
let bt = class extends $ {
  rippleSize() {
    return su(this.rippleStrength(), 0, 50);
  }
  constructor(t) {
    super(t), this.rippleStrength = $e(0);
  }
  applyText(t) {
    t.direction = this.textDirection(), this.element.dir = this.textDirection();
  }
  applyStyle(t) {
    t.fillStyle = wn(this.fill(), t), t.strokeStyle = wn(this.stroke(), t), t.lineWidth = this.lineWidth(), t.lineJoin = this.lineJoin(), t.lineCap = this.lineCap(), t.setLineDash(this.lineDash()), t.lineDashOffset = this.lineDashOffset(), this.antialiased() || (t.filter = "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxmaWx0ZXIgaWQ9ImZpbHRlciIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj48ZmVDb21wb25lbnRUcmFuc2Zlcj48ZmVGdW5jUiB0eXBlPSJpZGVudGl0eSIvPjxmZUZ1bmNHIHR5cGU9ImlkZW50aXR5Ii8+PGZlRnVuY0IgdHlwZT0iaWRlbnRpdHkiLz48ZmVGdW5jQSB0eXBlPSJkaXNjcmV0ZSIgdGFibGVWYWx1ZXM9IjAgMSIvPjwvZmVDb21wb25lbnRUcmFuc2Zlcj48L2ZpbHRlcj48L3N2Zz4=#filter)");
  }
  draw(t) {
    this.drawShape(t), this.clip() && t.clip(this.getPath()), this.drawChildren(t);
  }
  drawShape(t) {
    const e = this.getPath(), r = this.lineWidth() > 0 && this.stroke() !== null, i = this.fill() !== null;
    t.save(), this.applyStyle(t), this.drawRipple(t), this.strokeFirst() ? (r && t.stroke(e), i && t.fill(e)) : (i && t.fill(e), r && t.stroke(e)), t.restore();
  }
  getCacheBBox() {
    return super.getCacheBBox().expand(this.lineWidth() / 2);
  }
  getPath() {
    return new Path2D();
  }
  getRipplePath() {
    return new Path2D();
  }
  drawRipple(t) {
    const e = this.rippleStrength();
    if (e > 0) {
      const r = this.getRipplePath();
      t.save(), t.globalAlpha *= et(0.54, 0, e), t.fill(r), t.restore();
    }
  }
  *ripple(t = 1) {
    this.rippleStrength(0), yield* this.rippleStrength(1, t, iu), this.rippleStrength(0);
  }
};
Lt([
  Yi()
], bt.prototype, "fill", void 0);
Lt([
  Yi()
], bt.prototype, "stroke", void 0);
Lt([
  O(!1),
  P()
], bt.prototype, "strokeFirst", void 0);
Lt([
  O(0),
  P()
], bt.prototype, "lineWidth", void 0);
Lt([
  O("miter"),
  P()
], bt.prototype, "lineJoin", void 0);
Lt([
  O("butt"),
  P()
], bt.prototype, "lineCap", void 0);
Lt([
  O([]),
  P()
], bt.prototype, "lineDash", void 0);
Lt([
  O(0),
  P()
], bt.prototype, "lineDashOffset", void 0);
Lt([
  O(!0),
  P()
], bt.prototype, "antialiased", void 0);
Lt([
  E()
], bt.prototype, "rippleSize", null);
Lt([
  E()
], bt.prototype, "getPath", null);
Lt([
  ot()
], bt.prototype, "ripple", null);
bt = Lt([
  re("Shape")
], bt);
var Dt = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (h = n[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
let kt = class extends bt {
  desiredSize() {
    return this.childrenBBox().size;
  }
  constructor(t) {
    super(t), this.canHaveSubpath = !1;
  }
  /**
   * Convert a percentage along the curve to a distance.
   *
   * @remarks
   * The returned distance is given in relation to the full curve, not
   * accounting for {@link startOffset} and {@link endOffset}.
   *
   * @param value - The percentage along the curve.
   */
  percentageToDistance(t) {
    return xt(0, this.baseArcLength(), this.startOffset() + this.offsetArcLength() * t);
  }
  /**
   * Convert a distance along the curve to a percentage.
   *
   * @remarks
   * The distance should be given in relation to the full curve, not
   * accounting for {@link startOffset} and {@link endOffset}.
   *
   * @param value - The distance along the curve.
   */
  distanceToPercentage(t) {
    return (t - this.startOffset()) / this.offsetArcLength();
  }
  /**
   * The base arc length of this curve.
   *
   * @remarks
   * This is the entire length of this curve, not accounting for
   * {@link startOffset | the offsets}.
   */
  baseArcLength() {
    return this.profile().arcLength;
  }
  /**
   * The offset arc length of this curve.
   *
   * @remarks
   * This is the length of the curve that accounts for
   * {@link startOffset | the offsets}.
   */
  offsetArcLength() {
    const t = this.startOffset(), e = this.endOffset(), r = this.baseArcLength();
    return xt(0, r, r - t - e);
  }
  /**
   * The visible arc length of this curve.
   *
   * @remarks
   * This arc length accounts for both the offset and the {@link start} and
   * {@link end} properties.
   */
  arcLength() {
    return this.offsetArcLength() * Math.abs(this.start() - this.end());
  }
  /**
   * The percentage of the curve that's currently visible.
   *
   * @remarks
   * The returned value is the ratio between the visible length (as defined by
   * {@link start} and {@link end}) and the offset length of the curve.
   */
  completion() {
    return Math.abs(this.start() - this.end());
  }
  processSubpath(t, e, r) {
  }
  curveDrawingInfo() {
    const t = new Path2D();
    let e = new Path2D();
    const r = this.profile();
    let i = this.percentageToDistance(this.start()), a = this.percentageToDistance(this.end());
    i > a && ([i, a] = [a, i]);
    const h = a - i, u = Math.min(h / 2, this.arrowSize());
    this.startArrow() && (i += u / 2), this.endArrow() && (a -= u / 2);
    let p = 0, y = null, C = null, z = null, j = null;
    for (const Y of r.segments) {
      const st = p;
      if (p += Y.arcLength, p < i)
        continue;
      const T = (i - st) / Y.arcLength, K = (a - st) / Y.arcLength, yt = xt(0, 1, T), rt = xt(0, 1, K);
      this.canHaveSubpath && z && !Y.getPoint(0).position.equals(z) && (t.addPath(e), this.processSubpath(e, y, z), e = new Path2D(), y = null);
      const [se, Mt] = Y.draw(e, yt, rt, y === null);
      if (y === null && (y = se.position, C = se.normal.flipped.perpendicular), z = Mt.position, j = Mt.normal.flipped.perpendicular, p > a)
        break;
    }
    return this.closed() && this.start.isInitial() && this.end.isInitial() && this.startOffset.isInitial() && this.endOffset.isInitial() && e.closePath(), this.processSubpath(e, y, z), t.addPath(e), {
      startPoint: y ?? v.zero,
      startTangent: C ?? v.right,
      endPoint: z ?? v.zero,
      endTangent: j ?? v.right,
      arrowSize: u,
      path: t,
      startOffset: i
    };
  }
  getPointAtDistance(t) {
    return Ri(this.profile(), t + this.startOffset());
  }
  getPointAtPercentage(t) {
    return Ri(this.profile(), this.percentageToDistance(t));
  }
  getComputedLayout() {
    return this.offsetComputedLayout(super.getComputedLayout());
  }
  offsetComputedLayout(t) {
    return t.position = t.position.sub(this.childrenBBox().center), t;
  }
  getPath() {
    return this.curveDrawingInfo().path;
  }
  getCacheBBox() {
    const t = this.childrenBBox(), e = this.startArrow() || this.endArrow() ? this.arrowSize() : 0, r = this.lineWidth(), i = this.lineWidthCoefficient();
    return t.expand(Math.max(0, e, r * i));
  }
  lineWidthCoefficient() {
    return this.lineCap() === "square" ? 0.5 * 1.4143 : 0.5;
  }
  /**
   * Check if the path requires a profile.
   *
   * @remarks
   * The profile is only required if certain features are used. Otherwise, the
   * profile generation can be skipped, and the curve can be drawn directly
   * using the 2D context.
   */
  requiresProfile() {
    return !this.start.isInitial() || !this.startOffset.isInitial() || !this.startArrow.isInitial() || !this.end.isInitial() || !this.endOffset.isInitial() || !this.endArrow.isInitial();
  }
  drawShape(t) {
    super.drawShape(t), (this.startArrow() || this.endArrow()) && this.drawArrows(t);
  }
  drawArrows(t) {
    const { startPoint: e, startTangent: r, endPoint: i, endTangent: a, arrowSize: h } = this.curveDrawingInfo();
    h < 1e-3 || (t.save(), t.beginPath(), this.endArrow() && this.drawArrow(t, i, a.flipped, h), this.startArrow() && this.drawArrow(t, e, r, h), t.fillStyle = wn(this.stroke(), t), t.closePath(), t.fill(), t.restore());
  }
  drawArrow(t, e, r, i) {
    const a = r.perpendicular, h = e.add(r.scale(-i / 2));
    lr(t, h), qt(t, h.add(r.add(a).scale(i))), qt(t, h.add(r.sub(a).scale(i))), qt(t, h), t.closePath();
  }
};
Dt([
  O(!1),
  P()
], kt.prototype, "closed", void 0);
Dt([
  O(0),
  P()
], kt.prototype, "start", void 0);
Dt([
  O(0),
  P()
], kt.prototype, "startOffset", void 0);
Dt([
  O(!1),
  P()
], kt.prototype, "startArrow", void 0);
Dt([
  O(1),
  P()
], kt.prototype, "end", void 0);
Dt([
  O(0),
  P()
], kt.prototype, "endOffset", void 0);
Dt([
  O(!1),
  P()
], kt.prototype, "endArrow", void 0);
Dt([
  O(24),
  P()
], kt.prototype, "arrowSize", void 0);
Dt([
  E()
], kt.prototype, "arcLength", null);
Dt([
  E()
], kt.prototype, "curveDrawingInfo", null);
kt = Dt([
  re("Curve")
], kt);
class In {
}
class Zi extends In {
  constructor(t, e, r, i, a) {
    super(), this.center = t, this.radius = e, this.from = r, this.to = i, this.counter = a, this.angle = Math.acos(xt(-1, 1, r.dot(i))), this.length = Math.abs(this.angle * e);
    const h = new v(1, 1).scale(e);
    this.points = [t.sub(h), t.add(h)];
  }
  get arcLength() {
    return this.length;
  }
  draw(t, e, r) {
    const i = this.counter ? -1 : 1, a = this.from.radians + e * this.angle * i, h = this.to.radians - (1 - r) * this.angle * i;
    Math.abs(this.angle) > 1e-4 && t.arc(this.center.x, this.center.y, this.radius, a, h, this.counter);
    const u = v.fromRadians(a), p = v.fromRadians(h);
    return [
      {
        position: this.center.add(u.scale(this.radius)),
        tangent: this.counter ? u : u.flipped,
        normal: this.counter ? u.flipped : u
      },
      {
        position: this.center.add(p.scale(this.radius)),
        tangent: this.counter ? p.flipped : p,
        normal: this.counter ? p.flipped : p
      }
    ];
  }
  getPoint(t) {
    const e = this.counter ? -1 : 1, r = this.from.radians + t * this.angle * e, i = v.fromRadians(r);
    return {
      position: this.center.add(i.scale(this.radius)),
      tangent: this.counter ? i : i.flipped,
      normal: this.counter ? i : i.flipped
    };
  }
}
class wt {
  /**
   * Constructs a constant polynomial
   *
   * @param c0 - The constant coefficient
   */
  static constant(t) {
    return new wt(t);
  }
  /**
   * Constructs a linear polynomial
   *
   * @param c0 - The constant coefficient
   * @param c1 - The linear coefficient
   */
  static linear(t, e) {
    return new wt(t, e);
  }
  /**
   * Constructs a quadratic polynomial
   *
   * @param c0 - The constant coefficient
   * @param c1 - The linear coefficient
   * @param c2 - The quadratic coefficient
   */
  static quadratic(t, e, r) {
    return new wt(t, e, r);
  }
  /**
   * Constructs a cubic polynomial
   *
   * @param c0 - The constant coefficient
   * @param c1 - The linear coefficient
   * @param c2 - The quadratic coefficient
   * @param c3 - The cubic coefficient
   */
  static cubic(t, e, r, i) {
    return new wt(t, e, r, i);
  }
  /**
   * The degree of the polynomial
   */
  get degree() {
    return this.c3 !== 0 ? 3 : this.c2 !== 0 ? 2 : this.c1 !== 0 ? 1 : 0;
  }
  constructor(t, e, r, i) {
    this.c0 = t, this.c1 = e ?? 0, this.c2 = r ?? 0, this.c3 = i ?? 0;
  }
  /**
   * Return the nth derivative of the polynomial.
   *
   * @param n - The number of times to differentiate the polynomial.
   */
  differentiate(t = 1) {
    switch (t) {
      case 0:
        return this;
      case 1:
        return new wt(this.c1, 2 * this.c2, 3 * this.c3, 0);
      case 2:
        return new wt(2 * this.c2, 6 * this.c3, 0, 0);
      case 3:
        return new wt(6 * this.c3, 0, 0, 0);
      default:
        throw new Error("Unsupported derivative");
    }
  }
  eval(t, e = 0) {
    return e !== 0 ? this.differentiate(e).eval(t) : this.c3 * (t * t * t) + this.c2 * (t * t) + this.c1 * t + this.c0;
  }
  /**
   * Split the polynomial into two polynomials of the same overall shape.
   *
   * @param u - The point at which to split the polynomial.
   */
  split(t) {
    const e = 1 - t, r = new wt(this.c0, this.c1 * t, this.c2 * t * t, this.c3 * t * t * t), i = new wt(this.eval(0), e * this.differentiate(1).eval(t), e * e / 2 * this.differentiate(2).eval(t), e * e * e / 6 * this.differentiate(3).eval(t));
    return [r, i];
  }
  /**
   * Calculate the roots (values where this polynomial = 0).
   *
   * @remarks
   * Depending on the degree of the polynomial, returns between 0 and 3 results.
   */
  roots() {
    switch (this.degree) {
      case 3:
        return this.solveCubicRoots();
      case 2:
        return this.solveQuadraticRoots();
      case 1:
        return this.solveLinearRoot();
      case 0:
        return [];
      default:
        throw new Error(`Unsupported polynomial degree: ${this.degree}`);
    }
  }
  /**
   * Calculate the local extrema of the polynomial.
   */
  localExtrema() {
    return this.differentiate().roots();
  }
  /**
   * Calculate the local extrema of the polynomial in the unit interval.
   */
  localExtrema01() {
    const t = this.localExtrema(), e = [];
    for (let r = 0; r < t.length; r++) {
      const i = t[r];
      i >= 0 && i <= 1 && e.push(t[r]);
    }
    return e;
  }
  /**
   * Return the output value range within the unit interval.
   */
  outputRange01() {
    let t = [this.eval(0), this.eval(1)];
    const e = (r) => {
      t[1] > t[0] ? t = [Math.min(t[0], r), Math.max(t[1], r)] : t = [Math.min(t[1], r), Math.max(t[0], r)];
    };
    return this.localExtrema01().forEach((r) => e(this.eval(r))), t;
  }
  solveCubicRoots() {
    const t = this.c0, e = this.c1, r = this.c2, i = this.c3, a = t * t, h = t * r, u = e * e, p = (3 * h - u) / (3 * a), y = (2 * u * e - 9 * h * e + 27 * a * i) / (27 * a * t), C = this.solveDepressedCubicRoots(p, y), z = (j) => j - e / (3 * t);
    switch (C.length) {
      case 1:
        return [z(C[0])];
      case 2:
        return [z(C[0]), z(C[1])];
      case 3:
        return [
          z(C[0]),
          z(C[1]),
          z(C[2])
        ];
      default:
        return [];
    }
  }
  solveDepressedCubicRoots(t, e) {
    if (this.almostZero(t))
      return [Math.cbrt(-e)];
    const r = Math.PI * 2, i = 4 * t * t * t + 27 * e * e;
    if (i < 1e-5) {
      const a = 2 * Math.sqrt(-t / 3), h = 3 * e / (2 * t) * Math.sqrt(-3 / t), u = (p) => a * Math.cos(1 / 3 * Math.acos(xt(-1, 1, h)) - r / 3 * p);
      return h >= 0.9999 ? [u(0), u(2)] : h <= -0.9999 ? [u(1), u(2)] : [u(0), u(1), u(2)];
    }
    if (i > 0 && t < 0) {
      const a = 0.3333333333333333 * Math.acosh(-3 * Math.abs(e) / (2 * t) * Math.sqrt(-3 / t));
      return [-2 * Math.sign(e) * Math.sqrt(-t / 3) * Math.cosh(a)];
    }
    if (t > 0) {
      const a = 0.3333333333333333 * Math.asinh(3 * e / (2 * t) * Math.sqrt(3 / t));
      return [-2 * Math.sqrt(t / 3) * Math.sinh(a)];
    }
    return [];
  }
  solveQuadraticRoots() {
    const t = this.c2, e = this.c1, r = this.c0, i = e * e - 4 * t * r;
    if (this.almostZero(i))
      return [-e / (2 * t)];
    if (i >= 0) {
      const a = Math.sqrt(i), h = (-e - a) / (2 * t), u = (-e + a) / (2 * t);
      return [Math.min(h, u), Math.max(h, u)];
    }
    return [];
  }
  solveLinearRoot() {
    return [-this.c0 / this.c1];
  }
  almostZero(t) {
    return Math.abs(0 - t) <= Number.EPSILON;
  }
}
class er {
  constructor(t, e, r, i) {
    this.c0 = t, this.c1 = e, this.c2 = r, this.c3 = i, t instanceof wt ? (this.x = t, this.y = e) : i !== void 0 ? (this.x = new wt(t.x, e.x, r.x, i.x), this.y = new wt(t.y, e.y, r.y, i.y)) : (this.x = new wt(t.x, e.x, r.x), this.y = new wt(t.y, e.y, r.y));
  }
  eval(t, e = 0) {
    return new v(this.x.differentiate(e).eval(t), this.y.differentiate(e).eval(t));
  }
  split(t) {
    const [e, r] = this.x.split(t), [i, a] = this.y.split(t);
    return [new er(e, i), new er(r, a)];
  }
  differentiate(t = 1) {
    return new er(this.x.differentiate(t), this.y.differentiate(t));
  }
  evalDerivative(t) {
    return this.differentiate().eval(t);
  }
  /**
   * Calculate the tight axis-aligned bounds of the curve in the unit interval.
   */
  getBounds() {
    const t = this.x.outputRange01(), e = this.y.outputRange01();
    return H.fromPoints(new v(Math.min(...t), Math.max(...e)), new v(Math.max(...t), Math.min(...e)));
  }
}
class Pu {
  /**
   * @param curve - The curve to sample
   * @param samples - How many points to sample from the provided curve. The
   *                  more points get sampled, the higher the resolution–and
   *                  therefore precision–of the sampler.
   */
  constructor(t, e = 20) {
    this.curve = t, this.sampledDistances = [], this.resample(e);
  }
  /**
   * Discard all previously sampled points and resample the provided number of
   * points from the curve.
   *
   * @param samples - The number of points to sample.
   */
  resample(t) {
    this.sampledDistances = [0];
    let e = 0, r = this.curve.eval(0).position;
    for (let i = 1; i < t; i++) {
      const a = i / (t - 1), h = this.curve.eval(a), u = r.sub(h.position).magnitude;
      e += u, this.sampledDistances.push(e), r = h.position;
    }
    this.sampledDistances[this.sampledDistances.length - 1] = this.curve.arcLength;
  }
  /**
   * Return the point at the provided distance along the sampled curve's
   * arclength.
   *
   * @param distance - The distance along the curve's arclength for which to
   *                   retrieve the point.
   */
  pointAtDistance(t) {
    return this.curve.eval(this.distanceToT(t));
  }
  /**
   * Return the t value for the point at the provided distance along the sampled
   * curve's arc length.
   *
   * @param distance - The distance along the arclength
   */
  distanceToT(t) {
    const e = this.sampledDistances.length;
    t = xt(0, this.curve.arcLength, t);
    for (let r = 0; r < e; r++) {
      const i = this.sampledDistances[r], a = this.sampledDistances[r + 1];
      if (t >= i && t <= a)
        return nu(i, a, r / (e - 1), (r + 1) / (e - 1), t);
    }
    return 1;
  }
}
class Ru extends In {
  get arcLength() {
    return this.length;
  }
  constructor(t, e) {
    super(), this.curve = t, this.length = e, this.pointSampler = new Pu(this);
  }
  getBBox() {
    return this.curve.getBounds();
  }
  /**
   * Evaluate the polynomial at the given t value.
   *
   * @param t - The t value at which to evaluate the curve.
   */
  eval(t) {
    const e = this.tangent(t);
    return {
      position: this.curve.eval(t),
      tangent: e,
      normal: e.perpendicular
    };
  }
  getPoint(t) {
    const e = this.pointSampler.pointAtDistance(this.arcLength * t);
    return {
      position: e.position,
      tangent: e.tangent,
      normal: e.tangent.perpendicular
    };
  }
  transformPoints(t) {
    return this.points.map((e) => e.transformAsPoint(t));
  }
  /**
   * Return the tangent of the point that sits at the provided t value on the
   * curve.
   *
   * @param t - The t value at which to evaluate the curve.
   */
  tangent(t) {
    return this.curve.evalDerivative(t).normalized;
  }
  draw(t, e = 0, r = 1, i = !0) {
    let a = null, h = e, u = r, p = this.points;
    if (e !== 0 || r !== 1) {
      const z = this.length * e, j = this.length * r;
      h = this.pointSampler.distanceToT(z), u = this.pointSampler.distanceToT(j);
      const Y = (u - h) / (1 - h), [, st] = this.split(h);
      [a] = st.split(Y), p = a.points;
    }
    i && lr(t, p[0]), (a ?? this).doDraw(t);
    const y = this.tangent(h), C = this.tangent(u);
    return [
      {
        position: p[0],
        tangent: y,
        normal: y.perpendicular
      },
      {
        position: p.at(-1),
        tangent: C,
        normal: C.perpendicular
      }
    ];
  }
}
var Lu = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (h = n[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
class ue extends Ru {
  get points() {
    return [this.p0, this.p1, this.p2, this.p3];
  }
  constructor(t, e, r, i) {
    super(new er(
      t,
      // 3*(-p0+p1)
      t.flipped.add(e).scale(3),
      // 3*p0-6*p1+3*p2
      t.scale(3).sub(e.scale(6)).add(r.scale(3)),
      // -p0+3*p1-3*p2+p3
      t.flipped.add(e.scale(3)).sub(r.scale(3)).add(i)
    ), ue.getLength(t, e, r, i)), this.p0 = t, this.p1 = e, this.p2 = r, this.p3 = i;
  }
  split(t) {
    const e = new v(this.p0.x + (this.p1.x - this.p0.x) * t, this.p0.y + (this.p1.y - this.p0.y) * t), r = new v(this.p1.x + (this.p2.x - this.p1.x) * t, this.p1.y + (this.p2.y - this.p1.y) * t), i = new v(this.p2.x + (this.p3.x - this.p2.x) * t, this.p2.y + (this.p3.y - this.p2.y) * t), a = new v(e.x + (r.x - e.x) * t, e.y + (r.y - e.y) * t), h = new v(r.x + (i.x - r.x) * t, r.y + (i.y - r.y) * t), u = new v(a.x + (h.x - a.x) * t, a.y + (h.y - a.y) * t), p = new ue(this.p0, e, a, u), y = new ue(u, h, i, this.p3);
    return [p, y];
  }
  doDraw(t) {
    yu(t, this.p1, this.p2, this.p3);
  }
  static getLength(t, e, r, i) {
    return ue.el.setAttribute("d", `M ${t.x} ${t.y} C ${e.x} ${e.y} ${r.x} ${r.y} ${i.x} ${i.y}`), ue.el.getTotalLength();
  }
}
Lu([
  Or(() => document.createElementNS("http://www.w3.org/2000/svg", "path"))
], ue, "el", void 0);
class Ge extends In {
  constructor(t, e) {
    super(), this.from = t, this.to = e, this.vector = e.sub(t), this.length = this.vector.magnitude, this.normal = this.vector.perpendicular.normalized.safe, this.points = [t, e];
  }
  get arcLength() {
    return this.length;
  }
  draw(t, e = 0, r = 1, i = !1) {
    const a = this.from.add(this.vector.scale(e)), h = this.from.add(this.vector.scale(r));
    return i && lr(t, a), qt(t, h), [
      {
        position: a,
        tangent: this.normal.flipped,
        normal: this.normal
      },
      {
        position: h,
        tangent: this.normal,
        normal: this.normal
      }
    ];
  }
  getPoint(t) {
    return {
      position: this.from.add(this.vector.scale(t)),
      tangent: this.normal.flipped,
      normal: this.normal
    };
  }
}
function Mu(n, t, e, r) {
  const i = {
    arcLength: 0,
    segments: [],
    minSin: 1
  }, a = fe(t.top, t.right, t.left, n), h = fe(t.right, t.top, t.bottom, n), u = fe(t.bottom, t.left, t.right, n), p = fe(t.left, t.bottom, t.top, n);
  let y = new v(n.left + a, n.top), C = new v(n.right - h, n.top);
  return Xe(i, new Ge(y, C)), y = new v(n.right, n.top + h), C = new v(n.right, n.bottom - u), h > 0 && Cr(i, y.addX(-h), h, v.down, v.right, e, r), Xe(i, new Ge(y, C)), y = new v(n.right - u, n.bottom), C = new v(n.left + p, n.bottom), u > 0 && Cr(i, y.addY(-u), u, v.right, v.up, e, r), Xe(i, new Ge(y, C)), y = new v(n.left, n.bottom - p), C = new v(n.left, n.top + a), p > 0 && Cr(i, y.addX(p), p, v.up, v.left, e, r), Xe(i, new Ge(y, C)), y = new v(n.left + a, n.top), a > 0 && Cr(i, y.addY(a), a, v.left, v.down, e, r), i;
}
function Xe(n, t) {
  n.segments.push(t), n.arcLength += t.arcLength;
}
function Cr(n, t, e, r, i, a, h) {
  const u = t.add(r.scale(e)), p = t.add(i.scale(e));
  a ? Xe(n, new ue(u, u.add(i.scale(h * e)), p.add(r.scale(h * e)), p)) : Xe(n, new Zi(t, e, r, i, !1));
}
var hr = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (h = n[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
let At = class extends kt {
  constructor(t) {
    super(t);
  }
  profile() {
    return Mu(this.childrenBBox(), this.radius(), this.smoothCorners(), this.cornerSharpness());
  }
  desiredSize() {
    return {
      x: this.width.context.getter(),
      y: this.height.context.getter()
    };
  }
  offsetComputedLayout(t) {
    return t;
  }
  childrenBBox() {
    return H.fromSizeCentered(this.computedSize());
  }
  getPath() {
    if (this.requiresProfile())
      return this.curveDrawingInfo().path;
    const t = new Path2D(), e = this.radius(), r = this.smoothCorners(), i = this.cornerSharpness(), a = H.fromSizeCentered(this.size());
    return Pi(t, a, e, r, i), t;
  }
  getCacheBBox() {
    return super.getCacheBBox().expand(this.rippleSize());
  }
  getRipplePath() {
    const t = new Path2D(), e = this.rippleSize(), r = this.radius().addScalar(e), i = this.smoothCorners(), a = this.cornerSharpness(), h = H.fromSizeCentered(this.size()).expand(e);
    return Pi(t, h, r, i, a), t;
  }
};
hr([
  Fr("radius")
], At.prototype, "radius", void 0);
hr([
  O(!1),
  P()
], At.prototype, "smoothCorners", void 0);
hr([
  O(0.6),
  P()
], At.prototype, "cornerSharpness", void 0);
hr([
  E()
], At.prototype, "profile", null);
At = hr([
  re("Rect")
], At);
var ye = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (h = n[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
class Bt extends I {
  constructor({ children: t, ...e }) {
    super(e), this.scene() || this.scene(new I({})), t && this.scene().add(t);
  }
  getZoom() {
    return 1 / this.scale.x();
  }
  setZoom(t) {
    this.scale(Re(t, (e) => 1 / e));
  }
  getDefaultZoom() {
    return this.scale.x.context.getInitial();
  }
  *tweenZoom(t, e, r, i) {
    const a = this.scale.x();
    yield* jt(e, (h) => {
      this.zoom(1 / i(a, 1 / Xt(t), r(h)));
    });
  }
  /**
   * Resets the camera's position, rotation and zoom level to their original
   * values.
   *
   * @param duration - The duration of the tween.
   * @param timingFunction - The timing function to use for the tween.
   */
  *reset(t, e = Nt) {
    yield* Gt(this.position(He, t, e), this.zoom(He, t, e), this.rotation(He, t, e));
  }
  *centerOn(t, e, r = Nt, i = v.lerp) {
    const a = t instanceof I ? t.absolutePosition().transformAsPoint(this.scene().worldToLocal()) : t;
    yield* this.position(a, e, r, i);
  }
  /**
   * Makes the camera follow a path specified by the provided curve.
   *
   * @remarks
   * This will not change the orientation of the camera. To make the camera
   * orient itself along the curve, use {@link followCurveWithRotation} or
   * {@link followCurveWithRotationReverse}.
   *
   * If you want to follow the curve in reverse, use {@link followCurveReverse}.
   *
   * @param curve - The curve to follow.
   * @param duration - The duration of the tween.
   * @param timing - The timing function to use for the tween.
   */
  *followCurve(t, e, r = Nt) {
    yield* jt(e, (i) => {
      const a = r(i), h = t.getPointAtPercentage(a).position.transformAsPoint(t.localToWorld());
      this.position(h);
    });
  }
  /**
   * Makes the camera follow a path specified by the provided curve in reverse.
   *
   * @remarks
   * This will not change the orientation of the camera. To make the camera
   * orient itself along the curve, use {@link followCurveWithRotation} or
   * {@link followCurveWithRotationReverse}.
   *
   * If you want to follow the curve forward, use {@link followCurve}.
   *
   * @param curve - The curve to follow.
   * @param duration - The duration of the tween.
   * @param timing - The timing function to use for the tween.
   */
  *followCurveReverse(t, e, r = Nt) {
    yield* jt(e, (i) => {
      const a = 1 - r(i), h = t.getPointAtPercentage(a).position.transformAsPoint(t.localToWorld());
      this.position(h);
    });
  }
  /**
   * Makes the camera follow a path specified by the provided curve while
   * pointing the camera the direction of the tangent.
   *
   * @remarks
   * To make the camera follow the curve without changing its orientation, use
   * {@link followCurve} or {@link followCurveReverse}.
   *
   * If you want to follow the curve in reverse, use
   * {@link followCurveWithRotationReverse}.
   *
   * @param curve - The curve to follow.
   * @param duration - The duration of the tween.
   * @param timing - The timing function to use for the tween.
   */
  *followCurveWithRotation(t, e, r = Nt) {
    yield* jt(e, (i) => {
      const a = r(i), { position: h, normal: u } = t.getPointAtPercentage(a), p = h.transformAsPoint(t.localToWorld()), y = u.flipped.perpendicular.degrees;
      this.position(p), this.rotation(y);
    });
  }
  /**
   * Makes the camera follow a path specified by the provided curve in reverse
   * while pointing the camera the direction of the tangent.
   *
   * @remarks
   * To make the camera follow the curve without changing its orientation, use
   * {@link followCurve} or {@link followCurveReverse}.
   *
   * If you want to follow the curve forward, use
   * {@link followCurveWithRotation}.
   *
   * @param curve - The curve to follow.
   * @param duration - The duration of the tween.
   * @param timing - The timing function to use for the tween.
   */
  *followCurveWithRotationReverse(t, e, r = Nt) {
    yield* jt(e, (i) => {
      const a = 1 - r(i), { position: h, normal: u } = t.getPointAtPercentage(a), p = h.transformAsPoint(t.localToWorld()), y = u.flipped.perpendicular.degrees;
      this.position(p), this.rotation(y);
    });
  }
  transformContext(t) {
    const e = this.localToParent().inverse();
    t.transform(e.a, e.b, e.c, e.d, e.e, e.f);
  }
  hit(t) {
    const e = t.transformAsPoint(this.localToParent());
    return this.scene().hit(e);
  }
  drawChildren(t) {
    this.scene().drawChildren(t);
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  static Stage({ children: t, cameraRef: e, scene: r, ...i }) {
    const a = new Bt({ scene: r, children: t });
    return e == null || e(a), new At({
      clip: !0,
      ...i,
      children: [a]
    });
  }
}
ye([
  P()
], Bt.prototype, "scene", void 0);
ye([
  Ae(!1),
  P()
], Bt.prototype, "zoom", void 0);
ye([
  ot()
], Bt.prototype, "reset", null);
ye([
  ot()
], Bt.prototype, "centerOn", null);
ye([
  ot()
], Bt.prototype, "followCurve", null);
ye([
  ot()
], Bt.prototype, "followCurveReverse", null);
ye([
  ot()
], Bt.prototype, "followCurveWithRotation", null);
ye([
  ot()
], Bt.prototype, "followCurveWithRotationReverse", null);
var cr = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (h = n[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, xn;
let ve = xn = class extends At {
  constructor(t) {
    super({
      composite: !0,
      fontFamily: "Roboto",
      fontSize: 48,
      lineHeight: "120%",
      textWrap: !1,
      fontStyle: "normal",
      ...t
    }), this.view2D = this, xn.shadowRoot.append(this.element), this.applyFlex();
  }
  dispose() {
    this.removeChildren(), super.dispose();
  }
  render(t) {
    this.computedSize(), this.computedPosition(), super.render(t);
  }
  /**
   * Find a node by its key.
   *
   * @param key - The key of the node.
   */
  findKey(t) {
    return Sr().getNode(t) ?? null;
  }
  requestLayoutUpdate() {
    this.updateLayout();
  }
  requestFontUpdate() {
    this.applyFont();
  }
  view() {
    return this;
  }
};
cr([
  O(rr.Paused),
  P()
], ve.prototype, "playbackState", void 0);
cr([
  O(0),
  P()
], ve.prototype, "globalTime", void 0);
cr([
  P()
], ve.prototype, "assetHash", void 0);
cr([
  Or(() => {
    const n = "motion-canvas-2d-frame";
    let t = document.querySelector(`#${n}`);
    return t || (t = document.createElement("div"), t.id = n, t.style.position = "absolute", t.style.pointerEvents = "none", t.style.top = "0", t.style.left = "0", t.style.opacity = "0", t.style.overflow = "hidden", document.body.prepend(t)), t.shadowRoot ?? t.attachShadow({ mode: "open" });
  })
], ve, "shadowRoot", void 0);
ve = xn = cr([
  re("View2D")
], ve);
function $u(n, t, e) {
  const r = {
    arcLength: 0,
    segments: [],
    minSin: 1
  };
  if (n.length === 0)
    return r;
  if (e) {
    const h = n[0].add(n[n.length - 1]).scale(0.5);
    n = [h, ...n, h];
  }
  let i = n[0];
  for (let h = 2; h < n.length; h++) {
    const u = n[h - 2], p = n[h - 1], y = n[h], C = u.sub(p), z = y.sub(p), j = C.normalized.safe, Y = z.normalized.safe, st = Math.acos(xt(-1, 1, j.dot(Y))), T = Math.tan(st / 2), K = Math.sin(st / 2), yt = Math.min(t, T * C.magnitude * (h === 2 ? 1 : 0.5), T * z.magnitude * (h === n.length - 1 ? 1 : 0.5)), rt = K === 0 ? 0 : yt / K, se = T === 0 ? 0 : yt / T, Mt = j.add(Y).scale(1 / 2).normalized.safe.scale(rt).add(p), Fe = j.perpendicular.dot(Y) < 0, _ = new Ge(i, p.add(j.scale(se))), ie = new Zi(Mt, yt, j.perpendicular.scale(Fe ? 1 : -1), Y.perpendicular.scale(Fe ? -1 : 1), Fe);
    _.arcLength > 0 && (r.segments.push(_), r.arcLength += _.arcLength), ie.arcLength > 0 && (r.segments.push(ie), r.arcLength += ie.arcLength), r.minSin = Math.min(r.minSin, Math.abs(K)), i = p.add(Y.scale(se));
  }
  const a = new Ge(i, n[n.length - 1]);
  return a.arcLength > 0 && (r.segments.push(a), r.arcLength += a.arcLength), r;
}
function Ou(n) {
  return n.reduce((t, e, r) => r ? t + n[r - 1].sub(e).magnitude : 0, 0);
}
function gn(n, t, e) {
  const r = n.length;
  let i = 0;
  for (let a = 0; a < t.length; a += 1) {
    const h = n[(e + a) % r], u = t[a];
    i += h.sub(u).squaredMagnitude;
  }
  return i;
}
function Au(n, t, e) {
  const r = [];
  if (e === 0)
    return [...n];
  if (e === 1)
    return [...t];
  for (let i = 0; i < n.length; i++) {
    const a = n[i], h = t[i];
    r.push(v.lerp(a, h, e));
  }
  return r;
}
var ze = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (h = n[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, Pr;
let Kt = Pr = class extends kt {
  /**
   * Rotate the points to minimize the overall distance traveled when tweening.
   *
   * @param points - The points to rotate.
   * @param reference - The reference points to which the distance is measured.
   * @param closed - Whether the points form a closed polygon.
   */
  static rotatePoints(t, e, r) {
    if (r) {
      let i = 1 / 0, a = 0;
      for (let h = 0; h < t.length; h += 1) {
        const u = gn(t, e, h);
        u < i && (i = u, a = h);
      }
      if (a) {
        const h = t.splice(0, a);
        t.splice(t.length, 0, ...h);
      }
    } else {
      const i = gn(t, e, 0), a = [...t].reverse();
      gn(a, e, 0) < i && t.reverse();
    }
  }
  /**
   * Distribute additional points along the polyline.
   *
   * @param points - The points of a polyline along which new points should be
   *                 distributed.
   * @param count - The number of points to add.
   */
  static distributePoints(t, e) {
    if (t.length === 0) {
      for (let u = 0; u < e; u++)
        t.push(v.zero);
      return;
    }
    if (t.length === 1) {
      const u = t[0];
      for (let p = 0; p < e; p++)
        t.push(u);
      return;
    }
    const r = t.length + e, i = Ou(t);
    let a = i === 0 ? 0 : e / i, h = 0;
    for (; t.length < r; ) {
      const u = r - t.length;
      if (h + 1 >= t.length) {
        a = i === 0 ? 0 : u / i, h = 0;
        continue;
      }
      const p = t[h], y = t[h + 1], C = p.sub(y).magnitude;
      let z = Math.min(Math.round(C * a), u) + 1;
      i === 0 && (z = 2);
      for (let j = 1; j < z; j++)
        t.splice(++h, 0, v.lerp(p, y, j / z));
      h++;
    }
  }
  *tweenPoints(t, e, r) {
    const i = [...this.parsedPoints()], a = this.parsePoints(Xt(t)), h = this.closed(), u = i.length - a.length;
    Pr.distributePoints(u < 0 ? i : a, Math.abs(u)), Pr.rotatePoints(a, i, h), this.tweenedPoints(i), yield* jt(e, (p) => {
      const y = r(p);
      this.tweenedPoints(Au(i, a, y));
    }, () => {
      this.tweenedPoints(null), this.points(t);
    });
  }
  constructor(t) {
    super(t), this.tweenedPoints = $e(null), t.children === void 0 && t.points === void 0 && mt().warn({
      message: "No points specified for the line",
      remarks: `<p>The line won&#39;t be visible unless you specify at least two points:</p>
<pre class=""><code class="language-tsx">&lt;<span class="hljs-title class_">Line</span>
  stroke=<span class="hljs-string">&quot;#fff&quot;</span>
  lineWidth={<span class="hljs-number">8</span>}
  points={[
    [<span class="hljs-number">100</span>, <span class="hljs-number">0</span>],
    [<span class="hljs-number">0</span>, <span class="hljs-number">0</span>],
    [<span class="hljs-number">0</span>, <span class="hljs-number">100</span>],
  ]}
/&gt;</code></pre><p>Alternatively, you can define the points using the children:</p>
<pre class=""><code class="language-tsx">&lt;<span class="hljs-title class_">Line</span> stroke=<span class="hljs-string">&quot;#fff&quot;</span> lineWidth={<span class="hljs-number">8</span>}&gt;
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Node</span> <span class="hljs-attr">x</span>=<span class="hljs-string">{100}</span> /&gt;</span></span>
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Node</span> /&gt;</span></span>
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Node</span> <span class="hljs-attr">y</span>=<span class="hljs-string">{100}</span> /&gt;</span></span>
&lt;/<span class="hljs-title class_">Line</span>&gt;</code></pre><p>If you did this intentionally, and want to disable this message, set the
<code>points</code> property to <code>null</code>:</p>
<pre class=""><code class="language-tsx">&lt;<span class="hljs-title class_">Line</span> stroke=<span class="hljs-string">&quot;#fff&quot;</span> lineWidth={<span class="hljs-number">8</span>} points={<span class="hljs-literal">null</span>} /&gt;</code></pre>`,
      inspect: this.key
    });
  }
  childrenBBox() {
    let t = this.tweenedPoints();
    if (!t) {
      const e = this.points();
      t = e ? e.map((r) => new v(Xt(r))) : this.children().filter((r) => !(r instanceof $) || r.isLayoutRoot()).map((r) => r.position());
    }
    return H.fromPoints(...t);
  }
  parsedPoints() {
    return this.parsePoints(this.points());
  }
  profile() {
    return $u(this.tweenedPoints() ?? this.parsedPoints(), this.radius(), this.closed());
  }
  lineWidthCoefficient() {
    const t = this.radius(), e = this.lineJoin();
    let r = super.lineWidthCoefficient();
    if (t === 0 && e === "miter") {
      const { minSin: i } = this.profile();
      i > 0 && (r = Math.max(r, 0.5 / i));
    }
    return r;
  }
  drawOverlay(t, e) {
    const r = this.childrenBBox().transformCorners(e), a = this.computedSize().mul(this.offset()).scale(0.5).transformAsPoint(e);
    t.fillStyle = "white", t.strokeStyle = "black", t.lineWidth = 1;
    const h = new Path2D(), u = (this.tweenedPoints() ?? this.parsedPoints()).map((p) => p.transformAsPoint(e));
    if (u.length > 0) {
      lr(h, u[0]);
      for (const p of u)
        qt(h, p), t.beginPath(), Hi(t, p, 4), t.closePath(), t.fill(), t.stroke();
    }
    t.strokeStyle = "white", t.stroke(h), t.beginPath(), Xi(t, a), t.stroke(), t.beginPath(), ce(t, r), t.closePath(), t.stroke();
  }
  parsePoints(t) {
    return t ? t.map((e) => new v(Xt(e))) : this.children().map((e) => e.position());
  }
};
ze([
  O(0),
  P()
], Kt.prototype, "radius", void 0);
ze([
  O(null),
  P()
], Kt.prototype, "points", void 0);
ze([
  ot()
], Kt.prototype, "tweenPoints", null);
ze([
  E()
], Kt.prototype, "childrenBBox", null);
ze([
  E()
], Kt.prototype, "parsedPoints", null);
ze([
  E()
], Kt.prototype, "profile", null);
Kt = Pr = ze([
  re("Line")
], Kt);
var ur = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (h = n[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, Rr;
let Ot = Rr = class extends bt {
  constructor({ children: t, ...e }) {
    super(e), t && this.text(t);
  }
  parentTxt() {
    const t = this.parent();
    return t instanceof Pt ? t : null;
  }
  draw(t) {
    this.requestFontUpdate(), this.applyStyle(t), this.applyText(t), t.font = this.styles.font, t.textBaseline = "bottom", "letterSpacing" in t && (t.letterSpacing = `${this.letterSpacing()}px`);
    const e = t.measureText("").fontBoundingBoxAscent, r = this.element.getBoundingClientRect(), { width: i, height: a } = this.size(), h = document.createRange();
    let u = "";
    const p = new H();
    for (const y of this.element.childNodes) {
      if (!y.textContent)
        continue;
      h.selectNodeContents(y);
      const C = h.getBoundingClientRect(), z = i / -2 + C.left - r.left, j = a / -2 + C.top - r.top + e;
      p.y === j ? (p.width += C.width, u += y.textContent) : (this.drawText(t, u, p), p.x = z, p.y = j, p.width = C.width, p.height = C.height, u = y.textContent);
    }
    this.drawText(t, u, p);
  }
  drawText(t, e, r) {
    const i = r.y;
    e = e.replace(/\s+/g, " "), this.lineWidth() <= 0 ? t.fillText(e, r.x, i) : this.strokeFirst() ? (t.strokeText(e, r.x, i), t.fillText(e, r.x, i)) : (t.fillText(e, r.x, i), t.strokeText(e, r.x, i));
  }
  getCacheBBox() {
    const t = this.computedSize(), e = document.createRange();
    e.selectNodeContents(this.element);
    const r = e.getBoundingClientRect(), i = this.lineWidth(), a = this.lineJoin() === "miter" ? 0.5 * 10 : 0.5;
    return new H(-t.width / 2, -t.height / 2, r.width, r.height).expand([0, this.fontSize() * 0.5]).expand(i * a);
  }
  applyFlex() {
    super.applyFlex(), this.element.style.display = "inline";
  }
  updateLayout() {
    if (this.applyFont(), this.applyFlex(), this.justifyContent.isInitial() && (this.element.style.justifyContent = this.styles.getPropertyValue("text-align")), this.styles.whiteSpace !== "nowrap" && this.styles.whiteSpace !== "pre")
      if (this.element.innerText = "", Rr.segmenter)
        for (const e of Rr.segmenter.segment(this.text()))
          this.element.appendChild(document.createTextNode(e.segment));
      else
        for (const e of this.text().split(""))
          this.element.appendChild(document.createTextNode(e));
    else if (this.styles.whiteSpace === "pre") {
      this.element.innerText = "";
      for (const e of this.text().split(`
`))
        this.element.appendChild(document.createTextNode(e + `
`));
    } else
      this.element.innerText = this.text();
  }
};
ur([
  O(""),
  On(_i),
  P()
], Ot.prototype, "text", void 0);
ur([
  E()
], Ot.prototype, "parentTxt", null);
ur([
  Or(() => {
    const n = document.createElement("span");
    return ve.shadowRoot.append(n), n;
  })
], Ot, "formatter", void 0);
ur([
  Or(() => {
    try {
      return new Intl.Segmenter(void 0, {
        granularity: "grapheme"
      });
    } catch {
      return null;
    }
  })
], Ot, "segmenter", void 0);
Ot = Rr = ur([
  re("TxtLeaf")
], Ot);
[
  "fill",
  "stroke",
  "lineWidth",
  "strokeFirst",
  "lineCap",
  "lineJoin",
  "lineDash",
  "lineDashOffset"
].forEach((n) => {
  Ot.prototype[`get${Te(n)}`] = function() {
    var t;
    return ((t = this.parentTxt()) == null ? void 0 : t[n]()) ?? this[n].context.getInitial();
  };
});
var fr = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (h = n[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, Se;
let Pt = Se = class extends bt {
  /**
   * Create a bold text node.
   *
   * @remarks
   * This is a shortcut for
   * ```tsx
   * <Txt fontWeight={700} />
   * ```
   *
   * @param props - Additional text properties.
   */
  static b(t) {
    return new Se({ ...t, fontWeight: 700 });
  }
  /**
   * Create an italic text node.
   *
   * @remarks
   * This is a shortcut for
   * ```tsx
   * <Txt fontStyle={'italic'} />
   * ```
   *
   * @param props - Additional text properties.
   */
  static i(t) {
    return new Se({ ...t, fontStyle: "italic" });
  }
  getText() {
    return this.innerText();
  }
  setText(t) {
    const e = this.children();
    let r = null;
    for (let i = 0; i < e.length; i++) {
      const a = e[i];
      r === null && a instanceof Ot ? r = a : a.parent(null);
    }
    r === null ? (r = new Ot({ text: t }), r.parent(this)) : r.text(t), this.setParsedChildren([r]);
  }
  setChildren(t) {
    this.children.context.raw() !== t && (typeof t == "string" ? this.text(t) : super.setChildren(t));
  }
  *tweenText(t, e, r, i) {
    const a = this.children();
    (a.length !== 1 || !(a[0] instanceof Ot)) && this.text.save();
    const h = this.childAs(0), u = h.text.context.raw(), p = this.size.context.raw();
    h.text(t);
    const y = this.size();
    h.text(u ?? He), this.height() === 0 && this.height(y.height), yield* Gt(this.size(y, e, r), h.text(t, e, r, i)), this.children.context.setter(t), this.size(p);
  }
  getLayout() {
    return !0;
  }
  constructor({ children: t, text: e, ...r }) {
    super(r), this.children(e ?? t);
  }
  innerText() {
    const t = this.childrenAs();
    let e = "";
    for (const r of t)
      e += r.text();
    return e;
  }
  parentTxt() {
    const t = this.parent();
    return t instanceof Se ? t : null;
  }
  parseChildren(t) {
    const e = [], r = Array.isArray(t) ? t : [t];
    for (const i of r)
      i instanceof Se || i instanceof Ot ? e.push(i) : typeof i == "string" && e.push(new Ot({ text: i }));
    return e;
  }
  applyFlex() {
    super.applyFlex(), this.element.style.display = this.findAncestor(Fn(Se)) ? "inline" : "block";
  }
  draw(t) {
    this.drawChildren(t);
  }
};
fr([
  O(""),
  P()
], Pt.prototype, "text", void 0);
fr([
  ot()
], Pt.prototype, "tweenText", null);
fr([
  E()
], Pt.prototype, "innerText", null);
fr([
  E()
], Pt.prototype, "parentTxt", null);
Pt = Se = fr([
  re("Txt")
], Pt);
[
  "fill",
  "stroke",
  "lineWidth",
  "strokeFirst",
  "lineCap",
  "lineJoin",
  "lineDash",
  "lineDashOffset"
].forEach((n) => {
  Pt.prototype[`getDefault${Te(n)}`] = function(t) {
    var e;
    return ((e = this.parentTxt()) == null ? void 0 : e[n]()) ?? t;
  };
});
class zu extends tu {
  constructor(t) {
    super(t), this.view = null, this.registeredNodes = /* @__PURE__ */ new Map(), this.nodeCounters = /* @__PURE__ */ new Map(), this.assetHash = Date.now().toString(), this.recreateView();
  }
  getView() {
    return this.view;
  }
  next() {
    var t;
    return (t = this.getView()) == null || t.playbackState(this.playback.state).globalTime(this.playback.time), super.next();
  }
  draw(t) {
    t.save(), this.renderLifecycle.dispatch([Ut.BeforeRender, t]), t.save(), this.renderLifecycle.dispatch([Ut.BeginRender, t]), this.getView().playbackState(this.playback.state).globalTime(this.playback.time), this.getView().render(t), this.renderLifecycle.dispatch([Ut.FinishRender, t]), t.restore(), this.renderLifecycle.dispatch([Ut.AfterRender, t]), t.restore();
  }
  reset(t) {
    for (const e of this.registeredNodes.keys())
      try {
        this.registeredNodes.get(e).dispose();
      } catch (r) {
        this.logger.error(r);
      }
    return this.registeredNodes.clear(), this.registeredNodes = /* @__PURE__ */ new Map(), this.nodeCounters.clear(), this.recreateView(), super.reset(t);
  }
  inspectPosition(t, e) {
    return this.execute(() => {
      var r;
      return ((r = this.getView().hit(new v(t, e))) == null ? void 0 : r.key) ?? null;
    });
  }
  validateInspection(t) {
    var e;
    return ((e = this.getNode(t)) == null ? void 0 : e.key) ?? null;
  }
  inspectAttributes(t) {
    const e = this.getNode(t);
    if (!e)
      return null;
    const r = {
      stack: e.creationStack,
      key: e.key
    };
    for (const { key: i, meta: a, signal: h } of e)
      a.inspectable && (r[i] = h());
    return r;
  }
  drawOverlay(t, e, r) {
    const i = this.getNode(t);
    i && this.execute(() => {
      const a = this.getView().findAll(Fn(Bt)), h = [];
      for (const u of a) {
        const p = u.scene();
        p && (p === i || p.findFirst((y) => y === i)) && h.push(u);
      }
      if (h.length > 0)
        for (const u of h) {
          const p = u.parentToWorld(), y = u.localToParent().inverse(), C = i.localToWorld();
          i.drawOverlay(r, e.multiply(p).multiply(y).multiply(C));
        }
      else
        i.drawOverlay(r, e.multiply(i.localToWorld()));
    });
  }
  transformMousePosition(t, e) {
    return new v(t, e).transformAsPoint(this.getView().localToParent().inverse());
  }
  registerNode(t, e) {
    var h;
    const r = ((h = t.constructor) == null ? void 0 : h.name) ?? "unknown", i = (this.nodeCounters.get(r) ?? 0) + 1;
    this.nodeCounters.set(r, i), e && this.registeredNodes.has(e) && (mt().error({
      message: `Duplicated node key: "${e}".`,
      inspect: e,
      stack: new Error().stack
    }), e = void 0), e ?? (e = `${this.name}/${r}[${i}]`), this.registeredNodes.set(e, t);
    const a = this.registeredNodes;
    return [e, () => a.delete(e)];
  }
  getNode(t) {
    return typeof t != "string" ? null : this.registeredNodes.get(t) ?? null;
  }
  *getDetachedNodes() {
    for (const t of this.registeredNodes.values())
      !t.parent() && t !== this.view && (yield t);
  }
  recreateView() {
    this.execute(() => {
      const t = this.getSize();
      this.view = new ve({
        position: t.scale(this.resolutionScale / 2),
        scale: this.resolutionScale,
        assetHash: this.assetHash,
        size: t
      });
    });
  }
}
function Fu(n) {
  return {
    klass: zu,
    config: n,
    stack: new Error().stack,
    meta: eu(),
    plugins: ["@motion-canvas/2d/editor"]
  };
}
const ct = {
  bg: "#0f0f0f",
  // Primary accent
  accent: "#2dd4bf",
  // Context / secondary
  context: "#1e1e2e",
  contextText: "#8888aa",
  // Labels and secondary
  label: "#444455",
  dimText: "#666677",
  subtle: "#333344",
  // Message array roles (useful for agent/chat visualizations)
  user: "#3b82f6",
  // blue-500
  userBg: "#1e3a5f",
  assistant: "#22c55e",
  // green-500
  assistantBg: "#1a3d2a",
  toolCall: "#2dd4bf",
  // teal (matches accent)
  toolCallBg: "#1a3d3d",
  toolResult: "#a78bfa",
  // purple-400
  toolResultBg: "#2d1f5e",
  white: "#ffffff"
}, Qe = "monospace", ke = Fu(function* (n) {
  n.fill(ct.bg);
  const t = mi(), e = fn(), r = fn(), i = fn(), a = mi(), h = [
    { label: "Read Source Docs", bg: ct.userBg, border: ct.user },
    { label: "Ask User Question", bg: ct.assistantBg, border: ct.assistant },
    { label: "User Answers", bg: ct.toolResultBg, border: ct.toolResult },
    { label: "Update intake.md", bg: ct.toolCallBg, border: ct.toolCall }
  ], u = [
    { title: "## Filer Info", detail: "John Doe · MFJ · LLC" },
    { title: "## Dependents", detail: "2 children" },
    { title: "## Income", detail: "1099-NEC · W-2 · K-1" },
    { title: "## Deductions", detail: "Mortgage · SALT · charity" },
    { title: "## Credits", detail: "CTC · Dependent Care" }
  ];
  n.add(
    /* @__PURE__ */ $t(Wi, { children: [
      /* @__PURE__ */ $t($, { x: -520, direction: "column", gap: 28, alignItems: "center", layout: !0, children: h.map((p) => /* @__PURE__ */ $t(
        At,
        {
          ref: t,
          fill: p.bg,
          stroke: p.border,
          lineWidth: 3,
          radius: 14,
          padding: [22, 36],
          width: 420,
          opacity: 0,
          children: /* @__PURE__ */ $t(Pt, { text: p.label, fill: ct.white, fontFamily: Qe, fontSize: 30 })
        }
      )) }),
      /* @__PURE__ */ $t(
        Kt,
        {
          ref: e,
          stroke: ct.dimText,
          lineWidth: 3,
          lineDash: [10, 8],
          endArrow: !0,
          arrowSize: 16,
          points: [
            [-300, 170],
            [-210, 170],
            [-210, -170],
            [-300, -170]
          ],
          opacity: 0
        }
      ),
      /* @__PURE__ */ $t(
        Pt,
        {
          ref: r,
          text: "REPEAT",
          x: -170,
          y: 0,
          rotation: -90,
          fill: ct.dimText,
          fontFamily: Qe,
          fontSize: 22,
          opacity: 0
        }
      ),
      /* @__PURE__ */ $t(
        At,
        {
          ref: i,
          x: 420,
          fill: ct.context,
          stroke: ct.label,
          lineWidth: 2,
          radius: 14,
          padding: [32, 36],
          gap: 14,
          direction: "column",
          alignItems: "start",
          width: 720,
          height: 760,
          opacity: 0,
          layout: !0,
          children: [
            /* @__PURE__ */ $t(Pt, { text: "intake.md", fill: ct.accent, fontFamily: Qe, fontSize: 38 }),
            /* @__PURE__ */ $t(At, { fill: ct.label, height: 2, width: 648 }),
            u.map((p) => /* @__PURE__ */ $t(
              At,
              {
                ref: a,
                fill: ct.subtle,
                stroke: ct.accent,
                lineWidth: 1,
                radius: 10,
                padding: [16, 20],
                gap: 8,
                direction: "column",
                alignItems: "start",
                width: 648,
                opacity: 0,
                layout: !0,
                children: [
                  /* @__PURE__ */ $t(Pt, { text: p.title, fill: ct.white, fontFamily: Qe, fontSize: 26 }),
                  /* @__PURE__ */ $t(Pt, { text: p.detail, fill: ct.contextText, fontFamily: Qe, fontSize: 22 })
                ]
              }
            ))
          ]
        }
      )
    ] })
  ), yield* zi(0.12, ...t.map((p) => p.opacity(1, 0.4))), yield* Gt(
    e().opacity(1, 0.4),
    r().opacity(1, 0.4),
    i().opacity(1, 0.5)
  ), yield* Pe(0.35);
  for (let p = 0; p < u.length; p++) {
    for (let y = 0; y < t.length; y++)
      yield* Gt(
        t[y].scale(1.06, 0.13),
        t[y].lineWidth(5, 0.13)
      ), yield* Gt(
        t[y].scale(1, 0.13),
        t[y].lineWidth(3, 0.13)
      );
    yield* a[p].opacity(1, 0.4), yield* Pe(0.15);
  }
  yield* Pe(10);
});
ke.name = "scene";
du.attach(ke.meta);
ke.onReplaced ?? (ke.onReplaced = new pe(ke.config));
const Iu = {
  scenes: [ke]
};
let En;
En ?? (En = new sr("\0virtual:settings", !1));
En.loadData({});
const Eu = En, Xu = zc(
  "_build_project",
  { core: "3.17.2", two: "3.17.2", ui: "3.17.2", vitePlugin: "3.17.2" },
  [],
  Iu,
  fu,
  Eu
);
export {
  Xu as default
};
