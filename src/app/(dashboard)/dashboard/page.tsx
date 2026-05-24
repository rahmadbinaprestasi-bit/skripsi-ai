"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface Document {
  id: string;
  title: string;
  module: string | null;
  created_at: string;
  updated_at: string;
}

interface RecentActivity {
  id: string;
  module: string;
  word_count: number;
  created_at: string;
}

export default function DashboardPage() {
  const supabase = createClient();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profileData);

      // Fetch recent documents
      const { data: docsData } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(5);
      setDocuments(docsData || []);

      // Fetch recent activity
      const { data: activityData } = await supabase
        .from("generate_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      setRecentActivity(activityData || []);

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const quotaPercentage = profile?.plan === "unlimited"
    ? 100
    : Math.round((profile?.word_quota / profile?.word_limit || 1) * 100);

  const moduleLabels = {
    writer: "AI Writer",
    chat: "AI Chat",
    code: "AI Code",
    reference: "Cek Referensi",
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-900">
          Selamat Datang, {profile?.full_name?.split(" ")[0] || "User"}!
        </h1>
        <p className="text-slate-600 mt-1">
          Apa yang ingin Anda tulis hari ini?
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/ai-writer">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-0 bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">AI Writer</h3>
                  <p className="text-indigo-100 text-sm">Generate bab skripsi</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/ai-chat">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-0 bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">AI Chat</h3>
                  <p className="text-blue-100 text-sm">Tanya jawab akademik</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/ai-code">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-0 bg-gradient-to-br from-green-500 to-emerald-500 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">AI Code</h3>
                  <p className="text-green-100 text-sm">Generate & debug kode</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quota Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Kuota Penggunaan</CardTitle>
              <CardDescription>
                Paket {profile?.plan?.toUpperCase()} - {profile?.word_used || 0} kata digunakan
              </CardDescription>
            </div>
            <Badge className={
              profile?.plan === "unlimited"
                ? "bg-amber-100 text-amber-700"
                : profile?.word_quota < 500
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
            }>
              {profile?.word_quota || 0} kata tersisa
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={100 - quotaPercentage} className="h-3" />
          {profile?.word_quota < 500 && profile?.plan !== "unlimited" && (
            <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-red-700 text-sm font-medium">
                Kuota Anda hampir habis!{" "}
                <Link href="/subscription" className="underline">
                  Upgrade paket Anda
                </Link>{" "}
                untuk terus menulis.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity & Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Documents */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Dokumen Terbaru</CardTitle>
              <Link href="/documents">
                <Button variant="ghost" size="sm">Lihat semua</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-slate-500">Belum ada dokumen</p>
                <Link href="/ai-writer">
                  <Button variant="outline" className="mt-4">Buat dokumen baru</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <Link
                    key={doc.id}
                    href={`/documents?id=${doc.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{doc.title}</p>
                        <p className="text-xs text-slate-500">
                          Diperbarui {new Date(doc.updated_at).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>
                    {doc.module && (
                      <Badge variant="outline" className="text-xs">
                        {moduleLabels[doc.module as keyof typeof moduleLabels] || doc.module}
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-slate-500">Belum ada aktivitas</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activity.module === "writer" ? "bg-indigo-100 text-indigo-600" :
                        activity.module === "chat" ? "bg-blue-100 text-blue-600" :
                        activity.module === "code" ? "bg-green-100 text-green-600" :
                        "bg-purple-100 text-purple-600"
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {moduleLabels[activity.module as keyof typeof moduleLabels] || activity.module}
                        </p>
                        <p className="text-xs text-slate-500">
                          {activity.word_count} kata
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">
                      {new Date(activity.created_at).toLocaleDateString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Promo Banner for Free Users */}
      {profile?.plan === "free" && (
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Promo Terbatas!</h3>
                  <p className="text-sm text-slate-600">Diskon 50% untuk Paket Unlimited</p>
                </div>
              </div>
              <Link href="/subscription">
                <Button className="bg-accent hover:bg-amber-600 text-white">
                  Dapatkan Diskon
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}