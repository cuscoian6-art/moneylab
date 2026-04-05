'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Send,
  MessageCircle,
  Zap,
  TrendingUp,
  Users,
  Bell,
  Lock,
  LogOut,
  Trash2,
  Mail,
  Eye,
  EyeOff,
} from 'lucide-react';

type ModalState = 'closed' | 'open';
type WithdrawalStep = 'checklist' | 'reason';

export default function ProfilePage() {
  // State Management
  const [mounted, setMounted] = useState(false);
  const [telegramJoined, setTelegramJoined] = useState(false);
  const [benefitsExpanded, setBenefitsExpanded] = useState(true);
  const [emailModalOpen, setEmailModalOpen] = useState<ModalState>('closed');
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState<ModalState>('closed');
  const [telegramGuideOpen, setTelegramGuideOpen] = useState<ModalState>('closed');

  const [newEmail, setNewEmail] = useState('');
  const [emailValidating, setEmailValidating] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');

  const [withdrawalStep, setWithdrawalStep] = useState<WithdrawalStep>('checklist');
  const [withdrawalChecked, setWithdrawalChecked] = useState(false);
  const [withdrawalReason, setWithdrawalReason] = useState('');
  const [withdrawalNotes, setWithdrawalNotes] = useState('');

  const [smsFeesExpanded, setSmsFeesExpanded] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const joined = localStorage.getItem('moneylab_tg_joined') === 'true';
    setTelegramJoined(joined);
    setMounted(true);
  }, []);

  // Email validation
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailChange = async () => {
    if (!newEmail.trim()) {
      setEmailError('이메일을 입력해주세요');
      return;
    }

    if (!isValidEmail(newEmail)) {
      setEmailError('올바른 이메일 형식을 입력해주세요');
      return;
    }

    setEmailValidating(true);
    setEmailError('');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setEmailValidating(false);
    setEmailSuccess(true);
    setNewEmail('');

    setTimeout(() => {
      setEmailSuccess(false);
      setEmailModalOpen('closed');
    }, 2000);
  };

  const handleWithdrawalSubmit = () => {
    if (withdrawalStep === 'checklist') {
      if (withdrawalChecked) {
        setWithdrawalStep('reason');
      }
    } else {
      // Final submission
      console.log('Withdrawal request:', {
        reason: withdrawalReason,
        notes: withdrawalNotes,
      });
      setWithdrawalModalOpen('closed');
      setWithdrawalStep('checklist');
      setWithdrawalChecked(false);
      setWithdrawalReason('');
      setWithdrawalNotes('');
    }
  };

  const handleTelegramJoin = () => {
    localStorage.setItem('moneylab_tg_joined', 'true');
    setTelegramJoined(true);
    setTelegramGuideOpen('closed');
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <PageHeader />

        {/* Subscription Card */}
        <SubscriptionCard />

        {/* Onboarding Hero - Hidden when telegram joined */}
        {!telegramJoined && (
          <OnboardingHero onJoinClick={() => setTelegramGuideOpen('open')} />
        )}

        {/* Telegram Actions - Shows when tg joined */}
        {telegramJoined && (
          <TelegramActions onExtendClick={() => {}} onGuideClick={() => setTelegramGuideOpen('open')} />
        )}

        {/* Benefits Banner */}
        <BenefitsBanner expanded={benefitsExpanded} onToggle={() => setBenefitsExpanded(!benefitsExpanded)} />

        {/* Email Banner */}
        <EmailBanner onChangeClick={() => setEmailModalOpen('open')} />

        {/* Account Section */}
        <AccountSection onWithdrawalClick={() => setWithdrawalModalOpen('open')} />
      </div>

      {/* Modals */}
      {emailModalOpen === 'open' && (
        <EmailModal
          onClose={() => {
            setEmailModalOpen('closed');
            setNewEmail('');
            setEmailError('');
            setEmailSuccess(false);
          }}
          newEmail={newEmail}
          onEmailChange={setNewEmail}
          onSubmit={handleEmailChange}
          isValidating={emailValidating}
          isSuccess={emailSuccess}
          error={emailError}
        />
      )}

      {withdrawalModalOpen === 'open' && (
        <WithdrawalModal
          step={withdrawalStep}
          checked={withdrawalChecked}
          onCheckChange={setWithdrawalChecked}
          reason={withdrawalReason}
          onReasonChange={setWithdrawalReason}
          notes={withdrawalNotes}
          onNotesChange={setWithdrawalNotes}
          onSubmit={handleWithdrawalSubmit}
          onBack={() => {
            if (withdrawalStep === 'reason') {
              setWithdrawalStep('checklist');
            } else {
              setWithdrawalModalOpen('closed');
              setWithdrawalStep('checklist');
              setWithdrawalChecked(false);
            }
          }}
          onClose={() => {
            setWithdrawalModalOpen('closed');
            setWithdrawalStep('checklist');
            setWithdrawalChecked(false);
            setWithdrawalReason('');
            setWithdrawalNotes('');
          }}
        />
      )}

      {telegramGuideOpen === 'open' && (
        <TelegramGuideModal
          onClose={() => setTelegramGuideOpen('closed')}
          onJoin={handleTelegramJoin}
          smsFeesExpanded={smsFeesExpanded}
          onSmsFeesToggle={() => setSmsFeesExpanded(!smsFeesExpanded)}
        />
      )}
    </main>
  );
}

