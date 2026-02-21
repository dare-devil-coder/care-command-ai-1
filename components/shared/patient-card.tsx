import { Patient } from '@/lib/mock-data';

interface PatientCardProps {
  patient: Patient;
  onClick?: () => void;
}

export default function PatientCard({ patient, onClick }: PatientCardProps) {
  const getRiskColor = (score: number) => {
    if (score >= 8) return 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
    if (score >= 5) return 'bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800';
    return 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
  };

  return (
    <div
      onClick={onClick}
      className="glass p-6 cursor-pointer hover:shadow-lg hover:shadow-violet-300/20 dark:hover:shadow-violet-600/20 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
            {patient.name}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">ID: {patient.qrCode}</p>
        </div>
        <div className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getRiskColor(patient.riskScore)}`}>
          Risk: {patient.riskScore.toFixed(1)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/40 dark:bg-slate-800/40 rounded-lg p-3">
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Age / Type</p>
          <p className="font-medium text-slate-900 dark:text-white">{patient.age} / {patient.gender}</p>
        </div>
        <div className="bg-white/40 dark:bg-slate-800/40 rounded-lg p-3">
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Blood Type</p>
          <p className="font-medium text-slate-900 dark:text-white">{patient.bloodType}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Vitals</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center text-xs">
            <p className="text-slate-600 dark:text-slate-400">HR</p>
            <p className="font-semibold text-slate-900 dark:text-white">{patient.vitalSigns.heartRate} bpm</p>
          </div>
          <div className="text-center text-xs">
            <p className="text-slate-600 dark:text-slate-400">BP</p>
            <p className="font-semibold text-slate-900 dark:text-white">{patient.vitalSigns.bloodPressure}</p>
          </div>
          <div className="text-center text-xs">
            <p className="text-slate-600 dark:text-slate-400">O2</p>
            <p className="font-semibold text-slate-900 dark:text-white">{patient.vitalSigns.oxygenLevel}%</p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/20 dark:border-white/10">
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Conditions</p>
        <div className="flex flex-wrap gap-2">
          {patient.conditions.slice(0, 2).map((condition) => (
            <span key={condition} className="text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-2 py-1 rounded">
              {condition}
            </span>
          ))}
          {patient.conditions.length > 2 && (
            <span className="text-xs text-slate-600 dark:text-slate-400">+{patient.conditions.length - 2} more</span>
          )}
        </div>
      </div>
    </div>
  );
}
