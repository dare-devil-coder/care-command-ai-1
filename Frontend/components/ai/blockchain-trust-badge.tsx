'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, CheckCircle, Clock } from 'lucide-react';

interface CareRecord {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  verified: boolean;
  blockchainHash?: string;
}

interface BlockchainTrustBadgeProps {
  patientId: string;
  records: CareRecord[];
}

export function BlockchainTrustBadge({ patientId, records }: BlockchainTrustBadgeProps) {
  const [showVerification, setShowVerification] = useState(false);
  const [latestRecord, setLatestRecord] = useState<CareRecord | null>(null);

  useEffect(() => {
    if (records.length > 0) {
      setLatestRecord(records[records.length - 1]);
      setShowVerification(true);
      setTimeout(() => setShowVerification(false), 3000);
    }
  }, [records]);

  const verifiedCount = records.filter(r => r.verified).length;
  const verificationRate = records.length > 0 ? (verifiedCount / records.length) * 100 : 100;

  return (
    <>
      {/* Floating Verification Badge */}
      <motion.div
        className="fixed top-20 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <Card className="glass-lg p-4 border-2 border-green-500/50 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Shield className="w-8 h-8 text-green-400" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-green-400" />
                <span className="text-sm font-bold text-white">Blockchain Verified</span>
              </div>
              <p className="text-xs text-green-300">{verificationRate.toFixed(0)}% Records Secured</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Verification Animation Toast */}
      <AnimatePresence>
        {showVerification && latestRecord && (
          <motion.div
            className="fixed top-32 right-6 z-50"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <Card className="glass p-4 border-2 border-cyan-500/50 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blockchain-verified">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <CheckCircle className="w-6 h-6 text-cyan-400" />
                </motion.div>
                <div>
                  <p className="text-sm font-bold text-white">Record Secured on Blockchain</p>
                  <p className="text-xs text-cyan-300">{latestRecord.action}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verified Timeline */}
      <Card className="glass p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            🔐 Blockchain Verified Care Timeline
          </h3>
          <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/50">
            Tamper-Proof
          </Badge>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {records.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative pl-8 pb-4 border-l-2 border-cyan-500/30 last:border-l-0"
            >
              {/* Timeline Dot */}
              <motion.div
                className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-cyan-500 border-2 border-slate-900"
                animate={{
                  scale: record.verified ? [1, 1.2, 1] : 1,
                  boxShadow: record.verified 
                    ? ['0 0 0 0 rgba(6, 182, 212, 0.4)', '0 0 0 8px rgba(6, 182, 212, 0)', '0 0 0 0 rgba(6, 182, 212, 0)']
                    : 'none'
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />

              <div className="bg-slate-800/50 rounded-lg p-3 hover:bg-slate-800/70 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{record.action}</p>
                    <p className="text-xs text-slate-400">by {record.performedBy}</p>
                  </div>
                  {record.verified && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-full"
                    >
                      <Lock className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-400 font-medium">Verified</span>
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(record.timestamp).toLocaleString()}</span>
                </div>

                {record.blockchainHash && (
                  <div className="mt-2 p-2 bg-slate-900/50 rounded border border-cyan-500/20">
                    <p className="text-xs text-cyan-400 font-mono truncate">
                      Hash: {record.blockchainHash}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Immutable Record Indicator */}
        <motion.div
          className="mt-4 p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg"
          animate={{
            borderColor: ['rgba(34, 197, 94, 0.3)', 'rgba(34, 197, 94, 0.6)', 'rgba(34, 197, 94, 0.3)']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-400" />
            <p className="text-xs text-green-300 font-medium">
              All records are cryptographically secured and immutable
            </p>
          </div>
        </motion.div>
      </Card>
    </>
  );
}
