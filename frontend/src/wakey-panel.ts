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

const DAY_OPTIONS = DAY_LABELS.map((label, i) => ({ value: String(i), label }));

export class WakeyPanel extends LitElement {
  // Set as properties by the panel host, not as attributes.
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public narrow = false;

  @state() private _alarms: Alarm[] = [];
  @state() private _isAdmin = false;
  @state() private _allowedPlayers: string[] | null = null;
  @state() private _view: "alarms" | "admin" = "alarms";
  @state() private _loaded = false;
  @state() private _error: string | null = null;
  @state() private _dialogOpen = false;
  @state() private _editing: string | null = null;
  @state() private _draft: Record<string, any> = {};
  @state() private _adjusting: string | null = null;
  @state() private _adjustTime = "";
  @state() private _haForm = false;
  @state() private _testingAlarm: Alarm | null = null;

  private _unsub?: () => void;
  private _subscribed = false;

  public connectedCallback(): void {
    super.connectedCallback();
    if (!document.getElementById("wakey-google-sans-font")) {
      const link = document.createElement("link");
      link.id = "wakey-google-sans-font";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap";
      document.head.appendChild(link);
    }
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsub?.();
    this._unsub = undefined;
    this._subscribed = false;
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
      name: alarm.name,
      time: alarm.time,
      repeat: alarm.repeat,
      weekdays: alarm.weekdays.map(String),
      date: alarm.date ?? "",
      media_player: alarm.media_player ?? "",
      source_uri: alarm.source_uri ?? "",
      pre_alarm_duration_m: alarm.pre_alarm_duration_m,
      volume_fade_duration_s: alarm.volume_fade_duration_s,
      target_volume: alarm.target_volume,
      snooze_duration_m: alarm.snooze_duration_m,
      auto_dismiss_m: alarm.auto_dismiss_m,
    };
    this._dialogOpen = true;
  }

  private _closeDialog = () => {
    this._dialogOpen = false;
    this._editing = null;
  };

  private _formChanged = (ev: CustomEvent) => {
    this._draft = { ...this._draft, ...ev.detail.value };
  };

  private async _save() {
    const d = this._draft;
    const isEditing = Boolean(this._editing);
    const payload: Record<string, unknown> = {
      type: isEditing ? "wakey/update" : "wakey/create",
      name: (d.name ?? "").trim(),
      time: (d.time ?? "07:00").slice(0, 5),
      repeat: d.repeat ?? "daily",
      weekdays: (d.weekdays ?? []).map(Number).sort(),
      date: d.repeat === "once" ? d.date || null : null,
      media_player: d.media_player || null,
      source_uri: d.source_uri || null,
      pre_alarm_duration_m: Number(d.pre_alarm_duration_m ?? 0),
      volume_fade_duration_s: Number(d.volume_fade_duration_s ?? 0),
      target_volume: d.target_volume != null ? Number(d.target_volume) : null,
      snooze_duration_m: Number(d.snooze_duration_m ?? 9),
      auto_dismiss_m: Number(d.auto_dismiss_m ?? 30),
    };
    if (isEditing) payload.alarm_id = this._editing;

    if (await this._call(payload)) {
      this._closeDialog();
    }
  }

  // --- schema ------------------------------------------------------------

  private _schema() {
    const isOnce = this._draft.repeat === "once";
    const isNever = this._draft.repeat === "never";
    const isWeekly = !isOnce && !isNever;
    const playerOptions = (this._allowedPlayers ?? []).map((id) => ({
      value: id,
      label: this.hass.states[id]?.attributes.friendly_name ?? id,
    }));

    return [
      { name: "name", selector: { text: {} } },
      { name: "time", selector: { time: {} } },
      {
        name: "repeat",
        selector: {
          select: {
            options: [
              { value: "daily", label: "Selected days" },
              { value: "once", label: "Specific date (once)" },
              { value: "never", label: "Single ring (auto-delete)" },
            ],
            mode: "dropdown",
          },
        },
      },
      ...(isWeekly
        ? [
            {
              name: "weekdays",
              selector: {
                select: {
                  multiple: true,
                  mode: "list",
                  options: DAY_OPTIONS,
                },
              },
            },
          ]
        : []),
      ...(isOnce ? [{ name: "date", selector: { date: {} } }] : []),
      {
        name: "media_player",
        selector: {
          select: {
            options: playerOptions,
            mode: "dropdown",
          },
        },
      },
      { name: "source_uri", selector: { text: {} } },
      {
        name: "target_volume",
        selector: {
          number: {
            min: 0,
            max: 1,
            step: 0.05,
            mode: "slider",
          },
        },
      },
      {
        name: "volume_fade_duration_s",
        selector: {
          number: {
            min: 0,
            max: 300,
            step: 5,
            mode: "box",
            unit_of_measurement: "s",
          },
        },
      },
      {
        name: "pre_alarm_duration_m",
        selector: {
          number: {
            min: 0,
            max: 60,
            step: 1,
            mode: "box",
            unit_of_measurement: "min",
          },
        },
      },
      {
        name: "snooze_duration_m",
        selector: {
          number: {
            min: 1,
            max: 30,
            step: 1,
            mode: "box",
            unit_of_measurement: "min",
          },
        },
      },
      {
        name: "auto_dismiss_m",
        selector: {
          number: {
            min: 5,
            max: 120,
            step: 5,
            mode: "box",
            unit_of_measurement: "min",
          },
        },
      },
    ];
  }

  private _label = (schema: { name: string }) => {
    const labels: Record<string, string> = {
      name: "Name",
      time: "Time",
      repeat: "Repeat",
      weekdays: "Days of week",
      date: "Date",
      media_player: "Speaker",
      source_uri: "Audio URL or media-source URI",
      target_volume: "Target volume",
      volume_fade_duration_s: "Volume fade duration",
      pre_alarm_duration_m: "Pre-alarm duration (lights / smart home)",
      snooze_duration_m: "Snooze duration",
      auto_dismiss_m: "Auto-dismiss after",
    };
    return labels[schema.name] ?? schema.name;
  };

  // --- formatting --------------------------------------------------------

  private _formatAlarmDays(alarm: Alarm): string {
    if (alarm.repeat === "once") return alarm.date ?? "Una vez";
    if (alarm.repeat === "never") return alarm.date ? `${alarm.date} (Nunca)` : "Una vez";
    const weekdays = (alarm.weekdays || []).map(Number).sort((a, b) => a - b);
    if (weekdays.length === 5 && weekdays.every((d, i) => d === i)) return "Lunes a Viernes";
    if (weekdays.length === 2 && weekdays[0] === 5 && weekdays[1] === 6) return "Fines de semana";
    if (weekdays.length === 7) return "Todos los días";
    if (weekdays.length === 0) return "Sin días";
    const labels = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    return weekdays.map((d) => labels[d]).join(" a ");
  }

  private _formatSpeaker(mediaPlayer: string | undefined): string {
    if (!mediaPlayer) return "";
    return mediaPlayer
      .replace("media_player.", "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();
  }

  private _fmtNext(alarm: Alarm): string {
    if (!alarm.enabled) return "Disabled";
    if (alarm.skip_next) return "Next occurrence skipped";
    if (alarm.next_occurrence) {
      const dt = new Date(alarm.next_occurrence);
      return `Next: ${dt.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      })} ${alarm.time}`;
    }
    return "Not scheduled";
  }

  private _fmtAdjusted(alarm: Alarm): string {
    if (!alarm.override_for || !alarm.override_time) return "";
    const dt = new Date(alarm.override_for + "T00:00:00");
    const day = dt.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    return `One-time: ${day} at ${alarm.override_time}`;
  }

  // --- render helpers ----------------------------------------------------

  private _renderRinging() {
    const ringing = this._alarms.filter((a) => a.is_ringing || a.is_snoozed);
    if (ringing.length === 0) return nothing;
    return html`
      <div class="banner">
        <div class="grow">
          <div>${ringing.map((a) => a.name).join(", ")}</div>
          <div class="sub">
            ${ringing.some((a) => a.is_ringing) ? "Alarm ringing" : "Alarm snoozed"}
          </div>
        </div>
        <button @click=${() => this._call({ type: "wakey/snooze" })}>Snooze</button>
        <button @click=${() => this._call({ type: "wakey/dismiss" })}>Dismiss</button>
      </div>
    `;
  }

  private _renderDialog() {
    if (!this._dialogOpen) return nothing;

    return html`
      <div class="scrim" @click=${this._closeDialog}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>${this._editing ? "Edit alarm" : "New alarm"}</h2>

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

  private _renderAdjustDialog() {
    const alarm = this._alarms.find((a) => a.id === this._adjusting);
    if (!alarm) return nothing;

    return html`
      <div class="scrim" @click=${() => (this._adjusting = null)}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>Adjust next occurrence: ${alarm.name}</h2>
        <p>Change the time for the next scheduled occurrence without editing the recurring schedule.</p>
        <label>
          New time
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

  private _renderTestModal() {
    if (!this._testingAlarm) return nothing;
    const alarm = this._testingAlarm;
    const days = this._formatAlarmDays(alarm);
    const speaker = this._formatSpeaker(alarm.media_player);

    return html`
      <div class="test-overlay" @click=${() => this._stopTest()}></div>
      <div class="test-stage" role="dialog" aria-modal="true">
        <!-- 1:1 pixel match of assets/alarm.png -->
        <div class="official-alarm-card">
          <!-- Top Row: Circle icon + Title on left, Badge on right -->
          <div class="official-alarm-header">
            <div class="official-title-wrap">
              <div class="official-alarm-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L16.2,17.2L17,15.9L12.5,13.2V8M22,5.7L17.7,2.2L16.4,3.8L20.7,7.3L22,5.7M6.3,3.8L5,2.2L0.7,5.7L2,7.3L6.3,3.8Z"/>
                </svg>
              </div>
              <span class="official-alarm-name">${alarm.name || "Despertador"}</span>
            </div>
            <span class="official-alarm-badge">SONANDO</span>
          </div>

          <!-- Center: Massive Time in Google Sans -->
          <div class="official-alarm-time">
            ${alarm.time}
          </div>

          <!-- Recurrence Text: Lunes a Viernes -->
          <div class="official-alarm-days">
            ${days}
          </div>

          <!-- Speaker Row: Altavoz: Salón -->
          ${speaker
            ? html`
                <div class="official-alarm-speaker">
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

  private _renderAlarm(alarm: Alarm) {
    const days =
      alarm.repeat === "once"
        ? (alarm.date ?? "Once")
        : alarm.repeat === "never"
          ? (alarm.date ? `${alarm.date} (Never)` : "Never (auto-delete)")
          : alarm.weekdays.length === 7
            ? "Every day"
            : alarm.weekdays.length === 0
              ? "No days selected"
              : alarm.weekdays.map((d) => DAY_LABELS[d]).join(" ");

    return html`
      <div class="card ${alarm.enabled ? "" : "dim"}">
        <div class="row">
          <div class="time">${alarm.time}</div>
          <div class="grow">
            <div class="name">${alarm.name}</div>
            <div class="sub">${days}</div>
            <div class="sub">${alarm.media_player || "no player"}</div>
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
        <div class="actions">
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
        </div>
      </div>
    `;
  }

  protected render() {
    const admin = this._view === "admin";
    return html`
      <div class="header">
        <h1>Wakey</h1>
        ${this._isAdmin
          ? html`<div class="tabs">
              <button
                class=${admin ? "" : "selected"}
                @click=${() => (this._view = "alarms")}
              >
                Alarms
              </button>
              <button
                class=${admin ? "selected" : ""}
                @click=${() => (this._view = "admin")}
              >
                People
              </button>
            </div>`
          : nothing}
        ${!admin && this._canCreate
          ? html`<button class="primary" @click=${this._openNew}>Add alarm</button>`
          : nothing}
      </div>

      <div class="body">
        ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
        ${admin
          ? html`<wakey-admin
              .hass=${this.hass}
              .alarms=${this._alarms}
              .haForm=${this._haForm}
            ></wakey-admin>`
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
      transition: opacity 120ms ease;
    }
    .card.dim {
      opacity: 0.55;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .time {
      font-size: 36px;
      font-weight: 300;
      letter-spacing: -0.5px;
      min-width: 100px;
    }
    .grow {
      flex: 1;
      min-width: 0;
    }
    .name {
      font-size: 16px;
      font-weight: 500;
    }
    .sub {
      font-size: 13px;
      color: var(--secondary-text-color, #757575);
      margin-top: 2px;
    }
    .right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
    }
    .next {
      font-size: 11px;
      color: var(--secondary-text-color, #757575);
    }
    .flags {
      display: flex;
      gap: 6px;
      margin-top: 8px;
      flex-wrap: wrap;
    }
    .flag {
      font-size: 11px;
      font-weight: 500;
      padding: 2px 8px;
      border-radius: 9999px;
      background: var(--secondary-background-color, #e0e0e0);
      color: var(--primary-text-color, #212121);
    }
    .flag.ring {
      background: var(--error-color, #db4437);
      color: #fff;
    }
    .actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      flex-wrap: wrap;
    }
    button {
      background: transparent;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 13px;
      cursor: pointer;
      color: inherit;
    }
    button.primary {
      background: var(--primary-color, #03a9f4);
      color: #fff;
      border-color: transparent;
    }
    button.danger {
      color: var(--error-color, #db4437);
      border-color: transparent;
    }
    button.btn-test {
      color: var(--primary-color, #03a9f4);
      border-color: rgba(3, 169, 244, 0.35);
    }
    .scrim {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 99;
    }
    .dialog {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--card-background-color, #fff);
      border-radius: var(--ha-card-border-radius, 16px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
      padding: 20px;
      width: min(480px, calc(100vw - 32px));
      max-height: 85vh;
      overflow-y: auto;
      z-index: 100;
    }
    .dialog h2 {
      margin-top: 0;
    }
    .dialog label {
      display: block;
      margin-top: 12px;
      font-size: 13px;
    }
    .dialog input {
      width: 100%;
      box-sizing: border-box;
      padding: 8px;
      margin-top: 4px;
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
    .empty {
      text-align: center;
      padding: 48px 16px;
      color: var(--secondary-text-color, #757575);
    }
    .error {
      background: var(--error-color, #db4437);
      color: #fff;
      padding: 8px 12px;
      border-radius: 8px;
      margin-bottom: 12px;
      font-size: 13px;
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

    /* Official Alarm Test Modal (1:1 with assets/alarm.png) */
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
      gap: 20px;
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
      -webkit-user-select: none;
      font-family: 'Google Sans', Roboto, -apple-system, BlinkMacSystemFont, sans-serif;
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
      gap: 14px;
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
      color: #ffffff;
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
      font-size: 96px;
      font-weight: 400;
      line-height: 1;
      font-variant-numeric: tabular-nums;
      font-feature-settings: 'tnum' 1;
      margin: 36px 0 16px 0;
      letter-spacing: -2px;
      color: #f7f6f2;
    }
    .official-alarm-days {
      font-size: 24px;
      font-weight: 400;
      color: #e8eaed;
      margin-bottom: 12px;
      letter-spacing: -0.01em;
    }
    .official-alarm-speaker {
      font-size: 19px;
      font-weight: 400;
      color: #dadce0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .official-test-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      justify-content: center;
      width: 100%;
    }
    .official-btn-stop {
      background: #d93025;
      color: #ffffff;
      border: none;
      border-radius: 9999px;
      padding: 12px 24px;
      font-size: 15px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(217, 48, 37, 0.4);
      transition: background 0.15s ease, transform 0.15s ease;
    }
    .official-btn-stop:hover {
      background: #b3261e;
      transform: translateY(-1px);
    }
    .official-btn-close {
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
      border: none;
      border-radius: 9999px;
      padding: 12px 24px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .official-btn-close:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    @keyframes official-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes official-scale-in {
      from { opacity: 0; transform: translate(-50%, -46%) scale(0.96); }
      to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
  `;
}

customElements.define("wakey-panel", WakeyPanel);
