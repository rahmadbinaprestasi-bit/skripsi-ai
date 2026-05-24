"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface Profile {
  word_quota: number;
  word_used: number;
  plan: string;
}

const templates = [
  { id: "bab1", name: "Bab 1 Pendahuluan", icon: "📚" },
  { id: "bab2", name: "Bab 2 Tinjauan Pustaka", icon: "📖" },
  { id: "bab3", name: "Bab 3 Metodologi", icon: "🔬" },
  { id: "bab4", name: "Bab 4 Hasil & Pembahasan", icon: "📊" },
  { id: "bab5", name: "Bab 5 Penutup", icon: "✅" },
  { id: "pendahuluan", name: "Pendahuluan Esai", icon: "✍️" },
  { id: "abstrak", name: "Abstrak", icon: "📄" },
  { id: "daftar-pustaka", name: "Daftar Pustaka", icon: "📚" },
];

const MAX_WORDS_PER_REQUEST = 1500;

export default function AIWriterPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [step, setStep] = useState(1);
  const [output, setOutput] = useState("");
  const [generating, setGenerating] = useState(false);

  const [context, setContext] = useState({
    topic: "",
    major: "",
    university: "",
    chapter: "",
    methodology: "",
    variables: "",
  });

  const [userPrompt, setUserPrompt] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("word_quota, word_used, plan")
          .eq("id", user.id)
          .single();
        setProfile(data as Profile);
      }
    };
    fetchProfile();
  }, [supabase]);

  const handleGenerate = async () => {
    if (!profile || profile.word_quota <= 0) {
      alert("Kuota habis! Upgrade paket Anda.");
      return;
    }

    setGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userPrompt,
          module: "writer",
          context,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Terjadi kesalahan");
      }

      const data = await response.json();
      setOutput(data.content);
      setStep(5);

      const { data: updatedProfile } = await supabase
        .from("profiles")
        .select("word_quota, word_used, plan")
        .eq("id", (await supabase.auth.getUser()).data.user?.id)
        .single();
      setProfile(updatedProfile as Profile);
    } catch (err) {
      const error = err as { message?: string };
      alert(error.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveDocument = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("documents").insert({
      user_id: user.id,
      title: `${selectedTemplate || "Dokumen"} - ${context.topic.substring(0, 30)}`,
      content: output,
      module: "writer",
    });

    if (!error) {
      alert("Dokumen berhasil disimpan!");
    }
  };

  const wordCount = output.split(/\s+/).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-900">AI Writer</h1>
        <p className="text-slate-600">Generate bab skripsi dengan pipeline anti-deteksi 3 tahap</p>
      </div>

      <div className="flex items-center justify-between">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
              step >= s ? "bg-primary text-white" : "bg-slate-200 text-slate-500"
            }`}>
              {s}
            </div>
            {s < 5 && (
              <div className={`w-16 h-1 mx-2 ${
                step > s ? "bg-primary" : "bg-slate-200"
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-500">
        <span>Konteks</span>
        <span>Metodologi</span>
        <span>Outline</span>
        <span>Generate</span>
        <span>Review</span>
      </div>

      <Separator />

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Konteks Penelitian</CardTitle>
            <CardDescription>
              Berikan informasi dasar tentang topik skripsi Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topik Skripsi</Label>
                <Input
                  id="topic"
                  placeholder="Contoh: Analisis Faktor yang Mempengaruhi Minat Belajar Siswa"
                  value={context.topic}
                  onChange={(e) => setContext({ ...context, topic: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="major">Jurusan</Label>
                <Input
                  id="major"
                  placeholder="Contoh: Pendidikan Ekonomi"
                  value={context.major}
                  onChange={(e) => setContext({ ...context, major: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="university">Universitas</Label>
                <Input
                  id="university"
                  placeholder="Contoh: Universitas Indonesia"
                  value={context.university}
                  onChange={(e) => setContext({ ...context, university: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chapter">Bab yang Ingin Ditulis</Label>
                <select
                  className="w-full px-3 py-2 rounded-lg border bg-white"
                  value={context.chapter}
                  onChange={(e) => {
                    setContext({ ...context, chapter: e.target.value });
                    setSelectedTemplate(e.target.value);
                  }}
                >
                  <option value="">Pilih bab...</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => setStep(2)}
              disabled={!context.topic || !context.major || !context.university}
            >
              Lanjut ke Metodologi
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Metodologi Penelitian</CardTitle>
            <CardDescription>
              Jelaskan pendekatan dan variabel penelitian Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Jenis Penelitian</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["Kuantitatif", "Kualitatif", "Mix Method", "Deskriptif"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setContext({ ...context, methodology: m })}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      context.methodology === m
                        ? "border-primary bg-primary-50 text-primary"
                        : "border-slate-200 hover:border-primary"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="variables">Variabel Penelitian</Label>
              <Textarea
                id="variables"
                placeholder="Contoh: Variabel X = Motivasi Belajar, Variabel Y = Prestasi Akademik"
                value={context.variables}
                onChange={(e) => setContext({ ...context, variables: e.target.value })}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>Kembali</Button>
              <Button className="flex-1" onClick={() => setStep(3)}>Buat Outline</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Outline Penelitian</CardTitle>
            <CardDescription>
              Review dan edit outline yang akan digenerate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-50 border">
              <h4 className="font-semibold mb-2">{context.chapter || "Pendahuluan"}</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>&bull; Latar Belakang Masalah</li>
                <li>&bull; Rumusan Masalah</li>
                <li>&bull; Tujuan Penelitian</li>
                <li>&bull; Manfaat Penelitian</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Label>Prompt Tambahan (opsional)</Label>
              <Textarea
                placeholder="Tambahkan instruksi khusus untuk hasil yang lebih spesifik..."
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>Kembali</Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary-600"
                onClick={() => {
                  if (!userPrompt) {
                    setUserPrompt(`Generate ${context.chapter || "pendahuluan"} untuk skripsi tentang "${context.topic}"`);
                  }
                  setStep(4);
                }}
              >
                Generate Sekarang
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Generating...</span>
              <Badge variant="outline">{MAX_WORDS_PER_REQUEST} kata max</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200">
              <p className="text-sm text-indigo-700">
                Pipeline Anti-Deteksi sedang bekerja:
              </p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
                  <span>Tahap 1: Ekstrak Logika...</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${generating ? "bg-blue-500 animate-pulse" : "bg-slate-300"}`} />
                  <span>Tahap 2: Restrukturisasi...</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-300" />
                  <span>Tahap 3: Humanisasi...</span>
                </div>
              </div>
            </div>
            <Progress value={generating ? 66 : 33} className="h-2" />
            <p className="text-center text-sm text-slate-500">
              Mohon tunggu, proses ini membutuhkan waktu beberapa detik...
            </p>
            {profile && <Button onClick={handleGenerate} className="w-full">Mulai Generate</Button>}
          </CardContent>
        </Card>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Hasil Generate</CardTitle>
                  <CardDescription>{wordCount} kata</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleSaveDocument}>
                    💾 Simpan
                  </Button>
                  <Button variant="outline">
                    📥 Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {output || "Hasil akan muncul di sini..."}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-amber-800 mb-2">⚠️ Bagian yang Perlu Diedit</h4>
              <p className="text-sm text-amber-700">
                Bagian berikut memerlukan data spesifik dari Anda:
              </p>
              <ul className="mt-2 text-sm text-amber-700 list-disc list-inside">
                <li>Nama institusi/universitas</li>
                <li>Data statistik spesifik</li>
                <li>Nama dosen pembimbing</li>
                <li>Tahun penelitian</li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)}>
              Generate Baru
            </Button>
            <Button onClick={() => setStep(3)}>
              Edit Prompt
            </Button>
          </div>
        </div>
      )}

      {profile && profile.word_quota < 500 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700 text-sm">
              ⚠️ Kuota Anda hampir habis ({profile.word_quota} kata).{" "}
              <a href="/subscription" className="underline font-semibold">Upgrade paket</a> untuk terus menulis.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}