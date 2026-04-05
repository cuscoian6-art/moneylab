'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Review {
  id: number;
  nickname: string;
  date: string;
  tags: string[];
  before: number;
  after: number;
  change: number;
  summary: string[];
  body: string;
  proofImage: string;
}

interface WriteFormData {
  category: '주식' | '코인' | '혼합' | '';
  before: string;
  after: string;
  points: [string, string, string];
  review: string;
}

const mockReviews: Review[] = [
  {
    id: 1,
    nickname: '수익왕초보',
    date: '2026.03.15',
    tags: ['🐥 투자 초보', '💰 시드 500 이하', '👤 30대 직장인'],
    before: -4300000,
    after: 8700000,
    change: 302,
    summary: ['거시경제설명 잘해줌', '실시간알림 유용', '가짜뉴스 판별도움'],
    body: '머니랩을 구독하기 전에는 주식 투자에 대해 정말 아무것도 몰랐어요. 뉴스를 봐도 이해가 안 되고, 무엇을 사야 할지 막막했습니다. 하지만 머니랩의 체계적인 거시경제 강의와 실시간 알림 덕분에 이제는 시장 흐름을 읽을 수 있게 되었어요. 특히 가짜 뉴스를 판별하는 법을 배우고부터 훨씬 더 신중하게 투자하게 되었습니다. 초보자분들에게 정말 추천합니다!',
    proofImage: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><rect fill="%23E8F5E9" width="180" height="180"/><text x="90" y="90" font-size="24" text-anchor="middle" dy="0.3em" fill="%2300C853">+302%</text></svg>',
  },
  {
    id: 2,
    nickname: '투자마스터',
    date: '2026.03.10',
    tags: ['🦁 투자 고수', '💎 시드 2000 이상', '💼 40대 사업가'],
    before: 2000000,
    after: 15800000,
    change: 690,
    summary: ['명확한 시그널', '포트폴리오 관리', '섹터분석 리포트'],
    body: '이미 투자를 오래 해왔지만, 머니랩의 고급 분석과 포트폴리오 관리 방법론은 제 투자 수익을 대폭 향상시켰습니다. 각 섹터별 상세한 분석 리포트는 다른 곳에서는 찾기 어려운 수준의 인사이트를 제공합니다. 매달 제공되는 전략과 시그널은 명확하고 실행 가능하며, 실제로 투자 수익으로 직결됩니다. 고급 투자자분들께 강력 추천합니다.',
    proofImage: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><rect fill="%23E8F5E9" width="180" height="180"/><text x="90" y="90" font-size="24" text-anchor="middle" dy="0.3em" fill="%2300C853">+690%</text></svg>',
  },
  {
    id: 3,
    nickname: '코인러버',
    date: '2026.03.05',
    tags: ['🪙 코인 투자', '📱 20대 대학생'],
    before: -1500000,
    after: 3200000,
    change: 313,
    summary: ['코인시장 분석', '매매 타이밍', '리스크 관리'],
    body: '대학생 때 용돈으로 시작한 코인 투자였는데, 손실이 계속되기만 했어요. 머니랩 구독 후 시장 사이클을 이해하고 적절한 타이밍에 진입하고 청산하는 법을 배웠습니다. 리스크 관리의 중요성도 깨달았고, 이제는 감정적이 아닌 논리적으로 투자 결정을 내릴 수 있습니다. 젊은 세대 투자자들이 꼭 봐야 할 강의입니다!',
    proofImage: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><rect fill="%23E8F5E9" width="180" height="180"/><text x="90" y="90" font-size="24" text-anchor="middle" dy="0.3em" fill="%2300C853">+313%</text></svg>',
  },
];

