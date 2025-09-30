// ============================================
// COGNIZANCE RESULTS PORTAL - App.jsx
// Copy this ENTIRE file to src/App.jsx
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Download, Share2, Printer, Upload, Edit2, Eye, EyeOff, LogOut, Users, Award, FileText, Home, Menu, X, CheckCircle } from 'lucide-react';

// Simulated Database (In production, this would be PostgreSQL/Supabase)
const initialData = {
  users: [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator' },
    { id: 2, username: 'teacher1', password: 'teacher123', role: 'teacher', name: 'Fatima Rahman' }
  ],
  events: [
    { id: 1, name: 'Story Writing Competition', category: 'Literary', date: '2024-09-15', description: 'Annual creative writing contest' },
    { id: 2, name: 'Quran Recitation', category: 'Religious', date: '2024-09-20', description: 'Beautiful recitation competition' },
    { id: 3, name: 'Science Fair', category: 'Academic', date: '2024-09-25', description: 'Innovation showcase' }
  ],
  results: [
    {
      id: 1,
      eventId: 1,
      studentName: 'Ahmed Ali',
      rollNo: 'C-12',
      class: 'Grade 8',
      team: 'Al-Falah House',
      prize: '1st',
      score: '95/100',
      remarks: 'Exceptional creativity and narrative flow',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
      visible: true,
      createdAt: '2024-09-16T10:30:00Z'
    },
    {
      id: 2,
      eventId: 1,
      studentName: 'Aisha Mohammed',
      rollNo: 'C-08',
      class: 'Grade 8',
      team: 'Al-Noor House',
      prize: '2nd',
      score: '92/100',
      remarks: 'Outstanding imagination and character development',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha',
      visible: true,
      createdAt: '2024-09-16T10:31:00Z'
    },
    {
      id: 3,
      eventId: 2,
      studentName: 'Omar Hassan',
      rollNo: 'D-15',
      class: 'Grade 9',
      team: 'Al-Iman House',
      prize: '1st',
      score: 'Excellent',
      remarks: 'Beautiful tajweed and melodious recitation',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Omar',
      visible: true,
      createdAt: '2024-09-21T14:20:00Z'
    }
  ],
  congratulatoryMessages: {
    1: 'MashaAllah! Your outstanding performance in Story Writing has made us all proud. May Allah continue to bless you with knowledge and wisdom.',
    2: 'Congratulations on your wonderful achievement! Your dedication and hard work have truly paid off.',
    3: 'MashaAllah! Your beautiful recitation has touched our hearts. May Allah reward your efforts.'
  }
};

