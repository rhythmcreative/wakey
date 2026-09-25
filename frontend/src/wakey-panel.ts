import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import {
  DAY_LABELS,
  emptyDraft,
  ensureHaForm,
  type Alarm,
  type HomeAssistant,
  type Snapshot,
} from "./types";
import "./wakey-admin";
import "./wakey-alarm-settings";
import {
  DEFAULT_ALARM_APPEARANCE,
  getAlarmFontFamily,
  loadAlarmAppearance,
  type AlarmAppearanceConfig,
} from "./wakey-alarm-settings";

const DAY_OPTIONS = DAY_LABELS.map((label, i) => ({ value: String(i), label }));

export class WakeyPanel extends LitElement {
  // Set as properties by the panel host, not as attributes.
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public narrow = false;

  @state() private _alarms: Alarm[] = [];
  @state() private _isAdmin = false;
  @state() private _allowedPlayers: string[] | null = null;
  @state() private _view: "alarms" | "settings" | "admin" = "alarms";
  @state() private _loaded = false;
  @state() private _error: string | null = null;
  @state() private _dialogOpen = false;
  @state() private _editing: string | null = null;
  @state() private _draft: Record<string, any> = {};
  @state() private _adjusting: string | null = null;
  @state() private _adjustTime = "";
  @state() private _haForm = false;
  @state() private _testingAlarm: Alarm | null = null;
  @state() private _appearance: AlarmAppearanceConfig = loadAlarmAppearance();

  private _unsub?: () => void;
  private _subscribed = false;

  public connectedCallback(): void {
    super.connectedCallback();
    this._appearance = loadAlarmAppearance();
    window.addEventListener("wakey-appearance-changed", this._onAppearanceChanged);
    this._loadGoogleFonts();
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("wakey-appearance-changed", this._onAppearanceChanged);
    this._unsub?.();
    this._unsub = undefined;
    this._subscribed = false;
  }

  private _onAppearanceChanged = (ev: Event) => {
    const detail = (ev as CustomEvent).detail;
    if (detail?.config) {
      this._appearance = { ...detail.config };
    } else {
      this._appearance = loadAlarmAppearance();
    }
  };

