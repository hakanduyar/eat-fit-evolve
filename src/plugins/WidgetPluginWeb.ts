
import { WebPlugin } from '@capacitor/core';
import type { WidgetPlugin } from './WidgetPlugin';

export class WidgetPluginWeb extends WebPlugin implements WidgetPlugin {
  async updateWidget(options: { calories: number; target: number; date: string }): Promise<void> {
    console.log('Widget update (web fallback):', options);
    // Web'de widget yok, bu sadece fallback
  }

  async isWidgetAvailable(): Promise<{ available: boolean }> {
    return { available: false };
  }
}
