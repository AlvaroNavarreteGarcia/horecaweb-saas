import React, { useState, useEffect, useRef } from 'react';
import {
    Utensils, ShieldCheck, ShieldAlert, Store, UserPlus, Calendar, Users, List,
    Smartphone, Settings, Lock, Award, CheckCircle2, Sparkles,
    CheckCircle, Wrench, AlertTriangle, FileText, UploadCloud,
    RefreshCw, LayoutDashboard, Search, MapPin, Sun, Moon, BookOpen,
    PlusCircle, Send, Phone, PhoneCall, PhoneOff, PhoneIncoming, Mic, Save, X, Trash2,
    XCircle, PieChart, TrendingUp
} from 'lucide-react';

export default function App() {
    const getTodayString = () => new Date().toISOString().split('T')[0];

    const initialClientsData = [
        { id: 1, name: "Asador Don Juan", manager: "Juan Manuel Pérez", phone: "+34 612 345 678", province: "Madrid", address: "Calle Mayor 42", plan: "Plan Fundadores (100€/año)", status: "Protegido", callNote: "" },
        { id: 2, name: "La Taverna del Mar", manager: "Carla Soler", phone: "+34 623 456 789", province: "Barcelona", address: "Passeig Marítim 12", plan: "Plan Estándar Anual (250€/año)", status: "Protegido", callNote: "" },
        { id: 3, name: "Bar El Pasaje", manager: "Antonio Ruiz", phone: "+34 634 567 890", province: "Sevilla", address: "Calle Sierpes 8", plan: "Plan Fundadores (100€/año)", status: "Protegido", callNote: "" },
        { id: 4, name: "Restaurante Ca La Nuri", manager: "Nuria Gomis", phone: "+34 645 678 901", province: "Barcelona", address: "Rambla Catalunya 89", plan: "Plan Estándar Mensual (25€/mes)", status: "Protegido", callNote: "" },
        { id: 5, name: "GastroBar Malasaña", manager: "David Castro", phone: "+34 656 789 012", province: "Madrid", address: "Calle Manuela Malasaña 15", plan: "Plan Fundadores (100€/año)", status: "Protegido", callNote: "" },
        { id: 6, name: "Marisquería El Puerto", manager: "Vicente Blasco", phone: "+34 667 890 123", province: "Valencia", address: "Av. del Puerto 104", plan: "Plan Estándar Anual (250€/año)", status: "Protegido", callNote: "" },
        { id: 7, name: "Mesón Bilbao Central", manager: "Iñigo Larrea", phone: "+34 678 901 234", province: "Bilbao", address: "Gran Vía 33", plan: "Plan Fundadores (100€/año)", status: "Protegido", callNote: "" },
        { id: 8, name: "Chiringuito Sol y Mar", manager: "Elena Gómez", phone: "+34 689 012 345", province: "Málaga", address: "Paseo Marítimo Cariatiz 5", plan: "Plan Estándar Mensual (25€/mes)", status: "Protegido", callNote: "" }
    ];

    const initialReservationsData = [
        { id: 101, date: getTodayString(), time: "14:00", shift: "Comida", name: "María Delgado", guests: 4, phone: "+34 654 321 098", table: "Mesa 04", status: "Confirmada" },
        { id: 102, date: getTodayString(), time: "14:30", shift: "Comida", name: "Carlos Mendoza", guests: 2, phone: "+34 611 223 344", table: "Mesa 02", status: "Cancelada" },
        { id: 103, date: getTodayString(), time: "15:00", shift: "Comida", name: "Grupo Ibérica", guests: 8, phone: "+34 677 889 900", table: "Mesa 10 (Terraza)", status: "Confirmada" },
        { id: 104, date: getTodayString(), time: "21:30", shift: "Cena", name: "Laura Gómez", guests: 3, phone: "+34 699 001 122", table: "Mesa 06", status: "Pendiente" },
        { id: 105, date: getTodayString(), time: "22:00", shift: "Cena", name: "Javier Ortiz", guests: 5, phone: "+34 633 445 566", table: "Mesa 08", status: "Confirmada" }
    ];

    const [darkMode, setDarkMode] = useState(true);
    const [currentView, setCurrentView] = useState('user'); // 'user' or 'admin'
    const [clientTab, setClientTab] = useState('operational'); // 'operational' or 'management'

    const [selectedService, setSelectedService] = useState(1);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isCyberModalOpen, setIsCyberModalOpen] = useState(false);
    const [selectedPlanType, setSelectedPlanType] = useState('Plan Fundadores (100€/año)');
    const [currentUser, setCurrentUser] = useState(null);
    
    const [serverHealth, setServerHealth] = useState('green');

    const [reservations, setReservations] = useState(initialReservationsData);
    const [isNewReservationModalOpen, setIsNewReservationModalOpen] = useState(false);
    const [newResData, setNewResData] = useState({
        date: getTodayString(),
        time: "14:00",
        shift: "Comida",
        name: "",
        guests: 2,
        phone: "",
        table: "Mesa 01"
    });

    const [regData, setRegData] = useState({
        restaurantName: '',
        managerName: '',
        phone: '',
        province: 'Madrid',
        address: ''
    });

    const [clients, setClients] = useState(initialClientsData);
    const [searchFilter, setSearchFilter] = useState('');
    const [provinceFilter, setProvinceFilter] = useState('all');

    const [activeCallClient, setActiveCallClient] = useState(null);
    const [callMode, setCallMode] = useState('options');
    const [tempNoteText, setTempNoteText] = useState('');

    const [activeNoteClient, setActiveNoteClient] = useState(null);
    const [editNoteText, setEditNoteText] = useState('');

    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    const [badgePos, setBadgePos] = useState({ top: 0, left: 0, opacity: 0 });
    const gridContainerRef = useRef(null);

    const toggleTheme = () => {
        const nextMode = !darkMode;
        setDarkMode(nextMode);
        if (nextMode) {
            document.documentElement.classList.add('dark');
            triggerToast("Modo Oscuro Activado");
        } else {
            document.documentElement.classList.remove('dark');
            triggerToast("Modo Claro Activado");
        }
    };

    const triggerToast = (msg) => {
        setToastMessage(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3500);
    };

    const handleDeleteReservation = (id, name) => {
        setReservations(prev => prev.filter(r => r.id !== id));
        triggerToast(`Reserva de ${name} eliminada correctamente.`);
    };

    const handleDeleteClient = (id, name) => {
        setClients(prev => prev.filter(c => c.id !== id));
        triggerToast(`Local "${name}" eliminado del panel de administración.`);
    };

    const toggleReservationStatus = (id) => {
        setReservations(prev => prev.map(r => {
            if (r.id === id) {
                // Rotación simplificada: Pendiente -> Confirmada -> Cancelada -> Pendiente
                const nextStatus = r.status === 'Pendiente' ? 'Confirmada' : r.status === 'Confirmada' ? 'Cancelada' : 'Pendiente';
                triggerToast(`Estado actualizado a: ${nextStatus}`);
                return { ...r, status: nextStatus };
            }
            return r;
        }));
    };

    const updateBadgePosition = (serviceId) => {
        const activeCard = document.getElementById(`card-${serviceId}`);
        if (activeCard && gridContainerRef.current) {
            const targetEl = activeCard.querySelector('.badge-target');
            if (targetEl) {
                const targetRect = targetEl.getBoundingClientRect();
                const containerRect = gridContainerRef.current.getBoundingClientRect();
                setBadgePos({
                    top: targetRect.top - containerRect.top,
                    left: targetRect.left - containerRect.left,
                    opacity: 1
                });
            }
        }
    };

    useEffect(() => {
        if (currentView === 'user' && clientTab === 'management') {
            updateBadgePosition(selectedService);
        }
    }, [selectedService, currentView, clientTab]);

    useEffect(() => {
        const handleResize = () => {
            if (currentView === 'user' && clientTab === 'management') {
                updateBadgePosition(selectedService);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [selectedService, currentView, clientTab]);

    const handleClaimFounder = () => {
        setSelectedPlanType('Plan Fundadores (100€/año)');
        setIsAuthModalOpen(true);
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        if (!regData.restaurantName || !regData.managerName || !regData.address) {
            triggerToast("Por favor, rellena todos los campos del registro.");
            return;
        }

        const newUser = {
            name: regData.restaurantName,
            manager: regData.managerName,
            phone: regData.phone || "+34 600 000 000",
            province: regData.province,
            address: regData.address,
            plan: selectedPlanType
        };

        setCurrentUser(newUser);
        setClients(prev => [
            { id: Date.now(), name: newUser.name, manager: newUser.manager, phone: newUser.phone, province: newUser.province, address: newUser.address, plan: newUser.plan, status: "Nuevo Registro", callNote: "" },
            ...prev
        ]);

        setIsAuthModalOpen(false);
        triggerToast(`¡Enhorabuena, ${newUser.manager}! ${newUser.restaurantName} registrado en ${selectedPlanType}.`);
    };

    const handleCreateReservationSubmit = (e) => {
        e.preventDefault();
        if (!newResData.name || !newResData.phone) {
            triggerToast("Por favor, indica al menos el nombre y teléfono del cliente.");
            return;
        }

        const resItem = {
            id: Date.now(),
            date: newResData.date,
            time: newResData.time,
            shift: newResData.shift,
            name: newResData.name,
            guests: parseInt(newResData.guests, 10) || 2,
            phone: newResData.phone,
            table: newResData.table,
            status: "Confirmada"
        };

        setReservations(prev => [resItem, ...prev]);
        setIsNewReservationModalOpen(false);
        setNewResData({
            date: getTodayString(),
            time: "14:00",
            shift: "Comida",
            name: "",
            guests: 2,
            phone: "",
            table: "Mesa 01"
        });
        triggerToast(`¡Reserva registrada con éxito para ${resItem.name} en ${resItem.table}!`);
    };

    const handleServiceFormSubmit = (e, serviceTitle) => {
        e.preventDefault();
        if (!currentUser) {
            triggerToast("Por favor, regístrate antes para asociar la solicitud a tu bar.");
            setIsAuthModalOpen(true);
            return;
        }
        triggerToast(`¡Solicitud de ${serviceTitle} enviada con éxito para ${currentUser.name}!`);
        e.target.reset();
    };

    const openCallModal = (client) => {
        setActiveCallClient(client);
        setCallMode('options');
        setTempNoteText(client.callNote || '');
    };

    const handleCallNotConnected = () => {
        const clientName = activeCallClient.name;
        setActiveCallClient(null);
        triggerToast(`Intento de contacto fallido con ${clientName} (No descolgado / Rechazada)`);
    };

    const handleCallConnected = () => {
        setCallMode('connected');
    };

    const handleSaveCallNoteAndClose = () => {
        if (!activeCallClient) return;
        setClients(prev => prev.map(c => {
            if (c.id === activeCallClient.id) {
                return { ...c, callNote: tempNoteText };
            }
            return c;
        }));
        triggerToast(`Notas de llamada guardadas correctamente para ${activeCallClient.name}`);
        setActiveCallClient(null);
    };

    const openNoteModal = (client) => {
        setActiveNoteClient(client);
        setEditNoteText(client.callNote || '');
    };

    const handleSaveExistingNote = () => {
        if (!activeNoteClient) return;
        setClients(prev => prev.map(c => {
            if (c.id === activeNoteClient.id) {
                return { ...c, callNote: editNoteText };
            }
            return c;
        }));
        triggerToast(`Nota actualizada para ${activeNoteClient.name}`);
        setActiveNoteClient(null);
    };

    const filteredClients = clients.filter(c => {
        const matchesProv = provinceFilter === 'all' || c.province.toLowerCase() === provinceFilter.toLowerCase();
        const matchesSearch = c.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
                              c.manager.toLowerCase().includes(searchFilter.toLowerCase()) ||
                              c.province.toLowerCase().includes(searchFilter.toLowerCase());
        return matchesProv && matchesSearch;
    });

    // LÓGICA DE CONTADORES CORREGIDA Y EXACTA
    const todayStr = getTodayString();
    const todayReservations = reservations.filter(r => r.date === todayStr);

    // 1. Reservas de Hoy: Total de registros creados para la fecha actual (excluyendo canceladas si quisiéramos, o el total absoluto)
    const totalTodayCount = todayReservations.length;

    // 2. Solo las reservas Confirmadas
    const confirmedReservations = todayReservations.filter(r => r.status === 'Confirmada');
    
    // 3. Solo las reservas Canceladas
    const cancelledReservations = todayReservations.filter(r => r.status === 'Cancelada');

    // 4. Solo las Pendientes
    const pendingReservations = todayReservations.filter(r => r.status === 'Pendiente');

    // 5. Total comensales (sumando solo las reservas activas: Confirmadas + Pendientes)
    const totalGuestsToday = todayReservations
        .filter(r => r.status !== 'Cancelada')
        .reduce((sum, r) => sum + (Number(r.guests) || 0), 0);

    // 6. Mesas Asignadas / Ocupadas: Exclusivamente las CONFIRMADAS
    const occupiedTablesCount = confirmedReservations.length;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0c1017]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 py-3 transition-colors duration-300">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/25 border border-amber-300/30 shrink-0">
                            <Utensils className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">HorecaWeb</h1>
                                <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" /> SHIELD V2.4
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">SaaS & Alojamiento Web Ultra-Seguro para Hostelería</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {currentUser ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold">
                                <Store className="w-4 h-4" />
                                <span className="hidden sm:inline">{currentUser.name} ({currentUser.province})</span>
                                <button onClick={() => setIsAuthModalOpen(true)} className="ml-1 text-[10px] underline hover:text-amber-300">Editar</button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsAuthModalOpen(true)}
                                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs transition shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                            >
                                <UserPlus className="w-4 h-4" />
                                <span>Registrar mi Bar / Restaurante</span>
                            </button>
                        )}

                        <button 
                            onClick={toggleTheme} 
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 border border-slate-300 dark:border-slate-700 transition flex items-center justify-center shadow-sm"
                            title="Cambiar tema claro/oscuro"
                        >
                            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>

                        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                            <button 
                                onClick={() => setCurrentView('user')} 
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${currentView === 'user' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                Panel Bar
                            </button>
                            <button 
                                onClick={() => setCurrentView('admin')} 
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${currentView === 'admin' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                Admin
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-6 flex-grow pb-16">
                {currentView === 'user' && (
                    <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 pb-1">
                        <button
                            onClick={() => setClientTab('operational')}
                            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-extrabold text-xs transition border-b-2 ${
                                clientTab === 'operational'
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white border-transparent'
                            }`}
                        >
                            <Smartphone className="w-4 h-4" />
                            <span>📱 Operativo Sala & Libro de Reservas</span>
                        </button>
                        <button
                            onClick={() => setClientTab('management')}
                            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-extrabold text-xs transition border-b-2 ${
                                clientTab === 'management'
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white border-transparent'
                            }`}
                        >
                            <Settings className="w-4 h-4" />
                            <span>⚙️ Gestión del Negocio (Propietario / PIN)</span>
                        </button>
                    </div>
                )}

                {currentView === 'user' && clientTab === 'operational' && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0f1420] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-amber-500" /> Libro Digital de Reservas de Sala
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gestión en tiempo real para camareros y personal de sala.</p>
                            </div>
                            <button 
                                onClick={() => setIsNewReservationModalOpen(true)}
                                className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-black px-5 py-3 rounded-xl transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 text-xs uppercase tracking-wider shrink-0"
                            >
                                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                                <span>➕ Nueva Reserva</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-[#0f1420] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Reservas de Hoy</span>
                                    <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{totalTodayCount}</span>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                    <Calendar className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="bg-white dark:bg-[#0f1420] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Total Comensales Activos</span>
                                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">{totalGuestsToday} pax</span>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                    <Users className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="bg-white dark:bg-[#0f1420] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Mesas Asignadas (Confirmadas)</span>
                                    <span className="text-2xl font-black text-indigo-500 dark:text-indigo-400 mt-1 block">{occupiedTablesCount} Mesas</span>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                                    <Utensils className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#0f1420] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <List className="w-4 h-4 text-amber-500" /> Listado de Reservas Registradas
                                </h3>
                                <span className="text-xs text-slate-500 dark:text-slate-400">Filtrado por: Hoy ({todayStr})</span>
                            </div>
                            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                                    <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                                        <tr>
                                            <th className="p-3.5">Hora / Turno</th>
                                            <th className="p-3.5">Cliente / Nombre</th>
                                            <th className="p-3.5">Nº Comensales</th>
                                            <th className="p-3.5">Teléfono</th>
                                            <th className="p-3.5">Mesa Asignada</th>
                                            <th className="p-3.5 text-right">Acciones (Cambiar Estado)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 bg-white dark:bg-slate-950/40">
                                        {reservations.map(r => (
                                            <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                                                <td className="p-3.5 font-bold text-amber-600 dark:text-amber-400">
                                                    {r.time} <span className="text-[10px] text-slate-400 font-normal">({r.shift})</span>
                                                </td>
                                                <td className="p-3.5 font-bold text-slate-900 dark:text-white">{r.name}</td>
                                                <td className="p-3.5 font-semibold">{r.guests} personas</td>
                                                <td className="p-3.5 text-slate-500 dark:text-slate-400">{r.phone}</td>
                                                <td className="p-3.5 font-extrabold text-slate-800 dark:text-slate-200">{r.table}</td>
                                                <td className="p-3.5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => toggleReservationStatus(r.id)}
                                                            className={`px-3 py-1 rounded-full text-[11px] font-black border transition cursor-pointer hover:scale-105 ${
                                                                r.status === 'Cancelada' 
                                                                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30' 
                                                                    : r.status === 'Confirmada'
                                                                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                                                    : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                                                            }`}
                                                            title="Haz clic para cambiar estado (Pendiente ➔ Confirmada ➔ Cancelada)"
                                                        >
                                                            {r.status === 'Confirmada' && '✓ Confirmada'}
                                                            {r.status === 'Cancelada' && '✕ Cancelada'}
                                                            {r.status === 'Pendiente' && '⏳ Pendiente'}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteReservation(r.id, r.name)}
                                                            className="p-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 rounded-lg hover:bg-rose-500/20 transition"
                                                            title="Eliminar reserva definitivamente"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* NUEVO MÓDULO: RESUMEN Y BALANCE DEL DÍA */}
                            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800/80">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                        <PieChart className="w-4 h-4 text-amber-500" />
                                        <span>Balance del Día ({todayStr})</span>
                                    </h4>
                                    <span className="text-[11px] text-slate-400 font-medium">Actualizado en tiempo real</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 flex items-center justify-between">
                                        <div>
                                            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block">Mesas Atendidas / Confirmadas</span>
                                            <span className="text-xl font-black text-emerald-800 dark:text-emerald-300 mt-0.5 block">{confirmedReservations.length} Mesas</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-black text-xs">
                                            {totalTodayCount > 0 ? Math.round((confirmedReservations.length / totalTodayCount) * 100) : 0}%
                                        </div>
                                    </div>

                                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3.5 flex items-center justify-between">
                                        <div>
                                            <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 block">Mesas Canceladas</span>
                                            <span className="text-xl font-black text-rose-800 dark:text-rose-300 mt-0.5 block">{cancelledReservations.length} Mesas</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-500 flex items-center justify-center font-black text-xs">
                                            <XCircle className="w-4 h-4" />
                                        </div>
                                    </div>

                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 flex items-center justify-between">
                                        <div>
                                            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 block">Reservas Pendientes</span>
                                            <span className="text-xl font-black text-amber-800 dark:text-amber-300 mt-0.5 block">{pendingReservations.length} Mesas</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center font-black text-xs">
                                            <TrendingUp className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {currentView === 'user' && clientTab === 'management' && (
                    <div className="space-y-8">
                        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 via-white to-amber-50/40 dark:from-[#131927] dark:via-[#0f1422] dark:to-[#0d121c] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-xl transition-colors duration-300">
                            <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
                            
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/50 text-emerald-800 dark:text-emerald-400 text-xs font-semibold">
                                    <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Servidor Ultra-Seguro Anti-Hackeo Incluido
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/50 text-amber-800 dark:text-amber-400 text-xs font-semibold">
                                    <Smartphone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Acceso App Multiplataforma Incluido
                                </span>
                            </div>

                            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl">
                                Tu Web Blindada contra Ciberataques, Caídas y Pérdida de Clientes
                            </h2>

                            <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed max-w-4xl">
                                El 80% de las webs de restaurantes que sufren un hackeo o caída pierden hasta un 40% de sus reservas semanales. Con nuestra <span className="text-amber-600 dark:text-amber-400 font-bold underline decoration-amber-500/50">Infraestructura Blindada Nivel Hostelería</span>, la página web de tu bar se aloja en un servidor aislado ultra-seguro con copias de seguridad diarias y cortafuegos activo 24/7.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                                <div className="flex items-center space-x-2 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 shadow-sm">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                                    <span>Firewall WAF 24/7</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 shadow-sm">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                                    <span>SSL Avanzado Gratis</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 shadow-sm">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                                    <span>Backups Diarios</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 shadow-sm">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                                    <span>Anti-Inyección Malware</span>
                                </div>
                            </div>
                        </section>

                        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/15 via-white to-amber-100/60 dark:from-amber-950/40 dark:via-[#0e1320] dark:to-amber-900/20 border-2 border-amber-500/40 p-6 md:p-8 shadow-2xl transition-all duration-300">
                            <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl pointer-events-none"></div>
                            
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="space-y-4 max-w-3xl">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black tracking-wide uppercase shadow-md shadow-amber-500/20">
                                            🔥 Solo para los 25 primeros locales
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-400 text-xs font-bold">
                                            <Award className="w-3.5 h-3.5" /> Oferta Especial Plan Fundadores
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                            «Tu restaurante en internet: rápido, seguro y sin complicaciones»
                                        </h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                            Únete a nuestro club exclusivo de lanzamientos y asegura la tarifa promocional de por vida.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                                        <div className="flex items-center space-x-2 text-xs font-medium text-slate-800 dark:text-slate-200">
                                            <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0" />
                                            <span>Alojamiento web ultra-rápido y optimizado para móviles.</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-xs font-medium text-slate-800 dark:text-slate-200">
                                            <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0" />
                                            <span>Mantenimiento técnico y protección antihackeo continua.</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-xs font-medium text-slate-800 dark:text-slate-200">
                                            <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0" />
                                            <span>Copias de seguridad automáticas y certificado SSL gratis.</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-xs font-medium text-slate-800 dark:text-slate-200">
                                            <CheckCircle className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0" />
                                            <span>Precio promocional blindado de por vida.</span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-700 dark:text-slate-400 italic bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
                                        💡 <strong>¿Necesitas un diseño a medida o cambios personalizados?</strong> Ofrecemos servicios de desarrollo custom bajo demanda.
                                    </p>
                                </div>

                                <div className="lg:w-80 bg-white dark:bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 flex flex-col items-center text-center shadow-xl shrink-0">
                                    <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Precio Oferta Fundadores</span>
                                    <div className="mt-2 flex items-baseline justify-center gap-1">
                                        <span className="text-4xl font-black text-slate-900 dark:text-white">100 €</span>
                                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400">/ año</span>
                                    </div>
                                    <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">(o 10 € / mes)</span>
                                    
                                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-through">
                                        Precio Normal posterior: 250 € / año
                                    </div>

                                    <button 
                                        onClick={handleClaimFounder}
                                        className="w-full mt-5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-black py-3 px-4 rounded-xl transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                                    >
                                        <Sparkles className="w-4 h-4 stroke-[2.5]" />
                                        <span>Reclamar plaza de Fundador</span>
                                    </button>
                                </div>
                            </div>
                        </section>

                        {serverHealth === 'green' && (
                            <div className="relative overflow-hidden rounded-2xl bg-emerald-950/20 dark:bg-emerald-950/40 border-2 border-emerald-500/40 p-5 shadow-xl transition-all duration-300">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping shrink-0 mt-1.5"></div>
                                        <div className="space-y-1">
                                            <h3 className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                                                🟢 Tu página web está 100% activa, rápida y protegida
                                            </h3>
                                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                                                Todo funciona correctamente. Tus clientes pueden ver tu carta, reservar y navegar sin problemas ni interrupciones.
                                            </p>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                                                🛡️ Certificado SSL Activo | Backups Diarios Realizados | Cortafuegos Anti-Hackeo WAF Activo 24/7.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800 shrink-0 self-start sm:self-center">
                                        <span className="text-[10px] text-slate-400 px-1 font-semibold">Test Estado:</span>
                                        <button onClick={() => setServerHealth('green')} className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950">Verde</button>
                                        <button onClick={() => setServerHealth('orange')} className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition">Naranja</button>
                                        <button onClick={() => setServerHealth('red')} className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-slate-950 transition">Rojo</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {serverHealth === 'orange' && (
                            <div className="relative overflow-hidden rounded-2xl bg-amber-950/20 dark:bg-amber-950/40 border-2 border-amber-500/40 p-5 shadow-xl transition-all duration-300">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse shrink-0 mt-1.5"></div>
                                        <div className="space-y-1">
                                            <h3 className="text-base font-extrabold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                                                🟡 Mantenimiento o actualización en curso
                                            </h3>
                                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                                                Estamos aplicando cambios en tu menú o web. Tu página sigue estando visible para tus clientes.
                                            </p>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                                                🛠️ Servidor en Modo Optimización | Seguridad y Certificados 100% Operativos.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800 shrink-0 self-start sm:self-center">
                                        <span className="text-[10px] text-slate-400 px-1 font-semibold">Test Estado:</span>
                                        <button onClick={() => setServerHealth('green')} className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition">Verde</button>
                                        <button onClick={() => setServerHealth('orange')} className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">Naranja</button>
                                        <button onClick={() => setServerHealth('red')} className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-slate-950 transition">Rojo</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {serverHealth === 'red' && (
                            <div className="relative overflow-hidden rounded-2xl bg-rose-950/20 dark:bg-rose-950/40 border-2 border-rose-500/40 p-5 shadow-xl transition-all duration-300">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping shrink-0 mt-1.5"></div>
                                        <div className="space-y-1">
                                            <h3 className="text-base font-extrabold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                                                🔴 Alerta de Servicio: Atención requerida
                                            </h3>
                                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                                                Hay un aviso importante en tu cuenta. Ponte en contacto con nuestro equipo de soporte prioritario.
                                            </p>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                                                ⚠️ Revisión de cuenta o dominio requerida | Soporte Técnico 24/7 Notificado.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800 shrink-0 self-start sm:self-center">
                                        <span className="text-[10px] text-slate-400 px-1 font-semibold">Test Estado:</span>
                                        <button onClick={() => setServerHealth('green')} className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition">Verde</button>
                                        <button onClick={() => setServerHealth('orange')} className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition">Naranja</button>
                                        <button onClick={() => setServerHealth('red')} className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-slate-950">Rojo</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                    <Utensils className="w-3.5 h-3.5" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Centro de Gestión de tu Web & Restaurante</h3>
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">Haz clic en una opción para desplegar las acciones</span>
                        </div>

                        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" ref={gridContainerRef}>
                            <div 
                                className="glider-badge absolute z-30 pointer-events-none"
                                style={{ top: `${badgePos.top}px`, left: `${badgePos.left}px`, opacity: badgePos.opacity }}
                            >
                                <div className="floating-icon-anim w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-lg glow-amber border border-amber-200/50">
                                    <Utensils className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                                </div>
                            </div>

                            <div 
                                id="card-1"
                                onClick={() => setSelectedService(1)}
                                className={`group relative cursor-pointer bg-white dark:bg-[#0f1420] border rounded-2xl p-5 transition-all duration-300 shadow-sm ${selectedService === 1 ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200 dark:border-slate-800 hover:border-amber-500'}`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <div className="badge-target w-11 h-11 shrink-0"></div>
                                    </div>
                                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/20">
                                        Presupuesto a Medida
                                    </span>
                                </div>
                                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">1. Rediseño Completo de tu Web</h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Indica tu URL actual y la idea de diseño que quieres. Te enviamos un presupuesto personalizado para renovar tu negocio entero.</p>
                            </div>

                            <div 
                                id="card-2"
                                onClick={() => setSelectedService(2)}
                                className={`group relative cursor-pointer bg-white dark:bg-[#0f1420] border rounded-2xl p-5 transition-all duration-300 shadow-sm ${selectedService === 2 ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200 dark:border-slate-800 hover:border-amber-500'}`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                                            <Wrench className="w-6 h-6" />
                                        </div>
                                        <div className="badge-target w-11 h-11 shrink-0"></div>
                                    </div>
                                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/20">
                                        Coste Adicional Puntual
                                    </span>
                                </div>
                                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">2. Pequeños Cambios / Nuevo Estilo</h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Mantén la estructura de tu web pero añade nuevos elementos, platos, fotos del local, promociones o retoques tipográficos.</p>
                            </div>

                            <div 
                                id="card-3"
                                onClick={() => setSelectedService(3)}
                                className={`group relative cursor-pointer bg-white dark:bg-[#0f1420] border rounded-2xl p-5 transition-all duration-300 shadow-sm ${selectedService === 3 ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200 dark:border-slate-800 hover:border-amber-500'}`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                                            <AlertTriangle className="w-6 h-6" />
                                        </div>
                                        <div className="badge-target w-11 h-11 shrink-0"></div>
                                    </div>
                                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20">
                                        Incluido en tu Plan
                                    </span>
                                </div>
                                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">3. Incidencias & Soporte Web</h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Soporte técnico prioritario para resolver caídas del servidor, errores de carga o fallos de seguridad incluidos en tu suscripción.
                                </p>
                            </div>

                            <div 
                                id="card-4"
                                onClick={() => setSelectedService(4)}
                                className={`group relative cursor-pointer bg-white dark:bg-[#0f1420] border rounded-2xl p-5 transition-all duration-300 shadow-sm ${selectedService === 4 ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200 dark:border-slate-800 hover:border-amber-500'}`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div className="badge-target w-11 h-11 shrink-0"></div>
                                    </div>
                                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20">
                                        Control Gastro-PDF
                                    </span>
                                </div>
                                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">4. Modificación de Cartas & Menús PDF</h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Sube tu nueva carta o menú del día en PDF/imagen y lo actualizamos al instante con código QR dinámico listo para tus mesas.</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#0f1420] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl transition-colors duration-300">
                            {selectedService === 1 && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">1</div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Solicitud de Rediseño Web Completo</h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Renueva la imagen digital de tu bar o restaurante</p>
                                            </div>
                                        </div>
                                        <span className="text-xs bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 px-3 py-1 rounded-full font-semibold">Presupuesto sin compromiso</span>
                                    </div>

                                    <form onSubmit={(e) => handleServiceFormSubmit(e, 'Rediseño Web')} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nombre del Restaurante / Bar *</label>
                                                <input type="text" required defaultValue={currentUser?.name || ''} placeholder="Ej: Taberna El Cordobés" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">URL Web Actual *</label>
                                                <input type="url" required placeholder="https://www.minegocio.com" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">¿Qué concepto o estilo buscas?</label>
                                            <textarea rows="3" placeholder="Ej: Queremos un diseño más moderno, con tonos oscuros, integración de reservas directas y fotografía gastronómica." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"></textarea>
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <button type="submit" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center space-x-2">
                                                <Send className="w-4 h-4" />
                                                <span>Enviar Solicitud de Rediseño</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {selectedService === 2 && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">2</div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Solicitud de Pequeños Cambios / Estilo</h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Puntuales ajustes gráficos, textos o nuevas secciones</p>
                                            </div>
                                        </div>
                                        <span className="text-xs bg-indigo-100 dark:bg-indigo-500/10 text-indigo-800 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-500/30 px-3 py-1 rounded-full font-semibold">Valoración en &lt; 24h</span>
                                    </div>

                                    <form onSubmit={(e) => handleServiceFormSubmit(e, 'Pequeños Cambios')} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nombre del Local *</label>
                                                <input type="text" required defaultValue={currentUser?.name || ''} placeholder="Ej: RestoBar Central" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Tipo de Cambio Solicitado *</label>
                                                <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500">
                                                    <option>Cambio de Horario / Teléfono / Ubicación</option>
                                                    <option>Añadir nueva sección o fotos del local</option>
                                                    <option>Actualización de colores o tipografías</option>
                                                    <option>Añadir enlace a Reservas Externa</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Detalles concretos del cambio *</label>
                                            <textarea rows="3" required placeholder="Explica exactamente los elementos a cambiar o añadir..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"></textarea>
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-indigo-600/20 flex items-center space-x-2">
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Solicitar Retoque Web</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {selectedService === 3 && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">3</div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Centro de Incidencias & Soporte URGENTE</h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Atención técnica prioritaria incluida en tu plan de suscripción</p>
                                            </div>
                                        </div>
                                        <span className="text-xs bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 px-3 py-1 rounded-full font-semibold">Soporte Incluido Gratis</span>
                                    </div>

                                    <form onSubmit={(e) => handleServiceFormSubmit(e, 'Incidencia')} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Bar / Restaurante *</label>
                                                <input type="text" required defaultValue={currentUser?.name || ''} placeholder="Ej: GastroBar Sevilla" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nivel de Urgencia *</label>
                                                <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500">
                                                    <option>Alta - Web Caída o Error Crítico</option>
                                                    <option>Media - Error en Carta / Formulario</option>
                                                    <option>Baja - Consulta General de Configuración</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Descripción de la Incidencia *</label>
                                            <textarea rows="3" required placeholder="Describe el problema técnico..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"></textarea>
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-rose-600/20 flex items-center space-x-2">
                                                <ShieldAlert className="w-4 h-4" />
                                                <span>Abrir Ticket de Soporte</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {selectedService === 4 && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">4</div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Gestor Gastro-PDF: Carta y Menú QR</h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Actualiza al instante el PDF que ven tus clientes escaneando las mesas</p>
                                            </div>
                                        </div>
                                        <span className="text-xs bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 px-3 py-1 rounded-full font-semibold">Sistema QR Activo</span>
                                    </div>

                                    <form onSubmit={(e) => handleServiceFormSubmit(e, 'Actualización Menú PDF')} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nombre del Local *</label>
                                                <input type="text" required defaultValue={currentUser?.name || ''} placeholder="Ej: Asador Real" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Tipo de Carta *</label>
                                                <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500">
                                                    <option>Carta Principal de Platos</option>
                                                    <option>Menú del Día / Especial</option>
                                                    <option>Carta de Vinos y Bebidas</option>
                                                    <option>Carta de Postres</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div onClick={() => triggerToast('Archivo seleccionado correctamente')} className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-center bg-slate-50 dark:bg-slate-900/50 transition cursor-pointer">
                                            <UploadCloud className="w-10 h-10 text-emerald-500 dark:text-emerald-400 mx-auto mb-2" />
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Haz clic para subir tu nueva Carta o Menú PDF</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Soporta PDF, PNG, JPG hasta 15MB</p>
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center space-x-2">
                                                <RefreshCw className="w-4 h-4" />
                                                <span>Actualizar Menú QR Ahora</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {currentView === 'admin' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-[#0f1420] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl transition-colors duration-300">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <LayoutDashboard className="w-5 h-5 text-amber-500 dark:text-amber-400" /> Panel General de Administración
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Base de datos de locales, gerentes, contactos y presupuestos</p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <button 
                                        onClick={() => setIsCyberModalOpen(true)}
                                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 flex items-center gap-2 border border-emerald-300/40"
                                    >
                                        <span>🛡️ Registro de Ciberseguridad</span>
                                    </button>

                                    <div className="relative">
                                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                                        <input 
                                            type="text" 
                                            value={searchFilter}
                                            onChange={(e) => setSearchFilter(e.target.value)}
                                            placeholder="Buscar restaurante o gerente..." 
                                            className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                                        />
                                    </div>
                                    <select 
                                        value={provinceFilter}
                                        onChange={(e) => setProvinceFilter(e.target.value)}
                                        className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                                    >
                                        <option value="all">Todas las Provincias</option>
                                        <option value="Madrid">Madrid</option>
                                        <option value="Barcelona">Barcelona</option>
                                        <option value="Valencia">Valencia</option>
                                        <option value="Sevilla">Sevilla</option>
                                        <option value="Málaga">Málaga</option>
                                        <option value="Bilbao">Bilbao</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Bares Registrados</span>
                                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{clients.length} Locales</div>
                                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 inline-block">Datos de Contacto Completos</span>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Plazas Plan Fundadores</span>
                                    <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                                        {clients.filter(c => c.plan.includes('Fundadores')).length} / 25 Ocupadas
                                    </div>
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 inline-block">Tarifa Blindada 100€/año</span>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Uptime Servidor Aislado</span>
                                    <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">99.99%</div>
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 inline-block">Firewall Activo Sin Incidencias</span>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                                    <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                                        <tr>
                                            <th className="p-3.5">Restaurante / Bar</th>
                                            <th className="p-3.5">Gerente / Persona Contacto</th>
                                            <th className="p-3.5">Provincia y Dirección</th>
                                            <th className="p-3.5">Plan Contratado</th>
                                            <th className="p-3.5 text-right">Acciones de Gestión</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 bg-white dark:bg-slate-950/40">
                                        {filteredClients.map(c => (
                                            <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                                                <td className="p-3.5 font-bold text-slate-900 dark:text-white">{c.name}</td>
                                                <td className="p-3.5 font-semibold text-amber-600 dark:text-amber-400">{c.manager || "Gerente Registrado"}</td>
                                                <td className="p-3.5 text-slate-500 dark:text-slate-400">{c.province} — {c.address || "Dirección Principal"}</td>
                                                <td className="p-3.5 font-medium">{c.plan}</td>
                                                <td className="p-3.5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => openCallModal(c)}
                                                            className="p-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition"
                                                            title="Llamar al cliente"
                                                        >
                                                            <Phone className="w-4 h-4" />
                                                        </button>

                                                        {c.callNote && c.callNote.trim() !== '' && (
                                                            <button 
                                                                onClick={() => openNoteModal(c)}
                                                                className="p-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition animate-pulse"
                                                                title="Ver / Editar notas de llamada"
                                                            >
                                                                <FileText className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        <button 
                                                            onClick={() => triggerToast(`Contactando a ${c.manager} (${c.name}) para presupuesto`)} 
                                                            className="px-3 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 rounded-lg font-bold hover:bg-amber-500/20 transition ml-1"
                                                        >
                                                            Dar Presupuesto
                                                        </button>

                                                        <button 
                                                            onClick={() => handleDeleteClient(c.id, c.name)}
                                                            className="p-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 rounded-lg hover:bg-rose-500/20 transition ml-1"
                                                            title="Eliminar local de admin"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* MODALS */}
            {isNewReservationModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#0f1420] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 relative shadow-2xl transition-colors duration-300">
                        <button onClick={() => setIsNewReservationModalOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                        <div className="flex items-center space-x-3 mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 font-bold">➕</div>
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Nueva Reserva en Sala</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Registrar reserva presencial o telefónica</p>
                            </div>
                        </div>
                        <form onSubmit={handleCreateReservationSubmit} className="space-y-3.5">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Fecha *</label>
                                    <input type="date" required value={newResData.date} onChange={(e) => setNewResData({...newResData, date: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Hora / Turno *</label>
                                    <input type="time" required value={newResData.time} onChange={(e) => setNewResData({...newResData, time: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre del Cliente *</label>
                                <input type="text" required value={newResData.name} onChange={(e) => setNewResData({...newResData, name: e.target.value})} placeholder="Ej: Pedro Martínez" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nº Comensales *</label>
                                    <input type="number" min="1" max="30" required value={newResData.guests} onChange={(e) => setNewResData({...newResData, guests: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Mesa Asignada *</label>
                                    <select value={newResData.table} onChange={(e) => setNewResData({...newResData, table: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500">
                                        <option value="Mesa 01">Mesa 01</option>
                                        <option value="Mesa 02">Mesa 02</option>
                                        <option value="Mesa 03">Mesa 03</option>
                                        <option value="Mesa 04">Mesa 04</option>
                                        <option value="Mesa 05 (VIP)">Mesa 05 (VIP)</option>
                                        <option value="Mesa Terraza 01">Mesa Terraza 01</option>
                                        <option value="Mesa Terraza 02">Mesa Terraza 02</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Teléfono de Contacto *</label>
                                <input type="text" required value={newResData.phone} onChange={(e) => setNewResData({...newResData, phone: e.target.value})} placeholder="Ej: +34 612 000 999" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500" />
                            </div>
                            <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold py-3 rounded-xl transition shadow-lg shadow-amber-500/20 text-xs uppercase tracking-wider mt-2">
                                Guardar Reserva en Libro Digital
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {isCyberModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#0f1420] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl transition-colors duration-300">
                        <button onClick={() => setIsCyberModalOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                        <div className="flex items-center space-x-3 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">🛡️ Registro de Ciberseguridad</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Informe en tiempo real del escudo de protección web</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                            <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-center">
                                <span className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400 block mb-1">Ataques Bloqueados</span>
                                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 block">1.420</span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">Este mes</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-center">
                                <span className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400 block mb-1">Uptime Servidor</span>
                                <span className="text-lg font-black text-amber-500 block">99.99%</span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">Estabilidad</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-center">
                                <span className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400 block mb-1">Tiempo de Carga</span>
                                <span className="text-lg font-black text-indigo-500 dark:text-indigo-400 block">0.28s</span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">Promedio</span>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-6">
                            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center justify-between">
                                <span>Desglose de Bloqueos por Provincias</span>
                                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                            </h4>
                            <div className="space-y-2.5">
                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                                        <span>Madrid</span>
                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">40%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '40%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                                        <span>Barcelona</span>
                                        <span className="text-amber-500 font-bold">30%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '30%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                                        <span>Valencia</span>
                                        <span className="text-indigo-500 dark:text-indigo-400 font-bold">15%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: '15%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button onClick={() => triggerToast("📄 Reporte PDF de Ciberseguridad generado con éxito para el cliente.")} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-3 rounded-xl transition shadow-lg shadow-amber-500/20 text-xs flex items-center justify-center gap-2 uppercase tracking-wider">
                            <span>📄 Exportar Reporte PDF para Cliente</span>
                        </button>
                    </div>
                </div>
            )}

            {activeCallClient && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#0f1420] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 relative shadow-2xl transition-colors duration-300">
                        <button onClick={() => setActiveCallClient(null)} className="absolute right-4 top-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                <PhoneCall className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Llamada a {activeCallClient.name}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Gerente: <span className="font-semibold text-amber-600 dark:text-amber-400">{activeCallClient.manager}</span></p>
                            </div>
                        </div>

                        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-4 text-center">
                            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Teléfono de Contacto</span>
                            <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">{activeCallClient.phone || "+34 600 000 000"}</span>
                        </div>

                        {callMode === 'options' && (
                            <div className="space-y-3">
                                <p className="text-xs text-slate-600 dark:text-slate-400 text-center mb-2">Selecciona el estado de la llamada:</p>
                                <button onClick={handleCallNotConnected} className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30 font-bold py-2.5 px-4 rounded-xl transition text-xs flex items-center justify-center gap-2">
                                    <PhoneOff className="w-4 h-4" />
                                    <span>No descolgado / Rechazada</span>
                                </button>
                                <button onClick={handleCallConnected} className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl transition shadow-lg shadow-emerald-500/20 text-xs flex items-center justify-center gap-2">
                                    <PhoneIncoming className="w-4 h-4" />
                                    <span>Descolgado / En Llamada</span>
                                </button>
                            </div>
                        )}

                        {callMode === 'connected' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                                    <span className="flex items-center gap-1.5"><Mic className="w-3.5 h-3.5 animate-pulse" /> En llamada activa...</span>
                                    <span className="text-[10px]">Toma notas en tiempo real</span>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Notas de la Conversación *</label>
                                    <textarea rows="4" value={tempNoteText} onChange={(e) => setTempNoteText(e.target.value)} placeholder="Escribe aquí los detalles del presupuesto, peticiones o acuerdos..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"></textarea>
                                </div>
                                <button onClick={handleSaveCallNoteAndClose} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3 rounded-xl transition shadow-lg shadow-amber-500/20 text-xs flex items-center justify-center gap-2">
                                    <Save className="w-4 h-4" />
                                    <span>Finalizar Llamada y Guardar Notas</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeNoteClient && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#0f1420] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 relative shadow-2xl transition-colors duration-300">
                        <button onClick={() => setActiveNoteClient(null)} className="absolute right-4 top-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Notas de Llamada: {activeNoteClient.name}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Gerente: <span className="font-semibold text-amber-600 dark:text-amber-400">{activeNoteClient.manager}</span></p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Historial / Edición de Nota</label>
                                <textarea rows="5" value={editNoteText} onChange={(e) => setEditNoteText(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"></textarea>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setActiveNoteClient(null)} className="w-1/2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2.5 rounded-xl transition text-xs">Cerrar</button>
                                <button onClick={handleSaveExistingNote} className="w-1/2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-2.5 rounded-xl transition shadow-md text-xs">Guardar Cambios</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isAuthModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#0f1420] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 relative shadow-2xl transition-colors duration-300">
                        <button onClick={() => setIsAuthModalOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                <Store className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Registro de Propietario</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Datos para identificarte y enviarte presupuestos claros</p>
                            </div>
                        </div>

                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre del Restaurante o Bar *</label>
                                <input type="text" required value={regData.restaurantName} onChange={(e) => setRegData({...regData, restaurantName: e.target.value})} placeholder="Ej: Taberna La Esquina" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre del Gerente / Persona de Contacto *</label>
                                <input type="text" required value={regData.managerName} onChange={(e) => setRegData({...regData, managerName: e.target.value})} placeholder="Ej: Carlos Ramírez" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Teléfono de Contacto</label>
                                <input type="text" value={regData.phone} onChange={(e) => setRegData({...regData, phone: e.target.value})} placeholder="Ej: +34 600 123 456" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Provincia *</label>
                                    <select value={regData.province} onChange={(e) => setRegData({...regData, province: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500">
                                        <option value="Madrid">Madrid</option>
                                        <option value="Barcelona">Barcelona</option>
                                        <option value="Valencia">Valencia</option>
                                        <option value="Sevilla">Sevilla</option>
                                        <option value="Málaga">Málaga</option>
                                        <option value="Bilbao">Bilbao</option>
                                        <option value="Zaragoza">Zaragoza</option>
                                        <option value="Alicante">Alicante</option>
                                        <option value="Otra">Otra Provincia</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Plan de Selección</label>
                                    <select value={selectedPlanType} onChange={(e) => setSelectedPlanType(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 focus:outline-none">
                                        <option value="Plan Fundadores (100€/año)">Plan Fundadores (100€/año)</option>
                                        <option value="Plan Estándar Anual (250€/año)">Plan Estándar Anual (250€/año)</option>
                                        <option value="Plan Estándar Mensual (25€/mes)">Plan Estándar Mensual (25€/mes)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Dirección Física del Local *</label>
                                <input type="text" required value={regData.address} onChange={(e) => setRegData({...regData, address: e.target.value})} placeholder="Ej: Calle Gran Vía 14" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500" />
                            </div>
                            <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold py-3 rounded-xl transition shadow-lg shadow-amber-500/20 text-sm mt-2">
                                Guardar Registro y Reclamar Plaza
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className={`fixed bottom-6 right-6 z-50 bg-amber-500 text-slate-950 font-extrabold text-xs px-4 py-3 rounded-xl shadow-2xl transition-all duration-300 transform flex items-center space-x-2 border border-amber-300 ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>{toastMessage}</span>
            </div>
        </div>
    );
}