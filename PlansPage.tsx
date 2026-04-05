'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

// ============================================================================
// DATA CONSTANTS
// ============================================================================

const categoryData = {
  '주식': {
    basic: { monthly: 59000, yearlyMonthly: 49100, tag: '' },
    premium: { monthly: 79000, yearlyMonthly: 56900, tag: '가성비' },
    features: {
      analysis: {
        text: '국내주식 + 미국주식 투자처 분석',
        title: '국내주식 + 미국주식 투자처 분석',
        desc: '국내 주식과 미국 주식 시장에서 전문가가 매일 선별한 투자처를 분석하여 제공합니다.',
      },
      portfolio: {
        text: '꾸테크 주식 투자 포트폴리오 공유',
        title: '꾸테크 주식 투자 포트폴리오 공유',
        desc: '꾸테크 대표의 실제 주식 투자 포트폴리오를 투명하게 공유합니다.',
      },
    },
  },
  '주식 + 코인': {
    basic: { monthly: 79000, yearlyMonthly: 56900, tag: '가성비' },
    premium: { monthly: 99000, yearlyMonthly: 81900, tag: '재구독 1위' },
    features: {
      analysis: {
        text: '주식 + 암호화폐 투자처 분석',
        title: '주식 + 암호화폐 투자처 분석',
        desc: '전문가가 매일 선별한 주식과 암호화폐 투자처를 분석하여 제공합니다.',
      },
      portfolio: {
        text: '꾸테크 투자 포트폴리오 공유',
        title: '꾸테크 투자 포트폴리오 공유',
        desc: '꾸테크 대표의 실제 투자 포트폴리오를 투명하게 공유합니다.',
      },
    },
  },
};

const basicFeatures = [
  '투자처 분석',
  '포트폴리오 공유',
  '실시간 매매 현황',
  '경제 지표 해석',
  '기술적 분석',
];

const premiumFeatures = [
  { text: 'Live 특강', icon: '🎤' },
  { text: '챌린지', icon: '🎯' },
  { text: 'AI 코치', icon: '🤖' },
  { text: '분석 제안권', icon: '💡' },
  { text: 'TOP3 리포트', icon: '📊' },
  { text: '커피챗', icon: '☕' },
];

const showcaseSlides = [
  {
    badge: '혜택 1',
    title: '주식 & 암호화폐 투자처 분석',
    desc: '전문가가 매일 선별한 투자처를 분석하여 당신의 투자 결정을 돕습니다.',
  },
  {
    badge: '혜택 2',
    title: '꾸테크 매매현황 및 포트폴리오 공유',
    desc: '실제 매매 현황을 투명하게 공유하여 신뢰할 수 있는 정보를 제공합니다.',
  },
  {
    badge: '혜택 3',
    title: '핵심 경제 지표 및 이슈 해석',
    desc: '복잡한 경제 뉴스를 쉽게 이해할 수 있도록 분석해드립니다.',
  },
  {
    badge: '혜택 4',
    title: '차트 기술적 분석 매매 타이밍 제공',
    desc: '차트 분석으로 최적의 매매 타이밍을 놓치지 않도록 도와드립니다.',
  },
  {
    badge: '혜택 5',
    title: '꾸테크 챌린지 & LIVE 특강 참여권 제공',
    desc: '커뮤니티와 함께 성장하고 생생한 특강으로 실력을 쌓으세요.',
  },
];

const faqItems = [
  {
    question: '구독료는 얼마인가요?',
    answer:
      '기본 구독은 월 59,000원, 프리미엄 구독은 월 79,000원입니다. 연간 구독 시 20% 할인을 받을 수 있습니다.',
  },
  {
    question: '어떤 결제수단을 사용할 수 있나요?',
    answer:
      '신용카드, 체크카드, 계좌이체, 모바일 결제 등 다양한 결제수단을 지원합니다. 자동결제 설정 시 10% 추가 할인을 받을 수 있습니다.',
  },
  {
    question: '구독하면 바로 이용할 수 있나요?',
    answer:
      '결제 완료 후 즉시 모든 서비스를 이용할 수 있습니다. 결제 완료 시 이메일로 접근 정보를 보내드립니다.',
  },
  {
    question: '환불은 어떻게 되나요?',
    answer:
      '구독 기간 내 환불을 원하실 경우, 고객 센터로 연락주시면 처리해드립니다. 환불 수수료는 없습니다.',
  },
  {
    question: '문의는 어떻게 하나요?',
    answer:
      '이메일(support@moneylab.com), 카카오톡 채널, 고객 센터를 통해 문의하실 수 있습니다. 영업시간: 평일 10:00-18:00',
  },
];

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type Category = '주식' | '주식 + 코인';
type Plan = 'basic' | 'premium';

