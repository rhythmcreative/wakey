import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant } from "./types";

export interface ClockConfig {
  style: "digital" | "flip" | "roller" | "lcd";
  font: string;
  weight: string;
  is24h: boolean;
  showSeconds: boolean;
  showDate: boolean;
  glow: boolean;
  scale: number;
  clockColor: string;
  cardColor: string;
  bgColor: string;
}

const DEFAULT_CLOCK_CONFIG: ClockConfig = {
  style: "flip",
  font: "Google Sans",
  weight: "400",
  is24h: true,
  showSeconds: false,
  showDate: true,
  glow: false,
  scale: 100,
  clockColor: "#f5f5f7",
  cardColor: "#232328",
  bgColor: "#0d0d11",
};

const STORAGE_KEY = "wakey_clock_config";

export class WakeyClockSettings extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config: ClockConfig = { ...DEFAULT_CLOCK_CONFIG };
  @state() private _now: Date = new Date();
  @state() private _fullscreen = false;

  private _timer?: number;

  public connectedCallback(): void {
    super.connectedCallback();
    this._loadConfig();
    this._loadGoogleFonts();

    // Live clock ticker
    this._timer = window.setInterval(() => {
      this._now = new Date();
    }, 1000);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = undefined;
    }
  }

  private _loadConfig(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this._config = { ...DEFAULT_CLOCK_CONFIG, ...JSON.parse(raw) };
      }
    } catch {
      this._config = { ...DEFAULT_CLOCK_CONFIG };
    }
  }

  private _saveConfig(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._config));
      window.dispatchEvent(
        new CustomEvent("wakey-clock-settings-changed", {
          detail: { config: this._config },
        })
      );
    } catch (e) {
      console.error("Failed to save Wakey clock config", e);
    }
  }

  private _updateConfig(patch: Partial<ClockConfig>): void {
    this._config = { ...this._config, ...patch };
    this._saveConfig();
    this.requestUpdate();
  }

  private _loadGoogleFonts(): void {
    if (!document.getElementById("wakey-google-clock-fonts")) {
      const link = document.createElement("link");
      link.id = "wakey-google-clock-fonts";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&family=Nunito:wght@300;400;500;700;900&family=Oswald:wght@300;400;500;700&family=Roboto+Slab:wght@300;400;500;700;900&family=Rubik:wght@300;400;500;700;900&display=swap";
      document.head.appendChild(link);
    }
  }

  private _resetDefaults(): void {
    this._config = { ...DEFAULT_CLOCK_CONFIG };
    this._saveConfig();
  }

  private _getFontFamily(font: string): string {
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

  private _hexToRgb(hex: string): string {
    const clean = hex.replace("#", "");
    if (clean.length === 3) {
      const r = parseInt(clean[0] + clean[0], 16);
      const g = parseInt(clean[1] + clean[1], 16);
      const b = parseInt(clean[2] + clean[2], 16);
      return `${r}, ${g}, ${b}`;
    }
    if (clean.length === 6) {
      const r = parseInt(clean.slice(0, 2), 16);
      const g = parseInt(clean.slice(2, 4), 16);
      const b = parseInt(clean.slice(4, 6), 16);
      return `${r}, ${g}, ${b}`;
    }
    return "245, 245, 247";
  }

  // --- Clock Renderer ----------------------------------------------------

  private _renderClockView(isFullscreen = false) {
    const {
      style,
      font,
      weight,
      is24h,
      showSeconds,
      showDate,
      glow,
      scale,
      clockColor,
      cardColor,
    } = this._config;

    const fontFamily = this._getFontFamily(font);
    const clockRgb = this._hexToRgb(clockColor);
    const cardRgb = this._hexToRgb(cardColor);

    let hours = this._now.getHours();
    let ampm = "";
    if (!is24h) {
      ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      if (hours === 0) hours = 12;
    }

    const hoursStr = is24h ? String(hours).padStart(2, "0") : String(hours);
    const minsStr = String(this._now.getMinutes()).padStart(2, "0");
    const secsStr = String(this._now.getSeconds()).padStart(2, "0");
    const dateStr = this._now.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    const glowStyle = glow
      ? `text-shadow: 0 0 12px rgba(${clockRgb}, 0.85), 0 0 30px rgba(${clockRgb}, 0.45);`
      : "";

    const mult = Math.max(0.6, Math.min(2.5, scale / 100));

    if (isFullscreen) {
      const fsTime = `calc(min(18vw, 26vh) * ${mult})`;
      const fsDate = `calc(min(4.2vw, 6vh) * ${mult})`;
      const fsWidth = `calc(min(22vw, 30vh) * ${mult})`;
      const fsPad = `calc(min(2vw, 2.5vh) * ${mult}) calc(min(3vw, 3.5vh) * ${mult})`;

      return this._renderStyleHTML(
        style,
        fontFamily,
        weight,
        clockColor,
        clockRgb,
        cardColor,
        cardRgb,
        hoursStr,
        minsStr,
        secsStr,
        ampm,
        dateStr,
        fsTime,
        fsDate,
        fsWidth,
        fsPad,
        showSeconds,
        showDate,
        is24h,
        glowStyle,
        true
      );
    }

    // Panel preview sizing
    const timeSize = `${Math.round(44 * mult)}px`;
    const dateSize = `${Math.round(13 * mult)}px`;
    const cardWidth = `${Math.round(52 * mult)}px`;
    const cardPad = "8px 12px";

    return this._renderStyleHTML(
      style,
      fontFamily,
      weight,
      clockColor,
      clockRgb,
      cardColor,
      cardRgb,
      hoursStr,
      minsStr,
      secsStr,
      ampm,
      dateStr,
      timeSize,
      dateSize,
      cardWidth,
      cardPad,
      showSeconds,
      showDate,
      is24h,
      glowStyle,
      false
    );
  }

  private _renderStyleHTML(
    style: ClockConfig["style"],
    fontFamily: string,
    weight: string,
    clockColor: string,
    clockRgb: string,
    cardColor: string,
    _cardRgb: string,
    hoursStr: string,
    minsStr: string,
    secsStr: string,
    ampm: string,
    dateStr: string,
    timeSize: string,
    dateSize: string,
    cardWidth: string,
    cardPad: string,
    showSeconds: boolean,
    showDate: boolean,
    is24h: boolean,
    glowStyle: string,
    isFullscreen: boolean
  ) {
    if (style === "flip") {
      return html`
        <div
          class="clock-container"
          style="font-family:${fontFamily}; font-variant-numeric:tabular-nums; line-height:1;"
        >
          <div class="flip-row">
            <div
              class="flip-card"
              style="background:${cardColor}; min-width:${cardWidth}; padding:${cardPad};"
            >
              <span
                style="color:${clockColor}; font-weight:${weight}; font-size:${timeSize}; ${glowStyle}"
                >${hoursStr}</span
              >
              <div class="flip-divider"></div>
            </div>

            <div
              class="colon"
              style="color:${clockColor}; font-size:${timeSize}; font-weight:${weight};"
            >
              :
            </div>

            <div
              class="flip-card"
              style="background:${cardColor}; min-width:${cardWidth}; padding:${cardPad};"
            >
              <span
                style="color:${clockColor}; font-weight:${weight}; font-size:${timeSize}; ${glowStyle}"
                >${minsStr}</span
              >
              <div class="flip-divider"></div>
            </div>

            ${showSeconds
              ? html`
                  <div
                    class="colon"
                    style="color:${clockColor}; font-size:${timeSize}; font-weight:${weight};"
                  >
                    :
                  </div>
                  <div
                    class="flip-card"
                    style="background:${cardColor}; min-width:${cardWidth}; padding:${cardPad};"
                  >
                    <span
                      style="color:${clockColor}; font-weight:${weight}; font-size:${timeSize}; ${glowStyle}"
                      >${secsStr}</span
                    >
                    <div class="flip-divider"></div>
                  </div>
                `
              : nothing}
            ${!is24h
              ? html`<div
                  class="ampm-badge"
                  style="color:${clockColor}; font-size:${isFullscreen
                    ? "calc(min(3vw, 4vh))"
                    : "11px"};"
                >
                  ${ampm}
                </div>`
              : nothing}
          </div>
          ${showDate
            ? html`<div
                class="clock-date"
                style="color:rgba(${clockRgb}, 0.75); font-size:${dateSize};"
              >
                ${dateStr}
              </div>`
            : nothing}
        </div>
      `;
    }

    if (style === "roller") {
      return html`
        <div
          class="clock-container"
          style="font-family:${fontFamily}; font-variant-numeric:tabular-nums; line-height:1;"
        >
          <div class="roller-row">
            <div
              class="roller-card"
              style="background:linear-gradient(180deg, rgba(0,0,0,0.55) 0%, ${cardColor} 30%, ${cardColor} 70%, rgba(0,0,0,0.6) 100%); min-width:${cardWidth}; padding:${cardPad};"
            >
              <span
                style="color:${clockColor}; font-weight:${weight}; font-size:${timeSize}; ${glowStyle}"
                >${hoursStr}</span
              >
            </div>

            <div
              class="colon"
              style="color:${clockColor}; font-size:${timeSize}; font-weight:${weight};"
            >
              :
            </div>

            <div
              class="roller-card"
              style="background:linear-gradient(180deg, rgba(0,0,0,0.55) 0%, ${cardColor} 30%, ${cardColor} 70%, rgba(0,0,0,0.6) 100%); min-width:${cardWidth}; padding:${cardPad};"
            >
              <span
                style="color:${clockColor}; font-weight:${weight}; font-size:${timeSize}; ${glowStyle}"
                >${minsStr}</span
              >
            </div>

            ${showSeconds
              ? html`
                  <div
                    class="colon"
                    style="color:${clockColor}; font-size:${timeSize}; font-weight:${weight};"
                  >
                    :
                  </div>
                  <div
                    class="roller-card"
                    style="background:linear-gradient(180deg, rgba(0,0,0,0.55) 0%, ${cardColor} 30%, ${cardColor} 70%, rgba(0,0,0,0.6) 100%); min-width:${cardWidth}; padding:${cardPad};"
                  >
                    <span
                      style="color:${clockColor}; font-weight:${weight}; font-size:${timeSize}; ${glowStyle}"
                      >${secsStr}</span
                    >
                  </div>
                `
              : nothing}
            ${!is24h
              ? html`<div
                  class="ampm-badge"
                  style="color:${clockColor}; font-size:${isFullscreen
                    ? "calc(min(3vw, 4vh))"
                    : "11px"};"
                >
                  ${ampm}
                </div>`
              : nothing}
          </div>
          ${showDate
            ? html`<div
                class="clock-date"
                style="color:rgba(${clockRgb}, 0.75); font-size:${dateSize};"
              >
                ${dateStr}
              </div>`
            : nothing}
        </div>
      `;
    }

    if (style === "lcd") {
      const timeText = `${hoursStr}:${minsStr}${showSeconds ? `:${secsStr}` : ""}${!is24h ? ` ${ampm}` : ""}`;
      const ghostText = timeText.replace(/[0-9]/g, "8").replace(/[A-Za-z]/g, "8");

      return html`
        <div
          class="clock-container"
          style="font-family:'Courier New', monospace; line-height:1;"
        >
          <div
            class="lcd-bezel"
            style="background:${cardColor}; padding:${isFullscreen
              ? "calc(min(3vw, 4vh)) calc(min(4.5vw, 6vh))"
              : "14px 20px"};"
          >
            <div
              class="lcd-ghost"
              style="color:rgba(${clockRgb}, 0.08); font-size:${timeSize}; font-weight:${weight};"
            >
              ${ghostText}
            </div>
            <div
              class="lcd-active"
              style="color:${clockColor}; font-size:${timeSize}; font-weight:${weight}; ${glowStyle}"
            >
              ${timeText}
            </div>
          </div>
          ${showDate
            ? html`<div
                class="clock-date"
                style="font-family:${fontFamily}; color:rgba(${clockRgb}, 0.75); font-size:${dateSize};"
              >
                ${dateStr}
              </div>`
            : nothing}
        </div>
      `;
    }

    // Modern Digital
    const timeText = `${hoursStr}:${minsStr}${showSeconds ? `:${secsStr}` : ""}`;
    return html`
      <div
        class="clock-container"
        style="font-family:${fontFamily}; font-variant-numeric:tabular-nums; line-height:1;"
      >
        <div
          class="digital-time"
          style="color:${clockColor}; font-weight:${weight}; font-size:${timeSize}; ${glowStyle}"
        >
          ${timeText}${!is24h
            ? html`<span class="digital-ampm">${ampm}</span>`
            : nothing}
        </div>
        ${showDate
          ? html`<div
              class="clock-date"
              style="color:rgba(${clockRgb}, 0.75); font-size:${dateSize};"
            >
              ${dateStr}
            </div>`
          : nothing}
      </div>
    `;
  }

  // --- Main Render -------------------------------------------------------

  protected render() {
    const isSpecialCard =
      this._config.style === "flip" ||
      this._config.style === "roller" ||
      this._config.style === "lcd";

    return html`
      <div class="settings-wrapper">
        <!-- Live Preview Header Card -->
        <div class="preview-card">
          <div class="preview-header-bar">
            <div class="preview-title">
              <ha-icon icon="mdi:clock-outline"></ha-icon>
              <span>Vista Previa en Vivo</span>
              <span class="live-tag">TICTAC ACTIVO</span>
            </div>
            <button
              class="fullscreen-btn"
              @click=${() => (this._fullscreen = true)}
              title="Ver reloj a pantalla completa"
            >
              <ha-icon icon="mdi:fullscreen"></ha-icon>
              <span>Pantalla completa</span>
            </button>
          </div>

          <div
            class="preview-viewport"
            style="background-color: ${this._config.bgColor};"
          >
            ${this._renderClockView(false)}
          </div>
        </div>

        <!-- Controls Container -->
        <div class="options-container">
          <!-- Style Selector -->
          <div class="section-card">
            <h3>Estilo del Reloj</h3>
            <div class="style-grid">
              <div
                class="style-option ${this._config.style === "digital"
                  ? "selected"
                  : ""}"
                @click=${() => this._updateConfig({ style: "digital" })}
              >
                <div class="style-icon"><ha-icon icon="mdi:numeric"></ha-icon></div>
                <div class="style-name">Digital</div>
                <div class="style-desc">Moderno y minimalista</div>
              </div>

              <div
                class="style-option ${this._config.style === "flip"
                  ? "selected"
                  : ""}"
                @click=${() => this._updateConfig({ style: "flip" })}
              >
                <div class="style-icon"><ha-icon icon="mdi:flip-to-back"></ha-icon></div>
                <div class="style-name">Flip Clock</div>
                <div class="style-desc">Solapas mecánicas retro</div>
              </div>

              <div
                class="style-option ${this._config.style === "roller"
                  ? "selected"
                  : ""}"
                @click=${() => this._updateConfig({ style: "roller" })}
              >
                <div class="style-icon"><ha-icon icon="mdi:cylinder"></ha-icon></div>
                <div class="style-name">Roller Clock</div>
                <div class="style-desc">Cilíndrico 3D con relieve</div>
              </div>

              <div
                class="style-option ${this._config.style === "lcd" ? "selected" : ""}"
                @click=${() => this._updateConfig({ style: "lcd" })}
              >
                <div class="style-icon"><ha-icon icon="mdi:watch"></ha-icon></div>
                <div class="style-name">LCD Clock</div>
                <div class="style-desc">7 segmentos vintage</div>
              </div>
            </div>
          </div>

          <!-- Typography -->
          <div class="section-card">
            <h3>Tipografía y Fuente</h3>
            <div class="form-row">
              <label for="font-select">Familia tipográfica</label>
              <select
                id="font-select"
                .value=${this._config.font}
                @change=${(e: any) => this._updateConfig({ font: e.target.value })}
              >
                <option value="Google Sans">Google Sans</option>
                <option value="Rubik">Rubik</option>
                <option value="Nunito">Nunito (Apple StandBy)</option>
                <option value="Inter">Inter</option>
                <option value="Oswald">Oswald (Reloj de pared)</option>
                <option value="Roboto Slab">Roboto Slab</option>
                <option value="monospace">Monospace</option>
              </select>
            </div>

            <div class="form-row">
              <label for="weight-select">Grosor de dígitos (Weight)</label>
              <select
                id="weight-select"
                .value=${this._config.weight}
                @change=${(e: any) => this._updateConfig({ weight: e.target.value })}
              >
                <option value="300">300 (Ligero / Fino)</option>
                <option value="400">400 (Regular / Normal)</option>
                <option value="500">500 (Medio)</option>
                <option value="700">700 (Negrita / Bold)</option>
                <option value="900">900 (Extra Bold / Black)</option>
              </select>
            </div>
          </div>

          <!-- Formats & Toggles -->
          <div class="section-card">
            <h3>Opciones de Visualización</h3>

            <div class="toggle-row">
              <div class="toggle-info">
                <div class="toggle-title">Formato 24 horas</div>
                <div class="toggle-sub">Alterna entre 24h y 12h con indicador AM/PM</div>
              </div>
              <input
                type="checkbox"
                .checked=${this._config.is24h}
                @change=${(e: any) => this._updateConfig({ is24h: e.target.checked })}
              />
            </div>

            <div class="toggle-row">
              <div class="toggle-info">
                <div class="toggle-title">Mostrar segundos</div>
                <div class="toggle-sub">Incluye la unidad de segundos en el reloj</div>
              </div>
              <input
                type="checkbox"
                .checked=${this._config.showSeconds}
                @change=${(e: any) =>
                  this._updateConfig({ showSeconds: e.target.checked })}
              />
            </div>

            <div class="toggle-row">
              <div class="toggle-info">
                <div class="toggle-title">Mostrar fecha</div>
                <div class="toggle-sub">Línea de día de la semana y fecha completa</div>
              </div>
              <input
                type="checkbox"
                .checked=${this._config.showDate}
                @change=${(e: any) =>
                  this._updateConfig({ showDate: e.target.checked })}
              />
            </div>

            <div class="toggle-row">
              <div class="toggle-info">
                <div class="toggle-title">Resplandor neón (Glow)</div>
                <div class="toggle-sub">
                  Añade un halo luminoso y sombras difusas a los dígitos
                </div>
              </div>
              <input
                type="checkbox"
                .checked=${this._config.glow}
                @change=${(e: any) => this._updateConfig({ glow: e.target.checked })}
              />
            </div>

            <div class="form-row slider-row">
              <div class="slider-header">
                <label>Tamaño / Escala del reloj</label>
                <span class="slider-value">${this._config.scale}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="250"
                step="5"
                .value=${String(this._config.scale)}
                @input=${(e: any) =>
                  this._updateConfig({ scale: Number(e.target.value) })}
              />
            </div>
          </div>

          <!-- Color Customization -->
          <div class="section-card">
            <h3>Paleta de Colores</h3>

            <div class="color-row">
              <div class="color-info">
                <div class="color-label">Color de Dígitos y Texto</div>
                <div class="color-sub">Color principal de los números y fecha</div>
              </div>
              <input
                type="color"
                .value=${this._config.clockColor}
                @input=${(e: any) =>
                  this._updateConfig({ clockColor: e.target.value })}
              />
            </div>

            ${isSpecialCard
              ? html`
                  <div class="color-row">
                    <div class="color-info">
                      <div class="color-label">Color de Tarjetas / Bisel</div>
                      <div class="color-sub">
                        Fondo de las fichas en Flip, Roller y marco de LCD
                      </div>
                    </div>
                    <input
                      type="color"
                      .value=${this._config.cardColor}
                      @input=${(e: any) =>
                        this._updateConfig({ cardColor: e.target.value })}
                    />
                  </div>
                `
              : nothing}

            <div class="color-row">
              <div class="color-info">
                <div class="color-label">Fondo del Reloj / Salvapantallas</div>
                <div class="color-sub">Fondo general detrás de los elementos</div>
              </div>
              <input
                type="color"
                .value=${this._config.bgColor}
                @input=${(e: any) => this._updateConfig({ bgColor: e.target.value })}
              />
            </div>

            <div class="actions-footer">
              <button class="reset-btn" @click=${this._resetDefaults}>
                <ha-icon icon="mdi:restore"></ha-icon>
                Restablecer predeterminados
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Fullscreen Modal Preview -->
      ${this._fullscreen
        ? html`
            <div
              class="fs-overlay"
              style="background-color: ${this._config.bgColor};"
              @click=${() => (this._fullscreen = false)}
            >
              <div class="fs-dismiss-hint">Haz clic o toca para salir</div>
              <div class="fs-clock-wrap">${this._renderClockView(true)}</div>
            </div>
          `
        : nothing}
    `;
  }

  static styles = css`
    :host {
      display: block;
      color: var(--primary-text-color, #212121);
    }

    .settings-wrapper {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* Live Preview Card */
    .preview-card {
      background: var(--card-background-color, #fff);
      border-radius: var(--ha-card-border-radius, 14px);
      box-shadow: var(--ha-card-box-shadow, 0 4px 12px rgba(0, 0, 0, 0.08));
      overflow: hidden;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
    }

    .preview-header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 18px;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      background: rgba(0, 0, 0, 0.02);
    }

    .preview-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      font-size: 15px;
    }

    .live-tag {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.05em;
      padding: 3px 8px;
      border-radius: 6px;
      background: rgba(76, 175, 80, 0.15);
      color: #388e3c;
    }

    .fullscreen-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 500;
      padding: 6px 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ddd);
      background: transparent;
      color: var(--primary-color, #03a9f4);
      cursor: pointer;
      transition: all 180ms ease;
    }

    .fullscreen-btn:hover {
      background: var(--primary-color, #03a9f4);
      color: #fff;
      border-color: transparent;
    }

    .preview-viewport {
      position: relative;
      min-height: 200px;
      padding: 32px 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.6);
      transition: background-color 250ms ease;
    }

    /* Clock Elements */
    .clock-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      user-select: none;
    }

    .clock-date {
      font-weight: 400;
      margin-top: 0.6em;
      letter-spacing: 0.02em;
      text-align: center;
    }

    /* Flip Clock */
    .flip-row,
    .roller-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .flip-card {
      position: relative;
      border-radius: 8px;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.12);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      box-sizing: border-box;
    }

    .flip-divider {
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      height: 1px;
      background: rgba(0, 0, 0, 0.7);
      box-shadow: 0 1px 0 rgba(255, 255, 255, 0.08);
      pointer-events: none;
    }

    /* Roller Clock */
    .roller-card {
      position: relative;
      border-radius: 12px;
      box-shadow: inset 0 6px 8px -3px rgba(0, 0, 0, 0.8),
        inset 0 -6px 8px -3px rgba(0, 0, 0, 0.8), 0 6px 18px rgba(0, 0, 0, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      box-sizing: border-box;
    }

    .colon {
      opacity: 0.85;
      margin: 0 2px;
    }

    .ampm-badge {
      align-self: flex-end;
      margin-bottom: 6px;
      padding: 3px 6px;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.1);
      font-weight: 700;
    }

    /* LCD Clock */
    .lcd-bezel {
      position: relative;
      border-radius: 10px;
      box-shadow: inset 0 3px 8px rgba(0, 0, 0, 0.85), 0 4px 14px rgba(0, 0, 0, 0.5);
      border: 2px solid rgba(255, 255, 255, 0.08);
      letter-spacing: 0.08em;
    }

    .lcd-ghost {
      pointer-events: none;
    }

    .lcd-active {
      position: absolute;
      left: 20px;
      top: 14px;
    }

    /* Digital Clock */
    .digital-time {
      letter-spacing: 0.02em;
    }

    .digital-ampm {
      font-size: 0.45em;
      opacity: 0.8;
      font-weight: 400;
      vertical-align: top;
      margin-left: 6px;
    }

    /* Options Sections */
    .options-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section-card {
      background: var(--card-background-color, #fff);
      border-radius: var(--ha-card-border-radius, 14px);
      box-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0, 0, 0, 0.06));
      padding: 20px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }

    .section-card h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 500;
    }

    /* Style Grid */
    .style-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
    }

    .style-option {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.03));
      border: 2px solid transparent;
      border-radius: 12px;
      padding: 16px 12px;
      text-align: center;
      cursor: pointer;
      transition: all 180ms ease;
    }

    .style-option:hover {
      background: rgba(3, 169, 244, 0.08);
    }

    .style-option.selected {
      border-color: var(--primary-color, #03a9f4);
      background: rgba(3, 169, 244, 0.12);
    }

    .style-icon {
      font-size: 28px;
      color: var(--primary-color, #03a9f4);
      margin-bottom: 6px;
    }

    .style-name {
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 4px;
    }

    .style-desc {
      font-size: 11px;
      color: var(--secondary-text-color, #727272);
      line-height: 1.3;
    }

    /* Form Rows */
    .form-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 16px;
    }

    .form-row:last-child {
      margin-bottom: 0;
    }

    .form-row label {
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

    /* Toggles */
    .toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }

    .toggle-row:last-of-type {
      border-bottom: none;
    }

    .toggle-info {
      flex: 1;
    }

    .toggle-title {
      font-size: 14px;
      font-weight: 500;
    }

    .toggle-sub {
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

    /* Slider */
    .slider-row {
      margin-top: 14px;
    }

    .slider-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .slider-value {
      font-weight: 600;
      color: var(--primary-color, #03a9f4);
    }

    input[type="range"] {
      width: 100%;
      accent-color: var(--primary-color, #03a9f4);
      cursor: pointer;
    }

    /* Color Rows */
    .color-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }

    .color-row:last-of-type {
      border-bottom: none;
    }

    .color-info {
      flex: 1;
    }

    .color-label {
      font-size: 14px;
      font-weight: 500;
    }

    .color-sub {
      font-size: 12px;
      color: var(--secondary-text-color, #727272);
      margin-top: 2px;
    }

    input[type="color"] {
      width: 44px;
      height: 44px;
      padding: 0;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px;
      background: none;
      cursor: pointer;
    }

    input[type="color"]::-webkit-color-swatch-wrapper {
      padding: 4px;
    }

    input[type="color"]::-webkit-color-swatch {
      border: none;
      border-radius: 6px;
    }

    /* Footer */
    .actions-footer {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }

    .reset-btn {
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
    }

    .reset-btn:hover {
      color: var(--error-color, #db4437);
      border-color: var(--error-color, #db4437);
    }

    /* Fullscreen Modal */
    .fs-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
    }

    .fs-dismiss-hint {
      position: absolute;
      top: 24px;
      padding: 6px 14px;
      background: rgba(0, 0, 0, 0.4);
      color: rgba(255, 255, 255, 0.7);
      border-radius: 20px;
      font-size: 12px;
      letter-spacing: 0.03em;
    }

    .fs-clock-wrap {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `;
}

if (!customElements.get("wakey-clock-settings")) {
  customElements.define("wakey-clock-settings", WakeyClockSettings);
}

declare global {
  interface HTMLElementTagNameMap {
    "wakey-clock-settings": WakeyClockSettings;
  }
}
