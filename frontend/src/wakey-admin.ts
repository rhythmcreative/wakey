import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type {
  Alarm,
  HomeAssistant,
  OrphanedAlarm,
  UserPolicy,
  WakeyUser,
} from "./types";

/**
 * The permissions screen.
 *
 * Two jobs: decide which speakers each household member may point an alarm
 * at, and say who owns the alarms that have no owner — which, after upgrading
 * from a single-user Wakey, is all of them.
 */
@customElement("wakey-admin")
export class WakeyAdmin extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public alarms: Alarm[] = [];
  @property({ attribute: false }) public haForm = false;

  @state() private _users: WakeyUser[] = [];
  @state() private _policies: Record<string, UserPolicy> = {};
  @state() private _orphans: Record<string, OrphanedAlarm[]> = {};
  @state() private _error: string | null = null;
  @state() private _loaded = false;

  private _saveTimers: Record<string, number> = {};

  public connectedCallback(): void {
    super.connectedCallback();
    this._load();
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    for (const timer of Object.values(this._saveTimers)) clearTimeout(timer);
    this._saveTimers = {};
  }

  private async _load(): Promise<void> {
    try {
      const [users, policies] = await Promise.all([
        this.hass.callWS<{ users: WakeyUser[] }>({ type: "wakey/users/list" }),
        this.hass.callWS<{ policies: Record<string, UserPolicy> }>({
          type: "wakey/policy/list",
        }),
      ]);
      this._users = users.users;
      this._policies = policies.policies;
      this._loaded = true;
    } catch (err: any) {
      this._error = err?.message ?? String(err);
      this._loaded = true;
    }
  }

  private _allowed(userId: string): string[] {
    return this._policies[userId]?.allowed_media_players ?? [];
  }

  // --- speaker permissions -------------------------------------------------

  private _policyChanged(user: WakeyUser, ev: CustomEvent) {
    const players: string[] = (ev.detail as any).value?.allowed_media_players ?? [];
    // Optimistic, so the picker doesn't fight the user while typing.
    this._policies = {
      ...this._policies,
      [user.id]: { user_id: user.id, allowed_media_players: players },
    };

    clearTimeout(this._saveTimers[user.id]);
    this._saveTimers[user.id] = window.setTimeout(() => this._savePolicy(user), 600);
  }

  private async _savePolicy(user: WakeyUser): Promise<void> {
    try {
      const result = await this.hass.callWS<{
        policy: UserPolicy;
        orphaned_alarms: OrphanedAlarm[];
      }>({
        type: "wakey/policy/set",
        user_id: user.id,
        allowed_media_players: this._allowed(user.id),
      });
      this._policies = { ...this._policies, [user.id]: result.policy };
      this._orphans = { ...this._orphans, [user.id]: result.orphaned_alarms };
      this._error = null;
    } catch (err: any) {
      this._error = err?.message ?? String(err);
    }
  }

  private _policySchema() {
    return [
      {
        name: "allowed_media_players",
        selector: {
          entity: { multiple: true, filter: { domain: "media_player" } },
        },
      },
    ];
  }

  private _renderUser(user: WakeyUser) {
    const allowed = this._allowed(user.id);
    const orphans = this._orphans[user.id] ?? [];

    return html`
      <div class="card">
        <div class="row">
          <div class="grow">
            <div class="name">${user.name || "Unnamed user"}</div>
            <div class="sub">
              ${user.is_admin
                ? "Administrator — every speaker"
                : allowed.length === 0
                  ? "No speakers yet"
                  : `${allowed.length} speaker${allowed.length === 1 ? "" : "s"}`}
            </div>
          </div>
        </div>
        ${user.is_admin
          ? nothing
          : html`
              <div class="form">
                ${this.haForm
                  ? html`<ha-form
                      .hass=${this.hass}
                      .data=${{ allowed_media_players: allowed }}
                      .schema=${this._policySchema()}
                      .computeLabel=${() => "Allowed speakers"}
                      @value-changed=${(ev: CustomEvent) =>
                        this._policyChanged(user, ev)}
                    ></ha-form>`
                  : html`<label>
                      Allowed speakers (comma separated)
                      <input
                        .value=${allowed.join(", ")}
                        @change=${(e: any) =>
                          this._policyChanged(user, {
                            detail: {
                              value: {
                                allowed_media_players: e.target.value
                                  .split(",")
                                  .map((s: string) => s.trim())
                                  .filter(Boolean),
                              },
                            },
                          } as CustomEvent)}
                      />
                    </label>`}
              </div>
              ${orphans.length
                ? html`<div class="warn">
                    ${orphans.length} of ${user.name}'s alarms use a speaker they can
                    no longer choose:
                    ${orphans.map((o) => `${o.name} (${o.media_player})`).join(", ")}.
                    They will still go off — reassign or delete them.
                  </div>`
                : nothing}
            `}
      </div>
    `;
  }

  // --- ownership -----------------------------------------------------------

  private async _setOwner(alarmId: string, ownerId: string | null): Promise<void> {
    try {
      await this.hass.callWS({
        type: "wakey/set_owner",
        alarm_id: alarmId,
        owner_id: ownerId,
      });
      this._error = null;
    } catch (err: any) {
      this._error = err?.message ?? String(err);
    }
  }

  private get _unowned(): Alarm[] {
    return this.alarms.filter((a) => !a.owner_id);
  }

  private async _claimAll(): Promise<void> {
    const me = this.hass.user?.id;
    if (!me) return;
    for (const alarm of this._unowned) {
      await this._setOwner(alarm.id, me);
    }
  }

  private _renderOwnership() {
    if (!this.alarms.length) return nothing;

    return html`
      <h2>Who owns what</h2>
      ${this._unowned.length
        ? html`<div class="notice">
            <div class="grow">
              ${this._unowned.length}
              ${this._unowned.length === 1 ? "alarm has" : "alarms have"} no owner, so
              only administrators can see ${this._unowned.length === 1 ? "it" : "them"}.
            </div>
            <button class="primary" @click=${this._claimAll}>Assign all to me</button>
          </div>`
        : nothing}
      ${this.alarms.map(
        (alarm) => html`
          <div class="card">
            <div class="row">
              <div class="grow">
                <div class="name">${alarm.time} · ${alarm.name}</div>
                <div class="sub">${alarm.media_player || "no player"}</div>
              </div>
              <select
                .value=${alarm.owner_id ?? ""}
                @change=${(e: any) =>
                  this._setOwner(alarm.id, e.target.value || null)}
              >
                <option value="">Unassigned</option>
                ${this._users.map(
                  (u) => html`<option value=${u.id} ?selected=${u.id === alarm.owner_id}>
                    ${u.name || u.id}
                  </option>`
                )}
              </select>
            </div>
          </div>
        `
      )}
    `;
  }

  protected render() {
    if (!this._loaded) return html`<div class="empty">Loading…</div>`;

    return html`
      ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
      <h2>Speakers each person may use</h2>
      <p class="sub intro">
        Nobody gets a speaker until you grant it. Administrators always have all of
        them.
      </p>
      ${this._users.map((u) => this._renderUser(u))}
      ${this._renderOwnership()}
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    h2 {
      font-size: 16px;
      font-weight: 500;
      margin: 24px 0 4px;
    }
    .intro {
      margin: 0 0 12px;
    }
    .card {
      background: var(--card-background-color, #fff);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
      padding: 16px;
      margin-bottom: 12px;
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
    .name {
      font-weight: 500;
    }
    .sub {
      color: var(--secondary-text-color, #727272);
      font-size: 13px;
    }
    .form {
      margin-top: 8px;
    }
    .warn {
      margin-top: 10px;
      font-size: 13px;
      color: var(--warning-color, #ffa600);
    }
    .notice {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      margin-bottom: 12px;
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--secondary-background-color, #e0e0e0);
    }
    select,
    input {
      font: inherit;
      padding: 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
    }
    input {
      display: block;
      width: 100%;
      box-sizing: border-box;
      margin-top: 4px;
    }
    label {
      display: block;
      font-size: 13px;
      color: var(--secondary-text-color, #727272);
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
      white-space: nowrap;
    }
    button.primary {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: transparent;
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
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "wakey-admin": WakeyAdmin;
  }
}
