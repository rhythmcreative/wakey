export interface Alarm {
  id: string;
  name: string;
  enabled: boolean;
  time: string;
  repeat: "once" | "weekly";
  weekdays: number[];
  date: string | null;
  skip_next: boolean;
  media_player: string;
  source_uri: string;
  source_kind: "music_assistant" | "media_player";
  volume: number;
  fade_seconds: number;
  snooze_minutes: number;
  auto_dismiss_minutes: number;
  pre_alarm_minutes: number;
  pre_alarm_script: string | null;
  next_fire: string | null;
  is_ringing: boolean;
  is_snoozed: boolean;
}

export interface Snapshot {
  alarms: Alarm[];
  ringing: string[];
  snoozed: string[];
}

/** Only the bits of the HA object this panel actually touches. */
export interface HomeAssistant {
  states: Record<string, { state: string; attributes: Record<string, unknown> }>;
  locale: unknown;
  themes: unknown;
  language: string;
  user?: { is_admin: boolean };
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  connection: {
    subscribeMessage<T>(
      cb: (msg: T) => void,
      msg: Record<string, unknown>
    ): Promise<() => void>;
  };
}

export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const emptyDraft = (): Partial<Alarm> => ({
  name: "Alarm",
  time: "07:00",
  repeat: "weekly",
  weekdays: [0, 1, 2, 3, 4],
  media_player: "",
  source_uri: "",
  source_kind: "music_assistant",
  volume: 0.7,
  fade_seconds: 0,
  snooze_minutes: 9,
  auto_dismiss_minutes: 30,
  enabled: true,
});
