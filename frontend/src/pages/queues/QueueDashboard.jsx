import React, { useState, useEffect } from 'react';
import { Activity, Beaker, Pill, ScanLine, ListFilter, Play, ShieldAlert } from 'lucide-react';
import QueueCard from './QueueCard';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

import tokenApi from '../../api/tokenApi';
import { io } from 'socket.io-client';

const QueueDashboard = () => {
  const { currentUser, ROLES } = useAuth();
  const [activeQueue, setActiveQueue] = useState('opd');
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const allQueues = [
    { id: 'opd', name: 'OPD Clinics', icon: Activity, deptName: 'OPD' },
    { id: 'lab', name: 'Laboratory', icon: Beaker, deptName: 'Laboratory' },
    { id: 'rad', name: 'Radiology', icon: ScanLine, deptName: 'Radiology' },
    { id: 'rx', name: 'Pharmacy', icon: Pill, deptName: 'Pharmacy' },
  ];

  const [tickets, setTickets] = useState([]);

  // RBAC: Filter available queues based on user role
  const queues = allQueues.filter(q => {
    if (currentUser.role === ROLES.ADMIN || currentUser.role === ROLES.RECEPTIONIST) return true;
    if (currentUser.role === ROLES.DOCTOR || currentUser.role === ROLES.NURSE) return q.id === 'opd';
    if (currentUser.role === ROLES.LAB_TECH) return q.id === 'lab';
    if (currentUser.role === ROLES.RADIOLOGIST) return q.id === 'rad';
    if (currentUser.role === ROLES.PHARMACIST) return q.id === 'rx';
    return false;
  });

  const fetchStats = async () => {
    try {
      const response = await tokenApi.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Fetch tickets for active queue
  const fetchQueue = async () => {
    setLoading(true);
    try {
      const dept = allQueues.find(q => q.id === activeQueue)?.deptName;
      const response = await tokenApi.getQueueByDept(dept);
      const mapped = response.data.map(t => ({
        id: t._id,
        ticketId: t.ticketId,
        patientName: t.patientName,
        patientId: t.patientId,
        service: t.specialty ? `${t.specialty} Clinic` : t.service.toUpperCase(),
        payment: t.paymentMethod === 'cash' ? 'Cash' : 'Insurance',
        priority: 'Normal', // Placeholder
        status: t.status,
        waitMins: Math.floor((new Date() - new Date(t.createdAt)) / 60000)
      }));
      setTickets(mapped);
      await fetchStats(); // Refresh sidebar counts too
    } catch (err) {
      console.error('Error fetching queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [activeQueue]);

  // Socket.IO Setup
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');

    socket.on('token:new', (newToken) => {
      fetchStats(); // Update sidebar counts for all
      const currentDept = allQueues.find(q => q.id === activeQueue)?.deptName;
      if (newToken.queueDept === currentDept) {
        fetchQueue();
      }
    });

    socket.on('token:called', () => {
      fetchQueue();
      fetchStats();
    });
    
    socket.on('token:completed', () => {
      fetchQueue();
      fetchStats();
    });

    return () => socket.disconnect();
  }, [activeQueue]);

  // Ensure active queue is valid for current role upon role change
  useEffect(() => {
    if (queues.length > 0 && !queues.find(q => q.id === activeQueue)) {
      setActiveQueue(queues[0].id);
    }
  }, [currentUser.role, queues]);

  const sortedTickets = [...tickets].sort((a, b) => {
    const priorityWeight = { 'Emergency': 3, 'High': 2, 'Normal': 1 };
    if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    return b.waitMins - a.waitMins;
  });

  const getDepartmentName = (queueId) => {
    const q = allQueues.find(q => q.id === queueId);
    return q ? q.name : 'Counter';
  };

  const handleCallPatient = async (ticket) => {
    try {
      // Update status in backend
      await tokenApi.callToken(ticket.id);

      // Trigger TTS
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const department = getDepartmentName(activeQueue);
        const textToSpeak = `Ticket number ${ticket.ticketId.replace('-', ' ')}, please proceed to ${department}.`;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error('Error calling patient:', err);
    }
  };

  const handleCallNext = () => {
    const waitingTickets = sortedTickets.filter(t => t.status === 'Waiting');
    if (waitingTickets.length > 0) {
      handleCallPatient(waitingTickets[0]);
    } else {
      alert('No more waiting patients in this queue.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Smart Queue Management</h1>
          <p className="text-silver-500 text-sm">Monitor patient flow, triage wait times, and call the next ticket.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <ListFilter className="w-4 h-4" /> Filters
          </Button>

          {/* RBAC: Only allow calling if they are authorized for THIS specific queue. Admins see all but generally shouldn't call patients unless acting as staff. */}
          {queues.find(q => q.id === activeQueue) ? (
            <Button onClick={handleCallNext} className="flex items-center gap-2">
              <Play className="w-4 h-4 fill-current" /> Call Next in Line
            </Button>
          ) : (
            <Button disabled className="flex items-center gap-2 bg-silver-300 text-silver-500 border-none">
              <ShieldAlert className="w-4 h-4" /> Restricted
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        {/* Sidebar Nav */}
        <div className="w-64 shrink-0 flex flex-col space-y-2">
          {queues.map(q => (
            <button
              key={q.id}
              onClick={() => setActiveQueue(q.id)}
              className={`flex items-center justify-between px-4 py-4 rounded-xl border transition-all ${activeQueue === q.id
                  ? 'bg-white border-primary shadow-md text-primary'
                  : 'bg-white border-transparent shadow-sm text-clay-600 hover:border-silver-300'
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${activeQueue === q.id ? 'bg-primary/10' : 'bg-silver-100'}`}>
                  <q.icon className={`w-5 h-5 ${activeQueue === q.id ? 'text-primary' : 'text-clay-500'}`} />
                </div>
                <span className="font-bold">{q.name}</span>
              </div>
              <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeQueue === q.id ? 'bg-primary text-white' : 'bg-silver-200 text-slate-600'}`}>
                {stats[q.deptName] || 0}
              </div>
            </button>
          ))}

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h4 className="font-bold text-blue-800 text-sm mb-2">Queue Analytics</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-blue-700">Avg Wait Time</span>
                  <span className="font-bold text-blue-900">28m</span>
                </div>
                <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
                  <div className="w-[45%] h-full bg-blue-500"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-blue-700">SLA Violations (&gt;45m)</span>
                  <span className="font-bold text-red-600">2</span>
                </div>
                <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
                  <div className="w-[5%] h-full bg-red-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Queue Grid */}
        <div className="flex-1 bg-silver-50 rounded-xl border border-silver-200 p-6 overflow-y-auto custom-scrollbar h-[calc(100vh-180px)]">
          {!queues.find(q => q.id === activeQueue) ? (
            // RBAC Access Denied View
            <div className="h-full flex flex-col items-center justify-center text-center">
              <ShieldAlert className="w-16 h-16 text-red-300 mb-4" />
              <h2 className="text-xl font-bold text-slate-800">Access Restricted</h2>
              <p className="text-clay-500 mt-2 max-w-sm">Your current role (<span className="font-bold">{currentUser.role}</span>) does not have authorization to view or manage the {allQueues.find(q => q.id === activeQueue)?.name} queue.</p>
            </div>
          ) : (
            // Authorized View
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800">
                  {queues.find(q => q.id === activeQueue)?.name} Department Queue
                </h2>
                <span className="text-sm font-medium text-clay-500">{sortedTickets.length} active tickets</span>
              </div>

              {sortedTickets.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center text-clay-400">
                  <Activity className="w-16 h-16 opacity-20 mb-4" />
                  <p>No active tickets in this queue.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {sortedTickets.map(ticket => (
                    <QueueCard
                      key={ticket.ticketId}
                      ticket={ticket}
                      onCall={() => handleCallPatient(ticket)}
                      canInteract={true}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueueDashboard;