export default function ReviewPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [writeModalOpen, setWriteModalOpen] = useState(false);
  const [writeForm, setWriteForm] = useState<WriteFormData>({
    category: '',
    before: '',
    after: '',
    points: ['', '', ''],
    review: '',
  });

  useEffect(() => {
    const logged = localStorage.getItem('moneylab_logged_in') === 'true';
    setIsLoggedIn(logged);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxImage(null);
        setWriteModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const toggleExpanded = (id: number) => {
    setExpandedReviews((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const formatAmount = (amount: number): string => {
    const abs = Math.abs(amount);
    if (abs >= 10000000) {
      return `${(amount / 10000000).toFixed(1)}억원`;
    }
    return `${(amount / 1000000).toFixed(1)}만원`;
  };

  const handleSubmitReview = () => {
    if (
      !writeForm.category ||
      !writeForm.before ||
      !writeForm.after ||
      !writeForm.points.every((p) => p) ||
      !writeForm.review
    ) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    console.log('Review submitted:', writeForm);
    alert('후기가 제출되었습니다. 감사합니다!');
    setWriteModalOpen(false);
    setWriteForm({
      category: '',
      before: '',
      after: '',
      points: ['', '', ''],
      review: '',
    });
  };

  const isSubmitDisabled =
    !writeForm.category ||
    !writeForm.before ||
    !writeForm.after ||
    !writeForm.points.every((p) => p) ||
    !writeForm.review;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-black py-20">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 50%, rgba(0, 200, 83, 0.3) 0%, transparent 70%)',
          }}
        ></div>

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          {/* Badge */}
          <div className="mb-8 flex items-center justify-center gap-2">
            <span className="flex items-center gap-2 rounded-full border border-gray-600 bg-gray-900 px-4 py-2 text-sm text-white">
              <span className="flex h-2 w-2 items-center justify-center">
                <span className="absolute inline-flex h-2 w-2 rounded-full bg-green-500 opacity-75 animation-pulse"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              Live 후기
            </span>
          </div>

          {/* Title */}
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            구독 전과 후,{' '}
            <em className="not-italic text-green-500">숫자</em>가 증명합니다
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-lg text-gray-300">
            머니랩 구독자들의 실제 투자 성과를 확인하세요
          </p>
        </div>
      </section>

      {/* Toolbar */}
      {isLoggedIn && (
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="mx-auto max-w-3xl flex justify-end">
            <button
              onClick={() => setWriteModalOpen(true)}
              className="flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              <span>✏️</span>
              후기 작성
            </button>
          </div>
        </div>
      )}

      {/* Review Cards Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl space-y-8">
          {mockReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
            >
              {/* Header */}
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-2xl">
                  👤
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{review.nickname}</p>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6 flex flex-wrap gap-2">
                {review.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Amounts */}
              <div className="mb-6 grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4">
                <div>
                  <p className="text-xs text-gray-600">구독 전</p>
                  <p
                    className={`text-lg font-bold ${
                      review.before < 0 ? 'text-blue-500' : 'text-red-500'
                    }`}
                  >
                    {formatAmount(review.before)}
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-2xl">→</span>
                </div>
                <div>
                  <p className="text-xs text-gray-600">구독 후</p>
                  <p
                    className={`text-lg font-bold ${
                      review.after < 0 ? 'text-blue-500' : 'text-red-500'
                    }`}
                  >
                    {formatAmount(review.after)}
                  </p>
                </div>
              </div>

              {/* Gain Badge */}
              <div className="mb-6 inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                +{review.change}%
              </div>

              {/* Proof Image */}
              <div className="mb-6">
                <button
                  onClick={() => setLightboxImage(review.proofImage)}
                  className="h-45 w-45 rounded-lg bg-gray-100 cursor-pointer hover:opacity-80 transition"
                  style={{
                    width: '180px',
                    height: '180px',
                    backgroundImage: `url('${review.proofImage}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                ></button>
              </div>

              {/* Summary */}
              <div className="mb-6 rounded-lg bg-blue-50 p-4">
                <p className="mb-3 text-sm font-semibold text-gray-900">
                  ✨ 구독자 후기 요약
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  {review.summary.map((point, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-blue-600">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Body Text */}
              <div className="mb-6">
                <p
                  className={`text-gray-700 leading-relaxed ${
                    expandedReviews.has(review.id) ? '' : 'line-clamp-2'
                  }`}
                >
                  {review.body}
                </p>
                <button
                  onClick={() => toggleExpanded(review.id)}
                  className="mt-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
                >
                  {expandedReviews.has(review.id) ? '접기' : '더보기'}
                </button>
              </div>

              {/* CTA */}
              <Link
                href="/plans"
                className="inline-flex items-center gap-1 text-orange-500 font-semibold hover:text-orange-600 transition"
              >
                나도 시작하기 →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-black px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-4xl font-bold text-white">
            지금 바로 시작해보세요
          </h2>
          <Link
            href="/plans"
            className="inline-block rounded-lg bg-orange-500 px-8 py-4 font-semibold text-white hover:bg-orange-600 transition"
          >
            구독 시작하기 →
          </Link>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white text-3xl hover:opacity-70"
            onClick={() => setLightboxImage(null)}
          >
            ✕
          </button>
          <img
            src={lightboxImage}
            alt="Proof"
            className="max-h-96 max-w-96 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Write Modal */}
      {writeModalOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setWriteModalOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-600 text-2xl hover:text-gray-900"
              onClick={() => setWriteModalOpen(false)}
            >
              ✕
            </button>

            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              투자 후기 작성
            </h2>

            {/* Category Select */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                투자 분류
              </label>
              <select
                value={writeForm.category}
                onChange={(e) =>
                  setWriteForm({
                    ...writeForm,
                    category: e.target.value as '주식' | '코인' | '혼합' | '',
                  })
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">선택하세요</option>
                <option value="주식">주식</option>
                <option value="코인">코인</option>
                <option value="혼합">혼합</option>
              </select>
            </div>

            {/* Investment Amounts */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  구독 전 자산
                </label>
                <input
                  type="number"
                  value={writeForm.before}
                  onChange={(e) =>
                    setWriteForm({ ...writeForm, before: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="예: -430만"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  구독 후 자산
                </label>
                <input
                  type="number"
                  value={writeForm.after}
                  onChange={(e) =>
                    setWriteForm({ ...writeForm, after: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="예: +870만"
                />
              </div>
            </div>

            {/* Auto-calculated gain */}
            {writeForm.before && writeForm.after && (
              <div className="mb-6 rounded-lg bg-green-50 p-4">
                <p className="text-sm font-semibold text-green-700">
                  수익률:{' '}
                  {(
                    (((Number(writeForm.after) - Number(writeForm.before)) /
                      Math.abs(Number(writeForm.before))) *
                      100) |
                    0
                  )}
                  %
                </p>
              </div>
            )}

            {/* Summary Points */}
            <div className="mb-6">
              <label className="mb-4 block text-sm font-semibold text-gray-700">
                후기 요약 (3개 포인트)
              </label>
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="mb-3 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={writeForm.points[idx]}
                    onChange={(e) => {
                      const newPoints = [...writeForm.points] as [
                        string,
                        string,
                        string,
                      ];
                      newPoints[idx] = e.target.value;
                      setWriteForm({ ...writeForm, points: newPoints });
                    }}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder={`포인트 ${idx + 1}`}
                  />
                </div>
              ))}
            </div>

            {/* Review Textarea */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                상세 후기
              </label>
              <textarea
                value={writeForm.review}
                onChange={(e) =>
                  setWriteForm({ ...writeForm, review: e.target.value })
                }
                rows={6}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="구독 전후의 변화와 얻은 인사이트를 자유롭게 작성해주세요"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitReview}
              disabled={isSubmitDisabled}
              className={`w-full rounded-lg py-3 font-semibold text-white transition ${
                isSubmitDisabled
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              후기 제출하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
