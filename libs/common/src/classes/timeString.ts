export class TimeString {
  private hours: number;
  private minutes: number;
  private seconds: number;

  constructor(time: string) {
    const [h, m, s] = time.split(':').map(Number);
    this.hours = h || 0;
    this.minutes = m || 0;
    this.seconds = s || 0;
  }

  static fromHMS(
    hours: number,
    minutes: number,
    seconds: number = 0,
  ): TimeString {
    return new TimeString(
      `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
    );
  }

  toString(): string {
    return `${this.hours.toString().padStart(2, '0')}:${this.minutes
      .toString()
      .padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')}`;
  }

  add(hours: number, minutes: number, seconds: number = 0): TimeString {
    let totalSeconds =
      this.hours * 3600 +
      this.minutes * 60 +
      this.seconds +
      hours * 3600 +
      minutes * 60 +
      seconds;

    totalSeconds = ((totalSeconds % 86400) + 86400) % 86400; // wrap around 24h

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return TimeString.fromHMS(h, m, s);
  }

  isBefore(other: TimeString): boolean {
    return this.toSeconds() < other.toSeconds();
  }

  isAfter(other: TimeString): boolean {
    return this.toSeconds() > other.toSeconds();
  }

  isEqual(other: TimeString): boolean {
    return this.toSeconds() === other.toSeconds();
  }

  toSeconds(): number {
    return this.hours * 3600 + this.minutes * 60 + this.seconds;
  }
}
