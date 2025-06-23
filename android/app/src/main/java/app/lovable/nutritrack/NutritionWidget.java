
package app.lovable.nutritrack;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;
import android.content.Intent;
import android.app.PendingIntent;

public class NutritionWidget extends AppWidgetProvider {
    
    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager,
                                int appWidgetId, int calories, int target) {
        
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_nutrition);
        
        // Widget verilerini güncelle
        views.setTextViewText(R.id.widget_calories, String.valueOf(calories));
        views.setTextViewText(R.id.widget_target, String.valueOf(target));
        
        // Progress bar'ı güncelle
        int progress = target > 0 ? (calories * 100) / target : 0;
        views.setProgressBar(R.id.widget_progress, 100, progress, false);
        
        // Widget'a tıklandığında uygulamayı aç
        Intent intent = new Intent(context, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, 
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_title, pendingIntent);
        
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
    
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId, 0, 2000);
        }
    }
}
