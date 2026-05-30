import Head from 'next/head'
import { useState, useEffect } from 'react'
import { Phone, Shield, Globe, Zap, MessageSquare, Lock, ChevronRight, Star } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    { icon: <Phone className="w-6 h-6" />, title: 'Virtual Numbers', desc: 'Get temporary phone numbers from 50+ countries' },
    { icon: <Shield className="w-6 h-6" />, title: 'Privacy Protected', desc: 'Your real number stays hidden forever' },
    { icon: <Globe className="w-6 h-6" />, title: 'Global Coverage', desc: 'Numbers from USA, UK, Canada, Pakistan & more' },
    { icon: <Zap className="w-6 h-6" />, title: 'Instant Activation', desc: 'Numbers ready in seconds, not hours' },
    { icon: <MessageSquare className="w-6 h-6" />, title: 'SMS Receive', desc: 'Receive OTPs and verification codes' },
    { icon: <Lock className="w-6 h-6" />, title: 'No Registration', desc: 'Use without creating any account' },
  ]

  const stats = [
    { value: '50+', label: 'Countries' },
    { value: '10K+', label: 'Active Numbers' },
    { value: '1M+', label: 'SMS Received' },
    { value: '99.9%', label: 'Uptime' },
  ]

  return (
    <div className="min-h-screen bg-darker">
      <Head>
        <title>VirtualSMS - Free Virtual Phone Numbers</title>
        <meta name="description" content="Get free virtual phone numbers for SMS verification" />
      </Head>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">VirtualSMS</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-400 hover:text-white transition">Features</a>
            <a href="#how-it-works" className="text-slate-400 hover:text-white transition">How It Works</a>
            <a href="#countries" className="text-slate-400 hover:text-white transition">Countries</a>
          </div>
          <Link href="/numbers/">
            <button className="bg-gradient-to-r from-primary to-secondary px-6 py-2.5 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-primary/30 transition-all">
              Get Number
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <span className="pulse-dot"></span>
            <span className="text-sm text-primary font-medium">Free Virtual Numbers Available</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Get a <span className="gradient-text">Virtual Number</span>
            <br />in Seconds
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Receive SMS verification codes without using your real phone number. 
            Protect your privacy with temporary numbers from 50+ countries.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/numbers/">
              <button className="bg-gradient-to-r from-primary to-secondary px-8 py-4 rounded-2xl font-bold text-lg text-white hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Get Free Number
                <ChevronRight className="w-5 h-5" />
              </button>
            </Link>
            <button className="px-8 py-4 rounded-2xl font-bold text-lg border border-slate-700 text-slate-300 hover:border-primary hover:text-white transition-all">
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="glass rounded-2xl p-6">
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose <span className="gradient-text">VirtualSMS</span>?</h2>
            <p className="text-slate-400 text-lg">The most reliable virtual number service on the internet</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="glass rounded-2xl p-6 hover:border-primary/50 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It <span className="gradient-text">Works</span></h2>
            <p className="text-slate-400 text-lg">Get your virtual number in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Choose Country', desc: 'Select from 50+ countries worldwide' },
              { step: '02', title: 'Pick Number', desc: 'Choose from available virtual numbers' },
              { step: '03', title: 'Receive SMS', desc: 'Get verification codes instantly' },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 glow-border">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-2/3 w-full h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto glass rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-slate-400 text-lg mb-8">
            Join thousands of users who trust VirtualSMS for their verification needs.
            No registration required, completely free!
          </p>
          <Link href="/numbers/">
            <button className="bg-gradient-to-r from-primary to-secondary px-10 py-4 rounded-2xl font-bold text-lg text-white hover:shadow-xl hover:shadow-primary/30 transition-all">
              Get Your Free Number Now
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold gradient-text">VirtualSMS</span>
          </div>
          <p className="text-slate-500 text-sm">
            Free virtual phone numbers for SMS verification. Protect your privacy.
          </p>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            ))}
            <span className="text-slate-400 text-sm ml-2">4.9/5 Rating</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
