declare global {
  interface Window {
    turnstile: any;
  }
}

export class TurnstileService {
  private static instance: TurnstileService;
  private scriptLoaded: boolean = false;
  private siteKey: string;
  private widgetId: string | null = null;

  private constructor() {
    this.siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAB2RiJ8Y9p6mzxW4';
  }

  static getInstance(): TurnstileService {
    if (!TurnstileService.instance) {
      TurnstileService.instance = new TurnstileService();
    }
    return TurnstileService.instance;
  }

  async loadScript(): Promise<void> {
    if (this.scriptLoaded) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };

      script.onerror = () => {
        reject(new Error('Failed to load Turnstile script'));
      };

      document.head.appendChild(script);
    });
  }

  async render(containerId: string, options: {
    callback?: (token: string) => void;
    'error-callback'?: (error: any) => void;
    'expired-callback'?: () => void;
    theme?: 'light' | 'dark' | 'auto';
    size?: 'normal' | 'compact' | 'flexible';
    action?: string;
  } = {}): Promise<void> {
    if (!this.scriptLoaded) {
      await this.loadScript();
    }

    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.turnstile) {
        reject(new Error('Turnstile not loaded'));
        return;
      }

      try {
        // If containerId doesn't start with # or ., assume it's an ID and add #
        const selector = containerId.startsWith('#') || containerId.startsWith('.')
          ? containerId
          : `#${containerId}`;

        this.widgetId = window.turnstile.render(selector, {
          sitekey: this.siteKey,
          theme: options.theme || 'auto',
          size: options.size || 'normal',
          action: options.action || 'login',
          callback: options.callback,
          'error-callback': options['error-callback'],
          'expired-callback': options['expired-callback'],
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  async execute(containerId?: string): Promise<string> {
    if (!this.scriptLoaded) {
      await this.loadScript();
    }

    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.turnstile) {
        reject(new Error('Turnstile not loaded'));
        return;
      }

      try {
        if (containerId) {
          window.turnstile.execute(containerId);
        } else if (this.widgetId) {
          window.turnstile.execute(this.widgetId);
        } else {
          reject(new Error('No widget to execute'));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  reset(): void {
    if (this.widgetId && window.turnstile) {
      window.turnstile.reset(this.widgetId);
    }
  }

  remove(): void {
    if (this.widgetId && window.turnstile) {
      window.turnstile.remove(this.widgetId);
      this.widgetId = null;
    }
  }
}