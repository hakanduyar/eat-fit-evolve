
package app.lovable.nutritrack;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;

@CapacitorPlugin(name = "Widget")
public class WidgetPlugin extends Plugin {

    @PluginMethod
    public void updateWidget(PluginCall call) {
        int calories = call.getInt("calories", 0);
        int target = call.getInt("target", 2000);
        
        Context context = getContext();
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        ComponentName componentName = new ComponentName(context, NutritionWidget.class);
        int[] appWidgetIds = appWidgetManager.getAppWidgetIds(componentName);
        
        for (int appWidgetId : appWidgetIds) {
            NutritionWidget.updateAppWidget(context, appWidgetManager, appWidgetId, calories, target);
        }
        
        call.resolve();
    }
    
    @PluginMethod
    public void isWidgetAvailable(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("available", true);
        call.resolve(ret);
    }
}
