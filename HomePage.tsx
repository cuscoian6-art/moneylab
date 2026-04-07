"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

/* ──────────────────────────────────────────────
   DATA
   ────────────────────────────────────────────── */

const portfolioData = [
  { company: "두산에너빌리티",        entry: "17,830원",   current: "96,600원",    date: "26.04.03", result: "+441%", period: "약 16개월 경과" },
  { company: "마이크론 테크놀로지(MU)", entry: "$91",        current: "$366",        date: "26.04.03", result: "+302%", period: "약 10개월 경과" },
  { company: "SK하이닉스",            entry: "179,400원",  current: "876,000원",   date: "26.04.03", result: "+388%", period: "약 11개월 경과" },
  { company: "보잉(BA)",              entry: "$139",       current: "$208",        date: "26.04.03", result: "+49%",  period: "약 12개월 경과" },
  { company: "LIG넥스원",             entry: "202,500원",  current: "860,000원",   date: "26.04.03", result: "+324%", period: "약 16개월 경과" },
  { company: "버티브홀딩스(VRT)",     entry: "$82",        current: "$261",        date: "26.04.03", result: "+218%", period: "약 11개월 경과" },
  { company: "효성중공업",            entry: "427,500원",  current: "2,560,000원", date: "26.04.03", result: "+498%", period: "약 13개월 경과" },
  { company: "팔란티어(PLTR)",        entry: "$72",        current: "$148",        date: "26.04.03", result: "+105%", period: "약 15개월 경과" },
  { company: "현대로템",              entry: "48,000원",   current: "210,000원",   date: "26.04.03", result: "+337%", period: "약 16개월 경과" },
  { company: "RTX Corp.(RTX)",        entry: "$127",       current: "$196",        date: "26.04.03", result: "+54%",  period: "약 11개월 경과" },
];

const reviewCards = [
  { title: "쓰레드 글만 보고 투자하시던", desc: "20대 권지윤님", emoji: "👩" },
  { title: "투자가 처음이시던", desc: "부산 직장인 강나린님", emoji: "👨" },
  { title: "감으로만 투자하시던", desc: "30대 육아맘 이채진님", emoji: "👩‍💼" },
  { title: "유튜브만 보고 매매하시던", desc: "30대 개발자 박준혁님", emoji: "👨‍💻" },
  { title: "코인에서 큰 손실 보셨던", desc: "20대 대학원생 김서준님", emoji: "👨‍🔬" },
  { title: "시드가 적어서 고민하시던", desc: "대전 사회초년생 조민수님", emoji: "👨‍🎓" },
  { title: "투자 정보 판별이 어려우셨던", desc: "40대 자영업 한승호님", emoji: "👨‍🎤" },
  { title: "바빠서 투자 못하시던", desc: "30대 요리사 정태영님", emoji: "👨‍🍳" },
  { title: "경제 뉴스 이해가 어려우셨던", desc: "20대 간호사 윤하은님", emoji: "👩‍⚕️" },
  { title: "물타기만 반복하시던", desc: "40대 회사원 최동훈님", emoji: "👨‍✈️" },
];

