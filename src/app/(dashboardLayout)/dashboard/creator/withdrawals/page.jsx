"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/app/lib/auth-client";
import {
  CircleDollar,
  Wallet,
  CreditCard,
  Check,
} from "@gravity-ui/icons";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000";

export default function WithdrawalsPage() {
  const {
    data: session,
    isPending: sessionLoading,
  } = useSession();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ===============================
  // FORM STATES
  // ===============================

  const [creditsToWithdraw, setCreditsToWithdraw] =
    useState("");

  const [paymentSystem, setPaymentSystem] =
    useState("");

  const [accountNumber, setAccountNumber] =
    useState("");

  // ===============================
  // RAISED CREDITS
  // ===============================

  const [raisedCredits, setRaisedCredits] =
    useState(0);

  // ===============================
  // GET CREATOR
  // ===============================

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchUser = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/api/users/${encodeURIComponent(
            session.user.email
          )}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch user"
          );
        }

        const data = await response.json();

        setUser(data.user);
      } catch (error) {
        console.error(
          "User fetch error:",
          error
        );

        toast.error(
          "Failed to load creator information"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [session?.user?.email]);

  // ===============================
  // GET RAISED CREDITS
  // ===============================

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchRaisedCredits = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/creator/raised-credits/${encodeURIComponent(
            session.user.email
          )}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch raised credits"
          );
        }

        const data = await response.json();

        setRaisedCredits(
          Number(data.totalRaisedCredits) || 0
        );
      } catch (error) {
        console.error(
          "Raised credits fetch error:",
          error
        );

        toast.error(
          "Failed to load raised credits"
        );

        setRaisedCredits(0);
      }
    };

    fetchRaisedCredits();
  }, [session?.user?.email]);

  // ===============================
  // VALUES
  // ===============================

  const totalCredits =
    Number(raisedCredits) || 0;

  const withdrawCredits =
    Number(creditsToWithdraw) || 0;

  // 20 credits = $1
  const withdrawAmount =
    withdrawCredits / 20;

  const minimumCredits = 200;

  const canWithdraw =
    totalCredits >= minimumCredits;

  const validAmount =
    withdrawCredits >= minimumCredits &&
    withdrawCredits <= totalCredits &&
    withdrawCredits > 0 &&
    withdrawCredits % 20 === 0;

  // ===============================
  // SUBMIT WITHDRAWAL
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error(
        "Creator information not available."
      );
      return;
    }

    if (!canWithdraw) {
      toast.error(
        "You need at least 200 credits to withdraw."
      );
      return;
    }

    if (!validAmount) {
      toast.error(
        "Withdrawal credits must be at least 200 and a multiple of 20."
      );
      return;
    }

    if (!paymentSystem) {
      toast.error(
        "Please select a payment system."
      );
      return;
    }

    if (!accountNumber.trim()) {
      toast.error(
        "Please enter your account number."
      );
      return;
    }

    try {
      setSubmitting(true);

      // ===============================
      // WITHDRAWAL DATA
      // ===============================

      const withdrawalData = {
        creator_email: user.email,
        creator_name: user.name,

        withdrawal_credit:
          withdrawCredits,

        payment_system:
          paymentSystem,

        account_number:
          accountNumber.trim(),

        withdraw_date: new Date(),
      };

      // ===============================
      // SEND REQUEST
      // ===============================

      const response = await fetch(
        `${API_URL}/api/withdrawals`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            withdrawalData
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Withdrawal request failed."
        );
      }

      // ===============================
      // SUCCESS
      // ===============================

      toast.success(
        "Withdrawal request submitted successfully!"
      );

      // ===============================
      // RESET FORM
      // ===============================

      setCreditsToWithdraw("");
      setPaymentSystem("");
      setAccountNumber("");

      // ===============================
      // REFRESH RAISED CREDITS
      // ===============================

      const raisedResponse =
        await fetch(
          `${API_URL}/api/creator/raised-credits/${encodeURIComponent(
            user.email
          )}`
        );

      if (raisedResponse.ok) {
        const raisedData =
          await raisedResponse.json();

        setRaisedCredits(
          Number(
            raisedData.totalRaisedCredits
          ) || 0
        );
      }
    } catch (error) {
      console.error(
        "Withdrawal error:",
        error
      );

      toast.error(
        error.message ||
          "Failed to submit withdrawal."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ===============================
  // LOADING
  // ===============================

  if (
    sessionLoading ||
    loading
  ) {
    return (
      <div className="min-h-screen bg-slate-950 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex min-h-[500px] items-center justify-center">
            <p className="text-slate-400">
              Loading withdrawal information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ===============================
  // PAGE
  // ===============================

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* ===============================
            HEADER
        ================================ */}

        <div>
          <h1 className="text-3xl font-bold text-white">
            Withdrawals
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Withdraw your campaign earnings securely.
          </p>
        </div>

        {/* ===============================
            EARNINGS CARDS
        ================================ */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* CURRENT RAISED CREDITS */}

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-400">
                  Current Raised Credits
                </p>

                <h2 className="mt-2 text-3xl font-bold text-white">
                  {totalCredits.toLocaleString()}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  From approved campaigns
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600/10">
                <CircleDollar
                  width={26}
                  height={26}
                  className="text-violet-400"
                />
              </div>

            </div>
          </div>

          {/* WITHDRAWAL VALUE */}

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-400">
                  Available Withdrawal
                </p>

                <h2 className="mt-2 text-3xl font-bold text-green-400">
                  $
                  {(
                    totalCredits / 20
                  ).toFixed(2)}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  20 credits = $1
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10">
                <Wallet
                  width={26}
                  height={26}
                  className="text-green-400"
                />
              </div>

            </div>
          </div>

        </div>

        {/* ===============================
            MINIMUM REQUIREMENT
        ================================ */}

        <div
          className={`rounded-2xl border p-5 ${
            canWithdraw
              ? "border-green-500/20 bg-green-500/5"
              : "border-yellow-500/20 bg-yellow-500/5"
          }`}
        >
          <div className="flex items-start gap-4">

            <div
              className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                canWithdraw
                  ? "bg-green-500/10"
                  : "bg-yellow-500/10"
              }`}
            >
              {canWithdraw ? (
                <Check
                  width={20}
                  height={20}
                  className="text-green-400"
                />
              ) : (
                <CircleDollar
                  width={20}
                  height={20}
                  className="text-yellow-400"
                />
              )}
            </div>

            <div>
              <h3 className="font-semibold text-white">
                {canWithdraw
                  ? "You are eligible to withdraw"
                  : "Minimum withdrawal requirement"}
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                {canWithdraw
                  ? "You have enough credits to submit a withdrawal request."
                  : `You need at least ${minimumCredits} credits ($10) to withdraw.`}
              </p>
            </div>

          </div>
        </div>

        {/* ===============================
            WITHDRAWAL FORM
        ================================ */}

        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 md:p-8">

          <div className="mb-7">
            <h2 className="text-xl font-bold text-white">
              Request Withdrawal
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Enter the amount you want to withdraw.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* =========================
                CREDITS
            ========================== */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Credits To Withdraw
              </label>

              <input
                type="number"
                min="200"
                max={totalCredits}
                step="20"
                value={creditsToWithdraw}
                onChange={(e) =>
                  setCreditsToWithdraw(
                    e.target.value
                  )
                }
                placeholder="Example: 200"
                disabled={
                  !canWithdraw ||
                  submitting
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <p className="mt-2 text-xs text-slate-500">
                Minimum: 200 credits • Maximum:{" "}
                {totalCredits} credits
              </p>

              {withdrawCredits > 0 &&
                withdrawCredits >
                  totalCredits && (
                  <p className="mt-2 text-sm text-red-400">
                    You cannot withdraw more than your
                    available raised credits.
                  </p>
                )}

              {withdrawCredits > 0 &&
                withdrawCredits % 20 !== 0 && (
                  <p className="mt-2 text-sm text-yellow-400">
                    Credits must be in multiples of 20.
                  </p>
                )}
            </div>

            {/* =========================
                WITHDRAWAL AMOUNT
            ========================== */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Withdrawal Amount ($)
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">

                <span className="text-lg font-semibold text-green-400">
                  $
                </span>

                <span className="text-lg font-bold text-white">
                  {withdrawAmount.toFixed(2)}
                </span>

              </div>

              <p className="mt-2 text-xs text-slate-500">
                Automatically calculated at 20 credits = $1
              </p>
            </div>

            {/* =========================
                PAYMENT SYSTEM
            ========================== */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Payment System
              </label>

              <select
                value={paymentSystem}
                onChange={(e) =>
                  setPaymentSystem(
                    e.target.value
                  )
                }
                disabled={
                  !canWithdraw ||
                  submitting
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">
                  Select Payment System
                </option>

                <option value="Bkash">
                  bKash
                </option>

                <option value="Nagad">
                  Nagad
                </option>

                <option value="Rocket">
                  Rocket
                </option>

                <option value="Stripe">
                  Stripe
                </option>

                <option value="Others">
                  Others
                </option>
              </select>
            </div>

            {/* =========================
                ACCOUNT NUMBER
            ========================== */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Account Number
              </label>

              <input
                type="text"
                value={accountNumber}
                onChange={(e) =>
                  setAccountNumber(
                    e.target.value
                  )
                }
                placeholder="Enter your payment account number"
                disabled={
                  !canWithdraw ||
                  submitting
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* =========================
                SUMMARY
            ========================== */}

            {withdrawCredits > 0 && (
              <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">

                <h3 className="mb-4 text-sm font-semibold text-white">
                  Withdrawal Summary
                </h3>

                <div className="space-y-3 text-sm">

                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Credits
                    </span>

                    <span className="font-semibold text-white">
                      {withdrawCredits}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Withdrawal Value
                    </span>

                    <span className="font-semibold text-green-400">
                      $
                      {withdrawAmount.toFixed(
                        2
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Payment System
                    </span>

                    <span className="font-semibold text-white">
                      {paymentSystem ||
                        "Not selected"}
                    </span>
                  </div>

                </div>
              </div>
            )}

            {/* =========================
                BUTTON
            ========================== */}

            {canWithdraw ? (
              <button
                type="submit"
                disabled={
                  submitting ||
                  !validAmount
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-violet-600/10 transition hover:from-violet-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Wallet
                  width={19}
                  height={19}
                />

                {submitting
                  ? "Submitting..."
                  : "Withdraw"}
              </button>
            ) : (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-center">

                <p className="font-semibold text-red-400">
                  Insufficient credit
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  You need at least 200 credits to
                  withdraw.
                </p>

              </div>
            )}

          </form>
        </div>

        {/* ===============================
            BUSINESS LOGIC
        ================================ */}

        <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">

          <div className="flex items-start gap-3">

            <CreditCard
              width={20}
              height={20}
              className="mt-0.5 text-violet-400"
            />

            <div>
              <h3 className="text-sm font-semibold text-white">
                Withdrawal Rate
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Creators receive $1 for every 20 credits
                raised. A minimum of 200 credits is
                required for withdrawal.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}