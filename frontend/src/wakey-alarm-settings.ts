import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { Alarm, HomeAssistant } from "./types";

export interface AlarmAppearanceConfig {
  style: "official" | "compact" | "minimal";
  font: string;
  weight: string;
  is24h: boolean;
  showSpeaker: boolean;
  showIcon: boolean;
  glow: boolean;
  scale: number;
  timeColor: string;
  cardBgColor: string;
  badgeBgColor: string;
  badgeTextColor: string;
  textColor: string;
  subColor: string;
  pageBgColor: string;
}

export const DEFAULT_ALARM_APPEARANCE: AlarmAppearanceConfig = {
  style: "official",
  font: "Google Sans",
  weight: "400",
  is24h: true,
  showSpeaker: true,
  showIcon: true,
  glow: false,
  scale: 100,
  timeColor: "#f7f6f2",
  cardBgColor: "#282a2d",
  badgeBgColor: "#c3e8cd",
  badgeTextColor: "#137333",
  textColor: "#e8eaed",
  subColor: "#dadce0",
  pageBgColor: "#1e1f22",
};

export const ALARM_APPEARANCE_KEY = "wakey_alarm_appearance";

export function loadAlarmAppearance(): AlarmAppearanceConfig {
  try {
    const raw = localStorage.getItem(ALARM_APPEARANCE_KEY);
    if (raw) {
      return { ...DEFAULT_ALARM_APPEARANCE, ...JSON.parse(raw) };
    }
  } catch {
    // fallback
  }
  return { ...DEFAULT_ALARM_APPEARANCE };
}

export function getAlarmFontFamily(font: string): string {
  const fonts: Record<string, string> = {
    "Google Sans": "'Google Sans', var(--ha-font-family, Roboto, system-ui, sans-serif)",
    Rubik: "'Rubik', sans-serif",
    Nunito: "'Nunito', sans-serif",
    Inter: "'Inter', sans-serif",
    Oswald: "'Oswald', sans-serif",
    "Roboto Slab": "'Roboto Slab', serif",
    monospace: "'Courier New', Courier, monospace",
  };
  return fonts[font] || fonts["Google Sans"];
}