// Components

function PageHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
    </div>
  );
}

function SubscriptionCard() {
  const planName = '프리미엄';
  const status = 'active'; // 'active' | 'trial' | 'inactive'

  const statusConfig = {
    active: { label: '구독중', color: 'bg-green-100 text-green-800' },
    trial: { label: '무료체험중', color: 'bg-blue-100 text-blue-800' },
    inactive: { label: '미구독', color: 'bg-gray-100 text-gray-800' },
  };

  const config = statusConfig[status as keyof typeof statusConfig];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{planName}</h2>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="py-4 border-b sm:border-b-0">
          <p className="text-sm text-gray-500 mb-1">현재 구독</p>
          <p className="text-sm font-semibold text-gray-900">프리미엄 (주식+코인)</p>
        </div>
        <div className="py-4 border-b sm:border-b-0">
          <p className="text-sm text-gray-500 mb-1">시작일</p>
          <p className="text-sm font-semibold text-gray-900">2026.03.01</p>
        </div>
        <div className="py-4">
          <p className="text-sm text-gray-500 mb-1">다음 결제일</p>
          <p className="text-sm font-semibold text-gray-900">2026.04.01</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          채널 입장
        </button>
        <button className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors">
          구독 연장
        </button>
      </div>
    </div>
  );
}

function OnboardingHero({ onJoinClick }: { onJoinClick: () => void }) {
  return (
    <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-8">
      {/* Badge */}
      <div className="flex items-center gap-2 mb-4 w-fit">
        <div className="relative w-2 h-2">
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
        <span className="text-xs font-semibold text-blue-700">Live</span>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 mb-6">텔레그램 채널 입장 완료하기</h3>

      {/* Benefits */}
      <div className="space-y-3 mb-8">
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-gray-700">교육 콘텐츠</span>
        </div>
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-gray-700">실시간 공유</span>
        </div>
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-gray-700">커뮤니티</span>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={onJoinClick}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        입장 가이드 보기
      </button>
    </div>
  );
}

function TelegramActions({ onExtendClick, onGuideClick }: { onExtendClick: () => void; onGuideClick: () => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button
        onClick={onGuideClick}
        className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
      >
        텔레그램 입장하기
      </button>
      <button className="px-6 py-3 border-2 border-orange-600 text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
        구독 연장하기
      </button>
    </div>
  );
}

