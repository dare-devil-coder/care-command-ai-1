import { Card } from '@/components/ui/card';
import { Patient, mockTasks } from '@/lib/mock-data';
import { AIInsightsService, AIInsight } from '@/lib/ai-insights';

interface AIInsightsPanelProps {
  patient: Patient;
  title?: string;
  compact?: boolean;
}

const severityColors = {
  low: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400',
  medium: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400',
  high: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400',
  critical: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400',
};

const typeIcons = {
  risk: '⚠️',
  recommendation: '💡',
  alert: '🚨',
  trend: '📈',
};

export default function AIInsightsPanel({
  patient,
  title = 'AI Health Insights',
  compact = false,
}: AIInsightsPanelProps) {
  const riskInsights = AIInsightsService.analyzePatientRisk(patient);
  const taskRecommendations = AIInsightsService.generateTaskRecommendations(
    patient,
    mockTasks.filter((t) => t.patientId === patient.id)
  );
  const medicationWarnings = AIInsightsService.checkMedicationInteractions(
    patient.medications
  );

  const allInsights = [...riskInsights, ...taskRecommendations, ...medicationWarnings];
  const displayInsights = compact ? allInsights.slice(0, 3) : allInsights;

  const deteriorationRisk = AIInsightsService.predictDeterioration(patient);

  if (compact && allInsights.length === 0) {
    return null;
  }

  return (
    <Card className={`glass p-6 ${compact ? '' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>🤖</span> {title}
        </h2>
        {!compact && (
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              Deterioration Risk
            </div>
            <div className={`text-2xl font-bold ${
              deteriorationRisk > 70
                ? 'text-red-600 dark:text-red-400'
                : deteriorationRisk > 40
                ? 'text-orange-600 dark:text-orange-400'
                : 'text-green-600 dark:text-green-400'
            }`}>
              {deteriorationRisk}%
            </div>
          </div>
        )}
      </div>

      {displayInsights.length > 0 ? (
        <div className="space-y-3">
          {displayInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
          {compact && allInsights.length > 3 && (
            <div className="text-xs text-slate-600 dark:text-slate-400 text-center pt-2">
              +{allInsights.length - 3} more insights
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">✅</div>
          <p className="text-slate-600 dark:text-slate-400">
            No critical insights - Patient is stable
          </p>
        </div>
      )}
    </Card>
  );
}

interface InsightCardProps {
  insight: AIInsight;
}

function InsightCard({ insight }: InsightCardProps) {
  return (
    <div
      className={`p-4 rounded-lg border transition-all hover:shadow-md ${
        severityColors[insight.severity]
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">{typeIcons[insight.type]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm">{insight.title}</h3>
            <span className={`text-xs px-2 py-1 rounded font-medium whitespace-nowrap ${
              insight.severity === 'critical'
                ? 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-100'
                : insight.severity === 'high'
                ? 'bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-100'
                : insight.severity === 'medium'
                ? 'bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100'
                : 'bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-100'
            }`}>
              {insight.severity}
            </span>
          </div>
          <p className="text-sm mt-2 opacity-90">{insight.message}</p>
          {insight.suggestedAction && (
            <div className="mt-3 pt-3 border-t border-current border-opacity-20">
              <p className="text-xs font-medium opacity-80">Suggested Action:</p>
              <p className="text-xs mt-1">{insight.suggestedAction}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