// Message Templates
const messageTemplates = {
  formal: (name, event, prize) => 
    `Dear ${name},\n\nWe are pleased to inform you that you have been awarded ${prize} Prize in ${event}. Your dedication and hard work are commendable.\n\nBest Regards,\nCOGNIZANCE Team`,
  warm: (name, event, prize) => 
    `Dear ${name},\n\nCongratulations! 🎉 We're so proud of your ${prize} Prize achievement in ${event}. Your talent and effort truly shine through!\n\nWarm wishes,\nCOGNIZANCE Team`,
  enthusiastic: (name, event, prize) => 
    `🌟 AMAZING NEWS, ${name}! 🌟\n\nYou've WON ${prize} Prize in ${event}! Your incredible performance has inspired us all. Keep shining bright!\n\nCheers,\nCOGNIZANCE Team`,
  arabic: (name, event, prize) => 
    `بسم الله الرحمن الرحيم\n\nعزيزي/عزيزتي ${name}،\n\nماشاء الله! بارك الله فيك على حصولك على ${prize} في ${event}. إن إنجازك يملأ قلوبنا فخراً.\n\nمع أطيب التمنيات،\nفريق كوجنيزانس`
};

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('all');
  const [filterPrize, setFilterPrize] = useState('all');
  const [selectedResult, setSelectedResult] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [notification, setNotification] = useState(null);

  // Forms state
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [eventForm, setEventForm] = useState({ name: '', category: '', date: '', description: '' });
  const [resultForm, setResultForm] = useState({
    eventId: '',
    studentName: '',
    rollNo: '',
    class: '',
    team: '',
    prize: '',
    score: '',
    remarks: '',
    photo: '',
    visible: true
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const user = data.users.find(u => u.username === loginForm.username && u.password === loginForm.password);
    if (user) {
      setCurrentUser(user);
      showNotification(`Welcome, ${user.name}!`);
      setLoginForm({ username: '', password: '' });
    } else {
      showNotification('Invalid credentials', 'error');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('home');
    showNotification('Logged out successfully');
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    const newEvent = {
      id: data.events.length + 1,
      ...eventForm
    };
    setData(prev => ({ ...prev, events: [...prev.events, newEvent] }));
    showNotification('Event created successfully!');
    setEventForm({ name: '', category: '', date: '', description: '' });
    setActiveTab('results');
  };

  const handlePublishResult = (e) => {
    e.preventDefault();
    const newResult = {
      id: data.results.length + 1,
      ...resultForm,
      eventId: parseInt(resultForm.eventId),
      createdAt: new Date().toISOString()
    };
    setData(prev => ({ ...prev, results: [...prev.results, newResult] }));
    const event = data.events.find(ev => ev.id === parseInt(resultForm.eventId));
    const message = messageTemplates.warm(resultForm.studentName, event.name, resultForm.prize);
    setData(prev => ({
      ...prev,
      congratulatoryMessages: { ...prev.congratulatoryMessages, [newResult.id]: message }
    }));
    showNotification('Result published successfully!');
    setResultForm({
      eventId: '',
      studentName: '',
      rollNo: '',
      class: '',
      team: '',
      prize: '',
      score: '',
      remarks: '',
      photo: '',
      visible: true
    });
  };

  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      showNotification('CSV import successful! (Demo mode - file not actually processed)');
    }
  };

  const exportNotifications = () => {
    const csv = data.results
      .filter(r => r.visible)
      .map(r => {
        const event = data.events.find(e => e.id === r.eventId);
        const message = messageTemplates.formal(r.studentName, event.name, r.prize);
        return `${r.studentName},${r.rollNo},${message.replace(/\n/g, ' ')}`;
      })
      .join('\n');
    
    const blob = new Blob([`Name,Roll No,Message\n${csv}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notifications.csv';
    a.click();
    showNotification('Notifications exported successfully!');
  };

  const generateCertificate = (result) => {
    const event = data.events.find(e => e.id === result.eventId);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate - ${result.studentName}</title>
          <style>
            body { 
              font-family: 'Georgia', serif; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              min-height: 100vh; 
              margin: 0;
              background: #f5f5f5;
            }
            .certificate {
              width: 800px;
              padding: 60px;
              background: white;
              border: 15px solid #1a5f3f;
              box-shadow: 0 0 30px rgba(0,0,0,0.2);
              text-align: center;
            }
            .header { color: #1a5f3f; font-size: 48px; font-weight: bold; margin-bottom: 20px; }
            .subheader { color: #d4af37; font-size: 24px; margin-bottom: 40px; }
            .content { font-size: 18px; line-height: 1.8; margin: 30px 0; }
            .name { font-size: 36px; color: #1a5f3f; font-weight: bold; margin: 20px 0; }
            .prize { font-size: 28px; color: #d4af37; font-weight: bold; margin: 20px 0; }
            .date { margin-top: 50px; font-size: 16px; color: #666; }
            @media print { body { background: white; } }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="header">بسم الله الرحمن الرحيم</div>
            <div class="subheader">COGNIZANCE - Certificate of Excellence</div>
            <div class="content">This is to certify that</div>
            <div class="name">${result.studentName}</div>
            <div class="content">Roll No: ${result.rollNo} | Class: ${result.class}</div>
            <div class="content">has been awarded</div>
            <div class="prize">${result.prize} Prize</div>
            <div class="content">in</div>
            <div class="prize">${event.name}</div>
            <div class="content">
              Score: ${result.score}<br/>
              ${result.remarks}
            </div>
            <div class="date">Date: ${new Date(event.date).toLocaleDateString()}</div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
  };

  const filteredResults = data.results.filter(r => {
    const event = data.events.find(e => e.id === r.eventId);
    const matchesSearch = r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = filterEvent === 'all' || r.eventId === parseInt(filterEvent);
    const matchesPrize = filterPrize === 'all' || r.prize === filterPrize;
    return matchesSearch && matchesEvent && matchesPrize && r.visible;
  });

  // Login Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-emerald-900">COGNIZANCE</h1>
            <p className="text-emerald-700 mt-2">Results Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={e => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-800 hover:to-emerald-700 transition-all"
            >
              Login
            </button>
          </form>

          <div className="mt-6 p-4 bg-emerald-50 rounded-lg text-sm">
            <p className="font-semibold text-emerald-900 mb-2">Demo Credentials:</p>
            <p className="text-emerald-700">Admin: admin / admin123</p>
            <p className="text-emerald-700">Teacher: teacher1 / teacher123</p>
          </div>
        </div>
      </div>
    );
  }

  // Main Application
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          <CheckCircle className="w-5 h-5" />
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowSidebar(!showSidebar)} className="lg:hidden">
              {showSidebar ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Award className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">COGNIZANCE</h1>
              <p className="text-emerald-200 text-sm">Results Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="font-semibold">{currentUser.name}</p>
              <p className="text-emerald-200 text-sm capitalize">{currentUser.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-emerald-900 hover:bg-emerald-950 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className={`${showSidebar ? 'block' : 'hidden'} lg:block w-64 bg-white shadow-lg min-h-screen`}>
          <nav className="p-4 space-y-2">
            <button
              onClick={() => { setActiveTab('home'); setShowSidebar(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'home' ? 'bg-emerald-700 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => { setActiveTab('results'); setShowSidebar(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'results' ? 'bg-emerald-700 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <Award className="w-5 h-5" />
              <span>View Results</span>
            </button>
            <button
              onClick={() => { setActiveTab('create-event'); setShowSidebar(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'create-event' ? 'bg-emerald-700 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span>Create Event</span>
            </button>
            <button
              onClick={() => { setActiveTab('publish-result'); setShowSidebar(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'publish-result' ? 'bg-emerald-700 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Publish Result</span>
            </button>
            <button
              onClick={() => { setActiveTab('bulk-import'); setShowSidebar(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'bulk-import' ? 'bg-emerald-700 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <Upload className="w-5 h-5" />
              <span>Bulk Import</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {activeTab === 'home' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-emerald-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Events</p>
                      <p className="text-3xl font-bold text-gray-900">{data.events.length}</p>
                    </div>
                    <div className="bg-emerald-100 p-3 rounded-lg">
                      <Award className="w-8 h-8 text-emerald-700" />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-amber-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Published Results</p>
                      <p className="text-3xl font-bold text-gray-900">{data.results.filter(r => r.visible).length}</p>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <Users className="w-8 h-8 text-amber-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Students</p>
                      <p className="text-3xl font-bold text-gray-900">{data.results.length}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FileText className="w-8 h-8 text-blue-700" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveTab('publish-result')}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-3 rounded-lg flex items-center gap-2 justify-center transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Publish Result
                  </button>
                  <button
                    onClick={() => setActiveTab('create-event')}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-lg flex items-center gap-2 justify-center transition-colors"
                  >
                    <Award className="w-5 h-5" />
                    Create Event
                  </button>
                  <button
                    onClick={exportNotifications}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center gap-2 justify-center transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Export CSV
                  </button>
                  <button
                    onClick={() => setActiveTab('results')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg flex items-center gap-2 justify-center transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                    View Results
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-2">بسم الله الرحمن الرحيم</h3>
                <p className="text-emerald-100">Welcome to COGNIZANCE Results Portal. May Allah bless all our students with success and knowledge.</p>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Published Results</h2>
                <button
                  onClick={exportNotifications}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Export Notifications
                </button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by name or roll no..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterEvent}
                    onChange={e => setFilterEvent(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="all">All Events</option>
                    {data.events.map(event => (
                      <option key={event.id} value={event.id}>{event.name}</option>
                    ))}
                  </select>
                  <select
                    value={filterPrize}
                    onChange={e => setFilterPrize(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="all">All Prizes</option>
                    <option value="1st">1st Prize</option>
                    <option value="2nd">2nd Prize</option>
                    <option value="3rd">3rd Prize</option>
                    <option value="Participant">Participant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map(result => {
                  const event = data.events.find(e => e.id === result.eventId);
                  return (
                    <div key={result.i
