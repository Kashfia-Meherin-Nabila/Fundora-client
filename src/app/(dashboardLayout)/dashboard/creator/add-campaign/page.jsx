"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import toast from "react-hot-toast";

export default function AddCampaignPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const [formData, setFormData] = useState({
    campaign_title: "",
    campaign_story: "",
    category: "Technology",
    funding_goal: "",
    minimum_contribution: "",
    deadline: "",
    reward_info: "",
    campaign_image_url: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first.");
      return;
    }

    if (user.role !== "Creator") {
      toast.error("Only creators can create campaigns.");
      return;
    }

    setLoading(true);

    try {
      const campaignData = {
        campaign_title: formData.campaign_title,
        campaign_story: formData.campaign_story,
        category: formData.category,
        funding_goal: Number(formData.funding_goal),
        minimum_contribution: Number(formData.minimum_contribution),
        deadline: formData.deadline,
        reward_info: formData.reward_info,
        campaign_image_url: formData.campaign_image_url,

        // User information from Better Auth session
        creator_email: user.email,
        creator_name: user.name,

        // New campaign starts as pending
        status: "pending",

        // Initially nothing has been raised
        raised_amount: 0,
      };

      console.log("Sending campaign:", campaignData);

      const response = await fetch("http://localhost:5000/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campaignData),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Campaign creation error:", result);

        throw new Error(
          result.message || "Failed to create campaign."
        );
      }

      toast.success("Campaign submitted successfully!");

      setFormData({
        campaign_title: "",
        campaign_story: "",
        category: "Technology",
        funding_goal: "",
        minimum_contribution: "",
        deadline: "",
        reward_info: "",
        campaign_image_url: "",
      });

      router.push("/dashboard/creator/my-campaigns");
    } catch (error) {
      console.error("Campaign creation error:", error);
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">
            Please login first
          </h2>

          <button
            onClick={() => router.push("/login")}
            className="mt-4 rounded-xl bg-violet-600 px-5 py-3 text-white"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 lg:p-10">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-violet-400">
            Creator Dashboard
          </p>

          <h1 className="text-3xl font-bold text-white">
            Add New Campaign
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Create your campaign and submit it for admin approval.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl lg:p-8"
        >

          {/* Campaign Title */}
          <div className="mb-5">
            <label
              htmlFor="campaign_title"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Campaign Title
            </label>

            <input
              id="campaign_title"
              name="campaign_title"
              type="text"
              value={formData.campaign_title}
              onChange={handleChange}
              placeholder="Help us build a solar-powered water pump"
              required
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          {/* Campaign Story */}
          <div className="mb-5">
            <label
              htmlFor="campaign_story"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Campaign Story
            </label>

            <textarea
              id="campaign_story"
              name="campaign_story"
              value={formData.campaign_story}
              onChange={handleChange}
              placeholder="Tell supporters about your campaign..."
              rows={6}
              required
              className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          {/* Category */}
          <div className="mb-5">
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Category
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            >
              <option value="Technology">Technology</option>
              <option value="Art">Art</option>
              <option value="Community">Community</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Environment">Environment</option>
              <option value="Business">Business</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Funding + Minimum Contribution */}
          <div className="mb-5 grid gap-5 md:grid-cols-2">

            <div>
              <label
                htmlFor="funding_goal"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Funding Goal (Credits)
              </label>

              <input
                id="funding_goal"
                name="funding_goal"
                type="number"
                min="1"
                value={formData.funding_goal}
                onChange={handleChange}
                placeholder="1000"
                required
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="minimum_contribution"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Minimum Contribution (Credits)
              </label>

              <input
                id="minimum_contribution"
                name="minimum_contribution"
                type="number"
                min="1"
                value={formData.minimum_contribution}
                onChange={handleChange}
                placeholder="10"
                required
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

          </div>

          {/* Deadline */}
          <div className="mb-5">
            <label
              htmlFor="deadline"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Deadline
            </label>

            <input
              id="deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          {/* Reward Info */}
          <div className="mb-5">
            <label
              htmlFor="reward_info"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Reward Information
            </label>

            <textarea
              id="reward_info"
              name="reward_info"
              value={formData.reward_info}
              onChange={handleChange}
              placeholder="What will supporters receive?"
              rows={4}
              required
              className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          {/* Campaign Image URL */}
          <div className="mb-6">
            <label
              htmlFor="campaign_image_url"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Campaign Image URL
            </label>

            <input
              id="campaign_image_url"
              name="campaign_image_url"
              type="url"
              value={formData.campaign_image_url}
              onChange={handleChange}
              placeholder="https://example.com/campaign.jpg"
              required
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />

            <p className="mt-2 text-xs text-slate-500">
              Add a public image URL for your campaign cover.
            </p>
          </div>

          {/* Creator Information */}
          <div className="mb-6 rounded-xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Campaign Creator
            </p>

            <p className="mt-1 font-medium text-white">
              {user.name}
            </p>

            <p className="text-sm text-slate-500">
              {user.email}
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:from-violet-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Submitting Campaign..." : "Add Campaign"}
          </button>

          <p className="mt-3 text-center text-xs text-slate-500">
            Your campaign will be submitted as{" "}
            <span className="font-semibold text-violet-400">
              pending
            </span>{" "}
            until approved by an admin.
          </p>

        </form>
      </div>
    </main>
  );
}