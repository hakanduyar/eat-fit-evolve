
import { registerPlugin } from '@capacitor/core';

export interface WidgetPlugin {
  updateWidget(options: { 
    calories: number; 
    target: number; 
    date: string; 
  }): Promise<void>;
  
  isWidgetAvailable(): Promise<{ available: boolean }>;
}

const Widget = registerPlugin<WidgetPlugin>('Widget', {
  web: () => import('./WidgetPluginWeb').then(m => new m.WidgetPluginWeb()),
});

export { Widget };