const reviewModalData = [
  { name: "구독자 A", date: "2026.03.15", emoji: "👩", text: "머니랩 덕분에 투자에 대한 자신감이 생겼습니다. 매일 업데이트되는 콘텐츠를 통해 자연스럽게 투자 공부를 하게 되었고, 실제 수익도 나고 있어요." },
  { name: "구독자 B", date: "2026.03.10", emoji: "👨", text: "직장인으로서 시간이 없었는데 머니랩이 알아서 분석해주니 너무 편해요. 덕분에 투자 습관이 생겼습니다." },
  { name: "구독자 C", date: "2026.03.05", emoji: "👩‍💼", text: "처음에는 반신반의했는데, 3개월째 구독 중이고 꾸준히 수익을 내고 있습니다. 분석 리포트가 정말 유용해요." },
  { name: "구독자 D", date: "2026.02.28", emoji: "👨‍💻", text: "AI 전략 추천이 정말 신기해요. 제 투자 성향에 맞춤형으로 알려주니까 실패할 확률이 줄었습니다." },
  { name: "구독자 E", date: "2026.02.20", emoji: "👩‍🔬", text: "투자 초보인데도 어렵지 않게 따라갈 수 있어서 좋아요. 커뮤니티도 활발해서 동기부여가 됩니다." },
  { name: "구독자 F", date: "2026.02.15", emoji: "👨‍🎓", text: "학생 때부터 투자 공부를 시작했는데, 머니랩이 가장 체계적이에요. 강추합니다." },
  { name: "구독자 G", date: "2026.02.10", emoji: "👩‍🎤", text: "매주 나오는 포트폴리오 분석이 정말 도움됩니다. 어떤 종목을 사야 할지 고민이 줄었어요." },
  { name: "구독자 H", date: "2026.02.05", emoji: "👨‍🍳", text: "투자에 대한 두려움이 있었는데, 머니랩 콘텐츠를 보면서 점점 자신감이 생겼습니다." },
  { name: "구독자 I", date: "2026.01.28", emoji: "👩‍⚕️", text: "바쁜 일상 속에서도 5분만 투자하면 되니까 정말 편해요. 습관화가 저절로 됩니다." },
  { name: "구독자 J", date: "2026.01.20", emoji: "👨‍✈️", text: "여러 투자 서비스를 써봤지만 머니랩이 가성비 최고입니다. 콘텐츠 질이 다릅니다." },
];

const partners = ["TOSSPAYMENTS", "DB증권", "CLASS101", "한국경제", "아토세무회계"];

const ceoCredentials = [
  "증권투자권유대행인",
  "금융컨설턴트",
  "경제심리학전문가",
  "KBS 더 보다 다큐멘터리 출연",
  "클래스101 재테크 분야 전문가",
  "직장인 출신 7년차 투자 전문가",
  "투자 분야 SNS 팔로워 6만+",
  "SNS 콘텐츠 누적 조회수 500만+",
  "2026 포브스코리아 사회공헌부문 대상",
  "2025 한국일보 대한민국 혁신기업 대상",
  "2024 스포츠서울 투자 컨설팅 부문 대상",
];

/* ──────────────────────────────────────────────
   HOOKS
   ────────────────────────────────────────────── */

/** 무한 슬라이더 훅 */
function useInfiniteSlider(itemCount: number, autoMs: number) {
  const [pos, setPos] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<ReturnType<typeof setInterval>>();
  const pauseRef = useRef(false);

  const getItemWidth = useCallback(() => {
    if (!trackRef.current?.children[0]) return 300;
    const el = trackRef.current.children[0] as HTMLElement;
    const gap = parseFloat(getComputedStyle(trackRef.current).gap) || 0;
    return el.offsetWidth + gap;
  }, []);

  const slide = useCallback(
    (dir: number) => {
      setPos((prev) => {
        const w = getItemWidth();
        const total = itemCount * w;
        let next = prev + dir * w;
        if (next >= total) next = 0;
        if (next < 0) next = total - w;
        return next;
      });
    },
    [itemCount, getItemWidth],
  );

  useEffect(() => {
    const start = () => {
      autoRef.current = setInterval(() => {
        if (!pauseRef.current) slide(1);
      }, autoMs);
    };
    start();
    return () => clearInterval(autoRef.current);
  }, [slide, autoMs]);

  const pause = () => (pauseRef.current = true);
  const resume = () => (pauseRef.current = false);

  return { pos, trackRef, slide, pause, resume };
}

/** 카운트업 애니메이션 훅 */
function useCountUp(target: number, isDecimal: boolean, duration = 2000) {
  const [value, setValue] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const cur = target * eased;
            setValue(isDecimal ? cur.toFixed(1) : Math.floor(cur).toLocaleString());
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, isDecimal, duration]);

  return { value, ref };
}

/** 스크롤 fade-in 훅 */
function useFadeIn() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ──────────────────────────────────────────────
   SUB-COMPONENTS
   ────────────────────────────────────────────── */