export class WakeyAlarmSettings extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public alarms: Alarm[] = [];

  @state() private _config: AlarmAppearanceConfig = loadAlarmAppearance();
  @state() private _previewMode: "single" | "list" | "ringing" = "single";

  public connectedCallback(): void {
    super.connectedCallback();
    this._loadGoogleFonts();
  }

  private _loadGoogleFonts(): void {
    if (!document.getElementById("wakey-google-alarm-fonts")) {
      const link = document.createElement("link");
      link.id = "wakey-google-alarm-fonts";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=Nunito:wght@300;400;500;700&family=Oswald:wght@300;400;500;700&family=Roboto+Slab:wght@300;400;500;700&family=Rubik:wght@300;400;500;700&display=swap";
      document.head.appendChild(link);
    }
  }

  private _updateConfig(patch: Partial<AlarmAppearanceConfig>): void {
    this._config = { ...this._config, ...patch };
    try {
      localStorage.setItem(ALARM_APPEARANCE_KEY, JSON.stringify(this._config));
      window.dispatchEvent(
        new CustomEvent("wakey-appearance-changed", {
          detail: { config: this._config },
        })
      );
    } catch (e) {
      console.error("Failed to save appearance config", e);
    }
    this.requestUpdate();
  }

  private _resetDefaults(): void {
    this._config = { ...DEFAULT_ALARM_APPEARANCE };
    try {
      localStorage.setItem(ALARM_APPEARANCE_KEY, JSON.stringify(this._config));
      window.dispatchEvent(
        new CustomEvent("wakey-appearance-changed", {
          detail: { config: this._config },
        })
      );
    } catch (e) {
      console.error("Failed to reset appearance config", e);
    }
    this.requestUpdate();
  }

  private _getFontFamily(font: string): string {
    return getAlarmFontFamily(font);
  }

  // --- Render Previews ---------------------------------------------------

  /**
   * Renders the single alarm card matching assets/alarm.png
   */
  private _renderSingleAlarmCard() {
    const {
      font,
      weight,
      showSpeaker,
      showIcon,
      glow,
      scale,
      timeColor,
      cardBgColor,
      badgeBgColor,
      badgeTextColor,
      textColor,
      subColor,
    } = this._config;

    const fontFamily = this._getFontFamily(font);
    const mult = Math.max(0.7, Math.min(1.4, scale / 100));
    const timeSize = `calc(4.5rem * ${mult})`;
    const glowStyle = glow
      ? `text-shadow: 0 0 15px rgba(255, 255, 255, 0.45);`
      : "";

    return html`
      <div
        class="alarm-card-official single-preview"
        style="
          background-color: ${cardBgColor};
          font-family: ${fontFamily};
        "
      >
        <!-- Header -->
        <div class="alarm-header-row">
          <div class="alarm-title-group">
            ${showIcon
              ? html`
                  <div class="alarm-circle-icon">
                    <ha-icon icon="mdi:alarm"></ha-icon>
                  </div>
                `
              : nothing}
            <span class="alarm-name" style="color: ${textColor};"
              >Despertador</span
            >
          </div>
          <span
            class="alarm-pill-badge"
            style="
              background-color: ${badgeBgColor};
              color: ${badgeTextColor};
            "
          >
            PROGRAMADA
          </span>
        </div>

        <!-- Time -->
        <div
          class="alarm-time-large"
          style="
            color: ${timeColor};
            font-weight: ${weight};
            font-size: ${timeSize};
            ${glowStyle}
          "
        >
          07:30
        </div>

        <!-- Days -->
        <div class="alarm-days-label" style="color: ${textColor};">
          Lunes a Viernes
        </div>

        <!-- Speaker -->
        ${showSpeaker
          ? html`
              <div class="alarm-speaker-row" style="color: ${subColor};">
                <ha-icon icon="mdi:volume-high"></ha-icon>
                <span>Altavoz: Salón</span>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  /**
   * Renders the alarm list matching assets/alarm_list.png
   */
  private _renderListAlarmCard() {
    const {
      font,
      weight,
      showIcon,
      glow,
      scale,
      timeColor,
      cardBgColor,
      badgeBgColor,
      badgeTextColor,
      textColor,
      subColor,
    } = this._config;

    const fontFamily = this._getFontFamily(font);
    const mult = Math.max(0.7, Math.min(1.4, scale / 100));
    const timeSize = `calc(2.5rem * ${mult})`;
    const glowStyle = glow
      ? `text-shadow: 0 0 10px rgba(255, 255, 255, 0.4);`
      : "";

    return html`
      <div
        class="alarm-card-official list-preview"
        style="
          background-color: ${cardBgColor};
          font-family: ${fontFamily};
        "
      >
        <!-- Header -->
        <div class="alarm-header-row list-header">
          <div class="alarm-title-group">
            ${showIcon
              ? html`
                  <div class="alarm-circle-icon">
                    <ha-icon icon="mdi:alarm"></ha-icon>
                  </div>
                `
              : nothing}
            <span class="alarm-name" style="color: ${textColor};"
              >Tus Alarmas</span
            >
          </div>
          <span class="alarm-pill-badge counter-badge"> 2 activas </span>
        </div>

        <!-- Row 1 -->
        <div class="alarm-list-row">
          <div
            class="list-time"
            style="
              color: ${timeColor};
              font-weight: ${weight};
              font-size: ${timeSize};
              ${glowStyle}
            "
          >
            07:00
          </div>
          <div class="list-details" style="color: ${textColor};">
            Despertador • Lun-Vie
          </div>
          <span
            class="alarm-pill-badge active-tag"
            style="
              background-color: ${badgeBgColor};
              color: ${badgeTextColor};
            "
          >
            ACTIVA
          </span>
        </div>

        <!-- Row 2 -->
        <div class="alarm-list-row">
          <div
            class="list-time"
            style="
              color: ${timeColor};
              font-weight: ${weight};
              font-size: ${timeSize};
              ${glowStyle}
            "
          >
            08:30
          </div>
          <div class="list-details" style="color: ${textColor};">
            Gimnasio • Sáb, Dom
          </div>
          <span
            class="alarm-pill-badge active-tag"
            style="
              background-color: ${badgeBgColor};
              color: ${badgeTextColor};
            "
          >
            ACTIVA
          </span>
        </div>
      </div>
    `;
  }

  /**
   * Renders the ringing alarm view
   */
  private _renderRingingAlarmCard() {
    const { font, weight, cardBgColor, timeColor, textColor, subColor } =
      this._config;
    const fontFamily = this._getFontFamily(font);

    return html`
      <div
        class="alarm-card-official single-preview ringing-preview"
        style="
          background-color: ${cardBgColor};
          font-family: ${fontFamily};
          border: 2px solid #db4437;
        "
      >
        <div class="alarm-header-row">
          <div class="alarm-title-group">
            <div class="alarm-circle-icon ringing-pulse">
              <ha-icon icon="mdi:bell-ring"></ha-icon>
            </div>
            <span class="alarm-name" style="color: ${textColor};"
              >Alarma matutina</span
            >
          </div>
          <span class="alarm-pill-badge ringing-badge"> SONANDO AHORA </span>
        </div>

        <div
          class="alarm-time-large"
          style="color: ${timeColor}; font-weight: ${weight}; font-size: 4.5rem;"
        >
          07:30
        </div>

        <div class="alarm-days-label" style="color: ${textColor};">
          Lunes a Viernes
        </div>

        <div class="alarm-speaker-row" style="color: ${subColor};">
          <ha-icon icon="mdi:volume-high"></ha-icon>
          <span>Altavoz: Salón</span>
        </div>

        <div class="ringing-actions-bar">
          <button class="ring-btn snooze">
            <ha-icon icon="mdi:snooze"></ha-icon> Posponer 9 min
          </button>
          <button class="ring-btn dismiss">
            <ha-icon icon="mdi:alarm-off"></ha-icon> Apagar
          </button>
        </div>
      </div>
    `;
  }

  protected render() {
    return html`
      <div class="appearance-wrapper">
        <!-- Live Preview Showcase -->
        <div class="showcase-card">
          <div class="showcase-header">
            <div class="showcase-title">
              <ha-icon icon="mdi:palette-outline"></ha-icon>
              <span>Vista Previa del Diseño de Alarmas</span>
            </div>

            <!-- View Switcher -->
            <div class="view-switcher">
              <button
                class=${this._previewMode === "single" ? "active" : ""}
                @click=${() => (this._previewMode = "single")}
              >
                <ha-icon icon="mdi:card-bulleted"></ha-icon>
                <span>Individual (Oficial)</span>
              </button>
              <button
                class=${this._previewMode === "list" ? "active" : ""}
                @click=${() => (this._previewMode = "list")}
              >
                <ha-icon icon="mdi:format-list-bulleted"></ha-icon>
                <span>Lista</span>
              </button>
              <button
                class=${this._previewMode === "ringing" ? "active" : ""}
                @click=${() => (this._previewMode = "ringing")}
              >
                <ha-icon icon="mdi:bell-ring"></ha-icon>
                <span>Sonando</span>
              </button>
            </div>
          </div>

          <!-- Preview Stage with Canvas -->
          <div
            class="preview-stage"
            style="background-color: ${this._config.pageBgColor};"
          >
            ${this._previewMode === "single"
              ? this._renderSingleAlarmCard()
              : this._previewMode === "list"
                ? this._renderListAlarmCard()
                : this._renderRingingAlarmCard()}
          </div>
        </div>

        <!-- Controls Section -->
        <div class="controls-grid">
          <!-- Typography & Scale -->
          <div class="settings-card">
            <h3>Tipografía y Estilo de Hora</h3>

            <div class="control-row">
              <label for="font-select">Familia tipográfica</label>
              <select
                id="font-select"
                .value=${this._config.font}
                @change=${(e: any) =>
                  this._updateConfig({ font: e.target.value })}
              >
                <option value="Google Sans">Google Sans (Oficial Google)</option>
                <option value="Inter">Inter (Moderna y Limpia)</option>
                <option value="Rubik">Rubik (Geométrica Suave)</option>
                <option value="Nunito">Nunito (Estilo iOS / StandBy)</option>
                <option value="Oswald">Oswald (Números Grandes Display)</option>
                <option value="Roboto Slab">Roboto Slab (Con serifa)</option>
                <option value="monospace">Monospace (Dígitos Retro)</option>
              </select>
            </div>

            <div class="control-row">
              <label for="weight-select">Grosor de la hora</label>
              <select
                id="weight-select"
                .value=${this._config.weight}
                @change=${(e: any) =>
                  this._updateConfig({ weight: e.target.value })}
              >
                <option value="300">300 (Fino / Light)</option>
                <option value="400">400 (Regular / Normal)</option>
                <option value="500">500 (Medio)</option>
                <option value="700">700 (Negrita / Bold)</option>
              </select>
            </div>

            <div class="control-row slider-container">
              <div class="slider-title-row">
                <label>Tamaño / Escala de la tarjeta</label>
                <span class="slider-val">${this._config.scale}%</span>
              </div>
              <input
                type="range"
                min="75"
                max="135"
                step="5"
                .value=${String(this._config.scale)}
                @input=${(e: any) =>
                  this._updateConfig({ scale: Number(e.target.value) })}
              />
            </div>
          </div>

          <!-- Color Customizer -->
          <div class="settings-card">
            <h3>Colores y Temas</h3>

            <div class="color-picker-item">
              <div class="color-text">
                <div class="color-name">Fondo de la tarjeta</div>
                <div class="color-desc">Color principal del recuadro (#282a2d)</div>
              </div>
              <input
                type="color"
                .value=${this._config.cardBgColor}
                @input=${(e: any) =>
                  this._updateConfig({ cardBgColor: e.target.value })}
              />
            </div>

            <div class="color-picker-item">
              <div class="color-text">
                <div class="color-name">Dígitos de la hora</div>
                <div class="color-desc">Color numérico destacado (#f7f6f2)</div>
              </div>
              <input
                type="color"
                .value=${this._config.timeColor}
                @input=${(e: any) =>
                  this._updateConfig({ timeColor: e.target.value })}
              />
            </div>

            <div class="color-picker-item">
              <div class="color-text">
                <div class="color-name">Fondo de etiqueta "PROGRAMADA"</div>
                <div class="color-desc">Color de la pastilla (#c3e8cd)</div>
              </div>
              <input
                type="color"
                .value=${this._config.badgeBgColor}
                @input=${(e: any) =>
                  this._updateConfig({ badgeBgColor: e.target.value })}
              />
            </div>

            <div class="color-picker-item">
              <div class="color-text">
                <div class="color-name">Texto de etiqueta "PROGRAMADA"</div>
                <div class="color-desc">Color de la letra interior (#137333)</div>
              </div>
              <input
                type="color"
                .value=${this._config.badgeTextColor}
                @input=${(e: any) =>
                  this._updateConfig({ badgeTextColor: e.target.value })}
              />
            </div>

            <div class="color-picker-item">
              <div class="color-text">
                <div class="color-name">Fondo de página</div>
                <div class="color-desc">Fondo exterior de la interfaz (#1e1f22)</div>
              </div>
              <input
                type="color"
                .value=${this._config.pageBgColor}
                @input=${(e: any) =>
                  this._updateConfig({ pageBgColor: e.target.value })}
              />
            </div>
          </div>

          <!-- Elements & Toggles -->
          <div class="settings-card">
            <h3>Elementos Visibles</h3>

            <div class="toggle-item">
              <div class="toggle-text">
                <div class="toggle-name">Icono circular de alarma</div>
                <div class="toggle-desc">Muestra el icono redondeado en la cabecera</div>
              </div>
              <input
                type="checkbox"
                .checked=${this._config.showIcon}
                @change=${(e: any) =>
                  this._updateConfig({ showIcon: e.target.checked })}
              />
            </div>

            <div class="toggle-item">
              <div class="toggle-text">
                <div class="toggle-name">Altavoz asignado</div>
                <div class="toggle-desc">Muestra el altavoz o reproductor de destino</div>
              </div>
              <input
                type="checkbox"
                .checked=${this._config.showSpeaker}
                @change=${(e: any) =>
                  this._updateConfig({ showSpeaker: e.target.checked })}
              />
            </div>

            <div class="toggle-item">
              <div class="toggle-text">
                <div class="toggle-name">Resplandor suave (Glow)</div>
                <div class="toggle-desc">Ligera aura luminosa en la hora</div>
              </div>
              <input
                type="checkbox"
                .checked=${this._config.glow}
                @change=${(e: any) =>
                  this._updateConfig({ glow: e.target.checked })}
              />
            </div>

            <div class="footer-buttons">
              <button class="btn-restore" @click=${this._resetDefaults}>
                <ha-icon icon="mdi:restore"></ha-icon>
                Restablecer diseño oficial (alarm.png)
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      color: var(--primary-text-color, #212121);
    }

    .appearance-wrapper {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* Showcase Card */
    .showcase-card {
      background: var(--card-background-color, #fff);
      border-radius: 18px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
    }

    .showcase-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      padding: 14px 20px;
      background: rgba(0, 0, 0, 0.02);
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }

    .showcase-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 600;
    }

    .showcase-title ha-icon {
      color: var(--primary-color, #03a9f4);
    }

    .view-switcher {
      display: flex;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
      border-radius: 10px;
      padding: 3px;
      gap: 4px;
    }

    .view-switcher button {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      padding: 6px 12px;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: var(--secondary-text-color, #666);
      cursor: pointer;
      font-weight: 500;
      transition: all 180ms ease;
    }

    .view-switcher button.active {
      background: var(--card-background-color, #fff);
      color: var(--primary-color, #03a9f4);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      font-weight: 600;
    }

    .preview-stage {
      padding: 40px 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 380px;
      transition: background-color 250ms ease;
    }

    /* Official Alarm Card matching assets/alarm.png */
    .alarm-card-official {
      border-radius: 28px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
      box-sizing: border-box;
      user-select: none;
    }

    .alarm-card-official.single-preview {
      width: 100%;
      max-width: 520px;
      padding: 36px 40px 32px 40px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .alarm-header-row {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .alarm-title-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .alarm-circle-icon {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #e8eaed;
    }

    .alarm-circle-icon ha-icon {
      --mdc-icon-size: 24px;
    }

    .alarm-name {
      font-size: 22px;
      font-weight: 400;
      letter-spacing: -0.01em;
    }

    .alarm-pill-badge {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.06em;
      padding: 6px 16px;
      border-radius: 20px;
      text-transform: uppercase;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
    }

    .alarm-time-large {
      line-height: 1;
      letter-spacing: -0.03em;
      font-variant-numeric: tabular-nums;
      margin: 12px 0 16px 0;
    }

    .alarm-days-label {
      font-size: 24px;
      font-weight: 400;
      letter-spacing: -0.01em;
      margin-bottom: 16px;
    }

    .alarm-speaker-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 19px;
      font-weight: 400;
    }

    .alarm-speaker-row ha-icon {
      --mdc-icon-size: 22px;
    }

    /* List Card Preview matching assets/alarm_list.png */
    .alarm-card-official.list-preview {
      width: 100%;
      max-width: 540px;
      padding: 24px 28px;
    }

    .list-header {
      padding-bottom: 18px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      margin-bottom: 8px;
    }

    .counter-badge {
      background: rgba(255, 255, 255, 0.12);
      color: #e8eaed;
      text-transform: none;
      font-weight: 500;
      font-size: 14px;
    }

    .alarm-list-row {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 20px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .alarm-list-row:last-child {
      border-bottom: none;
      padding-bottom: 8px;
    }

    .list-time {
      line-height: 1;
      font-variant-numeric: tabular-nums;
      letter-spacing: -0.02em;
      min-width: 120px;
    }

    .list-details {
      flex: 1;
      font-size: 18px;
      font-weight: 400;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .active-tag {
      font-size: 12px;
      padding: 5px 14px;
    }

    /* Ringing Preview Actions */
    .ringing-actions-bar {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      width: 100%;
    }

    .ring-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 18px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      border: none;
      cursor: pointer;
    }

    .ring-btn.snooze {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
    }

    .ring-btn.dismiss {
      background: #db4437;
      color: #fff;
    }

    .ringing-pulse {
      animation: ring-pulse 1.3s infinite ease-in-out;
      background: rgba(219, 68, 55, 0.25);
      color: #db4437;
    }

    .ringing-badge {
      background: #db4437;
      color: #fff;
    }

    @keyframes ring-pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }

    /* Controls Grid */
    .controls-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }

    .settings-card {
      background: var(--card-background-color, #fff);
      border-radius: 14px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
      padding: 20px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }

    .settings-card h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .control-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 16px;
    }

    .control-row label {
      font-size: 14px;
      font-weight: 500;
    }

    select {
      font: inherit;
      font-size: 14px;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      outline: none;
    }

    select:focus {
      border-color: var(--primary-color, #03a9f4);
    }

    /* Slider */
    .slider-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .slider-val {
      font-weight: 600;
      color: var(--primary-color, #03a9f4);
    }

    input[type="range"] {
      width: 100%;
      accent-color: var(--primary-color, #03a9f4);
      cursor: pointer;
    }

    /* Color Item */
    .color-picker-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 10px 0;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }

    .color-picker-item:last-of-type {
      border-bottom: none;
    }

    .color-text {
      flex: 1;
    }

    .color-name {
      font-size: 14px;
      font-weight: 500;
    }

    .color-desc {
      font-size: 12px;
      color: var(--secondary-text-color, #727272);
      margin-top: 2px;
    }

    input[type="color"] {
      width: 40px;
      height: 40px;
      padding: 0;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px;
      background: none;
      cursor: pointer;
    }

    input[type="color"]::-webkit-color-swatch-wrapper {
      padding: 3px;
    }

    input[type="color"]::-webkit-color-swatch {
      border: none;
      border-radius: 6px;
    }

    /* Toggle Item */
    .toggle-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }

    .toggle-item:last-of-type {
      border-bottom: none;
    }

    .toggle-text {
      flex: 1;
    }

    .toggle-name {
      font-size: 14px;
      font-weight: 500;
    }

    .toggle-desc {
      font-size: 12px;
      color: var(--secondary-text-color, #727272);
      margin-top: 2px;
    }

    input[type="checkbox"] {
      width: 20px;
      height: 20px;
      accent-color: var(--primary-color, #03a9f4);
      cursor: pointer;
    }

    /* Footer Buttons */
    .footer-buttons {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }

    .btn-restore {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      padding: 8px 14px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ddd);
      background: transparent;
      color: var(--secondary-text-color, #666);
      cursor: pointer;
      transition: all 180ms ease;
    }

    .btn-restore:hover {
      color: var(--primary-color, #03a9f4);
      border-color: var(--primary-color, #03a9f4);
    }
  `;
}

if (!customElements.get("wakey-alarm-settings")) {
  customElements.define("wakey-alarm-settings", WakeyAlarmSettings);
}

declare global {
  interface HTMLElementTagNameMap {
    "wakey-alarm-settings": WakeyAlarmSettings;
  }
}