interface CheckoutData {
  service: string;
  plan: Plan;
  billing: 'monthly' | 'yearly';
  price: number;
  autopay: boolean;
}

interface TooltipData {
  title: string;
  desc: string;
  x: number;
  y: number;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface PlanHeroProps {
  currentCategory: Category;
  onCategoryChange: (category: Category) => void;
}

function PlanHero({ currentCategory, onCategoryChange }: PlanHeroProps) {
  const categories: Category[] = ['주식', '주식 + 코인'];

  return (
    <section className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            MoneyLab 구독 플랜
          </h1>
          <p className="text-lg text-gray-600">
            전문가의 투자 분석과 포트폴리오를 확인하세요
          </p>
        </div>

        <div className="flex justify-center gap-3 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                currentCategory === category
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

interface BillingToggleProps {
  isYearly: boolean;
  onToggle: () => void;
  basicMonthly: number;
  basicYearlyMonthly: number;
}

function BillingToggle({
  isYearly,
  onToggle,
  basicMonthly,
  basicYearlyMonthly,
}: BillingToggleProps) {
  const savings = (basicMonthly - basicYearlyMonthly) * 12;
  const daily = Math.floor(basicMonthly / 30);

  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <span className="text-gray-700 font-semibold">
        {isYearly ? '연간구독으로' : '월간구독'} 절약하세요.
      </span>
      <button
        onClick={onToggle}
        className={`relative w-14 h-7 rounded-full transition-colors ${
          isYearly ? 'bg-orange-500' : 'bg-gray-300'
        }`}
      >
        <div
          className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
            isYearly ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
      <span className="text-sm text-gray-600">
        {isYearly ? `연 ${savings.toLocaleString('ko-KR')}원 절약` : `하루 약 ${daily.toLocaleString('ko-KR')}원`}
      </span>
    </div>
  );
}

// ============================================================================
// ROLLING PRICE ANIMATION (Grok-style)
// ============================================================================

const ROLL_DURATION = 600; // ms - all digits finish simultaneously

function buildDigitSequence(from: number, to: number): number[] {
  const seq = [from];
  let cur = from;
  if (from === to) {
    // Same digit: full 0-9 loop back to same
    for (let k = 0; k < 10; k++) {
      cur = (cur + 1) % 10;
      seq.push(cur);
    }
  } else {
    // Different digit: forward sequence from→to
    while (cur !== to) {
      cur = (cur + 1) % 10;
      seq.push(cur);
    }
  }
  return seq;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function RollingPrice({ value, className }: { value: number; className?: string }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const prevValueRef = useRef<number>(value);
  const initializedRef = useRef(false);

  const fmt = useCallback((n: number) => n.toLocaleString('ko-KR'), []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const newStr = fmt(value);
    const oldStr = fmt(prevValueRef.current);
    prevValueRef.current = value;

    // First render: just display the number
    if (!initializedRef.current) {
      initializedRef.current = true;
      el.textContent = newStr;
      return;
    }

    if (oldStr === newStr) return;

    const maxLen = Math.max(oldStr.length, newStr.length);
    const oldPadded = oldStr.padStart(maxLen);
    const newPadded = newStr.padStart(maxLen);

    el.innerHTML = '';

    for (let i = 0; i < maxLen; i++) {
      const oldC = oldPadded[i];
      const newC = newPadded[i];

      if (oldC === ' ' && newC === ' ') continue;

      // Comma: static
      if (newC === ',') {
        const comma = document.createElement('span');
        comma.style.display = 'inline-block';
        comma.style.width = '0.35em';
        comma.style.textAlign = 'center';
        comma.textContent = ',';
        el.appendChild(comma);
        continue;
      }

      const oldD = parseInt(oldC) || 0;
      const newD = parseInt(newC) || 0;
      const seq = buildDigitSequence(oldD, newD);
      const steps = seq.length - 1;

      const col = document.createElement('span');
      col.style.display = 'inline-block';
      col.style.position = 'relative';
      col.style.overflow = 'hidden';
      col.style.height = '1.2em';
      col.style.lineHeight = '1.2em';
      col.style.width = '0.65em';
      col.style.textAlign = 'center';

      const strip = document.createElement('span');
      strip.style.display = 'flex';
      strip.style.flexDirection = 'column';

      for (const digit of seq) {
        const s = document.createElement('span');
        s.style.height = '1.2em';
        s.style.display = 'flex';
        s.style.alignItems = 'center';
        s.style.justifyContent = 'center';
        s.textContent = String(digit);
        strip.appendChild(s);
      }

      col.appendChild(strip);
      el.appendChild(col);

      // Animate: all digits finish at ROLL_DURATION
      let startTime: number | null = null;
      const totalSteps = steps;

      function tick(timestamp: number) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / ROLL_DURATION, 1);
        const eased = easeOutCubic(progress);
        const currentStep = eased * totalSteps;
        strip.style.transform = `translateY(${-currentStep * 1.2}em)`;
        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }
      requestAnimationFrame(tick);
    }
  }, [value, fmt]);

