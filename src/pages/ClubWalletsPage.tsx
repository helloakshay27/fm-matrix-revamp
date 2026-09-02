import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Eye, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { toast } from "sonner";
import {
  fetchClubWallets,
  requestClubWalletOtp,
  verifyClubWalletOtp,
  fetchClubWalletDetail,
  ClubWalletListItem,
  ClubWalletDetailResponse,
} from "@/services/clubWalletAPI";

type FlowStep = "list" | "verify" | "detail";

const walletColumns: ColumnConfig[] = [
  { key: "user_name", label: "User", sortable: true, hideable: true, defaultVisible: true },
  { key: "user_id", label: "ID", sortable: true, hideable: true, defaultVisible: true },
  { key: "wallet_id", label: "Wallet", sortable: true, hideable: true, defaultVisible: true },
  { key: "masked_email", label: "Email", hideable: true, defaultVisible: true },
  { key: "masked_mobile", label: "Mobile", hideable: true, defaultVisible: true },
  { key: "user_type", label: "Type", hideable: true, defaultVisible: true },
];

const transactionColumns: ColumnConfig[] = [
  { key: "created_at", label: "Date", sortable: true, hideable: true, defaultVisible: true },
  { key: "remarks", label: "Remarks", hideable: true, defaultVisible: true },
  { key: "point_type", label: "Point Type", hideable: true, defaultVisible: true },
  { key: "transaction_type", label: "Type", hideable: true, defaultVisible: true },
  { key: "amount", label: "Amount", sortable: true, hideable: true, defaultVisible: true },
];