function BenefitsBanner({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  const benefits = [
    {
      icon: Zap,
      title: '실시간 알림',
      description: '시장 변동을 즉시 알림',
      isNew: true,
    },
    {
      icon: TrendingUp,
      title: '종목 분석',
      description: '전문가 분석 리포트',
      isNew: false,
    },
    {
      icon: Users,
      title: '커뮤니티',
      description: '투자자 네트워크',
      isNew: false,
    },
    {
      icon: Bell,
      title: '맞춤 알람',
      description: '자신의 포트폴리오 맞춤',
      isNew: true,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6">
      {/* Header with Toggle */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-6 hover:opacity-80 transition-opacity"
      >
        <h3 className="text-lg font-semibold text-gray-900">프리미엄 6가지 혜택</h3>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Benefits Grid - Collapsed */}
      {expanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <button
                key={idx}
                className="bg-white rounded-xl p-4 text-left hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <Icon className="w-5 h-5 text-orange-600" />
                  {benefit.isNew && (
                    <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
                      NEW
                    </span>
                  )}
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{benefit.title}</h4>
                <p className="text-xs text-gray-600">{benefit.description}</p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmailBanner({ onChangeClick }: { onChangeClick: () => void }) {
  const currentEmail = 'user@example.com';

  return (
    <div className="bg-white rounded-2xl p-6 border-l-4 border-orange-600">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">계정 이메일</p>
          <p className="text-sm font-semibold text-gray-900">{currentEmail}</p>
        </div>
        <button
          onClick={onChangeClick}
          className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg font-medium transition-colors"
        >
          이메일 변경
        </button>
      </div>
    </div>
  );
}

function AccountSection({ onWithdrawalClick }: { onWithdrawalClick: () => void }) {
  return (
    <div className="bg-white rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">계정</h3>
      <div className="space-y-3">
        <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors">
          <LogOut className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700">로그아웃</span>
        </button>
        <button
          onClick={onWithdrawalClick}
          className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors"
        >
          <Trash2 className="w-5 h-5 text-red-600" />
          <span className="text-red-600 font-medium">회원탈퇴</span>
        </button>
      </div>
    </div>
  );
}

// Modal Components

interface EmailModalProps {
  onClose: () => void;
  newEmail: string;
  onEmailChange: (email: string) => void;
  onSubmit: () => void;
  isValidating: boolean;
  isSuccess: boolean;
  error: string;
}

function EmailModal({
  onClose,
  newEmail,
  onEmailChange,
  onSubmit,
  isValidating,
  isSuccess,
  error,
}: EmailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">이메일 변경</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-gray-900 font-medium">이메일이 변경되었습니다</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                새로운 이메일
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isValidating}
              />
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>

            <button
              onClick={onSubmit}
              disabled={isValidating}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isValidating ? '변경중...' : '변경하기'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

interface WithdrawalModalProps {
  step: WithdrawalStep;
  checked: boolean;
  onCheckChange: (checked: boolean) => void;
  reason: string;
  onReasonChange: (reason: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  onClose: () => void;
}

function WithdrawalModal({
  step,
  checked,
  onCheckChange,
  reason,
  onReasonChange,
  notes,
  onNotesChange,
  onSubmit,
  onBack,
  onClose,
}: WithdrawalModalProps) {
  const reasons = [
    '서비스가 도움이 되지 않음',
    '더 나은 서비스를 찾음',
    '비용이 높음',
    '기타',
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">회원탈퇴</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {step === 'checklist' ? (
          <>
            <p className="text-sm text-gray-600 mb-4">
              탈퇴 전에 다음을 확인해주세요
            </p>

            <div className="space-y-3 mb-6">
              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => onCheckChange(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded mt-0.5"
                />
                <span className="text-sm text-gray-700">
                  탈퇴 후 모든 데이터가 삭제되며 복구할 수 없습니다
                </span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={onSubmit}
                disabled={!checked}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                다음
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                탈퇴 사유
              </label>
              <select
                value={reason}
                onChange={(e) => onReasonChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">선택해주세요</option>
                {reasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                추가 의견 (선택사항)
              </label>
              <textarea
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder="서비스 개선에 도움이 될 의견을 남겨주세요"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={onBack}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                이전
              </button>
              <button
                onClick={onSubmit}
                disabled={!reason}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                탈퇴하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface TelegramGuideModalProps {
  onClose: () => void;
  onJoin: () => void;
  smsFeesExpanded: boolean;
  onSmsFeesToggle: () => void;
}

function TelegramGuideModal({
  onClose,
  onJoin,
  smsFeesExpanded,
  onSmsFeesToggle,
}: TelegramGuideModalProps) {
  const smsMethods = [
    'Telegram 앱 설치',
    'SMS 인증 진행',
    '채널 링크 클릭',
    '멤버 검증',
    '입장 완료',
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-white" />
            <h3 className="text-lg font-bold text-white">텔레그램 입장 가이드</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6">
          {/* Steps */}
          <div className="space-y-4 mb-6">
            {[
              { num: 1, title: 'Telegram 설치', desc: 'App Store나 Play Store에서 Telegram을 설치하세요' },
              { num: 2, title: '계정 등록', desc: '핸드폰 번호로 계정을 만들고 인증하세요' },
              {
                num: 3,
                title: '채널 입장',
                desc: '아래 링크를 통해 공식 채널에 입장하세요',
              },
            ].map((step) => (
              <div key={step.num} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {step.num}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{step.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* SMS Fees Collapsible */}
          <button
            onClick={onSmsFeesToggle}
            className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors mb-6"
          >
            <span className="font-medium text-gray-900">SMS 요금 안내</span>
            {smsFeesExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {smsFeesExpanded && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
              {smsMethods.map((method, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-600" />
                  {method}
                </div>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <button
            onClick={onJoin}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            텔레그램 입장하기
          </button>
        </div>
      </div>
    </div>
  );
}