  return (
    <span
      ref={containerRef}
      className={className}
      style={{ display: 'inline-flex', overflow: 'hidden', position: 'relative' }}
    />
  );
}

// ============================================================================

interface PricingCardsProps {
  category: Category;
  isYearly: boolean;
  onCheckout: (data: CheckoutData) => void;
  trialUsed: boolean;
}

function PricingCards({
  category,
  isYearly,
  onCheckout,
  trialUsed,
}: PricingCardsProps) {
  const data = categoryData[category];

  const basicPrice = isYearly ? data.basic.yearlyMonthly : data.basic.monthly;
  const premiumPrice = isYearly
    ? data.premium.yearlyMonthly
    : data.premium.monthly;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
      {/* BASIC CARD */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Basic</h3>
        <p className="text-gray-600 text-sm mb-6">추천 상품</p>

        <div className="mb-8">
          <div className="text-4xl font-bold text-gray-900">
            <RollingPrice value={basicPrice} />
            <span className="text-lg text-gray-600 font-normal">원/월</span>
          </div>
          {isYearly && (
            <p className="text-sm text-gray-600 mt-2">
              연 {(basicPrice * 12).toLocaleString('ko-KR')}원
            </p>
          )}
        </div>

        <button
          onClick={() =>
            onCheckout({
              service: category,
              plan: 'basic',
              billing: isYearly ? 'yearly' : 'monthly',
              price: basicPrice,
              autopay: false,
            })
          }
          className="w-full bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors mb-8"
        >
          구독하기
        </button>

        <div className="space-y-4">
          {basicFeatures.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="text-green-500 font-bold mt-1">✓</span>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PREMIUM CARD */}
      <div className="bg-white border-2 border-orange-500 rounded-lg p-8 flex flex-col shadow-lg relative">
        {data.premium.tag && (
          <div className="absolute top-0 right-6 transform -translate-y-1/2">
            <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
              {data.premium.tag}
            </span>
          </div>
        )}

        <h3 className="text-xl font-bold text-gray-900 mb-2">Premium</h3>
        <p className="text-gray-600 text-sm mb-6">모든 혜택 포함</p>

        <div className="mb-8">
          <div className="text-4xl font-bold text-gray-900">
            <RollingPrice value={premiumPrice} />
            <span className="text-lg text-gray-600 font-normal">원/월</span>
          </div>
          {isYearly && (
            <p className="text-sm text-gray-600 mt-2">
              연 {(premiumPrice * 12).toLocaleString('ko-KR')}원
            </p>
          )}
        </div>

        <button
          onClick={() =>
            onCheckout({
              service: category,
              plan: 'premium',
              billing: isYearly ? 'yearly' : 'monthly',
              price: premiumPrice,
              autopay: false,
            })
          }
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors mb-8"
        >
          {!trialUsed ? '14일 무료 체험하기' : '구독하기'}
        </button>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            <span className="font-bold">베이직 혜택 모두 포함</span>
          </p>
        </div>

        <div className="space-y-4">
          {premiumFeatures.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="text-orange-500 font-bold text-lg">✓</span>
              <span className="text-gray-700">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ShowcaseSectionProps {
  category: Category;
}

function ShowcaseSection({ category }: ShowcaseSectionProps) {
  const [slideIndex, setSlideIndex] = useState(0);

  const nextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % showcaseSlides.length);
  };

  const prevSlide = () => {
    setSlideIndex((prev) =>
      prev === 0 ? showcaseSlides.length - 1 : prev - 1
    );
  };

  const slide = showcaseSlides[slideIndex];

  return (
    <section className="w-full bg-gray-950 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-16">
          {category} 구독의 혜택
        </h2>

        <div className="relative bg-gray-900 rounded-xl p-12 sm:p-16 min-h-96 flex flex-col justify-between">
          <div>
            <div className="inline-block bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
              {slide.badge}
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              {slide.title}
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
              {slide.desc}
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-12">
            <button
              onClick={prevSlide}
              className="bg-gray-800 hover:bg-gray-700 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors"
              aria-label="Previous slide"
            >
              ←
            </button>

            <div className="flex gap-2">
              {showcaseSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSlideIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === slideIndex ? 'bg-orange-500' : 'bg-gray-700'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="bg-gray-800 hover:bg-gray-700 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors"
              aria-label="Next slide"
            >
              →
            </button>
          </div>

          {/* Slide Counter */}
          <div className="text-right text-gray-500 mt-6">
            {slideIndex + 1} / {showcaseSlides.length}
          </div>
        </div>
      </div>
    </section>
  );
}

interface FaqSectionProps {}

function FaqSection({}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-16">
          자주 묻는 질문
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === idx ? null : idx)
                  }
                  className="w-full bg-gray-50 hover:bg-gray-100 p-5 flex justify-between items-center transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-left">
                    {item.question}
                  </span>
                  <span
                    className={`text-xl transition-transform ${
                      openIndex === idx ? 'rotate-45' : 'rotate-0'
                    }`}
                  >
                    +
                  </span>
                </button>

                {openIndex === idx && (
                  <div className="bg-white p-5 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sticky Image/Info */}
          <div className="flex items-start sticky top-20">
            <div className="w-full bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                더 궁금하신가요?
              </h3>
              <p className="text-gray-700 mb-6">
                위의 자주 묻는 질문에서 답을 찾지 못하셨다면, 언제든지
                고객 센터로 연락주세요.
              </p>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <span className="font-semibold">이메일:</span>{' '}
                  support@moneylab.com
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">카카오톡:</span> @moneylab
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">영업시간:</span> 평일
                  10:00-18:00
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface CheckoutModalProps {
  isOpen: boolean;
  data: CheckoutData | null;
  onClose: () => void;
}

function CheckoutModal({ isOpen, data, onClose }: CheckoutModalProps) {
  const [autopay, setAutopay] = useState(false);

  if (!isOpen || !data) return null;

  const discountedPrice = autopay
    ? Math.floor(data.price * 0.9)
    : data.price;
  const discountAmount = data.price - discountedPrice;

  const handleCheckout = () => {
    alert(`${data.service} ${data.plan === 'basic' ? 'Basic' : 'Premium'} 구독을 시작합니다.`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">결제 확인</h2>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between text-gray-700">
            <span>서비스</span>
            <span className="font-semibold">{data.service}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>플랜</span>
            <span className="font-semibold">
              {data.plan === 'basic' ? 'Basic' : 'Premium'}
            </span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>청구 주기</span>
            <span className="font-semibold">
              {data.billing === 'monthly' ? '월간' : '연간'}
            </span>
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-between text-gray-900 font-bold text-lg">
            <span>총 금액</span>
            <span>
              {(data.price * (data.billing === 'yearly' ? 12 : 1)).toLocaleString(
                'ko-KR'
              )}
              원
            </span>
          </div>
        </div>

        <div className="mb-8 bg-gray-50 rounded-lg p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autopay}
              onChange={(e) => setAutopay(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="flex-1 text-gray-700">
              자동결제 설정 (10% 할인)
            </span>
          </label>
          {autopay && (
            <p className="text-sm text-green-600 mt-2">
              할인 금액: {discountAmount.toLocaleString('ko-KR')}원
              <br />
              결제 금액: {discountedPrice.toLocaleString('ko-KR')}원
            </p>
          )}
        </div>

        <button
          onClick={handleCheckout}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-bold transition-colors mb-3"
        >
          결제하기
        </button>

        <button
          onClick={onClose}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-lg font-semibold transition-colors"
        >
          취소
        </button>
      </div>
    </div>
  );
}

interface FeatureTooltipProps {
  tooltipData: TooltipData | null;
  onClose: () => void;
}

function FeatureTooltip({ tooltipData, onClose }: FeatureTooltipProps) {
  if (!tooltipData) return null;

  return (
    <div
      className="fixed inset-0 z-40"
      onClick={onClose}
    >
      <div
        className="absolute bg-white rounded-lg shadow-xl p-4 max-w-sm"
        style={{
          left: `${tooltipData.x}px`,
          top: `${tooltipData.y}px`,
          transform: 'translate(-50%, -110%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="font-bold text-gray-900 mb-2">{tooltipData.title}</h4>
        <p className="text-sm text-gray-700">{tooltipData.desc}</p>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PlansPage() {
  const [currentCategory, setCurrentCategory] = useState<Category>('주식');
  const [isYearly, setIsYearly] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const [trialUsed, setTrialUsed] = useState(false);

  // Check trial status from localStorage
  useEffect(() => {
    const used = localStorage.getItem('moneylab_trial_used') === 'true';
    setTrialUsed(used);
  }, []);

  // Handle ESC key for closing tooltip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setTooltipData(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <main className="w-full bg-white">
      {/* Plan Hero */}
      <PlanHero
        currentCategory={currentCategory}
        onCategoryChange={setCurrentCategory}
      />

      {/* Billing Toggle */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <BillingToggle
            isYearly={isYearly}
            onToggle={() => setIsYearly(!isYearly)}
            basicMonthly={categoryData[currentCategory].basic.monthly}
            basicYearlyMonthly={
              categoryData[currentCategory].basic.yearlyMonthly
            }
          />
        </div>
      </div>

      {/* Pricing Cards */}
      <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
        <PricingCards
          category={currentCategory}
          isYearly={isYearly}
          onCheckout={(data) => setCheckoutData(data)}
          trialUsed={trialUsed}
        />
      </section>

      {/* Showcase Section */}
      <ShowcaseSection category={currentCategory} />

      {/* FAQ Section */}
      <FaqSection />

      {/* Call to Action Footer */}
      <section className="w-full bg-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            전문가의 투자 분석으로 더 나은 투자 결정을 하세요.
          </p>
          <button
            onClick={() =>
              setCheckoutData({
                service: currentCategory,
                plan: 'premium',
                billing: 'monthly',
                price: categoryData[currentCategory].premium.monthly,
                autopay: false,
              })
            }
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
          >
            프리미엄 시작하기
          </button>
        </div>
      </section>

      {/* Navigation Links (hidden, for reference) */}
      <div className="hidden">
        <Link href="/plans">Plans</Link>
        <Link href="/review">Review</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/login">Login</Link>
      </div>

      {/* Modals */}
      <CheckoutModal
        isOpen={checkoutData !== null}
        data={checkoutData}
        onClose={() => setCheckoutData(null)}
      />
      <FeatureTooltip
        tooltipData={tooltipData}
        onClose={() => setTooltipData(null)}
      />
    </main>
  );
}
