'use client';

import { useState } from 'react';
import Link from 'next/link';

const faqData = [
  {
    num: '01',
    q: '구독료가 얼마인가요?',
    a: '베이직과 프리미엄 플랜으로 구독 가능하며, 주식 또는 주식+코인 카테고리를 선택할 수 있습니다. 연 결제 시 2개월 무료 혜택이 적용됩니다.',
  },
  {
    num: '02',
    q: '어떤 결제 수단을 지원하나요?',
    a: '카카오페이, 신용카드, 계좌이체 등 다양한 결제 수단을 지원합니다. 결제 완료 후 즉시 서비스 이용이 가능합니다.',
  },
  {
    num: '03',
    q: '결제 후 바로 이용할 수 있나요?',
    a: '네, 결제 완료 즉시 마이페이지에서 텔레그램 입장하기 버튼을 통해 채널에 바로 입장하실 수 있습니다.',
  },
  {
    num: '04',
    q: '구독 후 환불이 가능한가요?',
    a: '구독 시작 후 7일 이내 요청 시 전액 환불이 가능합니다. 7일 이후에는 잔여 기간에 대한 부분 환불이 적용됩니다.',
  },
  {
    num: '05',
    q: '문의는 어디로 하면 되나요?',
    a: '카카오톡 채널 또는 이메일을 통해 문의해 주세요. 평일 기준 24시간 이내 답변드립니다.',
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-24 px-6 lg:px-12 max-w-[1100px] mx-auto">
      {/* FAQ Section */}
      <div className="flex flex-col md:flex-row gap-16">
        {/* Left: FAQ Content */}
        <div className="flex-1">
          <p className="text-gray-400 text-sm mb-3">FAQ</p>
          <h1 className="text-3xl font-extrabold mb-8">자주 묻는 질문</h1>

          {/* FAQ Items */}
          <div>
            {faqData.map((item, index) => (
              <div key={index} className={`border-t border-gray-100 ${index === faqData.length - 1 ? 'border-b' : ''}`}>
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center gap-4 py-5 hover:opacity-80 transition-opacity"
                >
                  <span className="text-sm text-gray-300 w-6">{item.num}</span>
                  <span className="flex-1 text-[15px] font-semibold text-left text-gray-900">
                    {item.q}
                  </span>
                  <span
                    className={`text-lg text-gray-300 transition-all duration-300 ${
                      openIndex === index ? 'rotate-45 text-[#FF4D00]' : ''
                    }`}
                  >
                    +
                  </span>
                </button>

                {/* Answer */}
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: openIndex === index ? '300px' : '0',
                  }}
                >
                  <div className="pl-10 pb-5 text-sm text-gray-500 leading-relaxed">
                    {item.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Sticky Image Placeholder */}
        <div className="hidden md:block flex-1">
          <div className="sticky top-24 aspect-[4/5] bg-gray-100 rounded-2xl" />
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="max-w-3xl mx-auto mt-24 space-y-4">
        <p className="text-xs text-gray-300 leading-relaxed">
          * 머니랩은 투자 정보 제공 목적의 단방향 서비스이며, 투자 권유 또는 투자 조언을 제공하지 않습니다. 모든
          투자 결정은 투자자 본인의 판단과 책임하에 이루어져야 하며, 서비스에서 제공하는 정보만을 근거로 투자 결정을
          하여서는 안 됩니다.
        </p>
        <p className="text-xs text-gray-300 leading-relaxed">
          * 서비스 관련 개인의 투자 손익에 대해 머니랩 및 운영진은 어떠한 책임도 지지 않습니다. 투자 상품의 특성,
          시장 상황, 개인의 투자 목표 등을 충분히 고려하여 신중하게 판단하시기 바랍니다.
        </p>
      </div>
    </div>
  );
}
