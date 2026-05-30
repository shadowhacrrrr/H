import Head from 'next/head'
import { useState, useEffect } from 'react'
import { Phone, MessageSquare, ArrowLeft, Copy, Check, RefreshCw, Shield } from 'lucide-react'
import Link from 'next/link'

const services = [
  { name: 'WhatsApp', icon: '💬', color: 'bg-green-500/10 text-green-400' },
  { name: 'Telegram', icon: '✈️', color: 'bg-blue-500/10 text-blue-400' },
  { name: 'Facebook', icon: '👤', color: 'bg-blue-600/10 text-blue-500' },
  { name: 'Instagram', icon: '📷', color: 'bg-pink-500/10 text-pink-400' },
  { name: 'Google', icon: '🔍', color: 'bg-red-500/10 text-red-400' },
  { name: 'Twitter', icon: '🐦', color: 'bg-sky-500/10 text-sky-400' },
  { name: 'TikTok', icon: '🎵', color: 'bg-black/20 text-white' },
  { name: 'Snapchat', icon: '👻', color: 'bg-yellow-500/10 text-yellow-400' },
]

export default function Verify() {
  const [selectedService, setSelectedService] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1)
  const [timer, setTimer] = useState(60)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (step === 3 && timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [step, timer])

  const handleServiceSelect = (service) => {
    setSelectedService(service)
    setStep(2)
  }

  const handlePhoneSubmit = (e) => {
    e.preventDefault()
    if (phoneNumber.length >= 10) {
      setStep(3)
      setTimer(60)
    }
  }

  const copyOtp = () => {
    navigator.clipboard.writeText(otp)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-darker">
      <Head>
        <title>Verify OTP - VirtualSMS</title>
      </Head>

      {/* Navbar */}
      <nav className="glass py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
          <Link href="/numbers/" className="flex items-center gap-2 text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Numbers</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s ? 'bg-gradient-to-r from-primary to-secondary text-white' : 'bg-slate-800 text-slate-500'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-0.5 ${step > s ? 'bg-primary' : 'bg-slate-800'}`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Service */}
        {step === 1 && (
          <div className="glass rounded-3xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Select Service</h1>
              <p className="text-slate-400">Choose the service you want to verify</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {services.map((service) => (
                <button
                  key={service.name}
                  onClick={() => handleServiceSelect(service)}
                  className="glass rounded-2xl p-4 hover:border-primary/50 transition-all group"
                >
                  <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-2xl mb-3 ${service.color}`}>
                    {service.icon}
                  </div>
                  <div className="font-medium text-sm">{service.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Enter Phone */}
        {step === 2 && (
          <div className="glass rounded-3xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center text-3xl mb-4">
                {selectedService?.icon}
              </div>
              <h1 className="text-3xl font-bold mb-2">Enter Phone Number</h1>
              <p className="text-slate-400">Enter the virtual number you selected</p>
            </div>

            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 012-3456"
                    className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-primary focus:outline-none transition text-lg font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={phoneNumber.length < 10}
                className="w-full bg-gradient-to-r from-primary to-secondary py-4 rounded-xl font-bold text-lg text-white hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Request OTP
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Enter OTP */}
        {step === 3 && (
          <div className="glass rounded-3xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-2xl flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Enter OTP</h1>
              <p className="text-slate-400">Enter the verification code sent to your number</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Verification Code</label>
                <div className="flex gap-3 justify-center">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength="1"
                      value={otp[i] || ''}
                      onChange={(e) => {
                        const newOtp = otp.split('')
                        newOtp[i] = e.target.value
                        setOtp(newOtp.join(''))
                        if (e.target.value && i < 5) {
                          document.getElementById(`otp-${i+1}`)?.focus()
                        }
                      }}
                      id={`otp-${i}`}
                      className="w-14 h-16 bg-slate-800/50 border border-slate-700 rounded-xl text-center text-2xl font-bold text-white focus:border-primary focus:outline-none transition"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="text-slate-500">
                  Resend in <span className="text-primary font-mono">{timer}s</span>
                </div>
                <button
                  onClick={() => { setTimer(60); }}
                  disabled={timer > 0}
                  className="flex items-center gap-1 text-primary hover:text-secondary transition disabled:opacity-50"
                >
                  <RefreshCw className="w-4 h-4" />
                  Resend OTP
                </button>
              </div>

              <button
                onClick={() => alert('Verification successful!')}
                disabled={otp.length !== 6}
                className="w-full bg-gradient-to-r from-primary to-secondary py-4 rounded-xl font-bold text-lg text-white hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
