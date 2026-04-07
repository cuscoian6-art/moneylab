'use client';

import { useState } from 'react';
import Link from 'next/link';

const faqData = [
  {
    num: '01',
    q: '구독료가 얼마인가요?',
    a: ['[베이직 / 프리미엄] 플랜으로 구독 선택이 가능하며, [월 / 년] 구독신청 기간에 따라 할인율 및 혜택 차이가 발생합니다. 프리미엄/년 구독 플랜의 경우, 가장 큰 할인율 및 혜택을 받으실 수 있습니다. 자세한 요금은 하단 [구독하기] 페이지에서 확인하실 수 있습니다.'],
  },
  {
    num: '02',
    q: '어떤 결제 수단을 지원하나요?',
    a: ['카카오페이, 신용카드, 계좌이체 등 다양한 결제 수단을 지원합니다. 결제 완료 후 즉시 서비스 이용이 가능합니다.'],
  },
  {
    num: '03',
    q: '결제 후 바로 이용할 수 있나요?',
    a: ['네, 구독 결제 완료 즉시 [내 구독 정보]에서 [텔레그램 입장하기 →] 버튼을 통해 미니랩 채널에 바로 입장하실 수 있습니다.'],
  },
  {
    num: '04',
    q: '구독 후 환불이 가능한가요?',
    a: ['구독 시작일 기준 3일 이내 요청 시 전액 환불이 가능합니다. 단, 3일 이후에는 잔여 기간에 대한 일할 계산 부분 환불만 가능합니다. 환불 요청 시 사이트 우측 하단 문의 채널을 이용해 주세요.'],
  },
  {
    num: '05',
    q: '문의는 어디로 하면 되나요?',
    a: ['사이트 우측 하단 문의 채널을 이용해 주세요. 카카오톡 및 채널톡 답변으로, 평일 기준 24시간 이내 답변드립니다.'],
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
                    {item.a.map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < item.a.length - 1 && (
                          <>
                            <br className="md:hidden" />
                            <span className="hidden md:inline"> </span>
                          </>
                        )}
                      </span>
                    ))}
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

    </div>
  );
}
