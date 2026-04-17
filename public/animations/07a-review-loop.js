class Cn {
  constructor() {
    this.subscribable = new Mi(this), this.subscribers = /* @__PURE__ */ new Set();
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
class Mi {
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
class Yt extends Cn {
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
class me extends Cn {
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
    super(), this.value = t, this.subscribable = new Sc(this);
  }
  /**
   * {@inheritDoc SubscribableValueEvent.subscribe}
   */
  subscribe(t, e = !0) {
    const r = super.subscribe(t);
    return e && t(this.value), r;
  }
}
class Sc extends Mi {
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
class zt {
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
    this.name = t, this.initial = e, this.type = void 0, this.spacing = !1, this.description = "", this.disabled = new me(!1), this.value = new me(e);
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
class Cc extends zt {
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
    }, this.event = new me([...r.values()]), this.fields = r;
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
const ve = Cc;
class gi extends zt {
  constructor() {
    super(...arguments), this.type = Boolean;
  }
  parse(t) {
    return !!t;
  }
}
class Li extends Error {
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
const $r = [];
function kn() {
  const n = $r.at(-1);
  if (!n)
    throw new Error("The scene is not available in the current context.");
  return n;
}
function Tc(n) {
  $r.push(n);
}
function Pc(n) {
  if ($r.pop() !== n)
    throw new Error("startScene/endScene were called out of order.");
}
function St() {
  var n;
  return ((n = $r.at(-1)) == null ? void 0 : n.logger) ?? console;
}
const Tn = [];
function Ar() {
  const n = Tn.at(-1);
  if (!n)
    throw new Li("The thread is not available in the current context.", `<p><code>useThread()</code> can only be called from within generator functions.
      It&#39;s not available during rendering.</p>
`);
  return n;
}
function vi(n) {
  Tn.push(n);
}
function mi(n) {
  if (Tn.pop() !== n)
    throw new Error("startThread/endThread was called out of order.");
}
function Le(n) {
  return n[0].toUpperCase() + n.slice(1);
}
function Pe() {
  let n;
  return (e) => {
    if (e !== void 0)
      n = e;
    else
      return n;
  };
}
function dn() {
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
], Mc = [
  { value: "srgb", text: "sRGB" },
  { value: "display-p3", text: "DCI-P3" }
], yi = [
  { value: 30, text: "30 FPS" },
  { value: 60, text: "60 FPS" }
];
var Bt;
(function(n) {
  n.Error = "error", n.Warn = "warn", n.Info = "info", n.Http = "http", n.Verbose = "verbose", n.Debug = "debug", n.Silly = "silly";
})(Bt || (Bt = {}));
class Lc {
  constructor() {
    this.logged = new Yt(), this.history = [], this.profilers = {};
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
    this.logLevel(Bt.Error, t);
  }
  warn(t) {
    this.logLevel(Bt.Warn, t);
  }
  info(t) {
    this.logLevel(Bt.Info, t);
  }
  http(t) {
    this.logLevel(Bt.Http, t);
  }
  verbose(t) {
    this.logLevel(Bt.Verbose, t);
  }
  debug(t) {
    this.logLevel(Bt.Debug, t);
  }
  silly(t) {
    this.logLevel(Bt.Silly, t);
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
      a.level ?? (a.level = Bt.Debug), a.durationMs = r - i, this.log(a);
      return;
    }
    this.profilers[t] = r;
  }
}
var nr;
(function(n) {
  n[n.Playing = 0] = "Playing", n[n.Rendering = 1] = "Rendering", n[n.Paused = 2] = "Paused", n[n.Presenting = 3] = "Presenting";
})(nr || (nr = {}));
function $c(n) {
  const t = {
    version: new zt("version", 1),
    shared: new ve("General", {
      background: new yn("background", null),
      range: new Fr("range", [0, 1 / 0]),
      size: new Ni("resolution", new v(1920, 1080)),
      audioOffset: new gn("audio offset", 0)
    }),
    preview: new ve("Preview", {
      fps: new gn("frame rate", 30).setPresets(yi).setRange(1),
      resolutionScale: new Ae("scale", bi, 1)
    }),
    rendering: new ve("Rendering", {
      fps: new gn("frame rate", 60).setPresets(yi).setRange(1),
      resolutionScale: new Ae("scale", bi, 1),
      colorSpace: new Ae("color space", Mc),
      exporter: new uu("exporter", n)
    })
  };
  return t.shared.audioOffset.disable(!n.audio), t;
}
class Ac extends ve {
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
function zc() {
  return new ve("Application Settings", {
    version: new zt("version", 1),
    appearance: new ve("Appearance", {
      color: new yn("accent color", new be("#33a6ff")).describe("The accent color for the user interface. (Leave empty to use the default color)"),
      font: new gi("legacy font", !1).describe("Use the 'JetBrains Mono' font for the user interface."),
      coordinates: new gi("coordinates", !0).describe("Display mouse coordinates within the preview window.")
    }),
    defaults: new ve("Defaults", {
      background: new yn("background", null).describe("The default background color used in new projects."),
      size: new Ni("resolution", new v(1920, 1080)).describe("The default resolution used in new projects.")
    })
  });
}
function Oc(n, t, e, r, i, a, l = r.logger ?? new Lc()) {
  const u = zc();
  a.attach(u);
  const g = {
    name: n,
    ...r,
    plugins: e,
    versions: t,
    settings: u,
    logger: l
  };
  return g.meta = new Ac(g), g.meta.shared.set(u.defaults.get()), g.experimentalFeatures ?? (g.experimentalFeatures = !1), i.attach(g.meta), g;
}
function Fc(n, t) {
  return {
    level: Bt.Error,
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
const Ic = 180 / Math.PI, mn = Math.PI / 180;
function wi(n, t, e) {
  let r = 0, i = n;
  e = e === void 0 ? r < i ? 1 : -1 : e;
  const a = [];
  let l = Math.max(Math.ceil((i - r) / e), 0), u = 0;
  for (; l--; )
    a[u++] = r, r += e;
  return a;
}
function Ec(n) {
  const t = kn(), e = Ar();
  return t.timeEvents.register(n, e.time());
}
const Pn = [];
function Ai() {
  const n = Pn.at(-1);
  if (!n)
    throw new Error("The playback is not available in the current context.");
  return n;
}
function _c(n) {
  Pn.push(n);
}
function jc(n) {
  if (Pn.pop() !== n)
    throw new Error("startPlayback/endPlayback were called out of order.");
}
function se(n, ...t) {
  const e = { [n.name]: n }, r = Object.getOwnPropertyDescriptor(e, n.name);
  if (r)
    for (let i = t.length - 1; i >= 0; i--)
      t[i](e, n.name, r);
}
const xi = Symbol.for("@motion-canvas/core/decorators/UNINITIALIZED");
function zr(n) {
  return (t, e) => {
    let r = xi;
    Object.defineProperty(t, e, {
      get() {
        return r === xi && (r = n.call(this)), r;
      }
    });
  };
}
function ct(n) {
  return function(t, e, r) {
    r.value.prototype.name = n ?? e, r.value.prototype.threadable = !0;
  };
}
se(xt, ct());
function* xt(...n) {
  for (const t of n)
    yield t;
  yield* Rn(...n);
}
se(Dc, ct());
function* Dc(n, t) {
  yield* Ft(Ec(n)), t && (yield* t);
}
se(Ft, ct());
function* Ft(n = 0, t) {
  const e = Ar(), r = Ai().framesToSeconds(1), i = e.time() + n;
  for (; i - r > e.fixed; )
    yield;
  e.time(i), t && (yield* t);
}
se(zi, ct());
function* zi() {
}
function Si(n, t) {
  let e;
  return typeof n == "string" ? (e = t(), Lr(e, n)) : (e = n(), Lr(e, e)), e;
}
se(Oi, ct());
function* Oi(n, ...t) {
  for (const e of t)
    yield e, yield* Ft(n);
  yield* Rn(...t);
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
class pn {
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
    this.runner = t, this.deferred = new Yt(), this.children = [], this.time = Oe(0), this.parent = null, this.isCanceled = !1, this.isPaused = !1, this.fixedTime = 0, this.queue = [], this.runner.task && (St().error({
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
    }), this.runner = zi()), this.runner.task = this;
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
    vi(this);
    const t = this.runner.next(this.value);
    return mi(this), this.value = null, t;
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
    vi(this), this.deferred.dispatch(), mi(this);
  }
}
se(Rn, ct());
function* Rn(n, ...t) {
  let e = !0;
  typeof n == "boolean" ? e = n : t.push(n);
  const r = Ar(), i = t.map((u) => r.children.find((g) => g.runner === u)).filter((u) => u), a = r.time();
  let l;
  if (e) {
    for (; i.find((u) => !u.canceled); )
      yield;
    l = Math.max(...i.map((u) => u.time()));
  } else {
    for (; !i.find((g) => g.canceled); )
      yield;
    const u = i.filter((g) => g.canceled);
    l = Math.min(...u.map((g) => g.time()));
  }
  r.time(Math.max(a, l));
}
function Nc(n) {
  return typeof (n == null ? void 0 : n.then) == "function";
}
se(Ei, ct());
function* Ei(n, t) {
  const e = Ai(), r = n();
  Lr(r, "root");
  const i = new pn(r);
  t == null || t(i);
  let a = [i];
  for (; a.length > 0; ) {
    const l = [], u = [...a], g = e.deltaTime;
    for (; u.length > 0; ) {
      const y = u.pop();
      if (!y || y.canceled)
        continue;
      const S = y.next();
      if (S.done) {
        y.cancel();
        continue;
      }
      if (Fi(S.value)) {
        const M = new pn(S.value);
        y.value = S.value, y.add(M), u.push(y), u.push(M);
      } else S.value ? (y.value = yield S.value, u.push(y)) : (y.update(g), y.drain((M) => {
        const F = new pn(M);
        y.add(F), l.unshift(F);
      }), l.unshift(y));
    }
    a = [];
    for (const y of l)
      y.canceled || (a.push(y), y.runDeferred());
    a.length > 0 && (yield);
  }
}
var Zt;
(function(n) {
  n[n.BeforeRender = 0] = "BeforeRender", n[n.BeginRender = 1] = "BeginRender", n[n.FinishRender = 2] = "FinishRender", n[n.AfterRender = 3] = "AfterRender";
})(Zt || (Zt = {}));
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
    this.scene = t, this.beforeRender = new Yt(), this.beginRender = new Yt(), this.finishRender = new Yt(), this.afterRender = new Yt(), this.scene.onRenderLifecycle.subscribe(([e, r]) => {
      switch (e) {
        case Zt.BeforeRender:
          return this.beforeRender.dispatch(r);
        case Zt.BeginRender:
          return this.beginRender.dispatch(r);
        case Zt.FinishRender:
          return this.finishRender.dispatch(r);
        case Zt.AfterRender:
          return this.afterRender.dispatch(r);
      }
    }), this.scene.onReset.subscribe(() => {
      this.beforeRender.clear(), this.beginRender.clear(), this.finishRender.clear(), this.afterRender.clear();
    });
  }
}
class sr {
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
    return it(t, e, this.next());
  }
  /**
   * Get the next random integer in the given range.
   *
   * @param from - The start of the range.
   * @param to - The end of the range. Exclusive.
   */
  nextInt(t = 0, e = 4294967296) {
    let r = Math.floor(it(t, e, this.next()));
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
    return new sr(this.nextInt());
  }
  next() {
    this.state |= 0, this.state = this.state + 1831565813 | 0;
    let t = Math.imul(this.state ^ this.state >>> 15, 1 | this.state);
    return t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t, ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}
var wt;
(function(n) {
  n[n.Initial = 0] = "Initial", n[n.AfterTransitionIn = 1] = "AfterTransitionIn", n[n.CanTransitionOut = 2] = "CanTransitionOut", n[n.Finished = 3] = "Finished";
})(wt || (wt = {}));
const Uc = "resolution", qc = "destinationTexture", Gc = "sourceTexture", Ci = "time", Xc = "deltaTime", Hc = "framerate", Yc = "sourceMatrix", Zc = "destinationMatrix", Vc = `#version 300 es

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
class Jc {
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
    const e = this.sharedContext.getProgram(t, Vc);
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
    this.scene = t, this.slides = new me([]), this.lookup = /* @__PURE__ */ new Map(), this.collisionLookup = /* @__PURE__ */ new Set(), this.current = null, this.canResume = !1, this.waitsForId = null, this.targetId = null, this.handleReload = () => {
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
    this.scene.playback.state !== nr.Presenting && (this.lookup.has(r) || this.lookup.set(r, {
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
    return this.scene.playback.state !== nr.Presenting && (i = e !== this.targetId), i && (this.waitsForId = null), !i;
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
    return (r = this.signals)[t] ?? (r[t] = Oe(this.variables[t] ?? e)), () => this.signals[t]();
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
    this.cache = new me({
      firstFrame: 0,
      transitionDuration: 0,
      duration: 0,
      lastFrame: 0
    }), this.reloaded = new Yt(), this.recalculated = new Yt(), this.thread = new me(null), this.renderLifecycle = new Yt(), this.afterReset = new Yt(), this.lifecycleEvents = new Wc(this), this.previousScene = null, this.runner = null, this.state = wt.Initial, this.cached = !1, this.counters = {}, this.name = t.name, this.size = t.size, this.resolutionScale = t.resolutionScale, this.logger = t.logger, this.playback = t.playback, this.meta = t.meta, this.runnerFactory = t.config, this.creationStack = t.stack, this.experimentalFeatures = t.experimentalFeatures ?? !1, se(this.runnerFactory, ct(this.name)), this.timeEvents = new t.timeEventsClass(this), this.variables = new Kc(this), this.shaders = new Jc(this, t.sharedWebGLContext), this.slides = new Qc(this), this.random = new sr(this.meta.seed.get()), this.previousOnTop = !1;
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
      e++, await pt.consumePromises(), t.save(), t.clearRect(0, 0, t.canvas.width, t.canvas.height), this.execute(() => this.draw(t)), t.restore();
    while (pt.hasPromises() && e < 10);
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
      e.transitionDuration < 0 && this.state === wt.AfterTransitionIn && (e.transitionDuration = this.playback.frame - e.firstFrame), t(this.playback.frame + 1), await this.next();
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
    if (pt.hasPromises()) {
      const r = await pt.consumePromises();
      this.logger.error({
        message: "Tried to access an asynchronous property before the node was ready. Make sure to yield the node before accessing the property.",
        stack: r[0].stack,
        inspect: ((e = r[0].owner) == null ? void 0 : e.key) ?? void 0
      });
    }
    t.done && (this.state = wt.Finished);
  }
  async reset(t = null) {
    this.counters = {}, this.previousScene = t, this.previousOnTop = !1, this.random = new sr(this.meta.seed.get()), this.runner = Ei(() => this.runnerFactory(this.getView()), (e) => {
      this.thread.current = e;
    }), this.state = wt.AfterTransitionIn, this.afterReset.dispatch(), await this.next();
  }
  getSize() {
    return this.size;
  }
  getRealSize() {
    return this.size.mul(this.resolutionScale);
  }
  isAfterTransitionIn() {
    return this.state === wt.AfterTransitionIn;
  }
  canTransitionOut() {
    return this.state === wt.CanTransitionOut || this.state === wt.Finished;
  }
  isFinished() {
    return this.state === wt.Finished;
  }
  enterInitial() {
    this.state === wt.AfterTransitionIn ? this.state = wt.Initial : this.logger.warn(`Scene ${this.name} entered initial in an unexpected state: ${this.state}`);
  }
  enterAfterTransitionIn() {
    this.state === wt.Initial ? this.state = wt.AfterTransitionIn : this.logger.warn(`Scene ${this.name} transitioned in an unexpected state: ${this.state}`);
  }
  enterCanTransitionOut() {
    this.state === wt.AfterTransitionIn || this.state === wt.Initial ? this.state = wt.CanTransitionOut : this.logger.warn(`Scene ${this.name} was marked as finished in an unexpected state: ${this.state}`);
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
  return new ve("scene", {
    version: new zt("version", 1),
    timeEvents: new zt("time events", []),
    seed: new zt("seed", sr.createSeed())
  });
}
function _i(n, t, e) {
  const r = [...n], i = [...t];
  if (i.length >= r.length) {
    const a = Math.floor(i.length * e), l = Math.floor(it(r.length - 1, i.length, e));
    let u = "";
    for (let g = 0; g < i.length; g++)
      g < a ? u += i[g] : (r[g] || g <= l) && (u += r[g] ?? i[g]);
    return u;
  } else {
    const a = Math.round(r.length * (1 - e)), l = Math.floor(it(r.length + 1, i.length, e)), u = [];
    for (let g = r.length - 1; g >= 0; g--)
      g < a ? u.unshift(r[g]) : (i[g] || g < l) && u.unshift(i[g] ?? r[g]);
    return u.join("");
  }
}
function Ve(n, t, e, r = !1) {
  if (e === 0)
    return n;
  if (e === 1)
    return t;
  if (n == null || t == null) {
    r || St().warn(`Attempting to lerp ${n} -> ${t} may result in unexpected behavior.`);
    return;
  }
  if (typeof n == "number" && typeof t == "number")
    return it(n, t, e);
  if (typeof n == "string" && typeof t == "string")
    return _i(n, t, e);
  if (typeof n == "boolean" && typeof t == "boolean")
    return e < 0.5 ? n : t;
  if ("lerp" in n)
    return n.lerp(t, e);
  if (n && t && typeof n == "object" && typeof t == "object")
    if (Array.isArray(n) && Array.isArray(t)) {
      if (n.length === t.length)
        return n.map((i, a) => Ve(i, t[a], e));
    } else {
      let i = !1;
      if (!(n instanceof Map) && !(t instanceof Map) && (i = !0, n = new Map(Object.entries(n)), t = new Map(Object.entries(t))), n instanceof Map && t instanceof Map) {
        const a = /* @__PURE__ */ new Map();
        for (const l of /* @__PURE__ */ new Set([...n.keys(), ...t.keys()])) {
          const u = Ve(n.get(l), t.get(l), e, !0);
          u !== void 0 && a.set(l, u);
        }
        return i ? Object.fromEntries(a) : a;
      }
    }
  return t;
}
function ru(n, t, e) {
  return e < 0.5 ? n : t;
}
function it(n, t, e) {
  return n + (t - n) * e;
}
function nu(n, t, e, r, i) {
  return e + (i - n) * (r - e) / (t - n);
}
function Pt(n, t, e) {
  return e < n ? n : e > t ? t : e;
}
function ji(n, t, e) {
  let r = t;
  e > 1 ? e = 1 / e : r = !r;
  const i = r ? Math.acos(Pt(-1, 1, 1 - n)) : Math.asin(n), a = it(i, it(0, Math.PI / 2, n), e);
  let l = Math.sin(a), u = 1 - Math.cos(a);
  return t && ([l, u] = [u, l]), new v(l, u);
}
function Ht(n, t = 0, e = 1) {
  return n = n < 0.5 ? 4 * n * n * n : 1 - Math.pow(-2 * n + 2, 3) / 2, it(t, e, n);
}
function su(n, t = 0, e = 1) {
  return n = n === 1 ? 1 : 1 - Math.pow(2, -10 * n), it(t, e, n);
}
function iu(n, t = 0, e = 1) {
  return it(t, e, n);
}
se(Wt, ct());
function* Wt(n, t, e) {
  const r = Ar(), i = r.time(), a = r.time() + n;
  for (t(0, 0); a > r.fixed; ) {
    const l = r.fixed - i, u = l / n;
    l > 0 && t(u, l), yield;
  }
  r.time(a), t(1, n), e == null || e(1, n);
}
class pt {
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
    if (pt.collectionSet.has(this))
      throw new Li("A circular dependency occurred between signals.", `This can happen when signals reference each other in a loop.
        Try using the attached stack trace to locate said loop.`);
    pt.collectionSet.add(this), pt.collectionStack.push(this);
  }
  finishCollecting() {
    if (pt.collectionSet.delete(this), pt.collectionStack.pop() !== this)
      throw new Error("collectStart/collectEnd was called out of order.");
  }
  clearDependencies() {
    this.dependencies.forEach((t) => t.unsubscribe(this.markDirty)), this.dependencies.clear();
  }
  collect() {
    const t = pt.collectionStack.at(-1);
    t && (t.dependencies.add(this.event.subscribable), this.event.subscribe(t.markDirty));
  }
  dispose() {
    this.clearDependencies(), this.event.clear(), this.owner = null;
  }
  async toPromise() {
    do
      await pt.consumePromises(), this.invokable();
    while (pt.hasPromises());
    return this.invokable;
  }
}
pt.collectionSet = /* @__PURE__ */ new Set();
pt.collectionStack = [];
pt.promises = [];
const Ze = Symbol.for("@motion-canvas/core/signals/default");
function ne(n) {
  return typeof n == "function";
}
function $e(n, t) {
  return ne(n) ? () => t(n()) : t(n);
}
function Jt(n) {
  return ne(n) ? n() : n;
}
class ze extends pt {
  constructor(t, e, r = void 0, i = (l) => l, a = {}) {
    super(r), this.initial = t, this.interpolation = e, this.parser = i, this.tweening = !1, Object.defineProperty(this.invokable, "reset", {
      value: this.reset.bind(this)
    }), Object.defineProperty(this.invokable, "save", {
      value: this.save.bind(this)
    }), Object.defineProperty(this.invokable, "isInitial", {
      value: this.isInitial.bind(this)
    }), this.initial !== void 0 && (this.current = this.initial, this.markDirty(), ne(this.initial) || (this.last = this.parse(this.initial))), this.extensions = {
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
    return t === Ze && (t = this.initial), this.current === t ? this.owner : (this.current = t, this.clearDependencies(), ne(t) || (this.last = this.parse(t)), this.markDirty(), this.owner);
  }
  get() {
    return this.extensions.getter();
  }
  getter() {
    var t;
    if (this.event.isRaised() && ne(this.current)) {
      this.clearDependencies(), this.startCollecting();
      try {
        this.last = this.parse(this.current());
      } catch (e) {
        St().error({
          ...$i(e),
          inspect: (t = this.owner) == null ? void 0 : t.key
        });
      }
      this.finishCollecting();
    }
    return this.event.reset(), this.collect(), this.last;
  }
  invoke(t, e, r = Ht, i = this.interpolation) {
    return t === void 0 ? this.get() : e === void 0 ? this.set(t) : this.createQueue(r, i).to(t, e);
  }
  createQueue(t, e) {
    const r = this.get(), i = [], a = Si("animation chain", function* () {
      for (; i.length > 0; )
        yield* i.shift();
    });
    return a.to = (l, u, g = t, y = e) => (t = g, e = y, i.push(this.tween(l, u, g, y)), a), a.back = (l, u = t, g = e) => (t = u, e = g, i.push(this.tween(r, l, t, e)), a), a.wait = (l) => (i.push(Ft(l)), a), a.run = (l) => (i.push(l), a), a.do = (l) => (i.push(Si(function* () {
      l();
    })), a), a;
  }
  *tween(t, e, r, i) {
    t === Ze && (t = this.initial), this.tweening = !0, yield* this.extensions.tweener(t, e, r, i), this.set(t), this.tweening = !1;
  }
  *tweener(t, e, r, i) {
    const a = this.get();
    yield* Wt(e, (l) => {
      this.set(i(a, this.parse(Jt(t)), r(l)));
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
class Or extends ze {
  constructor(t, e, r, i, a = void 0, l = {}) {
    var u;
    super(void 0, i, a, e, l), this.entries = t, this.signals = [], this.parser = e;
    for (const g of t) {
      let y, S;
      Array.isArray(g) ? ([y, S] = g, (u = S.context).owner ?? (u.owner = this)) : (y = g, S = new ze($e(r, (M) => e(M)[g]), it, a ?? this.invokable).toSignal()), this.signals.push([y, S]), Object.defineProperty(this.invokable, y, { value: S });
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
    if (ne(t))
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
class au extends pt {
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
        St().error({
          ...$i(r),
          inspect: (e = this.owner) == null ? void 0 : e.key
        });
      }
      this.finishCollecting();
    }
    return this.event.reset(), this.collect(), this.last;
  }
}
class Di extends Or {
  constructor(t, e, r, i, a = void 0, l = {}) {
    super(t, e, r, i, a, l), Object.defineProperty(this.invokable, "edit", {
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
    const a = (l) => l.mul(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
  div(t, e, r, i) {
    const a = (l) => l.div(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
  add(t, e, r, i) {
    const a = (l) => l.add(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
  sub(t, e, r, i) {
    const a = (l) => l.sub(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
  dot(t, e, r, i) {
    const a = (l) => l.dot(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
  cross(t, e, r, i) {
    const a = (l) => l.cross(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
  mod(t, e, r, i) {
    const a = (l) => l.mod(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
}
function ou(n, t) {
  return new au(n, t).toSignal();
}
function Oe(n, t = Ve, e) {
  return new ze(n, t, e).toSignal();
}
class Nt {
  static createSignal(t, e = Nt.lerp) {
    return new Or(["top", "right", "bottom", "left"], (r) => new Nt(r), t, e).toSignal();
  }
  static lerp(t, e, r) {
    return new Nt(it(t.top, e.top, r), it(t.right, e.right, r), it(t.bottom, e.bottom, r), it(t.left, e.left, r));
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
    return Nt.lerp(this, t, e);
  }
  scale(t) {
    return new Nt(this.top * t, this.right * t, this.bottom * t, this.left * t);
  }
  addScalar(t) {
    return new Nt(this.top + t, this.right + t, this.bottom + t, this.left + t);
  }
  toSymbol() {
    return Nt.symbol;
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
Nt.symbol = Symbol.for("@motion-canvas/core/types/Spacing");
const er = 1e-6;
class lt {
  static fromRotation(t) {
    return lt.identity.rotate(t);
  }
  static fromTranslation(t) {
    return lt.identity.translate(new v(t));
  }
  static fromScaling(t) {
    return lt.identity.scale(new v(t));
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
    const t = this.values[0], e = this.values[1], r = this.values[2], i = this.values[3], a = this.values[4], l = this.values[5];
    let u = t * i - e * r;
    return u ? (u = 1 / u, new lt(i * u, -e * u, -r * u, t * u, (r * l - i * a) * u, (e * a - t * l) * u)) : null;
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
  constructor(t, e, r, i, a, l) {
    if (this.values = new Float32Array(6), arguments.length === 0) {
      this.values = new Float32Array([1, 0, 0, 1, 0, 0]);
      return;
    }
    if (arguments.length === 6) {
      this.values[0] = t, this.values[1] = e, this.values[2] = r, this.values[3] = i, this.values[4] = a, this.values[5] = l;
      return;
    }
    if (t instanceof DOMMatrix) {
      this.values[0] = t.m11, this.values[1] = t.m12, this.values[2] = t.m21, this.values[3] = t.m22, this.values[4] = t.m41, this.values[5] = t.m42;
      return;
    }
    if (t instanceof lt) {
      this.values = t.values;
      return;
    }
    if (Array.isArray(t)) {
      if (t.length === 2) {
        this.values[0] = t[0], this.values[1] = t[1], this.values[2] = e[0], this.values[3] = e[1], this.values[4] = r[0], this.values[5] = r[1];
        return;
      }
      if (t.length === 3) {
        const S = new v(t[0]), M = new v(t[1]), F = new v(t[2]);
        this.values[0] = S.x, this.values[1] = S.y, this.values[2] = M.x, this.values[3] = M.y, this.values[4] = F.x, this.values[5] = F.y;
        return;
      }
      this.values[0] = t[0], this.values[1] = t[1], this.values[2] = t[2], this.values[3] = t[3], this.values[4] = t[4], this.values[5] = t[5];
      return;
    }
    const u = new v(t), g = new v(e), y = new v(r);
    this.values[0] = u.x, this.values[1] = u.y, this.values[2] = g.x, this.values[3] = g.y, this.values[4] = y.x, this.values[5] = y.y;
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
    const e = this.values[0], r = this.values[1], i = this.values[2], a = this.values[3], l = this.values[4], u = this.values[5], g = t.values[0], y = t.values[1], S = t.values[2], M = t.values[3], F = t.values[4], U = t.values[5];
    return new lt(e * g + i * y, r * g + a * y, e * S + i * M, r * S + a * M, e * F + i * U + l, r * F + a * U + u);
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
    e && (t *= mn);
    const r = this.values[0], i = this.values[1], a = this.values[2], l = this.values[3], u = this.values[4], g = this.values[5], y = Math.sin(t), S = Math.cos(t);
    return new lt(r * S + a * y, i * S + l * y, r * -y + a * S, i * -y + l * S, u, g);
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
    return new lt(this.values[0] * e.x, this.values[1] * e.x, this.values[2] * e.y, this.values[3] * e.y, this.values[4], this.values[5]);
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
    return new lt(this.values[0] * t, this.values[1] * t, this.values[2] * t, this.values[3] * t, this.values[4] * t, this.values[5] * t);
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
    return new lt(this.values[0], this.values[1], this.values[2], this.values[3], this.values[0] * e.x + this.values[2] * e.y + this.values[4], this.values[1] * e.x + this.values[3] * e.y + this.values[5]);
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
    return new lt(this.values[0] + t.values[0], this.values[1] + t.values[1], this.values[2] + t.values[2], this.values[3] + t.values[3], this.values[4] + t.values[4], this.values[5] + t.values[5]);
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
    return new lt(this.values[0] - t.values[0], this.values[1] - t.values[1], this.values[2] - t.values[2], this.values[3] - t.values[3], this.values[4] - t.values[4], this.values[5] - t.values[5]);
  }
  toSymbol() {
    return lt.symbol;
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
  equals(t, e = er) {
    return Math.abs(this.values[0] - t.values[0]) <= e + Number.EPSILON && Math.abs(this.values[1] - t.values[1]) <= e + Number.EPSILON && Math.abs(this.values[2] - t.values[2]) <= e + Number.EPSILON && Math.abs(this.values[3] - t.values[3]) <= e + Number.EPSILON && Math.abs(this.values[4] - t.values[4]) <= e + Number.EPSILON && Math.abs(this.values[5] - t.values[5]) <= e + Number.EPSILON;
  }
  exactlyEquals(t) {
    return this.values[0] === t.values[0] && this.values[1] === t.values[1] && this.values[2] === t.values[2] && this.values[3] === t.values[3] && this.values[4] === t.values[4] && this.values[5] === t.values[5];
  }
}
lt.symbol = Symbol.for("@motion-canvas/core/types/Matrix2D");
lt.identity = new lt(1, 0, 0, 1, 0, 0);
lt.zero = new lt(0, 0, 0, 0, 0, 0);
var ki;
(function(n) {
  n[n.Vertical = 1] = "Vertical", n[n.Horizontal = 2] = "Horizontal";
})(ki || (ki = {}));
var Mt;
(function(n) {
  n[n.Top = 4] = "Top", n[n.Bottom = 8] = "Bottom", n[n.Left = 16] = "Left", n[n.Right = 32] = "Right";
})(Mt || (Mt = {}));
var ht;
(function(n) {
  n[n.Middle = 3] = "Middle", n[n.Top = 5] = "Top", n[n.Bottom = 9] = "Bottom", n[n.Left = 18] = "Left", n[n.Right = 34] = "Right", n[n.TopLeft = 20] = "TopLeft", n[n.TopRight = 36] = "TopRight", n[n.BottomLeft = 24] = "BottomLeft", n[n.BottomRight = 40] = "BottomRight";
})(ht || (ht = {}));
function lu(n) {
  if (n === ht.Middle)
    return v.zero;
  let t = 0;
  n & Mt.Left ? t = -1 : n & Mt.Right && (t = 1);
  let e = 0;
  return n & Mt.Top ? e = -1 : n & Mt.Bottom && (e = 1), new v(t, e);
}
class v {
  static createSignal(t, e = v.lerp, r) {
    return new Di(["x", "y"], (i) => new v(i), t, e, r).toSignal();
  }
  static lerp(t, e, r) {
    let i, a;
    return typeof r == "number" ? i = a = r : (i = r.x, a = r.y), new v(it(t.x, e.x, i), it(t.y, e.y, a));
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
    const l = t.degrees;
    let u = e.degrees;
    l > u !== i && (u = u + (i ? -360 : 360));
    const y = it(l, u, r) * mn, S = it(t.magnitude, e.magnitude, r);
    return new v(S * Math.cos(y) + a.x, S * Math.sin(y) + a.y);
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
    return t === ht.Middle || (t & Mt.Left ? e.x = -1 : t & Mt.Right && (e.x = 1), t & Mt.Top ? e.y = -1 : t & Mt.Bottom && (e.y = 1)), e;
  }
  static fromScalar(t) {
    return new v(t, t);
  }
  static fromRadians(t) {
    return new v(Math.cos(t), Math.sin(t));
  }
  static fromDegrees(t) {
    return v.fromRadians(t * mn);
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
    return Math.acos(Pt(-1, 1, t.dot(e) / (t.magnitude * e.magnitude))) * (t.cross(e) >= 0 ? 1 : -1);
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
    const e = new lt(t);
    return new v(this.x * e.scaleX + this.y * e.skewY + e.translateX, this.x * e.skewX + this.y * e.scaleY + e.translateY);
  }
  transform(t) {
    const e = new lt(t);
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
    const r = new v(e), i = lt.fromTranslation(r).rotate(t).translate(r.flipped);
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
  equals(t, e = er) {
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
class Z {
  static createSignal(t, e = Z.lerp) {
    return new Or(["x", "y", "width", "height"], (r) => new Z(r), t, e).toSignal();
  }
  static lerp(t, e, r) {
    let i, a, l, u;
    return typeof r == "number" ? i = a = l = u = r : r instanceof v ? (i = l = r.x, a = u = r.y) : (i = r.x, a = r.y, l = r.width, u = r.height), new Z(it(t.x, e.x, i), it(t.y, e.y, a), it(t.width, e.width, l), it(t.height, e.height, u));
  }
  static arcLerp(t, e, r, i = !1, a) {
    return a ?? (a = (t.position.sub(e.position).ctg + t.size.sub(e.size).ctg) / 2), Z.lerp(t, e, ji(r, i, a));
  }
  static fromSizeCentered(t) {
    return new Z(-t.width / 2, -t.height / 2, t.width, t.height);
  }
  static fromPoints(...t) {
    let e = 1 / 0, r = 1 / 0, i = -1 / 0, a = -1 / 0;
    for (const l of t)
      l.x > i && (i = l.x), l.x < e && (e = l.x), l.y > a && (a = l.y), l.y < r && (r = l.y);
    return new Z(e, r, i - e, a - r);
  }
  static fromBBoxes(...t) {
    let e = 1 / 0, r = 1 / 0, i = -1 / 0, a = -1 / 0;
    for (const l of t) {
      const u = l.x + l.width;
      u > i && (i = u), l.x < e && (e = l.x);
      const g = l.y + l.height;
      g > a && (a = g), l.y < r && (r = l.y);
    }
    return new Z(e, r, i - e, a - r);
  }
  lerp(t, e) {
    return Z.lerp(this, t, e);
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
    return new Z(Math.floor(this.x), Math.floor(this.y), Math.ceil(this.width + 1), Math.ceil(this.height + 1));
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
    return new Z(this.position.transformAsPoint(t), this.size.transform(t));
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
    const e = new Nt(t), r = new Z(this);
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
    const e = new Z();
    return this.intersects(t) && (e.left = Math.max(this.left, t.left), e.top = Math.max(this.top, t.top), e.right = Math.min(this.right, t.right), e.bottom = Math.min(this.bottom, t.bottom)), e;
  }
  union(t) {
    const e = new Z();
    return e.left = Math.min(this.left, t.left), e.top = Math.min(this.top, t.top), e.right = Math.max(this.right, t.right), e.bottom = Math.max(this.bottom, t.bottom), e;
  }
  toSymbol() {
    return Z.symbol;
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
Z.symbol = Symbol.for("@motion-canvas/core/types/Rect");
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
    for (var e = function(s, o, h) {
      return o === void 0 && (o = 0), h === void 0 && (h = 1), s < o ? o : s > h ? h : s;
    }, r = e, i = function(s) {
      s._clipped = !1, s._unclipped = s.slice(0);
      for (var o = 0; o <= 3; o++)
        o < 3 ? ((s[o] < 0 || s[o] > 255) && (s._clipped = !0), s[o] = r(s[o], 0, 255)) : o === 3 && (s[o] = r(s[o], 0, 1));
      return s;
    }, a = {}, l = 0, u = ["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Undefined", "Null"]; l < u.length; l += 1) {
      var g = u[l];
      a["[object " + g + "]"] = g.toLowerCase();
    }
    var y = function(s) {
      return a[Object.prototype.toString.call(s)] || "object";
    }, S = y, M = function(s, o) {
      return o === void 0 && (o = null), s.length >= 3 ? Array.prototype.slice.call(s) : S(s[0]) == "object" && o ? o.split("").filter(function(h) {
        return s[0][h] !== void 0;
      }).map(function(h) {
        return s[0][h];
      }) : s[0];
    }, F = y, U = function(s) {
      if (s.length < 2)
        return null;
      var o = s.length - 1;
      return F(s[o]) == "string" ? s[o].toLowerCase() : null;
    }, et = Math.PI, T = {
      clip_rgb: i,
      limit: e,
      type: y,
      unpack: M,
      last: U,
      TWOPI: et * 2,
      PITHIRD: et / 3,
      DEG2RAD: et / 180,
      RAD2DEG: 180 / et
    }, J = {
      format: {},
      autodetect: []
    }, ut = T.last, rt = T.clip_rgb, Et = T.type, nt = J, Gt = function() {
      for (var o = [], h = arguments.length; h--; ) o[h] = arguments[h];
      var c = this;
      if (Et(o[0]) === "object" && o[0].constructor && o[0].constructor === this.constructor)
        return o[0];
      var d = ut(o), p = !1;
      if (!d) {
        p = !0, nt.sorted || (nt.autodetect = nt.autodetect.sort(function(x, R) {
          return R.p - x.p;
        }), nt.sorted = !0);
        for (var f = 0, m = nt.autodetect; f < m.length; f += 1) {
          var b = m[f];
          if (d = b.test.apply(b, o), d)
            break;
        }
      }
      if (nt.format[d]) {
        var w = nt.format[d].apply(null, p ? o : o.slice(0, -1));
        c._rgb = rt(w);
      } else
        throw new Error("unknown format: " + o);
      c._rgb.length === 3 && c._rgb.push(1);
    };
    Gt.prototype.toString = function() {
      return Et(this.hex) == "function" ? this.hex() : "[" + this._rgb.join(",") + "]";
    };
    var j = Gt, le = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(le.Color, [null].concat(s)))();
    };
    le.Color = j, le.version = "2.4.2";
    var ft = le, Vi = T.unpack, jn = Math.max, Ji = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = Vi(s, "rgb"), c = h[0], d = h[1], p = h[2];
      c = c / 255, d = d / 255, p = p / 255;
      var f = 1 - jn(c, jn(d, p)), m = f < 1 ? 1 / (1 - f) : 0, b = (1 - c - f) * m, w = (1 - d - f) * m, x = (1 - p - f) * m;
      return [b, w, x, f];
    }, Qi = Ji, Ki = T.unpack, ta = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      s = Ki(s, "cmyk");
      var h = s[0], c = s[1], d = s[2], p = s[3], f = s.length > 4 ? s[4] : 1;
      return p === 1 ? [0, 0, 0, f] : [
        h >= 1 ? 0 : 255 * (1 - h) * (1 - p),
        // r
        c >= 1 ? 0 : 255 * (1 - c) * (1 - p),
        // g
        d >= 1 ? 0 : 255 * (1 - d) * (1 - p),
        // b
        f
      ];
    }, ea = ta, ra = ft, Dn = j, Bn = J, na = T.unpack, sa = T.type, ia = Qi;
    Dn.prototype.cmyk = function() {
      return ia(this._rgb);
    }, ra.cmyk = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(Dn, [null].concat(s, ["cmyk"])))();
    }, Bn.format.cmyk = ea, Bn.autodetect.push({
      p: 2,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = na(s, "cmyk"), sa(s) === "array" && s.length === 4)
          return "cmyk";
      }
    });
    var aa = T.unpack, oa = T.last, Er = function(s) {
      return Math.round(s * 100) / 100;
    }, la = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = aa(s, "hsla"), c = oa(s) || "lsa";
      return h[0] = Er(h[0] || 0), h[1] = Er(h[1] * 100) + "%", h[2] = Er(h[2] * 100) + "%", c === "hsla" || h.length > 3 && h[3] < 1 ? (h[3] = h.length > 3 ? h[3] : 1, c = "hsla") : h.length = 3, c + "(" + h.join(",") + ")";
    }, ha = la, ca = T.unpack, ua = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      s = ca(s, "rgba");
      var h = s[0], c = s[1], d = s[2];
      h /= 255, c /= 255, d /= 255;
      var p = Math.min(h, c, d), f = Math.max(h, c, d), m = (f + p) / 2, b, w;
      return f === p ? (b = 0, w = Number.NaN) : b = m < 0.5 ? (f - p) / (f + p) : (f - p) / (2 - f - p), h == f ? w = (c - d) / (f - p) : c == f ? w = 2 + (d - h) / (f - p) : d == f && (w = 4 + (h - c) / (f - p)), w *= 60, w < 0 && (w += 360), s.length > 3 && s[3] !== void 0 ? [w, b, m, s[3]] : [w, b, m];
    }, Nn = ua, fa = T.unpack, da = T.last, pa = ha, ga = Nn, _r = Math.round, va = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = fa(s, "rgba"), c = da(s) || "rgb";
      return c.substr(0, 3) == "hsl" ? pa(ga(h), c) : (h[0] = _r(h[0]), h[1] = _r(h[1]), h[2] = _r(h[2]), (c === "rgba" || h.length > 3 && h[3] < 1) && (h[3] = h.length > 3 ? h[3] : 1, c = "rgba"), c + "(" + h.slice(0, c === "rgb" ? 3 : 4).join(",") + ")");
    }, ma = va, ba = T.unpack, jr = Math.round, ya = function() {
      for (var s, o = [], h = arguments.length; h--; ) o[h] = arguments[h];
      o = ba(o, "hsl");
      var c = o[0], d = o[1], p = o[2], f, m, b;
      if (d === 0)
        f = m = b = p * 255;
      else {
        var w = [0, 0, 0], x = [0, 0, 0], R = p < 0.5 ? p * (1 + d) : p + d - p * d, C = 2 * p - R, $ = c / 360;
        w[0] = $ + 1 / 3, w[1] = $, w[2] = $ - 1 / 3;
        for (var L = 0; L < 3; L++)
          w[L] < 0 && (w[L] += 1), w[L] > 1 && (w[L] -= 1), 6 * w[L] < 1 ? x[L] = C + (R - C) * 6 * w[L] : 2 * w[L] < 1 ? x[L] = R : 3 * w[L] < 2 ? x[L] = C + (R - C) * (2 / 3 - w[L]) * 6 : x[L] = C;
        s = [jr(x[0] * 255), jr(x[1] * 255), jr(x[2] * 255)], f = s[0], m = s[1], b = s[2];
      }
      return o.length > 3 ? [f, m, b, o[3]] : [f, m, b, 1];
    }, Wn = ya, Un = Wn, qn = J, Gn = /^rgb\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*\)$/, Xn = /^rgba\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*([01]|[01]?\.\d+)\)$/, Hn = /^rgb\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/, Yn = /^rgba\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/, Zn = /^hsl\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/, Vn = /^hsla\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/, Jn = Math.round, Qn = function(s) {
      s = s.toLowerCase().trim();
      var o;
      if (qn.format.named)
        try {
          return qn.format.named(s);
        } catch {
        }
      if (o = s.match(Gn)) {
        for (var h = o.slice(1, 4), c = 0; c < 3; c++)
          h[c] = +h[c];
        return h[3] = 1, h;
      }
      if (o = s.match(Xn)) {
        for (var d = o.slice(1, 5), p = 0; p < 4; p++)
          d[p] = +d[p];
        return d;
      }
      if (o = s.match(Hn)) {
        for (var f = o.slice(1, 4), m = 0; m < 3; m++)
          f[m] = Jn(f[m] * 2.55);
        return f[3] = 1, f;
      }
      if (o = s.match(Yn)) {
        for (var b = o.slice(1, 5), w = 0; w < 3; w++)
          b[w] = Jn(b[w] * 2.55);
        return b[3] = +b[3], b;
      }
      if (o = s.match(Zn)) {
        var x = o.slice(1, 4);
        x[1] *= 0.01, x[2] *= 0.01;
        var R = Un(x);
        return R[3] = 1, R;
      }
      if (o = s.match(Vn)) {
        var C = o.slice(1, 4);
        C[1] *= 0.01, C[2] *= 0.01;
        var $ = Un(C);
        return $[3] = +o[4], $;
      }
    };
    Qn.test = function(s) {
      return Gn.test(s) || Xn.test(s) || Hn.test(s) || Yn.test(s) || Zn.test(s) || Vn.test(s);
    };
    var wa = Qn, xa = ft, Kn = j, ts = J, Sa = T.type, Ca = ma, es = wa;
    Kn.prototype.css = function(s) {
      return Ca(this._rgb, s);
    }, xa.css = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(Kn, [null].concat(s, ["css"])))();
    }, ts.format.css = es, ts.autodetect.push({
      p: 5,
      test: function(s) {
        for (var o = [], h = arguments.length - 1; h-- > 0; ) o[h] = arguments[h + 1];
        if (!o.length && Sa(s) === "string" && es.test(s))
          return "css";
      }
    });
    var rs = j, ka = ft, Ta = J, Pa = T.unpack;
    Ta.format.gl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = Pa(s, "rgba");
      return h[0] *= 255, h[1] *= 255, h[2] *= 255, h;
    }, ka.gl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(rs, [null].concat(s, ["gl"])))();
    }, rs.prototype.gl = function() {
      var s = this._rgb;
      return [s[0] / 255, s[1] / 255, s[2] / 255, s[3]];
    };
    var Ra = T.unpack, Ma = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = Ra(s, "rgb"), c = h[0], d = h[1], p = h[2], f = Math.min(c, d, p), m = Math.max(c, d, p), b = m - f, w = b * 100 / 255, x = f / (255 - b) * 100, R;
      return b === 0 ? R = Number.NaN : (c === m && (R = (d - p) / b), d === m && (R = 2 + (p - c) / b), p === m && (R = 4 + (c - d) / b), R *= 60, R < 0 && (R += 360)), [R, w, x];
    }, La = Ma, $a = T.unpack, Aa = Math.floor, za = function() {
      for (var s, o, h, c, d, p, f = [], m = arguments.length; m--; ) f[m] = arguments[m];
      f = $a(f, "hcg");
      var b = f[0], w = f[1], x = f[2], R, C, $;
      x = x * 255;
      var L = w * 255;
      if (w === 0)
        R = C = $ = x;
      else {
        b === 360 && (b = 0), b > 360 && (b -= 360), b < 0 && (b += 360), b /= 60;
        var B = Aa(b), q = b - B, X = x * (1 - w), V = X + L * (1 - q), bt = X + L * q, vt = X + L;
        switch (B) {
          case 0:
            s = [vt, bt, X], R = s[0], C = s[1], $ = s[2];
            break;
          case 1:
            o = [V, vt, X], R = o[0], C = o[1], $ = o[2];
            break;
          case 2:
            h = [X, vt, bt], R = h[0], C = h[1], $ = h[2];
            break;
          case 3:
            c = [X, V, vt], R = c[0], C = c[1], $ = c[2];
            break;
          case 4:
            d = [bt, X, vt], R = d[0], C = d[1], $ = d[2];
            break;
          case 5:
            p = [vt, X, V], R = p[0], C = p[1], $ = p[2];
            break;
        }
      }
      return [R, C, $, f.length > 3 ? f[3] : 1];
    }, Oa = za, Fa = T.unpack, Ia = T.type, Ea = ft, ns = j, ss = J, _a = La;
    ns.prototype.hcg = function() {
      return _a(this._rgb);
    }, Ea.hcg = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(ns, [null].concat(s, ["hcg"])))();
    }, ss.format.hcg = Oa, ss.autodetect.push({
      p: 1,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = Fa(s, "hcg"), Ia(s) === "array" && s.length === 3)
          return "hcg";
      }
    });
    var ja = T.unpack, Da = T.last, pr = Math.round, Ba = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = ja(s, "rgba"), c = h[0], d = h[1], p = h[2], f = h[3], m = Da(s) || "auto";
      f === void 0 && (f = 1), m === "auto" && (m = f < 1 ? "rgba" : "rgb"), c = pr(c), d = pr(d), p = pr(p);
      var b = c << 16 | d << 8 | p, w = "000000" + b.toString(16);
      w = w.substr(w.length - 6);
      var x = "0" + pr(f * 255).toString(16);
      switch (x = x.substr(x.length - 2), m.toLowerCase()) {
        case "rgba":
          return "#" + w + x;
        case "argb":
          return "#" + x + w;
        default:
          return "#" + w;
      }
    }, is = Ba, Na = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, Wa = /^#?([A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$/, Ua = function(s) {
      if (s.match(Na)) {
        (s.length === 4 || s.length === 7) && (s = s.substr(1)), s.length === 3 && (s = s.split(""), s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2]);
        var o = parseInt(s, 16), h = o >> 16, c = o >> 8 & 255, d = o & 255;
        return [h, c, d, 1];
      }
      if (s.match(Wa)) {
        (s.length === 5 || s.length === 9) && (s = s.substr(1)), s.length === 4 && (s = s.split(""), s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2] + s[3] + s[3]);
        var p = parseInt(s, 16), f = p >> 24 & 255, m = p >> 16 & 255, b = p >> 8 & 255, w = Math.round((p & 255) / 255 * 100) / 100;
        return [f, m, b, w];
      }
      throw new Error("unknown hex color: " + s);
    }, as = Ua, qa = ft, os = j, Ga = T.type, ls = J, Xa = is;
    os.prototype.hex = function(s) {
      return Xa(this._rgb, s);
    }, qa.hex = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(os, [null].concat(s, ["hex"])))();
    }, ls.format.hex = as, ls.autodetect.push({
      p: 4,
      test: function(s) {
        for (var o = [], h = arguments.length - 1; h-- > 0; ) o[h] = arguments[h + 1];
        if (!o.length && Ga(s) === "string" && [3, 4, 5, 6, 7, 8, 9].indexOf(s.length) >= 0)
          return "hex";
      }
    });
    var Ha = T.unpack, hs = T.TWOPI, Ya = Math.min, Za = Math.sqrt, Va = Math.acos, Ja = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = Ha(s, "rgb"), c = h[0], d = h[1], p = h[2];
      c /= 255, d /= 255, p /= 255;
      var f, m = Ya(c, d, p), b = (c + d + p) / 3, w = b > 0 ? 1 - m / b : 0;
      return w === 0 ? f = NaN : (f = (c - d + (c - p)) / 2, f /= Za((c - d) * (c - d) + (c - p) * (d - p)), f = Va(f), p > d && (f = hs - f), f /= hs), [f * 360, w, b];
    }, Qa = Ja, Ka = T.unpack, Dr = T.limit, _e = T.TWOPI, Br = T.PITHIRD, je = Math.cos, to = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      s = Ka(s, "hsi");
      var h = s[0], c = s[1], d = s[2], p, f, m;
      return isNaN(h) && (h = 0), isNaN(c) && (c = 0), h > 360 && (h -= 360), h < 0 && (h += 360), h /= 360, h < 1 / 3 ? (m = (1 - c) / 3, p = (1 + c * je(_e * h) / je(Br - _e * h)) / 3, f = 1 - (m + p)) : h < 2 / 3 ? (h -= 1 / 3, p = (1 - c) / 3, f = (1 + c * je(_e * h) / je(Br - _e * h)) / 3, m = 1 - (p + f)) : (h -= 2 / 3, f = (1 - c) / 3, m = (1 + c * je(_e * h) / je(Br - _e * h)) / 3, p = 1 - (f + m)), p = Dr(d * p * 3), f = Dr(d * f * 3), m = Dr(d * m * 3), [p * 255, f * 255, m * 255, s.length > 3 ? s[3] : 1];
    }, eo = to, ro = T.unpack, no = T.type, so = ft, cs = j, us = J, io = Qa;
    cs.prototype.hsi = function() {
      return io(this._rgb);
    }, so.hsi = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(cs, [null].concat(s, ["hsi"])))();
    }, us.format.hsi = eo, us.autodetect.push({
      p: 2,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = ro(s, "hsi"), no(s) === "array" && s.length === 3)
          return "hsi";
      }
    });
    var ao = T.unpack, oo = T.type, lo = ft, fs = j, ds = J, ho = Nn;
    fs.prototype.hsl = function() {
      return ho(this._rgb);
    }, lo.hsl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(fs, [null].concat(s, ["hsl"])))();
    }, ds.format.hsl = Wn, ds.autodetect.push({
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
      var h = s[0], c = s[1], d = s[2], p = uo(h, c, d), f = fo(h, c, d), m = f - p, b, w, x;
      return x = f / 255, f === 0 ? (b = Number.NaN, w = 0) : (w = m / f, h === f && (b = (c - d) / m), c === f && (b = 2 + (d - h) / m), d === f && (b = 4 + (h - c) / m), b *= 60, b < 0 && (b += 360)), [b, w, x];
    }, go = po, vo = T.unpack, mo = Math.floor, bo = function() {
      for (var s, o, h, c, d, p, f = [], m = arguments.length; m--; ) f[m] = arguments[m];
      f = vo(f, "hsv");
      var b = f[0], w = f[1], x = f[2], R, C, $;
      if (x *= 255, w === 0)
        R = C = $ = x;
      else {
        b === 360 && (b = 0), b > 360 && (b -= 360), b < 0 && (b += 360), b /= 60;
        var L = mo(b), B = b - L, q = x * (1 - w), X = x * (1 - w * B), V = x * (1 - w * (1 - B));
        switch (L) {
          case 0:
            s = [x, V, q], R = s[0], C = s[1], $ = s[2];
            break;
          case 1:
            o = [X, x, q], R = o[0], C = o[1], $ = o[2];
            break;
          case 2:
            h = [q, x, V], R = h[0], C = h[1], $ = h[2];
            break;
          case 3:
            c = [q, X, x], R = c[0], C = c[1], $ = c[2];
            break;
          case 4:
            d = [V, q, x], R = d[0], C = d[1], $ = d[2];
            break;
          case 5:
            p = [x, q, X], R = p[0], C = p[1], $ = p[2];
            break;
        }
      }
      return [R, C, $, f.length > 3 ? f[3] : 1];
    }, yo = bo, wo = T.unpack, xo = T.type, So = ft, ps = j, gs = J, Co = go;
    ps.prototype.hsv = function() {
      return Co(this._rgb);
    }, So.hsv = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(ps, [null].concat(s, ["hsv"])))();
    }, gs.format.hsv = yo, gs.autodetect.push({
      p: 2,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = wo(s, "hsv"), xo(s) === "array" && s.length === 3)
          return "hsv";
      }
    });
    var gr = {
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
    }, De = gr, ko = T.unpack, vs = Math.pow, To = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = ko(s, "rgb"), c = h[0], d = h[1], p = h[2], f = Po(c, d, p), m = f[0], b = f[1], w = f[2], x = 116 * b - 16;
      return [x < 0 ? 0 : x, 500 * (m - b), 200 * (b - w)];
    }, Nr = function(s) {
      return (s /= 255) <= 0.04045 ? s / 12.92 : vs((s + 0.055) / 1.055, 2.4);
    }, Wr = function(s) {
      return s > De.t3 ? vs(s, 1 / 3) : s / De.t2 + De.t0;
    }, Po = function(s, o, h) {
      s = Nr(s), o = Nr(o), h = Nr(h);
      var c = Wr((0.4124564 * s + 0.3575761 * o + 0.1804375 * h) / De.Xn), d = Wr((0.2126729 * s + 0.7151522 * o + 0.072175 * h) / De.Yn), p = Wr((0.0193339 * s + 0.119192 * o + 0.9503041 * h) / De.Zn);
      return [c, d, p];
    }, ms = To, Be = gr, Ro = T.unpack, Mo = Math.pow, Lo = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      s = Ro(s, "lab");
      var h = s[0], c = s[1], d = s[2], p, f, m, b, w, x;
      return f = (h + 16) / 116, p = isNaN(c) ? f : f + c / 500, m = isNaN(d) ? f : f - d / 200, f = Be.Yn * qr(f), p = Be.Xn * qr(p), m = Be.Zn * qr(m), b = Ur(3.2404542 * p - 1.5371385 * f - 0.4985314 * m), w = Ur(-0.969266 * p + 1.8760108 * f + 0.041556 * m), x = Ur(0.0556434 * p - 0.2040259 * f + 1.0572252 * m), [b, w, x, s.length > 3 ? s[3] : 1];
    }, Ur = function(s) {
      return 255 * (s <= 304e-5 ? 12.92 * s : 1.055 * Mo(s, 1 / 2.4) - 0.055);
    }, qr = function(s) {
      return s > Be.t1 ? s * s * s : Be.t2 * (s - Be.t0);
    }, bs = Lo, $o = T.unpack, Ao = T.type, zo = ft, ys = j, ws = J, Oo = ms;
    ys.prototype.lab = function() {
      return Oo(this._rgb);
    }, zo.lab = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(ys, [null].concat(s, ["lab"])))();
    }, ws.format.lab = bs, ws.autodetect.push({
      p: 2,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = $o(s, "lab"), Ao(s) === "array" && s.length === 3)
          return "lab";
      }
    });
    var Fo = T.unpack, Io = T.RAD2DEG, Eo = Math.sqrt, _o = Math.atan2, jo = Math.round, Do = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = Fo(s, "lab"), c = h[0], d = h[1], p = h[2], f = Eo(d * d + p * p), m = (_o(p, d) * Io + 360) % 360;
      return jo(f * 1e4) === 0 && (m = Number.NaN), [c, f, m];
    }, xs = Do, Bo = T.unpack, No = ms, Wo = xs, Uo = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = Bo(s, "rgb"), c = h[0], d = h[1], p = h[2], f = No(c, d, p), m = f[0], b = f[1], w = f[2];
      return Wo(m, b, w);
    }, qo = Uo, Go = T.unpack, Xo = T.DEG2RAD, Ho = Math.sin, Yo = Math.cos, Zo = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = Go(s, "lch"), c = h[0], d = h[1], p = h[2];
      return isNaN(p) && (p = 0), p = p * Xo, [c, Yo(p) * d, Ho(p) * d];
    }, Ss = Zo, Vo = T.unpack, Jo = Ss, Qo = bs, Ko = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      s = Vo(s, "lch");
      var h = s[0], c = s[1], d = s[2], p = Jo(h, c, d), f = p[0], m = p[1], b = p[2], w = Qo(f, m, b), x = w[0], R = w[1], C = w[2];
      return [x, R, C, s.length > 3 ? s[3] : 1];
    }, Cs = Ko, tl = T.unpack, el = Cs, rl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = tl(s, "hcl").reverse();
      return el.apply(void 0, h);
    }, nl = rl, sl = T.unpack, il = T.type, ks = ft, vr = j, Gr = J, Ts = qo;
    vr.prototype.lch = function() {
      return Ts(this._rgb);
    }, vr.prototype.hcl = function() {
      return Ts(this._rgb).reverse();
    }, ks.lch = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(vr, [null].concat(s, ["lch"])))();
    }, ks.hcl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(vr, [null].concat(s, ["hcl"])))();
    }, Gr.format.lch = Cs, Gr.format.hcl = nl, ["lch", "hcl"].forEach(function(s) {
      return Gr.autodetect.push({
        p: 2,
        test: function() {
          for (var o = [], h = arguments.length; h--; ) o[h] = arguments[h];
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
    }, Ps = al, ol = j, Rs = J, ll = T.type, Je = Ps, hl = as, cl = is;
    ol.prototype.name = function() {
      for (var s = cl(this._rgb, "rgb"), o = 0, h = Object.keys(Je); o < h.length; o += 1) {
        var c = h[o];
        if (Je[c] === s)
          return c.toLowerCase();
      }
      return s;
    }, Rs.format.named = function(s) {
      if (s = s.toLowerCase(), Je[s])
        return hl(Je[s]);
      throw new Error("unknown color name: " + s);
    }, Rs.autodetect.push({
      p: 5,
      test: function(s) {
        for (var o = [], h = arguments.length - 1; h-- > 0; ) o[h] = arguments[h + 1];
        if (!o.length && ll(s) === "string" && Je[s.toLowerCase()])
          return "named";
      }
    });
    var ul = T.unpack, fl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = ul(s, "rgb"), c = h[0], d = h[1], p = h[2];
      return (c << 16) + (d << 8) + p;
    }, dl = fl, pl = T.type, gl = function(s) {
      if (pl(s) == "number" && s >= 0 && s <= 16777215) {
        var o = s >> 16, h = s >> 8 & 255, c = s & 255;
        return [o, h, c, 1];
      }
      throw new Error("unknown num color: " + s);
    }, vl = gl, ml = ft, Ms = j, Ls = J, bl = T.type, yl = dl;
    Ms.prototype.num = function() {
      return yl(this._rgb);
    }, ml.num = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(Ms, [null].concat(s, ["num"])))();
    }, Ls.format.num = vl, Ls.autodetect.push({
      p: 5,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s.length === 1 && bl(s[0]) === "number" && s[0] >= 0 && s[0] <= 16777215)
          return "num";
      }
    });
    var wl = ft, Xr = j, $s = J, As = T.unpack, zs = T.type, Os = Math.round;
    Xr.prototype.rgb = function(s) {
      return s === void 0 && (s = !0), s === !1 ? this._rgb.slice(0, 3) : this._rgb.slice(0, 3).map(Os);
    }, Xr.prototype.rgba = function(s) {
      return s === void 0 && (s = !0), this._rgb.slice(0, 4).map(function(o, h) {
        return h < 3 ? s === !1 ? o : Os(o) : o;
      });
    }, wl.rgb = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(Xr, [null].concat(s, ["rgb"])))();
    }, $s.format.rgb = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = As(s, "rgba");
      return h[3] === void 0 && (h[3] = 1), h;
    }, $s.autodetect.push({
      p: 3,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = As(s, "rgba"), zs(s) === "array" && (s.length === 3 || s.length === 4 && zs(s[3]) == "number" && s[3] >= 0 && s[3] <= 1))
          return "rgb";
      }
    });
    var mr = Math.log, xl = function(s) {
      var o = s / 100, h, c, d;
      return o < 66 ? (h = 255, c = o < 6 ? 0 : -155.25485562709179 - 0.44596950469579133 * (c = o - 2) + 104.49216199393888 * mr(c), d = o < 20 ? 0 : -254.76935184120902 + 0.8274096064007395 * (d = o - 10) + 115.67994401066147 * mr(d)) : (h = 351.97690566805693 + 0.114206453784165 * (h = o - 55) - 40.25366309332127 * mr(h), c = 325.4494125711974 + 0.07943456536662342 * (c = o - 50) - 28.0852963507957 * mr(c), d = 255), [h, c, d, 1];
    }, Fs = xl, Sl = Fs, Cl = T.unpack, kl = Math.round, Tl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      for (var h = Cl(s, "rgb"), c = h[0], d = h[2], p = 1e3, f = 4e4, m = 0.4, b; f - p > m; ) {
        b = (f + p) * 0.5;
        var w = Sl(b);
        w[2] / w[0] >= d / c ? f = b : p = b;
      }
      return kl(b);
    }, Pl = Tl, Hr = ft, br = j, Yr = J, Rl = Pl;
    br.prototype.temp = br.prototype.kelvin = br.prototype.temperature = function() {
      return Rl(this._rgb);
    }, Hr.temp = Hr.kelvin = Hr.temperature = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(br, [null].concat(s, ["temp"])))();
    }, Yr.format.temp = Yr.format.kelvin = Yr.format.temperature = Fs;
    var Ml = T.unpack, Zr = Math.cbrt, Ll = Math.pow, $l = Math.sign, Al = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = Ml(s, "rgb"), c = h[0], d = h[1], p = h[2], f = [Vr(c / 255), Vr(d / 255), Vr(p / 255)], m = f[0], b = f[1], w = f[2], x = Zr(0.4122214708 * m + 0.5363325363 * b + 0.0514459929 * w), R = Zr(0.2119034982 * m + 0.6806995451 * b + 0.1073969566 * w), C = Zr(0.0883024619 * m + 0.2817188376 * b + 0.6299787005 * w);
      return [
        0.2104542553 * x + 0.793617785 * R - 0.0040720468 * C,
        1.9779984951 * x - 2.428592205 * R + 0.4505937099 * C,
        0.0259040371 * x + 0.7827717662 * R - 0.808675766 * C
      ];
    }, Is = Al;
    function Vr(s) {
      var o = Math.abs(s);
      return o < 0.04045 ? s / 12.92 : ($l(s) || 1) * Ll((o + 0.055) / 1.055, 2.4);
    }
    var zl = T.unpack, yr = Math.pow, Ol = Math.sign, Fl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      s = zl(s, "lab");
      var h = s[0], c = s[1], d = s[2], p = yr(h + 0.3963377774 * c + 0.2158037573 * d, 3), f = yr(h - 0.1055613458 * c - 0.0638541728 * d, 3), m = yr(h - 0.0894841775 * c - 1.291485548 * d, 3);
      return [
        255 * Jr(4.0767416621 * p - 3.3077115913 * f + 0.2309699292 * m),
        255 * Jr(-1.2684380046 * p + 2.6097574011 * f - 0.3413193965 * m),
        255 * Jr(-0.0041960863 * p - 0.7034186147 * f + 1.707614701 * m),
        s.length > 3 ? s[3] : 1
      ];
    }, Es = Fl;
    function Jr(s) {
      var o = Math.abs(s);
      return o > 31308e-7 ? (Ol(s) || 1) * (1.055 * yr(o, 1 / 2.4) - 0.055) : s * 12.92;
    }
    var Il = T.unpack, El = T.type, _l = ft, _s = j, js = J, jl = Is;
    _s.prototype.oklab = function() {
      return jl(this._rgb);
    }, _l.oklab = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(_s, [null].concat(s, ["oklab"])))();
    }, js.format.oklab = Es, js.autodetect.push({
      p: 3,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = Il(s, "oklab"), El(s) === "array" && s.length === 3)
          return "oklab";
      }
    });
    var Dl = T.unpack, Bl = Is, Nl = xs, Wl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = Dl(s, "rgb"), c = h[0], d = h[1], p = h[2], f = Bl(c, d, p), m = f[0], b = f[1], w = f[2];
      return Nl(m, b, w);
    }, Ul = Wl, ql = T.unpack, Gl = Ss, Xl = Es, Hl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      s = ql(s, "lch");
      var h = s[0], c = s[1], d = s[2], p = Gl(h, c, d), f = p[0], m = p[1], b = p[2], w = Xl(f, m, b), x = w[0], R = w[1], C = w[2];
      return [x, R, C, s.length > 3 ? s[3] : 1];
    }, Yl = Hl, Zl = T.unpack, Vl = T.type, Jl = ft, Ds = j, Bs = J, Ql = Ul;
    Ds.prototype.oklch = function() {
      return Ql(this._rgb);
    }, Jl.oklch = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(Ds, [null].concat(s, ["oklch"])))();
    }, Bs.format.oklch = Yl, Bs.autodetect.push({
      p: 3,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = Zl(s, "oklch"), Vl(s) === "array" && s.length === 3)
          return "oklch";
      }
    });
    var Ns = j, Kl = T.type;
    Ns.prototype.alpha = function(s, o) {
      return o === void 0 && (o = !1), s !== void 0 && Kl(s) === "number" ? o ? (this._rgb[3] = s, this) : new Ns([this._rgb[0], this._rgb[1], this._rgb[2], s], "rgb") : this._rgb[3];
    };
    var th = j;
    th.prototype.clipped = function() {
      return this._rgb._clipped || !1;
    };
    var Ce = j, eh = gr;
    Ce.prototype.darken = function(s) {
      s === void 0 && (s = 1);
      var o = this, h = o.lab();
      return h[0] -= eh.Kn * s, new Ce(h, "lab").alpha(o.alpha(), !0);
    }, Ce.prototype.brighten = function(s) {
      return s === void 0 && (s = 1), this.darken(-s);
    }, Ce.prototype.darker = Ce.prototype.darken, Ce.prototype.brighter = Ce.prototype.brighten;
    var rh = j;
    rh.prototype.get = function(s) {
      var o = s.split("."), h = o[0], c = o[1], d = this[h]();
      if (c) {
        var p = h.indexOf(c) - (h.substr(0, 2) === "ok" ? 2 : 0);
        if (p > -1)
          return d[p];
        throw new Error("unknown channel " + c + " in mode " + h);
      } else
        return d;
    };
    var Ne = j, nh = T.type, sh = Math.pow, ih = 1e-7, ah = 20;
    Ne.prototype.luminance = function(s) {
      if (s !== void 0 && nh(s) === "number") {
        if (s === 0)
          return new Ne([0, 0, 0, this._rgb[3]], "rgb");
        if (s === 1)
          return new Ne([255, 255, 255, this._rgb[3]], "rgb");
        var o = this.luminance(), h = "rgb", c = ah, d = function(f, m) {
          var b = f.interpolate(m, 0.5, h), w = b.luminance();
          return Math.abs(s - w) < ih || !c-- ? b : w > s ? d(f, b) : d(b, m);
        }, p = (o > s ? d(new Ne([0, 0, 0]), this) : d(this, new Ne([255, 255, 255]))).rgb();
        return new Ne(p.concat([this._rgb[3]]));
      }
      return oh.apply(void 0, this._rgb.slice(0, 3));
    };
    var oh = function(s, o, h) {
      return s = Qr(s), o = Qr(o), h = Qr(h), 0.2126 * s + 0.7152 * o + 0.0722 * h;
    }, Qr = function(s) {
      return s /= 255, s <= 0.03928 ? s / 12.92 : sh((s + 0.055) / 1.055, 2.4);
    }, $t = {}, Ws = j, Us = T.type, wr = $t, qs = function(s, o, h) {
      h === void 0 && (h = 0.5);
      for (var c = [], d = arguments.length - 3; d-- > 0; ) c[d] = arguments[d + 3];
      var p = c[0] || "lrgb";
      if (!wr[p] && !c.length && (p = Object.keys(wr)[0]), !wr[p])
        throw new Error("interpolation mode " + p + " is not defined");
      return Us(s) !== "object" && (s = new Ws(s)), Us(o) !== "object" && (o = new Ws(o)), wr[p](s, o, h).alpha(s.alpha() + h * (o.alpha() - s.alpha()));
    }, Gs = j, lh = qs;
    Gs.prototype.mix = Gs.prototype.interpolate = function(s, o) {
      o === void 0 && (o = 0.5);
      for (var h = [], c = arguments.length - 2; c-- > 0; ) h[c] = arguments[c + 2];
      return lh.apply(void 0, [this, s, o].concat(h));
    };
    var Xs = j;
    Xs.prototype.premultiply = function(s) {
      s === void 0 && (s = !1);
      var o = this._rgb, h = o[3];
      return s ? (this._rgb = [o[0] * h, o[1] * h, o[2] * h, h], this) : new Xs([o[0] * h, o[1] * h, o[2] * h, h], "rgb");
    };
    var Kr = j, hh = gr;
    Kr.prototype.saturate = function(s) {
      s === void 0 && (s = 1);
      var o = this, h = o.lch();
      return h[1] += hh.Kn * s, h[1] < 0 && (h[1] = 0), new Kr(h, "lch").alpha(o.alpha(), !0);
    }, Kr.prototype.desaturate = function(s) {
      return s === void 0 && (s = 1), this.saturate(-s);
    };
    var Hs = j, Ys = T.type;
    Hs.prototype.set = function(s, o, h) {
      h === void 0 && (h = !1);
      var c = s.split("."), d = c[0], p = c[1], f = this[d]();
      if (p) {
        var m = d.indexOf(p) - (d.substr(0, 2) === "ok" ? 2 : 0);
        if (m > -1) {
          if (Ys(o) == "string")
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
          else if (Ys(o) === "number")
            f[m] = o;
          else
            throw new Error("unsupported value for Color.set");
          var b = new Hs(f, d);
          return h ? (this._rgb = b._rgb, this) : b;
        }
        throw new Error("unknown channel " + p + " in mode " + d);
      } else
        return f;
    };
    var ch = j, uh = function(s, o, h) {
      var c = s._rgb, d = o._rgb;
      return new ch(
        c[0] + h * (d[0] - c[0]),
        c[1] + h * (d[1] - c[1]),
        c[2] + h * (d[2] - c[2]),
        "rgb"
      );
    };
    $t.rgb = uh;
    var fh = j, tn = Math.sqrt, We = Math.pow, dh = function(s, o, h) {
      var c = s._rgb, d = c[0], p = c[1], f = c[2], m = o._rgb, b = m[0], w = m[1], x = m[2];
      return new fh(
        tn(We(d, 2) * (1 - h) + We(b, 2) * h),
        tn(We(p, 2) * (1 - h) + We(w, 2) * h),
        tn(We(f, 2) * (1 - h) + We(x, 2) * h),
        "rgb"
      );
    };
    $t.lrgb = dh;
    var ph = j, gh = function(s, o, h) {
      var c = s.lab(), d = o.lab();
      return new ph(
        c[0] + h * (d[0] - c[0]),
        c[1] + h * (d[1] - c[1]),
        c[2] + h * (d[2] - c[2]),
        "lab"
      );
    };
    $t.lab = gh;
    var Zs = j, Ue = function(s, o, h, c) {
      var d, p, f, m;
      c === "hsl" ? (f = s.hsl(), m = o.hsl()) : c === "hsv" ? (f = s.hsv(), m = o.hsv()) : c === "hcg" ? (f = s.hcg(), m = o.hcg()) : c === "hsi" ? (f = s.hsi(), m = o.hsi()) : c === "lch" || c === "hcl" ? (c = "hcl", f = s.hcl(), m = o.hcl()) : c === "oklch" && (f = s.oklch().reverse(), m = o.oklch().reverse());
      var b, w, x, R, C, $;
      (c.substr(0, 1) === "h" || c === "oklch") && (d = f, b = d[0], x = d[1], C = d[2], p = m, w = p[0], R = p[1], $ = p[2]);
      var L, B, q, X;
      return !isNaN(b) && !isNaN(w) ? (w > b && w - b > 180 ? X = w - (b + 360) : w < b && b - w > 180 ? X = w + 360 - b : X = w - b, B = b + h * X) : isNaN(b) ? isNaN(w) ? B = Number.NaN : (B = w, (C == 1 || C == 0) && c != "hsv" && (L = R)) : (B = b, ($ == 1 || $ == 0) && c != "hsv" && (L = x)), L === void 0 && (L = x + h * (R - x)), q = C + h * ($ - C), c === "oklch" ? new Zs([q, L, B], c) : new Zs([B, L, q], c);
    }, vh = Ue, Vs = function(s, o, h) {
      return vh(s, o, h, "lch");
    };
    $t.lch = Vs, $t.hcl = Vs;
    var mh = j, bh = function(s, o, h) {
      var c = s.num(), d = o.num();
      return new mh(c + h * (d - c), "num");
    };
    $t.num = bh;
    var yh = Ue, wh = function(s, o, h) {
      return yh(s, o, h, "hcg");
    };
    $t.hcg = wh;
    var xh = Ue, Sh = function(s, o, h) {
      return xh(s, o, h, "hsi");
    };
    $t.hsi = Sh;
    var Ch = Ue, kh = function(s, o, h) {
      return Ch(s, o, h, "hsl");
    };
    $t.hsl = kh;
    var Th = Ue, Ph = function(s, o, h) {
      return Th(s, o, h, "hsv");
    };
    $t.hsv = Ph;
    var Rh = j, Mh = function(s, o, h) {
      var c = s.oklab(), d = o.oklab();
      return new Rh(
        c[0] + h * (d[0] - c[0]),
        c[1] + h * (d[1] - c[1]),
        c[2] + h * (d[2] - c[2]),
        "oklab"
      );
    };
    $t.oklab = Mh;
    var Lh = Ue, $h = function(s, o, h) {
      return Lh(s, o, h, "oklch");
    };
    $t.oklch = $h;
    var en = j, Ah = T.clip_rgb, rn = Math.pow, nn = Math.sqrt, sn = Math.PI, Js = Math.cos, Qs = Math.sin, zh = Math.atan2, Oh = function(s, o, h) {
      o === void 0 && (o = "lrgb"), h === void 0 && (h = null);
      var c = s.length;
      h || (h = Array.from(new Array(c)).map(function() {
        return 1;
      }));
      var d = c / h.reduce(function(B, q) {
        return B + q;
      });
      if (h.forEach(function(B, q) {
        h[q] *= d;
      }), s = s.map(function(B) {
        return new en(B);
      }), o === "lrgb")
        return Fh(s, h);
      for (var p = s.shift(), f = p.get(o), m = [], b = 0, w = 0, x = 0; x < f.length; x++)
        if (f[x] = (f[x] || 0) * h[0], m.push(isNaN(f[x]) ? 0 : h[0]), o.charAt(x) === "h" && !isNaN(f[x])) {
          var R = f[x] / 180 * sn;
          b += Js(R) * h[0], w += Qs(R) * h[0];
        }
      var C = p.alpha() * h[0];
      s.forEach(function(B, q) {
        var X = B.get(o);
        C += B.alpha() * h[q + 1];
        for (var V = 0; V < f.length; V++)
          if (!isNaN(X[V]))
            if (m[V] += h[q + 1], o.charAt(V) === "h") {
              var bt = X[V] / 180 * sn;
              b += Js(bt) * h[q + 1], w += Qs(bt) * h[q + 1];
            } else
              f[V] += X[V] * h[q + 1];
      });
      for (var $ = 0; $ < f.length; $++)
        if (o.charAt($) === "h") {
          for (var L = zh(w / m[$], b / m[$]) / sn * 180; L < 0; )
            L += 360;
          for (; L >= 360; )
            L -= 360;
          f[$] = L;
        } else
          f[$] = f[$] / m[$];
      return C /= c, new en(f, o).alpha(C > 0.99999 ? 1 : C, !0);
    }, Fh = function(s, o) {
      for (var h = s.length, c = [0, 0, 0, 0], d = 0; d < s.length; d++) {
        var p = s[d], f = o[d] / h, m = p._rgb;
        c[0] += rn(m[0], 2) * f, c[1] += rn(m[1], 2) * f, c[2] += rn(m[2], 2) * f, c[3] += m[3] * f;
      }
      return c[0] = nn(c[0]), c[1] = nn(c[1]), c[2] = nn(c[2]), c[3] > 0.9999999 && (c[3] = 1), new en(Ah(c));
    }, _t = ft, qe = T.type, Ih = Math.pow, an = function(s) {
      var o = "rgb", h = _t("#ccc"), c = 0, d = [0, 1], p = [], f = [0, 0], m = !1, b = [], w = !1, x = 0, R = 1, C = !1, $ = {}, L = !0, B = 1, q = function(k) {
        if (k = k || ["#fff", "#000"], k && qe(k) === "string" && _t.brewer && _t.brewer[k.toLowerCase()] && (k = _t.brewer[k.toLowerCase()]), qe(k) === "array") {
          k.length === 1 && (k = [k[0], k[0]]), k = k.slice(0);
          for (var I = 0; I < k.length; I++)
            k[I] = _t(k[I]);
          p.length = 0;
          for (var W = 0; W < k.length; W++)
            p.push(W / (k.length - 1));
        }
        return Rt(), b = k;
      }, X = function(k) {
        if (m != null) {
          for (var I = m.length - 1, W = 0; W < I && k >= m[W]; )
            W++;
          return W - 1;
        }
        return 0;
      }, V = function(k) {
        return k;
      }, bt = function(k) {
        return k;
      }, vt = function(k, I) {
        var W, N;
        if (I == null && (I = !1), isNaN(k) || k === null)
          return h;
        if (I)
          N = k;
        else if (m && m.length > 2) {
          var yt = X(k);
          N = yt / (m.length - 2);
        } else R !== x ? N = (k - x) / (R - x) : N = 1;
        N = bt(N), I || (N = V(N)), B !== 1 && (N = Ih(N, B)), N = f[0] + N * (1 - f[0] - f[1]), N = Math.min(1, Math.max(0, N));
        var st = Math.floor(N * 1e4);
        if (L && $[st])
          W = $[st];
        else {
          if (qe(b) === "array")
            for (var H = 0; H < p.length; H++) {
              var Q = p[H];
              if (N <= Q) {
                W = b[H];
                break;
              }
              if (N >= Q && H === p.length - 1) {
                W = b[H];
                break;
              }
              if (N > Q && N < p[H + 1]) {
                N = (N - Q) / (p[H + 1] - Q), W = _t.interpolate(b[H], b[H + 1], N, o);
                break;
              }
            }
          else qe(b) === "function" && (W = b(N));
          L && ($[st] = W);
        }
        return W;
      }, Rt = function() {
        return $ = {};
      };
      q(s);
      var G = function(k) {
        var I = _t(vt(k));
        return w && I[w] ? I[w]() : I;
      };
      return G.classes = function(k) {
        if (k != null) {
          if (qe(k) === "array")
            m = k, d = [k[0], k[k.length - 1]];
          else {
            var I = _t.analyze(d);
            k === 0 ? m = [I.min, I.max] : m = _t.limits(I, "e", k);
          }
          return G;
        }
        return m;
      }, G.domain = function(k) {
        if (!arguments.length)
          return d;
        x = k[0], R = k[k.length - 1], p = [];
        var I = b.length;
        if (k.length === I && x !== R)
          for (var W = 0, N = Array.from(k); W < N.length; W += 1) {
            var yt = N[W];
            p.push((yt - x) / (R - x));
          }
        else {
          for (var st = 0; st < I; st++)
            p.push(st / (I - 1));
          if (k.length > 2) {
            var H = k.map(function(K, tt) {
              return tt / (k.length - 1);
            }), Q = k.map(function(K) {
              return (K - x) / (R - x);
            });
            Q.every(function(K, tt) {
              return H[tt] === K;
            }) || (bt = function(K) {
              if (K <= 0 || K >= 1)
                return K;
              for (var tt = 0; K >= Q[tt + 1]; )
                tt++;
              var Dt = (K - Q[tt]) / (Q[tt + 1] - Q[tt]), ue = H[tt] + Dt * (H[tt + 1] - H[tt]);
              return ue;
            });
          }
        }
        return d = [x, R], G;
      }, G.mode = function(k) {
        return arguments.length ? (o = k, Rt(), G) : o;
      }, G.range = function(k, I) {
        return q(k), G;
      }, G.out = function(k) {
        return w = k, G;
      }, G.spread = function(k) {
        return arguments.length ? (c = k, G) : c;
      }, G.correctLightness = function(k) {
        return k == null && (k = !0), C = k, Rt(), C ? V = function(I) {
          for (var W = vt(0, !0).lab()[0], N = vt(1, !0).lab()[0], yt = W > N, st = vt(I, !0).lab()[0], H = W + (N - W) * I, Q = st - H, K = 0, tt = 1, Dt = 20; Math.abs(Q) > 0.01 && Dt-- > 0; )
            (function() {
              return yt && (Q *= -1), Q < 0 ? (K = I, I += (tt - I) * 0.5) : (tt = I, I += (K - I) * 0.5), st = vt(I, !0).lab()[0], Q = st - H;
            })();
          return I;
        } : V = function(I) {
          return I;
        }, G;
      }, G.padding = function(k) {
        return k != null ? (qe(k) === "number" && (k = [k, k]), f = k, G) : f;
      }, G.colors = function(k, I) {
        arguments.length < 2 && (I = "hex");
        var W = [];
        if (arguments.length === 0)
          W = b.slice(0);
        else if (k === 1)
          W = [G(0.5)];
        else if (k > 1) {
          var N = d[0], yt = d[1] - N;
          W = Eh(0, k).map(function(tt) {
            return G(N + tt / (k - 1) * yt);
          });
        } else {
          s = [];
          var st = [];
          if (m && m.length > 2)
            for (var H = 1, Q = m.length, K = 1 <= Q; K ? H < Q : H > Q; K ? H++ : H--)
              st.push((m[H - 1] + m[H]) * 0.5);
          else
            st = d;
          W = st.map(function(tt) {
            return G(tt);
          });
        }
        return _t[I] && (W = W.map(function(tt) {
          return tt[I]();
        })), W;
      }, G.cache = function(k) {
        return k != null ? (L = k, G) : L;
      }, G.gamma = function(k) {
        return k != null ? (B = k, G) : B;
      }, G.nodata = function(k) {
        return k != null ? (h = _t(k), G) : h;
      }, G;
    };
    function Eh(s, o, h) {
      for (var c = [], d = s < o, p = o, f = s; d ? f < p : f > p; d ? f++ : f--)
        c.push(f);
      return c;
    }
    var Qe = j, _h = an, jh = function(s) {
      for (var o = [1, 1], h = 1; h < s; h++) {
        for (var c = [1], d = 1; d <= o.length; d++)
          c[d] = (o[d] || 0) + o[d - 1];
        o = c;
      }
      return o;
    }, Dh = function(s) {
      var o, h, c, d, p, f, m;
      if (s = s.map(function(C) {
        return new Qe(C);
      }), s.length === 2)
        o = s.map(function(C) {
          return C.lab();
        }), p = o[0], f = o[1], d = function(C) {
          var $ = [0, 1, 2].map(function(L) {
            return p[L] + C * (f[L] - p[L]);
          });
          return new Qe($, "lab");
        };
      else if (s.length === 3)
        h = s.map(function(C) {
          return C.lab();
        }), p = h[0], f = h[1], m = h[2], d = function(C) {
          var $ = [0, 1, 2].map(function(L) {
            return (1 - C) * (1 - C) * p[L] + 2 * (1 - C) * C * f[L] + C * C * m[L];
          });
          return new Qe($, "lab");
        };
      else if (s.length === 4) {
        var b;
        c = s.map(function(C) {
          return C.lab();
        }), p = c[0], f = c[1], m = c[2], b = c[3], d = function(C) {
          var $ = [0, 1, 2].map(function(L) {
            return (1 - C) * (1 - C) * (1 - C) * p[L] + 3 * (1 - C) * (1 - C) * C * f[L] + 3 * (1 - C) * C * C * m[L] + C * C * C * b[L];
          });
          return new Qe($, "lab");
        };
      } else if (s.length >= 5) {
        var w, x, R;
        w = s.map(function(C) {
          return C.lab();
        }), R = s.length - 1, x = jh(R), d = function(C) {
          var $ = 1 - C, L = [0, 1, 2].map(function(B) {
            return w.reduce(function(q, X, V) {
              return q + x[V] * Math.pow($, R - V) * Math.pow(C, V) * X[B];
            }, 0);
          });
          return new Qe(L, "lab");
        };
      } else
        throw new RangeError("No point in running bezier with only one color.");
      return d;
    }, Bh = function(s) {
      var o = Dh(s);
      return o.scale = function() {
        return _h(o);
      }, o;
    }, on = ft, jt = function(s, o, h) {
      if (!jt[h])
        throw new Error("unknown blend mode " + h);
      return jt[h](s, o);
    }, he = function(s) {
      return function(o, h) {
        var c = on(h).rgb(), d = on(o).rgb();
        return on.rgb(s(c, d));
      };
    }, ce = function(s) {
      return function(o, h) {
        var c = [];
        return c[0] = s(o[0], h[0]), c[1] = s(o[1], h[1]), c[2] = s(o[2], h[2]), c;
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
    jt.normal = he(ce(Nh)), jt.multiply = he(ce(Wh)), jt.screen = he(ce(Gh)), jt.overlay = he(ce(Xh)), jt.darken = he(ce(Uh)), jt.lighten = he(ce(qh)), jt.dodge = he(ce(Yh)), jt.burn = he(ce(Hh));
    for (var Zh = jt, ln = T.type, Vh = T.clip_rgb, Jh = T.TWOPI, Qh = Math.pow, Kh = Math.sin, tc = Math.cos, Ks = ft, ec = function(s, o, h, c, d) {
      s === void 0 && (s = 300), o === void 0 && (o = -1.5), h === void 0 && (h = 1), c === void 0 && (c = 1), d === void 0 && (d = [0, 1]);
      var p = 0, f;
      ln(d) === "array" ? f = d[1] - d[0] : (f = 0, d = [d, d]);
      var m = function(b) {
        var w = Jh * ((s + 120) / 360 + o * b), x = Qh(d[0] + f * b, c), R = p !== 0 ? h[0] + b * p : h, C = R * x * (1 - x) / 2, $ = tc(w), L = Kh(w), B = x + C * (-0.14861 * $ + 1.78277 * L), q = x + C * (-0.29227 * $ - 0.90649 * L), X = x + C * (1.97294 * $);
        return Ks(Vh([B * 255, q * 255, X * 255, 1]));
      };
      return m.start = function(b) {
        return b == null ? s : (s = b, m);
      }, m.rotations = function(b) {
        return b == null ? o : (o = b, m);
      }, m.gamma = function(b) {
        return b == null ? c : (c = b, m);
      }, m.hue = function(b) {
        return b == null ? h : (h = b, ln(h) === "array" ? (p = h[1] - h[0], p === 0 && (h = h[1])) : p = 0, m);
      }, m.lightness = function(b) {
        return b == null ? d : (ln(b) === "array" ? (d = b, f = b[1] - b[0]) : (d = [b, b], f = 0), m);
      }, m.scale = function() {
        return Ks.scale(m);
      }, m.hue(h), m;
    }, rc = j, nc = "0123456789abcdef", sc = Math.floor, ic = Math.random, ac = function() {
      for (var s = "#", o = 0; o < 6; o++)
        s += nc.charAt(sc(ic() * 16));
      return new rc(s, "hex");
    }, hn = y, ti = Math.log, oc = Math.pow, lc = Math.floor, hc = Math.abs, ei = function(s, o) {
      o === void 0 && (o = null);
      var h = {
        min: Number.MAX_VALUE,
        max: Number.MAX_VALUE * -1,
        sum: 0,
        values: [],
        count: 0
      };
      return hn(s) === "object" && (s = Object.values(s)), s.forEach(function(c) {
        o && hn(c) === "object" && (c = c[o]), c != null && !isNaN(c) && (h.values.push(c), h.sum += c, c < h.min && (h.min = c), c > h.max && (h.max = c), h.count += 1);
      }), h.domain = [h.min, h.max], h.limits = function(c, d) {
        return ri(h, c, d);
      }, h;
    }, ri = function(s, o, h) {
      o === void 0 && (o = "equal"), h === void 0 && (h = 7), hn(s) == "array" && (s = ei(s));
      var c = s.min, d = s.max, p = s.values.sort(function(un, fn) {
        return un - fn;
      });
      if (h === 1)
        return [c, d];
      var f = [];
      if (o.substr(0, 1) === "c" && (f.push(c), f.push(d)), o.substr(0, 1) === "e") {
        f.push(c);
        for (var m = 1; m < h; m++)
          f.push(c + m / h * (d - c));
        f.push(d);
      } else if (o.substr(0, 1) === "l") {
        if (c <= 0)
          throw new Error("Logarithmic scales are only possible for values > 0");
        var b = Math.LOG10E * ti(c), w = Math.LOG10E * ti(d);
        f.push(c);
        for (var x = 1; x < h; x++)
          f.push(oc(10, b + x / h * (w - b)));
        f.push(d);
      } else if (o.substr(0, 1) === "q") {
        f.push(c);
        for (var R = 1; R < h; R++) {
          var C = (p.length - 1) * R / h, $ = lc(C);
          if ($ === C)
            f.push(p[$]);
          else {
            var L = C - $;
            f.push(p[$] * (1 - L) + p[$ + 1] * L);
          }
        }
        f.push(d);
      } else if (o.substr(0, 1) === "k") {
        var B, q = p.length, X = new Array(q), V = new Array(h), bt = !0, vt = 0, Rt = null;
        Rt = [], Rt.push(c);
        for (var G = 1; G < h; G++)
          Rt.push(c + G / h * (d - c));
        for (Rt.push(d); bt; ) {
          for (var k = 0; k < h; k++)
            V[k] = 0;
          for (var I = 0; I < q; I++)
            for (var W = p[I], N = Number.MAX_VALUE, yt = void 0, st = 0; st < h; st++) {
              var H = hc(Rt[st] - W);
              H < N && (N = H, yt = st), V[yt]++, X[I] = yt;
            }
          for (var Q = new Array(h), K = 0; K < h; K++)
            Q[K] = null;
          for (var tt = 0; tt < q; tt++)
            B = X[tt], Q[B] === null ? Q[B] = p[tt] : Q[B] += p[tt];
          for (var Dt = 0; Dt < h; Dt++)
            Q[Dt] *= 1 / V[Dt];
          bt = !1;
          for (var ue = 0; ue < h; ue++)
            if (Q[ue] !== Rt[ue]) {
              bt = !0;
              break;
            }
          Rt = Q, vt++, vt > 200 && (bt = !1);
        }
        for (var fe = {}, Ge = 0; Ge < h; Ge++)
          fe[Ge] = [];
        for (var Xe = 0; Xe < q; Xe++)
          B = X[Xe], fe[B].push(p[Xe]);
        for (var te = [], ke = 0; ke < h; ke++)
          te.push(fe[ke][0]), te.push(fe[ke][fe[ke].length - 1]);
        te = te.sort(function(un, fn) {
          return un - fn;
        }), f.push(te[0]);
        for (var Ke = 1; Ke < te.length; Ke += 2) {
          var Te = te[Ke];
          !isNaN(Te) && f.indexOf(Te) === -1 && f.push(Te);
        }
      }
      return f;
    }, ni = { analyze: ei, limits: ri }, si = j, cc = function(s, o) {
      s = new si(s), o = new si(o);
      var h = s.luminance(), c = o.luminance();
      return h > c ? (h + 0.05) / (c + 0.05) : (c + 0.05) / (h + 0.05);
    }, ii = j, Kt = Math.sqrt, dt = Math.pow, uc = Math.min, fc = Math.max, ai = Math.atan2, oi = Math.abs, xr = Math.cos, li = Math.sin, dc = Math.exp, hi = Math.PI, pc = function(s, o, h, c, d) {
      h === void 0 && (h = 1), c === void 0 && (c = 1), d === void 0 && (d = 1);
      var p = function(Te) {
        return 360 * Te / (2 * hi);
      }, f = function(Te) {
        return 2 * hi * Te / 360;
      };
      s = new ii(s), o = new ii(o);
      var m = Array.from(s.lab()), b = m[0], w = m[1], x = m[2], R = Array.from(o.lab()), C = R[0], $ = R[1], L = R[2], B = (b + C) / 2, q = Kt(dt(w, 2) + dt(x, 2)), X = Kt(dt($, 2) + dt(L, 2)), V = (q + X) / 2, bt = 0.5 * (1 - Kt(dt(V, 7) / (dt(V, 7) + dt(25, 7)))), vt = w * (1 + bt), Rt = $ * (1 + bt), G = Kt(dt(vt, 2) + dt(x, 2)), k = Kt(dt(Rt, 2) + dt(L, 2)), I = (G + k) / 2, W = p(ai(x, vt)), N = p(ai(L, Rt)), yt = W >= 0 ? W : W + 360, st = N >= 0 ? N : N + 360, H = oi(yt - st) > 180 ? (yt + st + 360) / 2 : (yt + st) / 2, Q = 1 - 0.17 * xr(f(H - 30)) + 0.24 * xr(f(2 * H)) + 0.32 * xr(f(3 * H + 6)) - 0.2 * xr(f(4 * H - 63)), K = st - yt;
      K = oi(K) <= 180 ? K : st <= yt ? K + 360 : K - 360, K = 2 * Kt(G * k) * li(f(K) / 2);
      var tt = C - b, Dt = k - G, ue = 1 + 0.015 * dt(B - 50, 2) / Kt(20 + dt(B - 50, 2)), fe = 1 + 0.045 * I, Ge = 1 + 0.015 * I * Q, Xe = 30 * dc(-dt((H - 275) / 25, 2)), te = 2 * Kt(dt(I, 7) / (dt(I, 7) + dt(25, 7))), ke = -te * li(2 * f(Xe)), Ke = Kt(dt(tt / (h * ue), 2) + dt(Dt / (c * fe), 2) + dt(K / (d * Ge), 2) + ke * (Dt / (c * fe)) * (K / (d * Ge)));
      return fc(0, uc(100, Ke));
    }, ci = j, gc = function(s, o, h) {
      h === void 0 && (h = "lab"), s = new ci(s), o = new ci(o);
      var c = s.get(h), d = o.get(h), p = 0;
      for (var f in c) {
        var m = (c[f] || 0) - (d[f] || 0);
        p += m * m;
      }
      return Math.sqrt(p);
    }, vc = j, mc = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      try {
        return new (Function.prototype.bind.apply(vc, [null].concat(s)))(), !0;
      } catch {
        return !1;
      }
    }, ui = ft, fi = an, bc = {
      cool: function() {
        return fi([ui.hsl(180, 1, 0.9), ui.hsl(250, 0.7, 0.4)]);
      },
      hot: function() {
        return fi(["#000", "#f00", "#ff0", "#fff"]).mode("rgb");
      }
    }, Sr = {
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
    }, cn = 0, di = Object.keys(Sr); cn < di.length; cn += 1) {
      var pi = di[cn];
      Sr[pi.toLowerCase()] = Sr[pi];
    }
    var yc = Sr, gt = ft;
    gt.average = Oh, gt.bezier = Bh, gt.blend = Zh, gt.cubehelix = ec, gt.mix = gt.interpolate = qs, gt.random = ac, gt.scale = an, gt.analyze = ni.analyze, gt.contrast = cc, gt.deltaE = pc, gt.distance = gc, gt.limits = ni.limits, gt.valid = mc, gt.scales = bc, gt.colors = Ps, gt.brewer = yc;
    var wc = gt;
    return wc;
  });
})(Bi);
var ot = Bi.exports;
const be = (ot.Color.symbol = ot.Color.prototype.symbol = Symbol.for("@motion-canvas/core/types/Color"), ot.Color.lerp = ot.Color.prototype.lerp = (n, t, e, r = "lch") => {
  typeof n == "string" && (n = new ot.Color(n)), typeof t == "string" && (t = new ot.Color(t));
  const i = n instanceof ot.Color, a = t instanceof ot.Color;
  return i || (n = a ? t.alpha(0) : new ot.Color("rgba(0, 0, 0, 0)")), a || (t = i ? n.alpha(0) : new ot.Color("rgba(0, 0, 0, 0)")), ot.mix(n, t, e, r);
}, ot.Color.createLerp = ot.Color.prototype.createLerp = (n) => (t, e, r) => ot.Color.lerp(t, e, r, n), ot.Color.createSignal = (n, t = ot.Color.lerp) => new ze(n, t, void 0, (e) => new ot.Color(e)).toSignal(), ot.Color.prototype.toSymbol = () => ot.Color.symbol, ot.Color.prototype.toUniform = function(n, t) {
  n.uniform4fv(t, this.gl());
}, ot.Color.prototype.serialize = function() {
  return this.css();
}, ot.Color.prototype.lerp = function(n, t, e) {
  return ot.Color.lerp(this, n, t, e);
}, ot.Color);
function cu(n, t) {
  return v.fromDegrees(n).transform(t).degrees;
}
function bn(n, t) {
  return v.magnitude(t.m11, t.m12) * n;
}
class yn extends zt {
  constructor() {
    super(...arguments), this.type = be.symbol;
  }
  parse(t) {
    return t === null ? null : new be(t);
  }
  serialize() {
    var t;
    return ((t = this.value.current) == null ? void 0 : t.serialize()) ?? null;
  }
}
class Ae extends zt {
  constructor(t, e, r = ((i) => (i = e[0]) == null ? void 0 : i.value)()) {
    super(t, r), this.options = e, this.type = Ae.symbol;
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
Ae.symbol = Symbol.for("@motion-canvas/core/meta/EnumMetaField");
class uu extends zt {
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
    var u, g;
    const i = e.plugins.flatMap((y) => {
      var S;
      return ((S = y.exporters) == null ? void 0 : S.call(y, e)) ?? [];
    }), a = i.map((y) => y.meta(e)), l = new Ae("exporter", i.map((y) => ({
      value: y.id,
      text: y.displayName
    })), (u = i[r]) == null ? void 0 : u.id);
    super(t, {
      name: l.get(),
      options: (g = a[r]) == null ? void 0 : g.get()
    }), this.current = r, this.type = Object, this.handleChange = () => {
      var M, F, U;
      const y = this.exporterField.get(), S = Math.max(this.exporters.findIndex((et) => et.id === y), 0);
      this.current !== S && ((M = this.options) == null || M.onChanged.unsubscribe(this.handleChange), this.current = S, (F = this.options) == null || F.onChanged.subscribe(this.handleChange, !1), this.fields.current = this.options ? [this.exporterField, this.options] : [this.exporterField]), this.value.current = {
        name: this.exporterField.get(),
        options: ((U = this.options) == null ? void 0 : U.get()) ?? null
      };
    }, this.exporters = i, this.exporterField = l, this.exporterField.onChanged.subscribe(this.handleChange, !1), this.exporterField.disable(a.length < 2).space(), this.optionFields = a, this.fields = new me([this.exporterField]), this.options && (this.options.onChanged.subscribe(this.handleChange, !1), this.fields.current = [this.exporterField, this.options]);
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
var tr;
class ir {
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
    if (tr.sourceLookup[this.source])
      throw new Error(`Metadata for ${this.name} is already being updated`);
    const e = this.source;
    await new Promise((r, i) => {
      setTimeout(() => {
        delete tr.sourceLookup[e], i(`Connection timeout when updating metadata for ${this.name}`);
      }, 1e3), tr.sourceLookup[e] = () => {
        delete tr.sourceLookup[e], r();
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
tr = ir;
ir.sourceLookup = {};
class gn extends zt {
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
class Fr extends zt {
  constructor() {
    super(...arguments), this.type = Fr.symbol;
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
    this.value.current = this.parseRange(r / i - er, t / i - er, e / i - er);
  }
  parseRange(t, e = this.value.current[0], r = this.value.current[1]) {
    return e = Pt(0, t, e), r = Pt(0, t, r ?? 1 / 0), e > r && ([e, r] = [r, e]), r >= t && (r = 1 / 0), [e, r];
  }
}
Fr.symbol = Symbol.for("@motion-canvas/core/meta/RangeMetaField");
class Ni extends zt {
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
let Mn;
Mn ?? (Mn = new ir("_build_project", !1));
Mn.loadData({
  version: 0
});
const fu = Mn;
let Ln;
Ln ?? (Ln = new ir("scene", !1));
Ln.loadData(
  {
    version: 0
  }
);
const du = Ln;
function pu(n) {
  var t;
  return !!((t = n.prototype) != null && t.isClass);
}
const Wi = Symbol.for("@motion-canvas/2d/fragment");
function at(n, t, e) {
  const { ref: r, children: i, ...a } = t, l = Array.isArray(i) ? i.flat() : i;
  if (n === Wi)
    return l;
  if (pu(n)) {
    const u = new n({ ...a, children: l, key: e });
    return r == null || r(u), u;
  } else
    return n({ ...a, ref: r, children: l, key: e });
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
    }, this.value = Oe(this.props.value, it, this);
  }
  isActive() {
    return this.value() !== this.props.default;
  }
  serialize(t) {
    let e = this.value();
    return this.props.transform && (e = bn(e, t)), `${this.props.name}(${e * this.props.scale}${this.props.unit})`;
  }
}
const ee = Symbol.for("@motion-canvas/2d/decorators/initializers");
function ar(n, t) {
  if (!n[ee])
    n[ee] = [];
  else if (
    // if one of the prototypes has initializers
    n[ee] && // and it's not the target object itself
    !Object.prototype.hasOwnProperty.call(n, ee)
  ) {
    const e = Object.getPrototypeOf(n);
    n[ee] = [...e[ee]];
  }
  n[ee].push(t);
}
function vu(n, t) {
  if (n[ee])
    try {
      n[ee].forEach((e) => e(n, t));
    } catch (e) {
      throw e.inspect ?? (e.inspect = n.key), e;
    }
}
function _() {
  return (n, t) => {
    ar(n, (e) => {
      const r = Object.getPrototypeOf(e)[t];
      e[t] = ou(r.bind(e), e);
    });
  };
}
function wn(n = {}, t, e) {
  const r = {};
  if (e && t) {
    const i = n.setter ?? (t == null ? void 0 : t[`set${Le(e)}`]);
    i && (r.setter = i.bind(t));
    const a = n.getter ?? (t == null ? void 0 : t[`get${Le(e)}`]);
    a && (r.getter = a.bind(t));
    const l = n.tweener ?? (t == null ? void 0 : t[`tween${Le(e)}`]);
    l && (r.tweener = l.bind(t));
  }
  return r;
}
const re = Symbol.for("@motion-canvas/2d/decorators/properties");
function Fe(n, t) {
  var e;
  return ((e = n[re]) == null ? void 0 : e[t]) ?? null;
}
function $n(n, t) {
  let e;
  return n[re] ? n[re] && !Object.prototype.hasOwnProperty.call(n, re) ? n[re] = e = Object.fromEntries(Object.entries(n[re]).map(([r, i]) => [r, { ...i }])) : e = n[re] : n[re] = e = {}, e[t] ?? (e[t] = {
    cloneable: !0,
    inspectable: !0,
    compoundEntries: []
  }), e[t];
}
function Ui(n) {
  return n && typeof n == "object" ? n[re] ?? {} : {};
}
function An(n, t) {
  vu(n);
  for (const [e, r] of Object.entries(Ui(n))) {
    const i = n[e];
    if (i.reset(), t[e] !== void 0 && i(t[e]), r.compoundEntries !== void 0)
      for (const [a, l] of r.compoundEntries)
        l in t && i[a](t[l]);
  }
}
function P() {
  return (n, t) => {
    const e = $n(n, t);
    ar(n, (r) => {
      var u;
      let i = e.default;
      const a = r[`getDefault${Le(t)}`];
      a && (i = () => a.call(r, e.default));
      const l = new ze(i, e.interpolationFunction ?? Ve, r, (u = e.parser) == null ? void 0 : u.bind(r), wn(e, r, t));
      r[t] = l.toSignal();
    });
  };
}
function z(n) {
  return (t, e) => {
    const r = Fe(t, e);
    if (!r) {
      St().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.default = n;
  };
}
function zn(n) {
  return (t, e) => {
    const r = Fe(t, e);
    if (!r) {
      St().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.interpolationFunction = n;
  };
}
function On(n) {
  return (t, e) => {
    const r = Fe(t, e);
    if (!r) {
      St().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.parser = n;
  };
}
function or(n) {
  return (t, e) => {
    const r = Fe(t, e);
    if (!r) {
      St().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.parser = (i) => new n(i), "lerp" in n && (r.interpolationFunction ?? (r.interpolationFunction = n.lerp));
  };
}
function Ie(n = !0) {
  return (t, e) => {
    const r = Fe(t, e);
    if (!r) {
      St().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.cloneable = n;
  };
}
function qi(n = !0) {
  return (t, e) => {
    const r = Fe(t, e);
    if (!r) {
      St().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.inspectable = n;
  };
}
function Gi(n, t = Or) {
  return (e, r) => {
    const i = $n(e, r);
    i.compound = !0, i.compoundEntries = Object.entries(n), ar(e, (a) => {
      if (!i.parser) {
        St().error(`Missing parser decorator for "${r.toString()}"`);
        return;
      }
      const l = i.default, u = i.parser.bind(a), g = new t(i.compoundEntries.map(([y, S]) => {
        const M = new ze($e(l, (F) => u(F)[y]), it, a, void 0, wn(void 0, a, S)).toSignal();
        return [y, M];
      }), u, l, i.interpolationFunction ?? Ve, a, wn(i, a, r));
      a[r] = g.toSignal();
    });
  };
}
function ie(n) {
  return (t, e) => {
    Gi(typeof n == "object" ? n : {
      x: n ? `${n}X` : "x",
      y: n ? `${n}Y` : "y"
    }, Di)(t, e), or(v)(t, e);
  };
}
var we = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
class Qt {
  constructor(t) {
    An(this, t);
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
      e.addColorStop(Jt(r), new be(Jt(i)).serialize());
    return e;
  }
}
we([
  z("linear"),
  P()
], Qt.prototype, "type", void 0);
we([
  ie("from")
], Qt.prototype, "from", void 0);
we([
  ie("to")
], Qt.prototype, "to", void 0);
we([
  z(0),
  P()
], Qt.prototype, "angle", void 0);
we([
  z(0),
  P()
], Qt.prototype, "fromRadius", void 0);
we([
  z(0),
  P()
], Qt.prototype, "toRadius", void 0);
we([
  z([]),
  P()
], Qt.prototype, "stops", void 0);
we([
  _()
], Qt.prototype, "canvasGradient", null);
var Fn = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
class lr {
  constructor(t) {
    An(this, t);
  }
  canvasPattern(t) {
    return t.createPattern(this.image(), this.repetition());
  }
}
Fn([
  P()
], lr.prototype, "image", void 0);
Fn([
  z(null),
  P()
], lr.prototype, "repetition", void 0);
Fn([
  _()
], lr.prototype, "canvasPattern", null);
function mu(n) {
  return n === null ? null : n instanceof Qt || n instanceof lr ? n : new be(n);
}
function xn(n, t) {
  return n === null ? "" : n instanceof be ? n.serialize() : n instanceof Qt ? n.canvasGradient(t) : n instanceof lr ? n.canvasPattern(t) ?? "" : "";
}
function Pi(n, t, e, r, i) {
  if (e.top === 0 && e.right === 0 && e.bottom === 0 && e.left === 0) {
    bu(n, t);
    return;
  }
  const a = ge(e.top, e.right, e.left, t), l = ge(e.right, e.top, e.bottom, t), u = ge(e.bottom, e.left, e.right, t), g = ge(e.left, e.bottom, e.top, t);
  if (r) {
    const y = (S) => {
      const M = S * i;
      return S - M;
    };
    n.moveTo(t.left + a, t.top), n.lineTo(t.right - l, t.top), n.bezierCurveTo(t.right - y(l), t.top, t.right, t.top + y(l), t.right, t.top + l), n.lineTo(t.right, t.bottom - u), n.bezierCurveTo(t.right, t.bottom - y(u), t.right - y(u), t.bottom, t.right - u, t.bottom), n.lineTo(t.left + g, t.bottom), n.bezierCurveTo(t.left + y(g), t.bottom, t.left, t.bottom - y(g), t.left, t.bottom - g), n.lineTo(t.left, t.top + a), n.bezierCurveTo(t.left, t.top + y(a), t.left + y(a), t.top, t.left + a, t.top);
    return;
  }
  n.moveTo(t.left + a, t.top), n.arcTo(t.right, t.top, t.right, t.bottom, l), n.arcTo(t.right, t.bottom, t.left, t.bottom, u), n.arcTo(t.left, t.bottom, t.left, t.top, g), n.arcTo(t.left, t.top, t.right, t.top, a);
}
function ge(n, t, e, r) {
  const i = n + t > r.width ? r.width * (n / (n + t)) : n, a = n + e > r.height ? r.height * (n / (n + e)) : n;
  return Math.min(i, a);
}
function bu(n, t) {
  n.rect(t.x, t.y, t.width, t.height);
}
function hr(n, t) {
  n.moveTo(t.x, t.y);
}
function Vt(n, t) {
  n.lineTo(t.x, t.y);
}
function de(n, t) {
  if (!(t.length < 2)) {
    hr(n, t[0]);
    for (const e of t.slice(1))
      Vt(n, e);
  }
}
function Xi(n, t, e = 8) {
  Vt(n, t.addY(-e)), Vt(n, t.addY(e)), Vt(n, t), Vt(n, t.addX(-e)), Hi(n, t, e);
}
function Hi(n, t, e, r = 0, i = Math.PI * 2, a = !1) {
  n.arc(t.x, t.y, e, r, i, a);
}
function yu(n, t, e, r) {
  n.bezierCurveTo(t.x, t.y, e.x, e.y, r.x, r.y);
}
function In(n) {
  return (t) => t instanceof n;
}
function Yi() {
  return (n, t) => {
    P()(n, t), On(mu)(n, t), zn(be.lerp)(n, t), z(null)(n, t);
  };
}
function wu() {
  return (n, t) => {
    P()(n, t), or(be)(n, t);
  };
}
function xe(n, t = (e) => e) {
  return (e, r) => {
    e[`getDefault${Le(r)}`] = function() {
      this.requestLayoutUpdate();
      const i = this.element.style[n];
      this.element.style[n] = "";
      const a = t.call(this, this.styles.getPropertyValue(n));
      return this.element.style[n] = i, a;
    };
  };
}
class xu extends ze {
  constructor(t, e) {
    super(t, Ve, e);
    for (const r in Ti) {
      const i = Ti[r];
      Object.defineProperty(this.invokable, r, {
        value: (a, l, u = Ht) => {
          var y, S, M;
          if (a === void 0)
            return ((S = (y = this.get()) == null ? void 0 : y.find((F) => F.name === i.name)) == null ? void 0 : S.value()) ?? i.default ?? 0;
          let g = (M = this.get()) == null ? void 0 : M.find((F) => F.name === i.name);
          return g || (g = new gu(i), this.set([...this.get(), g])), l === void 0 ? (g.value(a), this.owner) : g.value(a, l, u);
        }
      });
    }
  }
  *tweener(t, e, r) {
    const i = this.get(), a = Jt(t);
    if (Cu(i, a)) {
      yield* xt(...i.map((g, y) => g.value(a[y].value(), e, r))), this.set(a);
      return;
    }
    for (const g of a)
      g.value(g.default);
    const l = a.map((g) => g.value.context.raw()), u = i.length > 0 && a.length > 0 ? e / 2 : e;
    i.length > 0 && (yield* xt(...i.map((g) => g.value(g.default, u, r)))), this.set(a), a.length > 0 && (yield* xt(...a.map((g, y) => g.value(l[y], u, r))));
  }
}
function Su() {
  return (n, t) => {
    const e = $n(n, t);
    ar(n, (r) => {
      r[t] = new xu(e.default ?? [], r).toSignal();
    });
  };
}
function Cu(n, t) {
  if (n.length !== t.length)
    return !1;
  for (let e = 0; e < n.length; e++)
    if (n[e].name !== t[e].name)
      return !1;
  return !0;
}
const ku = Symbol.for("@motion-canvas/2d/nodeName");
function ae(n) {
  return function(t) {
    t.prototype[ku] = n;
  };
}
function Ri(n, t) {
  const e = Pt(0, n.arcLength, t);
  let r = 0;
  for (const i of n.segments) {
    const a = r;
    if (r += i.arcLength, r >= e) {
      const l = (e - a) / i.arcLength;
      return i.getPoint(Pt(0, 1, l));
    }
  }
  return { position: v.zero, tangent: v.up, normal: v.up };
}
function Ir(n) {
  return (t, e) => {
    Gi({
      top: n ? `${n}Top` : "top",
      right: n ? `${n}Right` : "right",
      bottom: n ? `${n}Bottom` : "bottom",
      left: n ? `${n}Left` : "left"
    })(t, e), or(Nt)(t, e);
  };
}
function Tu(n) {
  let t;
  return n ? typeof n == "string" ? t = [{ fragment: n }] : Array.isArray(n) ? t = n.map((e) => typeof e == "string" ? { fragment: e } : e) : t = [n] : t = [], !kn().experimentalFeatures && t.length > 0 && (t = [], St().log({
    ...Fc("Node uses experimental shaders."),
    inspect: this.key
  })), t;
}
function kr() {
  return kn();
}
var D = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, Tr;
let E = Tr = class {
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
    this.position($e(t, (e) => new v(e).transformAsPoint(this.worldToParent())));
  }
  getAbsoluteRotation() {
    const t = this.localToWorld();
    return v.degrees(t.m11, t.m12);
  }
  setAbsoluteRotation(t) {
    this.rotation($e(t, (e) => cu(e, this.worldToParent())));
  }
  getAbsoluteScale() {
    const t = this.localToWorld();
    return new v(v.magnitude(t.m11, t.m12), v.magnitude(t.m21, t.m22));
  }
  setAbsoluteScale(t) {
    this.scale($e(t, (e) => this.getRelativeScale(new v(e))));
  }
  getRelativeScale(t) {
    var r;
    const e = ((r = this.parent()) == null ? void 0 : r.absoluteScale()) ?? v.one;
    return t.div(e);
  }
  *tweenCompositeOperation(t, e, r) {
    const i = Jt(t);
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
      if (this.children.context.setter(t), !ne(t))
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
    return ne(this.children.context.raw()) && this.spawnChildren(!0, t), this.realChildren;
  }
  sortedChildren() {
    return [...this.children()].sort((t, e) => Math.sign(t.zIndex() - e.zIndex()));
  }
  constructor({ children: t, spawner: e, key: r, ...i }) {
    this.compositeOverride = Oe(0), this.stateStack = [], this.realChildren = [], this.hasSpawnedChildren = !1, this.parent = Oe(null), this.properties = Ui(this);
    const a = kr();
    [this.key, this.unregister] = a.registerNode(this, r), this.view2D = a.getView(), this.creationStack = new Error().stack, An(this, i), e && St().warn({
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
    for (const l of r)
      l instanceof Tr && (a.push(l), l.remove(), l.parent(this));
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
        const l = r[a];
        if (l === this) {
          const u = a + t;
          for (; a < u && a + 1 < r.length; a++)
            i[a] = r[a + 1];
        }
        i[a] = l;
      }
    else
      for (let a = r.length - 1; a >= 0; a--) {
        const l = r[a];
        if (l === this) {
          const u = a + t;
          for (; a > u && a > 0; a--)
            i[a] = r[a - 1];
        }
        i[a] = l;
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
      return St().error("Cannot position nodes relative to each other if they don't belong to the same parent."), this;
    const i = r.children(), a = i.indexOf(this), l = i.indexOf(t);
    if (!e && a < l)
      return this;
    const u = l - a - 1;
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
      return St().error("Cannot position nodes relative to each other if they don't belong to the same parent."), this;
    const i = r.children(), a = i.indexOf(this), l = i.indexOf(t);
    if (!e && a > l)
      return this;
    const u = l - a + 1;
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
      for (let l = a.length - 1; l >= 0; l--)
        r.push(a[l]);
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
      for (let l = a.length - 1; l >= 0; l--)
        r.push(a[l]);
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
    ne(this.children.context.raw()) ? e.children ?? (e.children = this.children.context.raw()) : this.children().length > 0 && (e.children ?? (e.children = this.children().map((r) => r.clone())));
    for (const { key: r, meta: i, signal: a } of this)
      if (!(!i.cloneable || r in e))
        if (i.compound)
          for (const [l, u] of i.compoundEntries) {
            if (u in e)
              continue;
            const g = a[l];
            g.context.isInitial() || (e[u] = g.context.raw());
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
      const l = a.parent.context.raw();
      l && l !== this && l.removeChild(a), i.add(a.key), a.parent(this);
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
      i instanceof Tr && e.push(i);
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
    return new Z();
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
    for (const l of e) {
      const u = l.fullCacheBBox(), g = l.localToParent();
      i.push(...u.corners.map((y) => y.transformAsPoint(g)));
    }
    return Z.fromPoints(...i).addSpacing(r);
  }
  /**
   * Get a bounding box for the contents rendered by this node (including
   * effects applied after caching).
   *
   * @remarks
   * The returned bounding box should be in local space.
   */
  fullCacheBBox() {
    const t = this.compositeToLocal(), e = this.shadowOffset().transform(t), r = bn(this.shadowBlur(), t), i = this.cacheBBox().expand(this.filters.blur() * 2 + r);
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
    const t = Z.fromSizeCentered(this.view().size()).expand(this.view().cachePadding()), e = Z.fromPoints(...t.transformCorners(this.view().localToWorld())), r = Z.fromPoints(...this.cacheBBox().transformCorners(this.localToWorld()));
    return e.intersection(r).pixelPerfect.expand(2);
  }
  parentWorldSpaceCacheBBox() {
    var t;
    return ((t = this.findAncestor((e) => e.requiresCache())) == null ? void 0 : t.worldSpaceCacheBBox()) ?? new Z(v.zero, kr().getRealSize());
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
      const r = this.compositeToWorld(), i = this.shadowOffset().transform(r), a = bn(this.shadowBlur(), r);
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
    var M, F;
    const r = this.shaders();
    if (r.length === 0)
      return null;
    const i = kr(), a = i.getRealSize(), l = this.parentWorldSpaceCacheBBox(), u = new DOMMatrix().scaleSelf(a.width / l.width, a.height / -l.height).translateSelf(l.x / -a.width, l.y / a.height - 1), g = this.worldSpaceCacheBBox(), y = new DOMMatrix().scaleSelf(a.width / g.width, a.height / -g.height).translateSelf(g.x / -a.width, g.y / a.height - 1).invertSelf(), S = i.shaders.getGL();
    i.shaders.copyTextures(t, e), i.shaders.clear();
    for (const U of r) {
      const et = i.shaders.getProgram(U.fragment);
      if (et) {
        if (U.uniforms)
          for (const [T, J] of Object.entries(U.uniforms)) {
            const ut = S.getUniformLocation(et, T);
            if (ut === null)
              continue;
            const rt = Jt(J);
            typeof rt == "number" ? S.uniform1f(ut, rt) : "toUniform" in rt ? rt.toUniform(S, ut) : rt.length === 1 ? S.uniform1f(ut, rt[0]) : rt.length === 2 ? S.uniform2f(ut, rt[0], rt[1]) : rt.length === 3 ? S.uniform3f(ut, rt[0], rt[1], rt[2]) : rt.length === 4 && S.uniform4f(ut, rt[0], rt[1], rt[2], rt[3]);
          }
        S.uniform1f(S.getUniformLocation(et, Ci), this.view2D.globalTime()), S.uniform1i(S.getUniformLocation(et, Ci), i.playback.frame), S.uniformMatrix4fv(S.getUniformLocation(et, Yc), !1, y.toFloat32Array()), S.uniformMatrix4fv(S.getUniformLocation(et, Zc), !1, u.toFloat32Array()), (M = U.setup) == null || M.call(U, S, et), i.shaders.render(), (F = U.teardown) == null || F.call(U, S, et);
      }
    }
    return S.canvas;
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
    t.strokeStyle = "white", t.lineWidth = 1, t.beginPath(), de(t, r), t.closePath(), t.stroke(), t.strokeStyle = "blue", t.beginPath(), de(t, i), t.closePath(), t.stroke();
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
      await pt.consumePromises(), this.collectAsyncResources();
    while (pt.hasPromises());
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
  applyState(t, e, r = Ht) {
    if (e === void 0)
      for (const a in t) {
        const l = this.signalByKey(a);
        l && l(t[a]);
      }
    const i = [];
    for (const a in t) {
      const l = this.signalByKey(a);
      t[a] !== l.context.raw() && i.push(l(t[a], e, r));
    }
    return xt(...i);
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
  restore(t, e = Ht) {
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
  ie()
], E.prototype, "position", void 0);
D([
  or(v),
  Ie(!1),
  P()
], E.prototype, "absolutePosition", void 0);
D([
  z(0),
  P()
], E.prototype, "rotation", void 0);
D([
  Ie(!1),
  P()
], E.prototype, "absoluteRotation", void 0);
D([
  z(v.one),
  ie("scale")
], E.prototype, "scale", void 0);
D([
  z(v.zero),
  ie("skew")
], E.prototype, "skew", void 0);
D([
  or(v),
  Ie(!1),
  P()
], E.prototype, "absoluteScale", void 0);
D([
  z(0),
  P()
], E.prototype, "zIndex", void 0);
D([
  z(!1),
  P()
], E.prototype, "cache", void 0);
D([
  Ir("cachePadding")
], E.prototype, "cachePadding", void 0);
D([
  z(!1),
  P()
], E.prototype, "composite", void 0);
D([
  z("source-over"),
  P()
], E.prototype, "compositeOperation", void 0);
D([
  ct()
], E.prototype, "tweenCompositeOperation", null);
D([
  z(1),
  On((n) => Pt(0, 1, n)),
  P()
], E.prototype, "opacity", void 0);
D([
  _()
], E.prototype, "absoluteOpacity", null);
D([
  Su()
], E.prototype, "filters", void 0);
D([
  z("#0000"),
  wu()
], E.prototype, "shadowColor", void 0);
D([
  z(0),
  P()
], E.prototype, "shadowBlur", void 0);
D([
  ie("shadowOffset")
], E.prototype, "shadowOffset", void 0);
D([
  z([]),
  On(Tu),
  P()
], E.prototype, "shaders", void 0);
D([
  _()
], E.prototype, "hasFilters", null);
D([
  _()
], E.prototype, "hasShadow", null);
D([
  _()
], E.prototype, "filterString", null);
D([
  qi(!1),
  Ie(!1),
  P()
], E.prototype, "spawner", void 0);
D([
  qi(!1),
  Ie(!1),
  P()
], E.prototype, "children", void 0);
D([
  _()
], E.prototype, "spawnedChildren", null);
D([
  _()
], E.prototype, "sortedChildren", null);
D([
  _()
], E.prototype, "localToWorld", null);
D([
  _()
], E.prototype, "worldToLocal", null);
D([
  _()
], E.prototype, "worldToParent", null);
D([
  _()
], E.prototype, "parentToWorld", null);
D([
  _()
], E.prototype, "localToParent", null);
D([
  _()
], E.prototype, "compositeToWorld", null);
D([
  _()
], E.prototype, "compositeRoot", null);
D([
  _()
], E.prototype, "compositeToLocal", null);
D([
  _()
], E.prototype, "cacheCanvas", null);
D([
  _()
], E.prototype, "cachedCanvas", null);
D([
  _()
], E.prototype, "cacheBBox", null);
D([
  _()
], E.prototype, "fullCacheBBox", null);
D([
  _()
], E.prototype, "worldSpaceCacheBBox", null);
D([
  _()
], E.prototype, "parentWorldSpaceCacheBBox", null);
E = Tr = D([
  ae("Node")
], E);
E.prototype.isClass = !0;
var O = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, Pr;
let A = Pr = class extends E {
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
    const a = this.desiredSize().x, l = typeof a != "number" || typeof t != "number";
    let u;
    l ? u = this.size.x() : u = a;
    let g;
    l ? (this.size.x(t), g = this.size.x()) : g = t, this.size.x(u), l && this.lockSize(), yield* Wt(e, (y) => this.size.x(i(u, g, r(y)))), this.size.x(t), l && this.releaseSize();
  }
  getHeight() {
    return this.computedSize().height;
  }
  setHeight(t) {
    this.height.context.setter(t);
  }
  *tweenHeight(t, e, r, i) {
    const a = this.desiredSize().y, l = typeof a != "number" || typeof t != "number";
    let u;
    l ? u = this.size.y() : u = a;
    let g;
    l ? (this.size.y(t), g = this.size.y()) : g = t, this.size.y(u), l && this.lockSize(), yield* Wt(e, (y) => this.size.y(i(u, g, r(y)))), this.size.y(t), l && this.releaseSize();
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
    let l;
    typeof a.x != "number" || typeof a.y != "number" ? l = this.size() : l = new v(a);
    let u;
    typeof t == "object" && typeof t.x == "number" && typeof t.y == "number" ? u = new v(t) : (this.size(t), u = this.size()), this.size(l), this.lockSize(), yield* Wt(e, (g) => this.size(i(l, u, r(g)))), this.releaseSize(), this.size(t);
  }
  /**
   * Get the cardinal point corresponding to the given origin.
   *
   * @param origin - The origin or direction of the point.
   */
  cardinalPoint(t) {
    switch (t) {
      case ht.TopLeft:
        return this.topLeft;
      case ht.TopRight:
        return this.topRight;
      case ht.BottomLeft:
        return this.bottomLeft;
      case ht.BottomRight:
        return this.bottomRight;
      case ht.Top:
      case Mt.Top:
        return this.top;
      case ht.Bottom:
      case Mt.Bottom:
        return this.bottom;
      case ht.Left:
      case Mt.Left:
        return this.left;
      case ht.Right:
      case Mt.Right:
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
    return this.findAncestor(In(Pr));
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
    return new Z(this.element.getBoundingClientRect());
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
      i instanceof Pr ? i.layoutEnabled() && (e.push(i), r.push(i.element)) : i && t.unshift(...i.children());
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
    return Z.fromSizeCentered(this.computedSize());
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
    const r = this.computedSize(), i = r.mul(this.offset()).scale(0.5).transformAsPoint(e), a = Z.fromSizeCentered(r), l = a.transformCorners(e), u = a.addSpacing(this.padding().scale(-1)).transformCorners(e), g = a.addSpacing(this.margin()).transformCorners(e);
    t.beginPath(), de(t, g), de(t, l), t.closePath(), t.fillStyle = "rgba(255,193,125,0.6)", t.fill("evenodd"), t.beginPath(), de(t, l), de(t, u), t.closePath(), t.fillStyle = "rgba(180,255,147,0.6)", t.fill("evenodd"), t.beginPath(), de(t, l), t.closePath(), t.lineWidth = 1, t.strokeStyle = "white", t.stroke(), t.beginPath(), Xi(t, i), t.stroke();
  }
  getOriginDelta(t) {
    const e = this.computedSize().scale(0.5), r = this.offset().mul(e);
    return t === ht.Middle ? r.flipped : lu(t).mul(e).sub(r);
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
O([
  z(null),
  zn(ru),
  P()
], A.prototype, "layout", void 0);
O([
  z(null),
  P()
], A.prototype, "maxWidth", void 0);
O([
  z(null),
  P()
], A.prototype, "maxHeight", void 0);
O([
  z(null),
  P()
], A.prototype, "minWidth", void 0);
O([
  z(null),
  P()
], A.prototype, "minHeight", void 0);
O([
  z(null),
  P()
], A.prototype, "ratio", void 0);
O([
  Ir("margin")
], A.prototype, "margin", void 0);
O([
  Ir("padding")
], A.prototype, "padding", void 0);
O([
  z("row"),
  P()
], A.prototype, "direction", void 0);
O([
  z(null),
  P()
], A.prototype, "basis", void 0);
O([
  z(0),
  P()
], A.prototype, "grow", void 0);
O([
  z(1),
  P()
], A.prototype, "shrink", void 0);
O([
  z("nowrap"),
  P()
], A.prototype, "wrap", void 0);
O([
  z("start"),
  P()
], A.prototype, "justifyContent", void 0);
O([
  z("normal"),
  P()
], A.prototype, "alignContent", void 0);
O([
  z("stretch"),
  P()
], A.prototype, "alignItems", void 0);
O([
  z("auto"),
  P()
], A.prototype, "alignSelf", void 0);
O([
  z(0),
  ie({ x: "columnGap", y: "rowGap" })
], A.prototype, "gap", void 0);
O([
  xe("font-family"),
  P()
], A.prototype, "fontFamily", void 0);
O([
  xe("font-size", parseFloat),
  P()
], A.prototype, "fontSize", void 0);
O([
  xe("font-style"),
  P()
], A.prototype, "fontStyle", void 0);
O([
  xe("font-weight", parseInt),
  P()
], A.prototype, "fontWeight", void 0);
O([
  xe("line-height", parseFloat),
  P()
], A.prototype, "lineHeight", void 0);
O([
  xe("letter-spacing", (n) => n === "normal" ? 0 : parseFloat(n)),
  P()
], A.prototype, "letterSpacing", void 0);
O([
  xe("white-space", (n) => n === "pre" ? "pre" : n === "normal"),
  P()
], A.prototype, "textWrap", void 0);
O([
  z("inherit"),
  P()
], A.prototype, "textDirection", void 0);
O([
  xe("text-align"),
  P()
], A.prototype, "textAlign", void 0);
O([
  z({ x: null, y: null }),
  ie({ x: "width", y: "height" })
], A.prototype, "size", void 0);
O([
  ct()
], A.prototype, "tweenWidth", null);
O([
  ct()
], A.prototype, "tweenHeight", null);
O([
  _()
], A.prototype, "desiredSize", null);
O([
  ct()
], A.prototype, "tweenSize", null);
O([
  ie("offset")
], A.prototype, "offset", void 0);
O([
  oe(ht.Middle)
], A.prototype, "middle", void 0);
O([
  oe(ht.Top)
], A.prototype, "top", void 0);
O([
  oe(ht.Bottom)
], A.prototype, "bottom", void 0);
O([
  oe(ht.Left)
], A.prototype, "left", void 0);
O([
  oe(ht.Right)
], A.prototype, "right", void 0);
O([
  oe(ht.TopLeft)
], A.prototype, "topLeft", void 0);
O([
  oe(ht.TopRight)
], A.prototype, "topRight", void 0);
O([
  oe(ht.BottomLeft)
], A.prototype, "bottomLeft", void 0);
O([
  oe(ht.BottomRight)
], A.prototype, "bottomRight", void 0);
O([
  z(!1),
  P()
], A.prototype, "clip", void 0);
O([
  z(0),
  P()
], A.prototype, "sizeLockCounter", void 0);
O([
  _()
], A.prototype, "parentTransform", null);
O([
  _()
], A.prototype, "anchorPosition", null);
O([
  _()
], A.prototype, "layoutEnabled", null);
O([
  _()
], A.prototype, "isLayoutRoot", null);
O([
  _()
], A.prototype, "scalingRotationMatrix", null);
O([
  _()
], A.prototype, "computedPosition", null);
O([
  _()
], A.prototype, "computedSize", null);
O([
  _()
], A.prototype, "requestLayoutUpdate", null);
O([
  _()
], A.prototype, "appendedToView", null);
O([
  _()
], A.prototype, "updateLayout", null);
O([
  _()
], A.prototype, "layoutChildren", null);
O([
  _()
], A.prototype, "requestFontUpdate", null);
O([
  _()
], A.prototype, "applyFlex", null);
O([
  _()
], A.prototype, "applyFont", null);
A = Pr = O([
  ae("Layout")
], A);
function oe(n) {
  return (t, e) => {
    P()(t, e), Ie(!1)(t, e);
    const r = Fe(t, e);
    r.parser = (i) => new v(i), r.getter = function() {
      return this.computedSize().getOriginOffset(n).transformAsPoint(this.localToParent());
    }, r.setter = function(i) {
      return this.position($e(i, (a) => this.getOriginDelta(n).transform(this.scalingRotationMatrix()).flipped.add(a))), this;
    };
  };
}
ar(A.prototype, (n) => {
  n.element = document.createElement("div"), n.element.style.display = "flex", n.element.style.boxSizing = "border-box", n.styles = getComputedStyle(n.element);
});
var Ot = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
let Ct = class extends A {
  rippleSize() {
    return su(this.rippleStrength(), 0, 50);
  }
  constructor(t) {
    super(t), this.rippleStrength = Oe(0);
  }
  applyText(t) {
    t.direction = this.textDirection(), this.element.dir = this.textDirection();
  }
  applyStyle(t) {
    t.fillStyle = xn(this.fill(), t), t.strokeStyle = xn(this.stroke(), t), t.lineWidth = this.lineWidth(), t.lineJoin = this.lineJoin(), t.lineCap = this.lineCap(), t.setLineDash(this.lineDash()), t.lineDashOffset = this.lineDashOffset(), this.antialiased() || (t.filter = "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxmaWx0ZXIgaWQ9ImZpbHRlciIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj48ZmVDb21wb25lbnRUcmFuc2Zlcj48ZmVGdW5jUiB0eXBlPSJpZGVudGl0eSIvPjxmZUZ1bmNHIHR5cGU9ImlkZW50aXR5Ii8+PGZlRnVuY0IgdHlwZT0iaWRlbnRpdHkiLz48ZmVGdW5jQSB0eXBlPSJkaXNjcmV0ZSIgdGFibGVWYWx1ZXM9IjAgMSIvPjwvZmVDb21wb25lbnRUcmFuc2Zlcj48L2ZpbHRlcj48L3N2Zz4=#filter)");
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
      t.save(), t.globalAlpha *= it(0.54, 0, e), t.fill(r), t.restore();
    }
  }
  *ripple(t = 1) {
    this.rippleStrength(0), yield* this.rippleStrength(1, t, iu), this.rippleStrength(0);
  }
};
Ot([
  Yi()
], Ct.prototype, "fill", void 0);
Ot([
  Yi()
], Ct.prototype, "stroke", void 0);
Ot([
  z(!1),
  P()
], Ct.prototype, "strokeFirst", void 0);
Ot([
  z(0),
  P()
], Ct.prototype, "lineWidth", void 0);
Ot([
  z("miter"),
  P()
], Ct.prototype, "lineJoin", void 0);
Ot([
  z("butt"),
  P()
], Ct.prototype, "lineCap", void 0);
Ot([
  z([]),
  P()
], Ct.prototype, "lineDash", void 0);
Ot([
  z(0),
  P()
], Ct.prototype, "lineDashOffset", void 0);
Ot([
  z(!0),
  P()
], Ct.prototype, "antialiased", void 0);
Ot([
  _()
], Ct.prototype, "rippleSize", null);
Ot([
  _()
], Ct.prototype, "getPath", null);
Ot([
  ct()
], Ct.prototype, "ripple", null);
Ct = Ot([
  ae("Shape")
], Ct);
var Ut = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
let Lt = class extends Ct {
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
    return Pt(0, this.baseArcLength(), this.startOffset() + this.offsetArcLength() * t);
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
    return Pt(0, r, r - t - e);
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
    const l = a - i, u = Math.min(l / 2, this.arrowSize());
    this.startArrow() && (i += u / 2), this.endArrow() && (a -= u / 2);
    let g = 0, y = null, S = null, M = null, F = null;
    for (const U of r.segments) {
      const et = g;
      if (g += U.arcLength, g < i)
        continue;
      const T = (i - et) / U.arcLength, J = (a - et) / U.arcLength, ut = Pt(0, 1, T), rt = Pt(0, 1, J);
      this.canHaveSubpath && M && !U.getPoint(0).position.equals(M) && (t.addPath(e), this.processSubpath(e, y, M), e = new Path2D(), y = null);
      const [Et, nt] = U.draw(e, ut, rt, y === null);
      if (y === null && (y = Et.position, S = Et.normal.flipped.perpendicular), M = nt.position, F = nt.normal.flipped.perpendicular, g > a)
        break;
    }
    return this.closed() && this.start.isInitial() && this.end.isInitial() && this.startOffset.isInitial() && this.endOffset.isInitial() && e.closePath(), this.processSubpath(e, y, M), t.addPath(e), {
      startPoint: y ?? v.zero,
      startTangent: S ?? v.right,
      endPoint: M ?? v.zero,
      endTangent: F ?? v.right,
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
    const { startPoint: e, startTangent: r, endPoint: i, endTangent: a, arrowSize: l } = this.curveDrawingInfo();
    l < 1e-3 || (t.save(), t.beginPath(), this.endArrow() && this.drawArrow(t, i, a.flipped, l), this.startArrow() && this.drawArrow(t, e, r, l), t.fillStyle = xn(this.stroke(), t), t.closePath(), t.fill(), t.restore());
  }
  drawArrow(t, e, r, i) {
    const a = r.perpendicular, l = e.add(r.scale(-i / 2));
    hr(t, l), Vt(t, l.add(r.add(a).scale(i))), Vt(t, l.add(r.sub(a).scale(i))), Vt(t, l), t.closePath();
  }
};
Ut([
  z(!1),
  P()
], Lt.prototype, "closed", void 0);
Ut([
  z(0),
  P()
], Lt.prototype, "start", void 0);
Ut([
  z(0),
  P()
], Lt.prototype, "startOffset", void 0);
Ut([
  z(!1),
  P()
], Lt.prototype, "startArrow", void 0);
Ut([
  z(1),
  P()
], Lt.prototype, "end", void 0);
Ut([
  z(0),
  P()
], Lt.prototype, "endOffset", void 0);
Ut([
  z(!1),
  P()
], Lt.prototype, "endArrow", void 0);
Ut([
  z(24),
  P()
], Lt.prototype, "arrowSize", void 0);
Ut([
  _()
], Lt.prototype, "arcLength", null);
Ut([
  _()
], Lt.prototype, "curveDrawingInfo", null);
Lt = Ut([
  ae("Curve")
], Lt);
class En {
}
class Zi extends En {
  constructor(t, e, r, i, a) {
    super(), this.center = t, this.radius = e, this.from = r, this.to = i, this.counter = a, this.angle = Math.acos(Pt(-1, 1, r.dot(i))), this.length = Math.abs(this.angle * e);
    const l = new v(1, 1).scale(e);
    this.points = [t.sub(l), t.add(l)];
  }
  get arcLength() {
    return this.length;
  }
  draw(t, e, r) {
    const i = this.counter ? -1 : 1, a = this.from.radians + e * this.angle * i, l = this.to.radians - (1 - r) * this.angle * i;
    Math.abs(this.angle) > 1e-4 && t.arc(this.center.x, this.center.y, this.radius, a, l, this.counter);
    const u = v.fromRadians(a), g = v.fromRadians(l);
    return [
      {
        position: this.center.add(u.scale(this.radius)),
        tangent: this.counter ? u : u.flipped,
        normal: this.counter ? u.flipped : u
      },
      {
        position: this.center.add(g.scale(this.radius)),
        tangent: this.counter ? g.flipped : g,
        normal: this.counter ? g.flipped : g
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
class Tt {
  /**
   * Constructs a constant polynomial
   *
   * @param c0 - The constant coefficient
   */
  static constant(t) {
    return new Tt(t);
  }
  /**
   * Constructs a linear polynomial
   *
   * @param c0 - The constant coefficient
   * @param c1 - The linear coefficient
   */
  static linear(t, e) {
    return new Tt(t, e);
  }
  /**
   * Constructs a quadratic polynomial
   *
   * @param c0 - The constant coefficient
   * @param c1 - The linear coefficient
   * @param c2 - The quadratic coefficient
   */
  static quadratic(t, e, r) {
    return new Tt(t, e, r);
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
    return new Tt(t, e, r, i);
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
        return new Tt(this.c1, 2 * this.c2, 3 * this.c3, 0);
      case 2:
        return new Tt(2 * this.c2, 6 * this.c3, 0, 0);
      case 3:
        return new Tt(6 * this.c3, 0, 0, 0);
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
    const e = 1 - t, r = new Tt(this.c0, this.c1 * t, this.c2 * t * t, this.c3 * t * t * t), i = new Tt(this.eval(0), e * this.differentiate(1).eval(t), e * e / 2 * this.differentiate(2).eval(t), e * e * e / 6 * this.differentiate(3).eval(t));
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
    const t = this.c0, e = this.c1, r = this.c2, i = this.c3, a = t * t, l = t * r, u = e * e, g = (3 * l - u) / (3 * a), y = (2 * u * e - 9 * l * e + 27 * a * i) / (27 * a * t), S = this.solveDepressedCubicRoots(g, y), M = (F) => F - e / (3 * t);
    switch (S.length) {
      case 1:
        return [M(S[0])];
      case 2:
        return [M(S[0]), M(S[1])];
      case 3:
        return [
          M(S[0]),
          M(S[1]),
          M(S[2])
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
      const a = 2 * Math.sqrt(-t / 3), l = 3 * e / (2 * t) * Math.sqrt(-3 / t), u = (g) => a * Math.cos(1 / 3 * Math.acos(Pt(-1, 1, l)) - r / 3 * g);
      return l >= 0.9999 ? [u(0), u(2)] : l <= -0.9999 ? [u(1), u(2)] : [u(0), u(1), u(2)];
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
      const a = Math.sqrt(i), l = (-e - a) / (2 * t), u = (-e + a) / (2 * t);
      return [Math.min(l, u), Math.max(l, u)];
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
class rr {
  constructor(t, e, r, i) {
    this.c0 = t, this.c1 = e, this.c2 = r, this.c3 = i, t instanceof Tt ? (this.x = t, this.y = e) : i !== void 0 ? (this.x = new Tt(t.x, e.x, r.x, i.x), this.y = new Tt(t.y, e.y, r.y, i.y)) : (this.x = new Tt(t.x, e.x, r.x), this.y = new Tt(t.y, e.y, r.y));
  }
  eval(t, e = 0) {
    return new v(this.x.differentiate(e).eval(t), this.y.differentiate(e).eval(t));
  }
  split(t) {
    const [e, r] = this.x.split(t), [i, a] = this.y.split(t);
    return [new rr(e, i), new rr(r, a)];
  }
  differentiate(t = 1) {
    return new rr(this.x.differentiate(t), this.y.differentiate(t));
  }
  evalDerivative(t) {
    return this.differentiate().eval(t);
  }
  /**
   * Calculate the tight axis-aligned bounds of the curve in the unit interval.
   */
  getBounds() {
    const t = this.x.outputRange01(), e = this.y.outputRange01();
    return Z.fromPoints(new v(Math.min(...t), Math.max(...e)), new v(Math.max(...t), Math.min(...e)));
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
      const a = i / (t - 1), l = this.curve.eval(a), u = r.sub(l.position).magnitude;
      e += u, this.sampledDistances.push(e), r = l.position;
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
    t = Pt(0, this.curve.arcLength, t);
    for (let r = 0; r < e; r++) {
      const i = this.sampledDistances[r], a = this.sampledDistances[r + 1];
      if (t >= i && t <= a)
        return nu(i, a, r / (e - 1), (r + 1) / (e - 1), t);
    }
    return 1;
  }
}
class Ru extends En {
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
    let a = null, l = e, u = r, g = this.points;
    if (e !== 0 || r !== 1) {
      const M = this.length * e, F = this.length * r;
      l = this.pointSampler.distanceToT(M), u = this.pointSampler.distanceToT(F);
      const U = (u - l) / (1 - l), [, et] = this.split(l);
      [a] = et.split(U), g = a.points;
    }
    i && hr(t, g[0]), (a ?? this).doDraw(t);
    const y = this.tangent(l), S = this.tangent(u);
    return [
      {
        position: g[0],
        tangent: y,
        normal: y.perpendicular
      },
      {
        position: g.at(-1),
        tangent: S,
        normal: S.perpendicular
      }
    ];
  }
}
var Mu = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
class pe extends Ru {
  get points() {
    return [this.p0, this.p1, this.p2, this.p3];
  }
  constructor(t, e, r, i) {
    super(new rr(
      t,
      // 3*(-p0+p1)
      t.flipped.add(e).scale(3),
      // 3*p0-6*p1+3*p2
      t.scale(3).sub(e.scale(6)).add(r.scale(3)),
      // -p0+3*p1-3*p2+p3
      t.flipped.add(e.scale(3)).sub(r.scale(3)).add(i)
    ), pe.getLength(t, e, r, i)), this.p0 = t, this.p1 = e, this.p2 = r, this.p3 = i;
  }
  split(t) {
    const e = new v(this.p0.x + (this.p1.x - this.p0.x) * t, this.p0.y + (this.p1.y - this.p0.y) * t), r = new v(this.p1.x + (this.p2.x - this.p1.x) * t, this.p1.y + (this.p2.y - this.p1.y) * t), i = new v(this.p2.x + (this.p3.x - this.p2.x) * t, this.p2.y + (this.p3.y - this.p2.y) * t), a = new v(e.x + (r.x - e.x) * t, e.y + (r.y - e.y) * t), l = new v(r.x + (i.x - r.x) * t, r.y + (i.y - r.y) * t), u = new v(a.x + (l.x - a.x) * t, a.y + (l.y - a.y) * t), g = new pe(this.p0, e, a, u), y = new pe(u, l, i, this.p3);
    return [g, y];
  }
  doDraw(t) {
    yu(t, this.p1, this.p2, this.p3);
  }
  static getLength(t, e, r, i) {
    return pe.el.setAttribute("d", `M ${t.x} ${t.y} C ${e.x} ${e.y} ${r.x} ${r.y} ${i.x} ${i.y}`), pe.el.getTotalLength();
  }
}
Mu([
  zr(() => document.createElementNS("http://www.w3.org/2000/svg", "path"))
], pe, "el", void 0);
class He extends En {
  constructor(t, e) {
    super(), this.from = t, this.to = e, this.vector = e.sub(t), this.length = this.vector.magnitude, this.normal = this.vector.perpendicular.normalized.safe, this.points = [t, e];
  }
  get arcLength() {
    return this.length;
  }
  draw(t, e = 0, r = 1, i = !1) {
    const a = this.from.add(this.vector.scale(e)), l = this.from.add(this.vector.scale(r));
    return i && hr(t, a), Vt(t, l), [
      {
        position: a,
        tangent: this.normal.flipped,
        normal: this.normal
      },
      {
        position: l,
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
function Lu(n, t, e, r) {
  const i = {
    arcLength: 0,
    segments: [],
    minSin: 1
  }, a = ge(t.top, t.right, t.left, n), l = ge(t.right, t.top, t.bottom, n), u = ge(t.bottom, t.left, t.right, n), g = ge(t.left, t.bottom, t.top, n);
  let y = new v(n.left + a, n.top), S = new v(n.right - l, n.top);
  return Ye(i, new He(y, S)), y = new v(n.right, n.top + l), S = new v(n.right, n.bottom - u), l > 0 && Cr(i, y.addX(-l), l, v.down, v.right, e, r), Ye(i, new He(y, S)), y = new v(n.right - u, n.bottom), S = new v(n.left + g, n.bottom), u > 0 && Cr(i, y.addY(-u), u, v.right, v.up, e, r), Ye(i, new He(y, S)), y = new v(n.left, n.bottom - g), S = new v(n.left, n.top + a), g > 0 && Cr(i, y.addX(g), g, v.up, v.left, e, r), Ye(i, new He(y, S)), y = new v(n.left + a, n.top), a > 0 && Cr(i, y.addY(a), a, v.left, v.down, e, r), i;
}
function Ye(n, t) {
  n.segments.push(t), n.arcLength += t.arcLength;
}
function Cr(n, t, e, r, i, a, l) {
  const u = t.add(r.scale(e)), g = t.add(i.scale(e));
  a ? Ye(n, new pe(u, u.add(i.scale(l * e)), g.add(r.scale(l * e)), g)) : Ye(n, new Zi(t, e, r, i, !1));
}
var cr = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
let kt = class extends Lt {
  constructor(t) {
    super(t);
  }
  profile() {
    return Lu(this.childrenBBox(), this.radius(), this.smoothCorners(), this.cornerSharpness());
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
    return Z.fromSizeCentered(this.computedSize());
  }
  getPath() {
    if (this.requiresProfile())
      return this.curveDrawingInfo().path;
    const t = new Path2D(), e = this.radius(), r = this.smoothCorners(), i = this.cornerSharpness(), a = Z.fromSizeCentered(this.size());
    return Pi(t, a, e, r, i), t;
  }
  getCacheBBox() {
    return super.getCacheBBox().expand(this.rippleSize());
  }
  getRipplePath() {
    const t = new Path2D(), e = this.rippleSize(), r = this.radius().addScalar(e), i = this.smoothCorners(), a = this.cornerSharpness(), l = Z.fromSizeCentered(this.size()).expand(e);
    return Pi(t, l, r, i, a), t;
  }
};
cr([
  Ir("radius")
], kt.prototype, "radius", void 0);
cr([
  z(!1),
  P()
], kt.prototype, "smoothCorners", void 0);
cr([
  z(0.6),
  P()
], kt.prototype, "cornerSharpness", void 0);
cr([
  _()
], kt.prototype, "profile", null);
kt = cr([
  ae("Rect")
], kt);
var Se = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
class qt extends E {
  constructor({ children: t, ...e }) {
    super(e), this.scene() || this.scene(new E({})), t && this.scene().add(t);
  }
  getZoom() {
    return 1 / this.scale.x();
  }
  setZoom(t) {
    this.scale($e(t, (e) => 1 / e));
  }
  getDefaultZoom() {
    return this.scale.x.context.getInitial();
  }
  *tweenZoom(t, e, r, i) {
    const a = this.scale.x();
    yield* Wt(e, (l) => {
      this.zoom(1 / i(a, 1 / Jt(t), r(l)));
    });
  }
  /**
   * Resets the camera's position, rotation and zoom level to their original
   * values.
   *
   * @param duration - The duration of the tween.
   * @param timingFunction - The timing function to use for the tween.
   */
  *reset(t, e = Ht) {
    yield* xt(this.position(Ze, t, e), this.zoom(Ze, t, e), this.rotation(Ze, t, e));
  }
  *centerOn(t, e, r = Ht, i = v.lerp) {
    const a = t instanceof E ? t.absolutePosition().transformAsPoint(this.scene().worldToLocal()) : t;
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
  *followCurve(t, e, r = Ht) {
    yield* Wt(e, (i) => {
      const a = r(i), l = t.getPointAtPercentage(a).position.transformAsPoint(t.localToWorld());
      this.position(l);
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
  *followCurveReverse(t, e, r = Ht) {
    yield* Wt(e, (i) => {
      const a = 1 - r(i), l = t.getPointAtPercentage(a).position.transformAsPoint(t.localToWorld());
      this.position(l);
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
  *followCurveWithRotation(t, e, r = Ht) {
    yield* Wt(e, (i) => {
      const a = r(i), { position: l, normal: u } = t.getPointAtPercentage(a), g = l.transformAsPoint(t.localToWorld()), y = u.flipped.perpendicular.degrees;
      this.position(g), this.rotation(y);
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
  *followCurveWithRotationReverse(t, e, r = Ht) {
    yield* Wt(e, (i) => {
      const a = 1 - r(i), { position: l, normal: u } = t.getPointAtPercentage(a), g = l.transformAsPoint(t.localToWorld()), y = u.flipped.perpendicular.degrees;
      this.position(g), this.rotation(y);
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
    const a = new qt({ scene: r, children: t });
    return e == null || e(a), new kt({
      clip: !0,
      ...i,
      children: [a]
    });
  }
}
Se([
  P()
], qt.prototype, "scene", void 0);
Se([
  Ie(!1),
  P()
], qt.prototype, "zoom", void 0);
Se([
  ct()
], qt.prototype, "reset", null);
Se([
  ct()
], qt.prototype, "centerOn", null);
Se([
  ct()
], qt.prototype, "followCurve", null);
Se([
  ct()
], qt.prototype, "followCurveReverse", null);
Se([
  ct()
], qt.prototype, "followCurveWithRotation", null);
Se([
  ct()
], qt.prototype, "followCurveWithRotationReverse", null);
var ur = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, Sn;
let ye = Sn = class extends kt {
  constructor(t) {
    super({
      composite: !0,
      fontFamily: "Roboto",
      fontSize: 48,
      lineHeight: "120%",
      textWrap: !1,
      fontStyle: "normal",
      ...t
    }), this.view2D = this, Sn.shadowRoot.append(this.element), this.applyFlex();
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
    return kr().getNode(t) ?? null;
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
ur([
  z(nr.Paused),
  P()
], ye.prototype, "playbackState", void 0);
ur([
  z(0),
  P()
], ye.prototype, "globalTime", void 0);
ur([
  P()
], ye.prototype, "assetHash", void 0);
ur([
  zr(() => {
    const n = "motion-canvas-2d-frame";
    let t = document.querySelector(`#${n}`);
    return t || (t = document.createElement("div"), t.id = n, t.style.position = "absolute", t.style.pointerEvents = "none", t.style.top = "0", t.style.left = "0", t.style.opacity = "0", t.style.overflow = "hidden", document.body.prepend(t)), t.shadowRoot ?? t.attachShadow({ mode: "open" });
  })
], ye, "shadowRoot", void 0);
ye = Sn = ur([
  ae("View2D")
], ye);
function $u(n, t, e) {
  const r = {
    arcLength: 0,
    segments: [],
    minSin: 1
  };
  if (n.length === 0)
    return r;
  if (e) {
    const l = n[0].add(n[n.length - 1]).scale(0.5);
    n = [l, ...n, l];
  }
  let i = n[0];
  for (let l = 2; l < n.length; l++) {
    const u = n[l - 2], g = n[l - 1], y = n[l], S = u.sub(g), M = y.sub(g), F = S.normalized.safe, U = M.normalized.safe, et = Math.acos(Pt(-1, 1, F.dot(U))), T = Math.tan(et / 2), J = Math.sin(et / 2), ut = Math.min(t, T * S.magnitude * (l === 2 ? 1 : 0.5), T * M.magnitude * (l === n.length - 1 ? 1 : 0.5)), rt = J === 0 ? 0 : ut / J, Et = T === 0 ? 0 : ut / T, nt = F.add(U).scale(1 / 2).normalized.safe.scale(rt).add(g), Gt = F.perpendicular.dot(U) < 0, j = new He(i, g.add(F.scale(Et))), le = new Zi(nt, ut, F.perpendicular.scale(Gt ? 1 : -1), U.perpendicular.scale(Gt ? -1 : 1), Gt);
    j.arcLength > 0 && (r.segments.push(j), r.arcLength += j.arcLength), le.arcLength > 0 && (r.segments.push(le), r.arcLength += le.arcLength), r.minSin = Math.min(r.minSin, Math.abs(J)), i = g.add(U.scale(Et));
  }
  const a = new He(i, n[n.length - 1]);
  return a.arcLength > 0 && (r.segments.push(a), r.arcLength += a.arcLength), r;
}
function Au(n) {
  return n.reduce((t, e, r) => r ? t + n[r - 1].sub(e).magnitude : 0, 0);
}
function vn(n, t, e) {
  const r = n.length;
  let i = 0;
  for (let a = 0; a < t.length; a += 1) {
    const l = n[(e + a) % r], u = t[a];
    i += l.sub(u).squaredMagnitude;
  }
  return i;
}
function zu(n, t, e) {
  const r = [];
  if (e === 0)
    return [...n];
  if (e === 1)
    return [...t];
  for (let i = 0; i < n.length; i++) {
    const a = n[i], l = t[i];
    r.push(v.lerp(a, l, e));
  }
  return r;
}
var Ee = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, Rr;
let At = Rr = class extends Lt {
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
      for (let l = 0; l < t.length; l += 1) {
        const u = vn(t, e, l);
        u < i && (i = u, a = l);
      }
      if (a) {
        const l = t.splice(0, a);
        t.splice(t.length, 0, ...l);
      }
    } else {
      const i = vn(t, e, 0), a = [...t].reverse();
      vn(a, e, 0) < i && t.reverse();
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
      for (let g = 0; g < e; g++)
        t.push(u);
      return;
    }
    const r = t.length + e, i = Au(t);
    let a = i === 0 ? 0 : e / i, l = 0;
    for (; t.length < r; ) {
      const u = r - t.length;
      if (l + 1 >= t.length) {
        a = i === 0 ? 0 : u / i, l = 0;
        continue;
      }
      const g = t[l], y = t[l + 1], S = g.sub(y).magnitude;
      let M = Math.min(Math.round(S * a), u) + 1;
      i === 0 && (M = 2);
      for (let F = 1; F < M; F++)
        t.splice(++l, 0, v.lerp(g, y, F / M));
      l++;
    }
  }
  *tweenPoints(t, e, r) {
    const i = [...this.parsedPoints()], a = this.parsePoints(Jt(t)), l = this.closed(), u = i.length - a.length;
    Rr.distributePoints(u < 0 ? i : a, Math.abs(u)), Rr.rotatePoints(a, i, l), this.tweenedPoints(i), yield* Wt(e, (g) => {
      const y = r(g);
      this.tweenedPoints(zu(i, a, y));
    }, () => {
      this.tweenedPoints(null), this.points(t);
    });
  }
  constructor(t) {
    super(t), this.tweenedPoints = Oe(null), t.children === void 0 && t.points === void 0 && St().warn({
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
      t = e ? e.map((r) => new v(Jt(r))) : this.children().filter((r) => !(r instanceof A) || r.isLayoutRoot()).map((r) => r.position());
    }
    return Z.fromPoints(...t);
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
    const l = new Path2D(), u = (this.tweenedPoints() ?? this.parsedPoints()).map((g) => g.transformAsPoint(e));
    if (u.length > 0) {
      hr(l, u[0]);
      for (const g of u)
        Vt(l, g), t.beginPath(), Hi(t, g, 4), t.closePath(), t.fill(), t.stroke();
    }
    t.strokeStyle = "white", t.stroke(l), t.beginPath(), Xi(t, a), t.stroke(), t.beginPath(), de(t, r), t.closePath(), t.stroke();
  }
  parsePoints(t) {
    return t ? t.map((e) => new v(Jt(e))) : this.children().map((e) => e.position());
  }
};
Ee([
  z(0),
  P()
], At.prototype, "radius", void 0);
Ee([
  z(null),
  P()
], At.prototype, "points", void 0);
Ee([
  ct()
], At.prototype, "tweenPoints", null);
Ee([
  _()
], At.prototype, "childrenBBox", null);
Ee([
  _()
], At.prototype, "parsedPoints", null);
Ee([
  _()
], At.prototype, "profile", null);
At = Rr = Ee([
  ae("Line")
], At);
var fr = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, Mr;
let It = Mr = class extends Ct {
  constructor({ children: t, ...e }) {
    super(e), t && this.text(t);
  }
  parentTxt() {
    const t = this.parent();
    return t instanceof mt ? t : null;
  }
  draw(t) {
    this.requestFontUpdate(), this.applyStyle(t), this.applyText(t), t.font = this.styles.font, t.textBaseline = "bottom", "letterSpacing" in t && (t.letterSpacing = `${this.letterSpacing()}px`);
    const e = t.measureText("").fontBoundingBoxAscent, r = this.element.getBoundingClientRect(), { width: i, height: a } = this.size(), l = document.createRange();
    let u = "";
    const g = new Z();
    for (const y of this.element.childNodes) {
      if (!y.textContent)
        continue;
      l.selectNodeContents(y);
      const S = l.getBoundingClientRect(), M = i / -2 + S.left - r.left, F = a / -2 + S.top - r.top + e;
      g.y === F ? (g.width += S.width, u += y.textContent) : (this.drawText(t, u, g), g.x = M, g.y = F, g.width = S.width, g.height = S.height, u = y.textContent);
    }
    this.drawText(t, u, g);
  }
  drawText(t, e, r) {
    const i = r.y;
    e = e.replace(/\s+/g, " "), this.lineWidth() <= 0 ? t.fillText(e, r.x, i) : this.strokeFirst() ? (t.strokeText(e, r.x, i), t.fillText(e, r.x, i)) : (t.fillText(e, r.x, i), t.strokeText(e, r.x, i));
  }
  getCacheBBox() {
    const t = this.computedSize(), e = document.createRange();
    e.selectNodeContents(this.element);
    const r = e.getBoundingClientRect(), i = this.lineWidth(), a = this.lineJoin() === "miter" ? 0.5 * 10 : 0.5;
    return new Z(-t.width / 2, -t.height / 2, r.width, r.height).expand([0, this.fontSize() * 0.5]).expand(i * a);
  }
  applyFlex() {
    super.applyFlex(), this.element.style.display = "inline";
  }
  updateLayout() {
    if (this.applyFont(), this.applyFlex(), this.justifyContent.isInitial() && (this.element.style.justifyContent = this.styles.getPropertyValue("text-align")), this.styles.whiteSpace !== "nowrap" && this.styles.whiteSpace !== "pre")
      if (this.element.innerText = "", Mr.segmenter)
        for (const e of Mr.segmenter.segment(this.text()))
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
fr([
  z(""),
  zn(_i),
  P()
], It.prototype, "text", void 0);
fr([
  _()
], It.prototype, "parentTxt", null);
fr([
  zr(() => {
    const n = document.createElement("span");
    return ye.shadowRoot.append(n), n;
  })
], It, "formatter", void 0);
fr([
  zr(() => {
    try {
      return new Intl.Segmenter(void 0, {
        granularity: "grapheme"
      });
    } catch {
      return null;
    }
  })
], It, "segmenter", void 0);
It = Mr = fr([
  ae("TxtLeaf")
], It);
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
  It.prototype[`get${Le(n)}`] = function() {
    var t;
    return ((t = this.parentTxt()) == null ? void 0 : t[n]()) ?? this[n].context.getInitial();
  };
});
var dr = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, Re;
let mt = Re = class extends Ct {
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
    return new Re({ ...t, fontWeight: 700 });
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
    return new Re({ ...t, fontStyle: "italic" });
  }
  getText() {
    return this.innerText();
  }
  setText(t) {
    const e = this.children();
    let r = null;
    for (let i = 0; i < e.length; i++) {
      const a = e[i];
      r === null && a instanceof It ? r = a : a.parent(null);
    }
    r === null ? (r = new It({ text: t }), r.parent(this)) : r.text(t), this.setParsedChildren([r]);
  }
  setChildren(t) {
    this.children.context.raw() !== t && (typeof t == "string" ? this.text(t) : super.setChildren(t));
  }
  *tweenText(t, e, r, i) {
    const a = this.children();
    (a.length !== 1 || !(a[0] instanceof It)) && this.text.save();
    const l = this.childAs(0), u = l.text.context.raw(), g = this.size.context.raw();
    l.text(t);
    const y = this.size();
    l.text(u ?? Ze), this.height() === 0 && this.height(y.height), yield* xt(this.size(y, e, r), l.text(t, e, r, i)), this.children.context.setter(t), this.size(g);
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
    return t instanceof Re ? t : null;
  }
  parseChildren(t) {
    const e = [], r = Array.isArray(t) ? t : [t];
    for (const i of r)
      i instanceof Re || i instanceof It ? e.push(i) : typeof i == "string" && e.push(new It({ text: i }));
    return e;
  }
  applyFlex() {
    super.applyFlex(), this.element.style.display = this.findAncestor(In(Re)) ? "inline" : "block";
  }
  draw(t) {
    this.drawChildren(t);
  }
};
dr([
  z(""),
  P()
], mt.prototype, "text", void 0);
dr([
  ct()
], mt.prototype, "tweenText", null);
dr([
  _()
], mt.prototype, "innerText", null);
dr([
  _()
], mt.prototype, "parentTxt", null);
mt = Re = dr([
  ae("Txt")
], mt);
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
  mt.prototype[`getDefault${Le(n)}`] = function(t) {
    var e;
    return ((e = this.parentTxt()) == null ? void 0 : e[n]()) ?? t;
  };
});
class Ou extends tu {
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
    t.save(), this.renderLifecycle.dispatch([Zt.BeforeRender, t]), t.save(), this.renderLifecycle.dispatch([Zt.BeginRender, t]), this.getView().playbackState(this.playback.state).globalTime(this.playback.time), this.getView().render(t), this.renderLifecycle.dispatch([Zt.FinishRender, t]), t.restore(), this.renderLifecycle.dispatch([Zt.AfterRender, t]), t.restore();
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
    for (const { key: i, meta: a, signal: l } of e)
      a.inspectable && (r[i] = l());
    return r;
  }
  drawOverlay(t, e, r) {
    const i = this.getNode(t);
    i && this.execute(() => {
      const a = this.getView().findAll(In(qt)), l = [];
      for (const u of a) {
        const g = u.scene();
        g && (g === i || g.findFirst((y) => y === i)) && l.push(u);
      }
      if (l.length > 0)
        for (const u of l) {
          const g = u.parentToWorld(), y = u.localToParent().inverse(), S = i.localToWorld();
          i.drawOverlay(r, e.multiply(g).multiply(y).multiply(S));
        }
      else
        i.drawOverlay(r, e.multiply(i.localToWorld()));
    });
  }
  transformMousePosition(t, e) {
    return new v(t, e).transformAsPoint(this.getView().localToParent().inverse());
  }
  registerNode(t, e) {
    var l;
    const r = ((l = t.constructor) == null ? void 0 : l.name) ?? "unknown", i = (this.nodeCounters.get(r) ?? 0) + 1;
    this.nodeCounters.set(r, i), e && this.registeredNodes.has(e) && (St().error({
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
      this.view = new ye({
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
    klass: Ou,
    config: n,
    stack: new Error().stack,
    meta: eu(),
    plugins: ["@motion-canvas/2d/editor"]
  };
}
const Y = {
  bg: "#0f0f0f",
  // Primary accent
  accent: "#2dd4bf",
  // Context / secondary
  context: "#1e1e2e",
  contextText: "#8888aa",
  // Labels and secondary
  label: "#444455",
  arrow: "#555566",
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
}, Xt = "monospace", Me = Fu(function* (n) {
  n.fill(Y.bg);
  const t = Pe(), e = dn(), r = Pe(), i = Pe(), a = Pe(), l = dn(), u = Pe(), g = Pe(), y = Pe(), S = dn(), M = -520, F = 440, U = -350, et = -220, T = -60, J = 120, ut = 290, rt = [
    { label: `Personal
Context`, sub: "intake.md", color: Y.user },
    { label: `This
Document`, sub: "final/income.md", color: Y.assistant },
    { label: `Section
Overview`, sub: "raw/income.md", color: Y.toolResult }
  ], Et = [
    { q: "Home Depot · $1,247 — business or personal?", a: "Personal (kitchen reno)" },
    { q: "Stripe · $8,200 — which entity?", a: "Side project (Schedule C)" },
    { q: "Uber · $340 — business travel?", a: "Yes — client site visit" },
    { q: "Best Buy · $3,500 — expense or asset?", a: "Asset (home office computer)" },
    { q: "Anthem · $14,400 — premium or HSA?", a: "Premium (1095-A reconcile)" }
  ];
  n.add(
    /* @__PURE__ */ at(Wi, { children: [
      /* @__PURE__ */ at(
        kt,
        {
          ref: t,
          x: M,
          y: U,
          fill: Y.userBg,
          stroke: Y.user,
          lineWidth: 3,
          radius: 14,
          padding: [26, 44],
          width: F,
          opacity: 0,
          children: /* @__PURE__ */ at(mt, { text: "Read Section", fill: Y.white, fontFamily: Xt, fontSize: 28 })
        }
      ),
      /* @__PURE__ */ at(
        At,
        {
          ref: l,
          stroke: Y.arrow,
          lineWidth: 2,
          endArrow: !0,
          arrowSize: 10,
          points: [[M, U + 38], [M, et - 55]],
          opacity: 0
        }
      ),
      /* @__PURE__ */ at(A, { x: M, y: et, direction: "row", gap: 12, alignItems: "stretch", layout: !0, children: rt.map((nt) => /* @__PURE__ */ at(
        kt,
        {
          ref: e,
          fill: Y.context,
          stroke: nt.color,
          lineWidth: 2,
          radius: 10,
          padding: [20, 22],
          width: 140,
          gap: 8,
          direction: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0,
          layout: !0,
          children: [
            /* @__PURE__ */ at(mt, { text: nt.label, fill: nt.color, fontFamily: Xt, fontSize: 16, textAlign: "center" }),
            /* @__PURE__ */ at(mt, { text: nt.sub, fill: Y.dimText, fontFamily: Xt, fontSize: 12 })
          ]
        }
      )) }),
      /* @__PURE__ */ at(
        At,
        {
          ref: l,
          stroke: Y.arrow,
          lineWidth: 2,
          endArrow: !0,
          arrowSize: 10,
          points: [[M, et + 55], [M, T - 38]],
          opacity: 0
        }
      ),
      /* @__PURE__ */ at(
        kt,
        {
          ref: r,
          x: M,
          y: T,
          fill: Y.assistantBg,
          stroke: Y.assistant,
          lineWidth: 3,
          radius: 14,
          padding: [26, 44],
          width: F,
          opacity: 0,
          children: /* @__PURE__ */ at(mt, { text: "Ask Clarifying Question", fill: Y.white, fontFamily: Xt, fontSize: 28 })
        }
      ),
      /* @__PURE__ */ at(
        At,
        {
          ref: l,
          stroke: Y.arrow,
          lineWidth: 2,
          endArrow: !0,
          arrowSize: 10,
          points: [[M, T + 38], [M, J - 38]],
          opacity: 0
        }
      ),
      /* @__PURE__ */ at(
        kt,
        {
          ref: i,
          x: M,
          y: J,
          fill: Y.toolResultBg,
          stroke: Y.toolResult,
          lineWidth: 3,
          radius: 14,
          padding: [26, 44],
          width: F,
          opacity: 0,
          children: /* @__PURE__ */ at(mt, { text: "User Answers", fill: Y.white, fontFamily: Xt, fontSize: 28 })
        }
      ),
      /* @__PURE__ */ at(
        At,
        {
          ref: l,
          stroke: Y.arrow,
          lineWidth: 2,
          endArrow: !0,
          arrowSize: 10,
          points: [[M, J + 38], [M, ut - 38]],
          opacity: 0
        }
      ),
      /* @__PURE__ */ at(
        kt,
        {
          ref: a,
          x: M,
          y: ut,
          fill: Y.toolCallBg,
          stroke: Y.toolCall,
          lineWidth: 3,
          radius: 14,
          padding: [26, 44],
          width: F,
          opacity: 0,
          children: /* @__PURE__ */ at(mt, { text: "Update final/", fill: Y.white, fontFamily: Xt, fontSize: 28 })
        }
      ),
      /* @__PURE__ */ at(
        At,
        {
          ref: u,
          stroke: Y.dimText,
          lineWidth: 3,
          lineDash: [10, 8],
          endArrow: !0,
          arrowSize: 16,
          points: [
            [M + F / 2 + 10, ut],
            [M + F / 2 + 60, ut],
            [M + F / 2 + 60, U],
            [M + F / 2 + 10, U]
          ],
          opacity: 0
        }
      ),
      /* @__PURE__ */ at(
        mt,
        {
          ref: g,
          text: "REPEAT",
          x: M + F / 2 + 100,
          y: (U + ut) / 2,
          rotation: -90,
          fill: Y.dimText,
          fontFamily: Xt,
          fontSize: 22,
          opacity: 0
        }
      ),
      /* @__PURE__ */ at(
        kt,
        {
          ref: y,
          x: 420,
          fill: Y.context,
          stroke: Y.label,
          lineWidth: 2,
          radius: 14,
          padding: [32, 36],
          gap: 14,
          direction: "column",
          alignItems: "start",
          width: 760,
          height: 780,
          opacity: 0,
          layout: !0,
          children: [
            /* @__PURE__ */ at(mt, { text: "Resolved Items", fill: Y.accent, fontFamily: Xt, fontSize: 36 }),
            /* @__PURE__ */ at(kt, { fill: Y.label, height: 2, width: 688 }),
            Et.map((nt) => /* @__PURE__ */ at(
              kt,
              {
                ref: S,
                fill: Y.subtle,
                stroke: Y.accent,
                lineWidth: 1,
                radius: 10,
                padding: [14, 20],
                gap: 6,
                direction: "column",
                alignItems: "start",
                width: 688,
                opacity: 0,
                layout: !0,
                children: [
                  /* @__PURE__ */ at(mt, { text: `Q: ${nt.q}`, fill: Y.white, fontFamily: Xt, fontSize: 22 }),
                  /* @__PURE__ */ at(mt, { text: `A: ${nt.a}`, fill: Y.contextText, fontFamily: Xt, fontSize: 22 })
                ]
              }
            ))
          ]
        }
      )
    ] })
  ), yield* t().opacity(1, 0.45), yield* Ft(0.2), yield* l[0].opacity(1, 0.3), yield* Oi(0.12, ...e.map((nt) => nt.opacity(1, 0.4))), yield* Ft(0.25), yield* l[1].opacity(1, 0.3), yield* r().opacity(1, 0.45), yield* Ft(0.15), yield* l[2].opacity(1, 0.3), yield* i().opacity(1, 0.45), yield* Ft(0.15), yield* l[3].opacity(1, 0.3), yield* a().opacity(1, 0.45), yield* Ft(0.2), yield* xt(
    u().opacity(1, 0.45),
    g().opacity(1, 0.45),
    y().opacity(1, 0.55)
  ), yield* Ft(0.4);
  for (let nt = 0; nt < Et.length; nt++)
    yield* xt(t().scale(1.06, 0.12), t().lineWidth(5, 0.12)), yield* xt(...e.map((Gt) => Gt.scale(1.05, 0.1))), yield* xt(
      t().scale(1, 0.12),
      t().lineWidth(3, 0.12),
      ...e.map((Gt) => Gt.scale(1, 0.1))
    ), yield* xt(r().scale(1.06, 0.12), r().lineWidth(5, 0.12)), yield* xt(r().scale(1, 0.12), r().lineWidth(3, 0.12)), yield* xt(i().scale(1.06, 0.12), i().lineWidth(5, 0.12)), yield* xt(i().scale(1, 0.12), i().lineWidth(3, 0.12)), yield* xt(a().scale(1.06, 0.12), a().lineWidth(5, 0.12)), yield* xt(a().scale(1, 0.12), a().lineWidth(3, 0.12)), yield* S[nt].opacity(1, 0.45), yield* Ft(0.2);
  yield* Ft(10);
});
Me.name = "scene";
du.attach(Me.meta);
Me.onReplaced ?? (Me.onReplaced = new me(Me.config));
const Iu = {
  scenes: [Me]
};
let _n;
_n ?? (_n = new ir("\0virtual:settings", !1));
_n.loadData({});
const Eu = _n, Xu = Oc(
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