function FadeIn({
  children,
  className = "",
  as: Tag = "section",
}: {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  const { ref, visible } = useFadeIn();
  return (
    // @ts-expect-error - dynamic tag
    <Tag
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

/* ──────────────────────────────────────────────
   SECTION: HERO
   ────────────────────────────────────────────── */

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-6 py-24 md:px-12 lg:py-36 bg-gradient-to-br from-[#FF4D00] via-[#FF6B2C] to-[#FFa85c]">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('/patterns/cross.svg')] bg-repeat" />

      {/* 텍스트 */}
      <p className="relative z-10 text-white/80 text-[17px] mb-5 animate-fade-up animation-delay-100">
        자산 성장의 시작, 머니랩
      </p>
      <h1 className="relative z-10 text-white font-extrabold leading-[1.08] tracking-tighter mb-4 text-[clamp(44px,8vw,88px)] animate-fade-up animation-delay-200">
        GGU
      </h1>
      <p className="relative z-10 text-white/70 font-medium leading-relaxed mb-10 text-[clamp(16px,2.5vw,22px)] animate-fade-up animation-delay-300">
        실시간 투자정보 구독형 서비스
        <br />
        매일 10분, 시장 흐름을 읽는 사람이 수익 기회를 잡습니다
      </p>

      {/* CTA */}
      <div className="relative z-10 flex flex-col items-center gap-3.5 w-full max-w-md animate-fade-up animation-delay-400">
        <Link
          href="/plans"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-11 py-[18px] rounded-full bg-white text-[#FF4D00] text-[17px] font-bold shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
        >
          시작하기 →
        </Link>
        <Link
          href="/review"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-[18px] rounded-full border-2 border-white/40 text-white text-base font-semibold hover:bg-white/10 hover:border-white transition-all"
        >
          후기 보기
        </Link>
      </div>

    </section>
  );
}

/* ──────────────────────────────────────────────
   SECTION: PORTFOLIO
   ────────────────────────────────────────────── */

function PortfolioSection() {
  const doubled = [...portfolioData, ...portfolioData];
  const { pos, trackRef, slide, pause, resume } = useInfiniteSlider(
    portfolioData.length,
    4000,
  );

  return (
    <section className="py-24 lg:py-28 bg-[#f8f8f8] text-center">
      <p className="text-sm font-bold text-[#FF4D00] tracking-[2px] uppercase mb-4">
        PORTFOLIO
      </p>
      <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold leading-snug tracking-tight mb-12 text-[#1a1a1a]">
        머니랩에서는 매주 새로운 성과가
        <br />
        쏟아지고 있습니다.
      </h2>

      <div
        className="relative max-w-[1200px] mx-auto overflow-hidden px-6 lg:px-12"
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        <div
          ref={trackRef}
          className="flex gap-6 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          style={{ transform: `translateX(-${pos}px)` }}
        >
          {doubled.map((card, i) => (
            <div
              key={i}
              className="min-w-[270px] shrink-0 bg-white rounded-2xl p-8 shadow-sm text-center"
            >
              {/* 헤더 */}
              <div className="flex items-center justify-center gap-2.5 mb-6">
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF8C00] to-[#FF4D00] flex items-center justify-center">
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <circle cx="12" cy="12" r="8" />
                    <path d="M12 8v8M8 12h8" />
                  </svg>
                </span>
                <span className="text-base font-bold">{card.company}</span>
              </div>

              {/* 가격 */}
              <div className="mb-2">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <span className="text-lg font-bold">{card.entry}</span>
                  <span className="text-[13px] text-gray-400">분석시점</span>
                  <span className="w-2 h-2 rounded-full bg-[#FF4D00]" />
                </div>
                <div className="text-center text-gray-300 text-lg">↓</div>
                <div className="flex items-center justify-center gap-2 mt-1.5">
                  <span className="text-lg font-bold">{card.current}</span>
                  <span className="text-[13px] text-gray-400">현재가</span>
                  <span className="w-2 h-2 rounded-full bg-[#2B7FFF]" />
                </div>
              </div>

              <p className="text-xs text-gray-300 my-4">기준일 {card.date}</p>

              {/* 성과 */}
              <div className="border-t border-gray-100 pt-5">
                <p className="text-[13px] text-[#FF4D00] font-semibold mb-1">보유 시 수익률</p>
                <p className="text-4xl font-black text-[#FF4D00]">{card.result}</p>
                <p className="text-xs text-gray-300 mt-2">보유기간 : {card.period}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 네비게이션 */}
      <div className="flex justify-center gap-3 mt-8">
        <button
          onClick={() => slide(-1)}
          className="w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 text-lg hover:border-[#FF4D00] hover:text-[#FF4D00] transition-colors"
        >
          ←
        </button>
        <button
          onClick={() => slide(1)}
          className="w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 text-lg hover:border-[#FF4D00] hover:text-[#FF4D00] transition-colors"
        >
          →
        </button>
      </div>

      <p className="text-[11px] text-gray-400 mt-10">
        *해당 수익률은 과장없이 실제 분석 시점 기준으로 명시되어 있습니다.
      </p>
    </section>
  );
}

/* ──────────────────────────────────────────────
   SECTION: SERVICE
   ────────────────────────────────────────────── */

function ServiceSection() {
  return (
    <section className="py-24 lg:py-28 px-6 lg:px-12 bg-white">
      <div className="text-center mb-16">
        <p className="text-sm font-bold text-[#FF4D00] tracking-[2px] uppercase mb-4">
          OUR SERVICE
        </p>
        <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold leading-snug tracking-tight text-[#1a1a1a]">
          길을 잃어버린 내 투자의
          <br />
          1등 가이드가 됩니다
        </h2>
      </div>

      <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
        {/* 큰 카드 */}
        <FadeIn
          as="div"
          className="rounded-3xl p-8 lg:p-14 flex flex-col lg:flex-row items-center gap-12 min-h-[400px] bg-gradient-to-br from-[#FFF3E0] via-[#FFE0B2] to-[#FFCC80]"
        >
          <div className="flex-1 text-left">
            <span className="inline-block px-5 py-2 rounded-full bg-white/70 text-[13px] font-bold text-gray-700 mb-6">
              CONTENT
            </span>
            <h3 className="text-4xl font-black leading-snug tracking-tight">
              꼭 필요한 투자 정보만
              <br />
              실시간 공유
            </h3>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-60 h-[400px] bg-white rounded-3xl shadow-xl flex items-center justify-center p-6">
              <div className="text-center text-gray-500 text-sm">
                <div className="text-3xl mb-4">📊</div>
                <div className="font-bold text-gray-700 mb-2 text-[15px]">오늘의 투자 리포트</div>
                <div className="text-xs text-gray-400 leading-relaxed">
                  실시간 시장 분석
                  <br />
                  AI 추천 종목
                  <br />
                  수익률 트래킹
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* 2열 카드 */}
        <div className="flex flex-col lg:flex-row gap-6">
          <FadeIn
            as="div"
            className="flex-1 rounded-3xl p-8 lg:p-12 min-h-[420px] flex flex-col text-left bg-gradient-to-b from-[#F3E5F5] via-[#E1BEE7] to-[#FFD6E0]"
          >
            <span className="inline-block self-start px-5 py-2 rounded-full bg-white/70 text-[13px] font-bold text-gray-700 mb-4">
              KNOWLEDGE
            </span>
            <h3 className="text-4xl font-black leading-snug tracking-tight [word-break:keep-all]">
              더 이상 두렵지 않은
              <br />
              포트폴리오 구축
            </h3>
            <div className="mt-auto bg-white rounded-2xl p-6 shadow-md">
              <p className="text-[13px] text-gray-400 mb-2">투자 지식 라이브러리</p>
              <div className="flex gap-2 flex-wrap">
                <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs">📄 기본 분석</span>
                <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs">📈 차트 분석</span>
                <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs">🌐 글로벌</span>
              </div>
            </div>
          </FadeIn>

          <FadeIn
            as="div"
            className="flex-1 rounded-3xl p-8 lg:p-12 min-h-[420px] flex flex-col text-left bg-gradient-to-b from-[#FFCCBC] via-[#FFAB91] to-[#FF8A65]"
          >
            <span className="inline-block self-start px-5 py-2 rounded-full bg-white/70 text-[13px] font-bold text-gray-700 mb-4">
              STRATEGY
            </span>
            <h3 className="text-4xl font-black leading-snug tracking-tight">
              하루 커피값,
              <br />
              10분만에 완성하는
              <br />
              투자 전략 올인원
            </h3>
            <div className="mt-auto bg-white rounded-2xl p-6 shadow-md">
              <p className="text-[13px] text-gray-400 mb-2">AI 전략 설정</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-orange-100 rounded-full">
                  <div className="w-3/4 h-full bg-[#FF6D00] rounded-full" />
                </div>
                <span className="text-xs font-bold text-[#FF6D00]">75%</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-2">전략 최적화 진행 중...</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   SECTION: CEO
   ────────────────────────────────────────────── */

function CeoSection() {
  return (
    <FadeIn className="py-24 lg:py-28 px-6 lg:px-12 bg-[#1a1a1a] text-white">
      <div className="max-w-[1000px] mx-auto text-center">
        <span className="inline-block px-5 py-2 rounded-full bg-[#FF4D00]/15 text-[#FF4D00] text-[13px] font-semibold mb-5">
          월 260 직장인 시작, 6억 투자 수익 실현
        </span>
        <h2 className="text-[clamp(28px,4vw,40px)] font-extrabold leading-snug mb-16">
          바쁜 현대인의
          <br />
          성장의 동반자로 함께합니다.
        </h2>

        {/* 프로필 */}
        <div className="text-center">
          <div className="w-40 h-40 rounded-full bg-[#333] mx-auto mb-8 flex items-center justify-center text-6xl overflow-hidden">
            {/* public/images/ceo.jpg 가 있으면 Image 컴포넌트로 교체 */}
            <span>👤</span>
          </div>
          <h3 className="text-2xl font-extrabold mb-9">꾸테크 (김범준 GGU 대표)</h3>
          <div className="flex flex-wrap justify-center gap-2.5">
            {ceoCredentials.map((c) => (
              <span
                key={c}
                className="text-sm text-gray-300 px-5 py-2.5 leading-snug bg-white/[0.06] rounded-full border border-white/[0.08]"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

/* ──────────────────────────────────────────────
   SECTION: REVIEWS
   ────────────────────────────────────────────── */

function ReviewsSection() {
  const doubled = [...reviewCards, ...reviewCards];
  const { pos, trackRef, slide, pause, resume } = useInfiniteSlider(
    reviewCards.length,
    3500,
  );
  const [modal, setModal] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModal(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <section className="py-24 lg:py-28 bg-white text-center">
      <p className="text-sm font-bold text-[#FF4D00] tracking-[2px] uppercase mb-4">
        User Reviews
      </p>
      <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold leading-snug tracking-tight mb-12 text-[#1a1a1a]">
        사람들이 말하는
        <br />
        머니랩 투자 인사이트
      </h2>

      <div
        className="relative overflow-hidden px-6 lg:px-12"
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        <div
          ref={trackRef}
          className="flex gap-4 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${pos}px)` }}
        >
          {doubled.map((card, i) => (
            <div
              key={i}
              className="min-w-[140px] shrink-0 cursor-pointer group"
              onClick={() => setModal(i % reviewCards.length)}
            >
              <div className="relative w-[140px] h-[180px] rounded-2xl bg-gray-100 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-[40px] bg-gradient-to-br from-gray-100 to-gray-200">
                  {card.emoji}
                </div>
                <div className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-5 py-2.5 rounded-full bg-[#FF4D00] text-white text-[13px] font-bold">
                    후기 보기
                  </span>
                </div>
              </div>
              <div className="mt-2.5 text-center">
                <p className="text-xs font-semibold text-[#1a1a1a] leading-snug">
                  {card.title}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 슬라이더 네비게이션 */}
      <div className="flex justify-center gap-3 mt-8">
        <button
          onClick={() => slide(-1)}
          className="w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 text-lg hover:border-[#FF4D00] hover:text-[#FF4D00] transition-colors"
        >
          ←
        </button>
        <button
          onClick={() => slide(1)}
          className="w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 text-lg hover:border-[#FF4D00] hover:text-[#FF4D00] transition-colors"
        >
          →
        </button>
      </div>

      <Link
        href="/review"
        className="inline-flex items-center gap-2 mt-8 px-7 py-3 rounded-full border border-gray-200 bg-white text-sm font-semibold hover:border-[#FF4D00] hover:text-[#FF4D00] transition-colors"
      >
        후기 더보기 →
      </Link>

      {/* 모달 */}
      {modal !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setModal(null)}
        >
          <div
            className="w-[90vw] max-w-[900px] aspect-video bg-white rounded-2xl overflow-hidden flex shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/10 flex items-center justify-center text-lg text-gray-700 hover:bg-black/20 transition-colors z-10"
              onClick={() => setModal(null)}
            >
              ✕
            </button>
            <div className="shrink-0 h-full aspect-[9/16] bg-gray-100 flex items-center justify-center text-6xl">
              {reviewModalData[modal].emoji}
            </div>
            <div className="flex-1 p-10 flex flex-col justify-center overflow-y-auto">
              <p className="text-lg font-extrabold text-[#1a1a1a] mb-2">
                {reviewModalData[modal].name}
              </p>
              <p className="text-[13px] text-gray-400 mb-6">
                {reviewModalData[modal].date}
              </p>
              <p className="text-[15px] leading-[1.8] text-gray-600">
                {reviewModalData[modal].text}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ──────────────────────────────────────────────
   SECTION: PARTNERS
   ────────────────────────────────────────────── */

function PartnersSection() {
  return (
    <FadeIn className="py-20 px-6 lg:px-12 bg-[#f8f8f8] text-center">
      <p className="text-sm text-[#FF4D00] font-semibold mb-2">Our Partners</p>
      <h2 className="text-[clamp(24px,3vw,36px)] font-extrabold tracking-tight mb-12">
        여러분의 성장을 위해
        <br />
        파트너십까지 진행하고 있습니다.
      </h2>
      <div className="flex items-center justify-center flex-wrap gap-14 max-w-[1000px] mx-auto">
        {partners.map((p) => (
          <span
            key={p}
            className="text-2xl font-bold text-gray-400 grayscale opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap"
          >
            {p}
          </span>
        ))}
      </div>
    </FadeIn>
  );
}

/* ──────────────────────────────────────────────
   SECTION: COMMUNITY
   ────────────────────────────────────────────── */

function CommunitySection() {
  return (
    <FadeIn className="py-24 lg:py-28 px-6 lg:px-12 bg-white">
      <div className="max-w-[1100px] mx-auto">
        <div className="mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#FFF0E6] text-[#FF4D00] text-[13px] font-semibold mb-4">
            종종 함께하는 구독자 모임
          </span>
          <h2 className="text-[clamp(28px,4vw,40px)] font-extrabold leading-snug tracking-tight">
            열정 넘치는 사람들끼리 모이면
            <br />
            성장 속도도 2배입니다.
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-3">
          {/* Row 1: 4+2 */}
          <div className="md:col-span-4 h-[180px] md:h-60 rounded-2xl bg-gray-100 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-gray-50 to-gray-200">
              📸
            </div>
          </div>
          <div className="md:col-span-2 h-[180px] md:h-60 rounded-2xl bg-gray-100 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-gray-50 to-gray-200">
              📸
            </div>
          </div>
          {/* Row 2: 2+4 */}
          <div className="md:col-span-2 h-[180px] md:h-60 rounded-2xl bg-gray-100 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-gray-50 to-gray-200">
              📸
            </div>
          </div>
          <div className="md:col-span-4 h-[180px] md:h-60 rounded-2xl bg-gray-100 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-gray-50 to-gray-200">
              📸
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

/* ──────────────────────────────────────────────
   SECTION: ABOUT / STATS
   ────────────────────────────────────────────── */

function AboutSection() {
  const stat1 = useCountUp(8.6, true);
  const stat2 = useCountUp(41284, false);
  const stat3 = useCountUp(4.9, true);

  return (
    <section className="py-24 px-6 lg:px-12 bg-[#f8f8f8] text-center">
      <p className="text-xl font-bold text-[#FF4D00] mb-4">About</p>
      <h2 className="text-[clamp(36px,5vw,48px)] font-extrabold leading-tight tracking-tighter mb-14 text-[#1a1a1a]">
        머니랩과
        <br />
        함께 할 준비가 됐나요?
      </h2>
      <div className="flex flex-col md:flex-row justify-center gap-5 max-w-[1100px] mx-auto">
        <div className="flex-1 p-9 bg-white rounded-2xl shadow-sm text-left">
          <p className="text-base font-bold text-gray-500 mb-0.5">머니랩과 함께 시작한</p>
          <p className="text-base font-bold text-gray-500 mb-5">구독 가입자 수</p>
          <p className="text-[clamp(40px,5vw,52px)] font-semibold text-[#1a1a1a] tracking-tighter">
            <span ref={stat1.ref}>{stat1.value}</span>천+
          </p>
        </div>
        <div className="flex-1 p-9 bg-white rounded-2xl shadow-sm text-left">
          <p className="text-base font-bold text-gray-500 mb-0.5">머니랩</p>
          <p className="text-base font-bold text-gray-500 mb-5">
            누적 콘텐츠 조회수
          </p>
          <p className="text-[clamp(40px,5vw,52px)] font-semibold text-[#1a1a1a] tracking-tighter">
            <span ref={stat2.ref}>{stat2.value}</span>+
          </p>
        </div>
        <div className="flex-1 p-9 bg-white rounded-2xl shadow-sm text-left">
          <p className="text-base font-bold text-gray-500 mb-0.5">머니랩 구독자</p>
          <p className="text-base font-bold text-gray-500 mb-5">후기 만족도</p>
          <p className="text-[clamp(40px,5vw,52px)] font-semibold text-[#1a1a1a] tracking-tighter">
            <span ref={stat3.ref}>{stat3.value}</span>/5.0
          </p>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   SECTION: CTA
   ────────────────────────────────────────────── */

function CtaSection() {
  return (
    <section className="py-24 px-6 lg:px-12 bg-[#111] text-white relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
        <div className="flex-1 text-left">
          <p className="text-[15px] opacity-60 mb-3">
            클릭 한 번으로 진짜 성장을 경험하세요.
          </p>
          <h2 className="text-[clamp(28px,4vw,44px)] font-extrabold leading-snug tracking-tight mb-10 [word-break:keep-all]">
            투자 시장의 변화를
            <br />
            쉽고 간편하게, 받아보세요
          </h2>
          <div className="flex gap-4 flex-wrap [&>a]:whitespace-nowrap">
            <Link
              href="/plans"
              className="px-9 py-4 rounded-full bg-[#FF4D00] text-white text-base font-bold hover:scale-105 transition-transform"
            >
              지금 시작하기 →
            </Link>
            <Link
              href="/faq"
              className="px-9 py-4 rounded-full bg-[#333] text-white text-base font-semibold hover:bg-[#444] transition-colors"
            >
              FAQ 보기
            </Link>
          </div>
        </div>
        <div className="shrink-0 w-full lg:w-[360px] aspect-square rounded-3xl bg-white/15 backdrop-blur-sm flex items-center justify-center overflow-hidden">
          {/* public/images/cta.png 가 있으면 Image 컴포넌트로 교체 */}
          <span className="text-sm text-white/60">이미지 영역 (PNG)</span>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   PAGE EXPORT
   ────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <PortfolioSection />
      <ServiceSection />
      <CeoSection />
      <ReviewsSection />
      <PartnersSection />
      <CommunitySection />
      <AboutSection />
      <CtaSection />
    </main>
  );
}