const formatCurrency = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const ClubWalletsPage: React.FC = () => {
  const [step, setStep] = useState<FlowStep>("list");

  const [wallets, setWallets] = useState<ClubWalletListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [listLoading, setListLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedWallet, setSelectedWallet] = useState<ClubWalletListItem | null>(null);
  const [mobileOtp, setMobileOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [otpDelivered, setOtpDelivered] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startResendCooldown = (seconds = 30) => {
    setResendCooldown(seconds);
    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    cooldownTimerRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, []);

  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [detail, setDetail] = useState<ClubWalletDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadWallets = async (page: number, search: string) => {
    setListLoading(true);
    try {
      const res = await fetchClubWallets({ search, page, per_page: 20 });
      setWallets(res.wallets);
      setTotalPages(res.total_pages);
      setCurrentPage(res.current_page);
    } catch (error) {
      console.error("Failed to load club wallets:", error);
      toast.error("Failed to load wallets. Please try again.");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadWallets(1, "");
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    loadWallets(1, value);
  };

  const handlePageChange = (page: number) => {
    loadWallets(page, searchTerm);
  };

  const handleSelectWallet = async (wallet: ClubWalletListItem) => {
    setSelectedWallet(wallet);
    setMobileOtp("");
    setEmailOtp("");
    setOtpDelivered(false);
    setStep("verify");
    setIsRequestingOtp(true);
    try {
      await requestClubWalletOtp();
      setOtpDelivered(true);
      startResendCooldown();
    } catch (error) {
      console.error("Failed to request wallet OTP:", error);
      toast.error("Failed to send verification codes. Please try again.");
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setIsRequestingOtp(true);
    try {
      await requestClubWalletOtp();
      setOtpDelivered(true);
      startResendCooldown();
      toast.success("Verification codes resent");
    } catch (error) {
      console.error("Failed to resend wallet OTP:", error);
      toast.error("Failed to resend codes. Please try again.");
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const loadDetail = async (walletId: string | number, token: string, page = 1) => {
    setDetailLoading(true);
    try {
      const res = await fetchClubWalletDetail({
        walletId,
        verificationToken: token,
        page,
        per_page: 20,
      });
      setDetail(res);
    } catch (error) {
      if (error instanceof Error && error.message === "EXPIRED_TOKEN") {
        toast.error("Verification expired. Please verify again.");
        setStep("verify");
        setVerificationToken(null);
        return;
      }
      console.error("Failed to load wallet detail:", error);
      toast.error("Failed to load wallet details. Please try again.");
    } finally {
      setDetailLoading(false);
    }
  };

  // Only one of mobile/email OTP is required to continue.
  const canVerify = mobileOtp.length === 6 || emailOtp.length === 6;

  const handleVerifyAndContinue = async () => {
    if (!selectedWallet) return;
    if (!canVerify) {
      toast.error("Enter either the mobile or email code to continue");
      return;
    }
    setIsVerifying(true);
    try {
      const res = await verifyClubWalletOtp({
        mobile_otp: mobileOtp.length === 6 ? mobileOtp : undefined,
        email_otp: emailOtp.length === 6 ? emailOtp : undefined,
      });
      setVerificationToken(res.verification_token);
      setStep("detail");
      await loadDetail(selectedWallet.wallet_id, res.verification_token);
    } catch (error) {
      console.error("Failed to verify wallet OTP:", error);
      toast.error(
        error instanceof Error ? error.message : "Verification failed. Please try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const backToList = () => {
    setStep("list");
    setSelectedWallet(null);
    setMobileOtp("");
    setEmailOtp("");
    setOtpDelivered(false);
    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    setResendCooldown(0);
    setVerificationToken(null);
    setDetail(null);
  };

  const renderWalletCell = (item: ClubWalletListItem, key: string) => {
    if (key === "user_name") {
      return <span className="font-medium">{item.user_name}</span>;
    }
    return (item as unknown as Record<string, React.ReactNode>)[key];
  };

  const renderWalletActions = (item: ClubWalletListItem) => (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="ghost"
        title="View wallet"
        onClick={(e) => {
          e.stopPropagation();
          handleSelectWallet(item);
        }}
      >
        <Eye className="w-4 h-4" />
      </Button>
    </div>
  );

  const renderTransactionCell = (
    txn: ClubWalletDetailResponse["wallet_transactions"][number],
    key: string
  ) => {
    switch (key) {
      case "created_at":
        return formatDate(txn.created_at);
      case "transaction_type":
        return (
          <span
            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
              txn.transaction_type === "credit"
                ? "bg-[#C7EDDA] text-[#1a1a1a]"
                : "bg-[#F2C8C4] text-[#1a1a1a]"
            }`}
          >
            {txn.transaction_type}
          </span>
        );
      case "amount":
        return (
          <span
            className={`font-semibold ${
              txn.transaction_type === "credit" ? "text-[#798c5e]" : "text-[#C72030]"
            }`}
          >
            {txn.transaction_type === "credit" ? "+" : "-"}
            {formatCurrency(txn.amount)}
          </span>
        );
      default:
        return (txn as unknown as Record<string, React.ReactNode>)[key];
    }
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      {step === "list" && (
        <>
          <h1 className="text-xl font-semibold text-[#1a1a1a] mb-4">Club Wallets</h1>
          <EnhancedTable
            data={wallets}
            columns={walletColumns}
            renderCell={renderWalletCell}
            renderActions={renderWalletActions}
            storageKey="club-wallets-table"
            enableSearch
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            searchPlaceholder="Search name, email, wallet ID..."
            emptyMessage="No wallets found"
            loading={listLoading}
            loadingMessage="Loading wallets..."
            pagination
            pageSize={20}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onRowClick={handleSelectWallet}
          />
        </>
      )}

      {step === "verify" && selectedWallet && (
        <div className="max-w-md mx-auto py-8">
          <button
            type="button"
            onClick={backToList}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to wallet list
          </button>

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 sm:p-8">
            <div className="flex flex-col items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-[#f6f4ee] flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#1a1a1a]" />
              </div>

              <div className="text-center space-y-1">
                <h2 className="text-lg font-semibold text-[#1a1a1a]">Verify it's you</h2>
                <p className="text-sm text-gray-600">
                  Confirming access to{" "}
                  <span className="font-medium text-[#1a1a1a]">
                    {selectedWallet.user_name}
                  </span>
                  's wallet ({selectedWallet.wallet_id})
                </p>
              </div>

              {!otpDelivered && isRequestingOtp ? (
                <div className="flex flex-col items-center gap-3 py-6 text-sm text-gray-500">
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-[#C72030] rounded-full animate-spin" />
                  Sending verification codes to your mobile and email...
                </div>
              ) : (
                <>
                  <p className="text-xs text-gray-500 text-center -mt-2">
                    Enter the code from <span className="font-medium">either</span> your
                    mobile or your email to continue.
                  </p>

                  <div className="w-full space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Mobile code</span>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isRequestingOtp || resendCooldown > 0}
                        className="text-[#C72030] hover:underline disabled:opacity-50 disabled:no-underline disabled:text-gray-400"
                      >
                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}
                      </button>
                    </div>
                    <InputOTP maxLength={6} value={mobileOtp} onChange={setMobileOtp}>
                      <InputOTPGroup className="w-full justify-center gap-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="w-10 h-12 text-base border-2 border-gray-300 rounded-lg"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                    {mobileOtp.length === 6 && (
                      <p className="flex items-center gap-1 text-xs text-[#798c5e]">
                        <ShieldCheck className="w-3.5 h-3.5" /> Mobile code entered
                      </p>
                    )}
                  </div>

                  <div className="w-full flex items-center gap-3">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-xs text-gray-400 uppercase">or</span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>

                  <div className="w-full space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Email code</span>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isRequestingOtp || resendCooldown > 0}
                        className="text-[#C72030] hover:underline disabled:opacity-50 disabled:no-underline disabled:text-gray-400"
                      >
                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}
                      </button>
                    </div>
                    <InputOTP maxLength={6} value={emailOtp} onChange={setEmailOtp}>
                      <InputOTPGroup className="w-full justify-center gap-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="w-10 h-12 text-base border-2 border-gray-300 rounded-lg"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                    {emailOtp.length === 6 && (
                      <p className="flex items-center gap-1 text-xs text-[#798c5e]">
                        <ShieldCheck className="w-3.5 h-3.5" /> Email code entered
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={handleVerifyAndContinue}
                    disabled={isVerifying || !canVerify}
                    className="fm-button-fix fm-button-brand w-full"
                  >
                    {isVerifying ? "Verifying..." : "Verify & continue"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {step === "detail" && selectedWallet && (
        <>
          <button
            type="button"
            onClick={backToList}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to wallet list
          </button>

          {detailLoading || !detail ? (
            <div className="flex items-center justify-center py-12 text-sm text-gray-500">
              Loading wallet...
            </div>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-[#1a1a1a]">{detail.user.name}</h1>
              <p className="text-sm text-gray-500 mb-4">
                Wallet {detail.wallet_id} · {detail.user.email} · {detail.user.mobile}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <p className="text-xs text-gray-500 uppercase">Balance</p>
                  <p className="text-lg font-semibold">{formatCurrency(detail.balance)}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <p className="text-xs text-gray-500 uppercase">Credited</p>
                  <p className="text-lg font-semibold text-[#798c5e]">
                    {formatCurrency(detail.total_credited)}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <p className="text-xs text-gray-500 uppercase">Debited</p>
                  <p className="text-lg font-semibold text-[#C72030]">
                    {formatCurrency(detail.total_debited)}
                  </p>
                </div>
              </div>

              <h4 className="text-sm font-medium text-gray-700 mb-2">Wallet Transactions</h4>
              <EnhancedTable
                data={detail.wallet_transactions}
                columns={transactionColumns}
                renderCell={renderTransactionCell}
                storageKey="club-wallet-transactions-table"
                emptyMessage="No transactions yet"
                pagination={detail.total_pages > 1}
                pageSize={20}
                currentPage={detail.current_page}
                totalPages={detail.total_pages}
                onPageChange={(page) =>
                  loadDetail(selectedWallet.wallet_id, verificationToken as string, page)
                }
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ClubWalletsPage;