  private _loadGoogleFonts(): void {
    if (!document.getElementById("wakey-google-alarm-fonts")) {
      const link = document.createElement("link");
      link.id = "wakey-google-alarm-fonts";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Inter:wght@300;400;500;700&family=Nunito:wght@300;400;500;700&family=Oswald:wght@300;400;500;700&family=Roboto+Slab:wght@300;400;500;700&family=Rubik:wght@300;400;500;700&display=swap";
      document.head.appendChild(link);
    }
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("hass") && this.hass && !this._subscribed) {
      this._subscribed = true;
      this._subscribe();
      ensureHaForm().then((ok) => (this._haForm = ok));
    }
  }

  private async _subscribe(): Promise<void> {
    try {
      this._unsub = await this.hass.connection.subscribeMessage<Snapshot>(
        (msg) => {
          this._alarms = msg.alarms ?? [];
          // Trust the server's view of who this is over hass.user: it is the
          // same value the API is actually enforcing with, so the buttons on
          // screen cannot disagree with what the backend will allow.
          this._isAdmin = msg.is_admin === true;
          this._allowedPlayers = msg.allowed_media_players ?? null;
          this._loaded = true;
          this._error = null;
        },
        { type: "wakey/subscribe" }
      );
    } catch (err: any) {
      this._error = err?.message ?? String(err);
      this._loaded = true;
    }
  }

  /**
   * Whether this user has anywhere to point a new alarm.
   *
   * Speakers are deny-by-default, so a household member who has not been
   * granted any cannot usefully create anything yet — and an Add button that
   * always fails is worse than no Add button.
   */
  private get _canCreate(): boolean {
    return this._allowedPlayers === null || this._allowedPlayers.length > 0;
  }

  // --- actions -----------------------------------------------------------

  private async _call(msg: Record<string, unknown>): Promise<boolean> {
    try {
      await this.hass.callWS(msg);
      return true;
    } catch (err: any) {
      this._error = err?.message ?? String(err);
      return false;
    }
  }

  private _toggle(alarm: Alarm) {
    this._call({ type: "wakey/update", alarm_id: alarm.id, enabled: !alarm.enabled });
  }

  private _skip(alarm: Alarm) {
    this._call({ type: "wakey/skip_next", alarm_id: alarm.id, skip: !alarm.skip_next });
  }

  /**
   * Whether a one-time adjustment is still ahead of us.
   *
   * The backend clears a spent adjustment on its next scheduling pass, which
   * can be a while after the day itself has gone. Checking the date here
   * keeps a dead one off the card in the meantime.
   */
  private _adjusted(alarm: Alarm): boolean {
    if (!alarm.override_for || !alarm.override_time) return false;
    return alarm.override_for >= new Date().toLocaleDateString("en-CA");
  }

  private _openAdjust(alarm: Alarm) {
    this._adjusting = alarm.id;
    this._adjustTime = alarm.override_time ?? alarm.time;
  }

  private async _saveAdjust() {
    const id = this._adjusting;
    if (!id || !this._adjustTime) return;
    const ok = await this._call({
      type: "wakey/adjust_next",
      alarm_id: id,
      time: this._adjustTime.slice(0, 5),
    });
    // A refused time — one that has already gone by — leaves the dialog up
    // with the error showing, so it can be corrected rather than retyped.
    if (ok) this._adjusting = null;
  }

  private async _clearAdjust(alarm: Alarm) {
    if (await this._call({ type: "wakey/adjust_next", alarm_id: alarm.id, clear: true })) {
      this._adjusting = null;
    }
  }

  private _delete(alarm: Alarm) {
    if (!confirm(`Delete "${alarm.name}"?`)) return;
    this._call({ type: "wakey/delete", alarm_id: alarm.id });
  }

  private _trigger(alarm: Alarm) {
    this._testingAlarm = alarm;
    this._call({ type: "wakey/trigger", alarm_id: alarm.id });
  }

  private _stopTest() {
    this._call({ type: "wakey/dismiss" });
    this._testingAlarm = null;
  }

  // --- dialog ------------------------------------------------------------

  private _openNew() {
    this._editing = null;
    this._draft = { ...emptyDraft(), weekdays: ["0", "1", "2", "3", "4"] };
    this._dialogOpen = true;
  }

  private _openEdit(alarm: Alarm) {
    this._editing = alarm.id;
    this._draft = {
      ...alarm,
      weekdays: (alarm.weekdays ?? []).map(String),
      media: alarm.media_player ? { entity_id: alarm.media_player } : undefined,
    };
    this._dialogOpen = true;
  }

  private _closeDialog() {
    this._dialogOpen = false;
    this._editing = null;
  }

  private _formChanged(ev: CustomEvent) {
    const value = { ...(ev.detail as any).value };

    // The media selector's "Pick media" tile stays inert until it knows which
    // player to browse. Seeding entity_id from the chosen media player is what
    // makes the browse dialog actually open.
    if (value.media_player) {
      const current = value.media?.entity_id;
      if (current !== value.media_player) {
        value.media = { ...(value.media ?? {}), entity_id: value.media_player };
      }
    }
    // A freshly browsed pick wins over whatever was typed.
    if (value.media?.media_content_id && value.media.media_content_id !== this._draft.media?.media_content_id) {
      value.source_uri = value.media.media_content_id;
    }

    this._draft = value;
  }

  private async _save() {
    const d = this._draft;
    if (!d.time || !d.media_player || !d.source_uri) {
      this._error = "Name, time, media player and source are all required.";
      return;
    }
    const payload: Record<string, unknown> = {
      name: d.name || "Alarm",
      time: String(d.time).slice(0, 5),
      repeat: d.repeat ?? "weekly",
      weekdays: (d.weekdays ?? []).map((x: string) => Number(x)),
      date: d.date ?? null,
      media_player: d.media_player,
      source_uri: d.source_uri,
      source_kind: d.source_kind ?? "music_assistant",
      volume: Number(d.volume ?? 0.7),
      fade_seconds: Number(d.fade_seconds ?? 0),
      resume_previous: Boolean(d.resume_previous ?? false),
      snooze_minutes: Number(d.snooze_minutes ?? 9),
      auto_dismiss_minutes: Number(d.auto_dismiss_minutes ?? 30),
      pre_alarm_minutes: Number(d.pre_alarm_minutes ?? 0),
      pre_alarm_script: d.pre_alarm_script || null,
      notify_targets: d.notify_targets ?? [],
      repeat_count: Number(d.repeat_count ?? 0),
    };
    if (this._editing) {
      await this._call({ type: "wakey/update", alarm_id: this._editing, ...payload });
    } else {
      await this._call({ type: "wakey/create", ...payload, enabled: d.enabled ?? true });
    }
    this._closeDialog();
  }

  private _schema() {
    const repeat = this._draft.repeat ?? "weekly";
    return [
      { name: "name", required: true, selector: { text: {} } },
      { name: "time", required: true, selector: { time: {} } },
      {
        name: "repeat",
        required: true,
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "weekly", label: "Weekly" },
              { value: "once", label: "Once" },
              { value: "never", label: "Never (auto-delete)" },
            ],
          },
        },
      },
      ...(repeat === "weekly"
        ? [{ name: "weekdays", selector: { select: { multiple: true, options: DAY_OPTIONS } } }]
        : [{ name: "date", selector: { date: {} } }]),
      {
        name: "media_player",
        required: true,
        selector: {
          entity: {
            filter: { domain: "media_player" },
            // Omitted for admins, who are unrestricted. For everyone else
            // this is the whole point: the picker only offers the speakers
            // they were granted, so the refusal never has to happen.
            ...(this._allowedPlayers
              ? { include_entities: this._allowedPlayers }
              : {}),
          },
        },
      },
      { name: "media", selector: { media: {} } },
      { name: "source_uri", required: true, selector: { text: {} } },
      {
        type: "grid",
        schema: [
          { name: "volume", selector: { number: { min: 0, max: 1, step: 0.05, mode: "slider" } } },
          {
            name: "fade_seconds",
            selector: { number: { min: 0, max: 900, step: 15, mode: "box", unit_of_measurement: "s" } },
          },
        ],
      },
      {
        type: "expandable",
        // Deliberately unnamed: a named expandable makes ha-form nest its
        // fields under draft.advanced, while everything here reads and saves
        // them flat — the section would render empty and wipe on save.
        title: "Advanced",
        schema: [
          {
            name: "repeat_count",
            selector: { number: { min: 0, max: 100, mode: "box" } },
          },
          {
            name: "snooze_minutes",
            selector: { number: { min: 1, max: 120, mode: "box", unit_of_measurement: "min" } },
          },
          {
            name: "auto_dismiss_minutes",
            selector: { number: { min: 1, max: 240, mode: "box", unit_of_measurement: "min" } },
          },
          {
            name: "pre_alarm_minutes",
            selector: { number: { min: 0, max: 240, mode: "box", unit_of_measurement: "min" } },
          },
          {
            name: "pre_alarm_script",
            selector: { entity: { filter: { domain: "script" } } },
          },
          {
            name: "notify_targets",
            selector: { entity: { multiple: true, filter: { domain: "notify" } } },
          },
          { name: "resume_previous", selector: { boolean: {} } },
        ],
      },
    ];
  }

  private _label = (s: any): string =>
    ({
      name: "Name",
      time: "Time",
      repeat: "Repeat",
      weekdays: "Days",
      date: "Date",
      media_player: "Play on",
      media: "Browse for a track",
      source_uri: "Source (URI or search text)",
      volume: "Volume",
      fade_seconds: "Fade in",
      snooze_minutes: "Snooze length",
      auto_dismiss_minutes: "Auto dismiss after",
      pre_alarm_minutes: "Pre-alarm lead time",
      pre_alarm_script: "Pre-alarm script",
      notify_targets: "Notify on ring",
      repeat_count: "Playback repeats (0 = continuous)",
      resume_previous: "Resume previous playback",
      advanced: "Advanced",
    })[s.name as string] ?? s.name;

  // --- render ------------------------------------------------------------

  private _fmtNext(alarm: Alarm): string {
    if (!alarm.enabled) return "Off";
    if (!alarm.next_fire) return "Never";
    const then = new Date(alarm.next_fire);
    const mins = Math.round((then.getTime() - Date.now()) / 60000);
    if (mins < 60) return `in ${Math.max(1, mins)} min`;
    const h = Math.floor(mins / 60);
    if (h < 24) return `in ${h}h ${mins % 60}m`;
    return then.toLocaleDateString(undefined, { weekday: "long" });
  }

  private _fmtAdjusted(alarm: Alarm): string {
    const today = new Date().toLocaleDateString("en-CA");
    if (alarm.override_for === today) return `Today at ${alarm.override_time}`;
    const day = new Date(`${alarm.override_for}T00:00:00`);
    return `${day.toLocaleDateString(undefined, { weekday: "long" })} at ${alarm.override_time}`;
  }

  private _renderAdjustDialog() {
    const alarm = this._alarms.find((a) => a.id === this._adjusting);
    if (!alarm) return nothing;
    return html`
      <div class="scrim" @click=${() => (this._adjusting = null)}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>Adjust next</h2>
        <p class="hint">
          Just this once. ${alarm.name} rings at the new time, then goes back to
          ${alarm.time} on its own.
        </p>
        <label>
          Time
          <input
            type="time"
            .value=${this._adjustTime}
            @input=${(e: any) => (this._adjustTime = e.target.value)}
          />
        </label>
        <div class="dialog-actions">
          ${this._adjusted(alarm)
            ? html`<button @click=${() => this._clearAdjust(alarm)}>
                Back to ${alarm.time}
              </button>`
            : nothing}
          <button @click=${() => (this._adjusting = null)}>Cancel</button>
          <button class="primary" @click=${this._saveAdjust}>Save</button>
        </div>
      </div>
    `;
  }

  private _formatAlarmDays(alarm: Partial<Alarm> | Record<string, any>, short = false): string {
    if (alarm.repeat === "once") return alarm.date ?? (short ? "1 vez" : "Una vez");
    if (alarm.repeat === "never") return alarm.date ? `${alarm.date} (Nunca)` : "Nunca";
    const weekdays: number[] = Array.isArray(alarm.weekdays)
      ? alarm.weekdays.map(Number)
      : [];
    if (weekdays.length === 0) return "Sin días";
    if (weekdays.length === 7) return short ? "Diario" : "Todos los días";

    const sorted = [...weekdays].sort((a, b) => a - b);
    if (
      sorted.length === 5 &&
      sorted[0] === 0 &&
      sorted[1] === 1 &&
      sorted[2] === 2 &&
      sorted[3] === 3 &&
      sorted[4] === 4
    ) {
      return short ? "Lun-Vie" : "Lunes a Viernes";
    }
    if (sorted.length === 2 && sorted[0] === 5 && sorted[1] === 6) {
      return short ? "Sáb, Dom" : "Sábados y Domingos";
    }
    const shortNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const longNames = [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ];
    const names = short ? shortNames : longNames;
    return sorted.map((d) => names[d] || `Día ${d}`).join(short ? ", " : " y ");
  }

  private _formatSpeaker(mediaPlayer: string | undefined): string {
    if (!mediaPlayer) return "Altavoz";
    const raw = mediaPlayer.replace(/^media_player\./, "").replace(/_/g, " ").trim();
    if (raw.toLowerCase() === "salon") return "Salón";
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  private _renderAlarm(alarm: Alarm) {
    const days = this._formatAlarmDays(alarm, false);
    const speaker = this._formatSpeaker(alarm.media_player);

    return html`
      <div class="card ${alarm.enabled ? "" : "dim"}">
        <div class="row">
          <div class="time">${alarm.time}</div>
          <div class="grow">
            <div class="name">${alarm.name}</div>
            <div class="sub">${days}</div>
            <div class="sub speaker-sub">
              <ha-icon icon="mdi:speaker"></ha-icon>
              <span>Altavoz: ${speaker}</span>
            </div>
          </div>
          <div class="right">
            ${this._haForm
              ? html`<ha-switch
                  .checked=${alarm.enabled}
                  @change=${() => this._toggle(alarm)}
                ></ha-switch>`
              : html`<input
                  type="checkbox"
                  .checked=${alarm.enabled}
                  @change=${() => this._toggle(alarm)}
                />`}
            <div class="next">${this._fmtNext(alarm)}</div>
          </div>
        </div>
        ${alarm.is_ringing || alarm.is_snoozed || alarm.skip_next || this._adjusted(alarm)
          ? html`<div class="flags">
              ${alarm.is_ringing ? html`<span class="flag ring">Ringing</span>` : nothing}
              ${alarm.is_snoozed ? html`<span class="flag">Snoozed</span>` : nothing}
              ${alarm.skip_next ? html`<span class="flag">Skipping next</span>` : nothing}
              ${this._adjusted(alarm)
                ? html`<span class="flag">${this._fmtAdjusted(alarm)}</span>`
                : nothing}
            </div>`
          : nothing}
        ${html`<div class="actions">
              <button @click=${() => this._openEdit(alarm)}>Edit</button>
              <button @click=${() => this._skip(alarm)}>
                ${alarm.skip_next ? "Don't skip" : "Skip next"}
              </button>
              <button @click=${() => this._openAdjust(alarm)}>Adjust next</button>
              <button class="btn-test" @click=${() => this._trigger(alarm)}>
                <ha-icon icon="mdi:play" style="--mdc-icon-size: 16px; margin-right: 4px; vertical-align: -2px;"></ha-icon>
                Test
              </button>
              <button class="danger" @click=${() => this._delete(alarm)}>Delete</button>
            </div>`}
      </div>
    `;
  }

  private _renderRinging() {
    const ringing = this._alarms.filter((a) => a.is_ringing || a.is_snoozed);
    if (!ringing.length) return nothing;
    return html`
      <div class="banner">
        <div class="grow">
          <strong>${ringing.map((a) => a.name).join(", ")}</strong>
          <div class="sub">${ringing[0].is_snoozed ? "Snoozed" : "Ringing now"}</div>
        </div>
        <button @click=${() => this._call({ type: "wakey/snooze" })}>Snooze</button>
        <button @click=${() => this._call({ type: "wakey/dismiss" })}>Dismiss</button>
      </div>
    `;
  }

  private _renderDialog() {
    if (!this._dialogOpen) return nothing;
    const timeVal = this._draft.time ? String(this._draft.time).slice(0, 5) : "07:00";
    const nameVal = this._draft.name || "Alarma";
    const daysVal = this._formatAlarmDays(this._draft, false);
    const speakerVal = this._draft.media_player
      ? this._formatSpeaker(this._draft.media_player)
      : "";

    return html`
      <div class="scrim" @click=${this._closeDialog}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>${this._editing ? "Editar alarma" : "Nueva alarma"}</h2>

        <div class="live-alarm-preview">
          <div class="preview-header">
            <div class="preview-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L16.2,17.2L17,15.9L12.5,13.2V8M22,5.7L17.7,2.2L16.4,3.8L20.7,7.3L22,5.7M6.3,3.8L5,2.2L0.7,5.7L2,7.3L6.3,3.8Z"/>
              </svg>
            </div>
            <div class="preview-title">${nameVal}</div>
            <span class="preview-badge ${this._editing ? "edit" : "new"}">${this._editing ? "EDITANDO" : "PROGRAMADA"}</span>
          </div>
          <div class="preview-time">${timeVal}</div>
          <div class="preview-sub">${daysVal}</div>
          ${speakerVal
            ? html`
                <div class="preview-speaker">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
                  </svg>
                  <span>Altavoz: ${speakerVal}</span>
                </div>
              `
            : nothing}
        </div>

        ${this._haForm
          ? html`<ha-form
              .hass=${this.hass}
              .data=${this._draft}
              .schema=${this._schema()}
              .computeLabel=${this._label}
              @value-changed=${this._formChanged}
            ></ha-form>`
          : html`
              <p class="warn">
                Home Assistant's form components did not load, so this is a reduced editor.
              </p>
              <label>Name<input .value=${this._draft.name ?? ""} @input=${(e: any) =>
                (this._draft = { ...this._draft, name: e.target.value })} /></label>
              <label>Time<input type="time" .value=${this._draft.time ?? "07:00"} @input=${(e: any) =>
                (this._draft = { ...this._draft, time: e.target.value })} /></label>
              <label>Media player<input .value=${this._draft.media_player ?? ""} @input=${(e: any) =>
                (this._draft = { ...this._draft, media_player: e.target.value })} /></label>
              <label>Source<input .value=${this._draft.source_uri ?? ""} @input=${(e: any) =>
                (this._draft = { ...this._draft, source_uri: e.target.value })} /></label>
            `}
        <div class="dialog-actions">
          <button @click=${this._closeDialog}>Cancel</button>
          <button class="primary" @click=${this._save}>Save</button>
        </div>
      </div>
    `;
  }

  private _renderTestModal() {
    if (!this._testingAlarm) return nothing;
    const alarm = this._testingAlarm;
    const days = this._formatAlarmDays(alarm, false);
    const speaker = this._formatSpeaker(alarm.media_player);
    const app = this._appearance;
    const fontFamily = getAlarmFontFamily(app.font);
    const mult = Math.max(0.7, Math.min(1.4, app.scale / 100));

    return html`
      <div class="test-overlay" @click=${() => this._stopTest()}></div>
      <div class="test-stage" role="dialog" aria-modal="true">
        <!-- 100% exact replica of assets/alarm.png -->
        <div
          class="official-alarm-card"
          style="
            background-color: ${app.cardBgColor};
            font-family: ${fontFamily};
          "
        >
          <!-- Top Row: Circle icon + Title on left, Badge on right -->
          <div class="official-alarm-header">
            <div class="official-title-wrap">
              ${app.showIcon
                ? html`
                    <div class="official-alarm-icon">
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L16.2,17.2L17,15.9L12.5,13.2V8M22,5.7L17.7,2.2L16.4,3.8L20.7,7.3L22,5.7M6.3,3.8L5,2.2L0.7,5.7L2,7.3L6.3,3.8Z"/>
                      </svg>
                    </div>
                  `
                : nothing}
              <span class="official-alarm-name" style="color: ${app.textColor};">
                ${alarm.name || "Despertador"}
              </span>
            </div>
            <span
              class="official-alarm-badge"
              style="
                background-color: ${app.badgeBgColor};
                color: ${app.badgeTextColor};
              "
            >
              PROGRAMADA
            </span>
          </div>

          <!-- Center: Massive Time in Google Sans -->
          <div
            class="official-alarm-time"
            style="
              color: ${app.timeColor};
              font-weight: ${app.weight};
              font-size: calc(6.25rem * ${mult});
              ${app.glow ? "text-shadow: 0 0 18px rgba(255, 255, 255, 0.45);" : ""}
            "
          >
            ${alarm.time}
          </div>

          <!-- Recurrence Text: Lunes a Viernes -->
          <div class="official-alarm-days" style="color: ${app.textColor};">
            ${days}
          </div>

          <!-- Speaker Row: Altavoz: Salón -->
          ${app.showSpeaker && alarm.media_player
            ? html`
                <div class="official-alarm-speaker" style="color: ${app.subColor};">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
                  </svg>
                  <span>Altavoz: ${speaker}</span>
                </div>
              `
            : nothing}
        </div>

        <!-- Floating action buttons below the card -->
        <div class="official-test-actions">
          <button class="official-btn-stop" @click=${() => this._stopTest()}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M6,6H18V18H6V6Z"/>
            </svg>
            Detener sonido
          </button>
          <button class="official-btn-close" @click=${() => (this._testingAlarm = null)}>
            Cerrar
          </button>
        </div>
      </div>
    `;
  }

  private _renderEmpty() {
    if (!this._canCreate) {
      return html`<div class="empty">
        An administrator has not given you access to any speakers yet, so there is
        nowhere for an alarm to play.
      </div>`;
    }
    return html`<div class="empty">No alarms yet. Use Add alarm to create one.</div>`;
  }

  private _renderAlarms() {
    if (!this._loaded) return html`<div class="empty">Loading…</div>`;
    if (this._alarms.length === 0) return this._renderEmpty();
    return this._alarms.map((a) => this._renderAlarm(a));
  }

  protected render() {
    return html`
      <div class="header">
        <h1>Wakey</h1>
        <div class="tabs">
          <button
            class=${this._view === "alarms" ? "selected" : ""}
            @click=${() => (this._view = "alarms")}
          >
            Alarmas
          </button>
          <button
            class=${this._view === "settings" ? "selected" : ""}
            @click=${() => (this._view = "settings")}
          >
            Ajustes de Alarmas
          </button>
          ${this._isAdmin
            ? html`<button
                class=${this._view === "admin" ? "selected" : ""}
                @click=${() => (this._view = "admin")}
              >
                Personas
              </button>`
            : nothing}
        </div>
        ${this._view === "alarms" && this._canCreate
          ? html`<button class="primary" @click=${this._openNew}>Añadir alarma</button>`
          : nothing}
      </div>

      <div class="body">
        ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
        ${this._view === "admin"
          ? html`<wakey-admin
              .hass=${this.hass}
              .alarms=${this._alarms}
              .haForm=${this._haForm}
            ></wakey-admin>`
          : this._view === "settings"
            ? html`<wakey-alarm-settings
                .hass=${this.hass}
                .alarms=${this._alarms}
              ></wakey-alarm-settings>`
            : html`${this._renderRinging()} ${this._renderAlarms()}`}
      </div>

      ${this._renderDialog()}
      ${this._adjusting ? this._renderAdjustDialog() : nothing}
      ${this._testingAlarm ? this._renderTestModal() : nothing}
    `;
  }

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--primary-background-color, #f5f5f5);
      color: var(--primary-text-color, #212121);
      font-family: var(--paper-font-body1_-_font-family, inherit);
    }
    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      background: var(--app-header-background-color, var(--primary-color, #03a9f4));
      color: var(--app-header-text-color, #fff);
    }
    .header h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 400;
      flex: 1;
    }
    .body {
      padding: 16px;
      max-width: 720px;
      margin: 0 auto;
      padding-bottom: calc(24px + var(--safe-area-inset-bottom, 0px));
    }
    .card {
      background: var(--card-background-color, #fff);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
      padding: 16px;
      margin-bottom: 12px;
    }
    .card.dim {
      opacity: 0.55;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .grow {
      flex: 1;
      min-width: 0;
    }
    .time {
      font-size: clamp(2rem, 9vw, 2.75rem);
      font-variant-numeric: tabular-nums;
      line-height: 1;
      font-weight: 300;
    }
    .name {
      font-weight: 500;
    }
    .sub {
      color: var(--secondary-text-color, #727272);
      font-size: 13px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .right {
      text-align: right;
    }
    .next {
      font-size: 12px;
      color: var(--secondary-text-color, #727272);
      margin-top: 4px;
    }
    .flags {
      margin-top: 10px;
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .flag {
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 10px;
      background: var(--secondary-background-color, #e0e0e0);
    }
    .flag.ring {
      background: var(--error-color, #db4437);
      color: #fff;
    }
    .actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 12px;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      padding-top: 12px;
    }
    button {
      font: inherit;
      font-size: 14px;
      padding: 8px 14px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: transparent;
      color: var(--primary-color, #03a9f4);
      cursor: pointer;
    }
    button.primary {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: transparent;
    }
    button.danger {
      color: var(--error-color, #db4437);
    }
    .tabs {
      display: flex;
      gap: 4px;
    }
    .tabs button {
      color: inherit;
      border-color: transparent;
      opacity: 0.75;
    }
    .tabs button.selected {
      opacity: 1;
      border-bottom: 2px solid currentColor;
      border-radius: 8px 8px 0 0;
    }
    .banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      margin-bottom: 12px;
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--error-color, #db4437);
      color: #fff;
    }
    .banner button {
      color: #fff;
      border-color: rgba(255, 255, 255, 0.6);
    }
    .banner .sub {
      color: rgba(255, 255, 255, 0.85);
    }
    .empty,
    .error {
      padding: 32px 16px;
      text-align: center;
      color: var(--secondary-text-color, #727272);
    }
    .error {
      color: var(--error-color, #db4437);
    }
    .scrim {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      z-index: 10;
    }
    .dialog {
      position: fixed;
      z-index: 11;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: min(560px, calc(100vw - 32px));
      max-height: calc(100vh - 64px);
      overflow: auto;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      border-radius: var(--ha-card-border-radius, 12px);
      padding: 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    .dialog .hint {
      margin: -8px 0 16px;
      font-size: 13px;
      line-height: 1.4;
      color: var(--secondary-text-color, #727272);
    }
    .dialog h2 {
      margin: 0 0 16px;
      font-size: 18px;
      font-weight: 500;
    }
    .dialog label {
      display: block;
      margin-bottom: 12px;
      font-size: 13px;
      color: var(--secondary-text-color, #727272);
    }
    .dialog input {
      display: block;
      width: 100%;
      box-sizing: border-box;
      margin-top: 4px;
      padding: 8px;
      font: inherit;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 20px;
    }
    .warn {
      color: var(--warning-color, #ffa600);
      font-size: 13px;
    }
    .speaker-sub {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .speaker-sub ha-icon {
      --mdc-icon-size: 14px;
    }
    .btn-test {
      color: #1a73e8;
      border-color: rgba(26, 115, 232, 0.3);
      display: inline-flex;
      align-items: center;
    }
    .btn-test:hover {
      background: rgba(26, 115, 232, 0.08);
    }
    .live-alarm-preview {
      background: #282a2d;
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 22px 26px;
      margin-bottom: 20px;
      font-family: 'Google Sans', var(--ha-font-family, Roboto, sans-serif);
      text-align: center;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    }
    .live-alarm-preview .preview-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .live-alarm-preview .preview-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      flex-shrink: 0;
    }
    .live-alarm-preview .preview-title {
      font-size: 18px;
      font-weight: 500;
      color: #ffffff;
      margin: 0 12px;
      flex: 1;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .live-alarm-preview .preview-badge {
      font-size: 11px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 12px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      flex-shrink: 0;
    }
    .live-alarm-preview .preview-badge.new {
      background: #c3e8cd;
      color: #137333;
    }
    .live-alarm-preview .preview-badge.edit {
      background: #c2e7ff;
      color: #004a77;
    }
    .live-alarm-preview .preview-time {
      font-size: 54px;
      font-weight: 400;
      color: #f7f6f2;
      line-height: 1;
      letter-spacing: -1.5px;
      margin: 8px 0 4px 0;
      font-variant-numeric: tabular-nums;
    }
    .live-alarm-preview .preview-sub {
      font-size: 16px;
      color: #e8eaed;
      margin-bottom: 4px;
    }
    .live-alarm-preview .preview-speaker {
      font-size: 14px;
      color: #dadce0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: 4px;
    }

    /* Official Alarm View matching assets/alarm.png */
    .test-overlay {
      position: fixed;
      inset: 0;
      background: rgba(14, 15, 17, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      z-index: 1000;
      animation: official-fade-in 200ms ease;
    }
    .test-stage {
      position: fixed;
      z-index: 1001;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: min(520px, calc(100vw - 32px));
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 22px;
      animation: official-scale-in 240ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    .official-alarm-card {
      width: 100%;
      background-color: #282a2d;
      border-radius: 28px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.65), 0 2px 10px rgba(0, 0, 0, 0.3);
      box-sizing: border-box;
      padding: 38px 42px 34px 42px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      user-select: none;
    }
    .official-alarm-header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .official-title-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }
    .official-alarm-icon {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      flex-shrink: 0;
    }
    .official-alarm-name {
      font-size: 24px;
      font-weight: 400;
      letter-spacing: -0.01em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .official-alarm-badge {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.06em;
      padding: 6px 18px;
      border-radius: 20px;
      text-transform: uppercase;
      background: #c3e8cd;
      color: #137333;
      flex-shrink: 0;
    }
    .official-alarm-time {
      line-height: 1;
      font-variant-numeric: tabular-nums;
      margin: 36px 0 16px 0;
      letter-spacing: -2px;
      font-family: inherit;
      color: #f7f6f2;
    }
    .official-alarm-days {
      font-size: 24px;
      font-weight: 400;
      margin-bottom: 12px;
    }
    .official-alarm-speaker {
      font-size: 19px;
      font-weight: 400;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 4px;
    }
    .official-test-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
    }
    .official-btn-stop {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #ea4335;
      color: #ffffff;
      border: none;
      padding: 11px 26px;
      border-radius: 24px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(234, 67, 53, 0.45);
      transition: transform 120ms ease, background 120ms ease;
    }
    .official-btn-stop:hover {
      background: #d93025;
      transform: translateY(-1px);
    }
    .official-btn-close {
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 11px 24px;
      border-radius: 24px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: background 120ms ease;
    }
    .official-btn-close:hover {
      background: rgba(255, 255, 255, 0.22);
    }
    @keyframes official-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes official-scale-in {
      from { opacity: 0; transform: translate(-50%, -46%) scale(0.95); }
      to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
  `;
}

if (!customElements.get("wakey-panel")) {
  customElements.define("wakey-panel", WakeyPanel);
}

declare global {
  interface HTMLElementTagNameMap {
    "wakey-panel": WakeyPanel;
  }
}
