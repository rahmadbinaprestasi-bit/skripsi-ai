import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="font-heading font-bold text-xl text-slate-900">skripsiAi</span>
          </div>
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

      <section className="py-24 px-4 text-center">
        <Badge variant="outline" className="mb-6 border-indigo-200 text-indigo-600 bg-indigo-50">
          AI Anti-Deteksi #1 di Indonesia
        </Badge>
        <h1 className="font-heading text-4xl md:text-6xl font-bold text-slate-900 mb-6">
          Menulis Skripsi Lebih Cepat<br />
          <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            dengan Kecerdasan Buatan
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Atasi writer&apos;s block. Hasilkan draf skripsi berkualitas dalam menit.
        </p>
        <Link href="/register">
          <Button size="lg" className="bg-primary hover:bg-primary-600">
            Mulai Gratis Sekarang
          </Button>
        </Link>
      </section>

      <section id="pricing" className="py-24 px-4 bg-slate-50">
        <div className="container max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">Paket Harga</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Free", price: "Rp 0", features: ["3.000 kata/bulan", "AI Writer + Chat", "3 Dokumen"] },
              { name: "Basic", price: "Rp 29.000", features: ["25.000 kata/bulan", "AI Code", "Ekspor Word"] },
              { name: "Pro", price: "Rp 59.000", features: ["80.000 kata/bulan", "Cek Referensi", "Prioritas"] },
              { name: "Unlimited", price: "Rp 99.000", features: ["Kuota tak terbatas", "Semua fitur", "Support 24/7"] },
            ].map((plan) => (
              <Card key={plan.name} className={plan.name === "Pro" ? "border-primary shadow-lg" : ""}>
                <CardHeader className="text-center">
                  <CardTitle>{plan.name}</CardTitle>
                  <p className="text-2xl font-bold text-primary mt-2">{plan.price}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 bg-slate-900 text-slate-400 text-center">
        <p>© 2024 skripsiAi. Semua hak dilindungi.</p>
      </footer>
    </div>
  );
}
