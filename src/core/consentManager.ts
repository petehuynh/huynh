import type { ConsentType, ConsentStatus } from '../types';

class ConsentManager {
  private static instance: ConsentManager;
  private consents: Map<ConsentType, ConsentStatus> = new Map();
  private readonly storageKey = 'copy_analytics_consent';

  private constructor() {
    this.loadConsents();
  }

  public static getInstance(): ConsentManager {
    if (!ConsentManager.instance) {
      ConsentManager.instance = new ConsentManager();
    }
    return ConsentManager.instance;
  }

  private loadConsents(): void {
    if (typeof window === 'undefined') return;

    const storedConsents = localStorage.getItem(this.storageKey);
    if (storedConsents) {
      const parsedConsents = JSON.parse(storedConsents);
      Object.entries(parsedConsents).forEach(([type, status]) => {
        this.consents.set(type as ConsentType, status as ConsentStatus);
      });
    }
  }

  private saveConsents(): void {
    if (typeof window === 'undefined') return;

    const consentsObject = Object.fromEntries(this.consents.entries());
    localStorage.setItem(this.storageKey, JSON.stringify(consentsObject));
  }

  public trackConsent(type: ConsentType, granted: boolean, expiresInDays?: number): void {
    const timestamp = Date.now();
    const expiresAt = expiresInDays ? timestamp + (expiresInDays * 24 * 60 * 60 * 1000) : undefined;

    this.consents.set(type, {
      type,
      granted,
      timestamp,
      expiresAt,
    });

    this.saveConsents();
  }

  public isConsentGiven(type: ConsentType): boolean {
    const consent = this.consents.get(type);
    if (!consent) return false;

    if (consent.expiresAt && Date.now() > consent.expiresAt) {
      this.consents.delete(type);
      this.saveConsents();
      return false;
    }

    return consent.granted;
  }

  public clearConsents(): void {
    this.consents.clear();
    this.saveConsents();
  }

  public getConsentStatus(type: ConsentType): ConsentStatus | undefined {
    return this.consents.get(type);
  }

  public getAllConsents(): Map<ConsentType, ConsentStatus> {
    return new Map(this.consents);
  }

  public handleAcceptConsent(types: ConsentType[]): void {
    types.forEach(type => {
      this.trackConsent(type, true, 365); // Default expiry of 1 year
    });
  }

  public handleDeclineConsent(types: ConsentType[]): void {
    types.forEach(type => {
      this.trackConsent(type, false);
    });
  }
}

export default ConsentManager; 