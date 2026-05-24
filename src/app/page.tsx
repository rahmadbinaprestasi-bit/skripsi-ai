import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="font-heading font-bold text-xl text-slate-900">skripsiAi</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-primary">
              Fitur
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-primary">
              Harga
            </Link>
            <Link href="#faq" className="text-sm font-medium text-slate-600 hover:text-primary">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">Masuk</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-primary hover:bg-primary-600">Daftar Gratis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-purple-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative container max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 border-indigo-200 text-indigo-600 bg-indigo-50">
            AI Anti-Deteksi #1 di Indonesia
          </Badge>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Menulis Skripsi Lebih Cepat<br />
            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              dengan Kecerdasan Buatan
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Atasi writer's block. Hasilkan draf skripsi, esai, artikel berkualitas dalam menit, bukan berbulan-bulan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary-600 shadow-lg shadow-primary/25">
                Mulai Gratis Sekarang
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Lihat Demo
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">Tidak perlu kartu kredit</p>
        </div>
      </section>

      {/* USP Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">100% Aman dari Deteksi AI</h3>
                <p className="text-slate-600 text-sm">Hasil teks melewati pipeline anti-deteksi 3 tahap. Aman dari Turnitin & ZeroGPT.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">Harga Terjangkau</h3>
                <p className="text-slate-600 text-sm">Mulai dari Rp 0. Dibuat khusus untuk mahasiswa Indonesia.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">Sesuai PUEBI</h3>
                <p className="text-slate-600 text-sm">Hasil sesuai Pedoman Umum Ejaan Bahasa Indonesia.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 px-4 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <p className="text-4xl font-bold mb-1">10.000+</p>
              <p className="text-indigo-200">Mahasiswa Terbantu</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-1">500.000+</p>
              <p className="text-indigo-200">Kata Digenerate</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-1">98%</p>
              <p className="text-indigo-200">Lulus Deteksi AI</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-24 px-4">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Fitur Lengkap untuk Skripsi Sempurna
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk menyelesaikan skripsi tepat waktu
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
              <CardContent className="pt-8">
                <Badge className="bg-white/20 text-white mb-4">AI Writer</Badge>
                <h3 className="font-heading text-2xl font-bold mb-3">Generate Bab Skripsi Otomatis</h3>
                <p className="text-indigo-100 mb-6">
                  Progressive prompting yang memandu Anda dari topik hingga draf lengkap.
                  Maksimal 1500 kata per klik dengan hasil yang natural.
                </p>
                <Link href="/register">
                  <Button variant="secondary" className="bg-white text-primary hover:bg-indigo-50">
                    Coba Sekarang
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">Anti-Deteksi 3 Tahap</h3>
                <p className="text-slate-600 text-sm">
                  Logika → Restrukturisasi → Humanisasi. Hasil tidak terdeteksi AI.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">AI Chat Akademik</h3>
                <p className="text-slate-600 text-sm">
                  Tanya jawab referensi, diskusi metodologi, bimbingan logika penelitian.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">AI Code</h3>
                <p className="text-slate-600 text-sm">
                  Generate & debug kode Python, R, SPSS syntax untuk skripsi IT/Teknik.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">40+ Template</h3>
                <p className="text-slate-600 text-sm">
                  Beragam template akademik untuk berbagai kebutuhan penulisan.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">Ekspor 1-Klik</h3>
                <p className="text-slate-600 text-sm">
                  Download Word (.docx) & PDF langsung dengan format akademik.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 bg-slate-50">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-amber-200 text-amber-600 bg-amber-50">
              Diskon 50% untuk waktu terbatas!
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Pilih Paket yang Tepat untuk Anda
            </h2>
            <p className="text-slate-600">
              Mulai gratis, upgrade kapan saja
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Free */}
            <Card className="border-slate-200">
              <CardHeader className="text-center">
                <CardTitle className="text-lg font-semibold">Free</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Rp 0</span>
                  <p className="text-slate-500 text-sm mt-1">per bulan</p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    3.000 kata/bulan
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    AI Writer + AI Chat
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Maks 3 dokumen
                  </li>
                  <li className="flex items-center gap-2 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    AI Code
                  </li>
                  <li className="flex items-center gap-2 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Ekspor Word
                  </li>
                </ul>
                <Link href="/register" className="mt-6 block">
                  <Button variant="outline" className="w-full">Mulai Gratis</Button>
                </Link>
              </CardContent>
            </Card>
            {/* Basic */}
            <Card className="border-slate-200">
              <CardHeader className="text-center">
                <CardTitle className="text-lg font-semibold">Basic</CardTitle>
                <div className="mt-4">
                  <span className="text-2xl font-bold text-slate-400 line-through">Rp 49.000</span>
                  <span className="text-4xl font-bold text-primary ml-2">Rp 29.000</span>
                  <p className="text-slate-500 text-sm mt-1">per bulan</p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    25.000 kata/bulan
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Semua fitur Free
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    AI Code + Debug
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Ekspor Word
                  </li>
                </ul>
                <Link href="/register" className="mt-6 block">
                  <Button variant="outline" className="w-full">Pilih Basic</Button>
                </Link>
              </CardContent>
            </Card>
            {/* Pro */}
            <Card className="border-primary shadow-lg shadow-primary/10 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-accent text-white">Best Value</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-lg font-semibold">Pro</CardTitle>
                <div className="mt-4">
                  <span className="text-2xl font-bold text-slate-400 line-through">Rp 99.000</span>
                  <span className="text-4xl font-bold text-primary ml-2">Rp 59.000</span>
                  <p className="text-slate-500 text-sm mt-1">per bulan</p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    80.000 kata/bulan
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Semua fitur Basic
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Cek Referensi
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Prioritas AI
                  </li>
                </ul>
                <Link href="/register" className="mt-6 block">
                  <Button className="w-full bg-primary hover:bg-primary-600">Pilih Pro</Button>
                </Link>
              </CardContent>
            </Card>
            {/* Unlimited */}
            <Card className="border-slate-200">
              <CardHeader className="text-center">
                <CardTitle className="text-lg font-semibold">Unlimited</CardTitle>
                <div className="mt-4">
                  <span className="text-2xl font-bold text-slate-400 line-through">Rp 199.000</span>
                  <span className="text-4xl font-bold text-primary ml-2">Rp 99.000</span>
                  <p className="text-slate-500 text-sm mt-1">per bulan</p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Kuota tak terbatas
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Semua fitur Pro
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Support 24/7
                  </li>
                </ul>
                <Link href="/register" className="mt-6 block">
                  <Button variant="outline" className="w-full">Pilih Unlimited</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4">
        <div className="container max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-heading font-semibold text-lg mb-2">Apakah hasil AI aman dari deteksi Turnitin?</h3>
                <p className="text-slate-600">Ya! Kami menggunakan pipeline anti-deteksi 3 tahap yang menghasilkan teks natural seperti ditulis manusia. 98% teks yang digenerate lulus deteksi ZeroGPT dan Turnitin AI detector.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-heading font-semibold text-lg mb-2">Bagaimana cara kerja paket berbayar?</h3>
                <p className="text-slate-600">Pilih paket yang sesuai, lakukan pembayaran via Duitku (QRIS, transfer bank, e-wallet). Kuota kata akan langsung aktif setelah pembayaran terkonfirmasi.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-heading font-semibold text-lg mb-2">Apakah ada batas penggunaan?</h3>
                <p className="text-slate-600">Paket Free memberikan 3.000 kata per bulan. Paket berbayar memberikan kuota lebih besar. Paket Unlimited memberikan kuota tak terbatas.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-heading font-semibold text-lg mb-2">Bagaimana jika saya tidak puas?</h3>
                <p className="text-slate-600">Kami menawarkan garansi 7 hari uang kembali untuk paket berbayar. Hubungi tim support kami untuk bantuan.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-heading font-semibold text-lg mb-2">Bisakah saya upgrade paket?</h3>
                <p className="text-slate-600">Tentu! Anda dapat upgrade kapan saja. Kuota剩余 akan dipindahkan ke paket baru dan Anda hanya perlu membayar selisihnya.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
            Siap Menyelesaikan Skripsi Lebih Cepat?
          </h2>
          <p className="text-indigo-200 text-lg mb-8">
            Bergabung dengan 10.000+ mahasiswa yang sudah terbantu
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-primary hover:bg-indigo-50 shadow-lg">
              Mulai Gratis Sekarang — Tidak Perlu Kartu Kredit
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900 text-slate-400">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="font-heading font-bold text-xl text-white">skripsiAi</span>
              </div>
              <p className="text-sm">AI Writing Anti-Deteksi untuk mahasiswa Indonesia.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Produk</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/ai-writer" className="hover:text-white">AI Writer</Link></li>
                <li><Link href="/ai-chat" className="hover:text-white">AI Chat</Link></li>
                <li><Link href="/ai-code" className="hover:text-white">AI Code</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Harga</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Karir</a></li>
                <li><a href="#" className="hover:text-white">Kontak</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-white">Syarat Penggunaan</a></li>
                <li><a href="#" className="hover:text-white">Kebijakan Pengembalian</a></li>
              </ul>
            </div>
          </div>
          <Separator className="bg-slate-800 mb-8" />
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>© 2024 skripsiAi. Semua hak dilindungi.</p>
            <p className="mt-2 md:mt-0">Dibuat dengan untuk mahasiswa Indonesia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}