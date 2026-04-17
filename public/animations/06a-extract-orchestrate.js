class On {
  constructor() {
    this.subscribable = new Ii(this), this.subscribers = /* @__PURE__ */ new Set();
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
class Ii {
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
class Zt extends On {
  dispatch(t) {
    this.notifySubscribers(t);
  }
}
class wc extends On {
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
class Ce extends On {
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
    super(), this.value = t, this.subscribable = new xc(this);
  }
  /**
   * {@inheritDoc SubscribableValueEvent.subscribe}
   */
  subscribe(t, e = !0) {
    const r = super.subscribe(t);
    return e && t(this.value), r;
  }
}
class xc extends Ii {
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
class Ft {
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
    this.name = t, this.initial = e, this.type = void 0, this.spacing = !1, this.description = "", this.disabled = new Ce(!1), this.value = new Ce(e);
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
class Cc extends Ft {
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
    }, this.event = new Ce([...r.values()]), this.fields = r;
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
const xe = Cc;
class Ci extends Ft {
  constructor() {
    super(...arguments), this.type = Boolean;
  }
  parse(t) {
    return !!t;
  }
}
class Ei extends Error {
  constructor(t, e) {
    typeof t == "string" ? (super(t), this.remarks = e) : (super(t.message), this.remarks = t.remarks, this.object = t.object, this.durationMs = t.durationMs, this.inspect = t.inspect);
  }
}
class Sc {
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
const Dr = [];
function Fn() {
  const n = Dr.at(-1);
  if (!n)
    throw new Error("The scene is not available in the current context.");
  return n;
}
function kc(n) {
  Dr.push(n);
}
function Tc(n) {
  if (Dr.pop() !== n)
    throw new Error("startScene/endScene were called out of order.");
}
function Ct() {
  var n;
  return ((n = Dr.at(-1)) == null ? void 0 : n.logger) ?? console;
}
const In = [];
function Br() {
  const n = In.at(-1);
  if (!n)
    throw new Ei("The thread is not available in the current context.", `<p><code>useThread()</code> can only be called from within generator functions.
      It&#39;s not available during rendering.</p>
`);
  return n;
}
function Si(n) {
  In.push(n);
}
function ki(n) {
  if (In.pop() !== n)
    throw new Error("startThread/endThread was called out of order.");
}
function Oe(n) {
  return n[0].toUpperCase() + n.slice(1);
}
function Pc() {
  let n;
  return (e) => {
    if (e !== void 0)
      n = e;
    else
      return n;
  };
}
function me() {
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
function _i(n) {
  return {
    message: n.message,
    stack: n.stack,
    remarks: n.remarks
  };
}
const Ti = [
  { value: 0.25, text: "0.25x (Quarter)" },
  { value: 0.5, text: "0.5x (Half)" },
  { value: 1, text: "1.0x (Full)" },
  { value: 2, text: "2.0x (Double)" }
], Lc = [
  { value: "srgb", text: "sRGB" },
  { value: "display-p3", text: "DCI-P3" }
], Pi = [
  { value: 30, text: "30 FPS" },
  { value: 60, text: "60 FPS" }
];
var Wt;
(function(n) {
  n.Error = "error", n.Warn = "warn", n.Info = "info", n.Http = "http", n.Verbose = "verbose", n.Debug = "debug", n.Silly = "silly";
})(Wt || (Wt = {}));
class Mc {
  constructor() {
    this.logged = new Zt(), this.history = [], this.profilers = {};
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
    this.logLevel(Wt.Error, t);
  }
  warn(t) {
    this.logLevel(Wt.Warn, t);
  }
  info(t) {
    this.logLevel(Wt.Info, t);
  }
  http(t) {
    this.logLevel(Wt.Http, t);
  }
  verbose(t) {
    this.logLevel(Wt.Verbose, t);
  }
  debug(t) {
    this.logLevel(Wt.Debug, t);
  }
  silly(t) {
    this.logLevel(Wt.Silly, t);
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
      a.level ?? (a.level = Wt.Debug), a.durationMs = r - i, this.log(a);
      return;
    }
    this.profilers[t] = r;
  }
}
var ur;
(function(n) {
  n[n.Playing = 0] = "Playing", n[n.Rendering = 1] = "Rendering", n[n.Paused = 2] = "Paused", n[n.Presenting = 3] = "Presenting";
})(ur || (ur = {}));
function $c(n) {
  const t = {
    version: new Ft("version", 1),
    shared: new xe("General", {
      background: new Mn("background", null),
      range: new Ur("range", [0, 1 / 0]),
      size: new Hi("resolution", new v(1920, 1080)),
      audioOffset: new Tn("audio offset", 0)
    }),
    preview: new xe("Preview", {
      fps: new Tn("frame rate", 30).setPresets(Pi).setRange(1),
      resolutionScale: new Ie("scale", Ti, 1)
    }),
    rendering: new xe("Rendering", {
      fps: new Tn("frame rate", 60).setPresets(Pi).setRange(1),
      resolutionScale: new Ie("scale", Ti, 1),
      colorSpace: new Ie("color space", Lc),
      exporter: new uu("exporter", n)
    })
  };
  return t.shared.audioOffset.disable(!n.audio), t;
}
class zc extends xe {
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
  return new xe("Application Settings", {
    version: new Ft("version", 1),
    appearance: new xe("Appearance", {
      color: new Mn("accent color", new Se("#33a6ff")).describe("The accent color for the user interface. (Leave empty to use the default color)"),
      font: new Ci("legacy font", !1).describe("Use the 'JetBrains Mono' font for the user interface."),
      coordinates: new Ci("coordinates", !0).describe("Display mouse coordinates within the preview window.")
    }),
    defaults: new xe("Defaults", {
      background: new Mn("background", null).describe("The default background color used in new projects."),
      size: new Hi("resolution", new v(1920, 1080)).describe("The default resolution used in new projects.")
    })
  });
}
function Oc(n, t, e, r, i, a, l = r.logger ?? new Mc()) {
  const u = Ac();
  a.attach(u);
  const g = {
    name: n,
    ...r,
    plugins: e,
    versions: t,
    settings: u,
    logger: l
  };
  return g.meta = new zc(g), g.meta.shared.set(u.defaults.get()), g.experimentalFeatures ?? (g.experimentalFeatures = !1), i.attach(g.meta), g;
}
function Fc(n, t) {
  return {
    level: Wt.Error,
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
const Ic = 180 / Math.PI, Rn = Math.PI / 180;
function Ri(n, t, e) {
  let r = 0, i = n;
  e = e === void 0 ? r < i ? 1 : -1 : e;
  const a = [];
  let l = Math.max(Math.ceil((i - r) / e), 0), u = 0;
  for (; l--; )
    a[u++] = r, r += e;
  return a;
}
function Ec(n) {
  const t = Fn(), e = Br();
  return t.timeEvents.register(n, e.time());
}
const En = [];
function ji() {
  const n = En.at(-1);
  if (!n)
    throw new Error("The playback is not available in the current context.");
  return n;
}
function _c(n) {
  En.push(n);
}
function jc(n) {
  if (En.pop() !== n)
    throw new Error("startPlayback/endPlayback were called out of order.");
}
function he(n, ...t) {
  const e = { [n.name]: n }, r = Object.getOwnPropertyDescriptor(e, n.name);
  if (r)
    for (let i = t.length - 1; i >= 0; i--)
      t[i](e, n.name, r);
}
const Li = Symbol.for("@motion-canvas/core/decorators/UNINITIALIZED");
function Nr(n) {
  return (t, e) => {
    let r = Li;
    Object.defineProperty(t, e, {
      get() {
        return r === Li && (r = n.call(this)), r;
      }
    });
  };
}
function ht(n) {
  return function(t, e, r) {
    r.value.prototype.name = n ?? e, r.value.prototype.threadable = !0;
  };
}
he(oe, ht());
function* oe(...n) {
  for (const t of n)
    yield t;
  yield* _n(...n);
}
he(Dc, ht());
function* Dc(n, t) {
  yield* Ut(Ec(n)), t && (yield* t);
}
he(Ut, ht());
function* Ut(n = 0, t) {
  const e = Br(), r = ji().framesToSeconds(1), i = e.time() + n;
  for (; i - r > e.fixed; )
    yield;
  e.time(i), t && (yield* t);
}
he(Di, ht());
function* Di() {
}
function Mi(n, t) {
  let e;
  return typeof n == "string" ? (e = t(), jr(e, n)) : (e = n(), jr(e, e)), e;
}
he(se, ht());
function* se(n, ...t) {
  for (const e of t)
    yield e, yield* Ut(n);
  yield* _n(...t);
}
function Bc(n) {
  return n && (typeof n == "object" || typeof n == "function") && "toPromise" in n;
}
function Bi(n) {
  return n !== null && typeof n == "object" && Symbol.iterator in n && "next" in n;
}
function jr(n, t) {
  const e = Object.getPrototypeOf(n);
  e.threadable || (e.threadable = !0, e.name = typeof t == "string" ? t : Ni(t));
}
function Ni(n) {
  return Object.getPrototypeOf(n).name ?? null;
}
class kn {
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
    this.runner = t, this.deferred = new Zt(), this.children = [], this.time = _e(0), this.parent = null, this.isCanceled = !1, this.isPaused = !1, this.fixedTime = 0, this.queue = [], this.runner.task && (Ct().error({
      message: `The generator "${Ni(this.runner)}" is already being executed by another thread.`,
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
    }), this.runner = Di()), this.runner.task = this;
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
    Si(this);
    const t = this.runner.next(this.value);
    return ki(this), this.value = null, t;
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
    return Bi(t) || (t = t()), this.queue.push(t), t;
  }
  add(t) {
    t.parent = this, t.isCanceled = !1, t.time(this.time()), t.fixedTime = this.fixedTime, this.children.push(t), jr(t.runner, `unknown ${this.children.length}`);
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
    Si(this), this.deferred.dispatch(), ki(this);
  }
}
he(_n, ht());
function* _n(n, ...t) {
  let e = !0;
  typeof n == "boolean" ? e = n : t.push(n);
  const r = Br(), i = t.map((u) => r.children.find((g) => g.runner === u)).filter((u) => u), a = r.time();
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
he(Wi, ht());
function* Wi(n, t) {
  const e = ji(), r = n();
  jr(r, "root");
  const i = new kn(r);
  t == null || t(i);
  let a = [i];
  for (; a.length > 0; ) {
    const l = [], u = [...a], g = e.deltaTime;
    for (; u.length > 0; ) {
      const y = u.pop();
      if (!y || y.canceled)
        continue;
      const x = y.next();
      if (x.done) {
        y.cancel();
        continue;
      }
      if (Bi(x.value)) {
        const A = new kn(x.value);
        y.value = x.value, y.add(A), u.push(y), u.push(A);
      } else x.value ? (y.value = yield x.value, u.push(y)) : (y.update(g), y.drain((A) => {
        const j = new kn(A);
        y.add(j), l.unshift(j);
      }), l.unshift(y));
    }
    a = [];
    for (const y of l)
      y.canceled || (a.push(y), y.runDeferred());
    a.length > 0 && (yield);
  }
}
var Vt;
(function(n) {
  n[n.BeforeRender = 0] = "BeforeRender", n[n.BeginRender = 1] = "BeginRender", n[n.FinishRender = 2] = "FinishRender", n[n.AfterRender = 3] = "AfterRender";
})(Vt || (Vt = {}));
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
    this.scene = t, this.beforeRender = new Zt(), this.beginRender = new Zt(), this.finishRender = new Zt(), this.afterRender = new Zt(), this.scene.onRenderLifecycle.subscribe(([e, r]) => {
      switch (e) {
        case Vt.BeforeRender:
          return this.beforeRender.dispatch(r);
        case Vt.BeginRender:
          return this.beginRender.dispatch(r);
        case Vt.FinishRender:
          return this.finishRender.dispatch(r);
        case Vt.AfterRender:
          return this.afterRender.dispatch(r);
      }
    }), this.scene.onReset.subscribe(() => {
      this.beforeRender.clear(), this.beginRender.clear(), this.finishRender.clear(), this.afterRender.clear();
    });
  }
}
class fr {
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
    return st(t, e, this.next());
  }
  /**
   * Get the next random integer in the given range.
   *
   * @param from - The start of the range.
   * @param to - The end of the range. Exclusive.
   */
  nextInt(t = 0, e = 4294967296) {
    let r = Math.floor(st(t, e, this.next()));
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
    return Ri(t).map(() => this.nextFloat(e, r));
  }
  /**
   Get an array filled with random integers in the given range.
   *
   * @param size - The size of the array.
   * @param from - The start of the range.
   * @param to - The end of the range. Exclusive.
   */
  intArray(t, e = 0, r = 4294967296) {
    return Ri(t).map(() => this.nextInt(e, r));
  }
  /**
   * Create a new independent generator.
   */
  spawn() {
    return new fr(this.nextInt());
  }
  next() {
    this.state |= 0, this.state = this.state + 1831565813 | 0;
    let t = Math.imul(this.state ^ this.state >>> 15, 1 | this.state);
    return t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t, ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}
var xt;
(function(n) {
  n[n.Initial = 0] = "Initial", n[n.AfterTransitionIn = 1] = "AfterTransitionIn", n[n.CanTransitionOut = 2] = "CanTransitionOut", n[n.Finished = 3] = "Finished";
})(xt || (xt = {}));
const Uc = "resolution", qc = "destinationTexture", Gc = "sourceTexture", $i = "time", Xc = "deltaTime", Hc = "framerate", Yc = "sourceMatrix", Zc = "destinationMatrix", Vc = `#version 300 es

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
    this.scene = t, this.slides = new Ce([]), this.lookup = /* @__PURE__ */ new Map(), this.collisionLookup = /* @__PURE__ */ new Set(), this.current = null, this.canResume = !1, this.waitsForId = null, this.targetId = null, this.handleReload = () => {
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
    this.scene.playback.state !== ur.Presenting && (this.lookup.has(r) || this.lookup.set(r, {
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
    return this.scene.playback.state !== ur.Presenting && (i = e !== this.targetId), i && (this.waitsForId = null), !i;
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
    return (r = this.signals)[t] ?? (r[t] = _e(this.variables[t] ?? e)), () => this.signals[t]();
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
    this.cache = new Ce({
      firstFrame: 0,
      transitionDuration: 0,
      duration: 0,
      lastFrame: 0
    }), this.reloaded = new Zt(), this.recalculated = new Zt(), this.thread = new Ce(null), this.renderLifecycle = new Zt(), this.afterReset = new Zt(), this.lifecycleEvents = new Wc(this), this.previousScene = null, this.runner = null, this.state = xt.Initial, this.cached = !1, this.counters = {}, this.name = t.name, this.size = t.size, this.resolutionScale = t.resolutionScale, this.logger = t.logger, this.playback = t.playback, this.meta = t.meta, this.runnerFactory = t.config, this.creationStack = t.stack, this.experimentalFeatures = t.experimentalFeatures ?? !1, he(this.runnerFactory, ht(this.name)), this.timeEvents = new t.timeEventsClass(this), this.variables = new Kc(this), this.shaders = new Jc(this, t.sharedWebGLContext), this.slides = new Qc(this), this.random = new fr(this.meta.seed.get()), this.previousOnTop = !1;
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
      e++, await dt.consumePromises(), t.save(), t.clearRect(0, 0, t.canvas.width, t.canvas.height), this.execute(() => this.draw(t)), t.restore();
    while (dt.hasPromises() && e < 10);
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
      e.transitionDuration < 0 && this.state === xt.AfterTransitionIn && (e.transitionDuration = this.playback.frame - e.firstFrame), t(this.playback.frame + 1), await this.next();
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
    if (dt.hasPromises()) {
      const r = await dt.consumePromises();
      this.logger.error({
        message: "Tried to access an asynchronous property before the node was ready. Make sure to yield the node before accessing the property.",
        stack: r[0].stack,
        inspect: ((e = r[0].owner) == null ? void 0 : e.key) ?? void 0
      });
    }
    t.done && (this.state = xt.Finished);
  }
  async reset(t = null) {
    this.counters = {}, this.previousScene = t, this.previousOnTop = !1, this.random = new fr(this.meta.seed.get()), this.runner = Wi(() => this.runnerFactory(this.getView()), (e) => {
      this.thread.current = e;
    }), this.state = xt.AfterTransitionIn, this.afterReset.dispatch(), await this.next();
  }
  getSize() {
    return this.size;
  }
  getRealSize() {
    return this.size.mul(this.resolutionScale);
  }
  isAfterTransitionIn() {
    return this.state === xt.AfterTransitionIn;
  }
  canTransitionOut() {
    return this.state === xt.CanTransitionOut || this.state === xt.Finished;
  }
  isFinished() {
    return this.state === xt.Finished;
  }
  enterInitial() {
    this.state === xt.AfterTransitionIn ? this.state = xt.Initial : this.logger.warn(`Scene ${this.name} entered initial in an unexpected state: ${this.state}`);
  }
  enterAfterTransitionIn() {
    this.state === xt.Initial ? this.state = xt.AfterTransitionIn : this.logger.warn(`Scene ${this.name} transitioned in an unexpected state: ${this.state}`);
  }
  enterCanTransitionOut() {
    this.state === xt.AfterTransitionIn || this.state === xt.Initial ? this.state = xt.CanTransitionOut : this.logger.warn(`Scene ${this.name} was marked as finished in an unexpected state: ${this.state}`);
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
    kc(this), _c(this.playback);
    try {
      e = t();
    } finally {
      jc(this.playback), Tc(this);
    }
    return e;
  }
}
function eu() {
  return new xe("scene", {
    version: new Ft("version", 1),
    timeEvents: new Ft("time events", []),
    seed: new Ft("seed", fr.createSeed())
  });
}
function Ui(n, t, e) {
  const r = [...n], i = [...t];
  if (i.length >= r.length) {
    const a = Math.floor(i.length * e), l = Math.floor(st(r.length - 1, i.length, e));
    let u = "";
    for (let g = 0; g < i.length; g++)
      g < a ? u += i[g] : (r[g] || g <= l) && (u += r[g] ?? i[g]);
    return u;
  } else {
    const a = Math.round(r.length * (1 - e)), l = Math.floor(st(r.length + 1, i.length, e)), u = [];
    for (let g = r.length - 1; g >= 0; g--)
      g < a ? u.unshift(r[g]) : (i[g] || g < l) && u.unshift(i[g] ?? r[g]);
    return u.join("");
  }
}
function rr(n, t, e, r = !1) {
  if (e === 0)
    return n;
  if (e === 1)
    return t;
  if (n == null || t == null) {
    r || Ct().warn(`Attempting to lerp ${n} -> ${t} may result in unexpected behavior.`);
    return;
  }
  if (typeof n == "number" && typeof t == "number")
    return st(n, t, e);
  if (typeof n == "string" && typeof t == "string")
    return Ui(n, t, e);
  if (typeof n == "boolean" && typeof t == "boolean")
    return e < 0.5 ? n : t;
  if ("lerp" in n)
    return n.lerp(t, e);
  if (n && t && typeof n == "object" && typeof t == "object")
    if (Array.isArray(n) && Array.isArray(t)) {
      if (n.length === t.length)
        return n.map((i, a) => rr(i, t[a], e));
    } else {
      let i = !1;
      if (!(n instanceof Map) && !(t instanceof Map) && (i = !0, n = new Map(Object.entries(n)), t = new Map(Object.entries(t))), n instanceof Map && t instanceof Map) {
        const a = /* @__PURE__ */ new Map();
        for (const l of /* @__PURE__ */ new Set([...n.keys(), ...t.keys()])) {
          const u = rr(n.get(l), t.get(l), e, !0);
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
function st(n, t, e) {
  return n + (t - n) * e;
}
function nu(n, t, e, r, i) {
  return e + (i - n) * (r - e) / (t - n);
}
function Rt(n, t, e) {
  return e < n ? n : e > t ? t : e;
}
function qi(n, t, e) {
  let r = t;
  e > 1 ? e = 1 / e : r = !r;
  const i = r ? Math.acos(Rt(-1, 1, 1 - n)) : Math.asin(n), a = st(i, st(0, Math.PI / 2, n), e);
  let l = Math.sin(a), u = 1 - Math.cos(a);
  return t && ([l, u] = [u, l]), new v(l, u);
}
function Yt(n, t = 0, e = 1) {
  return n = n < 0.5 ? 4 * n * n * n : 1 - Math.pow(-2 * n + 2, 3) / 2, st(t, e, n);
}
function su(n, t = 0, e = 1) {
  return n = n === 1 ? 1 : 1 - Math.pow(2, -10 * n), st(t, e, n);
}
function iu(n, t = 0, e = 1) {
  return st(t, e, n);
}
he(Gt, ht());
function* Gt(n, t, e) {
  const r = Br(), i = r.time(), a = r.time() + n;
  for (t(0, 0); a > r.fixed; ) {
    const l = r.fixed - i, u = l / n;
    l > 0 && t(u, l), yield;
  }
  r.time(a), t(1, n), e == null || e(1, n);
}
class dt {
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
    this.owner = t, this.dependencies = /* @__PURE__ */ new Set(), this.event = new wc(), this.markDirty = () => this.event.raise(), this.invokable = this.invoke.bind(this), Object.defineProperty(this.invokable, "context", {
      value: this
    }), Object.defineProperty(this.invokable, "toPromise", {
      value: this.toPromise.bind(this)
    });
  }
  invoke() {
  }
  startCollecting() {
    if (dt.collectionSet.has(this))
      throw new Ei("A circular dependency occurred between signals.", `This can happen when signals reference each other in a loop.
        Try using the attached stack trace to locate said loop.`);
    dt.collectionSet.add(this), dt.collectionStack.push(this);
  }
  finishCollecting() {
    if (dt.collectionSet.delete(this), dt.collectionStack.pop() !== this)
      throw new Error("collectStart/collectEnd was called out of order.");
  }
  clearDependencies() {
    this.dependencies.forEach((t) => t.unsubscribe(this.markDirty)), this.dependencies.clear();
  }
  collect() {
    const t = dt.collectionStack.at(-1);
    t && (t.dependencies.add(this.event.subscribable), this.event.subscribe(t.markDirty));
  }
  dispose() {
    this.clearDependencies(), this.event.clear(), this.owner = null;
  }
  async toPromise() {
    do
      await dt.consumePromises(), this.invokable();
    while (dt.hasPromises());
    return this.invokable;
  }
}
dt.collectionSet = /* @__PURE__ */ new Set();
dt.collectionStack = [];
dt.promises = [];
const er = Symbol.for("@motion-canvas/core/signals/default");
function le(n) {
  return typeof n == "function";
}
function Fe(n, t) {
  return le(n) ? () => t(n()) : t(n);
}
function Qt(n) {
  return le(n) ? n() : n;
}
class Ee extends dt {
  constructor(t, e, r = void 0, i = (l) => l, a = {}) {
    super(r), this.initial = t, this.interpolation = e, this.parser = i, this.tweening = !1, Object.defineProperty(this.invokable, "reset", {
      value: this.reset.bind(this)
    }), Object.defineProperty(this.invokable, "save", {
      value: this.save.bind(this)
    }), Object.defineProperty(this.invokable, "isInitial", {
      value: this.isInitial.bind(this)
    }), this.initial !== void 0 && (this.current = this.initial, this.markDirty(), le(this.initial) || (this.last = this.parse(this.initial))), this.extensions = {
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
    return t === er && (t = this.initial), this.current === t ? this.owner : (this.current = t, this.clearDependencies(), le(t) || (this.last = this.parse(t)), this.markDirty(), this.owner);
  }
  get() {
    return this.extensions.getter();
  }
  getter() {
    var t;
    if (this.event.isRaised() && le(this.current)) {
      this.clearDependencies(), this.startCollecting();
      try {
        this.last = this.parse(this.current());
      } catch (e) {
        Ct().error({
          ..._i(e),
          inspect: (t = this.owner) == null ? void 0 : t.key
        });
      }
      this.finishCollecting();
    }
    return this.event.reset(), this.collect(), this.last;
  }
  invoke(t, e, r = Yt, i = this.interpolation) {
    return t === void 0 ? this.get() : e === void 0 ? this.set(t) : this.createQueue(r, i).to(t, e);
  }
  createQueue(t, e) {
    const r = this.get(), i = [], a = Mi("animation chain", function* () {
      for (; i.length > 0; )
        yield* i.shift();
    });
    return a.to = (l, u, g = t, y = e) => (t = g, e = y, i.push(this.tween(l, u, g, y)), a), a.back = (l, u = t, g = e) => (t = u, e = g, i.push(this.tween(r, l, t, e)), a), a.wait = (l) => (i.push(Ut(l)), a), a.run = (l) => (i.push(l), a), a.do = (l) => (i.push(Mi(function* () {
      l();
    })), a), a;
  }
  *tween(t, e, r, i) {
    t === er && (t = this.initial), this.tweening = !0, yield* this.extensions.tweener(t, e, r, i), this.set(t), this.tweening = !1;
  }
  *tweener(t, e, r, i) {
    const a = this.get();
    yield* Gt(e, (l) => {
      this.set(i(a, this.parse(Qt(t)), r(l)));
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
class Wr extends Ee {
  constructor(t, e, r, i, a = void 0, l = {}) {
    var u;
    super(void 0, i, a, e, l), this.entries = t, this.signals = [], this.parser = e;
    for (const g of t) {
      let y, x;
      Array.isArray(g) ? ([y, x] = g, (u = x.context).owner ?? (u.owner = this)) : (y = g, x = new Ee(Fe(r, (A) => e(A)[g]), st, a ?? this.invokable).toSignal()), this.signals.push([y, x]), Object.defineProperty(this.invokable, y, { value: x });
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
    if (le(t))
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
class au extends dt {
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
        Ct().error({
          ..._i(r),
          inspect: (e = this.owner) == null ? void 0 : e.key
        });
      }
      this.finishCollecting();
    }
    return this.event.reset(), this.collect(), this.last;
  }
}
class Gi extends Wr {
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
function _e(n, t = rr, e) {
  return new Ee(n, t, e).toSignal();
}
class qt {
  static createSignal(t, e = qt.lerp) {
    return new Wr(["top", "right", "bottom", "left"], (r) => new qt(r), t, e).toSignal();
  }
  static lerp(t, e, r) {
    return new qt(st(t.top, e.top, r), st(t.right, e.right, r), st(t.bottom, e.bottom, r), st(t.left, e.left, r));
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
    return qt.lerp(this, t, e);
  }
  scale(t) {
    return new qt(this.top * t, this.right * t, this.bottom * t, this.left * t);
  }
  addScalar(t) {
    return new qt(this.top + t, this.right + t, this.bottom + t, this.left + t);
  }
  toSymbol() {
    return qt.symbol;
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
qt.symbol = Symbol.for("@motion-canvas/core/types/Spacing");
const hr = 1e-6;
class ot {
  static fromRotation(t) {
    return ot.identity.rotate(t);
  }
  static fromTranslation(t) {
    return ot.identity.translate(new v(t));
  }
  static fromScaling(t) {
    return ot.identity.scale(new v(t));
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
    return u ? (u = 1 / u, new ot(i * u, -e * u, -r * u, t * u, (r * l - i * a) * u, (e * a - t * l) * u)) : null;
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
    if (t instanceof ot) {
      this.values = t.values;
      return;
    }
    if (Array.isArray(t)) {
      if (t.length === 2) {
        this.values[0] = t[0], this.values[1] = t[1], this.values[2] = e[0], this.values[3] = e[1], this.values[4] = r[0], this.values[5] = r[1];
        return;
      }
      if (t.length === 3) {
        const x = new v(t[0]), A = new v(t[1]), j = new v(t[2]);
        this.values[0] = x.x, this.values[1] = x.y, this.values[2] = A.x, this.values[3] = A.y, this.values[4] = j.x, this.values[5] = j.y;
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
    const e = this.values[0], r = this.values[1], i = this.values[2], a = this.values[3], l = this.values[4], u = this.values[5], g = t.values[0], y = t.values[1], x = t.values[2], A = t.values[3], j = t.values[4], Y = t.values[5];
    return new ot(e * g + i * y, r * g + a * y, e * x + i * A, r * x + a * A, e * j + i * Y + l, r * j + a * Y + u);
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
    e && (t *= Rn);
    const r = this.values[0], i = this.values[1], a = this.values[2], l = this.values[3], u = this.values[4], g = this.values[5], y = Math.sin(t), x = Math.cos(t);
    return new ot(r * x + a * y, i * x + l * y, r * -y + a * x, i * -y + l * x, u, g);
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
    return new ot(this.values[0] * e.x, this.values[1] * e.x, this.values[2] * e.y, this.values[3] * e.y, this.values[4], this.values[5]);
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
    return new ot(this.values[0] * t, this.values[1] * t, this.values[2] * t, this.values[3] * t, this.values[4] * t, this.values[5] * t);
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
    return new ot(this.values[0], this.values[1], this.values[2], this.values[3], this.values[0] * e.x + this.values[2] * e.y + this.values[4], this.values[1] * e.x + this.values[3] * e.y + this.values[5]);
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
    return new ot(this.values[0] + t.values[0], this.values[1] + t.values[1], this.values[2] + t.values[2], this.values[3] + t.values[3], this.values[4] + t.values[4], this.values[5] + t.values[5]);
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
    return new ot(this.values[0] - t.values[0], this.values[1] - t.values[1], this.values[2] - t.values[2], this.values[3] - t.values[3], this.values[4] - t.values[4], this.values[5] - t.values[5]);
  }
  toSymbol() {
    return ot.symbol;
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
  equals(t, e = hr) {
    return Math.abs(this.values[0] - t.values[0]) <= e + Number.EPSILON && Math.abs(this.values[1] - t.values[1]) <= e + Number.EPSILON && Math.abs(this.values[2] - t.values[2]) <= e + Number.EPSILON && Math.abs(this.values[3] - t.values[3]) <= e + Number.EPSILON && Math.abs(this.values[4] - t.values[4]) <= e + Number.EPSILON && Math.abs(this.values[5] - t.values[5]) <= e + Number.EPSILON;
  }
  exactlyEquals(t) {
    return this.values[0] === t.values[0] && this.values[1] === t.values[1] && this.values[2] === t.values[2] && this.values[3] === t.values[3] && this.values[4] === t.values[4] && this.values[5] === t.values[5];
  }
}
ot.symbol = Symbol.for("@motion-canvas/core/types/Matrix2D");
ot.identity = new ot(1, 0, 0, 1, 0, 0);
ot.zero = new ot(0, 0, 0, 0, 0, 0);
var zi;
(function(n) {
  n[n.Vertical = 1] = "Vertical", n[n.Horizontal = 2] = "Horizontal";
})(zi || (zi = {}));
var Mt;
(function(n) {
  n[n.Top = 4] = "Top", n[n.Bottom = 8] = "Bottom", n[n.Left = 16] = "Left", n[n.Right = 32] = "Right";
})(Mt || (Mt = {}));
var lt;
(function(n) {
  n[n.Middle = 3] = "Middle", n[n.Top = 5] = "Top", n[n.Bottom = 9] = "Bottom", n[n.Left = 18] = "Left", n[n.Right = 34] = "Right", n[n.TopLeft = 20] = "TopLeft", n[n.TopRight = 36] = "TopRight", n[n.BottomLeft = 24] = "BottomLeft", n[n.BottomRight = 40] = "BottomRight";
})(lt || (lt = {}));
function lu(n) {
  if (n === lt.Middle)
    return v.zero;
  let t = 0;
  n & Mt.Left ? t = -1 : n & Mt.Right && (t = 1);
  let e = 0;
  return n & Mt.Top ? e = -1 : n & Mt.Bottom && (e = 1), new v(t, e);
}
class v {
  static createSignal(t, e = v.lerp, r) {
    return new Gi(["x", "y"], (i) => new v(i), t, e, r).toSignal();
  }
  static lerp(t, e, r) {
    let i, a;
    return typeof r == "number" ? i = a = r : (i = r.x, a = r.y), new v(st(t.x, e.x, i), st(t.y, e.y, a));
  }
  static arcLerp(t, e, r, i = !1, a) {
    return a ?? (a = t.sub(e).ctg), v.lerp(t, e, qi(r, i, a));
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
    const y = st(l, u, r) * Rn, x = st(t.magnitude, e.magnitude, r);
    return new v(x * Math.cos(y) + a.x, x * Math.sin(y) + a.y);
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
    return t === lt.Middle || (t & Mt.Left ? e.x = -1 : t & Mt.Right && (e.x = 1), t & Mt.Top ? e.y = -1 : t & Mt.Bottom && (e.y = 1)), e;
  }
  static fromScalar(t) {
    return new v(t, t);
  }
  static fromRadians(t) {
    return new v(Math.cos(t), Math.sin(t));
  }
  static fromDegrees(t) {
    return v.fromRadians(t * Rn);
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
    return Math.acos(Rt(-1, 1, t.dot(e) / (t.magnitude * e.magnitude))) * (t.cross(e) >= 0 ? 1 : -1);
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
    const e = new ot(t);
    return new v(this.x * e.scaleX + this.y * e.skewY + e.translateX, this.x * e.skewX + this.y * e.scaleY + e.translateY);
  }
  transform(t) {
    const e = new ot(t);
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
    const r = new v(e), i = ot.fromTranslation(r).rotate(t).translate(r.flipped);
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
  equals(t, e = hr) {
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
    return new Wr(["x", "y", "width", "height"], (r) => new Z(r), t, e).toSignal();
  }
  static lerp(t, e, r) {
    let i, a, l, u;
    return typeof r == "number" ? i = a = l = u = r : r instanceof v ? (i = l = r.x, a = u = r.y) : (i = r.x, a = r.y, l = r.width, u = r.height), new Z(st(t.x, e.x, i), st(t.y, e.y, a), st(t.width, e.width, l), st(t.height, e.height, u));
  }
  static arcLerp(t, e, r, i = !1, a) {
    return a ?? (a = (t.position.sub(e.position).ctg + t.size.sub(e.size).ctg) / 2), Z.lerp(t, e, qi(r, i, a));
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
    const e = new qt(t), r = new Z(this);
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
var hu = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Xi = { exports: {} };
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
    }, x = y, A = function(s, o) {
      return o === void 0 && (o = null), s.length >= 3 ? Array.prototype.slice.call(s) : x(s[0]) == "object" && o ? o.split("").filter(function(h) {
        return s[0][h] !== void 0;
      }).map(function(h) {
        return s[0][h];
      }) : s[0];
    }, j = y, Y = function(s) {
      if (s.length < 2)
        return null;
      var o = s.length - 1;
      return j(s[o]) == "string" ? s[o].toLowerCase() : null;
    }, rt = Math.PI, T = {
      clip_rgb: i,
      limit: e,
      type: y,
      unpack: A,
      last: Y,
      TWOPI: rt * 2,
      PITHIRD: rt / 3,
      DEG2RAD: rt / 180,
      RAD2DEG: 180 / rt
    }, J = {
      format: {},
      autodetect: []
    }, pt = T.last, et = T.clip_rgb, kt = T.type, gt = J, te = function() {
      for (var o = [], h = arguments.length; h--; ) o[h] = arguments[h];
      var c = this;
      if (kt(o[0]) === "object" && o[0].constructor && o[0].constructor === this.constructor)
        return o[0];
      var d = pt(o), p = !1;
      if (!d) {
        p = !0, gt.sorted || (gt.autodetect = gt.autodetect.sort(function(C, R) {
          return R.p - C.p;
        }), gt.sorted = !0);
        for (var f = 0, m = gt.autodetect; f < m.length; f += 1) {
          var b = m[f];
          if (d = b.test.apply(b, o), d)
            break;
        }
      }
      if (gt.format[d]) {
        var w = gt.format[d].apply(null, p ? o : o.slice(0, -1));
        c._rgb = et(w);
      } else
        throw new Error("unknown format: " + o);
      c._rgb.length === 3 && c._rgb.push(1);
    };
    te.prototype.toString = function() {
      return kt(this.hex) == "function" ? this.hex() : "[" + this._rgb.join(",") + "]";
    };
    var _ = te, Et = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(Et.Color, [null].concat(s)))();
    };
    Et.Color = _, Et.version = "2.4.2";
    var at = Et, nr = T.unpack, Ne = Math.max, Gr = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = nr(s, "rgb"), c = h[0], d = h[1], p = h[2];
      c = c / 255, d = d / 255, p = p / 255;
      var f = 1 - Ne(c, Ne(d, p)), m = f < 1 ? 1 / (1 - f) : 0, b = (1 - c - f) * m, w = (1 - d - f) * m, C = (1 - p - f) * m;
      return [b, w, C, f];
    }, Cr = Gr, Xr = T.unpack, We = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      s = Xr(s, "cmyk");
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
    }, B = We, bt = at, ct = _, ee = J, ra = T.unpack, na = T.type, sa = Cr;
    ct.prototype.cmyk = function() {
      return sa(this._rgb);
    }, bt.cmyk = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(ct, [null].concat(s, ["cmyk"])))();
    }, ee.format.cmyk = B, ee.autodetect.push({
      p: 2,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = ra(s, "cmyk"), na(s) === "array" && s.length === 4)
          return "cmyk";
      }
    });
    var ia = T.unpack, aa = T.last, Hr = function(s) {
      return Math.round(s * 100) / 100;
    }, oa = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = ia(s, "hsla"), c = aa(s) || "lsa";
      return h[0] = Hr(h[0] || 0), h[1] = Hr(h[1] * 100) + "%", h[2] = Hr(h[2] * 100) + "%", c === "hsla" || h.length > 3 && h[3] < 1 ? (h[3] = h.length > 3 ? h[3] : 1, c = "hsla") : h.length = 3, c + "(" + h.join(",") + ")";
    }, la = oa, ha = T.unpack, ca = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      s = ha(s, "rgba");
      var h = s[0], c = s[1], d = s[2];
      h /= 255, c /= 255, d /= 255;
      var p = Math.min(h, c, d), f = Math.max(h, c, d), m = (f + p) / 2, b, w;
      return f === p ? (b = 0, w = Number.NaN) : b = m < 0.5 ? (f - p) / (f + p) : (f - p) / (2 - f - p), h == f ? w = (c - d) / (f - p) : c == f ? w = 2 + (d - h) / (f - p) : d == f && (w = 4 + (h - c) / (f - p)), w *= 60, w < 0 && (w += 360), s.length > 3 && s[3] !== void 0 ? [w, b, m, s[3]] : [w, b, m];
    }, Yn = ca, ua = T.unpack, fa = T.last, da = la, pa = Yn, Yr = Math.round, ga = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = ua(s, "rgba"), c = fa(s) || "rgb";
      return c.substr(0, 3) == "hsl" ? da(pa(h), c) : (h[0] = Yr(h[0]), h[1] = Yr(h[1]), h[2] = Yr(h[2]), (c === "rgba" || h.length > 3 && h[3] < 1) && (h[3] = h.length > 3 ? h[3] : 1, c = "rgba"), c + "(" + h.slice(0, c === "rgb" ? 3 : 4).join(",") + ")");
    }, va = ga, ma = T.unpack, Zr = Math.round, ba = function() {
      for (var s, o = [], h = arguments.length; h--; ) o[h] = arguments[h];
      o = ma(o, "hsl");
      var c = o[0], d = o[1], p = o[2], f, m, b;
      if (d === 0)
        f = m = b = p * 255;
      else {
        var w = [0, 0, 0], C = [0, 0, 0], R = p < 0.5 ? p * (1 + d) : p + d - p * d, S = 2 * p - R, M = c / 360;
        w[0] = M + 1 / 3, w[1] = M, w[2] = M - 1 / 3;
        for (var L = 0; L < 3; L++)
          w[L] < 0 && (w[L] += 1), w[L] > 1 && (w[L] -= 1), 6 * w[L] < 1 ? C[L] = S + (R - S) * 6 * w[L] : 2 * w[L] < 1 ? C[L] = R : 3 * w[L] < 2 ? C[L] = S + (R - S) * (2 / 3 - w[L]) * 6 : C[L] = S;
        s = [Zr(C[0] * 255), Zr(C[1] * 255), Zr(C[2] * 255)], f = s[0], m = s[1], b = s[2];
      }
      return o.length > 3 ? [f, m, b, o[3]] : [f, m, b, 1];
    }, Zn = ba, Vn = Zn, Jn = J, Qn = /^rgb\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*\)$/, Kn = /^rgba\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*([01]|[01]?\.\d+)\)$/, ts = /^rgb\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/, es = /^rgba\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/, rs = /^hsl\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/, ns = /^hsla\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/, ss = Math.round, is = function(s) {
      s = s.toLowerCase().trim();
      var o;
      if (Jn.format.named)
        try {
          return Jn.format.named(s);
        } catch {
        }
      if (o = s.match(Qn)) {
        for (var h = o.slice(1, 4), c = 0; c < 3; c++)
          h[c] = +h[c];
        return h[3] = 1, h;
      }
      if (o = s.match(Kn)) {
        for (var d = o.slice(1, 5), p = 0; p < 4; p++)
          d[p] = +d[p];
        return d;
      }
      if (o = s.match(ts)) {
        for (var f = o.slice(1, 4), m = 0; m < 3; m++)
          f[m] = ss(f[m] * 2.55);
        return f[3] = 1, f;
      }
      if (o = s.match(es)) {
        for (var b = o.slice(1, 5), w = 0; w < 3; w++)
          b[w] = ss(b[w] * 2.55);
        return b[3] = +b[3], b;
      }
      if (o = s.match(rs)) {
        var C = o.slice(1, 4);
        C[1] *= 0.01, C[2] *= 0.01;
        var R = Vn(C);
        return R[3] = 1, R;
      }
      if (o = s.match(ns)) {
        var S = o.slice(1, 4);
        S[1] *= 0.01, S[2] *= 0.01;
        var M = Vn(S);
        return M[3] = +o[4], M;
      }
    };
    is.test = function(s) {
      return Qn.test(s) || Kn.test(s) || ts.test(s) || es.test(s) || rs.test(s) || ns.test(s);
    };
    var ya = is, wa = at, as = _, os = J, xa = T.type, Ca = va, ls = ya;
    as.prototype.css = function(s) {
      return Ca(this._rgb, s);
    }, wa.css = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(as, [null].concat(s, ["css"])))();
    }, os.format.css = ls, os.autodetect.push({
      p: 5,
      test: function(s) {
        for (var o = [], h = arguments.length - 1; h-- > 0; ) o[h] = arguments[h + 1];
        if (!o.length && xa(s) === "string" && ls.test(s))
          return "css";
      }
    });
    var hs = _, Sa = at, ka = J, Ta = T.unpack;
    ka.format.gl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = Ta(s, "rgba");
      return h[0] *= 255, h[1] *= 255, h[2] *= 255, h;
    }, Sa.gl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(hs, [null].concat(s, ["gl"])))();
    }, hs.prototype.gl = function() {
      var s = this._rgb;
      return [s[0] / 255, s[1] / 255, s[2] / 255, s[3]];
    };
    var Pa = T.unpack, Ra = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = Pa(s, "rgb"), c = h[0], d = h[1], p = h[2], f = Math.min(c, d, p), m = Math.max(c, d, p), b = m - f, w = b * 100 / 255, C = f / (255 - b) * 100, R;
      return b === 0 ? R = Number.NaN : (c === m && (R = (d - p) / b), d === m && (R = 2 + (p - c) / b), p === m && (R = 4 + (c - d) / b), R *= 60, R < 0 && (R += 360)), [R, w, C];
    }, La = Ra, Ma = T.unpack, $a = Math.floor, za = function() {
      for (var s, o, h, c, d, p, f = [], m = arguments.length; m--; ) f[m] = arguments[m];
      f = Ma(f, "hcg");
      var b = f[0], w = f[1], C = f[2], R, S, M;
      C = C * 255;
      var L = w * 255;
      if (w === 0)
        R = S = M = C;
      else {
        b === 360 && (b = 0), b > 360 && (b -= 360), b < 0 && (b += 360), b /= 60;
        var N = $a(b), q = b - N, X = C * (1 - w), V = X + L * (1 - q), yt = X + L * q, mt = X + L;
        switch (N) {
          case 0:
            s = [mt, yt, X], R = s[0], S = s[1], M = s[2];
            break;
          case 1:
            o = [V, mt, X], R = o[0], S = o[1], M = o[2];
            break;
          case 2:
            h = [X, mt, yt], R = h[0], S = h[1], M = h[2];
            break;
          case 3:
            c = [X, V, mt], R = c[0], S = c[1], M = c[2];
            break;
          case 4:
            d = [yt, X, mt], R = d[0], S = d[1], M = d[2];
            break;
          case 5:
            p = [mt, X, V], R = p[0], S = p[1], M = p[2];
            break;
        }
      }
      return [R, S, M, f.length > 3 ? f[3] : 1];
    }, Aa = za, Oa = T.unpack, Fa = T.type, Ia = at, cs = _, us = J, Ea = La;
    cs.prototype.hcg = function() {
      return Ea(this._rgb);
    }, Ia.hcg = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(cs, [null].concat(s, ["hcg"])))();
    }, us.format.hcg = Aa, us.autodetect.push({
      p: 1,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = Oa(s, "hcg"), Fa(s) === "array" && s.length === 3)
          return "hcg";
      }
    });
    var _a = T.unpack, ja = T.last, Sr = Math.round, Da = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = _a(s, "rgba"), c = h[0], d = h[1], p = h[2], f = h[3], m = ja(s) || "auto";
      f === void 0 && (f = 1), m === "auto" && (m = f < 1 ? "rgba" : "rgb"), c = Sr(c), d = Sr(d), p = Sr(p);
      var b = c << 16 | d << 8 | p, w = "000000" + b.toString(16);
      w = w.substr(w.length - 6);
      var C = "0" + Sr(f * 255).toString(16);
      switch (C = C.substr(C.length - 2), m.toLowerCase()) {
        case "rgba":
          return "#" + w + C;
        case "argb":
          return "#" + C + w;
        default:
          return "#" + w;
      }
    }, fs = Da, Ba = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, Na = /^#?([A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$/, Wa = function(s) {
      if (s.match(Ba)) {
        (s.length === 4 || s.length === 7) && (s = s.substr(1)), s.length === 3 && (s = s.split(""), s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2]);
        var o = parseInt(s, 16), h = o >> 16, c = o >> 8 & 255, d = o & 255;
        return [h, c, d, 1];
      }
      if (s.match(Na)) {
        (s.length === 5 || s.length === 9) && (s = s.substr(1)), s.length === 4 && (s = s.split(""), s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2] + s[3] + s[3]);
        var p = parseInt(s, 16), f = p >> 24 & 255, m = p >> 16 & 255, b = p >> 8 & 255, w = Math.round((p & 255) / 255 * 100) / 100;
        return [f, m, b, w];
      }
      throw new Error("unknown hex color: " + s);
    }, ds = Wa, Ua = at, ps = _, qa = T.type, gs = J, Ga = fs;
    ps.prototype.hex = function(s) {
      return Ga(this._rgb, s);
    }, Ua.hex = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(ps, [null].concat(s, ["hex"])))();
    }, gs.format.hex = ds, gs.autodetect.push({
      p: 4,
      test: function(s) {
        for (var o = [], h = arguments.length - 1; h-- > 0; ) o[h] = arguments[h + 1];
        if (!o.length && qa(s) === "string" && [3, 4, 5, 6, 7, 8, 9].indexOf(s.length) >= 0)
          return "hex";
      }
    });
    var Xa = T.unpack, vs = T.TWOPI, Ha = Math.min, Ya = Math.sqrt, Za = Math.acos, Va = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = Xa(s, "rgb"), c = h[0], d = h[1], p = h[2];
      c /= 255, d /= 255, p /= 255;
      var f, m = Ha(c, d, p), b = (c + d + p) / 3, w = b > 0 ? 1 - m / b : 0;
      return w === 0 ? f = NaN : (f = (c - d + (c - p)) / 2, f /= Ya((c - d) * (c - d) + (c - p) * (d - p)), f = Za(f), p > d && (f = vs - f), f /= vs), [f * 360, w, b];
    }, Ja = Va, Qa = T.unpack, Vr = T.limit, Ue = T.TWOPI, Jr = T.PITHIRD, qe = Math.cos, Ka = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      s = Qa(s, "hsi");
      var h = s[0], c = s[1], d = s[2], p, f, m;
      return isNaN(h) && (h = 0), isNaN(c) && (c = 0), h > 360 && (h -= 360), h < 0 && (h += 360), h /= 360, h < 1 / 3 ? (m = (1 - c) / 3, p = (1 + c * qe(Ue * h) / qe(Jr - Ue * h)) / 3, f = 1 - (m + p)) : h < 2 / 3 ? (h -= 1 / 3, p = (1 - c) / 3, f = (1 + c * qe(Ue * h) / qe(Jr - Ue * h)) / 3, m = 1 - (p + f)) : (h -= 2 / 3, f = (1 - c) / 3, m = (1 + c * qe(Ue * h) / qe(Jr - Ue * h)) / 3, p = 1 - (f + m)), p = Vr(d * p * 3), f = Vr(d * f * 3), m = Vr(d * m * 3), [p * 255, f * 255, m * 255, s.length > 3 ? s[3] : 1];
    }, to = Ka, eo = T.unpack, ro = T.type, no = at, ms = _, bs = J, so = Ja;
    ms.prototype.hsi = function() {
      return so(this._rgb);
    }, no.hsi = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(ms, [null].concat(s, ["hsi"])))();
    }, bs.format.hsi = to, bs.autodetect.push({
      p: 2,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = eo(s, "hsi"), ro(s) === "array" && s.length === 3)
          return "hsi";
      }
    });
    var io = T.unpack, ao = T.type, oo = at, ys = _, ws = J, lo = Yn;
    ys.prototype.hsl = function() {
      return lo(this._rgb);
    }, oo.hsl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(ys, [null].concat(s, ["hsl"])))();
    }, ws.format.hsl = Zn, ws.autodetect.push({
      p: 2,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = io(s, "hsl"), ao(s) === "array" && s.length === 3)
          return "hsl";
      }
    });
    var ho = T.unpack, co = Math.min, uo = Math.max, fo = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      s = ho(s, "rgb");
      var h = s[0], c = s[1], d = s[2], p = co(h, c, d), f = uo(h, c, d), m = f - p, b, w, C;
      return C = f / 255, f === 0 ? (b = Number.NaN, w = 0) : (w = m / f, h === f && (b = (c - d) / m), c === f && (b = 2 + (d - h) / m), d === f && (b = 4 + (h - c) / m), b *= 60, b < 0 && (b += 360)), [b, w, C];
    }, po = fo, go = T.unpack, vo = Math.floor, mo = function() {
      for (var s, o, h, c, d, p, f = [], m = arguments.length; m--; ) f[m] = arguments[m];
      f = go(f, "hsv");
      var b = f[0], w = f[1], C = f[2], R, S, M;
      if (C *= 255, w === 0)
        R = S = M = C;
      else {
        b === 360 && (b = 0), b > 360 && (b -= 360), b < 0 && (b += 360), b /= 60;
        var L = vo(b), N = b - L, q = C * (1 - w), X = C * (1 - w * N), V = C * (1 - w * (1 - N));
        switch (L) {
          case 0:
            s = [C, V, q], R = s[0], S = s[1], M = s[2];
            break;
          case 1:
            o = [X, C, q], R = o[0], S = o[1], M = o[2];
            break;
          case 2:
            h = [q, C, V], R = h[0], S = h[1], M = h[2];
            break;
          case 3:
            c = [q, X, C], R = c[0], S = c[1], M = c[2];
            break;
          case 4:
            d = [V, q, C], R = d[0], S = d[1], M = d[2];
            break;
          case 5:
            p = [C, q, X], R = p[0], S = p[1], M = p[2];
            break;
        }
      }
      return [R, S, M, f.length > 3 ? f[3] : 1];
    }, bo = mo, yo = T.unpack, wo = T.type, xo = at, xs = _, Cs = J, Co = po;
    xs.prototype.hsv = function() {
      return Co(this._rgb);
    }, xo.hsv = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(xs, [null].concat(s, ["hsv"])))();
    }, Cs.format.hsv = bo, Cs.autodetect.push({
      p: 2,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = yo(s, "hsv"), wo(s) === "array" && s.length === 3)
          return "hsv";
      }
    });
    var kr = {
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
    }, Ge = kr, So = T.unpack, Ss = Math.pow, ko = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = So(s, "rgb"), c = h[0], d = h[1], p = h[2], f = To(c, d, p), m = f[0], b = f[1], w = f[2], C = 116 * b - 16;
      return [C < 0 ? 0 : C, 500 * (m - b), 200 * (b - w)];
    }, Qr = function(s) {
      return (s /= 255) <= 0.04045 ? s / 12.92 : Ss((s + 0.055) / 1.055, 2.4);
    }, Kr = function(s) {
      return s > Ge.t3 ? Ss(s, 1 / 3) : s / Ge.t2 + Ge.t0;
    }, To = function(s, o, h) {
      s = Qr(s), o = Qr(o), h = Qr(h);
      var c = Kr((0.4124564 * s + 0.3575761 * o + 0.1804375 * h) / Ge.Xn), d = Kr((0.2126729 * s + 0.7151522 * o + 0.072175 * h) / Ge.Yn), p = Kr((0.0193339 * s + 0.119192 * o + 0.9503041 * h) / Ge.Zn);
      return [c, d, p];
    }, ks = ko, Xe = kr, Po = T.unpack, Ro = Math.pow, Lo = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      s = Po(s, "lab");
      var h = s[0], c = s[1], d = s[2], p, f, m, b, w, C;
      return f = (h + 16) / 116, p = isNaN(c) ? f : f + c / 500, m = isNaN(d) ? f : f - d / 200, f = Xe.Yn * en(f), p = Xe.Xn * en(p), m = Xe.Zn * en(m), b = tn(3.2404542 * p - 1.5371385 * f - 0.4985314 * m), w = tn(-0.969266 * p + 1.8760108 * f + 0.041556 * m), C = tn(0.0556434 * p - 0.2040259 * f + 1.0572252 * m), [b, w, C, s.length > 3 ? s[3] : 1];
    }, tn = function(s) {
      return 255 * (s <= 304e-5 ? 12.92 * s : 1.055 * Ro(s, 1 / 2.4) - 0.055);
    }, en = function(s) {
      return s > Xe.t1 ? s * s * s : Xe.t2 * (s - Xe.t0);
    }, Ts = Lo, Mo = T.unpack, $o = T.type, zo = at, Ps = _, Rs = J, Ao = ks;
    Ps.prototype.lab = function() {
      return Ao(this._rgb);
    }, zo.lab = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(Ps, [null].concat(s, ["lab"])))();
    }, Rs.format.lab = Ts, Rs.autodetect.push({
      p: 2,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = Mo(s, "lab"), $o(s) === "array" && s.length === 3)
          return "lab";
      }
    });
    var Oo = T.unpack, Fo = T.RAD2DEG, Io = Math.sqrt, Eo = Math.atan2, _o = Math.round, jo = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = Oo(s, "lab"), c = h[0], d = h[1], p = h[2], f = Io(d * d + p * p), m = (Eo(p, d) * Fo + 360) % 360;
      return _o(f * 1e4) === 0 && (m = Number.NaN), [c, f, m];
    }, Ls = jo, Do = T.unpack, Bo = ks, No = Ls, Wo = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = Do(s, "rgb"), c = h[0], d = h[1], p = h[2], f = Bo(c, d, p), m = f[0], b = f[1], w = f[2];
      return No(m, b, w);
    }, Uo = Wo, qo = T.unpack, Go = T.DEG2RAD, Xo = Math.sin, Ho = Math.cos, Yo = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = qo(s, "lch"), c = h[0], d = h[1], p = h[2];
      return isNaN(p) && (p = 0), p = p * Go, [c, Ho(p) * d, Xo(p) * d];
    }, Ms = Yo, Zo = T.unpack, Vo = Ms, Jo = Ts, Qo = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      s = Zo(s, "lch");
      var h = s[0], c = s[1], d = s[2], p = Vo(h, c, d), f = p[0], m = p[1], b = p[2], w = Jo(f, m, b), C = w[0], R = w[1], S = w[2];
      return [C, R, S, s.length > 3 ? s[3] : 1];
    }, $s = Qo, Ko = T.unpack, tl = $s, el = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = Ko(s, "hcl").reverse();
      return tl.apply(void 0, h);
    }, rl = el, nl = T.unpack, sl = T.type, zs = at, Tr = _, rn = J, As = Uo;
    Tr.prototype.lch = function() {
      return As(this._rgb);
    }, Tr.prototype.hcl = function() {
      return As(this._rgb).reverse();
    }, zs.lch = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(Tr, [null].concat(s, ["lch"])))();
    }, zs.hcl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(Tr, [null].concat(s, ["hcl"])))();
    }, rn.format.lch = $s, rn.format.hcl = rl, ["lch", "hcl"].forEach(function(s) {
      return rn.autodetect.push({
        p: 2,
        test: function() {
          for (var o = [], h = arguments.length; h--; ) o[h] = arguments[h];
          if (o = nl(o, s), sl(o) === "array" && o.length === 3)
            return s;
        }
      });
    });
    var il = {
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
    }, Os = il, al = _, Fs = J, ol = T.type, sr = Os, ll = ds, hl = fs;
    al.prototype.name = function() {
      for (var s = hl(this._rgb, "rgb"), o = 0, h = Object.keys(sr); o < h.length; o += 1) {
        var c = h[o];
        if (sr[c] === s)
          return c.toLowerCase();
      }
      return s;
    }, Fs.format.named = function(s) {
      if (s = s.toLowerCase(), sr[s])
        return ll(sr[s]);
      throw new Error("unknown color name: " + s);
    }, Fs.autodetect.push({
      p: 5,
      test: function(s) {
        for (var o = [], h = arguments.length - 1; h-- > 0; ) o[h] = arguments[h + 1];
        if (!o.length && ol(s) === "string" && sr[s.toLowerCase()])
          return "named";
      }
    });
    var cl = T.unpack, ul = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = cl(s, "rgb"), c = h[0], d = h[1], p = h[2];
      return (c << 16) + (d << 8) + p;
    }, fl = ul, dl = T.type, pl = function(s) {
      if (dl(s) == "number" && s >= 0 && s <= 16777215) {
        var o = s >> 16, h = s >> 8 & 255, c = s & 255;
        return [o, h, c, 1];
      }
      throw new Error("unknown num color: " + s);
    }, gl = pl, vl = at, Is = _, Es = J, ml = T.type, bl = fl;
    Is.prototype.num = function() {
      return bl(this._rgb);
    }, vl.num = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(Is, [null].concat(s, ["num"])))();
    }, Es.format.num = gl, Es.autodetect.push({
      p: 5,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s.length === 1 && ml(s[0]) === "number" && s[0] >= 0 && s[0] <= 16777215)
          return "num";
      }
    });
    var yl = at, nn = _, _s = J, js = T.unpack, Ds = T.type, Bs = Math.round;
    nn.prototype.rgb = function(s) {
      return s === void 0 && (s = !0), s === !1 ? this._rgb.slice(0, 3) : this._rgb.slice(0, 3).map(Bs);
    }, nn.prototype.rgba = function(s) {
      return s === void 0 && (s = !0), this._rgb.slice(0, 4).map(function(o, h) {
        return h < 3 ? s === !1 ? o : Bs(o) : o;
      });
    }, yl.rgb = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(nn, [null].concat(s, ["rgb"])))();
    }, _s.format.rgb = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = js(s, "rgba");
      return h[3] === void 0 && (h[3] = 1), h;
    }, _s.autodetect.push({
      p: 3,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = js(s, "rgba"), Ds(s) === "array" && (s.length === 3 || s.length === 4 && Ds(s[3]) == "number" && s[3] >= 0 && s[3] <= 1))
          return "rgb";
      }
    });
    var Pr = Math.log, wl = function(s) {
      var o = s / 100, h, c, d;
      return o < 66 ? (h = 255, c = o < 6 ? 0 : -155.25485562709179 - 0.44596950469579133 * (c = o - 2) + 104.49216199393888 * Pr(c), d = o < 20 ? 0 : -254.76935184120902 + 0.8274096064007395 * (d = o - 10) + 115.67994401066147 * Pr(d)) : (h = 351.97690566805693 + 0.114206453784165 * (h = o - 55) - 40.25366309332127 * Pr(h), c = 325.4494125711974 + 0.07943456536662342 * (c = o - 50) - 28.0852963507957 * Pr(c), d = 255), [h, c, d, 1];
    }, Ns = wl, xl = Ns, Cl = T.unpack, Sl = Math.round, kl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      for (var h = Cl(s, "rgb"), c = h[0], d = h[2], p = 1e3, f = 4e4, m = 0.4, b; f - p > m; ) {
        b = (f + p) * 0.5;
        var w = xl(b);
        w[2] / w[0] >= d / c ? f = b : p = b;
      }
      return Sl(b);
    }, Tl = kl, sn = at, Rr = _, an = J, Pl = Tl;
    Rr.prototype.temp = Rr.prototype.kelvin = Rr.prototype.temperature = function() {
      return Pl(this._rgb);
    }, sn.temp = sn.kelvin = sn.temperature = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(Rr, [null].concat(s, ["temp"])))();
    }, an.format.temp = an.format.kelvin = an.format.temperature = Ns;
    var Rl = T.unpack, on = Math.cbrt, Ll = Math.pow, Ml = Math.sign, $l = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = Rl(s, "rgb"), c = h[0], d = h[1], p = h[2], f = [ln(c / 255), ln(d / 255), ln(p / 255)], m = f[0], b = f[1], w = f[2], C = on(0.4122214708 * m + 0.5363325363 * b + 0.0514459929 * w), R = on(0.2119034982 * m + 0.6806995451 * b + 0.1073969566 * w), S = on(0.0883024619 * m + 0.2817188376 * b + 0.6299787005 * w);
      return [
        0.2104542553 * C + 0.793617785 * R - 0.0040720468 * S,
        1.9779984951 * C - 2.428592205 * R + 0.4505937099 * S,
        0.0259040371 * C + 0.7827717662 * R - 0.808675766 * S
      ];
    }, Ws = $l;
    function ln(s) {
      var o = Math.abs(s);
      return o < 0.04045 ? s / 12.92 : (Ml(s) || 1) * Ll((o + 0.055) / 1.055, 2.4);
    }
    var zl = T.unpack, Lr = Math.pow, Al = Math.sign, Ol = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      s = zl(s, "lab");
      var h = s[0], c = s[1], d = s[2], p = Lr(h + 0.3963377774 * c + 0.2158037573 * d, 3), f = Lr(h - 0.1055613458 * c - 0.0638541728 * d, 3), m = Lr(h - 0.0894841775 * c - 1.291485548 * d, 3);
      return [
        255 * hn(4.0767416621 * p - 3.3077115913 * f + 0.2309699292 * m),
        255 * hn(-1.2684380046 * p + 2.6097574011 * f - 0.3413193965 * m),
        255 * hn(-0.0041960863 * p - 0.7034186147 * f + 1.707614701 * m),
        s.length > 3 ? s[3] : 1
      ];
    }, Us = Ol;
    function hn(s) {
      var o = Math.abs(s);
      return o > 31308e-7 ? (Al(s) || 1) * (1.055 * Lr(o, 1 / 2.4) - 0.055) : s * 12.92;
    }
    var Fl = T.unpack, Il = T.type, El = at, qs = _, Gs = J, _l = Ws;
    qs.prototype.oklab = function() {
      return _l(this._rgb);
    }, El.oklab = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(qs, [null].concat(s, ["oklab"])))();
    }, Gs.format.oklab = Us, Gs.autodetect.push({
      p: 3,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = Fl(s, "oklab"), Il(s) === "array" && s.length === 3)
          return "oklab";
      }
    });
    var jl = T.unpack, Dl = Ws, Bl = Ls, Nl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      var h = jl(s, "rgb"), c = h[0], d = h[1], p = h[2], f = Dl(c, d, p), m = f[0], b = f[1], w = f[2];
      return Bl(m, b, w);
    }, Wl = Nl, Ul = T.unpack, ql = Ms, Gl = Us, Xl = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      s = Ul(s, "lch");
      var h = s[0], c = s[1], d = s[2], p = ql(h, c, d), f = p[0], m = p[1], b = p[2], w = Gl(f, m, b), C = w[0], R = w[1], S = w[2];
      return [C, R, S, s.length > 3 ? s[3] : 1];
    }, Hl = Xl, Yl = T.unpack, Zl = T.type, Vl = at, Xs = _, Hs = J, Jl = Wl;
    Xs.prototype.oklch = function() {
      return Jl(this._rgb);
    }, Vl.oklch = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      return new (Function.prototype.bind.apply(Xs, [null].concat(s, ["oklch"])))();
    }, Hs.format.oklch = Hl, Hs.autodetect.push({
      p: 3,
      test: function() {
        for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
        if (s = Yl(s, "oklch"), Zl(s) === "array" && s.length === 3)
          return "oklch";
      }
    });
    var Ys = _, Ql = T.type;
    Ys.prototype.alpha = function(s, o) {
      return o === void 0 && (o = !1), s !== void 0 && Ql(s) === "number" ? o ? (this._rgb[3] = s, this) : new Ys([this._rgb[0], this._rgb[1], this._rgb[2], s], "rgb") : this._rgb[3];
    };
    var Kl = _;
    Kl.prototype.clipped = function() {
      return this._rgb._clipped || !1;
    };
    var Le = _, th = kr;
    Le.prototype.darken = function(s) {
      s === void 0 && (s = 1);
      var o = this, h = o.lab();
      return h[0] -= th.Kn * s, new Le(h, "lab").alpha(o.alpha(), !0);
    }, Le.prototype.brighten = function(s) {
      return s === void 0 && (s = 1), this.darken(-s);
    }, Le.prototype.darker = Le.prototype.darken, Le.prototype.brighter = Le.prototype.brighten;
    var eh = _;
    eh.prototype.get = function(s) {
      var o = s.split("."), h = o[0], c = o[1], d = this[h]();
      if (c) {
        var p = h.indexOf(c) - (h.substr(0, 2) === "ok" ? 2 : 0);
        if (p > -1)
          return d[p];
        throw new Error("unknown channel " + c + " in mode " + h);
      } else
        return d;
    };
    var He = _, rh = T.type, nh = Math.pow, sh = 1e-7, ih = 20;
    He.prototype.luminance = function(s) {
      if (s !== void 0 && rh(s) === "number") {
        if (s === 0)
          return new He([0, 0, 0, this._rgb[3]], "rgb");
        if (s === 1)
          return new He([255, 255, 255, this._rgb[3]], "rgb");
        var o = this.luminance(), h = "rgb", c = ih, d = function(f, m) {
          var b = f.interpolate(m, 0.5, h), w = b.luminance();
          return Math.abs(s - w) < sh || !c-- ? b : w > s ? d(f, b) : d(b, m);
        }, p = (o > s ? d(new He([0, 0, 0]), this) : d(this, new He([255, 255, 255]))).rgb();
        return new He(p.concat([this._rgb[3]]));
      }
      return ah.apply(void 0, this._rgb.slice(0, 3));
    };
    var ah = function(s, o, h) {
      return s = cn(s), o = cn(o), h = cn(h), 0.2126 * s + 0.7152 * o + 0.0722 * h;
    }, cn = function(s) {
      return s /= 255, s <= 0.03928 ? s / 12.92 : nh((s + 0.055) / 1.055, 2.4);
    }, zt = {}, Zs = _, Vs = T.type, Mr = zt, Js = function(s, o, h) {
      h === void 0 && (h = 0.5);
      for (var c = [], d = arguments.length - 3; d-- > 0; ) c[d] = arguments[d + 3];
      var p = c[0] || "lrgb";
      if (!Mr[p] && !c.length && (p = Object.keys(Mr)[0]), !Mr[p])
        throw new Error("interpolation mode " + p + " is not defined");
      return Vs(s) !== "object" && (s = new Zs(s)), Vs(o) !== "object" && (o = new Zs(o)), Mr[p](s, o, h).alpha(s.alpha() + h * (o.alpha() - s.alpha()));
    }, Qs = _, oh = Js;
    Qs.prototype.mix = Qs.prototype.interpolate = function(s, o) {
      o === void 0 && (o = 0.5);
      for (var h = [], c = arguments.length - 2; c-- > 0; ) h[c] = arguments[c + 2];
      return oh.apply(void 0, [this, s, o].concat(h));
    };
    var Ks = _;
    Ks.prototype.premultiply = function(s) {
      s === void 0 && (s = !1);
      var o = this._rgb, h = o[3];
      return s ? (this._rgb = [o[0] * h, o[1] * h, o[2] * h, h], this) : new Ks([o[0] * h, o[1] * h, o[2] * h, h], "rgb");
    };
    var un = _, lh = kr;
    un.prototype.saturate = function(s) {
      s === void 0 && (s = 1);
      var o = this, h = o.lch();
      return h[1] += lh.Kn * s, h[1] < 0 && (h[1] = 0), new un(h, "lch").alpha(o.alpha(), !0);
    }, un.prototype.desaturate = function(s) {
      return s === void 0 && (s = 1), this.saturate(-s);
    };
    var ti = _, ei = T.type;
    ti.prototype.set = function(s, o, h) {
      h === void 0 && (h = !1);
      var c = s.split("."), d = c[0], p = c[1], f = this[d]();
      if (p) {
        var m = d.indexOf(p) - (d.substr(0, 2) === "ok" ? 2 : 0);
        if (m > -1) {
          if (ei(o) == "string")
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
          else if (ei(o) === "number")
            f[m] = o;
          else
            throw new Error("unsupported value for Color.set");
          var b = new ti(f, d);
          return h ? (this._rgb = b._rgb, this) : b;
        }
        throw new Error("unknown channel " + p + " in mode " + d);
      } else
        return f;
    };
    var hh = _, ch = function(s, o, h) {
      var c = s._rgb, d = o._rgb;
      return new hh(
        c[0] + h * (d[0] - c[0]),
        c[1] + h * (d[1] - c[1]),
        c[2] + h * (d[2] - c[2]),
        "rgb"
      );
    };
    zt.rgb = ch;
    var uh = _, fn = Math.sqrt, Ye = Math.pow, fh = function(s, o, h) {
      var c = s._rgb, d = c[0], p = c[1], f = c[2], m = o._rgb, b = m[0], w = m[1], C = m[2];
      return new uh(
        fn(Ye(d, 2) * (1 - h) + Ye(b, 2) * h),
        fn(Ye(p, 2) * (1 - h) + Ye(w, 2) * h),
        fn(Ye(f, 2) * (1 - h) + Ye(C, 2) * h),
        "rgb"
      );
    };
    zt.lrgb = fh;
    var dh = _, ph = function(s, o, h) {
      var c = s.lab(), d = o.lab();
      return new dh(
        c[0] + h * (d[0] - c[0]),
        c[1] + h * (d[1] - c[1]),
        c[2] + h * (d[2] - c[2]),
        "lab"
      );
    };
    zt.lab = ph;
    var ri = _, Ze = function(s, o, h, c) {
      var d, p, f, m;
      c === "hsl" ? (f = s.hsl(), m = o.hsl()) : c === "hsv" ? (f = s.hsv(), m = o.hsv()) : c === "hcg" ? (f = s.hcg(), m = o.hcg()) : c === "hsi" ? (f = s.hsi(), m = o.hsi()) : c === "lch" || c === "hcl" ? (c = "hcl", f = s.hcl(), m = o.hcl()) : c === "oklch" && (f = s.oklch().reverse(), m = o.oklch().reverse());
      var b, w, C, R, S, M;
      (c.substr(0, 1) === "h" || c === "oklch") && (d = f, b = d[0], C = d[1], S = d[2], p = m, w = p[0], R = p[1], M = p[2]);
      var L, N, q, X;
      return !isNaN(b) && !isNaN(w) ? (w > b && w - b > 180 ? X = w - (b + 360) : w < b && b - w > 180 ? X = w + 360 - b : X = w - b, N = b + h * X) : isNaN(b) ? isNaN(w) ? N = Number.NaN : (N = w, (S == 1 || S == 0) && c != "hsv" && (L = R)) : (N = b, (M == 1 || M == 0) && c != "hsv" && (L = C)), L === void 0 && (L = C + h * (R - C)), q = S + h * (M - S), c === "oklch" ? new ri([q, L, N], c) : new ri([N, L, q], c);
    }, gh = Ze, ni = function(s, o, h) {
      return gh(s, o, h, "lch");
    };
    zt.lch = ni, zt.hcl = ni;
    var vh = _, mh = function(s, o, h) {
      var c = s.num(), d = o.num();
      return new vh(c + h * (d - c), "num");
    };
    zt.num = mh;
    var bh = Ze, yh = function(s, o, h) {
      return bh(s, o, h, "hcg");
    };
    zt.hcg = yh;
    var wh = Ze, xh = function(s, o, h) {
      return wh(s, o, h, "hsi");
    };
    zt.hsi = xh;
    var Ch = Ze, Sh = function(s, o, h) {
      return Ch(s, o, h, "hsl");
    };
    zt.hsl = Sh;
    var kh = Ze, Th = function(s, o, h) {
      return kh(s, o, h, "hsv");
    };
    zt.hsv = Th;
    var Ph = _, Rh = function(s, o, h) {
      var c = s.oklab(), d = o.oklab();
      return new Ph(
        c[0] + h * (d[0] - c[0]),
        c[1] + h * (d[1] - c[1]),
        c[2] + h * (d[2] - c[2]),
        "oklab"
      );
    };
    zt.oklab = Rh;
    var Lh = Ze, Mh = function(s, o, h) {
      return Lh(s, o, h, "oklch");
    };
    zt.oklch = Mh;
    var dn = _, $h = T.clip_rgb, pn = Math.pow, gn = Math.sqrt, vn = Math.PI, si = Math.cos, ii = Math.sin, zh = Math.atan2, Ah = function(s, o, h) {
      o === void 0 && (o = "lrgb"), h === void 0 && (h = null);
      var c = s.length;
      h || (h = Array.from(new Array(c)).map(function() {
        return 1;
      }));
      var d = c / h.reduce(function(N, q) {
        return N + q;
      });
      if (h.forEach(function(N, q) {
        h[q] *= d;
      }), s = s.map(function(N) {
        return new dn(N);
      }), o === "lrgb")
        return Oh(s, h);
      for (var p = s.shift(), f = p.get(o), m = [], b = 0, w = 0, C = 0; C < f.length; C++)
        if (f[C] = (f[C] || 0) * h[0], m.push(isNaN(f[C]) ? 0 : h[0]), o.charAt(C) === "h" && !isNaN(f[C])) {
          var R = f[C] / 180 * vn;
          b += si(R) * h[0], w += ii(R) * h[0];
        }
      var S = p.alpha() * h[0];
      s.forEach(function(N, q) {
        var X = N.get(o);
        S += N.alpha() * h[q + 1];
        for (var V = 0; V < f.length; V++)
          if (!isNaN(X[V]))
            if (m[V] += h[q + 1], o.charAt(V) === "h") {
              var yt = X[V] / 180 * vn;
              b += si(yt) * h[q + 1], w += ii(yt) * h[q + 1];
            } else
              f[V] += X[V] * h[q + 1];
      });
      for (var M = 0; M < f.length; M++)
        if (o.charAt(M) === "h") {
          for (var L = zh(w / m[M], b / m[M]) / vn * 180; L < 0; )
            L += 360;
          for (; L >= 360; )
            L -= 360;
          f[M] = L;
        } else
          f[M] = f[M] / m[M];
      return S /= c, new dn(f, o).alpha(S > 0.99999 ? 1 : S, !0);
    }, Oh = function(s, o) {
      for (var h = s.length, c = [0, 0, 0, 0], d = 0; d < s.length; d++) {
        var p = s[d], f = o[d] / h, m = p._rgb;
        c[0] += pn(m[0], 2) * f, c[1] += pn(m[1], 2) * f, c[2] += pn(m[2], 2) * f, c[3] += m[3] * f;
      }
      return c[0] = gn(c[0]), c[1] = gn(c[1]), c[2] = gn(c[2]), c[3] > 0.9999999 && (c[3] = 1), new dn($h(c));
    }, Dt = at, Ve = T.type, Fh = Math.pow, mn = function(s) {
      var o = "rgb", h = Dt("#ccc"), c = 0, d = [0, 1], p = [], f = [0, 0], m = !1, b = [], w = !1, C = 0, R = 1, S = !1, M = {}, L = !0, N = 1, q = function(k) {
        if (k = k || ["#fff", "#000"], k && Ve(k) === "string" && Dt.brewer && Dt.brewer[k.toLowerCase()] && (k = Dt.brewer[k.toLowerCase()]), Ve(k) === "array") {
          k.length === 1 && (k = [k[0], k[0]]), k = k.slice(0);
          for (var F = 0; F < k.length; F++)
            k[F] = Dt(k[F]);
          p.length = 0;
          for (var U = 0; U < k.length; U++)
            p.push(U / (k.length - 1));
        }
        return Lt(), b = k;
      }, X = function(k) {
        if (m != null) {
          for (var F = m.length - 1, U = 0; U < F && k >= m[U]; )
            U++;
          return U - 1;
        }
        return 0;
      }, V = function(k) {
        return k;
      }, yt = function(k) {
        return k;
      }, mt = function(k, F) {
        var U, W;
        if (F == null && (F = !1), isNaN(k) || k === null)
          return h;
        if (F)
          W = k;
        else if (m && m.length > 2) {
          var wt = X(k);
          W = wt / (m.length - 2);
        } else R !== C ? W = (k - C) / (R - C) : W = 1;
        W = yt(W), F || (W = V(W)), N !== 1 && (W = Fh(W, N)), W = f[0] + W * (1 - f[0] - f[1]), W = Math.min(1, Math.max(0, W));
        var nt = Math.floor(W * 1e4);
        if (L && M[nt])
          U = M[nt];
        else {
          if (Ve(b) === "array")
            for (var H = 0; H < p.length; H++) {
              var Q = p[H];
              if (W <= Q) {
                U = b[H];
                break;
              }
              if (W >= Q && H === p.length - 1) {
                U = b[H];
                break;
              }
              if (W > Q && W < p[H + 1]) {
                W = (W - Q) / (p[H + 1] - Q), U = Dt.interpolate(b[H], b[H + 1], W, o);
                break;
              }
            }
          else Ve(b) === "function" && (U = b(W));
          L && (M[nt] = U);
        }
        return U;
      }, Lt = function() {
        return M = {};
      };
      q(s);
      var G = function(k) {
        var F = Dt(mt(k));
        return w && F[w] ? F[w]() : F;
      };
      return G.classes = function(k) {
        if (k != null) {
          if (Ve(k) === "array")
            m = k, d = [k[0], k[k.length - 1]];
          else {
            var F = Dt.analyze(d);
            k === 0 ? m = [F.min, F.max] : m = Dt.limits(F, "e", k);
          }
          return G;
        }
        return m;
      }, G.domain = function(k) {
        if (!arguments.length)
          return d;
        C = k[0], R = k[k.length - 1], p = [];
        var F = b.length;
        if (k.length === F && C !== R)
          for (var U = 0, W = Array.from(k); U < W.length; U += 1) {
            var wt = W[U];
            p.push((wt - C) / (R - C));
          }
        else {
          for (var nt = 0; nt < F; nt++)
            p.push(nt / (F - 1));
          if (k.length > 2) {
            var H = k.map(function(K, tt) {
              return tt / (k.length - 1);
            }), Q = k.map(function(K) {
              return (K - C) / (R - C);
            });
            Q.every(function(K, tt) {
              return H[tt] === K;
            }) || (yt = function(K) {
              if (K <= 0 || K >= 1)
                return K;
              for (var tt = 0; K >= Q[tt + 1]; )
                tt++;
              var Nt = (K - Q[tt]) / (Q[tt + 1] - Q[tt]), ge = H[tt] + Nt * (H[tt + 1] - H[tt]);
              return ge;
            });
          }
        }
        return d = [C, R], G;
      }, G.mode = function(k) {
        return arguments.length ? (o = k, Lt(), G) : o;
      }, G.range = function(k, F) {
        return q(k), G;
      }, G.out = function(k) {
        return w = k, G;
      }, G.spread = function(k) {
        return arguments.length ? (c = k, G) : c;
      }, G.correctLightness = function(k) {
        return k == null && (k = !0), S = k, Lt(), S ? V = function(F) {
          for (var U = mt(0, !0).lab()[0], W = mt(1, !0).lab()[0], wt = U > W, nt = mt(F, !0).lab()[0], H = U + (W - U) * F, Q = nt - H, K = 0, tt = 1, Nt = 20; Math.abs(Q) > 0.01 && Nt-- > 0; )
            (function() {
              return wt && (Q *= -1), Q < 0 ? (K = F, F += (tt - F) * 0.5) : (tt = F, F += (K - F) * 0.5), nt = mt(F, !0).lab()[0], Q = nt - H;
            })();
          return F;
        } : V = function(F) {
          return F;
        }, G;
      }, G.padding = function(k) {
        return k != null ? (Ve(k) === "number" && (k = [k, k]), f = k, G) : f;
      }, G.colors = function(k, F) {
        arguments.length < 2 && (F = "hex");
        var U = [];
        if (arguments.length === 0)
          U = b.slice(0);
        else if (k === 1)
          U = [G(0.5)];
        else if (k > 1) {
          var W = d[0], wt = d[1] - W;
          U = Ih(0, k).map(function(tt) {
            return G(W + tt / (k - 1) * wt);
          });
        } else {
          s = [];
          var nt = [];
          if (m && m.length > 2)
            for (var H = 1, Q = m.length, K = 1 <= Q; K ? H < Q : H > Q; K ? H++ : H--)
              nt.push((m[H - 1] + m[H]) * 0.5);
          else
            nt = d;
          U = nt.map(function(tt) {
            return G(tt);
          });
        }
        return Dt[F] && (U = U.map(function(tt) {
          return tt[F]();
        })), U;
      }, G.cache = function(k) {
        return k != null ? (L = k, G) : L;
      }, G.gamma = function(k) {
        return k != null ? (N = k, G) : N;
      }, G.nodata = function(k) {
        return k != null ? (h = Dt(k), G) : h;
      }, G;
    };
    function Ih(s, o, h) {
      for (var c = [], d = s < o, p = o, f = s; d ? f < p : f > p; d ? f++ : f--)
        c.push(f);
      return c;
    }
    var ir = _, Eh = mn, _h = function(s) {
      for (var o = [1, 1], h = 1; h < s; h++) {
        for (var c = [1], d = 1; d <= o.length; d++)
          c[d] = (o[d] || 0) + o[d - 1];
        o = c;
      }
      return o;
    }, jh = function(s) {
      var o, h, c, d, p, f, m;
      if (s = s.map(function(S) {
        return new ir(S);
      }), s.length === 2)
        o = s.map(function(S) {
          return S.lab();
        }), p = o[0], f = o[1], d = function(S) {
          var M = [0, 1, 2].map(function(L) {
            return p[L] + S * (f[L] - p[L]);
          });
          return new ir(M, "lab");
        };
      else if (s.length === 3)
        h = s.map(function(S) {
          return S.lab();
        }), p = h[0], f = h[1], m = h[2], d = function(S) {
          var M = [0, 1, 2].map(function(L) {
            return (1 - S) * (1 - S) * p[L] + 2 * (1 - S) * S * f[L] + S * S * m[L];
          });
          return new ir(M, "lab");
        };
      else if (s.length === 4) {
        var b;
        c = s.map(function(S) {
          return S.lab();
        }), p = c[0], f = c[1], m = c[2], b = c[3], d = function(S) {
          var M = [0, 1, 2].map(function(L) {
            return (1 - S) * (1 - S) * (1 - S) * p[L] + 3 * (1 - S) * (1 - S) * S * f[L] + 3 * (1 - S) * S * S * m[L] + S * S * S * b[L];
          });
          return new ir(M, "lab");
        };
      } else if (s.length >= 5) {
        var w, C, R;
        w = s.map(function(S) {
          return S.lab();
        }), R = s.length - 1, C = _h(R), d = function(S) {
          var M = 1 - S, L = [0, 1, 2].map(function(N) {
            return w.reduce(function(q, X, V) {
              return q + C[V] * Math.pow(M, R - V) * Math.pow(S, V) * X[N];
            }, 0);
          });
          return new ir(L, "lab");
        };
      } else
        throw new RangeError("No point in running bezier with only one color.");
      return d;
    }, Dh = function(s) {
      var o = jh(s);
      return o.scale = function() {
        return Eh(o);
      }, o;
    }, bn = at, Bt = function(s, o, h) {
      if (!Bt[h])
        throw new Error("unknown blend mode " + h);
      return Bt[h](s, o);
    }, de = function(s) {
      return function(o, h) {
        var c = bn(h).rgb(), d = bn(o).rgb();
        return bn.rgb(s(c, d));
      };
    }, pe = function(s) {
      return function(o, h) {
        var c = [];
        return c[0] = s(o[0], h[0]), c[1] = s(o[1], h[1]), c[2] = s(o[2], h[2]), c;
      };
    }, Bh = function(s) {
      return s;
    }, Nh = function(s, o) {
      return s * o / 255;
    }, Wh = function(s, o) {
      return s > o ? o : s;
    }, Uh = function(s, o) {
      return s > o ? s : o;
    }, qh = function(s, o) {
      return 255 * (1 - (1 - s / 255) * (1 - o / 255));
    }, Gh = function(s, o) {
      return o < 128 ? 2 * s * o / 255 : 255 * (1 - 2 * (1 - s / 255) * (1 - o / 255));
    }, Xh = function(s, o) {
      return 255 * (1 - (1 - o / 255) / (s / 255));
    }, Hh = function(s, o) {
      return s === 255 ? 255 : (s = 255 * (o / 255) / (1 - s / 255), s > 255 ? 255 : s);
    };
    Bt.normal = de(pe(Bh)), Bt.multiply = de(pe(Nh)), Bt.screen = de(pe(qh)), Bt.overlay = de(pe(Gh)), Bt.darken = de(pe(Wh)), Bt.lighten = de(pe(Uh)), Bt.dodge = de(pe(Hh)), Bt.burn = de(pe(Xh));
    for (var Yh = Bt, yn = T.type, Zh = T.clip_rgb, Vh = T.TWOPI, Jh = Math.pow, Qh = Math.sin, Kh = Math.cos, ai = at, tc = function(s, o, h, c, d) {
      s === void 0 && (s = 300), o === void 0 && (o = -1.5), h === void 0 && (h = 1), c === void 0 && (c = 1), d === void 0 && (d = [0, 1]);
      var p = 0, f;
      yn(d) === "array" ? f = d[1] - d[0] : (f = 0, d = [d, d]);
      var m = function(b) {
        var w = Vh * ((s + 120) / 360 + o * b), C = Jh(d[0] + f * b, c), R = p !== 0 ? h[0] + b * p : h, S = R * C * (1 - C) / 2, M = Kh(w), L = Qh(w), N = C + S * (-0.14861 * M + 1.78277 * L), q = C + S * (-0.29227 * M - 0.90649 * L), X = C + S * (1.97294 * M);
        return ai(Zh([N * 255, q * 255, X * 255, 1]));
      };
      return m.start = function(b) {
        return b == null ? s : (s = b, m);
      }, m.rotations = function(b) {
        return b == null ? o : (o = b, m);
      }, m.gamma = function(b) {
        return b == null ? c : (c = b, m);
      }, m.hue = function(b) {
        return b == null ? h : (h = b, yn(h) === "array" ? (p = h[1] - h[0], p === 0 && (h = h[1])) : p = 0, m);
      }, m.lightness = function(b) {
        return b == null ? d : (yn(b) === "array" ? (d = b, f = b[1] - b[0]) : (d = [b, b], f = 0), m);
      }, m.scale = function() {
        return ai.scale(m);
      }, m.hue(h), m;
    }, ec = _, rc = "0123456789abcdef", nc = Math.floor, sc = Math.random, ic = function() {
      for (var s = "#", o = 0; o < 6; o++)
        s += rc.charAt(nc(sc() * 16));
      return new ec(s, "hex");
    }, wn = y, oi = Math.log, ac = Math.pow, oc = Math.floor, lc = Math.abs, li = function(s, o) {
      o === void 0 && (o = null);
      var h = {
        min: Number.MAX_VALUE,
        max: Number.MAX_VALUE * -1,
        sum: 0,
        values: [],
        count: 0
      };
      return wn(s) === "object" && (s = Object.values(s)), s.forEach(function(c) {
        o && wn(c) === "object" && (c = c[o]), c != null && !isNaN(c) && (h.values.push(c), h.sum += c, c < h.min && (h.min = c), c > h.max && (h.max = c), h.count += 1);
      }), h.domain = [h.min, h.max], h.limits = function(c, d) {
        return hi(h, c, d);
      }, h;
    }, hi = function(s, o, h) {
      o === void 0 && (o = "equal"), h === void 0 && (h = 7), wn(s) == "array" && (s = li(s));
      var c = s.min, d = s.max, p = s.values.sort(function(Cn, Sn) {
        return Cn - Sn;
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
        var b = Math.LOG10E * oi(c), w = Math.LOG10E * oi(d);
        f.push(c);
        for (var C = 1; C < h; C++)
          f.push(ac(10, b + C / h * (w - b)));
        f.push(d);
      } else if (o.substr(0, 1) === "q") {
        f.push(c);
        for (var R = 1; R < h; R++) {
          var S = (p.length - 1) * R / h, M = oc(S);
          if (M === S)
            f.push(p[M]);
          else {
            var L = S - M;
            f.push(p[M] * (1 - L) + p[M + 1] * L);
          }
        }
        f.push(d);
      } else if (o.substr(0, 1) === "k") {
        var N, q = p.length, X = new Array(q), V = new Array(h), yt = !0, mt = 0, Lt = null;
        Lt = [], Lt.push(c);
        for (var G = 1; G < h; G++)
          Lt.push(c + G / h * (d - c));
        for (Lt.push(d); yt; ) {
          for (var k = 0; k < h; k++)
            V[k] = 0;
          for (var F = 0; F < q; F++)
            for (var U = p[F], W = Number.MAX_VALUE, wt = void 0, nt = 0; nt < h; nt++) {
              var H = lc(Lt[nt] - U);
              H < W && (W = H, wt = nt), V[wt]++, X[F] = wt;
            }
          for (var Q = new Array(h), K = 0; K < h; K++)
            Q[K] = null;
          for (var tt = 0; tt < q; tt++)
            N = X[tt], Q[N] === null ? Q[N] = p[tt] : Q[N] += p[tt];
          for (var Nt = 0; Nt < h; Nt++)
            Q[Nt] *= 1 / V[Nt];
          yt = !1;
          for (var ge = 0; ge < h; ge++)
            if (Q[ge] !== Lt[ge]) {
              yt = !0;
              break;
            }
          Lt = Q, mt++, mt > 200 && (yt = !1);
        }
        for (var ve = {}, Je = 0; Je < h; Je++)
          ve[Je] = [];
        for (var Qe = 0; Qe < q; Qe++)
          N = X[Qe], ve[N].push(p[Qe]);
        for (var ne = [], Me = 0; Me < h; Me++)
          ne.push(ve[Me][0]), ne.push(ve[Me][ve[Me].length - 1]);
        ne = ne.sort(function(Cn, Sn) {
          return Cn - Sn;
        }), f.push(ne[0]);
        for (var ar = 1; ar < ne.length; ar += 2) {
          var $e = ne[ar];
          !isNaN($e) && f.indexOf($e) === -1 && f.push($e);
        }
      }
      return f;
    }, ci = { analyze: li, limits: hi }, ui = _, hc = function(s, o) {
      s = new ui(s), o = new ui(o);
      var h = s.luminance(), c = o.luminance();
      return h > c ? (h + 0.05) / (c + 0.05) : (c + 0.05) / (h + 0.05);
    }, fi = _, re = Math.sqrt, ut = Math.pow, cc = Math.min, uc = Math.max, di = Math.atan2, pi = Math.abs, $r = Math.cos, gi = Math.sin, fc = Math.exp, vi = Math.PI, dc = function(s, o, h, c, d) {
      h === void 0 && (h = 1), c === void 0 && (c = 1), d === void 0 && (d = 1);
      var p = function($e) {
        return 360 * $e / (2 * vi);
      }, f = function($e) {
        return 2 * vi * $e / 360;
      };
      s = new fi(s), o = new fi(o);
      var m = Array.from(s.lab()), b = m[0], w = m[1], C = m[2], R = Array.from(o.lab()), S = R[0], M = R[1], L = R[2], N = (b + S) / 2, q = re(ut(w, 2) + ut(C, 2)), X = re(ut(M, 2) + ut(L, 2)), V = (q + X) / 2, yt = 0.5 * (1 - re(ut(V, 7) / (ut(V, 7) + ut(25, 7)))), mt = w * (1 + yt), Lt = M * (1 + yt), G = re(ut(mt, 2) + ut(C, 2)), k = re(ut(Lt, 2) + ut(L, 2)), F = (G + k) / 2, U = p(di(C, mt)), W = p(di(L, Lt)), wt = U >= 0 ? U : U + 360, nt = W >= 0 ? W : W + 360, H = pi(wt - nt) > 180 ? (wt + nt + 360) / 2 : (wt + nt) / 2, Q = 1 - 0.17 * $r(f(H - 30)) + 0.24 * $r(f(2 * H)) + 0.32 * $r(f(3 * H + 6)) - 0.2 * $r(f(4 * H - 63)), K = nt - wt;
      K = pi(K) <= 180 ? K : nt <= wt ? K + 360 : K - 360, K = 2 * re(G * k) * gi(f(K) / 2);
      var tt = S - b, Nt = k - G, ge = 1 + 0.015 * ut(N - 50, 2) / re(20 + ut(N - 50, 2)), ve = 1 + 0.045 * F, Je = 1 + 0.015 * F * Q, Qe = 30 * fc(-ut((H - 275) / 25, 2)), ne = 2 * re(ut(F, 7) / (ut(F, 7) + ut(25, 7))), Me = -ne * gi(2 * f(Qe)), ar = re(ut(tt / (h * ge), 2) + ut(Nt / (c * ve), 2) + ut(K / (d * Je), 2) + Me * (Nt / (c * ve)) * (K / (d * Je)));
      return uc(0, cc(100, ar));
    }, mi = _, pc = function(s, o, h) {
      h === void 0 && (h = "lab"), s = new mi(s), o = new mi(o);
      var c = s.get(h), d = o.get(h), p = 0;
      for (var f in c) {
        var m = (c[f] || 0) - (d[f] || 0);
        p += m * m;
      }
      return Math.sqrt(p);
    }, gc = _, vc = function() {
      for (var s = [], o = arguments.length; o--; ) s[o] = arguments[o];
      try {
        return new (Function.prototype.bind.apply(gc, [null].concat(s)))(), !0;
      } catch {
        return !1;
      }
    }, bi = at, yi = mn, mc = {
      cool: function() {
        return yi([bi.hsl(180, 1, 0.9), bi.hsl(250, 0.7, 0.4)]);
      },
      hot: function() {
        return yi(["#000", "#f00", "#ff0", "#fff"]).mode("rgb");
      }
    }, zr = {
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
    }, xn = 0, wi = Object.keys(zr); xn < wi.length; xn += 1) {
      var xi = wi[xn];
      zr[xi.toLowerCase()] = zr[xi];
    }
    var bc = zr, vt = at;
    vt.average = Ah, vt.bezier = Dh, vt.blend = Yh, vt.cubehelix = tc, vt.mix = vt.interpolate = Js, vt.random = ic, vt.scale = mn, vt.analyze = ci.analyze, vt.contrast = hc, vt.deltaE = dc, vt.distance = pc, vt.limits = ci.limits, vt.valid = vc, vt.scales = mc, vt.colors = Os, vt.brewer = bc;
    var yc = vt;
    return yc;
  });
})(Xi);
var it = Xi.exports;
const Se = (it.Color.symbol = it.Color.prototype.symbol = Symbol.for("@motion-canvas/core/types/Color"), it.Color.lerp = it.Color.prototype.lerp = (n, t, e, r = "lch") => {
  typeof n == "string" && (n = new it.Color(n)), typeof t == "string" && (t = new it.Color(t));
  const i = n instanceof it.Color, a = t instanceof it.Color;
  return i || (n = a ? t.alpha(0) : new it.Color("rgba(0, 0, 0, 0)")), a || (t = i ? n.alpha(0) : new it.Color("rgba(0, 0, 0, 0)")), it.mix(n, t, e, r);
}, it.Color.createLerp = it.Color.prototype.createLerp = (n) => (t, e, r) => it.Color.lerp(t, e, r, n), it.Color.createSignal = (n, t = it.Color.lerp) => new Ee(n, t, void 0, (e) => new it.Color(e)).toSignal(), it.Color.prototype.toSymbol = () => it.Color.symbol, it.Color.prototype.toUniform = function(n, t) {
  n.uniform4fv(t, this.gl());
}, it.Color.prototype.serialize = function() {
  return this.css();
}, it.Color.prototype.lerp = function(n, t, e) {
  return it.Color.lerp(this, n, t, e);
}, it.Color);
function cu(n, t) {
  return v.fromDegrees(n).transform(t).degrees;
}
function Ln(n, t) {
  return v.magnitude(t.m11, t.m12) * n;
}
class Mn extends Ft {
  constructor() {
    super(...arguments), this.type = Se.symbol;
  }
  parse(t) {
    return t === null ? null : new Se(t);
  }
  serialize() {
    var t;
    return ((t = this.value.current) == null ? void 0 : t.serialize()) ?? null;
  }
}
class Ie extends Ft {
  constructor(t, e, r = ((i) => (i = e[0]) == null ? void 0 : i.value)()) {
    super(t, r), this.options = e, this.type = Ie.symbol;
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
Ie.symbol = Symbol.for("@motion-canvas/core/meta/EnumMetaField");
class uu extends Ft {
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
      var x;
      return ((x = y.exporters) == null ? void 0 : x.call(y, e)) ?? [];
    }), a = i.map((y) => y.meta(e)), l = new Ie("exporter", i.map((y) => ({
      value: y.id,
      text: y.displayName
    })), (u = i[r]) == null ? void 0 : u.id);
    super(t, {
      name: l.get(),
      options: (g = a[r]) == null ? void 0 : g.get()
    }), this.current = r, this.type = Object, this.handleChange = () => {
      var A, j, Y;
      const y = this.exporterField.get(), x = Math.max(this.exporters.findIndex((rt) => rt.id === y), 0);
      this.current !== x && ((A = this.options) == null || A.onChanged.unsubscribe(this.handleChange), this.current = x, (j = this.options) == null || j.onChanged.subscribe(this.handleChange, !1), this.fields.current = this.options ? [this.exporterField, this.options] : [this.exporterField]), this.value.current = {
        name: this.exporterField.get(),
        options: ((Y = this.options) == null ? void 0 : Y.get()) ?? null
      };
    }, this.exporters = i, this.exporterField = l, this.exporterField.onChanged.subscribe(this.handleChange, !1), this.exporterField.disable(a.length < 2).space(), this.optionFields = a, this.fields = new Ce([this.exporterField]), this.options && (this.options.onChanged.subscribe(this.handleChange, !1), this.fields.current = [this.exporterField, this.options]);
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
var lr;
class dr {
  constructor(t, e = !1) {
    this.name = t, this.source = e, this.lock = new Sc(), this.ignoreChange = !1, this.cache = null, this.metaField = null, this.handleChanged = async () => {
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
    if (lr.sourceLookup[this.source])
      throw new Error(`Metadata for ${this.name} is already being updated`);
    const e = this.source;
    await new Promise((r, i) => {
      setTimeout(() => {
        delete lr.sourceLookup[e], i(`Connection timeout when updating metadata for ${this.name}`);
      }, 1e3), lr.sourceLookup[e] = () => {
        delete lr.sourceLookup[e], r();
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
lr = dr;
dr.sourceLookup = {};
class Tn extends Ft {
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
class Ur extends Ft {
  constructor() {
    super(...arguments), this.type = Ur.symbol;
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
    this.value.current = this.parseRange(r / i - hr, t / i - hr, e / i - hr);
  }
  parseRange(t, e = this.value.current[0], r = this.value.current[1]) {
    return e = Rt(0, t, e), r = Rt(0, t, r ?? 1 / 0), e > r && ([e, r] = [r, e]), r >= t && (r = 1 / 0), [e, r];
  }
}
Ur.symbol = Symbol.for("@motion-canvas/core/meta/RangeMetaField");
class Hi extends Ft {
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
let jn;
jn ?? (jn = new dr("_build_project", !1));
jn.loadData({
  version: 0
});
const fu = jn;
let Dn;
Dn ?? (Dn = new dr("scene", !1));
Dn.loadData({
  version: 0
});
const du = Dn;
function pu(n) {
  var t;
  return !!((t = n.prototype) != null && t.isClass);
}
const Yi = Symbol.for("@motion-canvas/2d/fragment");
function Tt(n, t, e) {
  const { ref: r, children: i, ...a } = t, l = Array.isArray(i) ? i.flat() : i;
  if (n === Yi)
    return l;
  if (pu(n)) {
    const u = new n({ ...a, children: l, key: e });
    return r == null || r(u), u;
  } else
    return n({ ...a, ref: r, children: l, key: e });
}
const Ai = {
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
    }, this.value = _e(this.props.value, st, this);
  }
  isActive() {
    return this.value() !== this.props.default;
  }
  serialize(t) {
    let e = this.value();
    return this.props.transform && (e = Ln(e, t)), `${this.props.name}(${e * this.props.scale}${this.props.unit})`;
  }
}
const ie = Symbol.for("@motion-canvas/2d/decorators/initializers");
function pr(n, t) {
  if (!n[ie])
    n[ie] = [];
  else if (
    // if one of the prototypes has initializers
    n[ie] && // and it's not the target object itself
    !Object.prototype.hasOwnProperty.call(n, ie)
  ) {
    const e = Object.getPrototypeOf(n);
    n[ie] = [...e[ie]];
  }
  n[ie].push(t);
}
function vu(n, t) {
  if (n[ie])
    try {
      n[ie].forEach((e) => e(n, t));
    } catch (e) {
      throw e.inspect ?? (e.inspect = n.key), e;
    }
}
function E() {
  return (n, t) => {
    pr(n, (e) => {
      const r = Object.getPrototypeOf(e)[t];
      e[t] = ou(r.bind(e), e);
    });
  };
}
function $n(n = {}, t, e) {
  const r = {};
  if (e && t) {
    const i = n.setter ?? (t == null ? void 0 : t[`set${Oe(e)}`]);
    i && (r.setter = i.bind(t));
    const a = n.getter ?? (t == null ? void 0 : t[`get${Oe(e)}`]);
    a && (r.getter = a.bind(t));
    const l = n.tweener ?? (t == null ? void 0 : t[`tween${Oe(e)}`]);
    l && (r.tweener = l.bind(t));
  }
  return r;
}
const ae = Symbol.for("@motion-canvas/2d/decorators/properties");
function je(n, t) {
  var e;
  return ((e = n[ae]) == null ? void 0 : e[t]) ?? null;
}
function Bn(n, t) {
  let e;
  return n[ae] ? n[ae] && !Object.prototype.hasOwnProperty.call(n, ae) ? n[ae] = e = Object.fromEntries(Object.entries(n[ae]).map(([r, i]) => [r, { ...i }])) : e = n[ae] : n[ae] = e = {}, e[t] ?? (e[t] = {
    cloneable: !0,
    inspectable: !0,
    compoundEntries: []
  }), e[t];
}
function Zi(n) {
  return n && typeof n == "object" ? n[ae] ?? {} : {};
}
function Nn(n, t) {
  vu(n);
  for (const [e, r] of Object.entries(Zi(n))) {
    const i = n[e];
    if (i.reset(), t[e] !== void 0 && i(t[e]), r.compoundEntries !== void 0)
      for (const [a, l] of r.compoundEntries)
        l in t && i[a](t[l]);
  }
}
function P() {
  return (n, t) => {
    const e = Bn(n, t);
    pr(n, (r) => {
      var u;
      let i = e.default;
      const a = r[`getDefault${Oe(t)}`];
      a && (i = () => a.call(r, e.default));
      const l = new Ee(i, e.interpolationFunction ?? rr, r, (u = e.parser) == null ? void 0 : u.bind(r), $n(e, r, t));
      r[t] = l.toSignal();
    });
  };
}
function z(n) {
  return (t, e) => {
    const r = je(t, e);
    if (!r) {
      Ct().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.default = n;
  };
}
function Wn(n) {
  return (t, e) => {
    const r = je(t, e);
    if (!r) {
      Ct().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.interpolationFunction = n;
  };
}
function Un(n) {
  return (t, e) => {
    const r = je(t, e);
    if (!r) {
      Ct().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.parser = n;
  };
}
function gr(n) {
  return (t, e) => {
    const r = je(t, e);
    if (!r) {
      Ct().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.parser = (i) => new n(i), "lerp" in n && (r.interpolationFunction ?? (r.interpolationFunction = n.lerp));
  };
}
function De(n = !0) {
  return (t, e) => {
    const r = je(t, e);
    if (!r) {
      Ct().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.cloneable = n;
  };
}
function Vi(n = !0) {
  return (t, e) => {
    const r = je(t, e);
    if (!r) {
      Ct().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.inspectable = n;
  };
}
function Ji(n, t = Wr) {
  return (e, r) => {
    const i = Bn(e, r);
    i.compound = !0, i.compoundEntries = Object.entries(n), pr(e, (a) => {
      if (!i.parser) {
        Ct().error(`Missing parser decorator for "${r.toString()}"`);
        return;
      }
      const l = i.default, u = i.parser.bind(a), g = new t(i.compoundEntries.map(([y, x]) => {
        const A = new Ee(Fe(l, (j) => u(j)[y]), st, a, void 0, $n(void 0, a, x)).toSignal();
        return [y, A];
      }), u, l, i.interpolationFunction ?? rr, a, $n(i, a, r));
      a[r] = g.toSignal();
    });
  };
}
function ce(n) {
  return (t, e) => {
    Ji(typeof n == "object" ? n : {
      x: n ? `${n}X` : "x",
      y: n ? `${n}Y` : "y"
    }, Gi)(t, e), gr(v)(t, e);
  };
}
var Te = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
class Kt {
  constructor(t) {
    Nn(this, t);
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
      e.addColorStop(Qt(r), new Se(Qt(i)).serialize());
    return e;
  }
}
Te([
  z("linear"),
  P()
], Kt.prototype, "type", void 0);
Te([
  ce("from")
], Kt.prototype, "from", void 0);
Te([
  ce("to")
], Kt.prototype, "to", void 0);
Te([
  z(0),
  P()
], Kt.prototype, "angle", void 0);
Te([
  z(0),
  P()
], Kt.prototype, "fromRadius", void 0);
Te([
  z(0),
  P()
], Kt.prototype, "toRadius", void 0);
Te([
  z([]),
  P()
], Kt.prototype, "stops", void 0);
Te([
  E()
], Kt.prototype, "canvasGradient", null);
var qn = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
class vr {
  constructor(t) {
    Nn(this, t);
  }
  canvasPattern(t) {
    return t.createPattern(this.image(), this.repetition());
  }
}
qn([
  P()
], vr.prototype, "image", void 0);
qn([
  z(null),
  P()
], vr.prototype, "repetition", void 0);
qn([
  E()
], vr.prototype, "canvasPattern", null);
function mu(n) {
  return n === null ? null : n instanceof Kt || n instanceof vr ? n : new Se(n);
}
function zn(n, t) {
  return n === null ? "" : n instanceof Se ? n.serialize() : n instanceof Kt ? n.canvasGradient(t) : n instanceof vr ? n.canvasPattern(t) ?? "" : "";
}
function Oi(n, t, e, r, i) {
  if (e.top === 0 && e.right === 0 && e.bottom === 0 && e.left === 0) {
    bu(n, t);
    return;
  }
  const a = we(e.top, e.right, e.left, t), l = we(e.right, e.top, e.bottom, t), u = we(e.bottom, e.left, e.right, t), g = we(e.left, e.bottom, e.top, t);
  if (r) {
    const y = (x) => {
      const A = x * i;
      return x - A;
    };
    n.moveTo(t.left + a, t.top), n.lineTo(t.right - l, t.top), n.bezierCurveTo(t.right - y(l), t.top, t.right, t.top + y(l), t.right, t.top + l), n.lineTo(t.right, t.bottom - u), n.bezierCurveTo(t.right, t.bottom - y(u), t.right - y(u), t.bottom, t.right - u, t.bottom), n.lineTo(t.left + g, t.bottom), n.bezierCurveTo(t.left + y(g), t.bottom, t.left, t.bottom - y(g), t.left, t.bottom - g), n.lineTo(t.left, t.top + a), n.bezierCurveTo(t.left, t.top + y(a), t.left + y(a), t.top, t.left + a, t.top);
    return;
  }
  n.moveTo(t.left + a, t.top), n.arcTo(t.right, t.top, t.right, t.bottom, l), n.arcTo(t.right, t.bottom, t.left, t.bottom, u), n.arcTo(t.left, t.bottom, t.left, t.top, g), n.arcTo(t.left, t.top, t.right, t.top, a);
}
function we(n, t, e, r) {
  const i = n + t > r.width ? r.width * (n / (n + t)) : n, a = n + e > r.height ? r.height * (n / (n + e)) : n;
  return Math.min(i, a);
}
function bu(n, t) {
  n.rect(t.x, t.y, t.width, t.height);
}
function mr(n, t) {
  n.moveTo(t.x, t.y);
}
function Jt(n, t) {
  n.lineTo(t.x, t.y);
}
function be(n, t) {
  if (!(t.length < 2)) {
    mr(n, t[0]);
    for (const e of t.slice(1))
      Jt(n, e);
  }
}
function Qi(n, t, e = 8) {
  Jt(n, t.addY(-e)), Jt(n, t.addY(e)), Jt(n, t), Jt(n, t.addX(-e)), Ki(n, t, e);
}
function Ki(n, t, e, r = 0, i = Math.PI * 2, a = !1) {
  n.arc(t.x, t.y, e, r, i, a);
}
function yu(n, t, e, r) {
  n.bezierCurveTo(t.x, t.y, e.x, e.y, r.x, r.y);
}
function Gn(n) {
  return (t) => t instanceof n;
}
function ta() {
  return (n, t) => {
    P()(n, t), Un(mu)(n, t), Wn(Se.lerp)(n, t), z(null)(n, t);
  };
}
function wu() {
  return (n, t) => {
    P()(n, t), gr(Se)(n, t);
  };
}
function Pe(n, t = (e) => e) {
  return (e, r) => {
    e[`getDefault${Oe(r)}`] = function() {
      this.requestLayoutUpdate();
      const i = this.element.style[n];
      this.element.style[n] = "";
      const a = t.call(this, this.styles.getPropertyValue(n));
      return this.element.style[n] = i, a;
    };
  };
}
class xu extends Ee {
  constructor(t, e) {
    super(t, rr, e);
    for (const r in Ai) {
      const i = Ai[r];
      Object.defineProperty(this.invokable, r, {
        value: (a, l, u = Yt) => {
          var y, x, A;
          if (a === void 0)
            return ((x = (y = this.get()) == null ? void 0 : y.find((j) => j.name === i.name)) == null ? void 0 : x.value()) ?? i.default ?? 0;
          let g = (A = this.get()) == null ? void 0 : A.find((j) => j.name === i.name);
          return g || (g = new gu(i), this.set([...this.get(), g])), l === void 0 ? (g.value(a), this.owner) : g.value(a, l, u);
        }
      });
    }
  }
  *tweener(t, e, r) {
    const i = this.get(), a = Qt(t);
    if (Su(i, a)) {
      yield* oe(...i.map((g, y) => g.value(a[y].value(), e, r))), this.set(a);
      return;
    }
    for (const g of a)
      g.value(g.default);
    const l = a.map((g) => g.value.context.raw()), u = i.length > 0 && a.length > 0 ? e / 2 : e;
    i.length > 0 && (yield* oe(...i.map((g) => g.value(g.default, u, r)))), this.set(a), a.length > 0 && (yield* oe(...a.map((g, y) => g.value(l[y], u, r))));
  }
}
function Cu() {
  return (n, t) => {
    const e = Bn(n, t);
    pr(n, (r) => {
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
function ue(n) {
  return function(t) {
    t.prototype[ku] = n;
  };
}
function Fi(n, t) {
  const e = Rt(0, n.arcLength, t);
  let r = 0;
  for (const i of n.segments) {
    const a = r;
    if (r += i.arcLength, r >= e) {
      const l = (e - a) / i.arcLength;
      return i.getPoint(Rt(0, 1, l));
    }
  }
  return { position: v.zero, tangent: v.up, normal: v.up };
}
function qr(n) {
  return (t, e) => {
    Ji({
      top: n ? `${n}Top` : "top",
      right: n ? `${n}Right` : "right",
      bottom: n ? `${n}Bottom` : "bottom",
      left: n ? `${n}Left` : "left"
    })(t, e), gr(qt)(t, e);
  };
}
function Tu(n) {
  let t;
  return n ? typeof n == "string" ? t = [{ fragment: n }] : Array.isArray(n) ? t = n.map((e) => typeof e == "string" ? { fragment: e } : e) : t = [n] : t = [], !Fn().experimentalFeatures && t.length > 0 && (t = [], Ct().log({
    ...Fc("Node uses experimental shaders."),
    inspect: this.key
  })), t;
}
function Or() {
  return Fn();
}
var D = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, Fr;
let I = Fr = class {
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
    this.position(Fe(t, (e) => new v(e).transformAsPoint(this.worldToParent())));
  }
  getAbsoluteRotation() {
    const t = this.localToWorld();
    return v.degrees(t.m11, t.m12);
  }
  setAbsoluteRotation(t) {
    this.rotation(Fe(t, (e) => cu(e, this.worldToParent())));
  }
  getAbsoluteScale() {
    const t = this.localToWorld();
    return new v(v.magnitude(t.m11, t.m12), v.magnitude(t.m21, t.m22));
  }
  setAbsoluteScale(t) {
    this.scale(Fe(t, (e) => this.getRelativeScale(new v(e))));
  }
  getRelativeScale(t) {
    var r;
    const e = ((r = this.parent()) == null ? void 0 : r.absoluteScale()) ?? v.one;
    return t.div(e);
  }
  *tweenCompositeOperation(t, e, r) {
    const i = Qt(t);
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
      if (this.children.context.setter(t), !le(t))
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
    return le(this.children.context.raw()) && this.spawnChildren(!0, t), this.realChildren;
  }
  sortedChildren() {
    return [...this.children()].sort((t, e) => Math.sign(t.zIndex() - e.zIndex()));
  }
  constructor({ children: t, spawner: e, key: r, ...i }) {
    this.compositeOverride = _e(0), this.stateStack = [], this.realChildren = [], this.hasSpawnedChildren = !1, this.parent = _e(null), this.properties = Zi(this);
    const a = Or();
    [this.key, this.unregister] = a.registerNode(this, r), this.view2D = a.getView(), this.creationStack = new Error().stack, Nn(this, i), e && Ct().warn({
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
      l instanceof Fr && (a.push(l), l.remove(), l.parent(this));
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
      return Ct().error("Cannot position nodes relative to each other if they don't belong to the same parent."), this;
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
      return Ct().error("Cannot position nodes relative to each other if they don't belong to the same parent."), this;
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
    le(this.children.context.raw()) ? e.children ?? (e.children = this.children.context.raw()) : this.children().length > 0 && (e.children ?? (e.children = this.children().map((r) => r.clone())));
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
      i instanceof Fr && e.push(i);
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
    const t = this.compositeToLocal(), e = this.shadowOffset().transform(t), r = Ln(this.shadowBlur(), t), i = this.cacheBBox().expand(this.filters.blur() * 2 + r);
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
    return ((t = this.findAncestor((e) => e.requiresCache())) == null ? void 0 : t.worldSpaceCacheBBox()) ?? new Z(v.zero, Or().getRealSize());
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
      const r = this.compositeToWorld(), i = this.shadowOffset().transform(r), a = Ln(this.shadowBlur(), r);
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
    var A, j;
    const r = this.shaders();
    if (r.length === 0)
      return null;
    const i = Or(), a = i.getRealSize(), l = this.parentWorldSpaceCacheBBox(), u = new DOMMatrix().scaleSelf(a.width / l.width, a.height / -l.height).translateSelf(l.x / -a.width, l.y / a.height - 1), g = this.worldSpaceCacheBBox(), y = new DOMMatrix().scaleSelf(a.width / g.width, a.height / -g.height).translateSelf(g.x / -a.width, g.y / a.height - 1).invertSelf(), x = i.shaders.getGL();
    i.shaders.copyTextures(t, e), i.shaders.clear();
    for (const Y of r) {
      const rt = i.shaders.getProgram(Y.fragment);
      if (rt) {
        if (Y.uniforms)
          for (const [T, J] of Object.entries(Y.uniforms)) {
            const pt = x.getUniformLocation(rt, T);
            if (pt === null)
              continue;
            const et = Qt(J);
            typeof et == "number" ? x.uniform1f(pt, et) : "toUniform" in et ? et.toUniform(x, pt) : et.length === 1 ? x.uniform1f(pt, et[0]) : et.length === 2 ? x.uniform2f(pt, et[0], et[1]) : et.length === 3 ? x.uniform3f(pt, et[0], et[1], et[2]) : et.length === 4 && x.uniform4f(pt, et[0], et[1], et[2], et[3]);
          }
        x.uniform1f(x.getUniformLocation(rt, $i), this.view2D.globalTime()), x.uniform1i(x.getUniformLocation(rt, $i), i.playback.frame), x.uniformMatrix4fv(x.getUniformLocation(rt, Yc), !1, y.toFloat32Array()), x.uniformMatrix4fv(x.getUniformLocation(rt, Zc), !1, u.toFloat32Array()), (A = Y.setup) == null || A.call(Y, x, rt), i.shaders.render(), (j = Y.teardown) == null || j.call(Y, x, rt);
      }
    }
    return x.canvas;
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
    t.strokeStyle = "white", t.lineWidth = 1, t.beginPath(), be(t, r), t.closePath(), t.stroke(), t.strokeStyle = "blue", t.beginPath(), be(t, i), t.closePath(), t.stroke();
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
      await dt.consumePromises(), this.collectAsyncResources();
    while (dt.hasPromises());
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
  applyState(t, e, r = Yt) {
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
    return oe(...i);
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
  restore(t, e = Yt) {
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
  ce()
], I.prototype, "position", void 0);
D([
  gr(v),
  De(!1),
  P()
], I.prototype, "absolutePosition", void 0);
D([
  z(0),
  P()
], I.prototype, "rotation", void 0);
D([
  De(!1),
  P()
], I.prototype, "absoluteRotation", void 0);
D([
  z(v.one),
  ce("scale")
], I.prototype, "scale", void 0);
D([
  z(v.zero),
  ce("skew")
], I.prototype, "skew", void 0);
D([
  gr(v),
  De(!1),
  P()
], I.prototype, "absoluteScale", void 0);
D([
  z(0),
  P()
], I.prototype, "zIndex", void 0);
D([
  z(!1),
  P()
], I.prototype, "cache", void 0);
D([
  qr("cachePadding")
], I.prototype, "cachePadding", void 0);
D([
  z(!1),
  P()
], I.prototype, "composite", void 0);
D([
  z("source-over"),
  P()
], I.prototype, "compositeOperation", void 0);
D([
  ht()
], I.prototype, "tweenCompositeOperation", null);
D([
  z(1),
  Un((n) => Rt(0, 1, n)),
  P()
], I.prototype, "opacity", void 0);
D([
  E()
], I.prototype, "absoluteOpacity", null);
D([
  Cu()
], I.prototype, "filters", void 0);
D([
  z("#0000"),
  wu()
], I.prototype, "shadowColor", void 0);
D([
  z(0),
  P()
], I.prototype, "shadowBlur", void 0);
D([
  ce("shadowOffset")
], I.prototype, "shadowOffset", void 0);
D([
  z([]),
  Un(Tu),
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
  Vi(!1),
  De(!1),
  P()
], I.prototype, "spawner", void 0);
D([
  Vi(!1),
  De(!1),
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
I = Fr = D([
  ue("Node")
], I);
I.prototype.isClass = !0;
var O = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, Ir;
let $ = Ir = class extends I {
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
    l ? (this.size.x(t), g = this.size.x()) : g = t, this.size.x(u), l && this.lockSize(), yield* Gt(e, (y) => this.size.x(i(u, g, r(y)))), this.size.x(t), l && this.releaseSize();
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
    l ? (this.size.y(t), g = this.size.y()) : g = t, this.size.y(u), l && this.lockSize(), yield* Gt(e, (y) => this.size.y(i(u, g, r(y)))), this.size.y(t), l && this.releaseSize();
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
    typeof t == "object" && typeof t.x == "number" && typeof t.y == "number" ? u = new v(t) : (this.size(t), u = this.size()), this.size(l), this.lockSize(), yield* Gt(e, (g) => this.size(i(l, u, r(g)))), this.releaseSize(), this.size(t);
  }
  /**
   * Get the cardinal point corresponding to the given origin.
   *
   * @param origin - The origin or direction of the point.
   */
  cardinalPoint(t) {
    switch (t) {
      case lt.TopLeft:
        return this.topLeft;
      case lt.TopRight:
        return this.topRight;
      case lt.BottomLeft:
        return this.bottomLeft;
      case lt.BottomRight:
        return this.bottomRight;
      case lt.Top:
      case Mt.Top:
        return this.top;
      case lt.Bottom:
      case Mt.Bottom:
        return this.bottom;
      case lt.Left:
      case Mt.Left:
        return this.left;
      case lt.Right:
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
    return this.findAncestor(Gn(Ir));
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
      i instanceof Ir ? i.layoutEnabled() && (e.push(i), r.push(i.element)) : i && t.unshift(...i.children());
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
    t.beginPath(), be(t, g), be(t, l), t.closePath(), t.fillStyle = "rgba(255,193,125,0.6)", t.fill("evenodd"), t.beginPath(), be(t, l), be(t, u), t.closePath(), t.fillStyle = "rgba(180,255,147,0.6)", t.fill("evenodd"), t.beginPath(), be(t, l), t.closePath(), t.lineWidth = 1, t.strokeStyle = "white", t.stroke(), t.beginPath(), Qi(t, i), t.stroke();
  }
  getOriginDelta(t) {
    const e = this.computedSize().scale(0.5), r = this.offset().mul(e);
    return t === lt.Middle ? r.flipped : lu(t).mul(e).sub(r);
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
  Wn(ru),
  P()
], $.prototype, "layout", void 0);
O([
  z(null),
  P()
], $.prototype, "maxWidth", void 0);
O([
  z(null),
  P()
], $.prototype, "maxHeight", void 0);
O([
  z(null),
  P()
], $.prototype, "minWidth", void 0);
O([
  z(null),
  P()
], $.prototype, "minHeight", void 0);
O([
  z(null),
  P()
], $.prototype, "ratio", void 0);
O([
  qr("margin")
], $.prototype, "margin", void 0);
O([
  qr("padding")
], $.prototype, "padding", void 0);
O([
  z("row"),
  P()
], $.prototype, "direction", void 0);
O([
  z(null),
  P()
], $.prototype, "basis", void 0);
O([
  z(0),
  P()
], $.prototype, "grow", void 0);
O([
  z(1),
  P()
], $.prototype, "shrink", void 0);
O([
  z("nowrap"),
  P()
], $.prototype, "wrap", void 0);
O([
  z("start"),
  P()
], $.prototype, "justifyContent", void 0);
O([
  z("normal"),
  P()
], $.prototype, "alignContent", void 0);
O([
  z("stretch"),
  P()
], $.prototype, "alignItems", void 0);
O([
  z("auto"),
  P()
], $.prototype, "alignSelf", void 0);
O([
  z(0),
  ce({ x: "columnGap", y: "rowGap" })
], $.prototype, "gap", void 0);
O([
  Pe("font-family"),
  P()
], $.prototype, "fontFamily", void 0);
O([
  Pe("font-size", parseFloat),
  P()
], $.prototype, "fontSize", void 0);
O([
  Pe("font-style"),
  P()
], $.prototype, "fontStyle", void 0);
O([
  Pe("font-weight", parseInt),
  P()
], $.prototype, "fontWeight", void 0);
O([
  Pe("line-height", parseFloat),
  P()
], $.prototype, "lineHeight", void 0);
O([
  Pe("letter-spacing", (n) => n === "normal" ? 0 : parseFloat(n)),
  P()
], $.prototype, "letterSpacing", void 0);
O([
  Pe("white-space", (n) => n === "pre" ? "pre" : n === "normal"),
  P()
], $.prototype, "textWrap", void 0);
O([
  z("inherit"),
  P()
], $.prototype, "textDirection", void 0);
O([
  Pe("text-align"),
  P()
], $.prototype, "textAlign", void 0);
O([
  z({ x: null, y: null }),
  ce({ x: "width", y: "height" })
], $.prototype, "size", void 0);
O([
  ht()
], $.prototype, "tweenWidth", null);
O([
  ht()
], $.prototype, "tweenHeight", null);
O([
  E()
], $.prototype, "desiredSize", null);
O([
  ht()
], $.prototype, "tweenSize", null);
O([
  ce("offset")
], $.prototype, "offset", void 0);
O([
  fe(lt.Middle)
], $.prototype, "middle", void 0);
O([
  fe(lt.Top)
], $.prototype, "top", void 0);
O([
  fe(lt.Bottom)
], $.prototype, "bottom", void 0);
O([
  fe(lt.Left)
], $.prototype, "left", void 0);
O([
  fe(lt.Right)
], $.prototype, "right", void 0);
O([
  fe(lt.TopLeft)
], $.prototype, "topLeft", void 0);
O([
  fe(lt.TopRight)
], $.prototype, "topRight", void 0);
O([
  fe(lt.BottomLeft)
], $.prototype, "bottomLeft", void 0);
O([
  fe(lt.BottomRight)
], $.prototype, "bottomRight", void 0);
O([
  z(!1),
  P()
], $.prototype, "clip", void 0);
O([
  z(0),
  P()
], $.prototype, "sizeLockCounter", void 0);
O([
  E()
], $.prototype, "parentTransform", null);
O([
  E()
], $.prototype, "anchorPosition", null);
O([
  E()
], $.prototype, "layoutEnabled", null);
O([
  E()
], $.prototype, "isLayoutRoot", null);
O([
  E()
], $.prototype, "scalingRotationMatrix", null);
O([
  E()
], $.prototype, "computedPosition", null);
O([
  E()
], $.prototype, "computedSize", null);
O([
  E()
], $.prototype, "requestLayoutUpdate", null);
O([
  E()
], $.prototype, "appendedToView", null);
O([
  E()
], $.prototype, "updateLayout", null);
O([
  E()
], $.prototype, "layoutChildren", null);
O([
  E()
], $.prototype, "requestFontUpdate", null);
O([
  E()
], $.prototype, "applyFlex", null);
O([
  E()
], $.prototype, "applyFont", null);
$ = Ir = O([
  ue("Layout")
], $);
function fe(n) {
  return (t, e) => {
    P()(t, e), De(!1)(t, e);
    const r = je(t, e);
    r.parser = (i) => new v(i), r.getter = function() {
      return this.computedSize().getOriginOffset(n).transformAsPoint(this.localToParent());
    }, r.setter = function(i) {
      return this.position(Fe(i, (a) => this.getOriginDelta(n).transform(this.scalingRotationMatrix()).flipped.add(a))), this;
    };
  };
}
pr($.prototype, (n) => {
  n.element = document.createElement("div"), n.element.style.display = "flex", n.element.style.boxSizing = "border-box", n.styles = getComputedStyle(n.element);
});
var It = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
let St = class extends $ {
  rippleSize() {
    return su(this.rippleStrength(), 0, 50);
  }
  constructor(t) {
    super(t), this.rippleStrength = _e(0);
  }
  applyText(t) {
    t.direction = this.textDirection(), this.element.dir = this.textDirection();
  }
  applyStyle(t) {
    t.fillStyle = zn(this.fill(), t), t.strokeStyle = zn(this.stroke(), t), t.lineWidth = this.lineWidth(), t.lineJoin = this.lineJoin(), t.lineCap = this.lineCap(), t.setLineDash(this.lineDash()), t.lineDashOffset = this.lineDashOffset(), this.antialiased() || (t.filter = "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxmaWx0ZXIgaWQ9ImZpbHRlciIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj48ZmVDb21wb25lbnRUcmFuc2Zlcj48ZmVGdW5jUiB0eXBlPSJpZGVudGl0eSIvPjxmZUZ1bmNHIHR5cGU9ImlkZW50aXR5Ii8+PGZlRnVuY0IgdHlwZT0iaWRlbnRpdHkiLz48ZmVGdW5jQSB0eXBlPSJkaXNjcmV0ZSIgdGFibGVWYWx1ZXM9IjAgMSIvPjwvZmVDb21wb25lbnRUcmFuc2Zlcj48L2ZpbHRlcj48L3N2Zz4=#filter)");
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
      t.save(), t.globalAlpha *= st(0.54, 0, e), t.fill(r), t.restore();
    }
  }
  *ripple(t = 1) {
    this.rippleStrength(0), yield* this.rippleStrength(1, t, iu), this.rippleStrength(0);
  }
};
It([
  ta()
], St.prototype, "fill", void 0);
It([
  ta()
], St.prototype, "stroke", void 0);
It([
  z(!1),
  P()
], St.prototype, "strokeFirst", void 0);
It([
  z(0),
  P()
], St.prototype, "lineWidth", void 0);
It([
  z("miter"),
  P()
], St.prototype, "lineJoin", void 0);
It([
  z("butt"),
  P()
], St.prototype, "lineCap", void 0);
It([
  z([]),
  P()
], St.prototype, "lineDash", void 0);
It([
  z(0),
  P()
], St.prototype, "lineDashOffset", void 0);
It([
  z(!0),
  P()
], St.prototype, "antialiased", void 0);
It([
  E()
], St.prototype, "rippleSize", null);
It([
  E()
], St.prototype, "getPath", null);
It([
  ht()
], St.prototype, "ripple", null);
St = It([
  ue("Shape")
], St);
var Xt = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
let $t = class extends St {
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
    return Rt(0, this.baseArcLength(), this.startOffset() + this.offsetArcLength() * t);
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
    return Rt(0, r, r - t - e);
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
    let g = 0, y = null, x = null, A = null, j = null;
    for (const Y of r.segments) {
      const rt = g;
      if (g += Y.arcLength, g < i)
        continue;
      const T = (i - rt) / Y.arcLength, J = (a - rt) / Y.arcLength, pt = Rt(0, 1, T), et = Rt(0, 1, J);
      this.canHaveSubpath && A && !Y.getPoint(0).position.equals(A) && (t.addPath(e), this.processSubpath(e, y, A), e = new Path2D(), y = null);
      const [kt, gt] = Y.draw(e, pt, et, y === null);
      if (y === null && (y = kt.position, x = kt.normal.flipped.perpendicular), A = gt.position, j = gt.normal.flipped.perpendicular, g > a)
        break;
    }
    return this.closed() && this.start.isInitial() && this.end.isInitial() && this.startOffset.isInitial() && this.endOffset.isInitial() && e.closePath(), this.processSubpath(e, y, A), t.addPath(e), {
      startPoint: y ?? v.zero,
      startTangent: x ?? v.right,
      endPoint: A ?? v.zero,
      endTangent: j ?? v.right,
      arrowSize: u,
      path: t,
      startOffset: i
    };
  }
  getPointAtDistance(t) {
    return Fi(this.profile(), t + this.startOffset());
  }
  getPointAtPercentage(t) {
    return Fi(this.profile(), this.percentageToDistance(t));
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
    l < 1e-3 || (t.save(), t.beginPath(), this.endArrow() && this.drawArrow(t, i, a.flipped, l), this.startArrow() && this.drawArrow(t, e, r, l), t.fillStyle = zn(this.stroke(), t), t.closePath(), t.fill(), t.restore());
  }
  drawArrow(t, e, r, i) {
    const a = r.perpendicular, l = e.add(r.scale(-i / 2));
    mr(t, l), Jt(t, l.add(r.add(a).scale(i))), Jt(t, l.add(r.sub(a).scale(i))), Jt(t, l), t.closePath();
  }
};
Xt([
  z(!1),
  P()
], $t.prototype, "closed", void 0);
Xt([
  z(0),
  P()
], $t.prototype, "start", void 0);
Xt([
  z(0),
  P()
], $t.prototype, "startOffset", void 0);
Xt([
  z(!1),
  P()
], $t.prototype, "startArrow", void 0);
Xt([
  z(1),
  P()
], $t.prototype, "end", void 0);
Xt([
  z(0),
  P()
], $t.prototype, "endOffset", void 0);
Xt([
  z(!1),
  P()
], $t.prototype, "endArrow", void 0);
Xt([
  z(24),
  P()
], $t.prototype, "arrowSize", void 0);
Xt([
  E()
], $t.prototype, "arcLength", null);
Xt([
  E()
], $t.prototype, "curveDrawingInfo", null);
$t = Xt([
  ue("Curve")
], $t);
class Xn {
}
class ea extends Xn {
  constructor(t, e, r, i, a) {
    super(), this.center = t, this.radius = e, this.from = r, this.to = i, this.counter = a, this.angle = Math.acos(Rt(-1, 1, r.dot(i))), this.length = Math.abs(this.angle * e);
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
class Pt {
  /**
   * Constructs a constant polynomial
   *
   * @param c0 - The constant coefficient
   */
  static constant(t) {
    return new Pt(t);
  }
  /**
   * Constructs a linear polynomial
   *
   * @param c0 - The constant coefficient
   * @param c1 - The linear coefficient
   */
  static linear(t, e) {
    return new Pt(t, e);
  }
  /**
   * Constructs a quadratic polynomial
   *
   * @param c0 - The constant coefficient
   * @param c1 - The linear coefficient
   * @param c2 - The quadratic coefficient
   */
  static quadratic(t, e, r) {
    return new Pt(t, e, r);
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
    return new Pt(t, e, r, i);
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
        return new Pt(this.c1, 2 * this.c2, 3 * this.c3, 0);
      case 2:
        return new Pt(2 * this.c2, 6 * this.c3, 0, 0);
      case 3:
        return new Pt(6 * this.c3, 0, 0, 0);
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
    const e = 1 - t, r = new Pt(this.c0, this.c1 * t, this.c2 * t * t, this.c3 * t * t * t), i = new Pt(this.eval(0), e * this.differentiate(1).eval(t), e * e / 2 * this.differentiate(2).eval(t), e * e * e / 6 * this.differentiate(3).eval(t));
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
    const t = this.c0, e = this.c1, r = this.c2, i = this.c3, a = t * t, l = t * r, u = e * e, g = (3 * l - u) / (3 * a), y = (2 * u * e - 9 * l * e + 27 * a * i) / (27 * a * t), x = this.solveDepressedCubicRoots(g, y), A = (j) => j - e / (3 * t);
    switch (x.length) {
      case 1:
        return [A(x[0])];
      case 2:
        return [A(x[0]), A(x[1])];
      case 3:
        return [
          A(x[0]),
          A(x[1]),
          A(x[2])
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
      const a = 2 * Math.sqrt(-t / 3), l = 3 * e / (2 * t) * Math.sqrt(-3 / t), u = (g) => a * Math.cos(1 / 3 * Math.acos(Rt(-1, 1, l)) - r / 3 * g);
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
class cr {
  constructor(t, e, r, i) {
    this.c0 = t, this.c1 = e, this.c2 = r, this.c3 = i, t instanceof Pt ? (this.x = t, this.y = e) : i !== void 0 ? (this.x = new Pt(t.x, e.x, r.x, i.x), this.y = new Pt(t.y, e.y, r.y, i.y)) : (this.x = new Pt(t.x, e.x, r.x), this.y = new Pt(t.y, e.y, r.y));
  }
  eval(t, e = 0) {
    return new v(this.x.differentiate(e).eval(t), this.y.differentiate(e).eval(t));
  }
  split(t) {
    const [e, r] = this.x.split(t), [i, a] = this.y.split(t);
    return [new cr(e, i), new cr(r, a)];
  }
  differentiate(t = 1) {
    return new cr(this.x.differentiate(t), this.y.differentiate(t));
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
    t = Rt(0, this.curve.arcLength, t);
    for (let r = 0; r < e; r++) {
      const i = this.sampledDistances[r], a = this.sampledDistances[r + 1];
      if (t >= i && t <= a)
        return nu(i, a, r / (e - 1), (r + 1) / (e - 1), t);
    }
    return 1;
  }
}
class Ru extends Xn {
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
      const A = this.length * e, j = this.length * r;
      l = this.pointSampler.distanceToT(A), u = this.pointSampler.distanceToT(j);
      const Y = (u - l) / (1 - l), [, rt] = this.split(l);
      [a] = rt.split(Y), g = a.points;
    }
    i && mr(t, g[0]), (a ?? this).doDraw(t);
    const y = this.tangent(l), x = this.tangent(u);
    return [
      {
        position: g[0],
        tangent: y,
        normal: y.perpendicular
      },
      {
        position: g.at(-1),
        tangent: x,
        normal: x.perpendicular
      }
    ];
  }
}
var Lu = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
class ye extends Ru {
  get points() {
    return [this.p0, this.p1, this.p2, this.p3];
  }
  constructor(t, e, r, i) {
    super(new cr(
      t,
      // 3*(-p0+p1)
      t.flipped.add(e).scale(3),
      // 3*p0-6*p1+3*p2
      t.scale(3).sub(e.scale(6)).add(r.scale(3)),
      // -p0+3*p1-3*p2+p3
      t.flipped.add(e.scale(3)).sub(r.scale(3)).add(i)
    ), ye.getLength(t, e, r, i)), this.p0 = t, this.p1 = e, this.p2 = r, this.p3 = i;
  }
  split(t) {
    const e = new v(this.p0.x + (this.p1.x - this.p0.x) * t, this.p0.y + (this.p1.y - this.p0.y) * t), r = new v(this.p1.x + (this.p2.x - this.p1.x) * t, this.p1.y + (this.p2.y - this.p1.y) * t), i = new v(this.p2.x + (this.p3.x - this.p2.x) * t, this.p2.y + (this.p3.y - this.p2.y) * t), a = new v(e.x + (r.x - e.x) * t, e.y + (r.y - e.y) * t), l = new v(r.x + (i.x - r.x) * t, r.y + (i.y - r.y) * t), u = new v(a.x + (l.x - a.x) * t, a.y + (l.y - a.y) * t), g = new ye(this.p0, e, a, u), y = new ye(u, l, i, this.p3);
    return [g, y];
  }
  doDraw(t) {
    yu(t, this.p1, this.p2, this.p3);
  }
  static getLength(t, e, r, i) {
    return ye.el.setAttribute("d", `M ${t.x} ${t.y} C ${e.x} ${e.y} ${r.x} ${r.y} ${i.x} ${i.y}`), ye.el.getTotalLength();
  }
}
Lu([
  Nr(() => document.createElementNS("http://www.w3.org/2000/svg", "path"))
], ye, "el", void 0);
class Ke extends Xn {
  constructor(t, e) {
    super(), this.from = t, this.to = e, this.vector = e.sub(t), this.length = this.vector.magnitude, this.normal = this.vector.perpendicular.normalized.safe, this.points = [t, e];
  }
  get arcLength() {
    return this.length;
  }
  draw(t, e = 0, r = 1, i = !1) {
    const a = this.from.add(this.vector.scale(e)), l = this.from.add(this.vector.scale(r));
    return i && mr(t, a), Jt(t, l), [
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
function Mu(n, t, e, r) {
  const i = {
    arcLength: 0,
    segments: [],
    minSin: 1
  }, a = we(t.top, t.right, t.left, n), l = we(t.right, t.top, t.bottom, n), u = we(t.bottom, t.left, t.right, n), g = we(t.left, t.bottom, t.top, n);
  let y = new v(n.left + a, n.top), x = new v(n.right - l, n.top);
  return tr(i, new Ke(y, x)), y = new v(n.right, n.top + l), x = new v(n.right, n.bottom - u), l > 0 && Ar(i, y.addX(-l), l, v.down, v.right, e, r), tr(i, new Ke(y, x)), y = new v(n.right - u, n.bottom), x = new v(n.left + g, n.bottom), u > 0 && Ar(i, y.addY(-u), u, v.right, v.up, e, r), tr(i, new Ke(y, x)), y = new v(n.left, n.bottom - g), x = new v(n.left, n.top + a), g > 0 && Ar(i, y.addX(g), g, v.up, v.left, e, r), tr(i, new Ke(y, x)), y = new v(n.left + a, n.top), a > 0 && Ar(i, y.addY(a), a, v.left, v.down, e, r), i;
}
function tr(n, t) {
  n.segments.push(t), n.arcLength += t.arcLength;
}
function Ar(n, t, e, r, i, a, l) {
  const u = t.add(r.scale(e)), g = t.add(i.scale(e));
  a ? tr(n, new ye(u, u.add(i.scale(l * e)), g.add(r.scale(l * e)), g)) : tr(n, new ea(t, e, r, i, !1));
}
var br = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
let At = class extends $t {
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
    return Z.fromSizeCentered(this.computedSize());
  }
  getPath() {
    if (this.requiresProfile())
      return this.curveDrawingInfo().path;
    const t = new Path2D(), e = this.radius(), r = this.smoothCorners(), i = this.cornerSharpness(), a = Z.fromSizeCentered(this.size());
    return Oi(t, a, e, r, i), t;
  }
  getCacheBBox() {
    return super.getCacheBBox().expand(this.rippleSize());
  }
  getRipplePath() {
    const t = new Path2D(), e = this.rippleSize(), r = this.radius().addScalar(e), i = this.smoothCorners(), a = this.cornerSharpness(), l = Z.fromSizeCentered(this.size()).expand(e);
    return Oi(t, l, r, i, a), t;
  }
};
br([
  qr("radius")
], At.prototype, "radius", void 0);
br([
  z(!1),
  P()
], At.prototype, "smoothCorners", void 0);
br([
  z(0.6),
  P()
], At.prototype, "cornerSharpness", void 0);
br([
  E()
], At.prototype, "profile", null);
At = br([
  ue("Rect")
], At);
var Re = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
class Ht extends I {
  constructor({ children: t, ...e }) {
    super(e), this.scene() || this.scene(new I({})), t && this.scene().add(t);
  }
  getZoom() {
    return 1 / this.scale.x();
  }
  setZoom(t) {
    this.scale(Fe(t, (e) => 1 / e));
  }
  getDefaultZoom() {
    return this.scale.x.context.getInitial();
  }
  *tweenZoom(t, e, r, i) {
    const a = this.scale.x();
    yield* Gt(e, (l) => {
      this.zoom(1 / i(a, 1 / Qt(t), r(l)));
    });
  }
  /**
   * Resets the camera's position, rotation and zoom level to their original
   * values.
   *
   * @param duration - The duration of the tween.
   * @param timingFunction - The timing function to use for the tween.
   */
  *reset(t, e = Yt) {
    yield* oe(this.position(er, t, e), this.zoom(er, t, e), this.rotation(er, t, e));
  }
  *centerOn(t, e, r = Yt, i = v.lerp) {
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
  *followCurve(t, e, r = Yt) {
    yield* Gt(e, (i) => {
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
  *followCurveReverse(t, e, r = Yt) {
    yield* Gt(e, (i) => {
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
  *followCurveWithRotation(t, e, r = Yt) {
    yield* Gt(e, (i) => {
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
  *followCurveWithRotationReverse(t, e, r = Yt) {
    yield* Gt(e, (i) => {
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
    const a = new Ht({ scene: r, children: t });
    return e == null || e(a), new At({
      clip: !0,
      ...i,
      children: [a]
    });
  }
}
Re([
  P()
], Ht.prototype, "scene", void 0);
Re([
  De(!1),
  P()
], Ht.prototype, "zoom", void 0);
Re([
  ht()
], Ht.prototype, "reset", null);
Re([
  ht()
], Ht.prototype, "centerOn", null);
Re([
  ht()
], Ht.prototype, "followCurve", null);
Re([
  ht()
], Ht.prototype, "followCurveReverse", null);
Re([
  ht()
], Ht.prototype, "followCurveWithRotation", null);
Re([
  ht()
], Ht.prototype, "followCurveWithRotationReverse", null);
var yr = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, An;
let ke = An = class extends At {
  constructor(t) {
    super({
      composite: !0,
      fontFamily: "Roboto",
      fontSize: 48,
      lineHeight: "120%",
      textWrap: !1,
      fontStyle: "normal",
      ...t
    }), this.view2D = this, An.shadowRoot.append(this.element), this.applyFlex();
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
    return Or().getNode(t) ?? null;
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
yr([
  z(ur.Paused),
  P()
], ke.prototype, "playbackState", void 0);
yr([
  z(0),
  P()
], ke.prototype, "globalTime", void 0);
yr([
  P()
], ke.prototype, "assetHash", void 0);
yr([
  Nr(() => {
    const n = "motion-canvas-2d-frame";
    let t = document.querySelector(`#${n}`);
    return t || (t = document.createElement("div"), t.id = n, t.style.position = "absolute", t.style.pointerEvents = "none", t.style.top = "0", t.style.left = "0", t.style.opacity = "0", t.style.overflow = "hidden", document.body.prepend(t)), t.shadowRoot ?? t.attachShadow({ mode: "open" });
  })
], ke, "shadowRoot", void 0);
ke = An = yr([
  ue("View2D")
], ke);
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
    const u = n[l - 2], g = n[l - 1], y = n[l], x = u.sub(g), A = y.sub(g), j = x.normalized.safe, Y = A.normalized.safe, rt = Math.acos(Rt(-1, 1, j.dot(Y))), T = Math.tan(rt / 2), J = Math.sin(rt / 2), pt = Math.min(t, T * x.magnitude * (l === 2 ? 1 : 0.5), T * A.magnitude * (l === n.length - 1 ? 1 : 0.5)), et = J === 0 ? 0 : pt / J, kt = T === 0 ? 0 : pt / T, gt = j.add(Y).scale(1 / 2).normalized.safe.scale(et).add(g), te = j.perpendicular.dot(Y) < 0, _ = new Ke(i, g.add(j.scale(kt))), Et = new ea(gt, pt, j.perpendicular.scale(te ? 1 : -1), Y.perpendicular.scale(te ? -1 : 1), te);
    _.arcLength > 0 && (r.segments.push(_), r.arcLength += _.arcLength), Et.arcLength > 0 && (r.segments.push(Et), r.arcLength += Et.arcLength), r.minSin = Math.min(r.minSin, Math.abs(J)), i = g.add(Y.scale(kt));
  }
  const a = new Ke(i, n[n.length - 1]);
  return a.arcLength > 0 && (r.segments.push(a), r.arcLength += a.arcLength), r;
}
function zu(n) {
  return n.reduce((t, e, r) => r ? t + n[r - 1].sub(e).magnitude : 0, 0);
}
function Pn(n, t, e) {
  const r = n.length;
  let i = 0;
  for (let a = 0; a < t.length; a += 1) {
    const l = n[(e + a) % r], u = t[a];
    i += l.sub(u).squaredMagnitude;
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
    const a = n[i], l = t[i];
    r.push(v.lerp(a, l, e));
  }
  return r;
}
var Be = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, Er;
let jt = Er = class extends $t {
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
        const u = Pn(t, e, l);
        u < i && (i = u, a = l);
      }
      if (a) {
        const l = t.splice(0, a);
        t.splice(t.length, 0, ...l);
      }
    } else {
      const i = Pn(t, e, 0), a = [...t].reverse();
      Pn(a, e, 0) < i && t.reverse();
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
    const r = t.length + e, i = zu(t);
    let a = i === 0 ? 0 : e / i, l = 0;
    for (; t.length < r; ) {
      const u = r - t.length;
      if (l + 1 >= t.length) {
        a = i === 0 ? 0 : u / i, l = 0;
        continue;
      }
      const g = t[l], y = t[l + 1], x = g.sub(y).magnitude;
      let A = Math.min(Math.round(x * a), u) + 1;
      i === 0 && (A = 2);
      for (let j = 1; j < A; j++)
        t.splice(++l, 0, v.lerp(g, y, j / A));
      l++;
    }
  }
  *tweenPoints(t, e, r) {
    const i = [...this.parsedPoints()], a = this.parsePoints(Qt(t)), l = this.closed(), u = i.length - a.length;
    Er.distributePoints(u < 0 ? i : a, Math.abs(u)), Er.rotatePoints(a, i, l), this.tweenedPoints(i), yield* Gt(e, (g) => {
      const y = r(g);
      this.tweenedPoints(Au(i, a, y));
    }, () => {
      this.tweenedPoints(null), this.points(t);
    });
  }
  constructor(t) {
    super(t), this.tweenedPoints = _e(null), t.children === void 0 && t.points === void 0 && Ct().warn({
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
      t = e ? e.map((r) => new v(Qt(r))) : this.children().filter((r) => !(r instanceof $) || r.isLayoutRoot()).map((r) => r.position());
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
      mr(l, u[0]);
      for (const g of u)
        Jt(l, g), t.beginPath(), Ki(t, g, 4), t.closePath(), t.fill(), t.stroke();
    }
    t.strokeStyle = "white", t.stroke(l), t.beginPath(), Qi(t, a), t.stroke(), t.beginPath(), be(t, r), t.closePath(), t.stroke();
  }
  parsePoints(t) {
    return t ? t.map((e) => new v(Qt(e))) : this.children().map((e) => e.position());
  }
};
Be([
  z(0),
  P()
], jt.prototype, "radius", void 0);
Be([
  z(null),
  P()
], jt.prototype, "points", void 0);
Be([
  ht()
], jt.prototype, "tweenPoints", null);
Be([
  E()
], jt.prototype, "childrenBBox", null);
Be([
  E()
], jt.prototype, "parsedPoints", null);
Be([
  E()
], jt.prototype, "profile", null);
jt = Er = Be([
  ue("Line")
], jt);
var wr = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, _r;
let _t = _r = class extends St {
  constructor({ children: t, ...e }) {
    super(e), t && this.text(t);
  }
  parentTxt() {
    const t = this.parent();
    return t instanceof Ot ? t : null;
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
      const x = l.getBoundingClientRect(), A = i / -2 + x.left - r.left, j = a / -2 + x.top - r.top + e;
      g.y === j ? (g.width += x.width, u += y.textContent) : (this.drawText(t, u, g), g.x = A, g.y = j, g.width = x.width, g.height = x.height, u = y.textContent);
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
      if (this.element.innerText = "", _r.segmenter)
        for (const e of _r.segmenter.segment(this.text()))
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
wr([
  z(""),
  Wn(Ui),
  P()
], _t.prototype, "text", void 0);
wr([
  E()
], _t.prototype, "parentTxt", null);
wr([
  Nr(() => {
    const n = document.createElement("span");
    return ke.shadowRoot.append(n), n;
  })
], _t, "formatter", void 0);
wr([
  Nr(() => {
    try {
      return new Intl.Segmenter(void 0, {
        granularity: "grapheme"
      });
    } catch {
      return null;
    }
  })
], _t, "segmenter", void 0);
_t = _r = wr([
  ue("TxtLeaf")
], _t);
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
  _t.prototype[`get${Oe(n)}`] = function() {
    var t;
    return ((t = this.parentTxt()) == null ? void 0 : t[n]()) ?? this[n].context.getInitial();
  };
});
var xr = function(n, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, l;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(n, t, e, r);
  else for (var u = n.length - 1; u >= 0; u--) (l = n[u]) && (a = (i < 3 ? l(a) : i > 3 ? l(t, e, a) : l(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, ze;
let Ot = ze = class extends St {
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
    return new ze({ ...t, fontWeight: 700 });
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
    return new ze({ ...t, fontStyle: "italic" });
  }
  getText() {
    return this.innerText();
  }
  setText(t) {
    const e = this.children();
    let r = null;
    for (let i = 0; i < e.length; i++) {
      const a = e[i];
      r === null && a instanceof _t ? r = a : a.parent(null);
    }
    r === null ? (r = new _t({ text: t }), r.parent(this)) : r.text(t), this.setParsedChildren([r]);
  }
  setChildren(t) {
    this.children.context.raw() !== t && (typeof t == "string" ? this.text(t) : super.setChildren(t));
  }
  *tweenText(t, e, r, i) {
    const a = this.children();
    (a.length !== 1 || !(a[0] instanceof _t)) && this.text.save();
    const l = this.childAs(0), u = l.text.context.raw(), g = this.size.context.raw();
    l.text(t);
    const y = this.size();
    l.text(u ?? er), this.height() === 0 && this.height(y.height), yield* oe(this.size(y, e, r), l.text(t, e, r, i)), this.children.context.setter(t), this.size(g);
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
    return t instanceof ze ? t : null;
  }
  parseChildren(t) {
    const e = [], r = Array.isArray(t) ? t : [t];
    for (const i of r)
      i instanceof ze || i instanceof _t ? e.push(i) : typeof i == "string" && e.push(new _t({ text: i }));
    return e;
  }
  applyFlex() {
    super.applyFlex(), this.element.style.display = this.findAncestor(Gn(ze)) ? "inline" : "block";
  }
  draw(t) {
    this.drawChildren(t);
  }
};
xr([
  z(""),
  P()
], Ot.prototype, "text", void 0);
xr([
  ht()
], Ot.prototype, "tweenText", null);
xr([
  E()
], Ot.prototype, "innerText", null);
xr([
  E()
], Ot.prototype, "parentTxt", null);
Ot = ze = xr([
  ue("Txt")
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
  Ot.prototype[`getDefault${Oe(n)}`] = function(t) {
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
    t.save(), this.renderLifecycle.dispatch([Vt.BeforeRender, t]), t.save(), this.renderLifecycle.dispatch([Vt.BeginRender, t]), this.getView().playbackState(this.playback.state).globalTime(this.playback.time), this.getView().render(t), this.renderLifecycle.dispatch([Vt.FinishRender, t]), t.restore(), this.renderLifecycle.dispatch([Vt.AfterRender, t]), t.restore();
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
      const a = this.getView().findAll(Gn(Ht)), l = [];
      for (const u of a) {
        const g = u.scene();
        g && (g === i || g.findFirst((y) => y === i)) && l.push(u);
      }
      if (l.length > 0)
        for (const u of l) {
          const g = u.parentToWorld(), y = u.localToParent().inverse(), x = i.localToWorld();
          i.drawOverlay(r, e.multiply(g).multiply(y).multiply(x));
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
    this.nodeCounters.set(r, i), e && this.registeredNodes.has(e) && (Ct().error({
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
      this.view = new ke({
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
const ft = {
  bg: "#0f0f0f",
  // Primary accent
  accent: "#2dd4bf",
  // Context / secondary
  context: "#1e1e2e",
  arrow: "#555566",
  // Message array roles (useful for agent/chat visualizations)
  user: "#3b82f6",
  // blue-500
  userBg: "#1e3a5f",
  assistant: "#22c55e",
  // green-500
  assistantBg: "#1a3d2a",
  // teal (matches accent)
  toolCallBg: "#1a3d3d",
  toolResult: "#a78bfa",
  white: "#ffffff"
}, or = "monospace", Ae = Fu(function* (n) {
  n.fill(ft.bg);
  const t = Pc(), e = me(), r = me(), i = me(), a = me(), l = me(), u = me(), g = me(), y = me(), x = [
    { label: "1099-NEC.pdf", ext: "PDF", mdName: "1099-nec.md", cat: 0 },
    { label: "K-1.pdf", ext: "PDF", mdName: "k-1.md", cat: 0 },
    { label: "Brokerage.csv", ext: "CSV", mdName: "brokerage.md", cat: 0 },
    { label: "Biz Jan.pdf", ext: "PDF", mdName: "biz-jan.md", cat: 1 },
    { label: "Biz Feb.pdf", ext: "PDF", mdName: "biz-feb.md", cat: 1 },
    { label: "Biz Mar.pdf", ext: "PDF", mdName: "biz-mar.md", cat: 1 },
    { label: "Personal Jan.csv", ext: "CSV", mdName: "personal-jan.md", cat: 2 },
    { label: "Personal Feb.csv", ext: "CSV", mdName: "personal-feb.md", cat: 2 },
    { label: "Health.csv", ext: "CSV", mdName: "health.md", cat: 3 },
    { label: "Q1 Est.pdf", ext: "PDF", mdName: "q1-est.md", cat: 4 }
  ], A = [
    { label: "raw/income.md", aggLabel: `Aggregate
Income`, color: ft.user },
    { label: "raw/business.md", aggLabel: `Aggregate
Business`, color: ft.assistant },
    { label: "raw/personal.md", aggLabel: `Aggregate
Personal`, color: ft.toolResult },
    { label: "raw/credits.md", aggLabel: `Aggregate
Credits`, color: ft.accent },
    { label: "raw/estimated.md", aggLabel: `Aggregate
Estimated`, color: "#f59e0b" }
  ], j = x.length, Y = A.length, rt = -800, T = -480, J = -190, pt = 200, et = 580, kt = 86, gt = -((j - 1) * kt) / 2, te = 110, _ = -((Y - 1) * te) / 2, Et = 190, at = 56, nr = 170, Ne = 160, Gr = 64, Cr = 210, Xr = 64, We = (B) => _ + B * te;
  n.add(
    /* @__PURE__ */ Tt(Yi, { children: [
      /* @__PURE__ */ Tt(
        At,
        {
          ref: t,
          x: rt,
          y: 0,
          fill: ft.userBg,
          stroke: ft.user,
          lineWidth: 3,
          radius: 14,
          padding: [16, 24],
          width: 200,
          height: 80,
          opacity: 0,
          layout: !0,
          direction: "column",
          alignItems: "center",
          justifyContent: "center",
          children: /* @__PURE__ */ Tt(Ot, { text: "ORCHESTRATOR", fill: ft.user, fontFamily: or, fontSize: 18 })
        }
      ),
      x.map((B, bt) => {
        const ct = gt + bt * kt;
        return /* @__PURE__ */ Tt(
          jt,
          {
            ref: e,
            stroke: ft.arrow,
            lineWidth: 1.5,
            endArrow: !0,
            arrowSize: 8,
            points: [
              [rt + 100, 0],
              [T - Et / 2, ct]
            ],
            opacity: 0
          }
        );
      }),
      x.map((B, bt) => {
        const ct = gt + bt * kt, ee = B.ext === "PDF";
        return /* @__PURE__ */ Tt(
          At,
          {
            ref: r,
            x: T,
            y: ct,
            fill: ee ? ft.userBg : ft.assistantBg,
            stroke: ee ? ft.user : ft.assistant,
            lineWidth: 1.5,
            radius: 8,
            padding: [6, 10],
            width: Et,
            height: at,
            opacity: 0,
            layout: !0,
            alignItems: "center",
            justifyContent: "center",
            children: /* @__PURE__ */ Tt(Ot, { text: B.label, fill: ft.white, fontFamily: or, fontSize: 14 })
          }
        );
      }),
      x.map((B, bt) => {
        const ct = gt + bt * kt;
        return /* @__PURE__ */ Tt(
          jt,
          {
            ref: i,
            stroke: ft.accent,
            lineWidth: 1.5,
            endArrow: !0,
            arrowSize: 8,
            points: [
              [T + Et / 2, ct],
              [J - nr / 2, ct]
            ],
            opacity: 0
          }
        );
      }),
      x.map((B, bt) => {
        const ct = gt + bt * kt, ee = A[B.cat].color;
        return /* @__PURE__ */ Tt(
          At,
          {
            ref: a,
            x: J,
            y: ct,
            fill: ft.toolCallBg,
            stroke: ee,
            lineWidth: 1.5,
            radius: 8,
            padding: [6, 10],
            width: nr,
            height: at,
            opacity: 0,
            layout: !0,
            alignItems: "center",
            justifyContent: "center",
            children: /* @__PURE__ */ Tt(Ot, { text: B.mdName, fill: ft.white, fontFamily: or, fontSize: 13 })
          }
        );
      }),
      x.map((B, bt) => {
        const ct = gt + bt * kt, ee = We(B.cat);
        return /* @__PURE__ */ Tt(
          jt,
          {
            ref: l,
            stroke: A[B.cat].color,
            lineWidth: 1.5,
            endArrow: !0,
            arrowSize: 8,
            points: [
              [J + nr / 2, ct],
              [pt - Ne / 2, ee]
            ],
            opacity: 0
          }
        );
      }),
      A.map((B, bt) => {
        const ct = We(bt);
        return /* @__PURE__ */ Tt(
          At,
          {
            ref: u,
            x: pt,
            y: ct,
            fill: ft.context,
            stroke: B.color,
            lineWidth: 2,
            radius: 10,
            padding: [8, 12],
            width: Ne,
            height: Gr,
            opacity: 0,
            layout: !0,
            alignItems: "center",
            justifyContent: "center",
            children: /* @__PURE__ */ Tt(Ot, { text: B.aggLabel, fill: B.color, fontFamily: or, fontSize: 14, textAlign: "center" })
          }
        );
      }),
      A.map((B, bt) => {
        const ct = We(bt);
        return /* @__PURE__ */ Tt(
          jt,
          {
            ref: g,
            stroke: B.color,
            lineWidth: 2,
            endArrow: !0,
            arrowSize: 10,
            points: [
              [pt + Ne / 2, ct],
              [et - Cr / 2, ct]
            ],
            opacity: 0
          }
        );
      }),
      A.map((B, bt) => {
        const ct = We(bt);
        return /* @__PURE__ */ Tt(
          At,
          {
            ref: y,
            x: et,
            y: ct,
            fill: ft.context,
            stroke: B.color,
            lineWidth: 2.5,
            radius: 10,
            padding: [10, 14],
            width: Cr,
            height: Xr,
            opacity: 0,
            layout: !0,
            alignItems: "center",
            justifyContent: "center",
            children: /* @__PURE__ */ Tt(Ot, { text: B.label, fill: ft.white, fontFamily: or, fontSize: 16 })
          }
        );
      })
    ] })
  ), yield* t().opacity(1, 0.6), yield* Ut(0.3), yield* se(0.04, ...e.map((B) => B.opacity(1, 0.3))), yield* Ut(0.15), yield* se(0.06, ...r.map((B) => B.opacity(1, 0.4))), yield* Ut(0.4), yield* oe(
    se(0.04, ...i.map((B) => B.opacity(1, 0.35))),
    se(0.06, ...a.map((B) => B.opacity(1, 0.4)))
  ), yield* Ut(0.5), yield* se(0.05, ...l.map((B) => B.opacity(1, 0.4))), yield* Ut(0.2), yield* se(0.12, ...u.map((B) => B.opacity(1, 0.5))), yield* Ut(0.3), yield* oe(
    se(0.1, ...g.map((B) => B.opacity(1, 0.4))),
    se(0.12, ...y.map((B) => B.opacity(1, 0.5)))
  ), yield* Ut(10);
});
Ae.name = "scene";
du.attach(Ae.meta);
Ae.onReplaced ?? (Ae.onReplaced = new Ce(Ae.config));
const Iu = {
  scenes: [Ae]
};
let Hn;
Hn ?? (Hn = new dr("\0virtual:settings", !1));
Hn.loadData({});
const Eu = Hn, Xu = Oc(
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
