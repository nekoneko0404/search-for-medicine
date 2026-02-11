import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertTriangle, Heart, Zap, Coffee, Database, Home as HomeIcon } from 'lucide-react';

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans">
      <header className="bg-white text-slate-800 p-4 shadow-sm border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2 text-teal-700">
            <Heart className="w-6 h-6 text-teal-600" />
            お子さまの「お薬飲めない」を解決！
          </h1>
          <div className="flex items-center gap-2">
            <a href="https://search-for-medicine.pages.dev/" className="flex items-center gap-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-full transition">
              <HomeIcon className="w-4 h-4" />
              メニュー
            </a>
            <Link href="/" className="flex items-center gap-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-full transition">
              <ArrowLeft className="w-4 h-4" />
              戻る
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-8">
        {/* Introduction */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-teal-700 mb-4">はじめに</h2>
          <p className="leading-relaxed mb-4 text-slate-600">
            保護者の皆さま、毎日のお子さまの看病、本当にお疲れ様です。
            「お薬を飲んでくれない」という悩みは、多くのパパ・ママが経験する最大の壁の一つです。
            このガイドでは、薬剤師の知見に基づいた「科学的に正しい飲ませ方」と「心の持ち方」をご紹介します。
          </p>
          <div className="bg-teal-50 p-4 rounded-lg text-teal-800 text-sm border border-teal-100">
            <strong>💡 このガイドのポイント</strong>
            <ul className="list-disc list-inside mt-2 space-y-1 text-teal-700">
              <li>すべてのお薬に通じる「基本ルール」</li>
              <li>年齢別の「飲ませ方テクニック」</li>
              <li>パパ・ママの心を軽くする「考え方」</li>
            </ul>
          </div>
        </section>

        {/* Section 1: Basic Principles */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-700 border-b-4 border-teal-200 inline-block pb-1">
            1. 絶対に知っておきたい基本原則
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-400">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-slate-800">
                <Coffee className="w-5 h-5 text-blue-400" />
                原則は「水」か「ぬるま湯」
              </h3>
              <p className="text-sm text-slate-600">
                お薬の効果を最大限に発揮させるには、水が一番です。特に抗生物質は、十分な水で飲むことで吸収が良くなります。
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-emerald-400">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-slate-800">
                <Zap className="w-5 h-5 text-emerald-400" />
                「食後」にこだわらない
              </h3>
              <p className="text-sm text-slate-600">
                食後だと満腹で吐いてしまうことがあります。多くの小児用薬は空腹時でも大丈夫。まずは「飲めるタイミング」で飲ませてみましょう。
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-xl p-5 mt-4">
            <h3 className="text-red-700 font-bold flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              【最重要】酸っぱいものは要注意！
            </h3>
            <p className="text-sm text-slate-700 mb-2">
              <strong>オレンジジュース、ヨーグルト、スポーツドリンク</strong>などの「酸性」の飲み物は、
              一部の抗生物質（クラリス、ジスロマックなど）のコーティングを溶かし、
              <strong>耐え難い苦味</strong>を引き出してしまうことがあります。
            </p>
            <p className="text-sm text-red-600 font-bold">
              → 「味方」はチョコアイスやココアなど、油脂分を含んだ甘いものです！
            </p>
          </div>
        </section>

        {/* Section 2: Techniques */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-700 border-b-4 border-teal-200 inline-block pb-1">
            2. 年齢別・実践テクニック
          </h2>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
            <div className="bg-slate-100 px-4 py-2 font-bold text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-400 inline-block"></span>
              乳児期（～1歳頃）
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h4 className="font-bold text-slate-800">💧 スポイト法</h4>
                <p className="text-sm text-slate-600">
                  少量の水で溶いた薬をスポイトで吸い、<strong>頬の内側</strong>に沿って少しずつ流し込みます。喉の奥に直接入れるとむせるので注意。
                </p>
              </div>
              <hr className="border-slate-100" />
              <div>
                <h4 className="font-bold text-slate-800">🍡 お薬団子法</h4>
                <p className="text-sm text-slate-600">
                  少量の水で薬を練ってペースト状（団子）にし、清潔な指で上あごや頬の内側に塗りつけます。すぐにミルクや水を含ませて完了！
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
            <div className="bg-slate-100 px-4 py-2 font-bold text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>
              幼児期（1歳～）
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h4 className="font-bold text-slate-800">🥪 サンドイッチ法</h4>
                <p className="text-sm text-slate-600">
                  スプーンにゼリーやアイスを乗せ、その上に薬、さらにゼリーで蓋をします。
                  「混ぜる」のではなく「挟んで隠す」ことで、舌に薬が触れず、味を感じにくくなります。
                </p>
              </div>
              <hr className="border-slate-100" />
              <div>
                <h4 className="font-bold text-slate-800">🍫 色の濃いもので隠す</h4>
                <p className="text-sm text-slate-600">
                  薬の色（ピンクやオレンジ）を見て嫌がる場合は、チョコアイスなど色の濃い食品に混ぜて視覚的に分からなくしましょう。
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
            <div className="bg-slate-100 px-4 py-2 font-bold text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
              4～5歳頃～
            </div>
            <div className="p-4">
              <h4 className="font-bold text-slate-800">🏆 「おとな飲み」への挑戦</h4>
              <p className="text-sm text-slate-600">
                「お兄さん・お姉さんになったから、水だけで飲んでみる？」と誘ってみましょう。
                小さなラムネで練習するのもおすすめです。飲めたら盛大に褒めてあげてください！
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Mental Support */}
        <section className="bg-teal-600 text-white rounded-2xl p-6 shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">保護者の皆さまへ</h2>
          <div className="space-y-4">
            <div className="bg-white/10 p-4 rounded-xl border border-white/20">
              <h3 className="font-bold text-lg mb-1">「8割飲めれば大丈夫」</h3>
              <p className="text-sm opacity-90">
                一滴残らず飲ませようと必死にならなくて大丈夫。多少こぼれても、だいたい体内に入れば効果は期待できます。
                完璧を目指さず、親子の笑顔を守ることを優先しましょう。
              </p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/20">
              <h3 className="font-bold text-lg mb-1">魔法の言葉は「すごいね！」</h3>
              <p className="text-sm opacity-90">
                薬を飲めたら、ハグをして「すごい！」「かっこいい！」と褒めちぎってください。
                大好きなパパ・ママに褒められることが、子どもにとって一番の薬になります。
              </p>
            </div>
          </div>
        </section>

        <div className="text-center pt-8 pb-4 flex flex-wrap gap-4 justify-center">
          <Link href="/" className="inline-flex items-center gap-2 bg-white text-teal-600 border border-teal-200 px-6 py-3 rounded-full font-bold shadow-sm hover:bg-teal-50 transition">
            <ArrowLeft className="w-4 h-4" />
            お薬検索に戻る
          </Link>
          <Link href="/medications" className="inline-flex items-center gap-2 bg-teal-600 text-white border border-teal-600 px-6 py-3 rounded-full font-bold shadow-sm hover:bg-teal-700 transition">
            <Database className="w-4 h-4" />
            登録医薬品一覧を見る
          </Link>
        </div>
      </main>
    </div>
  );
}